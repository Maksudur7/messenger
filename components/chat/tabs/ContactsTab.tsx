'use client'

import { useState, useEffect } from 'react'
import { Search, UserPlus, MessageSquare, Phone, Check, Loader2, Users as UsersIcon } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { api } from '@/lib/api'
import { useAuthStore, useChatStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import type { User } from '@/lib/types'

interface ContactsTabProps {
  onStartChat: (userId: string) => void
}

export function ContactsTab({ onStartChat }: ContactsTabProps) {
  const currentUser = useAuthStore((s) => s.user)
  const conversations = useChatStore((s) => s.conversations)
  const { showToast } = useToast()

  const [query, setQuery] = useState('')
  const [contacts, setContacts] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    api.searchUsers(query)
      .then((users) => setContacts(users.filter((u) => u._id !== currentUser?._id)))
      .catch(() => setContacts([]))
      .finally(() => setIsLoading(false))
  }, [query, currentUser?._id])

  return (
    <div className="flex-1 bg-[#6D9EEE]/15 p-5 md:p-8 overflow-y-auto font-['DM_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar (#BCD3F7 Card Background) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#BCD3F7]/40 p-6 rounded-2xl border border-[#6D9EEE]/30 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <UsersIcon size={22} className="text-blue-600" /> Contacts Directory
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Search registered users by phone or name and launch instant direct messages.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full bg-[#E8F0FC] border border-[#6D9EEE]/30 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Contacts Grid (#BCD3F7 Card Background) */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-[#6D9EEE] animate-spin" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16 bg-[#BCD3F7]/40 rounded-2xl border border-[#6D9EEE]/30">
            <UserPlus size={36} className="text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-black text-slate-900">No Contacts Found</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Try searching with another name or phone number.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((user) => {
              const isAdded = conversations.some(
                (c) => c.type === 'direct' && c.participant?._id === user._id
              )

              return (
                <div
                  key={user._id}
                  className="p-5 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 shadow-sm hover:border-[#6D9EEE]/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar name={user.name} size="lg" className="ring-2 ring-white" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-600 rounded-full ring-2 ring-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <Phone size={11} className="text-blue-600" />
                        <span>{user.phone || 'Phone verified'}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartChat(user._id)}
                    className="w-full py-2.5 rounded-xl bg-[#6D9EEE] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-[#6D9EEE]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <MessageSquare size={14} />
                    <span>{isAdded ? 'Open Direct Chat' : 'Start New Message'}</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
