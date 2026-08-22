'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import {
  Play,
  Mic,
  ShieldCheck,
  Globe,
  Send,
  Camera,
  CheckCheck,
  ArrowRight,
} from 'lucide-react'

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const phoneScale = useTransform(scrollYProgress, [0, 1], [1, 0.96])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30])

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative pt-24 sm:pt-32 pb-0 bg-[#2563eb] text-white overflow-hidden font-['DM_Sans',sans-serif] border-b border-blue-400/20"
    >

      
      {/* Background Vertical Grid Lines (Subtle Light White Stripes) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px)] bg-[size:5rem_100%] opacity-60 pointer-events-none" />

      {/* Animated Rotated Geometric Logo Watermark in Background */}
      <motion.div
        animate={{
          rotate: [45, 50, 45],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[550px] h-[550px] pointer-events-none opacity-20"
      >
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
          <rect x="50" y="50" width="300" height="300" rx="60" stroke="currentColor" strokeWidth="24" />
          <rect x="100" y="100" width="200" height="200" rx="40" stroke="currentColor" strokeWidth="16" />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white"
          >
            Your Next Conversation <br />
            Starts Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            A modern app that keeps you connected with the people who matter most. <br className="hidden sm:inline" />
            Share messages, photos, and moments instantly
          </motion.p>

          {/* Centered Mint Cyan 'Get Chat' Button with Hover & Pulsing Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            className="pt-2"
          >
            <Link
              href="/chat"
              id="hero-cta-btn"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2dd4bf] hover:bg-teal-300 text-slate-900 font-black text-sm shadow-xl shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 group"
            >
              <span>Get Chat</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </Link>
          </motion.div>
        </div>

        {/* Floating Cards & Centered Half-Cropped Phone Mockup Stage */}
        <div className="relative max-w-5xl mx-auto h-[480px] sm:h-[520px] overflow-visible">

          {/* 1. TOP-LEFT: Audio Voice Note Pill Card (Levitating Float Loop) */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.3 },
              x: { duration: 0.6, delay: 0.3 },
              y: { duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            }}
            className="hidden sm:flex absolute top-2 left-0 sm:left-4 z-30 p-3 sm:p-3.5 rounded-2xl bg-[#3b82f6]/90 backdrop-blur-md border border-white/20 text-white shadow-2xl items-center gap-3 w-64 sm:w-72 hover:shadow-blue-400/20 hover:scale-105 transition-all cursor-pointer"
          >

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold flex-shrink-0 shadow active:scale-95 transition-transform"
            >
              <Play size={12} fill="currentColor" />
            </button>
            <div className="flex-1 space-y-1">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-white/80 rounded-full" />
                <span className="w-1 h-2 bg-white/60 rounded-full" />
                <span className="w-1 h-4 bg-white rounded-full animate-pulse" />
                <span className="w-1 h-3 bg-white/90 rounded-full" />
                <span className="w-1 h-2 bg-white/50 rounded-full" />
                <span className="w-1 h-4 bg-white rounded-full" />
                <span className="w-1 h-3 bg-white/70 rounded-full" />
                <span className="w-1 h-2 bg-white/40 rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-white/80 font-mono">
                <span>1:36</span>
                <span>08:54</span>
              </div>
            </div>
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop&q=80"
                alt="user"
                className="w-8 h-8 rounded-full border border-white/40 object-cover"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[9px] font-bold">
                <Mic size={9} />
              </span>
            </div>
          </motion.div>

          {/* 2. MIDDLE-LEFT: Photo Card (Levitating Float Loop) */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, 8, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.4 },
              x: { duration: 0.6, delay: 0.4 },
              y: { duration: 5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.5 },
            }}
            className="hidden md:block absolute top-28 left-2 sm:-left-6 z-30 p-1.5 rounded-2xl bg-white shadow-2xl border-4 border-pink-200 w-44 sm:w-56 hover:scale-105 transition-transform"
          >

            <div className="rounded-xl overflow-hidden h-32 sm:h-40">
              <img
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&auto=format&fit=crop&q=80"
                alt="Couple with dog"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* 3. BOTTOM-LEFT: Stat Card (Levitating Float Loop) */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 30 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -7, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.5 },
              x: { duration: 0.6, delay: 0.5 },
              y: { duration: 4.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.2 },
            }}
            className="absolute bottom-6 left-8 sm:left-6 z-30 p-5 rounded-2xl bg-[#3b82f6]/90 backdrop-blur-md border border-white/20 text-white shadow-2xl w-44 sm:w-52 space-y-2 hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <Globe size={18} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">350M+</div>
              <div className="text-[11px] text-white/80 font-medium">Users worldwide</div>
            </div>
          </motion.div>

          {/* 4. TOP-RIGHT: Security Card (Levitating Float Loop) */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, 9, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.3 },
              x: { duration: 0.6, delay: 0.3 },
              y: { duration: 4.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.1 },
            }}
            className="absolute top-10 right-0 sm:right-2 z-30 p-5 rounded-2xl bg-[#3b82f6]/90 backdrop-blur-md border border-white/20 text-white shadow-2xl w-60 sm:w-72 space-y-2 hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white">
              <ShieldCheck size={18} />
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-snug text-white/95">
              Every message stays between you and who you send it to.
            </p>
          </motion.div>

          {/* 5. MIDDLE-RIGHT: Green Location Bubble (Levitating Float Loop) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.4 },
              x: { duration: 0.6, delay: 0.4 },
              y: { duration: 3.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.4 },
            }}
            className="absolute top-44 right-4 sm:right-8 z-30 px-4 py-2.5 rounded-2xl bg-[#86efac] text-emerald-950 font-semibold text-xs shadow-xl flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <span>Waiting for you at location</span>
            <span className="text-[10px] text-emerald-800 font-mono flex items-center gap-1">
              08:23 <CheckCheck size={12} className="text-emerald-700" />
            </span>
          </motion.div>

          {/* 6. BOTTOM-RIGHT: Video Download Card (Levitating Float Loop) */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: 30 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.5 },
              x: { duration: 0.6, delay: 0.5 },
              y: { duration: 4.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.6 },
            }}
            className="absolute bottom-10 right-2 sm:-right-4 z-30 p-4 rounded-2xl bg-[#3b82f6]/90 backdrop-blur-md border border-white/20 text-white shadow-2xl w-60 sm:w-64 space-y-3 hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Play size={12} fill="currentColor" />
              </div>
              <div className="text-xs font-bold text-white">Wedding Highlights</div>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-white rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-white/80 font-mono">
                <span>5.8/8.16 MB</span>
                <span>0:41s</span>
              </div>
            </div>
          </motion.div>

          {/* 7. FLOATING CYAN SHARE BUTTON (Pulsing Levitation) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.6 },
              scale: { duration: 0.5, delay: 0.6 },
              y: { duration: 3.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            }}
            className="absolute bottom-12 right-[28%] z-30 hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2dd4bf] text-slate-900 font-extrabold text-xs shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          >
            <Send size={13} className="fill-slate-900" />
            <span>Share</span>
          </motion.div>

          {/* CENTERPIECE: Half-Cropped iPhone Mockup (Smooth Rise & Scroll Parallax) */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ y: phoneY, scale: phoneScale }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-[290px] sm:w-[330px] rounded-t-[44px] bg-slate-950 p-3 pt-3 pb-0 shadow-2xl border-[5px] border-b-0 border-slate-900 translate-y-12 sm:translate-y-16"
          >

            {/* Phone Screen Container */}
            <div className="rounded-t-[36px] bg-white overflow-hidden text-slate-900 text-left h-[440px] flex flex-col justify-start">
              
              {/* Phone Status Bar & Header */}
              <div className="bg-slate-50 pt-3 pb-3 px-5 border-b border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-2 px-1">
                  <span>09:41</span>
                  <div className="w-20 h-4 bg-slate-950 rounded-full" />
                  <span className="text-[9px]">100%</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Camera size={18} className="text-slate-700" />
                  <span className="font-extrabold text-base text-slate-900 tracking-tight">Message</span>
                  <div className="w-5" />
                </div>
              </div>

              {/* Chat Inbox Contact Items */}
              <div className="p-3 space-y-2 flex-1 overflow-hidden bg-white">
                
                {/* Contact 1 */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop&q=80"
                    alt="Kaiya"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 flex justify-between">
                      <span className="truncate">Kaiya Rhiel Madsen</span>
                      <span className="text-[10px] text-slate-400 font-medium">13:09</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">I need a link to the project</div>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                </motion.div>

                {/* Contact 2 */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=80"
                    alt="Jaydon"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 flex justify-between">
                      <span className="truncate">Jaydon Dorwart</span>
                      <span className="text-[10px] text-slate-400 font-medium">13:00</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">Thanks for the help</div>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                </motion.div>

                {/* Contact 3 */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=80"
                    alt="Maren"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 flex justify-between">
                      <span className="truncate">Maren Mango</span>
                      <span className="text-[10px] text-slate-400 font-medium">12:34</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      <CheckCheck size={12} className="text-blue-600" />
                      <span>Voice message</span>
                    </div>
                  </div>
                </motion.div>

                {/* Contact 4 */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&auto=format&fit=crop&q=80"
                    alt="Paityn"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 flex justify-between">
                      <span className="truncate">Paityn George</span>
                      <span className="text-[10px] text-slate-400 font-medium">11:09</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      <CheckCheck size={12} className="text-blue-600" />
                      <span>Cool!</span>
                    </div>
                  </div>
                </motion.div>

                {/* Contact 5 */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&auto=format&fit=crop&q=80"
                    alt="Mira"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 flex justify-between">
                      <span className="truncate">Mira Culhane</span>
                      <span className="text-[10px] text-slate-400 font-medium">11:09</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      <CheckCheck size={12} className="text-blue-600" />
                      <span>No, no, no 🤪</span>
                    </div>
                  </div>
                </motion.div>

              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
