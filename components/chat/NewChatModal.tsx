'use client'

import { useState, useCallback } from 'react'
import { Search, X, Loader2, Check, UserPlus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { api } from '@/lib/api'
import { useAuthStore, useChatStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import type { User, DirectConversation } from '@/lib/types'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onConversationStarted: (conversationId: string) => void
}

export function NewChatModal({ isOpen, onClose, onConversationStarted }: NewChatModalProps) {
  const currentUser = useAuthStore((s) => s.user)
  const conversations = useChatStore((s) => s.conversations)
  const restoreConversation = useChatStore((s) => s.restoreConversation)
  const { showToast } = useToast()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState<string | null>(null)
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      setSearchError(null)

      if (debounceRef[0]) clearTimeout(debounceRef[0])

      if (!value.trim()) {
        setResults([])
        return
      }

      debounceRef[0] = setTimeout(async () => {
        setIsSearching(true)
        try {
          const users = await api.searchUsers(value.trim())
          // Filter out self
          setResults(users.filter((u) => u._id !== currentUser?._id))
        } catch {
          setSearchError('Search failed. Please try again.')
          setResults([])
        } finally {
          setIsSearching(false)
        }
      }, 300)
    },
    [currentUser?._id, debounceRef]
  )

  const handleSelectContact = async (user: User) => {
    if (isStarting) return

    // Check if conversation already exists with this user
    const existingConv = conversations.find(
      (c) => c.type === 'direct' && (c as DirectConversation).participant?._id === user._id
    )

    if (existingConv) {
      restoreConversation(existingConv._id)
      showToast(`${user.name} is in your chat list!`, 'success')
      onConversationStarted(existingConv._id)
      handleClose()
      return
    }

    setIsStarting(user._id)
    try {
      const conv = await api.startDirectConversation(user._id)
      restoreConversation(conv._id)
      showToast(`Started conversation with ${user.name}`, 'success')
      onConversationStarted(conv._id)
      handleClose()
    } catch {
      setSearchError('Failed to start conversation.')
    } finally {
      setIsStarting(null)
    }
  }


  const handleClose = () => {
    onClose()
    setQuery('')
    setResults([])
    setSearchError(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Contact / Start Chat" maxWidth="max-w-sm">
      <p className="text-xs text-slate-700 font-medium mb-3 -mt-2">
        Search any user by phone number or name to add them to your messages.
      </p>

      {/* Search input */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10"
        />
        <input
          id="new-chat-search"
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or phone number..."
          autoFocus
          className="w-full bg-[#E8F0FC] border border-slate-300 rounded-xl pl-9 pr-9 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-600 transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 z-10"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}

      </div>

      {/* Results */}
      <div className="max-h-64 overflow-y-auto -mx-5 px-5">
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="text-blue-600 animate-spin" />
          </div>
        )}

        {searchError && (
          <p className="text-sm text-red-600 text-center py-4">{searchError}</p>
        )}

        {!isSearching && !searchError && query && results.length === 0 && (
          <div className="text-center py-8">
            <UserPlus size={32} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-700 font-medium">No user found</p>
            <p className="text-xs text-slate-500 mt-1">Check the phone number or name and try again.</p>
          </div>
        )}

        {!isSearching && results.map((user) => {
          const isAlreadyAdded = !!conversations.find(
            (c) => c.type === 'direct' && (c as DirectConversation).participant?._id === user._id
          )

          return (
            <button
              key={user._id}
              onClick={() => handleSelectContact(user)}
              disabled={isStarting === user._id}
              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-black/5 transition-colors text-left disabled:opacity-60 group"
            >
              <Avatar name={user.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  {isAlreadyAdded && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded flex items-center gap-0.5 flex-shrink-0">
                      <Check size={9} /> Added
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 truncate">{user.phone}</p>
              </div>

              {isStarting === user._id ? (
                <Loader2 size={16} className="text-blue-600 animate-spin flex-shrink-0" />
              ) : isAlreadyAdded ? (
                <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors flex-shrink-0 font-bold">Open</span>
              ) : (
                <span className="text-xs text-blue-700 group-hover:text-blue-800 font-black transition-colors flex-shrink-0">+ Add</span>
              )}
            </button>
          )
        })}

        {!query && (
          <div className="text-center py-8">
            <UserPlus size={32} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-700 font-bold">Add a Contact</p>
            <p className="text-xs text-slate-500 mt-1">Type a name or phone number above to start a message.</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
