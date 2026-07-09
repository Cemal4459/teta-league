'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/league', label: 'Lig' },
    { href: '/teams', label: 'Takımlar' },
    { href: '/players', label: 'Oyuncu Veritabanı' },
    { href: '/tournaments', label: 'Turnuvalar' },
    { href: '/profile', label: 'Profil' },
  ]

  return (
    <header className="site-header">
      <div className="top-line">
        {/* Sol: Auth Butonları */}
        <div className="auth-actions">
          {!mounted ? null : user ? (
            // Giriş Yapılmış
            <>
              <Link href="/profile" className="button button-ghost compact">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                Profilim
              </Link>
              <button onClick={handleSignOut} className="button button-ghost compact" style={{ color: '#cc0a1d', borderColor: 'rgba(204, 10, 29, 0.3)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Çıkış Yap
              </button>
            </>
          ) : (
            // Giriş Yapılmamış
            <>
              <Link href="/login" className="button button-ghost compact">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Oturum Aç
              </Link>
              <Link href="/register" className="button button-primary compact">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Merkez Logo */}
        <Link className="center-logo" href="/" aria-label="Teta Pro Clubs ana sayfası">
          <img src="/images/teta-logo.jpg" alt="Teta Pro Clubs" width={78} height={54} />
        </Link>
      </div>

      <nav className="site-nav" aria-label="Ana menü">
        <div className="nav-menu">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ borderBottomColor: pathname === link.href ? 'var(--gold)' : 'transparent', color: pathname === link.href ? 'var(--gold)' : undefined }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <form className="global-search" action="/players">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input name="q" type="search" placeholder="Oyuncu, takım ara..." />
        </form>
      </nav>
    </header>
  )
}
