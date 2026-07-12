import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import CookieBanner from '@/components/CookieBanner'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Teta League | Premium E-Sports', template: '%s | Teta League' },
  description: 'Teta Pro Clubs — Premium E-Spor Arayüzü',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable}`}>
      <body>
        <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main className="app-main" role="main" style={{ paddingTop: '100px', flex: 1 }}>
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </div>
      </body>
    </html>
  )
}
