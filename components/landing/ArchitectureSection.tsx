'use client'

import { motion } from 'motion/react'
import { ArchitectureFlow } from './ArchitectureFlow'
import { Cpu, ShieldAlert, Layers } from 'lucide-react'

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 md:py-32 px-4 sm:px-6 relative dribbble-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-4"
          >
            <Cpu size={13} className="text-cyan-400" />
            <span>Under The Hood</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight"
          >
            Full-Stack WebSocket <br />
            <span className="gradient-text-dribbble">&amp; REST Architecture.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-4 text-sm sm:text-base leading-relaxed"
          >
            Explore how client sockets handshake, emit real-time event packets, and update Zustand stores instantly.
          </motion.p>
        </div>

        {/* Embedded Interactive Flow */}
        <ArchitectureFlow />
      </div>
    </section>
  )
}

