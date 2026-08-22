'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { LandingFooter } from '@/components/landing/CTASection'
import {
  MessageSquare,
  Search,
  Code2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Server,
  Radio,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Terminal,
  Play,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Lock,
  Layers,
  Globe,
  Sliders,
  Send,
  UserCheck,
  Users,
  Activity
} from 'lucide-react'

// --- ENDPOINT DATA TYPES ---

interface Endpoint {
  id: string
  category: string
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH'
  path: string
  title: string
  authRequired: boolean
  description: string
  params?: { name: string; type: string; required: boolean; description: string }[]
  requestBody?: string
  responseBody: string
  curlSnippet: string
  jsSnippet: string
  testable: boolean
  defaultTestPayload?: Record<string, unknown>
}

const CATEGORIES = [
  { id: 'all', name: 'All Endpoints', icon: Layers, count: 10 },
  { id: 'auth', name: 'Authentication', icon: ShieldCheck, count: 2 },
  { id: 'users', name: 'User Management', icon: UserCheck, count: 1 },
  { id: 'conversations', name: 'Conversations', icon: MessageSquare, count: 3 },
  { id: 'messages', name: 'Messaging', icon: Send, count: 1 },
  { id: 'groups', name: 'Group Channels', icon: Users, count: 2 },
  { id: 'system', name: 'System & Health', icon: Activity, count: 1 },
  { id: 'socket', name: 'Socket.io Events', icon: Radio, count: 3 },
  { id: 'quirks', name: 'API Quirks & Notes', icon: AlertTriangle, count: 5 }
]

const ENDPOINTS: Endpoint[] = [
  {
    id: 'auth-login',
    category: 'auth',
    method: 'POST',
    path: '/api/auth/login',
    title: 'Single-Step Auth & Registration',
    authRequired: false,
    description: 'Log in an existing account or automatically register a new user using phone number and name. Returns a 7-day JWT token.',
    params: [
      { name: 'phone', type: 'string', required: true, description: 'User phone number (e.g., "+15551234567")' },
      { name: 'name', type: 'string', required: true, description: 'Display name for the account' }
    ],
    requestBody: JSON.stringify({ phone: '+15551234567', name: 'Ada Lovelace' }, null, 2),
    responseBody: JSON.stringify({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        _id: '6a882468e5d6aac97521e25e',
        name: 'Ada Lovelace',
        phone: '+15551234567',
        createdAt: '2026-08-21T10:11:52.529Z'
      }
    }, null, 2),
    curlSnippet: `curl -X POST https://frontend-task-chatapp.onrender.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+15551234567", "name": "Ada Lovelace"}'`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: '+15551234567', name: 'Ada Lovelace' })
});
const data = await res.json();`,
    testable: true,
    defaultTestPayload: { phone: '+15551234567', name: 'Ada Lovelace' }
  },
  {
    id: 'auth-me',
    category: 'auth',
    method: 'GET',
    path: '/api/auth/me',
    title: 'Fetch Current Profile',
    authRequired: true,
    description: 'Retrieves user metadata for the active session matching the provided Bearer token.',
    responseBody: JSON.stringify({
      _id: '6a882468e5d6aac97521e25e',
      name: 'Ada Lovelace',
      phone: '+15551234567',
      createdAt: '2026-08-21T10:11:52.529Z'
    }, null, 2),
    curlSnippet: `curl -X GET https://frontend-task-chatapp.onrender.com/api/auth/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/api/auth/me', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});
const user = await res.json();`,
    testable: false
  },
  {
    id: 'users-search',
    category: 'users',
    method: 'GET',
    path: '/api/users/search?q={query}',
    title: 'Search Users',
    authRequired: true,
    description: 'Search registered users by partial name or phone number. Client filters out active user by ID.',
    params: [
      { name: 'q', type: 'string', required: true, description: 'Search term for name or phone' }
    ],
    responseBody: JSON.stringify([
      { _id: '6a8826abe5d6aac97521e28f', name: 'Alice', phone: '+12345678901' },
      { _id: '6a8826dce5d6aac97521e2ba', name: 'Alice Smith', phone: '+11122233344' }
    ], null, 2),
    curlSnippet: `curl -X GET "https://frontend-task-chatapp.onrender.com/api/users/search?q=Alice" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/api/users/search?q=Alice', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});
