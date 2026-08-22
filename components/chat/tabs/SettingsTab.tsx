'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, User, Shield, Bell, Moon, Lock, Phone, Save, LogOut } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

export function SettingsTab() {
  const currentUser = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { showToast } = useToast()

  const [name, setName] = useState(currentUser?.name || '')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSave = () => {
    showToast('Settings updated successfully', 'success')
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex-1 bg-[#6D9EEE]/15 p-5 md:p-8 overflow-y-auto font-['DM_Sans',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header (#BCD3F7 Card Background) */}
        <div className="bg-[#BCD3F7]/40 p-6 rounded-2xl border border-[#6D9EEE]/30 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <SettingsIcon size={22} className="text-blue-600" /> Workspace Settings
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Manage profile info, preferences, and account security.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#6D9EEE] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-[#6D9EEE]/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <Save size={15} />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Profile Card (#BCD3F7 Card Background) */}
        <div className="p-6 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 shadow-sm space-y-6">
          <h2 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <User size={16} className="text-blue-600" /> Profile Information
          </h2>

          <div className="flex items-center gap-4">
            <Avatar name={currentUser?.name || 'User'} size="lg" className="ring-4 ring-[#6D9EEE]/40" />
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">{currentUser?.name}</h3>
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Phone size={12} className="text-blue-600" />
                <span>{currentUser?.phone || 'No phone set'}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#E8F0FC] border border-[#6D9EEE]/30 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700">Phone Number (Read Only)</label>
              <input
                type="text"
                value={currentUser?.phone || ''}
                disabled
                className="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* App Preferences (#BCD3F7 Card Background) */}
        <div className="p-6 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 shadow-sm space-y-4">
          <h2 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <Shield size={16} className="text-blue-600" /> App Preferences
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#6D9EEE]/20">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-blue-600" />
                <div>
                  <div className="text-xs font-black text-slate-900">Desktop Push Notifications</div>
                  <div className="text-[11px] font-medium text-slate-500">Receive live push alerts when new messages arrive</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#6D9EEE]/20">
              <div className="flex items-center gap-3">
                <Moon size={18} className="text-blue-600" />
                <div>
                  <div className="text-xs font-black text-slate-900">Dark Contrast Theme</div>
                  <div className="text-[11px] font-medium text-slate-500">Switch workspace theme contrast</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Logout Action */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 border border-rose-100"
          >
            <LogOut size={16} />
            <span>Logout From Workspace</span>
          </button>
        </div>

      </div>
    </div>
  )
}
