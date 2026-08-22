'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import {
  ChevronDown,
  ArrowLeft,
  Search,
  MoreVertical,
  AlertCircle,
  RefreshCw,
  Info,
  Trash2,
  Paperclip,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageItem } from './MessageItem'
import { MessageInput } from './MessageInput'
import { GroupInfoPanel } from './GroupInfoPanel'
import { EmptyState } from './EmptyState'
import { Avatar } from '@/components/ui/Avatar'
import { Spinner } from '@/components/ui/Spinner'
import { SkeletonMessageList } from '@/components/ui/SkeletonLoader'
import { api } from '@/lib/api'
import { useAuthStore, useChatStore } from '@/lib/store'
import { generateTempId } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import type { Conversation, Message, GroupConversation, DirectConversation } from '@/lib/types'

interface ChatWindowProps {
  conversation: Conversation | null
  onBack?: () => void
  onConversationLeft?: () => void
}

export function ChatWindow({ conversation, onBack, onConversationLeft }: ChatWindowProps) {
  const currentUser = useAuthStore((s) => s.user)
  const {
    messages,
    hasMore,
    isLoadingMessages,
    messagesError,
    addMessage,
    updateMessage,
    setMessages,
    prependMessages,
    setLoadingMessages,
    setMessagesError,
    updateLastMessage,
    deleteConversation,
  } = useChatStore()
  const { showToast } = useToast()

  const [isGroupPanelOpen, setIsGroupPanelOpen] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [newMessageCount, setNewMessageCount] = useState(0)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomSentinelRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const prevConvIdRef = useRef<string | null>(null)

  const convId = conversation?._id ?? null
  const convMessages = convId ? (messages[convId] ?? []) : []
  const convHasMore = convId ? (hasMore[convId] ?? false) : false

  const getConvTitle = () => {
    if (!conversation) return ''
    if (conversation.type === 'group') return (conversation as GroupConversation).name
    return (conversation as DirectConversation).participant?.name ?? 'Unknown'
  }

  const getParticipantCount = () => {
    if (!conversation) return null
    if (conversation.type === 'group') return `${(conversation as GroupConversation).participants.length} members`
    return 'Online'
  }

  const getAvatarName = () => {
    if (!conversation) return ''
    if (conversation.type === 'group') return (conversation as GroupConversation).name
    return (conversation as DirectConversation).participant?.name ?? '?'
  }

  useEffect(() => {
    const sentinel = bottomSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isAtBottomRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          setNewMessageCount(0)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [convId])

  const scrollToBottom = useCallback((smooth = false) => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    })
  }, [])

  useEffect(() => {
    if (!convId) return

    if (prevConvIdRef.current !== convId) {
      prevConvIdRef.current = convId
      setNewMessageCount(0)
      isAtBottomRef.current = true

      if (!messages[convId]) {
        setLoadingMessages(true)
        api.getMessages(convId, 30)
          .then(({ messages: msgs, hasMore: more }) => {
            setMessages(convId, msgs, more)
            setTimeout(() => scrollToBottom(false), 50)
          })
          .catch((err) => {
            setMessagesError(err?.message ?? 'Failed to load messages')
          })
      } else {
        setTimeout(() => scrollToBottom(false), 50)
      }
    }
  }, [convId, messages, setLoadingMessages, setMessages, setMessagesError, scrollToBottom])

  useEffect(() => {
    if (!convMessages.length) return
    const last = convMessages[convMessages.length - 1]
    const isMyMessage = last?.sender === currentUser?._id
    if (isAtBottomRef.current || isMyMessage) {
      setTimeout(() => scrollToBottom(true), 50)
    } else {
      if (last?.status !== 'sending' && last?.sender !== currentUser?._id) {
        setNewMessageCount((c) => c + 1)
      }
    }
  }, [convMessages.length])

  const handleLoadMore = async () => {
    if (!convId || isLoadingMore || !convHasMore) return
    const oldest = convMessages[0]
    if (!oldest) return
    setIsLoadingMore(true)
    try {
      const { messages: older, hasMore: more } = await api.getMessages(convId, 30, oldest._id)
      const scrollContainer = scrollContainerRef.current
      const prevScrollHeight = scrollContainer?.scrollHeight ?? 0
      prependMessages(convId, older, more)
      requestAnimationFrame(() => {
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight - prevScrollHeight
        }
      })
    } catch {
      showToast('Failed to load earlier messages')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleSend = async (text: string) => {
    if (!convId || !currentUser) return
    const tempId = generateTempId()
    const optimisticMessage: Message = {
      _id: tempId,
      conversation: convId,
      sender: currentUser._id,
      text,
      createdAt: new Date().toISOString(),
      status: 'sending',
      tempId,
    }

    addMessage(convId, optimisticMessage)
    updateLastMessage(convId, text, currentUser._id)

    try {
      const sent = await api.sendMessage({ conversationId: convId, text })
      updateMessage(convId, tempId, { ...sent, status: 'sent' })
    } catch (err: unknown) {
      const e = err as { message?: string }
      updateMessage(convId, tempId, { ...optimisticMessage, status: 'error' })
      showToast(e?.message ?? 'Failed to send message')
    }
  }

  const handleRetry = async (message: Message) => {
    if (!convId || !message.tempId) return
    updateMessage(convId, message.tempId, { ...message, status: 'sending' })
    try {
      const sent = await api.sendMessage({ conversationId: convId, text: message.text })
      updateMessage(convId, message.tempId, { ...sent, status: 'sent' })
    } catch {
      updateMessage(convId, message.tempId!, { ...message, status: 'error' })
      showToast('Retry failed')
    }
  }

  const handleDeleteConv = async () => {
    if (!convId) return
    try {
      await api.deleteConversation(convId)
    } catch {
      // Gracefully handle if API returns 404 or non-JSON
    } finally {
      deleteConversation(convId)
      showToast('Conversation deleted', 'success')
      onConversationLeft?.()
    }
  }


  const getSender = (senderId: string) => {
    if (!conversation || conversation.type !== 'group') return undefined
    return (conversation as GroupConversation).participants.find((p) => p._id === senderId)
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white font-['DM_Sans',sans-serif]">
        <EmptyState type="no-conversation" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white relative overflow-hidden h-full font-['DM_Sans',sans-serif]">
      
      {/* Active Conversation Header Bar Matching Dribbble Reference */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0 select-none z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              id="chat-back-btn"
              onClick={onBack}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <Avatar name={getAvatarName()} size="md" className="ring-2 ring-slate-100" />
          
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black text-slate-900 truncate">{getConvTitle()}</h2>
            <div className="text-[11px] text-blue-600 font-bold flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{getParticipantCount()}</span>
            </div>
          </div>
        </div>

        {/* Right Header Action Icons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => showToast('Attach file / document')}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors border border-slate-200/60"
            title="Attach file"
          >
            <Paperclip size={16} />
          </button>

          {conversation.type === 'group' ? (
            <button
              id="group-info-btn"
              onClick={() => setIsGroupPanelOpen(true)}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors border border-slate-200/60"
              title="Group settings"
            >
              <Info size={16} />
            </button>
          ) : (
            <button
              id="delete-conv-btn"
              onClick={handleDeleteConv}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors border border-slate-200/60"
              title="Delete chat"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Message Feed Area with #6D9EEE Background */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-[#6D9EEE]/15 relative"
        id="message-list"
      >

        {convHasMore && (
          <div className="flex justify-center mb-4">
            <button
              id="load-more-messages-btn"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors border border-slate-200/80"
            >
              {isLoadingMore ? <Spinner size="sm" /> : <RefreshCw size={12} />}
              Load earlier messages
            </button>
          </div>
        )}

        {isLoadingMessages && <SkeletonMessageList />}

        {messagesError && !isLoadingMessages && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <AlertCircle size={32} className="text-red-500" />
            <p className="text-xs text-slate-500 font-bold">{messagesError}</p>
            <button
              onClick={() => {
                if (!convId) return
                setLoadingMessages(true)
                api.getMessages(convId, 30)
                  .then(({ messages: msgs, hasMore: more }) => setMessages(convId, msgs, more))
                  .catch((e) => setMessagesError(e?.message ?? 'Failed to load messages'))
              }}
              className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-md transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoadingMessages && !messagesError && convMessages.length === 0 && (
          <EmptyState type="no-messages" />
        )}

        {!isLoadingMessages && !messagesError && (
          <div className="space-y-3">
            {convMessages.map((message, idx) => (
              <MessageItem
                key={message._id || message.tempId || `msg_${idx}`}
                message={message}
                isMine={message.sender === currentUser?._id}
                sender={getSender(message.sender)}
                isGroup={conversation.type === 'group'}
                onRetry={handleRetry}
              />
            ))}
          </div>
        )}

        <div ref={bottomSentinelRef} className="h-1" aria-hidden="true" />
      </div>

      {/* New messages button */}
      <AnimatePresence>
        {newMessageCount > 0 && (
          <motion.button
            id="scroll-to-bottom-btn"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => {
              scrollToBottom(true)
              setNewMessageCount(0)
            }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-blue-600 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-xl transition-all"
          >
            <ChevronDown size={14} />
            {newMessageCount} new message{newMessageCount > 1 ? 's' : ''}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message input */}
      <MessageInput
        conversationId={convId ?? ''}
        onSend={handleSend}
        disabled={!convId}
      />

      {/* Group info panel */}
      {conversation.type === 'group' && (
        <GroupInfoPanel
          conversation={conversation as GroupConversation}
          isOpen={isGroupPanelOpen}
          onClose={() => setIsGroupPanelOpen(false)}
          onLeft={() => {
            setIsGroupPanelOpen(false)
            onConversationLeft?.()
          }}
        />
      )}
    </div>
  )
}
