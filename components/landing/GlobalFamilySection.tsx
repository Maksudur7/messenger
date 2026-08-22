'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Camera, Globe, Zap, ShieldCheck, Share2 } from 'lucide-react'

export function GlobalFamilySection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-[#f8fafc] via-slate-50 to-white text-slate-900 px-4 sm:px-8 border-t border-slate-200/60 font-['DM_Sans',sans-serif] relative overflow-hidden">
      
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column Animated Photo Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
            
            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.5 }}
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&auto=format&fit=crop&q=80"
              alt="Global Family and Friends"
              className="w-full h-[380px] sm:h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Photo Shared Pill Badge (Top Right - Static) */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-slate-900 text-xs font-black shadow-xl flex items-center gap-2 border border-slate-100">
              <Camera size={14} className="text-blue-600" />
              <span>Photo Shared 2m ago</span>
            </div>

            {/* Avatar Stack Badge (Bottom Left - Static) */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-2xl flex items-center gap-3.5 border border-slate-100">
              <div className="flex -space-x-2">
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=80" alt="user" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=80" alt="user" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop&q=80" alt="user" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Join 10,000+ Users</div>
                <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active in 45+ countries
                </div>
              </div>
            </div>


          </div>
        </motion.div>

        {/* Right Column Content with Motion Entrance */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 space-y-7"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-wider">
              <span className="w-5 h-0.5 bg-blue-600 rounded-full" />
              <span>Global Network &amp; Community</span>
            </div>


            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Your Place in Our <br />
              <span className="text-blue-600">Global Family</span>
            </h2>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Whether you are coordinating distributed remote team projects or staying in touch with friends across the globe, NexusChat brings everyone together with instant sync and zero lag.
          </p>

          {/* 3 Mini Feature Highlights */}
          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1 hover:border-blue-300 transition-colors">
              <Zap size={16} className="text-blue-600" />
              <div className="text-xs font-bold text-slate-900">Instant Sync</div>
              <div className="text-[10px] text-slate-500">75ms Socket latency</div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1 hover:border-emerald-300 transition-colors">
              <ShieldCheck size={16} className="text-emerald-600" />
              <div className="text-xs font-bold text-slate-900">Secure JWT</div>
              <div className="text-[10px] text-slate-500">Stateless handshake</div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1 hover:border-purple-300 transition-colors">
              <Share2 size={16} className="text-purple-600" />
              <div className="text-xs font-bold text-slate-900">Media Share</div>
              <div className="text-[10px] text-slate-500">Photos &amp; Voice notes</div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/chat"
              className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full bubbly-badge-cyan hover:bg-teal-300 text-xs font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95 text-slate-900"
            >
              Try Free
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
