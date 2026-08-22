'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, UserPlus, Phone, MessageSquare, Check, Sparkles } from 'lucide-react'

export function CloserSection() {
  return (
    <section id="closer" className="py-24 sm:py-32 bg-white text-slate-900 px-4 sm:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Content */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full inline-block">
              STAY CONNECTED

            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Closer to the People <br />
              Who Matter
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
              Stay connected with your favorite contacts, active group channels, and team members in one place with zero lag or missing notifications.
            </p>
          </div>

          <div>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Explore Chat</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-10 pt-6 border-t border-slate-100">
            <div>
              <div className="text-3xl font-black text-slate-900">900k+</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">Messages Sent</div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">53k+</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">Users Connected</div>
            </div>
          </div>
        </div>

        {/* Right Column Floating Contact List Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-6"
        >
          {/* Outer Cyan Frame */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#2dd4bf] shadow-card-bubbly relative">
            
            {/* White Inner Contact List Card */}
            <div className="rounded-2xl bg-white p-6 shadow-xl space-y-4">

              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
                  CONTACT LIST
                </span>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  1,420 Active
                </span>
              </div>

              {/* Contact Items */}
              <div className="space-y-3">
                
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-blue-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=80" alt="Alice" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Alice Vance</div>
                      <div className="text-[11px] text-slate-500">Design Systems Lead</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-blue-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=80" alt="Bob" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Bob Miller</div>
                      <div className="text-[11px] text-slate-500">Senior Frontend Dev</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-blue-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop&q=80" alt="Sarah" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Sarah Jenkins</div>
                      <div className="text-[11px] text-slate-500">Product Designer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
