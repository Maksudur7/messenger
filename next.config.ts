import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable x-powered-by header
  poweredByHeader: false,

  // Allow cross-origin requests from the API server for development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
