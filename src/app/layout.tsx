import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: { default: 'Teta Pro Clubs', template: '%s | Teta Pro Clubs' },
  description: 'Teta Pro Clubs — EA FC Pro Clubs lig ve oyuncu topluluğu. Sezon istatistikleri, puan durumu ve oyuncu veritabanı.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Header />
        <main className="page-shell" role="main">
          {children}
        </main>
        <footer className="site-footer">
          <div>
            <span>
              <strong>Teta Pro Clubs</strong>
              <small>EA FC Pro Clubs lig ve oyuncu topluluğu</small>
            </span>
          </div>
          <div className="footer-links">
            <a href="/profile">Profil</a>
            <a href="/teams">Takımlar</a>
            <a href="/league">Lig</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
