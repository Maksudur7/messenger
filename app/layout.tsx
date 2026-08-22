import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'WhatChat — Real-Time Chat App',
    template: '%s | WhatChat',
  },
  description: 'WhatChat is a real-time chat application supporting 1-to-1 and group conversations, built with Next.js, Socket.io, and a modern dark UI.',
  keywords: ['chat', 'real-time', 'messaging', 'group chat', 'Socket.io', 'Next.js'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} antialiased font-sans`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}

