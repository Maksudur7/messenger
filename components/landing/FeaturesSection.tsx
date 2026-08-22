'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Zap, Users, ArrowDownToLine, Shield, FileText, Pencil, Sparkles, CheckCircle2, Lock, Radio, Code2 } from 'lucide-react'

export function FeaturesSection() {
  const [activeDraft, setActiveDraft] = useState('Hey team, here is the updated design file...')
  const [autoScrollLocked, setAutoScrollLocked] = useState(true)
  const [pulseCount, setPulseCount] = useState(1480)

  return (
    <section id="features" className="py-24 md:py-32 px-4 sm:px-6 relative dribbble-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-4"
          >
            <Sparkles size={12} className="text-cyan-400" />
            <span>Architecture & Capabilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight"
          >
            Engineered Like <br />
            <span className="gradient-text-dribbble">A World-Class SaaS Product.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-4 text-sm sm:text-base leading-relaxed"
          >
            Every feature was built to handle complex real-world edge cases — from draft preservation to intelligent scroll locking.
          </motion.p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 (Wide 2-Column Hero Bento) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 glass-card-dribbble rounded-3xl p-6 sm:p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-500" />

            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Zap size={22} className="text-indigo-400" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Radio size={12} className="animate-pulse" /> Live Broadcast Active
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Real-Time Socket.io Engine</h3>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed mb-6">
              Instant bi-directional event sync powered by Socket.io 4. Broadcasts message dispatches, typing indicators, and group updates in under 80ms globally.
            </p>

            {/* Interactive Live Packet Visualizer */}
            <div className="p-4 rounded-2xl bg-[#090e1a]/90 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <div>
                  <div className="text-xs font-mono font-bold text-white">Event: &quot;message:new&quot;</div>
                  <div className="text-[10px] text-slate-400">Payload sync: 1,420 subscribers</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPulseCount((p) => p + 1)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  Simulate Event Packet ({pulseCount})
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Auto Scroll */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card-dribbble rounded-3xl p-6 sm:p-8 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-6">
                <ArrowDownToLine size={22} className="text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Auto-Scroll</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Locks to new messages seamlessly, but intelligently pauses when you scroll up to inspect conversation history.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090e1a]/90 border border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Scroll Lock Status</span>
              <button
                onClick={() => setAutoScrollLocked(!autoScrollLocked)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                  autoScrollLocked
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {autoScrollLocked ? '🔒 LOCKED (DEFAULT)' : '🔓 PAUSED'}
              </button>
            </div>
          </motion.div>

          {/* Card 3 - Draft Persistence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card-dribbble rounded-3xl p-6 sm:p-8 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                  <Pencil size={22} className="text-pink-400" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[10px] font-bold">
                  Bonus Feature
                </span>

              </div>
              <h3 className="text-lg font-bold text-white mb-2">Draft Persistence</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Switch chats or close your browser tab — your unsent draft is saved locally and restored automatically.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#090e1a]/90 border border-white/10 space-y-1.5">
              <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider flex items-center justify-between">
                <span>Active Unsaved Draft</span>
                <span className="text-slate-500">Auto-saved</span>
              </div>
              <input
                type="text"
                value={activeDraft}
                onChange={(e) => setActiveDraft(e.target.value)}
                className="w-full bg-transparent text-xs text-white border-b border-white/10 pb-1 focus:outline-none focus:border-pink-500"
              />
            </div>
          </motion.div>

          {/* Card 4 - Group Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card-dribbble rounded-3xl p-6 sm:p-8 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-6">
                <Users size={22} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Group Administration</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Create rooms, promote members to admins, add new participants, and rename group titles in real time.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#090e1a]/90 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Design System Lead</span>
                <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-mono font-bold">Admin</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Senior Frontend Dev</span>
                <span className="text-[10px]">Member</span>
              </div>
            </div>
          </motion.div>

          {/* Card 5 - JWT Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="glass-card-dribbble rounded-3xl p-6 sm:p-8 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                <Shield size={22} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Stateless JWT Auth</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Single unified auth flow for login/registration with JWT Bearer tokens and WebSocket handshake validation.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#090e1a]/90 border border-white/10 flex items-center gap-2.5 text-xs text-emerald-400">
              <CheckCircle2 size={16} />
              <span>Verified Session Restoration</span>
            </div>
          </motion.div>

          {/* Card 6 (Wide 2-Column API Specs) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="md:col-span-2 glass-card-dribbble rounded-3xl p-6 sm:p-8 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Code2 size={22} className="text-amber-400" />
              </div>
              <a
                href="/docs/API_DOCUMENTATION.md"
                target="_blank"
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <FileText size={12} className="text-amber-400" /> View Full Markdown Docs
              </a>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">12 Fully Documented Endpoints</h3>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed mb-6">
              Complete API contract documentation featuring request/response schemas, WebSocket event formats, and edge-case behavior.
            </p>

            <div className="grid sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#090e1a]/90 border border-white/10">
                <span className="text-green-400 font-bold">GET</span> <span className="text-slate-300">/conversations</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090e1a]/90 border border-white/10">
                <span className="text-blue-400 font-bold">POST</span> <span className="text-slate-300">/messages</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090e1a]/90 border border-white/10">
                <span className="text-purple-400 font-bold">PATCH</span> <span className="text-slate-300">/conversations/:id</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

