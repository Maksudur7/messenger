'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Smile, Plus, Mic, Send, Image as ImageIcon, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

interface MessageInputProps {
  conversationId: string
  onSend: (text: string) => Promise<void>
  disabled?: boolean
}

export function MessageInput({ conversationId, onSend, disabled }: MessageInputProps) {
  const draft = useChatStore((s) => s.drafts[conversationId] ?? '')
  const setDraft = useChatStore((s) => s.setDraft)
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      adjustHeight()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = 5 * 24 + 16
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(conversationId, e.target.value)
    adjustHeight()
  }

  const handleSend = async () => {
    const text = draft.trim()
    if (!text || isSending || disabled) return

    setIsSending(true)
    setDraft(conversationId, '')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      await onSend(text)
    } finally {
      setIsSending(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = draft.trim().length > 0 && !isSending && !disabled

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-2 select-none z-10 font-['DM_Sans',sans-serif]">
      
      {/* Left Quick Action Bar Matching Dribbble Reference (+ Image Attachment) */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => showToast('Attach image / photo')}
          className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
          title="Send photo"
        >
          <ImageIcon size={18} />
        </button>

        <button
          onClick={() => showToast('Attach file / document')}
          className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
          title="Attach document"
        >
          <Paperclip size={18} />
        </button>
      </div>

      {/* Message Input Box with #E8F0FC Background */}
      <div className="flex-1 bg-[#E8F0FC] border border-[#BCD3F7] rounded-2xl px-4 py-2 flex items-center min-h-[44px] max-h-[120px] focus-within:bg-[#E8F0FC] focus-within:border-blue-600 transition-all shadow-inner">
        <textarea
          id="message-input"
          ref={textareaRef}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message here..."
          disabled={disabled || isSending}
          rows={1}
          className={cn(
            'w-full bg-transparent text-slate-900 placeholder:text-slate-700 text-xs font-bold resize-none outline-none leading-relaxed py-0 overflow-y-auto',
            (disabled || isSending) && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Message input"
        />


        <button
          onClick={() => showToast('Emoji picker opening...')}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors ml-2 flex-shrink-0"
          title="Emoji"
        >
          <Smile size={18} />
        </button>
      </div>

      {/* Right Send Action Button (Vibrant Blue Round Button) */}
      {canSend ? (
        <button
          id="send-message-btn"
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-blue-500/25 flex-shrink-0"
          title="Send message"
        >
          <Send size={16} className="translate-x-0.5" />
        </button>
      ) : (
        <button
          onClick={() => showToast('Hold to record voice message')}
          className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
          title="Voice message"
        >
          <Mic size={18} />
        </button>
      )}
    </div>
  )
}
