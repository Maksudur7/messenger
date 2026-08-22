'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  X,
  Users,
  Plus,
  Pin,
  CheckCheck,
  ChevronDown,
  MessageSquare,
  Trash2,
} from 'lucide-react'
import { format, parseISO, isToday, isYesterday } from 'date-fns'
import { motion, AnimatePresence } from 'motion/react'
import { NewChatModal } from './NewChatModal'
import { NewGroupModal } from './NewGroupModal'
import { EmptyState } from './EmptyState'
import { Avatar } from '@/components/ui/Avatar'
import { SkeletonConversation } from '@/components/ui/SkeletonLoader'
import { useToast } from '@/components/ui/Toast'
import { api } from '@/lib/api'
import { useAuthStore, useChatStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Conversation, GroupConversation, DirectConversation } from '@/lib/types'


interface ChatSidebarProps {
  onConversationSelect: (id: string) => void
  activeId: string | null
}

function formatWhatsAppTime(iso?: string): string {
  if (!iso) return ''
  try {
    const date = parseISO(iso)
    if (isToday(date)) return format(date, 'h:mm a')
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'd/M/yyyy')
  } catch {
    return ''
  }
}

function getConvTitle(conv: Conversation, currentUserId: string): string {
  if (conv.type === 'group') return (conv as GroupConversation).name
  return (conv as DirectConversation).participant?.name ?? 'Unknown'
}

function getConvSubtitle(conv: Conversation, currentUserId: string): string {
  const lm = conv.lastMessage
  if (!lm?.text) return 'No messages yet'
  const isMine = lm.sender === currentUserId
  if (conv.type === 'group' && !isMine) {
    return `~${lm.senderName || 'Member'}: ${lm.text}`
  }
  return lm.text
}

function getConvAvatar(conv: Conversation): string {
  if (conv.type === 'group') return (conv as GroupConversation).name
  return (conv as DirectConversation).participant?.name ?? '?'
}

export function ChatSidebar({ onConversationSelect, activeId }: ChatSidebarProps) {
  const currentUser = useAuthStore((s) => s.user)
  const { showToast } = useToast()
  const {
    conversations,
    isLoadingConversations,
    conversationsError,
    setConversations,
    setLoadingConversations,
    setConversationsError,
    prependConversation,
    readConversations,
    deleteConversation,
    setActiveConversation,
  } = useChatStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'favourites' | 'groups'>('all')

  // Initial load
  useEffect(() => {
    setLoadingConversations(true)
    api.getConversations()
      .then(setConversations)
      .catch((err) => setConversationsError(err?.message ?? 'Failed to load conversations'))
  }, [setConversations, setLoadingConversations, setConversationsError])

  const handleConversationStarted = (convId: string) => {
    api.getConversations().then(setConversations)
    onConversationSelect(convId)
  }

  const handleGroupCreated = (conv: Conversation) => {
    prependConversation(conv)
    onConversationSelect(conv._id)
  }

  const [pinnedIds, setPinnedIds] = useState<string[]>([])

  const togglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleDeleteConvItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await api.deleteConversation(id)
    } catch {
      // Graceful local delete
    } finally {
      deleteConversation(id)
      if (activeId === id) {
        setActiveConversation(null)
      }
      showToast('Conversation deleted', 'success')
    }
  }


  const isConvUnread = (c: Conversation) => {
    if (!c.lastMessage?.text) return false
    const isMine = c.lastMessage.sender === currentUser?._id
    if (isMine || c._id === activeId) return false
    const lastReadTime = readConversations[c._id] || 0
    const lastMsgTime = new Date(c.lastMessage.createdAt || c.updatedAt || 0).getTime()
    return lastMsgTime > lastReadTime
  }

  // Dynamic calculation of unread conversations
  const unreadConversations = conversations.filter(isConvUnread)
  const unreadTotal = unreadConversations.length
  const groupCount = conversations.filter((c) => c.type === 'group').length

  // Dynamic filter logic
  const filtered = conversations.filter((c) => {
    if (activeFilter === 'groups' && c.type !== 'group') return false
    if (activeFilter === 'unread' && !isConvUnread(c)) return false
    if (activeFilter === 'favourites' && !pinnedIds.includes(c._id)) return false
    if (searchQuery.trim()) {
      const title = getConvTitle(c, currentUser?._id ?? '').toLowerCase()
      return title.includes(searchQuery.toLowerCase())
    }
    return true
  })
