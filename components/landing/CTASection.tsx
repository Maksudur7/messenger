'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, MessageSquare, Send, Globe, Share2, Code } from 'lucide-react'


export function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-white px-4 sm:px-8 font-['DM_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-14 rounded-2xl bg-[#2dd4bf] shadow-card-bubbly flex flex-col md:flex-row items-center justify-between gap-8 text-slate-900"

        >
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Everything you need to know <br />
              for your business growth
            </h2>
            <p className="text-xs sm:text-sm text-teal-950 font-medium">
              Start chatting in real-time — zero setup fee, no credit card required.
            </p>
          </div>

          <div>
            <Link
              href="/chat"
              id="cta-launch-btn"
              className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
            >
              <span>Try App Now</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="bg-royal-blue bg-diagonal-pattern text-white pt-16 pb-12 px-4 sm:px-8 border-t border-white/10 font-['DM_Sans',sans-serif]">

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                <MessageSquare size={18} className="text-cyan-300 fill-cyan-300/30" />
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight">WhatChat</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Instant 1-to-1 &amp; group messaging app with smart auto-scroll, draft persistence, and live Socket.io sync.
            </p>
          </div>

          {/* Nav Col 1 */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="text-xs font-black uppercase text-cyan-300 tracking-wider">PRODUCTS</div>
            <ul className="space-y-2 text-xs text-white/80 font-medium">
              <li><a href="#overview" className="hover:text-white transition-colors">Direct Messaging</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Group Channels</a></li>
              <li><a href="#integrations" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>

          </div>

          {/* Nav Col 2 */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="text-xs font-black uppercase text-cyan-300 tracking-wider">RESOURCES</div>
            <ul className="space-y-2 text-xs text-white/80 font-medium">
              <li><a href="/docs/API_DOCUMENTATION.md" target="_blank" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Help &amp; FAQ</a></li>
              <li><a href="/chat" className="hover:text-white transition-colors">Live Web App</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Account Auth</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="col-span-2 md:col-span-4 space-y-3">
            <div className="text-xs font-black uppercase text-cyan-300 tracking-wider">GET IN TOUCH</div>
            <p className="text-xs text-white/80">Subscribe to receive product updates and API documentation release notes.</p>
            
            <div className="flex gap-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email..."
                className="bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/50 focus:outline-none focus:border-cyan-300 flex-1"
              />
              <button className="px-4 py-2 rounded-xl bubbly-badge-cyan hover:bg-teal-300 text-xs font-bold text-slate-900 transition-all flex items-center justify-center">
                <Send size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>© 2026 WhatChat. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" className="hover:text-white transition-colors" aria-label="Github"><Code size={16} /></a>
            <a href="https://twitter.com" target="_blank" className="hover:text-white transition-colors" aria-label="Web"><Globe size={16} /></a>
            <a href="https://linkedin.com" target="_blank" className="hover:text-white transition-colors" aria-label="Share"><Share2 size={16} /></a>
          </div>
        </div>


      </div>
    </footer>
  )
}


