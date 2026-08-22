'use client'

import { motion } from 'motion/react'
import { Zap, ShieldCheck, Database, TrendingUp } from 'lucide-react'

export function AnalyticsSection() {
  return (
    <section id="analytics" className="py-24 sm:py-32 bg-[#f8fafc] text-slate-900 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900">
              Connections That <br />
              Keep Growing!
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every second, thousands of real-time WebSocket messages are delivered with 75ms latency. Our architecture scales effortlessly to keep teams connected.
            </p>
          </div>
        </div>

        {/* Growth Bar Chart Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/80 shadow-card-bubbly relative overflow-hidden"
        >
          {/* Top Metric Row */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-2">
                <TrendingUp size={16} /> Growth Rate Year-Over-Year
              </div>
              <div className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
                96.4%
              </div>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Real-time active users &amp; message volume
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="grid grid-cols-4 gap-4 sm:gap-8 items-end h-64 sm:h-72 pt-6">
            
            {/* Bar 1 */}
            <div className="space-y-3 text-center group">
              <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">2.1k</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '35%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="w-full bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors"
              />
              <span className="text-[11px] font-semibold text-slate-500 block">Q1</span>
            </div>

            {/* Bar 2 */}
            <div className="space-y-3 text-center group">
              <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">6.4k</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '55%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full bg-blue-200 rounded-xl group-hover:bg-blue-300 transition-colors"
              />
              <span className="text-[11px] font-semibold text-slate-500 block">Q2</span>
            </div>

            {/* Bar 3 */}
            <div className="space-y-3 text-center group">
              <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">13.8k</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '75%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full bg-blue-300 rounded-xl group-hover:bg-blue-400 transition-colors"
              />
              <span className="text-[11px] font-semibold text-slate-500 block">Q3</span>
            </div>

            {/* Bar 4 (Highest) */}
            <div className="space-y-3 text-center group">
              <span className="text-xs font-bold text-blue-600">24.5k</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '95%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:bg-blue-700 transition-colors"
              />
              <span className="text-[11px] font-bold text-blue-600 block">Q4 (Live)</span>
            </div>

          </div>
        </motion.div>

        {/* 3 Bottom Feature Pills Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-card-bubbly transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Instant Messaging</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bi-directional WebSocket event delivery keeps your 1-to-1 and group chats in sync with 75ms latency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-card-bubbly transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Secure Communication</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Stateless JWT authentication and WSS handshake authorization keep all room communications protected.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-card-bubbly transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Database size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Draft Persistence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Switch conversations or reload the page — your unsent draft is saved locally so you never lose a thought.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}
