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
  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
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
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px', color: 'var(--brand-main)' }}>
          SCOUT NETWORK
        </div>
        <h1 className="font-bold" style={{ fontSize: '3rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0 }}>Transfer Merkezi</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '8px' }}>Takımını güçlendirmek için serbest oyuncuları keşfet ve teklif yap.</p>
        
        {MY_USER.is_captain && (
          <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(217, 119, 95, 0.1)', border: '1px solid rgba(217, 119, 95, 0.3)', borderRadius: '8px', color: 'var(--brand-light)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            👑 KAPTAN YETKİSİ AKTİF (Teklif Gönderebilirsiniz)
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* SOL: FİLTRELEME MOTORU */}
        <div className="game-panel" style={{ padding: '32px', position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <h2 className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-light)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
            Gelişmiş Filtreleme
          </h2>

          <div>
            <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '12px' }}>STATÜ</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(['Tümü', 'Serbest', 'Sözleşmeli'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} className="flat-button" style={{ textAlign: 'left', padding: '10px 16px', background: filterStatus === s ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid', borderColor: filterStatus === s ? 'var(--brand-main)' : 'rgba(255,255,255,0.05)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '12px' }}>MEVKİ</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(['Tümü', 'GK', 'DEF', 'MID', 'ATT'] as const).map(p => (
                <button key={p} onClick={() => setFilterPosition(p)} className="flat-button" style={{ gridColumn: p === 'Tümü' ? '1 / -1' : 'auto', textAlign: 'center', padding: '10px', background: filterPosition === p ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid', borderColor: filterPosition === p ? 'var(--brand-main)' : 'rgba(255,255,255,0.05)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '12px' }}>MAKSİMUM BÜTÇE (Değer)</label>
            <input 
              type="range" min="100000" max="10000000" step="100000" 
              value={filterMaxVal} onChange={(e) => setFilterMaxVal(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-main)' }} 
            />
            <div className="font-bold" style={{ textAlign: 'right', marginTop: '8px', color: '#fff' }}>{formatCurrency(filterMaxVal)}</div>
          </div>

          <div>
            <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '12px' }}>MİNİMUM REYTİNG</label>
            <input 
              type="range" min="6.0" max="9.5" step="0.1" 
              value={filterMinRating} onChange={(e) => setFilterMinRating(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-main)' }} 
            />
            <div className="font-bold" style={{ textAlign: 'right', marginTop: '8px', color: 'var(--brand-light)' }}>{filterMinRating.toFixed(1)}</div>
          </div>

        </div>

        {/* SAĞ: OYUNCU LİSTESİ (SCOUT NETWORK) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="text-muted font-bold" style={{ fontSize: '0.9rem' }}>BULUNAN OYUNCULAR ({filteredPlayers.length})</div>
          </div>

          <AnimatePresence>
            {filteredPlayers.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="game-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                Bu filtrelere uygun oyuncu bulunamadı.
              </motion.div>
            ) : (
              filteredPlayers.map((player) => (
                <motion.div 
                  key={player.id} 
                  layout
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                  className="game-panel interactive" 
                  style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}
                >
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '250px' }}>
                    <SilhouetteAvatar />
                    <div>
                      <Link href={`/profile/${player.name.toLowerCase()}`} style={{ color: '#fff', textDecoration: 'none' }}>
                        <h3 className="font-bold" style={{ fontSize: '1.3rem', margin: '0 0 4px 0' }}>{player.name}</h3>
                      </Link>
                      <div className="font-bold" style={{ fontSize: '1.1rem', color: 'var(--brand-light)' }}>{player.rating.toFixed(1)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORT</span></div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <div>
                      <div className="text-muted font-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '4px' }}>MEVKİ</div>
                      <div className="font-bold" style={{ fontSize: '1.1rem', color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '4px' }}>{player.position}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted font-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '4px' }}>STATÜ</div>
                      <div className="font-bold" style={{ fontSize: '1.1rem', color: player.status === 'Serbest' ? '#5de0a0' : 'var(--accent-danger)', textShadow: player.status === 'Serbest' ? '0 0 10px rgba(93, 224, 160, 0.4)' : 'none' }}>
                        {player.status.toUpperCase()}
                      </div>
                      {player.status === 'Sözleşmeli' && <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{player.team}</div>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div className="text-muted font-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '4px' }}>PİYASA DEĞERİ</div>
                      <div className="font-bold" style={{ fontSize: '1.6rem', color: '#ffd700', textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>{formatCurrency(player.value)}</div>
                    </div>
                    
                    {/* KAPTAN YETKİSİ: Teklif Butonu */}
                    {MY_USER.is_captain && player.status === 'Serbest' && (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPlayer(player)}
                        className="flat-button shimmer-effect"
                        style={{ padding: '16px 24px', background: 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))', border: '1px solid var(--brand-glow)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 20px rgba(217, 119, 95, 0.4)' }}
                      >
                        <span>🤝</span> TEKLİF YAP
                      </motion.button>
                    )}

                    {/* Kaptan değil veya Sözleşmeli ise Placeholder Box */}
                    {(!MY_USER.is_captain || player.status !== 'Serbest') && (
                      <div style={{ width: '170px', padding: '16px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
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

      {/* TRANSFER TEKLİFİ MODALI */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="game-panel interactive"
              style={{ width: '90%', maxWidth: '450px', background: 'linear-gradient(180deg, #181512 0%, #0c0a09 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.9)', textAlign: 'center' }}
            >
              <button onClick={() => setSelectedPlayer(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', transform: 'scale(1.5)' }}>
                <SilhouetteAvatar />
              </div>

              <h3 className="font-bold" style={{ fontSize: '2rem', margin: 0 }}>{selectedPlayer.name}</h3>
              <div className="text-muted" style={{ marginTop: '8px', marginBottom: '32px' }}>{selectedPlayer.position} • {selectedPlayer.rating.toFixed(1)} ORT</div>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid rgba(255,215,0,0.2)' }}>
                <div className="text-muted font-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>TEKLİF EDİLECEK BEDEL</div>
                <div className="font-bold" style={{ fontSize: '2.5rem', color: '#ffd700', textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
                  {formatCurrency(selectedPlayer.value)}
                </div>
                <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '12px' }}>
                  Kulüp bütçenizden ({MY_USER.team}) bu tutar eksilecektir.
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleOffer}
                className="flat-button shimmer-effect"
                style={{ width: '100%', padding: '16px', fontSize: '1.2rem', background: 'var(--brand-main)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}
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
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'rgba(93, 224, 160, 0.95)', padding: '16px 24px', color: '#111', borderRadius: '8px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: 'bold', border: '1px solid #5de0a0' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
