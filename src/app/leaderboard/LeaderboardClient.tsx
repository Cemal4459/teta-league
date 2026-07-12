'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}

const SilhouetteAvatar = () => (
  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
    <svg width="32" height="38" viewBox="0 0 24 24" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  </div>
)

export default function LeaderboardClient({ currentUserId, playersWithValues, teamsWithValues }: any) {
  const [activeTab, setActiveTab] = useState<'Oyuncu' | 'Takım'>('Oyuncu')
  const [flashingRowId, setFlashingRowId] = useState<string | null>(null)

  const locateMe = () => {
    if (!currentUserId) return
    setActiveTab('Oyuncu')
    setTimeout(() => {
      const el = document.getElementById(`row-${currentUserId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setFlashingRowId(currentUserId)
        setTimeout(() => setFlashingRowId(null), 2000)
      }
    }, 100)
  }

  const getPodiumProps = (rank: number) => {
    if (rank === 1) return { color: '#ffd700', height: '360px', glow: 'rgba(255, 215, 0, 0.4)', bg: 'rgba(255, 215, 0, 0.05)' }
    if (rank === 2) return { color: '#e0e0e0', height: '320px', glow: 'rgba(224, 224, 224, 0.3)', bg: 'rgba(224, 224, 224, 0.05)' }
    if (rank === 3) return { color: '#cd7f32', height: '280px', glow: 'rgba(205, 127, 50, 0.3)', bg: 'rgba(205, 127, 50, 0.05)' }
    return { color: '#fff', height: 'auto', glow: 'transparent', bg: 'transparent' }
  }

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '40px', paddingRight: '40px', position: 'relative' }}>
      
      <style>{`
        @keyframes neon-flash {
          0% { background: transparent; }
          20% { background: rgba(64, 224, 208, 0.15); box-shadow: inset 0 0 20px rgba(64, 224, 208, 0.3); }
          80% { background: rgba(64, 224, 208, 0.15); box-shadow: inset 0 0 20px rgba(64, 224, 208, 0.3); }
          100% { background: transparent; box-shadow: none; }
        }
        .row-flash {
          animation: neon-flash 2s ease-in-out;
        }
      `}</style>

      {currentUserId && (
        <button 
          onClick={locateMe}
          className="interactive" 
          style={{ position: 'fixed', top: '120px', left: '40px', zIndex: 100, background: 'rgba(10,15,20,0.5)', border: '1px solid rgba(64,224,208,0.4)', color: 'var(--brand-main)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 15px rgba(64, 224, 208, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 25px rgba(64, 224, 208, 0.5)'; e.currentTarget.style.background = 'rgba(64,224,208,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(64, 224, 208, 0.2)'; e.currentTarget.style.background = 'rgba(10,15,20,0.5)'; }}
        >
          <span style={{ fontSize: '1.2rem', textShadow: '0 0 10px var(--brand-glow)' }}>🎯</span> 
          <span className="font-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Ben Neredeyim</span>
        </button>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h1 className="font-bold" style={{ fontSize: '3.5rem', textShadow: '0 4px 15px rgba(0,0,0,0.6)', margin: 0, letterSpacing: '1px' }}>GLOBAL SIRALAMA</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '12px', marginBottom: '40px' }}>Teta League algoritmasına göre güncel piyasa değerleri ve kulüp güçleri.</p>

        <div style={{ display: 'inline-flex', gap: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0' }}>
          {(['Oyuncu', 'Takım'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                padding: '0 0 16px 0',
                borderBottom: activeTab === tab ? '2px solid var(--brand-main)' : '2px solid transparent', 
                color: activeTab === tab ? '#fff' : 'var(--text-muted)', 
                fontWeight: 'bold',
                textShadow: activeTab === tab ? '0 0 15px rgba(64, 224, 208, 0.5)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '1.2rem'
              }}
            >
              {tab.toUpperCase()} SIRALAMASI
            </button>
          ))}
        </div>
      </div>

      {playersWithValues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '10rem', opacity: 0.05, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>T</div>
          <p className="font-bold" style={{ fontSize: '1.5rem' }}>Sistemde henüz istatistik verisi bulunamadı.</p>
          <p>Maçlar tamamlanıp istatistikler girildikten sonra algoritmalar devreye girecektir.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '24px', marginBottom: '80px', marginTop: '60px' }}>
              {[2, 1, 3].map(rank => {
                const data = activeTab === 'Oyuncu' ? playersWithValues[rank - 1] : teamsWithValues[rank - 1]
                if (!data) return null
                
                const pProps = getPodiumProps(rank)
                const isFirst = rank === 1

                return (
                  <div key={data.name} className="client-glass interactive" style={{ width: '320px', height: pProps.height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: pProps.bg, border: 'none', boxShadow: `0 0 50px ${pProps.glow}`, position: 'relative', zIndex: isFirst ? 2 : 1, transform: isFirst ? 'scale(1.05)' : 'none', borderRadius: '24px', overflow: 'hidden' }}>
                    
                    {isFirst && (
                      <div style={{ position: 'absolute', top: '-40px', fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))', zIndex: 10 }}>
                        👑
                      </div>
                    )}

                    <div style={{ fontSize: '15rem', fontWeight: '900', color: pProps.color, opacity: 0.03, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                      {rank}
                    </div>
                    
                    {activeTab === 'Oyuncu' && <div style={{ transform: 'scale(1.5)', marginBottom: '32px' }}><SilhouetteAvatar /></div>}
                    
                    <div className="font-bold" style={{ fontSize: isFirst ? '1.8rem' : '1.4rem', textAlign: 'center', marginBottom: '8px', zIndex: 1, color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{data.name}</div>
                    {activeTab === 'Oyuncu' && <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px', zIndex: 1, color: 'var(--brand-main)' }}>{data.team}</div>}
                    
                    <div className="font-bold" style={{ fontSize: isFirst ? '2.2rem' : '1.6rem', color: pProps.color, textShadow: `0 0 20px ${pProps.glow}`, zIndex: 1, letterSpacing: '1px' }}>
                      {activeTab === 'Oyuncu' ? formatCurrency(data.value) : `${data.points} Puan`}
                    </div>
                    {activeTab === 'Takım' && (
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px', zIndex: 1 }}>
                        Takım Değeri: {formatCurrency(data.value)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="client-glass" style={{ display: 'flex', flexDirection: 'column', padding: '32px', borderRadius: '24px' }}>
              {(activeTab === 'Oyuncu' ? playersWithValues : teamsWithValues).slice(3).map((data: any, index: number) => {
                const rank = index + 4
                const rowId = activeTab === 'Oyuncu' ? `row-${data.id}` : `row-team-${data.name}`
                const isFlashing = flashingRowId === (activeTab === 'Oyuncu' ? data.id : null)

                return (
                  <div 
                    key={data.name} 
                    id={rowId}
                    className={`interactive ${isFlashing ? 'row-flash' : ''}`} 
                    style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '32px', borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'all 0.3s', borderRadius: '16px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(64, 224, 208, 0.05)'; e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(64, 224, 208, 0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="font-bold text-muted" style={{ width: '40px', fontSize: '1.4rem', textAlign: 'center' }}>{rank}</div>
                    
                    {activeTab === 'Oyuncu' && <SilhouetteAvatar />}
                    
                    <div style={{ flex: 1 }}>
                      <div className="font-bold" style={{ fontSize: '1.3rem' }}>
                        {activeTab === 'Oyuncu' ? <Link href={`/profile/${data.name.toLowerCase()}`} style={{ color: '#fff', textDecoration: 'none' }}>{data.name}</Link> : data.name}
                      </div>
                      {activeTab === 'Oyuncu' && <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '6px' }}><span style={{ color: 'var(--brand-main)' }}>{data.team}</span> • {data.position}</div>}
                      {activeTab === 'Takım' && <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '6px' }}>Kadro: {data.players} Oyuncu</div>}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--brand-light)', textShadow: '0 0 15px rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
                        {activeTab === 'Oyuncu' ? formatCurrency(data.value) : `${data.points} Puan`}
                      </div>
                      {activeTab === 'Takım' && (
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                          Değer: {formatCurrency(data.value)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

          </motion.div>
        </AnimatePresence>
      )}

    </div>
  )
}
