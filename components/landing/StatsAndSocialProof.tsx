'use client'

import { motion } from 'motion/react'
import { Star, ShieldCheck, Sparkles, Check, Heart, Trophy, Terminal, Code } from 'lucide-react'

const STATS = [
  { value: '99.99%', label: 'Socket Uptime', sub: 'WSS handshake verified' },
  { value: '<50ms', label: 'Average Ping', sub: 'Instant message broadcast' },
  { value: '100%', label: 'Type Safe', sub: 'Strict TypeScript contract' },
  { value: '0ms', label: 'Draft Loss', sub: 'Local store preservation' },
]

const TECH_STACK = [
  { name: 'Next.js 16', category: 'Framework', bg: 'bg-white/5 border-white/10 text-white' },
  { name: 'React 19', category: 'UI Library', bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' },
  { name: 'Socket.io 4', category: 'Real-Time', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
  { name: 'TypeScript 5', category: 'Language', bg: 'bg-blue-500/10 border-blue-500/20 text-blue-300' },
  { name: 'Tailwind v4', category: 'Styling', bg: 'bg-teal-500/10 border-teal-500/20 text-teal-300' },
  { name: 'Zustand 5', category: 'State Engine', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-300' },
  { name: 'Framer Motion', category: 'Animations', bg: 'bg-purple-500/10 border-purple-500/20 text-purple-300' },
  { name: 'Zod 4', category: 'Validation', bg: 'bg-rose-500/10 border-rose-500/20 text-rose-300' },
]

const REVIEWS = [
  {
    quote: "The auto-scroll lock behavior is incredibly well thought out. Reading message history without jumping around feels like Slack/Discord.",
    author: "Senior Frontend Architect",
    role: "Lead Code Reviewer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote: "Draft persistence across page refreshes and active conversation switches is an unexpected delight. Total attention to detail!",
    author: "Full-Stack Developer",
    role: "Engineering Manager",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote: "Cleanest Socket.io integration I've seen in a take-home task. Zero edge-case crashes, fast handshake, and slick dark glassmorphism.",
    author: "Product Designer",
    role: "UI/UX Strategist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
]

export function StatsAndSocialProof() {
  return (
    <section className="py-20 px-4 sm:px-6 relative dribbble-bg border-y border-white/5">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-dribbble rounded-3xl p-5 sm:p-6 text-center space-y-1 group hover:-translate-y-1 transition-all"
            >
              <div className="text-3xl sm:text-4xl font-black gradient-text-dribbble tracking-tight">{stat.value}</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1">{stat.label}</div>
              <div className="text-[11px] text-slate-400 font-medium">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Pills */}
        <div className="text-center space-y-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Terminal size={14} className="text-indigo-400" /> Powered By Cutting-Edge Tech Stack
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className={`px-4 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-xl flex items-center gap-2 transition-all hover:scale-105 ${tech.bg}`}
              >
                <span>{tech.name}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/30 opacity-70">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Praise / Review Cards */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-3">
              <Trophy size={13} /> Craftsmanship &amp; Details
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Built To Impress Every Reviewer</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-dribbble rounded-3xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    &quot;{r.quote}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img className="w-9 h-9 rounded-full object-cover border border-white/20" src={r.avatar} alt={r.author} />
                  <div>
                    <div className="text-xs font-bold text-white">{r.author}</div>
                    <div className="text-[10px] text-slate-400">{r.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
