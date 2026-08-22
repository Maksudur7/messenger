'use client'

import {
  MessageSquare,
  UserPlus,
  Lock,
  Zap,
  ShieldCheck,
  Users,
  Plus,
  MessageSquareDashed,
} from 'lucide-react'

interface EmptyStateProps {
  type: 'no-conversation' | 'no-messages' | 'no-search-results' | 'no-conversations-list'
  message?: string
  onAction?: () => void
  actionLabel?: string
}

export function EmptyState({ type, message, onAction, actionLabel }: EmptyStateProps) {
  if (type === 'no-conversation') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-[#6D9EEE]/15 p-6 md:p-10 text-center select-none overflow-y-auto font-['DM_Sans',sans-serif] relative">
        
        {/* Soft Ambient Radial Glow with #6D9EEE */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#6D9EEE]/25 blur-3xl pointer-events-none" />

        {/* Pure White Hero Box (Max 16px Rounded) */}
        <div className="relative bg-white border border-[#6D9EEE]/30 rounded-2xl p-8 md:p-10 max-w-lg w-full shadow-xl shadow-[#6D9EEE]/20 flex flex-col items-center z-10 text-slate-900 transition-all">
          
          {/* Top Icon Badge in #6D9EEE */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6D9EEE] to-blue-600 flex items-center justify-center text-white shadow-xl shadow-[#6D9EEE]/35">
              <MessageSquare size={30} strokeWidth={2.2} />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D9EEE] opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#6D9EEE] border-2 border-white" />
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#6D9EEE]/15 text-blue-700 text-[11px] font-black tracking-wide border border-[#6D9EEE]/30">
              WhatChat Workspace Engine
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Select or Start a Conversation
            </h2>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
              Choose an active chat from the sidebar or click below to launch a new direct message with your team.
            </p>
          </div>

          {/* Action Button (#6D9EEE) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full mb-8">
            <button
              onClick={onAction}
              className="w-full flex-1 py-3 px-6 rounded-xl bg-[#6D9EEE] hover:bg-blue-600 text-white font-extrabold text-xs shadow-lg shadow-[#6D9EEE]/35 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>{actionLabel || 'Start New Chat'}</span>
            </button>
          </div>

          {/* Feature Highlights Grid (#BCD3F7 Card Background) */}
          <div className="grid grid-cols-3 gap-3 w-full border-t border-slate-100 pt-6">
            <div className="p-3 rounded-xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 text-center space-y-1">
              <Zap size={16} className="text-blue-600 mx-auto" />
              <div className="text-[11px] font-black text-slate-800">WebSocket</div>
              <div className="text-[9px] font-bold text-slate-500">Instant Sync</div>
            </div>

            <div className="p-3 rounded-xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 text-center space-y-1">
              <Lock size={16} className="text-blue-600 mx-auto" />
              <div className="text-[11px] font-black text-slate-800">Encrypted</div>
              <div className="text-[9px] font-bold text-slate-500">JWT Auth</div>
            </div>

            <div className="p-3 rounded-xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 text-center space-y-1">
              <Users size={16} className="text-blue-600 mx-auto" />
              <div className="text-[11px] font-black text-slate-800">Channels</div>
              <div className="text-[9px] font-bold text-slate-500">Group Rooms</div>
            </div>
          </div>

        </div>

        {/* Security Footer Note */}
        <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-slate-500 z-10">
          <ShieldCheck size={14} className="text-blue-600" />
          <span>End-to-end encrypted real-time communication</span>
        </div>

      </div>
    )
  }

  const configs = {
    'no-messages': {
      icon: <MessageSquareDashed size={40} className="text-blue-600" />,
      title: 'No messages in this chat',
      subtitle: 'Type a message below to start the conversation!',
    },
    'no-search-results': {
      icon: <UserPlus size={40} className="text-blue-600" />,
      title: 'No contacts found',
      subtitle: message ?? 'Try searching with another name or phone number.',
    },
    'no-conversations-list': {
      icon: <Users size={40} className="text-blue-600" />,
      title: 'No active chats',
      subtitle: 'Click "+ Create New Chat" above to start your first conversation.',
    },
  }

  const { icon, title, subtitle } = configs[type]

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center font-['DM_Sans',sans-serif] bg-[#6D9EEE]/15 text-slate-900">
      <div className="p-4 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 mb-1">
        {icon}
      </div>
      <div>
        <p className="text-slate-900 font-black text-sm">{title}</p>
        <p className="text-slate-500 text-xs font-medium mt-1 max-w-xs">{subtitle}</p>
      </div>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D9EEE] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md shadow-[#6D9EEE]/30 transition-all active:scale-95"
        >
          <Plus size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
