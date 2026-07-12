'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// --- MOCK DATA ---
const MY_USER = {
  id: 'usr_1',
  name: 'MustafaKucukbas',
  is_captain: true, // Kaptan Yetkisi AÇIK
  team: 'Teta League All Stars'
}

type PlayerStatus = 'Serbest' | 'Sözleşmeli'
type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'ATT'

type Player = {
  id: string
  name: string
  status: PlayerStatus
  position: PlayerPosition
  value: number
  rating: number
  team?: string
}

const rawPlayers: Player[] = [
  { id: 'p1', name: 'Valiente', status: 'Sözleşmeli', position: 'DEF', value: 2500000, rating: 8.7, team: 'Teta League All Stars' },
  { id: 'p2', name: 'GhostSniper', status: 'Serbest', position: 'ATT', value: 1200000, rating: 7.9 },
  { id: 'p3', name: 'PanterAli', status: 'Sözleşmeli', position: 'GK', value: 3400000, rating: 8.5, team: 'Anadolu FK' },
  { id: 'p4', name: 'OrtaSahaBeyi', status: 'Serbest', position: 'MID', value: 850000, rating: 7.8 },
  { id: 'p5', name: 'Kral_10', status: 'Sözleşmeli', position: 'ATT', value: 4100000, rating: 8.1, team: 'Bozkuşlar' },
  { id: 'p6', name: 'NinjaDef', status: 'Serbest', position: 'DEF', value: 950000, rating: 8.2 },
  { id: 'p7', name: 'Maestro', status: 'Sözleşmeli', position: 'MID', value: 5200000, rating: 8.1, team: 'Anadolu FK' },
  { id: 'p8', name: 'Roket', status: 'Serbest', position: 'DEF', value: 1100000, rating: 7.6 },
  { id: 'p9', name: 'Cengaver', status: 'Serbest', position: 'ATT', value: 2200000, rating: 7.4 },
  { id: 'p10', name: 'DuvarUstasi', status: 'Sözleşmeli', position: 'GK', value: 1800000, rating: 6.8, team: 'Bozkuşlar' },
  { id: 'p11', name: 'Firtina', status: 'Sözleşmeli', position: 'ATT', value: 6500000, rating: 8.6, team: 'Teta League All Stars' },
  { id: 'p12', name: 'Kilitci', status: 'Serbest', position: 'DEF', value: 750000, rating: 7.5 },
  { id: 'p13', name: 'Sihirbaz', status: 'Serbest', position: 'MID', value: 3100000, rating: 8.8 },
  { id: 'p14', name: 'KaptanG', status: 'Sözleşmeli', position: 'MID', value: 2800000, rating: 8.0, team: 'Siber SK' },
  { id: 'p15', name: 'UcanAdam', status: 'Serbest', position: 'GK', value: 500000, rating: 7.1 },
]

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}

// --- COMPONENTS ---
const SilhouetteAvatar = () => (
  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, boxShadow: 'inset 0 0 15px rgba(255,255,255,0.05)' }}>
    <svg width="40" height="48" viewBox="0 0 24 24" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  </div>
)

