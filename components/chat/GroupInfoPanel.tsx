'use client'

import { useState, useCallback } from 'react'
import { X, Search, Crown, Loader2, UserMinus, ShieldCheck, LogOut, Edit2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Avatar } from '@/components/ui/Avatar'
import { api } from '@/lib/api'
import { useAuthStore, useChatStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import type { GroupConversation, User, Conversation } from '@/lib/types'

interface GroupInfoPanelProps {
  conversation: GroupConversation
  isOpen: boolean
  onClose: () => void
  onLeft: () => void
}

export function GroupInfoPanel({ conversation, isOpen, onClose, onLeft }: GroupInfoPanelProps) {
  const currentUser = useAuthStore((s) => s.user)
  const updateConversation = useChatStore((s) => s.updateConversation)
  const { showToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(conversation.name)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null)

  const isAdmin = currentUser ? conversation.admins.includes(currentUser._id) : false

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value)
      if (debounceRef[0]) clearTimeout(debounceRef[0])
      if (!value.trim()) { setSearchResults([]); return }
      debounceRef[0] = setTimeout(async () => {
        setIsSearching(true)
        try {
          const users = await api.searchUsers(value.trim())
          const memberIds = new Set(conversation.participants.map((p) => p._id))
          setSearchResults(users.filter((u) => !memberIds.has(u._id)))
        } catch { setSearchResults([]) }
        finally { setIsSearching(false) }
      }, 300)
    },
    [conversation.participants, debounceRef]
  )

  const handleAddMember = async (user: User) => {
    setLoadingAction(`add_${user._id}`)
    try {
      const updated = await api.addParticipants(conversation._id, { userIds: [user._id] })
      updateConversation(updated)
      setSearchQuery('')
      setSearchResults([])
      showToast(`${user.name} added to group`, 'success')
    } catch { showToast('Failed to add member') }
    finally { setLoadingAction(null) }
  }

  const handleRemoveMember = async (user: User) => {
    setLoadingAction(`remove_${user._id}`)
    try {
      const updated = await api.removeParticipant(conversation._id, user._id)
      updateConversation(updated)
      showToast(`${user.name} removed`, 'success')
    } catch { showToast('Failed to remove member') }
    finally { setLoadingAction(null) }
  }

  const handlePromote = async (user: User) => {
    setLoadingAction(`promote_${user._id}`)
    try {
      const updated = await api.promoteToAdmin(conversation._id, { userId: user._id })
      updateConversation(updated)
      showToast(`${user.name} is now an admin`, 'success')
    } catch { showToast('Failed to promote member') }
    finally { setLoadingAction(null) }
  }

  const handleRename = async () => {
    if (!newName.trim() || newName.trim() === conversation.name) {
      setIsRenaming(false)
      return
    }
    setLoadingAction('rename')
    try {
      const updated = await api.renameGroup(conversation._id, { name: newName.trim() })
      updateConversation(updated)
      setIsRenaming(false)
      showToast('Group renamed', 'success')
    } catch { showToast('Failed to rename group') }
    finally { setLoadingAction(null) }
  }

  const handleLeave = async () => {
    if (!currentUser) return
    setLoadingAction('leave')
    try {
      await api.removeParticipant(conversation._id, currentUser._id)
      onLeft()
      onClose()
    } catch { showToast('Failed to leave group') }
    finally { setLoadingAction(null) }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-10"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-[#6D9EEE] border-l border-white/20 z-20 flex flex-col overflow-hidden text-white font-['DM_Sans',sans-serif] shadow-2xl shadow-blue-600/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/20 bg-white/5">
              <h3 className="font-black text-white">Group Info</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Group name */}
              <div className="flex flex-col items-center gap-3 py-2">
                <Avatar name={conversation.name} size="lg" className="ring-4 ring-white/30" />
                {isRenaming ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 bg-[#E8F0FC] border border-white/30 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-white shadow-inner"
                      onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                      autoFocus
                    />
                    <button onClick={handleRename} disabled={loadingAction === 'rename'} className="p-1.5 bg-white text-blue-700 rounded-lg font-black">
                      {loadingAction === 'rename' ? <Loader2 size={14} className="animate-spin text-blue-700" /> : <Check size={14} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-base font-black text-white">{conversation.name}</p>
                    {isAdmin && (
                      <button onClick={() => { setIsRenaming(true); setNewName(conversation.name) }} className="text-white/70 hover:text-white transition-colors">
                        <Edit2 size={13} />
                      </button>
                    )}
                  </div>
                )}
                <p className="text-xs text-white/80 font-bold">{conversation.participants.length} members</p>
              </div>

              {/* Add members (admin only) */}
              {isAdmin && (
                <div>
                  <p className="text-xs text-white/80 font-black mb-2 uppercase tracking-wide">Add Members</p>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 z-10" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full bg-[#E8F0FC] border border-white/30 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-600 outline-none focus:border-white shadow-inner"
                    />
                  </div>
                  {isSearching && <div className="flex justify-center py-3"><Loader2 size={14} className="text-white animate-spin" /></div>}

                  {searchResults.map((user) => (
                    <button key={user._id} onClick={() => handleAddMember(user)} disabled={!!loadingAction} className="w-full flex items-center gap-2 py-2 px-1 rounded-lg hover:bg-white/5 transition-colors text-left mt-1">
                      <Avatar name={user.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/40 truncate">{user.phone}</p>
                      </div>
                      {loadingAction === `add_${user._id}` ? <Loader2 size={14} className="animate-spin text-indigo-400" /> : <span className="text-xs text-indigo-400">Add</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* Members list */}
              <div>
                <p className="text-xs text-white/40 font-medium mb-2 uppercase tracking-wide">Members</p>
                <div className="space-y-1">
                  {conversation.participants.map((member) => {
                    const isMemberAdmin = conversation.admins.includes(member._id)
                    const isMe = member._id === currentUser?._id
                    return (
                      <div key={member._id} className="flex items-center gap-2.5 px-1 py-2 rounded-lg group">
                        <Avatar name={member.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm text-white truncate">{member.name}{isMe && ' (you)'}</p>
                            {isMemberAdmin && <Crown size={11} className="text-yellow-400 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-white/40 truncate">{member.phone}</p>
                        </div>
                        {/* Admin actions on other members */}
                        {isAdmin && !isMe && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!isMemberAdmin && (
                              <button onClick={() => handlePromote(member)} disabled={!!loadingAction} title="Promote to admin" className="p-1.5 rounded-lg text-white/30 hover:text-yellow-400 hover:bg-white/5 transition-colors">
                                {loadingAction === `promote_${member._id}` ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                              </button>
                            )}
                            <button onClick={() => handleRemoveMember(member)} disabled={!!loadingAction} title="Remove from group" className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors">
                              {loadingAction === `remove_${member._id}` ? <Loader2 size={12} className="animate-spin" /> : <UserMinus size={12} />}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Leave group */}
            <div className="p-4 border-t border-white/10">
              <button
                id="leave-group-btn"
                onClick={handleLeave}
                disabled={loadingAction === 'leave'}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
              >
                {loadingAction === 'leave' ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                Leave Group
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
