'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const LEFT_LINKS = [
  { name: 'LİG', href: '/league' },
  { name: 'TURNUVALAR', href: '/tournaments' },
  { name: 'SIRALAMA', href: '/leaderboard' },
  { name: 'TAKIMLAR', href: '/teams' },
]

const RIGHT_LINKS = [
  { name: 'SOSYAL', href: '/social' },
  { name: 'TRANSFER', href: '/transfer' },
  { name: 'MAĞAZA', href: '/store' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [supabase])

  const renderLink = (link: { name: string, href: string }) => {
    const isActive = pathname === link.href
    return (
      <Link 
        key={link.name} 
        href={link.href}
        style={{
          textDecoration: 'none',
          color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
          fontWeight: isActive ? 700 : 500,
          fontSize: '0.9rem',
          letterSpacing: '1px',
          position: 'relative',
          transition: 'color 0.2s',
          whiteSpace: 'nowrap'
        }}
      >
        {link.name}
        {isActive && (
          <span style={{ position: 'absolute', bottom: '-8px', left: 0, right: 0, height: '2px', background: 'var(--brand-main)', borderRadius: '2px', boxShadow: '0 0 10px var(--brand-glow)' }} />
        )}
      </Link>
    )
  }

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 100,
      background: scrolled ? 'rgba(3, 2, 2, 0.85)' : 'rgba(3, 2, 2, 0.3)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid rgba(217, 119, 95, 0.15)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 40px'
    }}>
      
      {/* MERKEZİ KÜME (Sol Linkler - Logo - Sağ Linkler) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        
        {/* SOL MENÜ */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {LEFT_LINKS.map(renderLink)}
        </div>

        {/* MERKEZ LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 10px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', transition: 'transform 0.2s', ...scrolled ? { transform: 'scale(0.95)' } : {} }}>
            <img 
              src="/images/teta-logo.jpg" 
              alt="Teta League Logo" 
              style={{ 
                height: '60px', 
                width: 'auto', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 15px rgba(217, 119, 95, 0.5))'
              }} 
            />
          </Link>
        </div>

        {/* SAĞ MENÜ */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {RIGHT_LINKS.map(renderLink)}
          
          {/* PROFİL / AYARLAR DİNAMİK LİNK */}
          <Link 
            href={user ? "/settings" : "/login"}
            style={{
              textDecoration: 'none',
              color: user ? '#ffd700' : 'rgba(255,255,255,0.4)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '1px',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textShadow: user ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
            }}
          >
            {user ? 'PROFİL AYARLARI' : '🔒 PROFİL AYARLARI'}
          </Link>
        </div>
      </div>

      {/* EN SAĞ: KULLANICI MODÜLÜ */}
      <div style={{ position: 'absolute', right: '40px', display: 'flex', alignItems: 'center' }}>
        {user ? (
          <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', boxShadow: '0 0 10px var(--brand-glow)' }}>
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </Link>
        ) : (
          <Link href="/login" className="flat-button primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Oturum Aç
          </Link>
        )}
      </div>
    </header>
  )
}