.sort((a, b) => {
    const aPinned = pinnedIds.includes(a._id) ? 1 : 0
    const bPinned = pinnedIds.includes(b._id) ? 1 : 0
    if (bPinned !== aPinned) return bPinned - aPinned

    const timeA = new Date(a.updatedAt || a.lastMessage?.createdAt || 0).getTime()
    const timeB = new Date(b.updatedAt || b.lastMessage?.createdAt || 0).getTime()
    return timeB - timeA
  })


  return (
    <div className="w-full flex flex-col bg-white border-r border-slate-100 h-full select-none font-['DM_Sans',sans-serif]">
      
      {/* Top Header Bar Matching Dribbble Reference */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Chats</span>
          </h1>
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
            <span>Recent Chats</span>
            <ChevronDown size={12} />
          </div>
        </div>

        {/* Primary Action Button (+ Create New Chat) */}
        <button
          id="new-chat-btn"
          onClick={() => setIsNewChatOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 active:scale-95 flex-shrink-0"
        >
          <Plus size={15} strokeWidth={3} />
          <span>Create New Chat</span>
        </button>
      </div>

      {/* Search & Dropdown Filter Row */}
      <div className="p-3.5 border-b border-slate-100 space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Search Input Box */}
          <div className="relative flex-1 flex items-center bg-[#E8F0FC] border border-slate-200/80 rounded-xl px-3 py-2 focus-within:border-blue-500 transition-all">
            <Search size={15} className="text-slate-400 mr-2 flex-shrink-0" />
            <input
              id="conversation-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 ml-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdown Indicator */}
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-600 flex items-center gap-1 cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0">
            <span>Messages</span>
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Filter Chips Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          <button
            id="filter-all-btn"
            onClick={() => setActiveFilter('all')}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-extrabold transition-all flex-shrink-0',
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
            )}
          >
            All
          </button>

          <button
            id="filter-unread-btn"
            onClick={() => setActiveFilter('unread')}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-extrabold transition-all flex-shrink-0 flex items-center gap-1.5',
              activeFilter === 'unread'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
            )}
          >
            Unread
            {unreadTotal > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 rounded-full">
                {unreadTotal}
              </span>
            )}
          </button>

          <button
            id="filter-groups-btn"
            onClick={() => setActiveFilter('groups')}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-extrabold transition-all flex-shrink-0 flex items-center gap-1',
              activeFilter === 'groups'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
            )}
          >
            Groups
            {groupCount > 0 && <span className="text-[11px] opacity-80">{groupCount}</span>}
          </button>

          <button
            onClick={() => setIsNewGroupOpen(true)}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center flex-shrink-0 transition-colors ml-auto"
            title="Create New Group Channel"
          >
            <Users size={14} />
          </button>
        </div>
      </div>

      {/* Chat List (Distinct Floating White Cards with 16px Radius) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {isLoadingConversations && (
          <div className="space-y-2 pt-2">
            {[...Array(4)].map((_, i) => (
              <SkeletonConversation key={i} />
            ))}
          </div>
        )}

        {conversationsError && !isLoadingConversations && (
          <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
            <p className="text-xs text-red-500 font-bold">{conversationsError}</p>
            <button
              onClick={() => {
                setLoadingConversations(true)
                api.getConversations().then(setConversations).catch((e) => setConversationsError(e?.message))
              }}
              className="text-xs text-blue-600 font-extrabold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoadingConversations && !conversationsError && filtered.length === 0 && (
          <EmptyState
            type={searchQuery ? 'no-search-results' : 'no-conversations-list'}
            message={searchQuery ? `No chats found matching "${searchQuery}"` : undefined}
            onAction={() => setIsNewChatOpen(true)}
            actionLabel="Start a new chat"
          />
        )}

        {!isLoadingConversations &&
          !conversationsError &&
          filtered.map((conv) => {
            const isMineLast = conv.lastMessage?.sender === currentUser?._id
            const isUnread = isConvUnread(conv)

            const isPinned = pinnedIds.includes(conv._id)
            const isActive = activeId === conv._id

            return (
              <AnimatePresence key={conv._id}>
                <motion.div
                  id={`conv-${conv._id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => onConversationSelect(conv._id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onConversationSelect(conv._id)}
                  className={cn(
                    'w-full p-3.5 rounded-2xl border transition-all text-left group relative cursor-pointer flex items-start gap-3',
                    isActive
                      ? 'bg-blue-50/90 border-blue-200 shadow-md shadow-blue-500/10'
                      : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-card-bubbly'
                  )}
                >
                  {/* Contact Avatar */}
                  <div className="relative flex-shrink-0">
                    <Avatar name={getConvAvatar(conv)} size="md" className="ring-2 ring-slate-100" />
                    {conv.type === 'group' && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-blue-600 rounded-full p-0.5 border border-white text-white">
                        <Users size={9} />
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={cn('text-xs font-black truncate', isActive ? 'text-blue-900' : 'text-slate-900')}>
                        {getConvTitle(conv, currentUser?._id ?? '')}
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold flex-shrink-0">
                        {formatWhatsAppTime(conv.updatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-1">
                      <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
                        {isMineLast && (
                          <CheckCheck size={13} className="text-blue-600 inline flex-shrink-0" />
                        )}
                        <span className="truncate">{getConvSubtitle(conv, currentUser?._id ?? '')}</span>
                      </p>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Pin Button */}
                        <button
                          onClick={(e) => togglePin(e, conv._id)}
                          className={cn(
                            'p-0.5 rounded transition-opacity',
                            isPinned ? 'text-blue-600 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                          )}
                          title={isPinned ? 'Unpin chat' : 'Pin chat'}
                        >
                          <Pin size={12} className={isPinned ? 'rotate-45 fill-blue-600/20' : ''} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDeleteConvItem(e, conv._id)}
                          className="p-0.5 rounded text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition-all"
                          title="Delete conversation"
                        >
                          <Trash2 size={12} />
                        </button>


                        {/* Unread Counter Badge */}
                        {isUnread && (
                          <span className="bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                            1
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )
          })}
      </div>

      {/* Modals */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onConversationStarted={handleConversationStarted}
      />
      <NewGroupModal
        isOpen={isNewGroupOpen}
        onClose={() => setIsNewGroupOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  )
}
