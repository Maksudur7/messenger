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
      showToast(`${user.name} is already in your chat list!`, 'success')
      onConversationStarted(existingConv._id)
      handleClose()
      return
    }

    setIsStarting(user._id)
    try {
      const conv = await api.startDirectConversation(user._id)
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
      <p className="text-xs text-white/40 mb-3 -mt-2">
        Search any user by phone number or name to add them to your messages.
      </p>

      {/* Search input */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          id="new-chat-search"
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or phone number..."
          autoFocus
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 transition-colors"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
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
            <Loader2 size={20} className="text-indigo-400 animate-spin" />
          </div>
        )}

        {searchError && (
          <p className="text-sm text-red-400 text-center py-4">{searchError}</p>
        )}

        {!isSearching && !searchError && query && results.length === 0 && (
          <div className="text-center py-8">
            <UserPlus size={32} className="text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/40 font-medium">No user found</p>
            <p className="text-xs text-white/20 mt-1">Check the phone number or name and try again.</p>
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
              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left disabled:opacity-60 group"
            >
              <Avatar name={user.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  {isAlreadyAdded && (
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 flex-shrink-0">
                      <Check size={9} /> Added
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 truncate">{user.phone}</p>
              </div>

              {isStarting === user._id ? (
                <Loader2 size={16} className="text-indigo-400 animate-spin flex-shrink-0" />
              ) : isAlreadyAdded ? (
                <span className="text-xs text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0">Open</span>
              ) : (
                <span className="text-xs text-indigo-400 group-hover:text-indigo-300 font-medium transition-colors flex-shrink-0">+ Add</span>
              )}
            </button>
          )
        })}

        {!query && (
          <div className="text-center py-8">
            <UserPlus size={32} className="text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/40 font-medium">Add a Contact</p>
            <p className="text-xs text-white/20 mt-1">Type a name or phone number above to start a message.</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
