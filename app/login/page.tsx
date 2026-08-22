'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Phone, User, MessageSquare, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

const loginSchema = z.object({
  phone: z.string().min(7, 'Phone number must be at least 7 digits').regex(/^\+?[\d\s\-().]+$/, 'Invalid phone number format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
})

export default function LoginPage() {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const login = useAuthStore((s) => s.login)

  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ phone?: string; name?: string; general?: string }>({})

  // Auto-redirect if already authenticated
  useEffect(() => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('chat_token') : null)
    if (activeToken) {
      api.getMe()
        .then(() => router.replace('/chat'))
        .catch(() => {})
    }
  }, [token, router])


  const handleLogin = async (phoneVal: string, nameVal: string) => {
    setErrors({})
    const result = loginSchema.safeParse({ phone: phoneVal.trim(), name: nameVal.trim() })
    if (!result.success) {
      const fieldErrors: typeof errors = {}
      result.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as 'phone' | 'name'
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    try {
      const response = await api.login({ phone: phoneVal.trim(), name: nameVal.trim() })
      login(response.user, response.token)
      router.push('/chat')
    } catch (err: unknown) {
      const e = err as { message?: string }
      setErrors({ general: e?.message ?? 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(phone, name)
  }

  const handleGuestLogin = () => {
    const guestPhone = '+1 555 019 2831'
    const guestName = 'Alex Mercer'
    setPhone(guestPhone)
    setName(guestName)
    handleLogin(guestPhone, guestName)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white font-['DM_Sans',sans-serif] selection:bg-indigo-600 selection:text-white">
      
      {/* LEFT COLUMN: Login Form Card (50% Desktop Width) */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white relative z-10">
        
        {/* Top Logo Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" id="login-brand-logo" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <MessageSquare size={20} className="text-white fill-white/20" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
              Nexus<span className="text-indigo-600">Chat</span>
            </span>
          </Link>

          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Center Form Container */}
        <div className="max-w-md w-full mx-auto space-y-7">
          
          {/* Welcome Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Welcome!
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Enter your phone and name to sign in. New numbers register automatically!
            </p>
          </div>

          {/* Form */}
          <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label htmlFor="phone-input" className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 019 2831"
                  autoFocus
                  className={`w-full bg-slate-50 border rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                    errors.phone
                      ? 'border-red-400 focus:border-red-500 focus:bg-white'
                      : 'border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 font-bold mt-1">{errors.phone}</p>}
            </div>

            {/* Your Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name-input" className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Your Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className={`w-full bg-slate-50 border rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                    errors.name
                      ? 'border-red-400 focus:border-red-500 focus:bg-white'
                      : 'border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 font-bold mt-1">{errors.name}</p>}
            </div>

            {/* Registration Callout Pill */}
            <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900 font-medium">
              <ShieldCheck size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>No password needed:</strong> If your phone number is new, our system will register your account automatically!
              </span>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-center"
              >
                {errors.general}
              </motion.p>
            )}

            {/* Main Sign In Primary Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                <><span>Continue to Chat</span><ArrowRight size={16} /></>
              )}
            </button>

            {/* Or Divider */}
            <div className="relative py-1 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Or quick test
              </span>
            </div>

            {/* Quick Guest Auto-Login Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-xs transition-all flex items-center justify-center gap-2 hover:border-slate-300"
            >
              <span>1-Click Demo Guest Sign In</span>
            </button>


          </form>
        </div>

        {/* Footer Copyright */}
        <div className="text-center sm:text-left text-xs text-slate-400 pt-8 font-medium">
          © 2026 NexusChat Inc. All rights reserved.
        </div>

      </div>

      {/* RIGHT COLUMN: Vibrant Pixel-Perfect Desktop Showcase (50% Desktop Width) */}
      <div className="lg:col-span-6 xl:col-span-7 bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#3730a3] text-white p-8 lg:p-14 relative flex-col items-center justify-center overflow-hidden hidden lg:flex">
        
        {/* Radial Background Light Grid */}
        <div className="absolute inset-0 bg-diagonal-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Floating Reaction Emojis & Avatars */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          className="absolute top-12 left-16 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl z-20"
        >
          🥳
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-16 right-20 w-12 h-12 rounded-full bg-amber-400 p-0.5 shadow-xl border-2 border-white overflow-hidden z-20"
        >
          <img className="w-full h-full object-cover rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=80" alt="avatar" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-20 right-16 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-xl z-20"
        >
          👍
        </motion.div>

        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.2 }}
          className="absolute bottom-24 left-16 w-12 h-12 rounded-full bg-teal-400 p-0.5 shadow-xl border-2 border-white overflow-hidden z-20"
        >
          <img className="w-full h-full object-cover rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=80" alt="avatar" />
        </motion.div>

        {/* Centerpiece Stacked Chat App Preview Window (Matching Reference Image) */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl relative z-10"
        >
          {/* Back Window Shadow Layer */}
          <div className="absolute -top-3 left-6 right-6 h-full rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 -z-10" />

          {/* Main Front Chat Window Frame */}
          <div className="rounded-2xl bg-white text-slate-900 shadow-2xl border border-white/40 overflow-hidden text-left">
            
            {/* Top Window Bar */}
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <MessageSquare size={14} className="text-indigo-600" />
                <span>NexusChat Workspace</span>
              </div>
              <div className="w-10" />
            </div>

            {/* Chat Body Grid Split */}
            <div className="grid grid-cols-12 h-[380px]">
              
              {/* Left Sidebar Chats */}
              <div className="col-span-5 border-r border-slate-100 bg-slate-50/50 p-3 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">
                    Recent Chats
                  </div>

                  {/* Active Chat Item */}
                  <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2.5">
                    <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop&q=80" alt="user" />
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 truncate">Edward Lord</div>
                      <div className="text-[10px] text-indigo-600 font-bold truncate">Online now</div>
                    </div>
                  </div>

                  {/* Chat Item 2 */}
                  <div className="p-2 rounded-xl bg-white border border-slate-100 flex items-center gap-2.5">
                    <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=80" alt="user" />
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 truncate">Karren Scott</div>
                      <div className="text-[10px] text-slate-400 truncate">Voice note 2m</div>
                    </div>
                  </div>

                  {/* Chat Item 3 */}
                  <div className="p-2 rounded-xl bg-white border border-slate-100 flex items-center gap-2.5">
                    <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=80" alt="user" />
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 truncate">Clyde Smith</div>
                      <div className="text-[10px] text-slate-400 truncate">See you tomorrow</div>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-indigo-600 text-white text-[11px] font-bold text-center">
                  + Start New Chat
                </div>
              </div>

              {/* Right Chat Conversation View */}
              <div className="col-span-7 bg-white p-3 flex flex-col justify-between">
                
                {/* Conversation Header */}
                <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img className="w-7 h-7 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop&q=80" alt="user" />
                    <div className="text-xs font-black text-slate-900">Edward Lord</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                {/* Messages Feed */}
                <div className="space-y-2.5 py-2 overflow-hidden text-xs">
                  {/* Incoming Bubble */}
                  <div className="bg-slate-100 text-slate-800 p-2.5 rounded-2xl rounded-tl-xs max-w-[85%] font-medium">
                    Hey! Check out these new design highlights.
                  </div>

                  {/* Attachment Preview Box */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-1.5">
                    <img className="w-full h-12 object-cover rounded-lg" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&auto=format&fit=crop&q=80" alt="thumb" />
                    <img className="w-full h-12 object-cover rounded-lg" src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&h=150&auto=format&fit=crop&q=80" alt="thumb" />
                    <img className="w-full h-12 object-cover rounded-lg" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&auto=format&fit=crop&q=80" alt="thumb" />
                  </div>

                  {/* Outgoing Bubble */}
                  <div className="ml-auto bg-indigo-600 text-white p-2.5 rounded-2xl rounded-tr-xs max-w-[85%] font-medium text-right shadow-md">
                    Send me the media files when you get a chance! 👍
                  </div>
                </div>

                {/* Input Bar Placeholder */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 text-[11px] text-slate-400 font-medium">
                    Type a message...
                  </div>
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                    ➤
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>

      </div>

    </div>
  )
}
