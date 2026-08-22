'use client'

import { motion } from 'motion/react'
import { MessageSquare, Users, FileText, ShieldCheck, ArrowRight } from 'lucide-react'

const FEATURE_CARDS = [
  {
    title: '1-to-1 Direct Messaging',
    desc: 'Instant bidirectional messaging powered by WebSocket engine with real-time delivery status (✓✓) and unread message counters.',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&auto=format&fit=crop&q=80',
    badge: 'Real-Time Socket',
    icon: MessageSquare,
    color: 'text-blue-500 bg-blue-50',
  },
  {
    title: 'Group Rooms & Admin Controls',
    desc: 'Create multi-user group chat rooms, invite participants, manage group titles, and promote members to group admins with live privilege updates.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&auto=format&fit=crop&q=80',
    badge: 'Group Channels',
    icon: Users,
    color: 'text-purple-500 bg-purple-50',
  },
  {
    title: 'Draft Persistence & Auto-Save',
    desc: 'Unsent message drafts are automatically saved in local storage per contact/room, ensuring your unsent thoughts are never lost.',
    img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=250&auto=format&fit=crop&q=80',
    badge: 'Local Auto-Save',
    icon: FileText,
    color: 'text-amber-500 bg-amber-50',
  },
  {
    title: 'JWT Auth & Guest Quick Access',
    desc: 'Fast, stateless JWT token authentication with single-click guest login, phone/username account creation, and instant session resume.',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=250&auto=format&fit=crop&q=80',
    badge: 'Secure Handshake',
    icon: ShieldCheck,
    color: 'text-emerald-500 bg-emerald-50',
  },
]

export function FeatureCardsSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-royal-blue bg-diagonal-pattern text-white px-4 sm:px-8 font-['DM_Sans',sans-serif] relative overflow-hidden">
      
      {/* Background Ambient Glow Circles */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-cyan-300 tracking-widest">
            <span className="w-5 h-0.5 bg-cyan-300 rounded-full" />
            <span>Core Features</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Everything Built in <br />
            NexusChat Engine
          </h2>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Real features designed and implemented for high performance, reliability, and smooth real-time communication.
          </p>
        </motion.div>

        {/* 4 Cards Grid with Spring Physics & Staggered Viewport Entrance */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_CARDS.map((card, i) => {
            const IconComponent = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  opacity: { duration: 0.5, delay: i * 0.1 },
                  y: { duration: 0.5, delay: i * 0.1 },
                  scale: { duration: 0.3 },
                }}
                className="rounded-2xl bg-white text-slate-900 overflow-hidden shadow-2xl flex flex-col justify-between group transition-all duration-300 border border-slate-100 hover:shadow-cyan-400/20"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                    {/* Top Left Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/70 text-white text-[10px] font-extrabold backdrop-blur-md border border-white/20">
                      {card.badge}
                    </div>

                    {/* Top Right Icon */}
                    <div className={`absolute top-3 right-3 p-2.5 rounded-xl bg-white/95 backdrop-blur-md shadow-lg ${card.color}`}>
                      <IconComponent size={18} />
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <span className="text-xs font-black text-blue-600 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    <span>Explore feature</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
