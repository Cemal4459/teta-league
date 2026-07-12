'use client'

import { useState, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { superLeagueStandings, firstLeagueStandings } from '@/lib/data'
import Link from 'next/link'

const allTeams = [
  ...superLeagueStandings.map(t => ({ ...t, league: 'Süper Lig' })),
  ...firstLeagueStandings.map(t => ({ ...t, league: '1. Lig' })),
]

const MOCK_ROSTER = [
  { id: 1, name: 'Valiente', pos: 'CB', goals: 2, assists: 0, cs: 8, rating: 8.7, value: '2.5M ₺' },
  { id: 2, name: 'MustafaKucukbas', pos: 'ST', goals: 14, assists: 5, cs: 0, rating: 9.1, value: '5.2M ₺' },
  { id: 3, name: 'DorukKaya', pos: 'CDM', goals: 1, assists: 8, cs: 5, rating: 8.4, value: '1.8M ₺' },
  { id: 4, name: 'KeremAcar', pos: 'CAM', goals: 7, assists: 11, cs: 0, rating: 8.9, value: '4.1M ₺' },
  { id: 5, name: 'Kral_10', pos: 'LW', goals: 9, assists: 4, cs: 0, rating: 8.2, value: '3.0M ₺' },
]

const MOCK_MATCHES = [
  { id: 101, opp: 'Anadolu FK', res: 'W', score: '3-1', home: true, scorers: ['MustafaKucukbas (x2)', 'Kral_10'], assisters: ['KeremAcar (x2)', 'DorukKaya'] },
  { id: 102, opp: 'Siber SK', res: 'W', score: '2-0', home: false, scorers: ['KeremAcar', 'Valiente'], assisters: ['MustafaKucukbas'] },
  { id: 103, opp: 'Bozkuşlar', res: 'L', score: '0-1', home: true, scorers: [], assisters: [] },
  { id: 104, opp: 'Kartal ES', res: 'D', score: '2-2', home: false, scorers: ['Kral_10', 'MustafaKucukbas'], assisters: ['KeremAcar'] },
  { id: 105, opp: 'Neon FC', res: 'W', score: '4-0', home: true, scorers: ['MustafaKucukbas (x3)', 'KeremAcar'], assisters: ['DorukKaya (x2)', 'Kral_10'] },
]

const MOCK_ACHIEVEMENTS = [
  { id: 1, title: 'İlk Adım', desc: 'Lige kayıt ol ve ilk maçına çık.', tier: 'bronz', completed: true },
  { id: 2, title: 'Gole Doymayan', desc: 'Bir maçta 5 gol at.', tier: 'altın', completed: false },
  { id: 3, title: 'Durdurulamaz', desc: 'Üst üste 5 galibiyet al.', tier: 'altın', completed: true },
  { id: 4, title: 'Duvar', desc: '3 maç üst üste gol yeme.', tier: 'gümüş', completed: true },
  { id: 5, title: 'Asist Kralı', desc: 'Bir sezonda 20 asist yap.', tier: 'altın', completed: false },
  { id: 6, title: 'Centilmen', desc: '10 maç boyunca kart görme.', tier: 'bronz', completed: true },
  { id: 7, title: 'Derbi Fatihi', desc: 'Ezeli rakibi deplasmanda yen.', tier: 'gümüş', completed: true },
  { id: 8, title: 'Son Saniye', desc: '90+ da galibiyet golü at.', tier: 'gümüş', completed: false },
  { id: 9, title: 'Şampiyon', desc: 'Ligi birinci bitir.', tier: 'altın', completed: true },
  { id: 10, title: 'Kupa Beyi', desc: 'Kupa turnuvasını kazan.', tier: 'gümüş', completed: true },
  { id: 11, title: 'Yenilmez', desc: 'Sezonu namağlup bitir.', tier: 'altın', completed: false },
  { id: 12, title: 'Sadakat', desc: 'Aynı takımda 50 maça çık.', tier: 'altın', completed: false },
  { id: 13, title: 'Transfer Sihirbazı', desc: 'Piyasa değerini 10M ₺ yap.', tier: 'altın', completed: false },
  { id: 14, title: 'İlk Kan', desc: 'Maçın ilk 5 dakikasında gol at.', tier: 'bronz', completed: true },
  { id: 15, title: 'Geri Dönüş', desc: '2-0 geriden gelip maç kazan.', tier: 'gümüş', completed: false },
  { id: 16, title: 'Uzaktan Avcı', desc: 'Ceza sahası dışından 5 gol at.', tier: 'gümüş', completed: true },
  { id: 17, title: 'Hattrick Kahramanı', desc: 'Bir maçta 3 gol at.', tier: 'gümüş', completed: true },
  { id: 18, title: 'Lider', desc: 'Takım kaptanı olarak 10 maça çık.', tier: 'bronz', completed: true },
  { id: 19, title: 'Altın Ayakkabı', desc: 'Sezonu gol kralı tamamla.', tier: 'altın', completed: false },
  { id: 20, title: 'Taraftarın Sevgilisi', desc: 'Sosyal ağda 1000 beğeni al.', tier: 'bronz', completed: true },
]

export default function TeamProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  
  const team = allTeams.find(t => t.tag.toLowerCase() === id) ?? allTeams[0]
  
  const [activeTab, setActiveTab] = useState<'Kadro' | 'İstatistikler' | 'Müze' | 'Başarımlar'>('Kadro')
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null)

  const toggleMatch = (id: number) => {
    setExpandedMatch(expandedMatch === id ? null : id)
  }

  // Silhouette SVG component for anonymous players
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
      
      {/* RESPONSIVE GRID LAYOUT */}
      <style>{`
        @media (min-width: 1024px) {
          .tp-grid { display: grid; grid-template-columns: 320px 1fr; gap: 40px; align-items: start; }
        }
        @media (max-width: 1023px) {
          .tp-grid { display: flex; flex-direction: column; gap: 32px; }
        }
        
        /* 3D Museum Perspective */
        .museum-container {
          perspective: 1200px;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          gap: 100px;
          overflow: hidden;
        }
        .museum-shelf {
          position: relative;
          width: 100%;
          height: 20px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.8));
          transform-style: preserve-3d;
          transform: rotateX(25deg);
          box-shadow: 0 40px 50px rgba(0,0,0,0.9), inset 0 2px 5px rgba(255,255,255,0.2);
          border-radius: 4px;
          display: flex;
          justify-content: center;
          gap: 60px;
        }
        .museum-trophy-item {
          position: relative;
          bottom: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: rotateX(-25deg); /* Counter-rotate to stand up straight */
          transition: transform 0.3s;
        }
        .museum-trophy-item:hover {
          transform: rotateX(-25deg) translateY(-10px) scale(1.05);
        }
        /* Radial Spot Light Effect on Trophy */
        .museum-trophy-item::before {
          content: '';
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 140px;
          background: radial-gradient(ellipse at top, rgba(217,119,95,0.25) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        }
      `}</style>

      <div className="tp-grid">
        
        {/* SOL TARAF: KÜNYE */}
        <div className="game-panel" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'sticky', top: '120px' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, var(--brand-main), transparent)' }} />
          
          <div className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-light)', textShadow: '0 0 20px var(--brand-glow)', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', width: '100%' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>TOPLAM TAKIM DEĞERİ</span>
            15.5M ₺
          </div>

          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,20,0.9))', border: '1px solid var(--brand-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--brand-main)', boxShadow: '0 0 30px rgba(217,119,95,0.2)', marginBottom: '24px' }}>
            {team.tag.slice(0, 3)}
          </div>

          <h1 className="font-bold" style={{ fontSize: '2rem', marginBottom: '8px' }}>{team.name}</h1>
          <div className="text-muted" style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '32px' }}>{team.league}</div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { l: 'Sıra', v: `#${team.position}`, highlight: true },
              { l: 'Oynanan Maç', v: team.played },
              { l: 'Galibiyet', v: team.won, color: '#5de0a0' },
              { l: 'Beraberlik', v: team.drawn, color: 'var(--text-muted)' },
              { l: 'Mağlubiyet', v: team.lost, color: 'var(--accent-danger)' },
              { l: 'Puan', v: team.points, highlight: true }
            ].map(stat => (
              <div key={stat.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{stat.l}</span>
                <span className="font-bold" style={{ color: stat.highlight ? 'var(--brand-main)' : (stat.color || '#fff') }}>{stat.v}</span>
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
                className="flat-button"
                style={{ background: activeTab === tab ? 'rgba(217, 119, 95, 0.15)' : 'transparent', borderColor: activeTab === tab ? 'var(--brand-main)' : 'transparent', color: activeTab === tab ? 'var(--brand-light)' : 'var(--text-muted)', padding: '12px 24px', fontSize: '1rem', whiteSpace: 'nowrap' }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            
            {/* --- KADRO SEKMESİ --- */}
            {activeTab === 'Kadro' && (
              <motion.div key="Kadro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {MOCK_ROSTER.map((player) => (
                  <div key={player.id} className="game-panel interactive" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <SilhouetteAvatar />
                    
                    <div style={{ flex: '1 1 200px' }}>
                      <Link href={`/profile/${player.name.toLowerCase()}`} style={{ color: '#fff', textDecoration: 'none' }}>
                        <h3 className="font-bold" style={{ fontSize: '1.2rem', margin: '0 0 4px 0' }}>{player.name}</h3>
                      </Link>
                      <span style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--brand-light)' }}>{player.pos}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'center' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>GOL</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>{player.goals}</div></div>
                      <div style={{ textAlign: 'center' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>ASİST</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>{player.assists}</div></div>
                      <div style={{ textAlign: 'center' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>C. SHEET</div><div className="font-bold" style={{ fontSize: '1.2rem' }}>{player.cs}</div></div>
                      <div style={{ textAlign: 'center' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>REYTING</div><div className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-light)' }}>{player.rating}</div></div>
                      <div style={{ textAlign: 'center', minWidth: '80px', paddingLeft: '24px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}><div className="text-muted" style={{ fontSize: '0.7rem' }}>DEĞER</div><div className="font-bold" style={{ fontSize: '1.2rem', color: '#5de0a0' }}>{player.value}</div></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* --- İSTATİSTİKLER SEKMESİ --- */}
            {activeTab === 'İstatistikler' && (
              <motion.div key="Stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* FORM BAR */}
                <div className="game-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="font-bold text-muted">Form Durumu (Son 5 Maç)</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {MOCK_MATCHES.map((m, i) => (
                      <div key={i} style={{ width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: '#fff', background: m.res === 'W' ? '#5de0a0' : m.res === 'L' ? 'var(--accent-danger)' : 'rgba(255,255,255,0.2)' }}>
                        {m.res}
                      </div>
                    ))}
                  </div>
                </div>

                {/* MATCH LIST (ACCORDION) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-light)' }}>Son Oynanan Maçlar</h3>
                  {MOCK_MATCHES.map((match) => (
                    <div key={match.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      <div onClick={() => toggleMatch(match.id)} className="game-panel interactive" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', zIndex: 2 }}>
                        <div style={{ flex: 1, fontWeight: 'bold', fontSize: '1.1rem', color: match.home ? 'var(--brand-main)' : '#fff', textAlign: 'right' }}>
                          {match.home ? team.name : match.opp}
                        </div>
                        <div style={{ padding: '0 32px', textAlign: 'center' }}>
                          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                            {match.score}
                          </div>
                        </div>
                        <div style={{ flex: 1, fontWeight: 'bold', fontSize: '1.1rem', color: !match.home ? 'var(--brand-main)' : '#fff', textAlign: 'left' }}>
                          {!match.home ? team.name : match.opp}
                        </div>
                        <div className="text-muted" style={{ position: 'absolute', right: '24px', transition: 'transform 0.3s', transform: expandedMatch === match.id ? 'rotate(180deg)' : 'none' }}>▼</div>
                      </div>

                      {/* Accordion Content */}
                      <AnimatePresence>
                        {expandedMatch === match.id && (
                          <motion.div initial={{ height: 0, opacity: 0, y: -20 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -20 }} style={{ overflow: 'hidden', zIndex: 1 }}>
                            <div style={{ padding: '32px 24px 24px', background: 'rgba(217, 119, 95, 0.05)', border: '1px solid rgba(217, 119, 95, 0.2)', borderTop: 'none', borderRadius: '0 0 16px 16px', marginTop: '-16px', display: 'flex', gap: '48px', justifyContent: 'center' }}>
                              
                              <div style={{ flex: 1, textAlign: 'right' }}>
                                <div className="text-muted font-bold" style={{ fontSize: '0.8rem', marginBottom: '12px' }}>⚽ GOL ATANLAR</div>
                                {match.scorers.length > 0 ? match.scorers.map((s, i) => <div key={i} style={{ color: '#fff', marginBottom: '6px' }}>{s}</div>) : <div className="text-muted">-</div>}
                              </div>
                              
                              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                              
                              <div style={{ flex: 1, textAlign: 'left' }}>
                                <div className="text-muted font-bold" style={{ fontSize: '0.8rem', marginBottom: '12px' }}>🎯 ASİST YAPANLAR</div>
                                {match.assisters.length > 0 ? match.assisters.map((s, i) => <div key={i} style={{ color: '#fff', marginBottom: '6px' }}>{s}</div>) : <div className="text-muted">-</div>}
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* --- MÜZE (3D TROPHY CABINET) --- */}
            {activeTab === 'Müze' && (
              <motion.div key="Muze" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <div className="game-panel" style={{ background: 'radial-gradient(ellipse at top, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.9) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                  
                  <div className="museum-container">
                    
                    {/* Shelf 1 */}
                    <div className="museum-shelf">
                      <div className="museum-trophy-item">
                        <TrophyIcon />
                        <div className="font-bold" style={{ marginTop: '16px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>S4 Şampiyonu</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Mayıs 2026</div>
                      </div>
                      <div className="museum-trophy-item">
                        <TrophyIcon />
                        <div className="font-bold" style={{ marginTop: '16px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Elit Kupa</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Nisan 2026</div>
                      </div>
                    </div>

                    {/* Shelf 2 (Empty for realism) */}
                    <div className="museum-shelf">
                      <div className="museum-trophy-item" style={{ opacity: 0.2, filter: 'grayscale(100%)' }}>
                        <TrophyIcon />
                        <div className="font-bold" style={{ marginTop: '16px', color: '#fff' }}>Şampiyonlar Ligi</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Kilitli</div>
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

      </div>
    </div>
  )
}
