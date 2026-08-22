import type { Metadata } from 'next'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { GlobalFamilySection } from '@/components/landing/GlobalFamilySection'
import { FeatureCardsSection } from '@/components/landing/FeatureCardsSection'
import { IntegrationsSection } from '@/components/landing/IntegrationsSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTASection, LandingFooter } from '@/components/landing/CTASection'

export const metadata: Metadata = {
  title: 'WhatChat — Your Next Conversation Starts Here',
  description: 'A clean real-time messaging application that connects your team, 1-to-1 chats, group rooms, and instant sync.',
}

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen font-['DM_Sans',sans-serif] text-slate-900 selection:bg-blue-600 selection:text-white">
      <LandingNavbar />

      <main>
        <HeroSection />
        <GlobalFamilySection />
        <FeatureCardsSection />
        <IntegrationsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}




