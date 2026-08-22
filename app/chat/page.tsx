'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { NavRail } from '@/components/chat/NavRail'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { HomeTab } from '@/components/chat/tabs/HomeTab'
import { ContactsTab } from '@/components/chat/tabs/ContactsTab'
import { NotificationsTab } from '@/components/chat/tabs/NotificationsTab'
import { CalendarTab } from '@/components/chat/tabs/CalendarTab'
import { SettingsTab } from '@/components/chat/tabs/SettingsTab'
import { NewChatModal } from '@/components/chat/NewChatModal'
import { api } from '@/lib/api'
import { useAuthStore, useChatStore } from '@/lib/store'
import { getSocket, disconnectSocket, onMessageNew, onConversationUpdated } from '@/lib/socket'

export default function ChatPage() {
  const router = useRouter()
  const { token, logout } = useAuthStore()
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    addMessage,
    updateConversation,
    setConversations,
    updateLastMessage,
    restoreConversation,
  } = useChatStore()

  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'chat' | 'home' | 'contact' | 'notifications' | 'calendar' | 'settings'>('chat')
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)

  // Auth guard with stored token fallback
  useEffect(() => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('chat_token') : null)

    if (!activeToken) {
      router.replace('/login')
      return
    }

    api.getMe()
      .then((user) => {
        useAuthStore.setState({ user, token: activeToken })
        setIsAuthChecking(false)
      })
      .catch(() => {
        logout()
        router.replace('/login')
      })
  }, [token, router, logout])


  // Socket.io real-time connection
  useEffect(() => {
    if (!token || isAuthChecking) return

    getSocket(token)

    const unsubMessage = onMessageNew((message) => {
      addMessage(message.conversation, { ...message, status: 'sent' })
      updateLastMessage(message.conversation, message.text, message.sender)
    })

    const unsubConversation = onConversationUpdated((conv) => {
      updateConversation(conv)
    })

    return () => {
      unsubMessage()
      unsubConversation()
      disconnectSocket()
    }
  }, [token, isAuthChecking, addMessage, updateConversation, updateLastMessage])

  const activeConversation = conversations.find((c) => c._id === activeConversationId) ?? null

  const handleConversationSelect = useCallback((id: string) => {
    setActiveConversation(id)
    setIsMobileSidebarOpen(false)
  }, [setActiveConversation])

  const handleBack = useCallback(() => {
    setIsMobileSidebarOpen(true)
    setActiveConversation(null)
  }, [setActiveConversation])

  const handleConversationLeft = useCallback(() => {
    setActiveConversation(null)
    setIsMobileSidebarOpen(true)
    api.getConversations().then(setConversations).catch(() => {})
  }, [setActiveConversation, setConversations])

  const handleStartChatFromDirectory = async (userId: string) => {
    try {
      const conv = await api.startDirectConversation(userId)
      restoreConversation(conv._id)
      setActiveConversation(conv._id)
      setActiveTab('chat')
      setIsMobileSidebarOpen(false)
    } catch {
      setActiveTab('chat')
    }
  }

  if (isAuthChecking) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center font-['DM_Sans',sans-serif]">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-white shadow-2xl border border-slate-200/80">
          <div className="w-10 h-10 rounded-full border-3 border-blue-600/20 border-t-blue-600 animate-spin" />
          <p className="text-slate-700 text-xs font-black tracking-wide">Connecting to NexusChat Engine...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-white font-['DM_Sans',sans-serif] text-slate-900 selection:bg-blue-600 selection:text-white flex overflow-hidden">
      
      {/* Panel 1: Far Left NavRail */}
      <div className="hidden lg:flex flex-shrink-0 h-full">
        <NavRail
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as typeof activeTab)}
        />
      </div>

      {/* Main View Area Based on Active Tab */}
      {activeTab === 'home' && (
        <HomeTab
          onNavigate={(t) => setActiveTab(t as typeof activeTab)}
          onNewChat={() => setIsNewChatOpen(true)}
        />
      )}

      {activeTab === 'contact' && (
        <ContactsTab onStartChat={handleStartChatFromDirectory} />
      )}

      {activeTab === 'notifications' && (
        <NotificationsTab />
      )}

      {activeTab === 'calendar' && (
        <CalendarTab />
      )}

      {activeTab === 'settings' && (
        <SettingsTab />
      )}

      {/* Panel 2 & 3: Active Chat Messaging View */}
      {activeTab === 'chat' && (
        <>
          {/* Middle Chat Sidebar */}
          <div
            className={`
              ${isMobileSidebarOpen ? 'flex' : 'hidden'}
              md:flex
              w-full md:w-[350px] lg:w-[390px] xl:w-[430px]
              flex-shrink-0
              h-full
              z-10 md:z-auto
            `}
          >
            <ChatSidebar
              onConversationSelect={handleConversationSelect}
              activeId={activeConversationId}
            />
          </div>

          {/* Main Active Chat Window Feed */}
          <div
            className={`
              ${!isMobileSidebarOpen ? 'flex' : 'hidden'}
              md:flex
              flex-1
              min-w-0
              h-full
            `}
          >
            <ChatWindow
              conversation={activeConversation}
              onBack={handleBack}
              onConversationLeft={handleConversationLeft}
            />
          </div>
        </>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onConversationStarted={(convId) => {
          restoreConversation(convId)
          setActiveConversation(convId)
          setActiveTab('chat')
        }}
      />

    </div>
  )
}