const users = await res.json();`,
    testable: false
  },
  {
    id: 'conversations-list',
    category: 'conversations',
    method: 'GET',
    path: '/api/conversations',
    title: 'Get User Conversations',
    authRequired: true,
    description: 'Fetches all 1-to-1 direct and group conversations for the authenticated user, ordered by updatedAt descending.',
    responseBody: JSON.stringify({
      data: [
        {
          _id: '6a887e5fe5d6aac975234ef2',
          type: 'direct',
          participant: { _id: '6a887e5de5d6aac975234ed5', name: 'Bob', phone: '+19998887702' },
          lastMessage: { text: 'Hey Bob!', sender: '6a8857e3e5d6aac975225707', createdAt: '2026-08-21T16:35:44Z' },
          updatedAt: '2026-08-21T16:35:44.566Z'
        },
        {
          _id: '6a887e62e5d6aac975234f07',
          type: 'group',
          name: 'Engineering Team',
          createdBy: '6a8857e3e5d6aac975225707',
          admins: ['6a8857e3e5d6aac975225707'],
          participants: [
            { _id: '6a8857e3e5d6aac975225707', name: 'Alice', phone: '+19998887701' },
            { _id: '6a887e5de5d6aac975234ed5', name: 'Bob', phone: '+19998887702' }
          ],
          lastMessage: {},
          updatedAt: '2026-08-21T16:35:46.603Z'
        }
      ]
    }, null, 2),
    curlSnippet: `curl -X GET https://frontend-task-chatapp.onrender.com/api/conversations \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/api/conversations', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});
const { data } = await res.json();`,
    testable: false
  },
  {
    id: 'conversations-create-direct',
    category: 'conversations',
    method: 'POST',
    path: '/api/conversations',
    title: 'Start 1-to-1 Direct Chat',
    authRequired: true,
    description: 'Creates a direct conversation with a target user ID or returns existing conversation object.',
    params: [
      { name: 'userId', type: 'string', required: true, description: 'Target user MongoDB ObjectId' }
    ],
    requestBody: JSON.stringify({ userId: '6a887e5de5d6aac975234ed5' }, null, 2),
    responseBody: JSON.stringify({
      _id: '6a887e5fe5d6aac975234ef2',
      participants: ['6a8857e3e5d6aac975225707', '6a887e5de5d6aac975234ed5'],
      createdAt: '2026-08-21T16:35:43.344Z'
    }, null, 2),
    curlSnippet: `curl -X POST https://frontend-task-chatapp.onrender.com/api/conversations \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"userId": "6a887e5de5d6aac975234ed5"}'`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/api/conversations', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ userId: '6a887e5de5d6aac975234ed5' })
});
const directChat = await res.json();`,
    testable: false
  },
  {
    id: 'conversations-messages',
    category: 'conversations',
    method: 'GET',
    path: '/api/conversations/{id}/messages',
    title: 'Paginated Messages History',
    authRequired: true,
    description: 'Retrieves chronological messages for a conversation. Pass "before" cursor for older pages.',
    params: [
      { name: 'id', type: 'string', required: true, description: 'Conversation ID' },
      { name: 'before', type: 'string', required: false, description: 'Message ID cursor for pagination' },
      { name: 'limit', type: 'number', required: false, description: 'Number of messages per page (default: 20)' }
    ],
    responseBody: JSON.stringify({
      messages: [
        {
          _id: '6a887e60e5d6aac975234efc',
          conversation: '6a887e5fe5d6aac975234ef2',
          sender: '6a8857e3e5d6aac975225707',
          text: 'Hello Bob! How are you?',
          createdAt: '2026-08-21T16:35:44.331Z'
        }
      ],
      hasMore: false
    }, null, 2),
    curlSnippet: `curl -X GET "https://frontend-task-chatapp.onrender.com/api/conversations/6a887e5fe5d6aac975234ef2/messages?limit=20" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/api/conversations/6a887e5fe5d6aac975234ef2/messages?limit=20', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});
