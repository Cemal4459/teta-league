'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const MOCK_ACHIEVEMENTS = [
  { id: 1, title: 'İlk Adım', desc: 'Lige kayıt ol ve ilk maçına çık.', tier: 'bronz', completed: true },
  { id: 2, title: 'Gole Doymayan', desc: 'Bir maçta 5 gol at.', tier: 'altın', completed: false },
  { id: 3, title: 'Durdurulamaz', desc: 'Üst üste 5 galibiyet al.', tier: 'altın', completed: true },
  { id: 4, title: 'Duvar', desc: '3 maç üst üste gol yeme.', tier: 'gümüş', completed: true },
  { id: 9, title: 'Şampiyon', desc: 'Ligi birinci bitir.', tier: 'altın', completed: true },
]

export default function TeamProfileClient({ team, roster, matches }: { team: any, roster: any[], matches: any[] }) {
  const [activeTab, setActiveTab] = useState<'Kadro' | 'İstatistikler' | 'Müze' | 'Başarımlar'>('Kadro')
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  const toggleMatch = (id: string) => {
    setExpandedMatch(expandedMatch === id ? null : id)
  }

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex || !hex.startsWith('#')) return `rgba(64, 224, 208, ${alpha})`
    const r = parseInt(hex.slice(1, 3), 16) || 64
    const g = parseInt(hex.slice(3, 5), 16) || 224
    const b = parseInt(hex.slice(5, 7), 16) || 208
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const glowColor = hexToRgba(team.primary_color || '#40E0D0', 0.4)
  const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)

  const SilhouetteAvatar = () => (
    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
      <svg width="40" height="48" viewBox="0 0 24 24" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="rgba(255,255,255,0.2)" />
      </svg>
    </div>
  )

  const TrophyIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 10px 15px rgba(217, 119, 95, 0.4))' }}>
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="50%" stopColor="#d9775f" />
          <stop offset="100%" stopColor="#8a4b3b" />
        </linearGradient>
      </defs>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" fill="rgba(217, 119, 95, 0.1)"/>
    </svg>
  )

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
      
      <style>{`
        @media (min-width: 1024px) {
          .tp-grid { display: grid; grid-template-columns: 320px 1fr; gap: 40px; align-items: start; }
        }
        @media (max-width: 1023px) {
          .tp-grid { display: flex; flex-direction: column; gap: 32px; }
        }
        .museum-container {
          perspective: 1200px; padding: 60px 20px; display: flex; flex-direction: column; gap: 100px; overflow: hidden;
        }
        .museum-shelf {
          position: relative; width: 100%; height: 20px; background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.8)); transform-style: preserve-3d; transform: rotateX(25deg); box-shadow: 0 40px 50px rgba(0,0,0,0.9), inset 0 2px 5px rgba(255,255,255,0.2); border-radius: 4px; display: flex; justify-content: center; gap: 60px;
        }
        .museum-trophy-item {
          position: relative; bottom: 70px; display: flex; flex-direction: column; alignItems: center; transform: rotateX(-25deg); transition: transform 0.3s;
        }
        .museum-trophy-item:hover { transform: rotateX(-25deg) translateY(-10px) scale(1.05); }
        .museum-trophy-item::before { content: ''; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 100px; height: 140px; background: radial-gradient(ellipse at top, rgba(217,119,95,0.25) 0%, transparent 70%); pointer-events: none; z-index: -1; }
      `}</style>

      <div className="tp-grid">
        
        {/* SOL TARAF: KÜNYE */}
        <div className="client-glass" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'sticky', top: '120px', borderRadius: '24px', border: `1px solid ${hexToRgba(team.primary_color || '#40E0D0', 0.2)}` }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: `linear-gradient(90deg, transparent, ${team.primary_color || 'var(--brand-main)'}, transparent)` }} />
          
          <div className="font-bold" style={{ fontSize: '1.2rem', color: '#fff', textShadow: `0 0 20px ${glowColor}`, marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', width: '100%' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>KULÜP BÜTÇESİ</span>
            {formatCurrency(team.budget || 5000000)}
          </div>

          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,20,0.9))', border: `1px solid ${team.primary_color || 'var(--brand-main)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: team.primary_color || 'var(--brand-main)', boxShadow: `0 0 30px ${glowColor}`, marginBottom: '24px', overflow: 'hidden' }}>
            {team.logo_url ? <img src={team.logo_url} alt={team.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (team.abbreviation || 'N/A').slice(0, 3)}
          </div>

          <h1 className="font-bold" style={{ fontSize: '2rem', marginBottom: '8px' }}>{team.name}</h1>
          <div className="text-muted" style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '32px' }}>{team.league_name}</div>
          <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '16px' }}>🏟️ {team.stadium_name || 'Bilinmiyor'}</div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { l: 'Oynanan Maç', v: team.stats.played },
              { l: 'Galibiyet', v: team.stats.won, color: '#5de0a0' },
              { l: 'Beraberlik', v: team.stats.drawn, color: 'var(--text-muted)' },
              { l: 'Mağlubiyet', v: team.stats.lost, color: 'var(--accent-danger)' },
              { l: 'Puan', v: team.stats.points, highlight: true }
            ].map(stat => (
              <div key={stat.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{stat.l}</span>
                <span className="font-bold" style={{ color: stat.highlight ? team.primary_color || 'var(--brand-main)' : (stat.color || '#fff'), textShadow: stat.highlight ? `0 0 10px ${glowColor}` : 'none' }}>{stat.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ TARAF: DİNAMİK SEKMELER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TAB HEADER */}
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', overflowX: 'auto' }}>
            {(['Kadro', 'İstatistikler', 'Müze', 'Başarımlar'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ background: activeTab === tab ? hexToRgba(team.primary_color || '#40E0D0', 0.15) : 'transparent', border: 'none', borderBottom: activeTab === tab ? `2px solid ${team.primary_color || 'var(--brand-main)'}` : '2px solid transparent', color: activeTab === tab ? '#fff' : 'var(--text-muted)', padding: '12px 24px', fontSize: '1rem', whiteSpace: 'nowrap', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            
            {/* --- KADRO SEKMESİ --- */}
            {activeTab === 'Kadro' && (
              <motion.div key="Kadro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {roster.length === 0 ? (
                  <div className="client-glass" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>Bu takımın henüz oyuncusu bulunmuyor.</div>
                ) : roster.map((player) => (
                  <div key={player.id} className="client-glass interactive" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', borderRadius: '16px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = hexToRgba(team.primary_color || '#40E0D0', 0.05); e.currentTarget.style.boxShadow = `inset 0 0 20px ${glowColor}`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <SilhouetteAvatar />
                    
                    <div style={{ flex: '1 1 200px' }}>
                      <Link href={`/profile/${(player.username || player.ea_id || '').toLowerCase()}`} style={{ color: '#fff', textDecoration: 'none' }}>
                        <h3 className="font-bold" style={{ fontSize: '1.2rem', margin: '0 0 4px 0' }}>{player.ea_id || player.username}</h3>
                      </Link>
                      <span style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', color: team.primary_color || 'var(--brand-main)' }}>{player.main_position || 'Mevki Yok'}</span>
                      {player.role === 'captain' && <span style={{ marginLeft: '8px', fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(255,215,0,0.2)', color: '#ffd700', borderRadius: '4px' }}>Kaptan</span>}
                    </div>

                    {/* İleride match_stats eklendiğinde bu değerler doldurulacak */}
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap', opacity: 0.5 }}>
                      <div style={{ textAlign: 'center' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>GOL</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>-</div></div>
                      <div style={{ textAlign: 'center' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>ASİST</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>-</div></div>
                      <div style={{ textAlign: 'center' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>C. SHEET</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>-</div></div>
                      <div style={{ textAlign: 'center' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>REYTING</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>-</div></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* --- İSTATİSTİKLER SEKMESİ --- */}
            {activeTab === 'İstatistikler' && (
              <motion.div key="Stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 className="font-bold" style={{ fontSize: '1.2rem', color: '#fff' }}>Oynanan Maçlar</h3>
                  {matches.length === 0 ? (
                    <div className="client-glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>Henüz oynanmış bir maç bulunmuyor.</div>
                  ) : matches.map((match) => {
                    const isHome = match.home_team_id === team.id
                    const myScore = isHome ? match.home_score : match.away_score
                    const oppScore = isHome ? match.away_score : match.home_score
                    const res = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D'
                    
                    return (
                      <div key={match.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div onClick={() => toggleMatch(match.id)} className="client-glass interactive" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', zIndex: 2, borderRadius: '16px' }}>
                          <div style={{ flex: 1, fontWeight: 'bold', fontSize: '1.1rem', color: isHome ? team.primary_color : '#fff', textAlign: 'right', textShadow: isHome ? `0 0 10px ${glowColor}` : 'none' }}>
                            {isHome ? team.name : 'Deplasman'}
                          </div>
                          <div style={{ padding: '0 32px', textAlign: 'center' }}>
                            <div style={{ background: res === 'W' ? 'rgba(93, 224, 160, 0.2)' : res === 'L' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px', border: `1px solid ${res === 'W' ? '#5de0a0' : res === 'L' ? '#ef4444' : 'rgba(255,255,255,0.2)'}`, fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '2px', color: res === 'W' ? '#5de0a0' : res === 'L' ? '#ef4444' : '#fff' }}>
                              {match.home_score} - {match.away_score}
                            </div>
                          </div>
                          <div style={{ flex: 1, fontWeight: 'bold', fontSize: '1.1rem', color: !isHome ? team.primary_color : '#fff', textAlign: 'left', textShadow: !isHome ? `0 0 10px ${glowColor}` : 'none' }}>
                            {!isHome ? team.name : 'Ev Sahibi'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* --- MÜZE (3D TROPHY CABINET) --- */}
            {activeTab === 'Müze' && (
              <motion.div key="Muze" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <div className="client-glass" style={{ background: 'radial-gradient(ellipse at top, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.9) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                  <div className="museum-container">
                    <div className="museum-shelf">
                      <div className="museum-trophy-item" style={{ opacity: 0.2, filter: 'grayscale(100%)' }}>
                        <TrophyIcon />
                        <div className="font-bold" style={{ marginTop: '16px', color: '#fff' }}>Lig Şampiyonu</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Henüz Kazanılmadı</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- BAŞARIMLAR --- */}
            {activeTab === 'Başarımlar' && (
              <motion.div key="Achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {MOCK_ACHIEVEMENTS.map(ach => {
                  const medalColor = ach.tier === 'altın' ? '#ffd700' : ach.tier === 'gümüş' ? '#c0c0c0' : '#cd7f32'
                  
                  return (
                    <div key={ach.id} className="client-glass shimmer-effect" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: ach.completed ? 1 : 0.4, filter: ach.completed ? 'none' : 'grayscale(80%)', transition: 'all 0.3s', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `radial-gradient(circle at top left, ${medalColor}, rgba(0,0,0,0.8))`, border: `1px solid ${medalColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: ach.completed ? `0 0 15px ${medalColor}40` : 'none' }}>
                          🎖️
                        </div>
                        {ach.completed && <div style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontWeight: 'bold' }}>AÇILDI</div>}
                      </div>
                      <div>
                        <h4 className="font-bold" style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: ach.completed ? '#fff' : 'var(--text-muted)' }}>{ach.title}</h4>
                        <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>{ach.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
