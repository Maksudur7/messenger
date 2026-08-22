'use client'

import { useState } from 'react'
import { Bell, CheckCheck, Trash2, Shield, MessageSquare, Zap, Info } from 'lucide-react'
import { useAuthStore, useChatStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

export function NotificationsTab() {
  const currentUser = useAuthStore((s) => s.user)
  const { showToast } = useToast()

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Welcome to WhatChat Engine',
      message: `Your account (${currentUser?.phone}) is registered and secured with WebSocket real-time messaging.`,
      time: 'Just now',
      type: 'system',
      read: false,
    },
    {
      id: '2',
      title: 'WebSocket Connection Active',
      message: 'Real-time Socket.io engine connected smoothly to staging server.',
      time: '5m ago',
      type: 'connection',
      read: false,
    },
    {
      id: '3',
      title: 'Security Alert: Auto Registration',
      message: 'Your phone login automatically generated JWT bearer tokens.',
      time: '1h ago',
      type: 'security',
      read: true,
    },
  ])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    showToast('All notifications marked as read', 'success')
  }

  const clearAll = () => {
    setNotifications([])
    showToast('Notifications cleared', 'success')
  }

  return (
    <div className="flex-1 bg-[#6D9EEE]/15 p-5 md:p-8 overflow-y-auto font-['DM_Sans',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header (#BCD3F7 Card Background) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#BCD3F7]/40 p-6 rounded-2xl border border-[#6D9EEE]/30 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <Bell size={22} className="text-blue-600" /> Notifications Feed
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Review live alerts, system events, and chat notifications in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="px-3.5 py-2 rounded-xl bg-[#6D9EEE] hover:bg-blue-600 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#6D9EEE]/30"
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-extrabold text-xs transition-colors flex items-center gap-1.5 border border-[#6D9EEE]/30"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notifications List (#BCD3F7 Card Background) */}
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-[#BCD3F7]/40 rounded-2xl border border-[#6D9EEE]/30">
            <Bell size={36} className="text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-black text-slate-900">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  n.read
                    ? 'bg-[#BCD3F7]/30 border-[#6D9EEE]/30 shadow-sm'
                    : 'bg-[#BCD3F7]/60 border-[#6D9EEE]/50 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#6D9EEE] text-white mt-0.5 shadow-md shadow-[#6D9EEE]/30">
                    {n.type === 'system' ? <Info size={17} /> : n.type === 'security' ? <Shield size={17} /> : <Zap size={17} />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">{n.title}</h4>
                    <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] font-extrabold text-blue-700 mt-2 block">{n.time}</span>
                  </div>
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse flex-shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
