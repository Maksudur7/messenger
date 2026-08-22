'use client'

import { useState, useCallback } from 'react'
import { Search, X, Check, Loader2, Users } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import type { User, Conversation } from '@/lib/types'

interface NewGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onGroupCreated: (conversation: Conversation) => void
}

export function NewGroupModal({ isOpen, onClose, onGroupCreated }: NewGroupModalProps) {
  const currentUser = useAuthStore((s) => s.user)
  const [step, setStep] = useState<1 | 2>(1)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selected, setSelected] = useState<User[]>([])
  const [groupName, setGroupName] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      if (debounceRef[0]) clearTimeout(debounceRef[0])
      if (!value.trim()) { setSearchResults([]); return }

      debounceRef[0] = setTimeout(async () => {
        setIsSearching(true)
        try {
          const users = await api.searchUsers(value.trim())
          setSearchResults(
            users.filter(
              (u) => u._id !== currentUser?._id && !selected.find((s) => s._id === u._id)
            )
          )
        } catch {
          setError('Search failed.')
        } finally {
          setIsSearching(false)
        }
      }, 300)
    },
    [currentUser?._id, selected, debounceRef]
  )

  const toggleSelect = (user: User) => {
    setSelected((prev) =>
      prev.find((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    )
  }

  const handleNext = () => {
    if (selected.length < 2) {
      setError('Select at least 2 people to create a group.')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleCreate = async () => {
    if (!groupName.trim()) { setError('Group name is required.'); return }
    if (selected.length < 2) { setError('Select at least 2 people.'); return }

    setIsCreating(true)
    setError(null)
    try {
      const group = await api.createGroup({
        name: groupName.trim(),
        participantIds: selected.map((u) => u._id),
      })
      onGroupCreated(group)
      onClose()
      handleReset()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e?.message ?? 'Failed to create group.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setQuery('')
    setSearchResults([])
    setSelected([])
    setGroupName('')
    setError(null)
  }

  const handleClose = () => { onClose(); handleReset() }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Group" maxWidth="max-w-sm">
      {step === 1 ? (
        <>
          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {selected.map((u) => (
                <span
                  key={u._id}
                  className="flex items-center gap-1 bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 text-xs rounded-full px-2.5 py-1"
                >
                  {u.name}
                  <button onClick={() => toggleSelect(u)} aria-label={`Remove ${u.name}`}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="group-member-search"
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search people to add..."
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 transition-colors"
            />
            {query && (
              <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-52 overflow-y-auto -mx-5 px-5 mb-4">
            {isSearching && (
              <div className="flex justify-center py-6">
                <Loader2 size={18} className="text-indigo-400 animate-spin" />
              </div>
            )}
            {!isSearching && query && searchResults.length === 0 && (
              <p className="text-sm text-white/30 text-center py-6">No users found</p>
            )}
            {!isSearching && searchResults.map((user) => {
              const isSelected = !!selected.find((u) => u._id === user._id)
              return (
                <button
                  key={user._id}
                  onClick={() => toggleSelect(user)}
                  className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Avatar name={user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-white/40 truncate">{user.phone}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-white/20'}`}>
                    {isSelected && <Check size={11} className="text-white" />}
                  </div>
                </button>
              )
            })}
          </div>

          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

          <button
            id="group-next-btn"
            onClick={handleNext}
            disabled={selected.length < 2}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-medium transition-colors"
          >
            Next — {selected.length} selected {selected.length < 2 && '(min 2)'}
          </button>
        </>
      ) : (
        <>
          {/* Selected members preview */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {selected.map((u) => (
              <div key={u._id} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1">
                <Avatar name={u.name} size="xs" />
                <span className="text-xs text-white/70">{u.name}</span>
              </div>
            ))}
          </div>

          {/* Group name */}
          <div className="mb-5">
            <label htmlFor="group-name-input" className="block text-xs text-white/50 mb-1.5 font-medium">
              Group Name
            </label>
            <input
              id="group-name-input"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Project Team, Family, Friends..."
              autoFocus
              maxLength={50}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => { setStep(1); setError(null) }}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm transition-colors"
            >
              Back
            </button>
            <button
              id="create-group-btn"
              onClick={handleCreate}
              disabled={isCreating || !groupName.trim()}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <><Loader2 size={14} className="animate-spin" /> Creating...</>
              ) : (
                <><Users size={14} /> Create Group</>
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
