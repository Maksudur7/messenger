'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MessageSquare, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#2563eb] text-white border-b border-white/10 shadow-md font-['DM_Sans',sans-serif]">

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" id="nav-logo" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <MessageSquare size={18} className="text-cyan-300 fill-cyan-300/30" />
            </div>
            <span className="font-extrabold text-white text-xl tracking-tight">
              Nexus<span className="text-cyan-300">Chat</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>


          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              id="nav-login-btn"
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/chat"
              id="nav-launch-btn"
              className="px-5 py-2 rounded-full bubbly-badge-cyan hover:bg-teal-300 text-xs font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch App</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3"
            >
              <nav className="flex flex-col gap-3">
                <a href="#overview" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-white/80 hover:text-white py-1">Overview</a>
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-white/80 hover:text-white py-1">Features</a>
                <a href="#integrations" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-white/80 hover:text-white py-1">Integrations</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-white/80 hover:text-white py-1">FAQ</a>

                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/login" className="py-2 rounded-xl bg-white/10 text-white text-xs font-semibold text-center">
                    Sign In
                  </Link>
                  <Link href="/chat" className="py-2.5 rounded-xl bubbly-badge-cyan text-xs font-bold text-center">
                    Launch App →
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}


