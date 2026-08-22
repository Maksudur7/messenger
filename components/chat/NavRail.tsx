'use client'

import { useState } from 'react'
import {
  LayoutGrid,
  MessageSquare,
  Users,
  Bell,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore, useChatStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface NavRailProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  unreadChatsCount?: number
}

export function NavRail({
  activeTab = 'chat',
  onTabChange,
  unreadChatsCount,
}: NavRailProps) {
  const currentUser = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const conversations = useChatStore((s) => s.conversations)

  const readConversations = useChatStore((s) => s.readConversations)
  const activeConversationId = useChatStore((s) => s.activeConversationId)
  const [currentTab, setCurrentTab] = useState(activeTab)

  const dynamicUnreadCount = conversations.filter((c) => {
    if (!c.lastMessage?.text) return false
    const isMine = c.lastMessage.sender === currentUser?._id
    if (isMine || c._id === activeConversationId) return false
    const lastReadTime = readConversations[c._id] || 0
    const lastMsgTime = new Date(c.lastMessage.createdAt || c.updatedAt || 0).getTime()
    return lastMsgTime > lastReadTime
  }).length

  const computedUnreadChats = unreadChatsCount !== undefined ? unreadChatsCount : dynamicUnreadCount


  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const navItems = [
    { id: 'home', label: 'HOME', icon: LayoutGrid },
    { id: 'chat', label: 'CHAT', icon: MessageSquare, badge: computedUnreadChats > 0 ? computedUnreadChats : null },
    { id: 'contact', label: 'CONTACT', icon: Users },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell },
    { id: 'calendar', label: 'CALENDAR', icon: Calendar },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ]

  return (
    <aside className="w-[200px] xl:w-[220px] bg-white border-r border-slate-100 flex flex-col justify-between p-6 select-none z-20 h-full font-['DM_Sans',sans-serif]">
      
      {/* Top User Profile Header (Matching Reference Image: Henry Jabbawockiez v) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <Avatar name={currentUser?.name || 'User'} size="md" className="ring-2 ring-blue-500/20" />
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1">
              <span className="truncate">{currentUser?.name || 'User Name'}</span>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
            </div>
            <div className="text-[10px] text-slate-400 font-bold truncate">Online</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-extrabold tracking-wider transition-all relative group',
                  isActive
                    ? 'text-blue-600 font-black'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                )}
              >
                {/* Blue Left Active Indicator Pill */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" />
                )}

                <Icon size={17} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span>{item.label}</span>

                {/* Unread Counter Badge */}
                {item.badge !== null && item.badge !== undefined && (
                  <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black tracking-wider text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all group"
        >
          <LogOut size={17} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
          <span>LOG OUT</span>
        </button>
      </div>

    </aside>
  )
}
