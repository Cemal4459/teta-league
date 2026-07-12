'use client'

import { useState, useRef, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// --- MOCK DATA ---
const MOCK_PLAYER = {
  id: 'usr_1',
  username: 'Valiente',
  tag: 'valiente_cb',
  team: 'Teta League All Stars',
  position: 'CB',
  value: '2.5M ₺',
  overall: 92,
  isOwner: true, // Mock auth check (true = bu profile bakan kişi kendisi)
}

const MOCK_SHOWCASE = [
  { id: 1, type: 'TOTW', title: 'Haftanın Takımı', week: 'Hafta 4', rating: 94, stat1: '95 DEF', stat2: '90 PHY', stat3: '82 PAC', color: '#ffd700' },
  { id: 2, type: 'MOTM', title: 'Maçın Oyuncusu', week: 'Derbi Özel', rating: 91, stat1: '99 TKL', stat2: '95 INT', stat3: '88 STR', color: '#ff6b6b' },
  { id: 3, type: 'POTM', title: 'Ayın Oyuncusu', week: 'Nisan 2026', rating: 96, stat1: '97 DEF', stat2: '94 PHY', stat3: '85 PAC', color: '#b19cd9' },
]

const MOCK_MATCH_HISTORY = [
  { id: 1, opp: 'Anadolu FK', score: '3-1', result: 'W', goals: 1, assists: 0, cs: false, rating: 8.7, date: 'Dün' },
  { id: 2, opp: 'Siber SK', score: '2-0', result: 'W', goals: 0, assists: 0, cs: true, rating: 9.1, date: '3 Gün Önce' },
  { id: 3, opp: 'Kartal ES', score: '0-0', result: 'D', goals: 0, assists: 0, cs: true, rating: 8.4, date: '1 Hafta Önce' },
  { id: 4, opp: 'Bozkuşlar', score: '1-2', result: 'L', goals: 0, assists: 0, cs: false, rating: 7.2, date: '2 Hafta Önce' },
]

const MOCK_ACHIEVEMENTS = [
  { id: 1, title: 'Duvar', desc: '3 maç üst üste gol yeme.', tier: 'altın', completed: true },
  { id: 2, title: 'Gladyatör', desc: '100 ikili mücadele kazan.', tier: 'gümüş', completed: true },
  { id: 3, title: 'Hava Kurdu', desc: '20 kafa topu kazan.', tier: 'gümüş', completed: true },
  { id: 4, title: 'Kesici', desc: '10 maçta pas arası rekoru kır.', tier: 'bronz', completed: true },
  { id: 5, title: 'Lider', desc: 'Kaptan olarak maça çık.', tier: 'bronz', completed: false },
  { id: 6, title: 'Gole Engel', desc: 'Çizgiden top çıkar.', tier: 'altın', completed: false },
]

// --- COMPONENTS ---

const SilhouetteCard = () => (
  <div style={{ position: 'relative', width: '220px', height: '300px', background: 'linear-gradient(180deg, rgba(20,20,20,0.8) 0%, rgba(5,5,5,0.95) 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.02)' }}>
    <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(217, 119, 95, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
    
    <svg width="140" height="180" viewBox="0 0 24 24" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '10px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.8))' }}>
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="url(#silhouetteGrad)" />
      <defs>
        <linearGradient id="silhouetteGrad" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.3)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.9)" />
        </linearGradient>
      </defs>
    </svg>
    
    <div className="font-bold" style={{ fontSize: '2rem', color: 'var(--brand-light)', textShadow: '0 0 15px var(--brand-glow)', zIndex: 1 }}>{MOCK_PLAYER.overall}</div>
    <div className="text-muted font-bold" style={{ fontSize: '1.2rem', zIndex: 1 }}>{MOCK_PLAYER.position}</div>
  </div>
)

