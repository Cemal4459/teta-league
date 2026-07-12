'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const supabase = createClient()
  const [activeStatTab, setActiveStatTab] = useState<'GOL' | 'ASİST' | 'CLEAN SHEET'>('GOL')
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

  const matches = [
    { id: 1, home: 'Anadolu FK', away: 'Siber SK', status: 'YAYINDA', score: '2 - 1', views: '1.2K' },
    { id: 2, home: 'Kartal ES', away: 'Şahinler', status: 'YAYINDA', score: '0 - 0', views: '850' },
    { id: 3, home: 'Bozkuşlar', away: 'Kızıl Ejder', status: 'YAYINDA', score: '3 - 2', views: '2.1K' },
  ]

  const transfers = [
    { id: 1, player: 'Kral10', from: 'Serbest', to: 'Anadolu FK', date: '2 saat önce' },
    { id: 2, player: 'DefansBakanı', from: 'Kartal ES', to: 'Siber SK', date: '5 saat önce' },
    { id: 3, player: 'Goleador', from: 'Şahinler', to: 'Bozkuşlar', date: '1 gün önce' },
  ]

  const socialPosts = [
    { id: 1, author: '@teta_league', content: 'Sezon 5 heyecanı başlıyor! Anadolu FK ve Siber SK derbisi bu akşam 21:00\'de Teta TV\'de!', likes: 245 },
    { id: 2, author: '@kral10_official', content: 'Yeni takımım @anadolufk ile ilk antrenmana çıktım. Hedef şampiyonluk!', likes: 892 },
    { id: 3, author: '@esports_news', content: 'Teta League transfer piyasası alev alev. Son 24 saatte 15 bomba transfer gerçekleşti.', likes: 156 },
  ]

  return (
    <div style={{ paddingBottom: '80px', paddingLeft: '40px', paddingRight: '40px', maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* --- TOP SECTION: Profile Widget & Hero Banner --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
        
        {/* Profile Widget or Recruitment Banner */}
        {loading ? (
          <div className="game-panel interactive" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-muted">Bağlanıyor...</span>
          </div>
        ) : isLoggedIn ? (
          <div className="game-panel interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '16px', boxShadow: '0 0 20px var(--brand-glow)' }}>
              O
            </div>
            <h2 className="font-bold" style={{ fontSize: '1.2rem', margin: '0 0 4px 0' }}>Oyuncu_10</h2>
            <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Serbest Oyuncu</div>
            
            <div style={{ display: 'flex', width: '100%', gap: '8px', marginTop: 'auto' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-light)' }}>0</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>MAÇ</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-light)' }}>0.0</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>RTG</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-panel interactive" style={{ position: 'relative', overflow: 'hidden', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(180deg, rgba(20,20,15,0.8) 0%, rgba(5,5,5,0.9) 100%)' }}>
            <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(217, 119, 95, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))', marginBottom: '16px' }}>🏆</div>
            <h2 className="font-bold" style={{ fontSize: '1.3rem', color: '#ffd700', marginBottom: '8px', textShadow: '0 0 10px rgba(255,215,0,0.3)' }}>
              EFSANELER ARASINA KATIL
            </h2>
            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Türkiye'nin en rekabetçi E-Spor liginde takımını kur veya yıldız ol.
            </p>
            
            <Link href="/login" style={{ width: '100%', textDecoration: 'none' }}>
              <button className="flat-button shimmer-effect interactive" style={{ width: '100%', padding: '14px', background: 'var(--brand-main)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(217, 119, 95, 0.3)' }}>
                KARİYERİNE BAŞLA
              </button>
            </Link>
          </div>
        )}

        {/* Hero Banner (Dynamic Video Placeholder) */}
        <div className="game-panel interactive" style={{ position: 'relative', height: '400px', backgroundImage: 'linear-gradient(to right, rgba(3,2,2,0.9) 0%, rgba(3,2,2,0.3) 50%, rgba(3,2,2,0.1) 100%), url(https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', padding: '40px' }}>
          <div style={{ maxWidth: '500px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--accent-danger)', color: '#fff', fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '4px', alignSelf: 'flex-start', marginBottom: '16px', letterSpacing: '1px' }}>
              CANLI YAYIN
            </span>
            <h1 className="font-bold" style={{ fontSize: '3.5rem', lineHeight: 1.1, margin: '0 0 16px 0', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>
              SAHAYA ÇIK,<br/>EFSANE OL
            </h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '32px', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
              Sezon 5'in açılış derbisi başladı. Şimdi canlı yayında Teta TV üzerinden maçı izleyin.
            </p>
            <button className="flat-button primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>▶</span> İZLEMEYE BAŞLA
            </button>
          </div>
        </div>
        
      </div>

      {/* --- MIDDLE SECTION: Matches & Transfers --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* Haftanın Maçları (Horizontal Slider) */}
        <div>
          <h2 className="font-bold" style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Haftanın Maçları <span style={{ width: '8px', height: '8px', background: 'var(--brand-main)', borderRadius: '50%', boxShadow: '0 0 10px var(--brand-glow)' }}></span>
          </h2>
          <div className="horizontal-scroll" style={{ paddingBottom: '16px' }}>
            {matches.map(match => (
              <div key={match.id} className="game-panel interactive" style={{ flex: '0 0 320px', padding: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--accent-danger)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                  <span className="text-muted font-bold" style={{ fontSize: '0.7rem' }}>{match.views}</span>
                </div>
                
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--brand-light)' }}>{match.status}</span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <span className="font-semibold" style={{ fontSize: '0.9rem' }}>{match.home}</span>
                  </div>
                  
                  <div className="font-bold" style={{ fontSize: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '8px' }}>
                    {match.score}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <span className="font-semibold" style={{ fontSize: '0.9rem' }}>{match.away}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Son Transferler */}
        <div>
          <h2 className="font-bold" style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Son Transferler</h2>
          <div className="game-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {transfers.map(tr => (
              <div key={tr.id} className="interactive" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', transition: 'background 0.2s' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #444, #222)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {tr.player.slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold" style={{ fontSize: '0.95rem' }}>{tr.player}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', marginTop: '4px' }}>
                    <span className="text-muted">{tr.from}</span>
                    <span style={{ color: 'var(--brand-main)' }}>&rarr;</span>
                    <span style={{ color: '#fff' }}>{tr.to}</span>
                  </div>
                </div>
                <div className="text-subtle" style={{ fontSize: '0.7rem' }}>{tr.date}</div>
              </div>
            ))}
            <Link href="/teams" className="flat-button" style={{ width: '100%', padding: '10px', fontSize: '0.85rem', marginTop: '8px' }}>TÜMÜNÜ GÖR</Link>
          </div>
        </div>

      </div>

      {/* --- STATS SECTION: Standings & Mini Stats --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Mini Puan Durumu */}
        <div className="game-panel" style={{ padding: '24px' }}>
          <h2 className="font-bold" style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Süper Lig (Zirve)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr className="text-subtle" style={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>#</th>
                <th style={{ padding: '12px 8px', fontWeight: 600 }}>TAKIM</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textAlign: 'center' }}>O</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textAlign: 'right', color: 'var(--brand-main)' }}>P</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((pos) => (
                <tr key={pos} className="interactive" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                  <td className="text-muted font-bold" style={{ padding: '16px 8px' }}>{pos}</td>
                  <td style={{ padding: '16px 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                    Takım {pos}
                  </td>
                  <td className="text-muted" style={{ padding: '16px 8px', textAlign: 'center' }}>0</td>
                  <td className="font-bold" style={{ padding: '16px 8px', textAlign: 'right', fontSize: '1.1rem', color: 'var(--brand-light)' }}>0</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link href="/league" className="flat-button" style={{ width: '100%', marginTop: '20px' }}>DETAYLI PUAN DURUMU</Link>
        </div>

        {/* Mini İstatistikler */}
        <div className="game-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="font-bold" style={{ fontSize: '1.3rem' }}>Bireysel İstatistikler</h2>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '8px' }}>
            {['GOL', 'ASİST', 'CLEAN SHEET'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveStatTab(tab as any)}
                style={{ flex: 1, padding: '8px', background: activeStatTab === tab ? 'var(--panel-hover)' : 'transparent', border: 'none', borderRadius: '6px', color: activeStatTab === tab ? '#fff' : 'var(--text-muted)', fontWeight: activeStatTab === tab ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem' }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {[1, 2, 3].map((pos) => (
              <div key={pos} className="interactive" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span className="font-bold text-muted" style={{ width: '24px' }}>{pos}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: '0 16px' }}></div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold">Oyuncu {pos}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Takım Alpha</div>
                </div>
                <div className="font-bold" style={{ fontSize: '1.3rem', color: 'var(--brand-main)' }}>{10 - pos}</div>
              </div>
            ))}
          </div>
          <button className="flat-button" style={{ width: '100%', marginTop: '20px' }}>TÜM İSTATİSTİKLER</button>
        </div>

      </div>

      {/* --- BOTTOM SECTION: Social Media --- */}
      <div>
        <h2 className="font-bold" style={{ fontSize: '1.3rem', marginBottom: '20px', textAlign: 'center' }}>Teta Sosyal (Top 3)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {socialPosts.map(post => (
            <div key={post.id} className="game-panel interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                <div className="font-bold" style={{ color: 'var(--brand-light)' }}>{post.author}</div>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>"{post.content}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: 'var(--accent-danger)' }}>
                <span>❤️</span> <span className="font-bold">{post.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(255, 59, 48, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0); }
        }
      `}</style>
    </div>
  )
}