export default function TransferCenterPage() {
  // Filters State
  const [filterStatus, setFilterStatus] = useState<'Tümü' | 'Serbest' | 'Sözleşmeli'>('Tümü')
  const [filterPosition, setFilterPosition] = useState<'Tümü' | 'GK' | 'DEF' | 'MID' | 'ATT'>('Tümü')
  const [filterMaxVal, setFilterMaxVal] = useState<number>(10000000)
  const [filterMinRating, setFilterMinRating] = useState<number>(6.0)

  // Modal State
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Derived Data
  const filteredPlayers = useMemo(() => {
    return rawPlayers.filter(p => {
      if (filterStatus !== 'Tümü' && p.status !== filterStatus) return false
      if (filterPosition !== 'Tümü' && p.position !== filterPosition) return false
      if (p.value > filterMaxVal) return false
      if (p.rating < filterMinRating) return false
      return true
    }).sort((a, b) => b.value - a.value)
  }, [filterStatus, filterPosition, filterMaxVal, filterMinRating])

  const handleOffer = () => {
    if (!selectedPlayer) return
    setToast(`${selectedPlayer.name} adlı oyuncuya transfer teklifi başarıyla iletildi!`)
    setSelectedPlayer(null)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(64, 224, 208, 0.05)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '16px', color: 'var(--brand-main)', border: '1px solid rgba(64, 224, 208, 0.2)' }}>
          SCOUT NETWORK
        </div>
        <h1 className="font-bold" style={{ fontSize: '3.5rem', textShadow: '0 4px 15px rgba(0,0,0,0.6)', margin: 0, letterSpacing: '1px' }}>TRANSFER MERKEZİ</h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '12px' }}>Takımını güçlendirmek için serbest oyuncuları keşfet ve teklif yap.</p>
        
        {MY_USER.is_captain && (
          <div style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(64, 224, 208, 0.1)', border: '1px solid rgba(64, 224, 208, 0.3)', borderRadius: '12px', color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 0 20px rgba(64, 224, 208, 0.2)' }}>
            👑 KAPTAN YETKİSİ AKTİF <span style={{ opacity: 0.7, fontWeight: 'normal', marginLeft: '4px' }}>(Teklif Gönderebilirsiniz)</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '60px', alignItems: 'start', marginTop: '40px' }}>
        
        {/* SOL: FİLTRELEME MOTORU (Şeffaf HUD) */}
        <div style={{ padding: '32px 24px', position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '40px', background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.02)' }}>
          <h2 className="font-bold" style={{ fontSize: '1.2rem', color: '#fff', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--brand-main)', borderRadius: '50%', boxShadow: '0 0 10px var(--brand-glow)' }} />
            GELİŞMİŞ FİLTRE
          </h2>

          <div>
            <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '16px', letterSpacing: '1px' }}>STATÜ</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(['Tümü', 'Serbest', 'Sözleşmeli'] as const).map(s => {
                const isActive = filterStatus === s
                return (
                  <button 
                    key={s} 
                    onClick={() => setFilterStatus(s)} 
                    style={{ 
                      textAlign: 'left', 
                      padding: '12px 16px', 
                      background: isActive ? 'rgba(64, 224, 208, 0.1)' : 'transparent', 
                      border: '1px solid', 
                      borderColor: isActive ? 'var(--brand-main)' : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      borderRadius: '8px',
                      fontWeight: isActive ? 'bold' : 'normal',
                      boxShadow: isActive ? 'inset 0 0 15px rgba(64, 224, 208, 0.2), 0 0 10px rgba(64, 224, 208, 0.2)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '16px', letterSpacing: '1px' }}>MEVKİ</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {(['Tümü', 'GK', 'DEF', 'MID', 'ATT'] as const).map(p => {
                const isActive = filterPosition === p
                return (
                  <button 
                    key={p} 
                    onClick={() => setFilterPosition(p)} 
                    style={{ 
                      gridColumn: p === 'Tümü' ? '1 / -1' : 'auto', 
                      textAlign: 'center', 
                      padding: '12px', 
                      background: isActive ? 'rgba(64, 224, 208, 0.1)' : 'transparent', 
                      border: '1px solid', 
                      borderColor: isActive ? 'var(--brand-main)' : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      borderRadius: '8px',
                      fontWeight: isActive ? 'bold' : 'normal',
                      boxShadow: isActive ? 'inset 0 0 15px rgba(64, 224, 208, 0.2), 0 0 10px rgba(64, 224, 208, 0.2)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '16px', letterSpacing: '1px' }}>MAKSİMUM BÜTÇE (Değer)</label>
            <input 
              type="range" min="100000" max="10000000" step="100000" 
              value={filterMaxVal} onChange={(e) => setFilterMaxVal(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-main)', cursor: 'pointer' }} 
            />
            <div className="font-bold" style={{ textAlign: 'right', marginTop: '12px', color: '#fff', fontSize: '1.1rem' }}>{formatCurrency(filterMaxVal)}</div>
          </div>

          <div>
            <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '16px', letterSpacing: '1px' }}>MİNİMUM REYTİNG</label>
            <input 
              type="range" min="6.0" max="9.5" step="0.1" 
              value={filterMinRating} onChange={(e) => setFilterMinRating(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-main)', cursor: 'pointer' }} 
            />
            <div className="font-bold" style={{ textAlign: 'right', marginTop: '12px', color: 'var(--brand-main)', fontSize: '1.2rem', textShadow: '0 0 10px rgba(64, 224, 208, 0.4)' }}>{filterMinRating.toFixed(1)}</div>
          </div>

        </div>

        {/* SAĞ: OYUNCU LİSTESİ (Süzülen Satırlar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="font-bold" style={{ fontSize: '1.1rem', color: '#fff' }}>BULUNAN OYUNCULAR <span className="text-muted" style={{ fontWeight: 'normal' }}>({filteredPlayers.length})</span></div>
          </div>

          <AnimatePresence>
            {filteredPlayers.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.2 }}>🔍</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>Bu filtrelere uygun oyuncu bulunamadı.</div>
              </motion.div>
            ) : (
              filteredPlayers.map((player) => (
                <motion.div 
                  key={player.id} 
                  layout
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                  className="interactive" 
                  style={{ 
                    padding: '24px 32px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '32px', 
                    flexWrap: 'wrap',
                    background: 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                    borderRadius: '16px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(64, 224, 208, 0.05)'; e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(64, 224, 208, 0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', width: '280px' }}>
                    <SilhouetteAvatar />
                    <div>
                      <Link href={`/profile/${player.name.toLowerCase()}`} style={{ color: '#fff', textDecoration: 'none' }}>
                        <h3 className="font-bold" style={{ fontSize: '1.4rem', margin: '0 0 6px 0', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>{player.name}</h3>
                      </Link>
                      <div className="font-bold" style={{ fontSize: '1.1rem', color: 'var(--brand-main)', textShadow: '0 0 10px rgba(64, 224, 208, 0.3)' }}>{player.rating.toFixed(1)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORT</span></div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <div>
                      <div className="text-muted font-bold" style={{ fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '8px' }}>MEVKİ</div>
                      {/* Teknolojik Rozet */}
                      <div className="font-bold" style={{ fontSize: '1rem', color: 'var(--brand-main)', background: 'rgba(64, 224, 208, 0.1)', border: '1px solid rgba(64, 224, 208, 0.3)', padding: '6px 16px', borderRadius: '8px', boxShadow: '0 0 10px rgba(64, 224, 208, 0.1)', display: 'inline-block' }}>{player.position}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted font-bold" style={{ fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '8px' }}>STATÜ</div>
                      <div className="font-bold" style={{ fontSize: '1.1rem', color: player.status === 'Serbest' ? '#5de0a0' : 'var(--accent-danger)', textShadow: player.status === 'Serbest' ? '0 0 10px rgba(93, 224, 160, 0.4)' : 'none' }}>
                        {player.status.toUpperCase()}
                      </div>
                      {player.status === 'Sözleşmeli' && <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{player.team}</div>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div className="text-muted font-bold" style={{ fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '8px' }}>PİYASA DEĞERİ</div>
                      <div className="font-bold" style={{ fontSize: '1.8rem', color: '#ffd700', textShadow: '0 0 15px rgba(255,215,0,0.4)', letterSpacing: '1px' }}>{formatCurrency(player.value)}</div>
                    </div>
                    
                    {/* KAPTAN YETKİSİ: Teklif Butonu (Oyun İçi HUD) */}
                    {MY_USER.is_captain && player.status === 'Serbest' && (
                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(64, 224, 208, 0.8)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPlayer(player)}
                        style={{ padding: '16px 24px', background: 'rgba(64, 224, 208, 0.1)', border: '1px solid var(--brand-main)', color: '#fff', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(64, 224, 208, 0.4)', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        <span style={{ fontSize: '1.2rem', textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>🤝</span> TEKLİF YAP
                      </motion.button>
                    )}

                    {/* Kaptan değil veya Sözleşmeli ise Saydam Placeholder */}
                    {(!MY_USER.is_captain || player.status !== 'Serbest') && (
                      <div style={{ width: '180px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', opacity: 0.5, fontStyle: 'italic' }}>
                        Teklife Kapalı
                      </div>
                    )}
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* TRANSFER TEKLİFİ MODALI (GLASSMORPHISM) */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="client-glass interactive"
              style={{ width: '90%', maxWidth: '450px', background: 'rgba(10,15,20,0.6)', border: '1px solid rgba(64,224,208,0.2)', borderRadius: '24px', padding: '40px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 0 50px rgba(64,224,208,0.05)', textAlign: 'center' }}
            >
              <button onClick={() => setSelectedPlayer(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--brand-main)'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>×</button>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px', transform: 'scale(1.5)' }}>
                <SilhouetteAvatar />
              </div>

              <h3 className="font-bold" style={{ fontSize: '2.2rem', margin: 0, textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>{selectedPlayer.name}</h3>
              <div className="text-muted" style={{ marginTop: '8px', marginBottom: '32px', fontSize: '1.1rem' }}>{selectedPlayer.position} • <span style={{ color: 'var(--brand-main)' }}>{selectedPlayer.rating.toFixed(1)} ORT</span></div>

              <div style={{ background: 'rgba(255,215,0,0.05)', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid rgba(255,215,0,0.2)', boxShadow: 'inset 0 0 20px rgba(255,215,0,0.05)' }}>
                <div className="text-muted font-bold" style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '8px' }}>TEKLİF EDİLECEK BEDEL</div>
                <div className="font-bold" style={{ fontSize: '2.5rem', color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.4)' }}>
                  {formatCurrency(selectedPlayer.value)}
                </div>
                <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '16px' }}>
                  Kulüp bütçenizden ({MY_USER.team}) bu tutar eksilecektir.
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(64,224,208,0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOffer}
                style={{ width: '100%', padding: '16px', fontSize: '1.2rem', background: 'rgba(64, 224, 208, 0.15)', border: '1px solid var(--brand-main)', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 20px rgba(64, 224, 208, 0.3)', transition: 'all 0.3s' }}
              >
                TEKLİFİ GÖNDER
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST BİLDİRİMİ */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'rgba(93, 224, 160, 0.1)', backdropFilter: 'blur(10px)', padding: '16px 24px', color: '#5de0a0', borderRadius: '12px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(93, 224, 160, 0.2)', fontWeight: 'bold', border: '1px solid rgba(93, 224, 160, 0.5)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
