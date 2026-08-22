'use client'

import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Users,
  Bell,
  Calendar as CalendarIcon,
  Settings,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Plus,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore, useChatStore } from '@/lib/store'

interface HomeTabProps {
  onNavigate: (tab: string) => void
  onNewChat: () => void
}

export function HomeTab({ onNavigate, onNewChat }: HomeTabProps) {
  const router = useRouter()
  const currentUser = useAuthStore((s) => s.user)
  const conversations = useChatStore((s) => s.conversations)
  const readConversations = useChatStore((s) => s.readConversations)

  const totalUnread = conversations.filter((c) => {
    if (!c.lastMessage?.text) return false
    const isMine = c.lastMessage.sender === currentUser?._id
    if (isMine) return false
    const lastRead = readConversations[c._id] || 0
    const lastMsgTime = new Date(c.lastMessage.createdAt || c.updatedAt || 0).getTime()
    return lastMsgTime > lastRead
  }).length

  const stats = [
    { label: 'Active Conversations', value: conversations.length, change: '100% Live Sync', icon: MessageSquare },
    { label: 'Unread Messages', value: totalUnread, change: totalUnread > 0 ? 'Pending' : 'All Clear', icon: Bell },
    { label: 'Group Channels', value: conversations.filter((c) => c.type === 'group').length, change: 'Multi-user', icon: Users },
    { label: 'Socket Connection', value: 'Connected', change: 'Latency < 10ms', icon: Activity },
  ]

  return (
    <div className="flex-1 bg-[#6D9EEE]/15 p-5 md:p-8 overflow-y-auto font-['DM_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Brand Royal Blue Hero Banner Card (Max 16px Rounded) */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#6D9EEE] to-blue-600 p-6 md:p-8 text-white shadow-xl shadow-[#6D9EEE]/20 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#6D9EEE]/40">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px)] bg-[size:4rem_100%] opacity-40 pointer-events-none" />

          <div className="space-y-2.5 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/15 border border-white/25 text-white text-xs font-black tracking-wide backdrop-blur-sm">
              Workspace Overview
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Welcome back, {currentUser?.name || 'User'}! 👋
            </h1>
            <p className="text-blue-50 text-xs md:text-sm font-medium leading-relaxed">
              Your real-time messaging hub is active and connected. Manage team channels, launch direct messages, and review workspace activity.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 flex-shrink-0">
            <button
              onClick={() => onNavigate('chat')}
              className="px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-black text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Open Chat Feed</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            >
              Landing Page
            </button>
          </div>
        </div>

        {/* Stat Cards Grid (#BCD3F7 Card Background) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 shadow-sm hover:shadow-md hover:border-[#6D9EEE]/60 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white text-[#6D9EEE] shadow-sm">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-blue-700 bg-white/80 px-2 py-0.5 rounded-md uppercase tracking-wider">{stat.change}</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-600 mt-0.5">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions & Activity List (#BCD3F7 Card Background) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions Panel */}
          <div className="p-6 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <Zap size={16} className="text-blue-600" /> Quick Actions
            </h2>
            
            <div className="space-y-2.5">
              <button
                onClick={onNewChat}
                className="w-full p-3.5 rounded-xl bg-[#6D9EEE] hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-between transition-all shadow-md shadow-[#6D9EEE]/30 active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <Plus size={16} />
                  <span>Start New Direct Message</span>
                </div>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full p-3.5 rounded-xl bg-white hover:bg-blue-50 text-slate-800 font-extrabold text-xs flex items-center justify-between transition-colors group border border-[#6D9EEE]/30"
              >
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-[#6D9EEE]" />
                  <span>Browse Contacts Directory</span>
                </div>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('calendar')}
                className="w-full p-3.5 rounded-xl bg-white hover:bg-blue-50 text-slate-800 font-extrabold text-xs flex items-center justify-between transition-colors group border border-[#6D9EEE]/30"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarIcon size={16} className="text-[#6D9EEE]" />
                  <span>View Schedules & Meetings</span>
                </div>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <MessageSquare size={16} className="text-blue-600" /> Recent Channels
              </h2>
              <button
                onClick={() => onNavigate('chat')}
                className="text-xs font-black text-blue-700 hover:underline"
              >
                View Full Feed →
              </button>
            </div>

            <div className="space-y-2.5">
              {conversations.slice(0, 4).map((conv) => {
                const title = conv.type === 'group' ? conv.name : (conv.participant?.name || 'Contact')
                const subtitle = conv.lastMessage?.text || 'No messages yet'

                return (
                  <div
                    key={conv._id}
                    onClick={() => onNavigate('chat')}
                    className="p-3.5 rounded-xl bg-white hover:bg-blue-50 border border-[#6D9EEE]/30 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={title} size="md" className="ring-2 ring-[#BCD3F7]" />
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {title}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 truncate max-w-xs">
                          {subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-blue-600 group-hover:translate-x-0.5 transition-transform">Open →</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
