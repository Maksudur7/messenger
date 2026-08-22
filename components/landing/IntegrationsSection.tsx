'use client'

import { motion } from 'motion/react'
import { Zap, Cpu, Layers, ShieldCheck, HardDrive, Layout, Code, Share2 } from 'lucide-react'

const TECH_STACK = [
  {
    name: 'WebSocket Protocol',
    category: 'Real-Time Transport',
    desc: 'Bi-directional socket connections delivering messages with sub-100ms latency.',
    icon: Zap,
    color: 'text-amber-500 bg-amber-50 border-amber-200',
  },
  {
    name: 'Next.js 16 (Turbopack)',
    category: 'Full-Stack Framework',
    desc: 'App Router architecture with Turbopack for ultra-fast builds and page rendering.',
    icon: Cpu,
    color: 'text-slate-900 bg-slate-100 border-slate-300',
  },
  {
    name: 'React 19 & Framer Motion',
    category: 'UI & Motion Engine',
    desc: 'Declarative component architecture paired with 60fps physics-driven animations.',
    icon: Layers,
    color: 'text-blue-500 bg-blue-50 border-blue-200',
  },
  {
    name: 'JWT Stateless Auth',
    category: 'Handshake Security',
    desc: 'Secure token authentication with instant guest access and session resume.',
    icon: ShieldCheck,
    color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  },
  {
    name: 'LocalStorage Draft Engine',
    category: 'Offline Persistence',
    desc: 'Unsent message drafts automatically saved in local memory per recipient/room.',
    icon: HardDrive,
    color: 'text-purple-500 bg-purple-50 border-purple-200',
  },
  {
    name: 'Tailwind CSS System',
    category: 'Responsive Styling',
    desc: 'Custom design system with 16px card radii and harmonious color palettes.',
    icon: Layout,
    color: 'text-cyan-500 bg-cyan-50 border-cyan-200',
  },
  {
    name: 'TypeScript 5',
    category: 'Strict Type Safety',
    desc: 'Type-safe state management preventing runtime errors and contract breaks.',
    icon: Code,
    color: 'text-indigo-500 bg-indigo-50 border-indigo-200',
  },
  {
    name: 'Socket Reconnection',
    category: 'Resilience Protocol',
    desc: 'Automatic heartbeat monitoring and seamless socket reconnection on network drops.',
    icon: Share2,
    color: 'text-rose-500 bg-rose-50 border-rose-200',
  },
]

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-24 sm:py-32 bg-white text-slate-900 px-4 sm:px-8 border-b border-slate-100 font-['DM_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-3 text-xs font-black uppercase text-blue-600 tracking-widest">
            <span className="w-4 h-[2px] bg-blue-600 rounded-full" />
            <span>Architecture &amp; Tech Stack</span>
            <span className="w-4 h-[2px] bg-blue-600 rounded-full" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Powered by Modern <br />
            Infrastructure Engine
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Built using industry-standard web technologies to ensure high performance, security, and stateless scalability.
          </p>
        </motion.div>

        {/* 8 Tech Stack Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECH_STACK.map((item, i) => {
            const IconComp = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-card-bubbly transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold flex-shrink-0 shadow-sm ${item.color}`}>
                    <IconComp size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
