'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'

export function MidBannerSection() {
  return (
    <section className="py-20 sm:py-24 bg-royal-blue bg-diagonal-pattern text-white text-center px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white"
        >
          Your Next Conversation <br />
          Starts Here
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/chat"
            className="px-8 py-3.5 rounded-full bubbly-badge-cyan text-xs font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-300 transition-all flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight size={14} />
          </Link>

          <a
            href="#overview"
            className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all"
          >
            See Live Demo
          </a>
        </motion.div>
      </div>
    </section>
  )
}
