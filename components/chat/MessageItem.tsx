'use client'

import { format, parseISO } from 'date-fns'
import { RotateCcw, Copy, Check, Pencil, Trash2, X, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import type { Message, User } from '@/lib/types'

interface MessageItemProps {
  message: Message
  isMine: boolean
  sender: User | undefined
  isGroup: boolean
  onRetry?: (message: Message) => void
}

function formatWhatsAppMessageTime(iso: string): string {
  try {
    const date = parseISO(iso)
    return format(date, 'h:mm a')
  } catch {
    return ''
  }
}

export function MessageItem({ message, isMine, sender, isGroup, onRetry }: MessageItemProps) {
  const { editMessage, deleteMessage } = useChatStore()
  const { showToast } = useToast()

  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.text)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard fallback
    }
  }

  const handleSaveEdit = () => {
    if (!editText.trim()) return
    editMessage(message.conversation, message._id || message.tempId!, editText.trim())
    setIsEditing(false)
    showToast('Message updated', 'success')
  }

  const handleDelete = () => {
    deleteMessage(message.conversation, message._id || message.tempId!)
    showToast('Message deleted', 'success')
  }

  const isSending = message.status === 'sending'
  const isError = message.status === 'error'

  return (
    <div
      className={cn(
        "flex flex-col group relative select-text font-['DM_Sans',sans-serif]",
        isMine ? 'items-end' : 'items-start'
      )}
    >

      <div
        className={cn(
          'relative max-w-[85%] sm:max-w-[72%] p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed transition-colors',
          isMine
            ? 'bg-[#6D9EEE] text-white rounded-tr-xs shadow-md shadow-[#6D9EEE]/20'
            : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/80 shadow-sm',
          isSending && 'opacity-70',
          isError && 'bg-red-50 border border-red-200 text-red-700'
        )}

      >
        {/* Sender Name for group chat messages */}
        {isGroup && !isMine && (
          <div className="block mb-1 font-black text-[11px] text-blue-600 select-none leading-tight">
            ~{sender?.name || message.senderName || 'Member'}
          </div>
        )}

        {/* Editing State or Message Content */}
        {isEditing ? (
          <div className="flex flex-col gap-2 py-1 min-w-[220px]">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-white text-slate-900 text-xs rounded-xl p-2.5 outline-none border border-blue-500 shadow-inner resize-none"
              rows={2}
              autoFocus
            />
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                <X size={12} />
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
                className="px-3 py-1 rounded-lg text-xs bg-blue-600 text-white font-black"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="pr-12 pb-1">
            <p className="whitespace-pre-wrap break-words text-xs sm:text-[13px] leading-normal font-medium">
              {message.text}
            </p>
          </div>
        )}

        {/* Inline Timestamp and Status Checkmarks */}
        <div className={cn(
          'absolute bottom-1.5 right-3 flex items-center gap-1 text-[10px] select-none font-bold',
          isMine ? 'text-blue-100' : 'text-slate-400'
        )}>
          <span>{formatWhatsAppMessageTime(message.createdAt)}</span>

          {message.isEdited && <span className="text-[9px] opacity-80">(edited)</span>}

          {isMine && !isSending && !isError && (
            <CheckCheck size={13} className="text-white inline" />
          )}

          {isMine && isSending && (
            <Spinner size="sm" className="w-2.5 h-2.5 border-white/40 border-t-white" />
          )}

          {isMine && isError && (
            <button
              onClick={() => onRetry?.(message)}
              className="flex items-center gap-0.5 text-red-200 hover:underline"
              title="Retry sending"
            >
              <RotateCcw size={10} />
            </button>
          )}
        </div>

        {/* Hover Quick Action Buttons */}
        {!isEditing && (
          <div
            className={cn(
              'absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white rounded-xl px-1.5 py-1 border border-slate-200 shadow-md z-10',
              isMine ? '-left-16' : '-right-16'
            )}
          >
            <button
              onClick={handleCopy}
              className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
              title="Copy"
            >
              {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            </button>
            {isMine && (
              <button
                onClick={() => {
                  setIsEditing(true)
                  setEditText(message.text)
                }}
                className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                title="Edit"
              >
                <Pencil size={12} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
