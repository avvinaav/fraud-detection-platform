import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/layout/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fraud Detection Platform - AI-Powered Content Analysis',
  description: 'Multi-model AI platform for detecting synthetic and fraudulent content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-zinc-950">
            <div className="gradient-mesh fixed inset-0 pointer-events-none" />
            <Navigation />
            <main className="relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