const { messages, hasMore } = await res.json();`,
    testable: false
  },
  {
    id: 'messages-send',
    category: 'messages',
    method: 'POST',
    path: '/api/messages',
    title: 'Send Message (REST API)',
    authRequired: true,
    description: 'Sends a message to direct or group chat via REST. Triggers message:new WebSocket broadcast automatically.',
    params: [
      { name: 'conversationId', type: 'string', required: true, description: 'Target conversation ID' },
      { name: 'text', type: 'string', required: true, description: 'Message text content' }
    ],
    requestBody: JSON.stringify({ conversationId: '6a887e5fe5d6aac975234ef2', text: 'Hello team!' }, null, 2),
    responseBody: JSON.stringify({
      _id: '6a887e60e5d6aac975234efc',
      conversation: '6a887e5fe5d6aac975234ef2',
      sender: '6a8857e3e5d6aac975225707',
      text: 'Hello team!',
      createdAt: '2026-08-21T16:35:44.331Z'
    }, null, 2),
    curlSnippet: `curl -X POST https://frontend-task-chatapp.onrender.com/api/messages \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"conversationId": "6a887e5fe5d6aac975234ef2", "text": "Hello team!"}'`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/api/messages', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ conversationId: '6a887e5fe5d6aac975234ef2', text: 'Hello team!' })
});
const message = await res.json();`,
    testable: false
  },
  {
    id: 'groups-create',
    category: 'groups',
    method: 'POST',
    path: '/api/conversations/group',
    title: 'Create Group Channel',
    authRequired: true,
    description: 'Creates a multi-participant group channel. Creator is designated group admin.',
    params: [
      { name: 'name', type: 'string', required: true, description: 'Group display name' },
      { name: 'participantIds', type: 'array', required: true, description: 'Array of user IDs to include' }
    ],
    requestBody: JSON.stringify({
      name: 'Project Alpha',
      participantIds: ['6a887e5de5d6aac975234ed5', '6a887e5ee5d6aac975234ee4']
    }, null, 2),
    responseBody: JSON.stringify({
      _id: '6a887e62e5d6aac975234f07',
      type: 'group',
      name: 'Project Alpha',
      createdBy: '6a8857e3e5d6aac975225707',
      admins: ['6a8857e3e5d6aac975225707'],
      participants: [
        { _id: '6a8857e3e5d6aac975225707', name: 'Alice', phone: '+19998887701' },
        { _id: '6a887e5de5d6aac975234ed5', name: 'Bob', phone: '+19998887702' }
      ],
      createdAt: '2026-08-21T16:35:46.603Z'
    }, null, 2),
    curlSnippet: `curl -X POST https://frontend-task-chatapp.onrender.com/api/conversations/group \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Project Alpha", "participantIds": ["6a887e5de5d6aac975234ed5"]}'`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/api/conversations/group', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Project Alpha', participantIds: ['6a887e5de5d6aac975234ed5'] })
});
const group = await res.json();`,
    testable: false
  },
  {
    id: 'system-health',
    category: 'system',
    method: 'GET',
    path: '/health',
    title: 'Server Health Check',
    authRequired: false,
    description: 'Root level health check endpoint. Returns status ok when server is responsive.',
    responseBody: JSON.stringify({ status: 'ok' }, null, 2),
    curlSnippet: `curl -X GET https://frontend-task-chatapp.onrender.com/health`,
    jsSnippet: `const res = await fetch('https://frontend-task-chatapp.onrender.com/health');
const health = await res.json();`,
    testable: true
  }
]

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Record<string, 'curl' | 'js' | 'json'>>({})

  // Set document title
  useEffect(() => {
    document.title = 'API Documentation — WhatChat'
  }, [])

  // Live API Sandbox State
  const [testingEndpointId, setTestingEndpointId] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<Record<string, { status: number; data: unknown }>>({})
  const [isTestLoading, setIsTestLoading] = useState<string | null>(null)

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filter endpoints
  const filteredEndpoints = ENDPOINTS.filter(ep => {
    const matchesCategory = selectedCategory === 'all' || ep.category === selectedCategory
    const matchesSearch =
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.method.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Live test executor
  const handleExecuteLiveTest = async (ep: Endpoint) => {
    setIsTestLoading(ep.id)
    try {
      if (ep.id === 'system-health') {
        const res = await fetch('https://frontend-task-chatapp.onrender.com/health')
        const data = await res.json()
        setTestResult(prev => ({ ...prev, [ep.id]: { status: res.status, data } }))
      } else if (ep.id === 'auth-login') {
        const payload = ep.defaultTestPayload || { phone: '+15551234567', name: 'Demo User' }
        const res = await fetch('https://frontend-task-chatapp.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        setTestResult(prev => ({ ...prev, [ep.id]: { status: res.status, data } }))
      }
    } catch (err: unknown) {
      setTestResult(prev => ({
        ...prev,
        [ep.id]: { status: 500, data: { error: err instanceof Error ? err.message : 'Network error' } }
      }))
    } finally {
      setIsTestLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b141a] text-[#e9edef] font-['DM_Sans',sans-serif] selection:bg-[#00a884] selection:text-white">
      
      {/* --- INTEGRATED LANDING NAVBAR --- */}
      <LandingNavbar />

      {/* --- HERO SECTION WITH DRIBBBLE GLASS STYLING --- */}
      <section className="pt-28 pb-16 px-4 sm:px-8 bg-royal-blue bg-diagonal-pattern border-b border-white/10 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-bold shadow-sm backdrop-blur-md"
            >
              <Sparkles size={14} className="animate-spin-slow" />
              <span>Interactive Developer API Console v1.0</span>
            </motion.div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black/30 border border-white/15 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>REST &amp; Socket.io Online</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              WhatChat <span className="gradient-text-cyan">API Specifications</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-3xl leading-relaxed font-medium">
              Explore complete endpoint contracts, test live HTTP requests, view Socket.io event schemas, and inspect empirical backend quirks.
            </p>
          </motion.div>

          {/* Quick Config Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono"
          >
            <div className="bg-slate-900/80 border border-white/15 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md shadow-lg">
              <Globe size={14} className="text-cyan-300" />
              <span className="text-white/60">REST Base:</span>
              <span className="text-cyan-300 font-bold">https://frontend-task-chatapp.onrender.com/api</span>
            </div>

            <div className="bg-slate-900/80 border border-white/15 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md shadow-lg">
              <Radio size={14} className="text-emerald-400" />
              <span className="text-white/60">WebSocket Origin:</span>
              <span className="text-emerald-400 font-bold">https://frontend-task-chatapp.onrender.com</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- MAIN EXPLORER AREA --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Search Box */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8696a0]" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#202c33] border border-[#222d34] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-all shadow-inner"
            />
          </div>

          {/* Categories Pill Menu */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8696a0] px-3 pb-2 flex items-center justify-between">
              <span>Categories</span>
              <Sliders size={12} />
            </div>

            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#00a884] text-white shadow-lg shadow-[#00a884]/20 scale-[1.02]'
                      : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#202c33]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{cat.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#2a3942] text-[#8696a0]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Bearer Token Setup Guide */}
          <div className="p-4 rounded-2xl bg-[#202c33] border border-[#222d34] space-y-2.5 text-xs">
            <div className="font-bold text-[#e9edef] flex items-center gap-2">
              <Lock size={15} className="text-[#00a884]" />
              <span>JWT Authentication</span>
            </div>
            <p className="text-[#8696a0] text-[11px] leading-relaxed">
              Protected endpoints require the JWT token in HTTP headers:
            </p>
            <div className="p-2.5 rounded-xl bg-[#111b21] border border-[#222d34] font-mono text-[10px] text-[#06cf9c] break-all">
              Authorization: Bearer &lt;jwt_token&gt;
            </div>
          </div>

        </aside>

        {/* MAIN API CONTENT AREA */}
        <main className="lg:col-span-9 space-y-10">
          
          {/* OVERVIEW / SOCKET.IO / QUIRKS CARDS */}
          {(selectedCategory === 'all' || selectedCategory === 'socket' || selectedCategory === 'quirks') && (
            <div className="space-y-8">
              
              {/* Architecture Explanation */}
              {selectedCategory === 'all' && (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#202c33] border border-[#222d34] space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-[#00a884] font-bold text-sm">
                    <Zap size={18} />
                    <span>Hybrid Network Architecture</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#e9edef] tracking-tight">
                    REST Operations &amp; Socket.io Real-Time Synchronization
                  </h2>
                  <p className="text-[#8696a0] text-xs sm:text-sm leading-relaxed">
                    WhatChat couples a stateless HTTP REST API for data persistence with a Socket.io WebSocket server at root origin for instantaneous message broadcasting and room state synchronizations.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] space-y-2">
                      <div className="font-bold text-[#06cf9c] text-xs flex items-center gap-2">
                        <Server size={14} />
                        <span>REST Layer (/api)</span>
                      </div>
                      <p className="text-[#8696a0] text-[11px] leading-relaxed">
                        Handles user authentication, recipient search, fetching historical conversations, message history pagination, and group administration.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] space-y-2">
                      <div className="font-bold text-[#2dd4bf] text-xs flex items-center gap-2">
                        <Radio size={14} />
                        <span>WebSocket Layer (Root Host)</span>
                      </div>
                      <p className="text-[#8696a0] text-[11px] leading-relaxed">
                        Maintains persistent bi-directional socket listening to <code className="text-[#06cf9c]">message:new</code> and <code className="text-[#06cf9c]">conversation:updated</code> events.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Socket.io Specifications */}
              {(selectedCategory === 'all' || selectedCategory === 'socket') && (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#202c33] border border-[#222d34] space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#222d34] pb-4">
                    <h2 className="text-xl font-bold text-[#e9edef] flex items-center gap-2.5">
                      <Radio className="text-[#06cf9c]" size={20} />
                      <span>Socket.io Event Specification</span>
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-[#00a884]/20 border border-[#00a884]/40 text-[#06cf9c] text-xs font-mono font-bold">
                      WebSocket Protocol
                    </span>
                  </div>

                  {/* Code snippet */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#8696a0]">Client Connection Handshake</div>
                    <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] font-mono text-xs text-[#e9edef] space-y-1.5">
                      <p className="text-[#8696a0]">// Connect to root origin (NOT /api):</p>
                      <p className="text-[#38bdf8]">import &#123; io &#125; from &apos;socket.io-client&apos;;</p>
                      <p className="text-[#06cf9c]">
                        const socket = io(&apos;https://frontend-task-chatapp.onrender.com&apos;, &#123;<br />
                        &nbsp;&nbsp;auth: &#123; token: &apos;YOUR_JWT_BEARER_TOKEN&apos; &#125;<br />
                        &#125;);
                      </p>
                    </div>
                  </div>

                  {/* Events Table */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#8696a0]">Real-Time Event Table</div>
                    <div className="overflow-x-auto border border-[#222d34] rounded-xl">
                      <table className="w-full text-left text-xs text-[#e9edef]">
                        <thead className="bg-[#111b21] text-[#8696a0] font-bold border-b border-[#222d34]">
                          <tr>
                            <th className="p-3">Direction</th>
                            <th className="p-3">Event Name</th>
                            <th className="p-3">Payload Structure</th>
                            <th className="p-3">Behavior</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222d34] bg-[#202c33]">
                          <tr>
                            <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">Client → Server</span></td>
                            <td className="p-3 font-mono text-[#38bdf8] font-bold">message:send</td>
                            <td className="p-3 font-mono text-[#8696a0]">&#123; conversationId, text &#125;</td>
                            <td className="p-3 text-[#8696a0]">Sends message over socket alternative to POST /messages.</td>
                          </tr>
                          <tr>
                            <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Server → Client</span></td>
                            <td className="p-3 font-mono text-[#06cf9c] font-bold">message:new</td>
                            <td className="p-3 font-mono text-[#8696a0]">Message Object</td>
                            <td className="p-3 text-[#8696a0]">Fired on new message in any conversation user is part of.</td>
                          </tr>
                          <tr>
                            <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Server → Client</span></td>
                            <td className="p-3 font-mono text-[#06cf9c] font-bold">conversation:updated</td>
                            <td className="p-3 font-mono text-[#8696a0]">Group Conversation</td>
                            <td className="p-3 text-[#8696a0]">Fired on group rename, member additions, or admin promotions.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* API Quirks Section */}
              {(selectedCategory === 'all' || selectedCategory === 'quirks') && (
                <div className="p-6 sm:p-8 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <AlertTriangle size={18} />
                    <span>Observed API Quirks &amp; Client Resolution Strategies</span>
                  </div>
                  <p className="text-[#8696a0] text-xs sm:text-sm leading-relaxed">
                    Through live endpoint analysis, we encountered specific backend behaviors and built deterministic client handling patterns:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] space-y-2">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <ChevronRight size={14} />
                        <span>Minimal Direct Chat Response</span>
                      </div>
                      <p className="text-[#8696a0] text-[11px]">
                        <code className="text-amber-200 font-mono">POST /conversations</code> returns minimal object <code className="text-[#e9edef]">&#123; _id, participants, createdAt &#125;</code> missing <code className="text-[#e9edef]">type</code> and <code className="text-[#e9edef]">participant</code> sub-objects.
                      </p>
                      <p className="text-[#06cf9c] text-[10px] font-bold">💡 Solution: Client re-fetches full list via api.getConversations().</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] space-y-2">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <ChevronRight size={14} />
                        <span>Empty lastMessage Objects</span>
                      </div>
                      <p className="text-[#8696a0] text-[11px]">
                        New direct and group chats return <code className="text-[#e9edef]">lastMessage: &#123;&#125;</code> (empty object) instead of null or missing key.
                      </p>
                      <p className="text-[#06cf9c] text-[10px] font-bold">💡 Solution: Defensive optional chaining (`lastMessage?.text`) used throughout store.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] space-y-2">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <ChevronRight size={14} />
                        <span>User Search Self-Inclusion</span>
                      </div>
                      <p className="text-[#8696a0] text-[11px]">
                        <code className="text-amber-200 font-mono">GET /users/search</code> includes active user in search results.
                      </p>
                      <p className="text-[#06cf9c] text-[10px] font-bold">💡 Solution: Filter out results matching active user ID before rendering.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] space-y-2">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <ChevronRight size={14} />
                        <span>Root Endpoint Routing</span>
                      </div>
                      <p className="text-[#8696a0] text-[11px]">
                        Socket server lives at root origin, and <code className="text-[#e9edef]">GET /health</code> is at root, not `/api/health`.
                      </p>
                      <p className="text-[#06cf9c] text-[10px] font-bold">💡 Solution: Separated API base URL from root socket host origin.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ENDPOINT CARDS */}
          <div className="space-y-8">
            {filteredEndpoints.map(ep => {
              const currentTab = activeTab[ep.id] || 'curl'
              const testData = testResult[ep.id]
              const isLoading = isTestLoading === ep.id

              return (
                <motion.div
                  key={ep.id}
                  id={ep.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 sm:p-8 rounded-2xl bg-[#202c33] border border-[#222d34] space-y-6 shadow-xl hover:border-[#00a884]/40 transition-all"
                >
                  {/* Card Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222d34]">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider ${
                          ep.method === 'GET'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : ep.method === 'POST'
                            ? 'bg-[#00a884]/20 text-[#06cf9c] border border-[#00a884]/40'
                            : ep.method === 'DELETE'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-sm sm:text-base font-mono text-[#e9edef] font-bold">{ep.path}</code>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {ep.authRequired ? (
                        <span className="px-3 py-1 rounded-full bg-[#00a884]/15 border border-[#00a884]/30 text-[#06cf9c] font-semibold flex items-center gap-1.5">
                          <ShieldCheck size={13} />
                          <span>Bearer Token Required</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-[#111b21] text-[#8696a0] font-semibold border border-[#222d34]">
                          Public Endpoint
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#e9edef]">{ep.title}</h3>
                    <p className="text-xs sm:text-sm text-[#8696a0] leading-relaxed">{ep.description}</p>
                  </div>

                  {/* Parameters Table */}
                  {ep.params && ep.params.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#8696a0]">Parameters &amp; Schema</div>
                      <div className="overflow-x-auto border border-[#222d34] rounded-xl">
                        <table className="w-full text-left text-xs text-[#e9edef]">
                          <thead className="bg-[#111b21] text-[#8696a0] font-bold border-b border-[#222d34]">
                            <tr>
                              <th className="p-3">Field Name</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Required</th>
                              <th className="p-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#222d34] bg-[#202c33]">
                            {ep.params.map(p => (
                              <tr key={p.name}>
                                <td className="p-3 font-mono text-[#06cf9c] font-bold">{p.name}</td>
                                <td className="p-3 font-mono text-[#8696a0]">{p.type}</td>
                                <td className="p-3">
                                  {p.required ? (
                                    <span className="text-[#06cf9c] font-bold">Yes</span>
                                  ) : (
                                    <span className="text-[#8696a0]">Optional</span>
                                  )}
                                </td>
                                <td className="p-3 text-[#8696a0]">{p.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Code Snippet Tabs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-[#111b21] p-1 rounded-xl border border-[#222d34] text-xs">
                        <button
                          onClick={() => setActiveTab({ ...activeTab, [ep.id]: 'curl' })}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                            currentTab === 'curl' ? 'bg-[#00a884] text-white shadow' : 'text-[#8696a0] hover:text-[#e9edef]'
                          }`}
                        >
                          cURL
                        </button>
                        <button
                          onClick={() => setActiveTab({ ...activeTab, [ep.id]: 'js' })}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                            currentTab === 'js' ? 'bg-[#00a884] text-white shadow' : 'text-[#8696a0] hover:text-[#e9edef]'
                          }`}
                        >
                          JS Fetch
                        </button>
                        <button
                          onClick={() => setActiveTab({ ...activeTab, [ep.id]: 'json' })}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                            currentTab === 'json' ? 'bg-[#00a884] text-white shadow' : 'text-[#8696a0] hover:text-[#e9edef]'
                          }`}
                        >
                          Response JSON
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          handleCopy(
                            currentTab === 'curl' ? ep.curlSnippet : currentTab === 'js' ? ep.jsSnippet : ep.responseBody,
                            ep.id
                          )
                        }
                        className="flex items-center gap-1.5 text-xs text-[#8696a0] hover:text-[#06cf9c] bg-[#111b21] border border-[#222d34] px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        {copiedId === ep.id ? (
                          <>
                            <Check size={14} className="text-[#06cf9c]" />
                            <span className="text-[#06cf9c] font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] font-mono text-xs text-[#e9edef] overflow-x-auto shadow-inner">
                      <pre className="whitespace-pre-wrap">
                        {currentTab === 'curl' ? ep.curlSnippet : currentTab === 'js' ? ep.jsSnippet : ep.responseBody}
                      </pre>
                    </div>
                  </div>

                  {/* Interactive Live Endpoint Tester Sandbox */}
                  {ep.testable && (
                    <div className="pt-2 border-t border-[#222d34] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-[#06cf9c] flex items-center gap-1.5">
                          <Terminal size={14} />
                          <span>Live Endpoint Sandbox</span>
                        </div>

                        <button
                          onClick={() => handleExecuteLiveTest(ep)}
                          disabled={isLoading}
                          className="px-4 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#06cf9c] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              <span>Executing...</span>
                            </>
                          ) : (
                            <>
                              <Play size={14} />
                              <span>Test Live Endpoint</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Live Output Box */}
                      {testData && (
                        <div className="p-4 rounded-xl bg-[#111b21] border border-[#00a884]/40 space-y-2 text-xs font-mono">
                          <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#222d34]">
                            <span className="text-[#8696a0]">Live Response Result</span>
                            <span className={`font-bold ${testData.status === 200 || testData.status === 201 ? 'text-[#06cf9c]' : 'text-rose-400'}`}>
                              HTTP {testData.status} OK
                            </span>
                          </div>
                          <pre className="text-[#06cf9c] whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(testData.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                </motion.div>
              )
            })}
          </div>

        </main>
      </div>

      {/* --- INTEGRATED LANDING FOOTER --- */}
      <LandingFooter />

    </div>
  )
}
