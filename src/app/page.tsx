'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function HomePage() {
  const supabase = createClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user)
      setLoading(false)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const feedItems = [
    { id: 1, type: 'TRANSFER', title: 'Kral10 -> Anadolu FK', time: '2s önce', color: 'var(--brand-main)' },
    { id: 2, type: 'MAÇ SONUCU', title: 'Siber SK 2 - 1 Kartal ES', time: '4s önce', color: '#ff3b30' },
    { id: 3, type: 'SOSYAL', title: '@teta_league: Yeni sezon başladı!', time: '1g önce', color: '#7fffd4' },
    { id: 4, type: 'TRANSFER', title: 'DefansBakanı -> Siber SK', time: '1g önce', color: 'var(--brand-main)' },
    { id: 5, type: 'DUYURU', title: 'Sistem bakımı tamamlandı.', time: '2g önce', color: '#a0b0c0' },
    { id: 6, type: 'MAÇ SONUCU', title: 'Bozkuşlar 0 - 0 Şahinler', time: '3g önce', color: '#ff3b30' },
  ]

  return (
    <div style={{ paddingBottom: '40px', paddingLeft: '40px', paddingRight: '40px', maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr 350px', gap: '32px', minHeight: 'calc(100vh - 120px)' }}>
      
      {/* =========================================
          SOL ŞERİT (SIDEBAR - PROFILE / INVITE)
          ========================================= */}
      <div className="client-glass" style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-muted">Bağlanıyor...</span>
          </div>
        ) : isLoggedIn ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '24px', boxShadow: '0 0 30px var(--brand-glow)' }}>
              O
            </div>
            <h2 className="font-bold" style={{ fontSize: '1.4rem', margin: '0 0 8px 0', letterSpacing: '1px' }}>Oyuncu_10</h2>
            <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '32px' }}>Serbest Oyuncu</div>
            
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Oynanan Maç</span>
                <span className="font-bold" style={{ color: 'var(--brand-light)' }}>0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Genel Reyting</span>
                <span className="font-bold" style={{ color: 'var(--brand-light)' }}>0.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Takım</span>
                <span className="font-bold" style={{ color: 'var(--text-muted)' }}>Yok</span>
              </div>
            </div>

            <Link href="/teams" className="flat-button interactive" style={{ width: '100%', marginTop: 'auto', textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>
              TAKIM BUL
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-100px', left: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(64, 224, 208, 0.4))', marginBottom: '24px' }}>
              🏆
            </motion.div>
            <h2 className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--brand-main)', marginBottom: '16px', lineHeight: 1.2, textShadow: '0 0 10px rgba(64, 224, 208, 0.3)' }}>
              EFSANELER<br/>ARASINA KATIL
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '40px' }}>
              Türkiye'nin en rekabetçi E-Spor liginde takımını kur veya bir yıldıza dönüş.
            </p>
            
            <Link href="/login" style={{ width: '100%', textDecoration: 'none' }}>
              <button className="flat-button interactive" style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(64, 224, 208, 0.3)' }}>
                SİSTEME GİR
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* =========================================
          MERKEZ PANEL (CINEMATIC HERO)
          ========================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Cinematic Banner */}
        <div style={{ 
          position: 'relative', 
          flex: 1, 
          borderRadius: '24px', 
          overflow: 'hidden',
          backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
        }}>
          {/* Overlay to darken image */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(5,10,15,0.9) 0%, rgba(5,10,15,0.4) 50%, rgba(5,10,15,0.1) 100%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px' }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255, 59, 48, 0.2)', border: '1px solid rgba(255, 59, 48, 0.5)', color: '#ff3b30', fontWeight: 'bold', fontSize: '0.8rem', borderRadius: '20px', marginBottom: '20px', letterSpacing: '1px', boxShadow: '0 0 20px rgba(255, 59, 48, 0.3)' }}>
              🔴 CANLI YAYIN
            </span>
            <h1 className="font-bold" style={{ fontSize: '4.5rem', lineHeight: 1.1, margin: '0 0 20px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
              SAHAYA ÇIK,<br/>EFSANE OL
            </h1>
            <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '40px', textShadow: '0 5px 15px rgba(0,0,0,0.8)' }}>
              Sezon 5'in açılış derbisi başladı. Şimdi canlı yayında Teta TV üzerinden efsanevi maçı izleyin.
            </p>
            <button className="flat-button interactive" style={{ background: 'rgba(5,10,15,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64,224,208,0.3)', padding: '16px 32px', fontSize: '1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--brand-main)' }}>▶</span> İZLEMEYE BAŞLA
            </button>
          </div>
        </div>

      </div>

      {/* =========================================
          SAĞ ŞERİT (FEED / LOG STREAM)
          ========================================= */}
      <div className="client-glass" style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '32px 24px', overflowY: 'auto' }}>
        <h3 className="font-bold" style={{ fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
          <span style={{ width: '8px', height: '8px', background: 'var(--brand-main)', borderRadius: '50%', boxShadow: '0 0 10px var(--brand-glow)' }} />
          CANLI AKIŞ
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {feedItems.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ 
                padding: '20px 0', 
                borderBottom: idx === feedItems.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: item.color, letterSpacing: '1px' }}>{item.type}</span>
                <span className="text-subtle" style={{ fontSize: '0.75rem' }}>{item.time}</span>
              </div>
              <div className="font-semibold" style={{ fontSize: '0.95rem', color: '#fff' }}>
                {item.title}
              </div>
            </motion.div>
          ))}
        </div>
        
        <Link href="/social" className="text-muted" style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.85rem', paddingTop: '24px', textDecoration: 'none', transition: 'color 0.2s' }}>
          Tüm Akışı Görüntüle &rarr;
        </Link>
      </div>

    </div>
  )
}
