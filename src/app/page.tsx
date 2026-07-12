'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function HomePage() {
  const supabase = createClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeStatTab, setActiveStatTab] = useState<'GOL' | 'ASİST' | 'CLEAN SHEET'>('GOL')
  const [activeLeagueTab, setActiveLeagueTab] = useState<'SÜPER LİG' | 'LİG 1'>('SÜPER LİG')

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

  const matches = [
    { id: 1, home: 'Anadolu FK', away: 'Siber SK', status: 'YAYINDA', score: '2 - 1' },
    { id: 2, home: 'Kartal ES', away: 'Şahinler', status: 'YAYINDA', score: '0 - 0' },
    { id: 3, home: 'Bozkuşlar', away: 'Kızıl Ejder', status: 'YAYINDA', score: '3 - 2' },
  ]

  const standings = [
    { pos: 1, team: 'Anadolu FK', p: 15 },
    { pos: 2, team: 'Siber SK', p: 12 },
    { pos: 3, team: 'Bozkuşlar', p: 10 },
    { pos: 4, team: 'Kartal ES', p: 8 },
    { pos: 5, team: 'Kızıl Ejder', p: 6 },
  ]

  const transfers = [
    { id: 1, player: 'Kral10', from: 'Serbest', to: 'Anadolu FK', time: '2 saat önce' },
    { id: 2, player: 'DefansBakanı', from: 'Kartal ES', to: 'Siber SK', time: '5 saat önce' },
    { id: 3, player: 'Goleador', from: 'Şahinler', to: 'Bozkuşlar', time: '1 gün önce' },
  ]

  const social = [
    { id: 1, author: '@teta_league', content: 'Sezon 5 heyecanı başlıyor! Anadolu FK ve Siber SK derbisi!', likes: 245 },
    { id: 2, author: '@kral10_official', content: 'Yeni takımım ile ilk antrenmana çıktım. Hedef şampiyonluk!', likes: 892 },
    { id: 3, author: '@esports_news', content: 'Son 24 saatte 15 bomba transfer gerçekleşti.', likes: 156 },
  ]

  const stats = [
    { id: 1, name: 'Oyuncu 1', team: 'Takım Alpha', value: 8 },
    { id: 2, name: 'Oyuncu 2', team: 'Takım Beta', value: 6 },
    { id: 3, name: 'Oyuncu 3', team: 'Takım Gamma', value: 5 },
  ]

  return (
    <div style={{ paddingBottom: '40px', paddingLeft: '40px', paddingRight: '40px', maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr 380px', gap: '24px', minHeight: 'calc(100vh - 120px)' }}>
      
      {/* =========================================
          SOL ŞERİT (SIDEBAR - PROFILE / INVITE)
          ========================================= */}
      <div className="client-glass" style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '32px 24px', height: 'calc(100vh - 140px)', position: 'sticky', top: '100px' }}>
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
          MERKEZ PANEL (AKIŞ & BANNER)
          ========================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* 1. Hero Banner (Canva Ent. / Canlı Akış) */}
        <div className="client-glass" style={{ 
          position: 'relative', 
          borderRadius: '16px', 
          overflow: 'hidden',
          backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '350px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '40px',
        }}>
          {/* Mask / Overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(5,10,15,0.9) 0%, rgba(5,10,15,0.5) 50%, rgba(5,10,15,0.1) 100%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px' }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255, 59, 48, 0.2)', border: '1px solid rgba(255, 59, 48, 0.5)', color: '#ff3b30', fontWeight: 'bold', fontSize: '0.8rem', borderRadius: '20px', marginBottom: '20px', letterSpacing: '1px', boxShadow: '0 0 20px rgba(255, 59, 48, 0.3)' }}>
              🔴 CANLI YAYIN
            </span>
            <h1 className="font-bold" style={{ fontSize: '3rem', lineHeight: 1.1, margin: '0 0 16px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
              SAHAYA ÇIK,<br/>EFSANE OL
            </h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '24px', textShadow: '0 5px 15px rgba(0,0,0,0.8)' }}>
              Sezon 5 açılış derbisi başladı. Şimdi canlı yayında Teta TV üzerinden maçı izleyin.
            </p>
            <a href="https://kick.com/tetaleague" target="_blank" rel="noopener noreferrer" className="flat-button interactive" style={{ background: 'rgba(5,10,15,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64,224,208,0.3)', padding: '12px 24px', fontSize: '1rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff', boxShadow: '0 0 15px rgba(64, 224, 208, 0)' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(64, 224, 208, 0.4)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(64, 224, 208, 0)'}>
              <span style={{ color: 'var(--brand-main)' }}>▶</span> İZLEMEYE BAŞLA
            </a>
          </div>
        </div>

        {/* 2. Haftanın Maçları */}
        <div className="client-glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 className="font-bold" style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Haftanın Maçları <span style={{ width: '8px', height: '8px', background: 'var(--brand-main)', borderRadius: '50%', boxShadow: '0 0 10px var(--brand-glow)' }} />
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {matches.map(match => (
              <div key={match.id} className="interactive" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', position: 'relative', border: '1px solid transparent', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.border = '1px solid transparent'}>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--brand-light)', marginBottom: '12px', textAlign: 'center' }}>{match.status}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                    <span className="font-semibold" style={{ fontSize: '0.85rem', textAlign: 'center' }}>{match.home}</span>
                  </div>
                  <div className="font-bold" style={{ fontSize: '1.3rem', padding: '0 12px' }}>
                    {match.score}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                    <span className="font-semibold" style={{ fontSize: '0.85rem', textAlign: 'center' }}>{match.away}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Mini İstatistikler */}
        <div className="client-glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="font-bold" style={{ fontSize: '1.2rem' }}>Mini İstatistikler</h3>
            
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '4px' }}>
              {['SÜPER LİG', 'LİG 1'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveLeagueTab(tab as any)}
                  style={{ padding: '6px 12px', background: activeLeagueTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderRadius: '6px', color: activeLeagueTab === tab ? '#fff' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            {['GOL', 'ASİST', 'CLEAN SHEET'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveStatTab(tab as any)}
                style={{ background: 'none', border: 'none', color: activeStatTab === tab ? 'var(--brand-main)' : 'var(--text-muted)', fontWeight: activeStatTab === tab ? 'bold' : 'normal', fontSize: '0.85rem', cursor: 'pointer', padding: '4px 8px', transition: 'color 0.2s' }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.map((stat, idx) => (
              <div key={stat.id} className="interactive" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}>
                <span className="font-bold text-muted" style={{ width: '24px' }}>{idx + 1}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: '0 16px' }}></div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold" style={{ fontSize: '0.95rem' }}>{stat.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{stat.team}</div>
                </div>
                <div className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-main)' }}>{stat.value}</div>
              </div>
            ))}
          </div>
          <Link href="/stats" className="flat-button interactive" style={{ width: '100%', marginTop: '20px', padding: '10px', fontSize: '0.85rem', background: 'transparent' }}>
            TÜM İSTATİSTİKLERİ GÖR
          </Link>
        </div>

      </div>

      {/* =========================================
          SAĞ ŞERİT (CANLI AKIŞ / DİNAMİK VERİ)
          ========================================= */}
      <div className="client-glass" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', height: 'calc(100vh - 140px)', position: 'sticky', top: '100px', overflowY: 'auto' }}>
        
        {/* Başlık */}
        <h3 className="font-bold" style={{ fontSize: '1.1rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
          <span style={{ width: '8px', height: '8px', background: 'var(--brand-main)', borderRadius: '50%', boxShadow: '0 0 10px var(--brand-glow)' }} />
          CANLI AKIŞ
        </h3>

        {/* 1. Mini Puan Durumu */}
        <div>
          <h4 className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Puan Durumu</h4>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-subtle" style={{ width: '24px', fontSize: '0.75rem' }}>#</span>
              <span className="text-subtle" style={{ flex: 1, fontSize: '0.75rem' }}>TAKIM</span>
              <span className="text-subtle" style={{ width: '30px', textAlign: 'right', fontSize: '0.75rem' }}>P</span>
            </div>
            {standings.map(s => (
              <div key={s.pos} className="interactive" style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span className="font-bold text-muted" style={{ width: '24px', fontSize: '0.85rem' }}>{s.pos}</span>
                <span className="font-semibold" style={{ flex: 1, fontSize: '0.9rem', color: '#fff' }}>{s.team}</span>
                <span className="font-bold" style={{ width: '30px', textAlign: 'right', color: 'var(--brand-light)' }}>{s.p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Son Transferler */}
        <div>
          <h4 className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Son Transferler</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transfers.map(tr => (
              <div key={tr.id} className="interactive" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #444, #222)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {tr.player.slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold" style={{ fontSize: '0.9rem' }}>{tr.player}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginTop: '2px' }}>
                    <span className="text-muted">{tr.from}</span>
                    <span style={{ color: 'var(--brand-main)' }}>&rarr;</span>
                    <span style={{ color: '#fff' }}>{tr.to}</span>
                  </div>
                </div>
                <div className="text-subtle" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{tr.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Sosyal Medya Top 3 */}
        <div>
          <h4 className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Teta Sosyal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {social.map(post => (
              <div key={post.id} className="interactive" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div className="font-bold" style={{ color: 'var(--brand-light)', fontSize: '0.85rem', marginBottom: '8px' }}>{post.author}</div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#e0e0e0', marginBottom: '12px' }}>"{post.content}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff3b30', fontSize: '0.8rem' }}>
                  <span>❤️</span> <span className="font-bold">{post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
