'use client'

import {
  Laptop,
  PhoneCall,
  FileText,
  UserPlus,
  Lock,
  MessageSquareDashed,
  Users,
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
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#111b21] p-6 text-center select-none overflow-y-auto">
        {/* Main Card replicating WhatsApp Web desktop prompt */}
        <div className="bg-[#202c33] rounded-2xl p-8 max-w-md w-full flex flex-col items-center shadow-xl border border-[#222d34]">
          {/* Laptop Graphic Container */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="w-36 h-24 bg-[#111b21] rounded-lg border-2 border-[#8696a0]/30 flex flex-col items-center justify-center p-2 relative shadow-inner">
              {/* Laptop Screen Header */}
              <div className="w-full border-b border-[#222d34] pb-1 mb-1 flex items-center justify-between px-1">
                <div className="w-2 h-2 rounded-full bg-[#00a884]" />
                <div className="w-8 h-1 bg-[#8696a0]/30 rounded-full" />
              </div>
              {/* Green App Display inside Screen */}
              <div className="w-full flex-1 bg-[#00a884] rounded flex items-center justify-center gap-2">
                <PhoneCall size={24} className="text-[#111b21]" />
              </div>
            </div>
            {/* Base of Laptop */}
            <div className="absolute -bottom-2 w-44 h-2.5 bg-[#2a3942] rounded-b-md border-t border-[#8696a0]/40" />
          </div>

          {/* Title & Description */}
          <h2 className="text-xl font-bold text-[#e9edef] mb-2 tracking-tight">
            Download NexusChat for Web
          </h2>
          <p className="text-xs text-[#8696a0] max-w-xs mb-6 leading-relaxed">
            Get extra features like voice and video calling, screen sharing and more.
          </p>

          {/* Download / Action Button */}
          <button
            onClick={onAction}
            className="bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] font-semibold text-xs px-6 py-2.5 rounded-full transition-colors shadow-md active:scale-95"
          >
            {actionLabel || 'Download'}
          </button>
        </div>

        {/* Quick Actions below card */}
        <div className="flex items-center justify-center gap-8 mt-8">
          <button
            onClick={onAction}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#202c33] group-hover:bg-[#2a3942] flex items-center justify-center text-[#8696a0] group-hover:text-[#e9edef] transition-colors">
              <FileText size={20} />
            </div>
            <span className="text-xs text-[#8696a0] group-hover:text-[#e9edef] transition-colors">
              Send document
            </span>
          </button>

          <button
            onClick={onAction}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#202c33] group-hover:bg-[#2a3942] flex items-center justify-center text-[#8696a0] group-hover:text-[#e9edef] transition-colors">
              <UserPlus size={20} />
            </div>
            <span className="text-xs text-[#8696a0] group-hover:text-[#e9edef] transition-colors">
              Add contact
            </span>
          </button>
        </div>

        {/* Security / Encryption Note */}
        <div className="mt-10 flex items-center gap-1.5 text-[11px] text-[#8696a0]">
          <Lock size={12} className="text-[#8696a0]" />
          <span>Your personal messages are end-to-end encrypted</span>
        </div>
      </div>
    )
  }

  const configs = {
    'no-messages': {
      icon: <MessageSquareDashed size={40} className="text-[#8696a0]" />,
      title: 'No messages yet',
      subtitle: 'Send the first message to get the conversation started!',
    },
    'no-search-results': {
      icon: <UserPlus size={40} className="text-[#8696a0]" />,
      title: 'No contacts found',
      subtitle: message ?? 'Try a different name or phone number.',
    },
    'no-conversations-list': {
      icon: <Users size={40} className="text-[#8696a0]" />,
      title: 'No chats yet',
      subtitle: 'Add a new contact by phone number or name to start chatting.',
    },
  }

  const { icon, title, subtitle } = configs[type]

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
      {icon}
      <div>
        <p className="text-[#e9edef] font-semibold text-sm">{title}</p>
        <p className="text-[#8696a0] text-xs mt-1">{subtitle}</p>
      </div>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] text-xs font-semibold transition-colors"
        >
          <UserPlus size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