export default function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  
  const [activeTab, setActiveTab] = useState<'Maç Geçmişi' | 'ClubsBuilder' | 'Başarımlar'>('Maç Geçmişi')
  const [toast, setToast] = useState<{ message: string, error?: boolean } | null>(null)
  const carouselRef = useRef(null)

  const showToast = (msg: string, isError = false) => {
    setToast({ message: msg, error: isError })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* 1. TOP SECTION: KİMLİK & DEĞER */}
      <div className="game-panel interactive" style={{ padding: '40px', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SilhouetteCard />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="font-bold" style={{ fontSize: '3rem', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                {id === 'valiente' ? 'Valiente' : id.toUpperCase()}
              </h1>
              <div className="text-muted" style={{ fontSize: '1.1rem', letterSpacing: '2px', marginTop: '4px' }}>@{MOCK_PLAYER.tag} • {MOCK_PLAYER.team}</div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div className="text-subtle" style={{ fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '4px' }}>GÜNCEL PİYASA DEĞERİ</div>
              <div className="font-bold" style={{ fontSize: '2.5rem', color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.4)' }}>
                {MOCK_PLAYER.value}
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

          <div style={{ display: 'flex', gap: '32px' }}>
            <div><span className="text-muted" style={{ display: 'block', fontSize: '0.8rem' }}>Uyruk</span><span className="font-bold">Türkiye</span></div>
            <div><span className="text-muted" style={{ display: 'block', fontSize: '0.8rem' }}>Platform</span><span className="font-bold">Yeni Nesil (Cross)</span></div>
            <div><span className="text-muted" style={{ display: 'block', fontSize: '0.8rem' }}>Tercih Edilen Ayak</span><span className="font-bold">Sağ</span></div>
          </div>
        </div>
      </div>

      {/* 2. VİTRİN (SHOWCASE CAROUSEL) */}
      <div>
        <h2 className="font-bold text-muted" style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--brand-main)' }}>//</span> KARİYER VİTRİNİ
        </h2>
        <motion.div ref={carouselRef} style={{ overflow: 'hidden', cursor: 'grab' }} whileTap={{ cursor: 'grabbing' }}>
          <motion.div 
            drag="x" 
            dragConstraints={carouselRef} 
            style={{ display: 'flex', gap: '24px', paddingBottom: '20px' }}
          >
            {MOCK_SHOWCASE.map(card => (
              <div key={card.id} style={{ minWidth: '240px', height: '340px', background: `linear-gradient(135deg, rgba(20,20,20,0.9), rgba(5,5,5,0.95))`, border: `2px solid ${card.color}40`, borderRadius: '16px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '24px', boxShadow: `0 10px 30px rgba(0,0,0,0.8), inset 0 0 40px ${card.color}20` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0z' fill='${encodeURIComponent(card.color)}' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`, pointerEvents: 'none' }} />
                
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div className="font-bold" style={{ fontSize: '1.5rem', color: card.color }}>{card.type}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{card.week}</div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  <div className="font-bold" style={{ fontSize: '4rem', color: '#fff', textShadow: `0 0 20px ${card.color}80` }}>{card.rating}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', zIndex: 1, borderTop: `1px solid ${card.color}40`, paddingTop: '16px' }}>
                  <div className="font-bold" style={{ fontSize: '0.85rem' }}>{card.stat1}</div>
                  <div className="font-bold" style={{ fontSize: '0.85rem' }}>{card.stat2}</div>
                  <div className="font-bold" style={{ fontSize: '0.85rem' }}>{card.stat3}</div>
                </div>
              </div>
            ))}
            
            {/* Boş Slot */}
            <div style={{ minWidth: '240px', height: '340px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '2rem' }}>+</span>
              <span style={{ fontSize: '0.9rem' }}>Boş Vitrin Alanı</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 3. DİNAMİK SEKMELER (MAÇLAR, BUILD, BAŞARIMLAR) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', overflowX: 'auto' }}>
          {(['Maç Geçmişi', 'ClubsBuilder', 'Başarımlar'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flat-button"
              style={{ background: activeTab === tab ? 'rgba(217, 119, 95, 0.15)' : 'transparent', borderColor: activeTab === tab ? 'var(--brand-main)' : 'transparent', color: activeTab === tab ? 'var(--brand-light)' : 'var(--text-muted)', padding: '12px 24px', fontSize: '1rem', whiteSpace: 'nowrap' }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          
          {/* --- MAÇ GEÇMİŞİ --- */}
          {activeTab === 'Maç Geçmişi' && (
            <motion.div key="History" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MOCK_MATCH_HISTORY.map((match) => (
                <div key={match.id} className="game-panel interactive" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '200px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{match.opp.slice(0,1)}</div>
                    <div>
                      <div className="font-bold" style={{ fontSize: '1.1rem' }}>{match.opp}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{match.date}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: match.result === 'W' ? '#5de0a0' : match.result === 'L' ? 'var(--accent-danger)' : 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{match.result}</div>
                    <div className="font-bold" style={{ fontSize: '1.4rem', letterSpacing: '2px' }}>{match.score}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}><div className="text-subtle" style={{ fontSize: '0.7rem' }}>GOL</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>{match.goals}</div></div>
                    <div style={{ textAlign: 'center' }}><div className="text-subtle" style={{ fontSize: '0.7rem' }}>ASİST</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>{match.assists}</div></div>
                    <div style={{ textAlign: 'center' }}><div className="text-subtle" style={{ fontSize: '0.7rem' }}>C. SHEET</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>{match.cs ? 'Evet' : 'Hayır'}</div></div>
                    <div style={{ textAlign: 'center' }}><div className="text-subtle" style={{ fontSize: '0.7rem' }}>REYTING</div><div className="font-bold" style={{ fontSize: '1.3rem', color: 'var(--brand-light)' }}>{match.rating}</div></div>
                  </div>

                </div>
              ))}
            </motion.div>
          )}

          {/* --- CLUBS BUILDER (RPG YETENEK AĞACI) --- */}
          {activeTab === 'ClubsBuilder' && (
            <motion.div key="Builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              
              <div className="game-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-light)' }}>Fiziksel Özellikler</h3>
                
                <div>
                  <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>BOY (cm)</label>
                  <input type="range" min="160" max="210" defaultValue="192" style={{ width: '100%', accentColor: 'var(--brand-main)' }} disabled={!MOCK_PLAYER.isOwner} />
                  <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold' }}>192 cm</div>
                </div>

                <div>
                  <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>KİLO (kg)</label>
                  <input type="range" min="50" max="110" defaultValue="85" style={{ width: '100%', accentColor: 'var(--brand-main)' }} disabled={!MOCK_PLAYER.isOwner} />
                  <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold' }}>85 kg</div>
                </div>

                <div>
                  <label className="text-muted font-bold" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>OYUN STİLİ (ARCHETYPE)</label>
                  <select className="flat-input" style={{ width: '100%' }} disabled={!MOCK_PLAYER.isOwner} defaultValue="Kaya (Kuvvet)">
                    <option>Kaya (Kuvvet)</option>
                    <option>Maestro (Oyun Kurucu)</option>
                    <option>Avcı (Bitirici)</option>
                    <option>Gölge (Savunma)</option>
                  </select>
                </div>
              </div>

              <div className="game-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-light)' }}>Seçili Perkler (Yetenekler)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid #ff6b6b' }}>
                    <div className="font-bold">Müdahale Ustası</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Ayakta müdahalelerde topu geri kazanma şansını artırır.</div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid #5de0a0' }}>
                    <div className="font-bold">Hava Topu Hakimi</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Kafa toplarındaki isabet ve güç artar.</div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid #b19cd9' }}>
                    <div className="font-bold">Yorulmaz</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Maç sonlarında fiziksel düşüşü engeller.</div>
                  </div>
                </div>

                {MOCK_PLAYER.isOwner && (
                  <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '24px' }}>
                    <button onClick={() => showToast('Build başarıyla kaydedildi!')} className="flat-button" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)' }}>KAYDET</button>
                    <button onClick={() => showToast('Build Teta Network ağında paylaşıldı!')} className="flat-button primary" style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span>⚔️</span> AĞDA PAYLAŞ
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* --- BAŞARIMLAR --- */}
          {activeTab === 'Başarımlar' && (
            <motion.div key="Achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {MOCK_ACHIEVEMENTS.map(ach => {
                const medalColor = ach.tier === 'altın' ? '#ffd700' : ach.tier === 'gümüş' ? '#c0c0c0' : '#cd7f32'
                
                return (
                  <div key={ach.id} className="game-panel shimmer-effect" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: ach.completed ? 1 : 0.4, filter: ach.completed ? 'none' : 'grayscale(80%)', transition: 'all 0.3s' }}>
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

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '40px', right: '40px', background: toast.error ? 'rgba(255, 59, 48, 0.9)' : 'rgba(217, 119, 95, 0.9)', padding: '16px 24px', color: '#fff', borderRadius: '8px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: 'bold' }}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
