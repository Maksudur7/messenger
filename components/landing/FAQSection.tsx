'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    id: 1,
    q: 'How does real-time messaging work in NexusChat?',
    a: 'Messaging is driven by a custom WebSocket engine that handles instant 1-to-1 direct messages and group room broadcasts with live delivery checkmarks (✓✓) and unread message counters.',
  },
  {
    id: 2,
    q: 'How do group rooms and admin promotions work?',
    a: 'Any user can create a group room, invite participants, update the room title live, and promote group members to admin status with instant privilege enforcement.',
  },
  {
    id: 3,
    q: 'Are unsent message drafts automatically saved?',
    a: 'Yes! NexusChat implements LocalStorage Draft Persistence. If you type a message and switch contacts or reload the browser, your unsent draft is restored automatically when you return.',
  },
  {
    id: 4,
    q: 'How does authentication work for new and returning users?',
    a: 'Authentication uses stateless JWT tokens. Users can log in or register instantly via phone number or username, or use 1-click Guest Access for immediate testing.',
  },
  {
    id: 5,
    q: 'Does NexusChat support cross-device responsiveness?',
    a: 'Yes, the user interface is built with Tailwind CSS and Next.js 16, offering seamless responsive layouts across smartphones, tablets, laptops, and desktop displays.',
  },
]

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1)

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#f8fafc] text-slate-900 px-4 sm:px-8 border-b border-slate-200/60 font-['DM_Sans',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-blue-100/70 text-blue-700 text-xs font-black tracking-wider uppercase">
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Technical and functional details about how NexusChat real-time engine works.
          </p>
        </motion.div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openId === faq.id
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-card-bubbly transition-all"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left font-extrabold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/60"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Footer Support Link */}
        <div className="text-center text-xs text-slate-500 pt-4">
          Want to test real messaging? Launch the <a href="/chat" className="font-bold text-blue-600 hover:underline">NexusChat App</a> right now.
        </div>

      </div>
    </section>
  )
}
