'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Server, Database, Radio, Key, Search, Copy, Check, ArrowRight, ShieldCheck, Cpu } from 'lucide-react'

const PIPELINE_STEPS = [
  {
    id: 1,
    title: '1. Handshake & Auth Validation',
    subtitle: 'Client → Server Handshake',
    description: 'Upon page load or login, socket client initiates WSS connection passing bearer JWT token in handshake auth object.',
    codeSnippet: `const socket = io('https://frontend-task-chatapp.onrender.com', {
  auth: { token: 'Bearer eyJhbGciOiJIUzI1Ni...' }
})`,
    badge: 'JWT Bearer',
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  },
  {
    id: 2,
    title: '2. Event Dispatch',
    subtitle: 'Client → Server Socket Emit',
    description: 'When user sends a message, client emits "message:send" payload over active WebSocket channel.',
    codeSnippet: `socket.emit('message:send', {
  conversationId: '64f8a12b...',
  content: 'Hello World!'
})`,
    badge: 'message:send',
    color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  },
  {
    id: 3,
    title: '3. Server Broadcast',
    subtitle: 'Server → Room Participants',
    description: 'Backend verifies room membership and broadcasts "message:new" payload to all connected sockets in conversation room.',
    codeSnippet: `io.to(conversationId).emit('message:new', {
  _id: 'msg_98123',
  sender: userId,
  content: 'Hello World!',
  createdAt: new Date().toISOString()
})`,
    badge: 'message:new',
    color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
  },
  {
    id: 4,
    title: '4. Zustand Store & UI Render',
    subtitle: 'Client State & Smart Scroll',
    description: 'Client listener catches "message:new", appends to Zustand store, clears local draft, and triggers smart auto-scroll if locked.',
    codeSnippet: `socket.on('message:new', (newMsg) => {
  addMessage(newMsg.conversationId, newMsg)
  if (isScrollAtBottom) scrollToBottom()
})`,
    badge: 'State Updated',
    color: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  },
]

const ENDPOINTS_DATA = [
  { method: 'POST', path: '/api/auth/login', desc: 'Single auth route for login & registration' },
  { method: 'GET', path: '/api/auth/me', desc: 'Fetches active user session profile' },
  { method: 'GET', path: '/api/users/search?q=', desc: 'Search registered users by name/phone' },
  { method: 'GET', path: '/api/conversations', desc: 'List all direct & group chats' },
  { method: 'POST', path: '/api/conversations', desc: 'Start 1-to-1 direct message room' },
  { method: 'POST', path: '/api/conversations/group', desc: 'Create new multi-user group chat' },
  { method: 'GET', path: '/api/conversations/:id/messages', desc: 'Paginated message history' },
  { method: 'POST', path: '/api/messages', desc: 'Send REST message fallback' },
  { method: 'POST', path: '/api/conversations/:id/participants', desc: 'Add members to group chat' },
  { method: 'DELETE', path: '/api/conversations/:id/participants/:userId', desc: 'Remove member or leave room' },
  { method: 'POST', path: '/api/conversations/:id/admins', desc: 'Promote member to group admin' },
  { method: 'PATCH', path: '/api/conversations/:id', desc: 'Rename group chat title' },
]

const methodStyles: Record<string, string> = {
  GET: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  POST: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  DELETE: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
  PATCH: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
}

export function ArchitectureFlow() {
  const [activeStep, setActiveStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const currentStep = PIPELINE_STEPS.find((s) => s.id === activeStep) || PIPELINE_STEPS[0]

  const filteredEndpoints = ENDPOINTS_DATA.filter(
    (ep) =>
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.method.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(`https://frontend-task-chatapp.onrender.com${path}`)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  return (
    <div className="space-y-12">
      {/* Interactive Socket Pipeline Simulation */}
      <div className="glass-card-dribbble rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Radio size={14} className="animate-pulse text-cyan-400" /> Interactive Event Flow Simulation
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">WebSocket Signal Pipeline</h3>
          </div>

          {/* Step Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-[#080d19] border border-white/10">
            {PIPELINE_STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeStep === s.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Step {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline Visual Cards Grid */}
        <div className="grid md:grid-cols-12 gap-6 items-stretch">
          {/* Left Flow Description */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <span className={`inline-block px-3 py-1 rounded-full border text-xs font-mono font-bold ${currentStep.color}`}>
                  {currentStep.badge}
                </span>

                <h4 className="text-lg font-bold text-white">{currentStep.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{currentStep.description}</p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setActiveStep((prev) => (prev % 4) + 1)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Trigger Next Step</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Live Code Display */}
          <div className="md:col-span-7 rounded-2xl bg-[#070b14] border border-white/10 p-4 font-mono text-xs overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/5">
              <span className="text-[11px] text-slate-400 font-bold">{currentStep.subtitle}</span>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Active Execution</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.pre
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-4 text-cyan-300 overflow-x-auto leading-relaxed"
              >
                <code>{currentStep.codeSnippet}</code>
              </motion.pre>
            </AnimatePresence>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-2 border-t border-white/5">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Tested & verified against production backend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive REST Endpoints Table */}
      <div className="glass-card-dribbble rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">API Endpoint Specs</h3>
            <p className="text-xs text-slate-400 mt-1">12 production endpoints tested with Swagger & Postman</p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoints or methods..."
              className="pl-9 pr-4 py-2 rounded-xl bg-[#090e1a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#070b14]/80 divide-y divide-white/5">
          {filteredEndpoints.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No matching endpoints found</div>
          ) : (
            filteredEndpoints.map((ep) => (
              <div key={`${ep.method}-${ep.path}`} className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${methodStyles[ep.method]}`}>
                    {ep.method}
                  </span>
                  <code className="text-xs text-slate-200 font-mono truncate">{ep.path}</code>
                </div>

                <div className="hidden md:block text-xs text-slate-400 truncate max-w-xs">{ep.desc}</div>

                <button
                  onClick={() => handleCopy(ep.path)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Copy Endpoint URL"
                >
                  {copiedPath === ep.path ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
