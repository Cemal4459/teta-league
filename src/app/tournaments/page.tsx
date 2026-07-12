'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<'1v1' | 'Team'>('1v1')
  const [hofTab, setHofTab] = useState<'1v1' | 'Team'>('1v1')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePayment = () => {
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setIsModalOpen(false)
    }, 2000)
  }

  const hallOfFame = {
    '1v1': [
      { id: 1, name: 'MustafaKucuk', season: 'Sezon 4 Şampiyonu', date: 'Ekim 2025', avatar: 'M' },
      { id: 2, name: 'Kral_10', season: 'Sezon 3 Şampiyonu', date: 'Temmuz 2025', avatar: 'K' },
      { id: 3, name: 'GhostSniper', season: 'Sezon 2 Şampiyonu', date: 'Nisan 2025', avatar: 'G' },
      { id: 4, name: 'Valiente', season: 'Sezon 1 Şampiyonu', date: 'Ocak 2025', avatar: 'V' },
    ],
    'Team': [
      { id: 1, name: 'Anadolu FK', season: 'Night Series 2025 - Güz', date: 'Kasım 2025', avatar: 'A' },
      { id: 2, name: 'Siber SK', season: 'Night Series 2025 - Yaz', date: 'Ağustos 2025', avatar: 'S' },
      { id: 3, name: 'Bozkuşlar', season: 'Night Series 2025 - Bahar', date: 'Mayıs 2025', avatar: 'B' },
    ]
  }

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1800px', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* CSS For Tournament Bracket */}
      <style>{`
        .bracket-wrapper {
          display: flex;
          align-items: center;
          gap: 60px;
          overflow-x: auto;
          padding: 40px 20px;
        }
        
        .bracket-column {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 800px;
        }
        
        .col-qf { height: 800px; }
        .col-sf { height: 800px; justify-content: space-around; padding: 100px 0; }
        .col-f  { height: 800px; justify-content: center; }
        .col-c  { height: 800px; justify-content: center; }

        .match-card {
          background: linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          width: 220px;
          padding: 12px;
          position: relative;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          z-index: 2;
        }

        .match-card.qf:nth-child(odd)::after {
          content: ''; position: absolute; right: -30px; top: 50%; width: 30px; height: calc(100px + 50%);
          border-top: 2px solid var(--brand-main); border-right: 2px solid var(--brand-main); border-top-right-radius: 8px; z-index: 1;
        }
        .match-card.qf:nth-child(even)::after {
          content: ''; position: absolute; right: -30px; bottom: 50%; width: 30px; height: calc(100px + 50%);
          border-bottom: 2px solid var(--brand-main); border-right: 2px solid var(--brand-main); border-bottom-right-radius: 8px; z-index: 1;
        }
        .match-card.sf:nth-child(1)::after {
          content: ''; position: absolute; right: -30px; top: 50%; width: 30px; height: calc(200px + 50%);
          border-top: 2px solid var(--brand-main); border-right: 2px solid var(--brand-main); border-top-right-radius: 8px; z-index: 1;
        }
        .match-card.sf:nth-child(2)::after {
          content: ''; position: absolute; right: -30px; bottom: 50%; width: 30px; height: calc(200px + 50%);
          border-bottom: 2px solid var(--brand-main); border-right: 2px solid var(--brand-main); border-bottom-right-radius: 8px; z-index: 1;
        }
        .match-card.f::after {
          content: ''; position: absolute; right: -30px; top: 50%; width: 30px;
          border-top: 2px solid #ffd700; z-index: 1;
        }

        .player-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px; border-radius: 4px; margin-bottom: 4px;
        }
        .player-row:last-child { margin-bottom: 0; }
        .player-row.winner { background: rgba(64, 224, 208, 0.15); border-left: 3px solid var(--brand-main); }
      `}</style>

      {/* HEADER & TABS */}
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <h1 className="font-bold" style={{ fontSize: '3.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0, letterSpacing: '1px' }}>LOBİ</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '8px', marginBottom: '40px' }}>Rekabetin zirvesine katıl veya turnuva ağacını takip et.</p>

        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={() => setActiveTab('1v1')}
            style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', background: activeTab === '1v1' ? 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.1rem' }}
          >
            1v1 ARENA
          </button>
          <button 
            onClick={() => setActiveTab('Team')}
            style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', background: activeTab === 'Team' ? 'linear-gradient(135deg, #87ceeb, #4169e1)' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.1rem' }}
          >
            NIGHT SERIES (TAKIM)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', marginTop: '40px', alignItems: 'start' }}>
        
        {/* =========================================
            SOL KOLON (Lobi Kartı & Turnuva Ağacı)
            ========================================= */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              
              {/* LOBİ KARTI (HERO BANNER) */}
              <div className="client-glass interactive shimmer-effect" style={{ background: activeTab === '1v1' ? 'rgba(64, 224, 208, 0.05)' : 'rgba(135, 206, 235, 0.05)', border: 'none', borderRadius: '24px', padding: '60px', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', justifyContent: 'space-between', boxShadow: `0 0 50px ${activeTab === '1v1' ? 'rgba(64, 224, 208, 0.15)' : 'rgba(135, 206, 235, 0.15)'}` }}>
                
                <div style={{ flex: '1 1 400px' }}>
                  <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>KAYITLAR AÇIK</div>
                  <h2 className="font-bold" style={{ fontSize: '3.5rem', marginBottom: '16px', textShadow: '0 4px 10px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>
                    {activeTab === '1v1' ? 'TETA 1v1 PRO ARENA' : 'NIGHT SERIES BATTLE'}
                  </h2>
                  <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '32px' }}>
                    {activeTab === '1v1' ? 'Sadece bireysel yeteneğin konuştuğu, en iyilerin hayatta kaldığı efsanevi 1v1 turnuvası. Kaydını yaptır ve eşleşmeni bekle.' : 'Takımını kur, stratejini belirle ve Teta League e-spor arenasında geceye damganı vur.'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>ÖDÜL HAVUZU</div>
                      <div className="font-bold" style={{ fontSize: '2.5rem', color: '#ffd700', textShadow: '0 0 15px rgba(255,215,0,0.4)' }}>{activeTab === '1v1' ? '10.000 ₺' : '50.000 ₺'}</div>
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>BAŞLANGIÇ</div>
                      <div className="font-bold" style={{ fontSize: '2.5rem', color: '#fff' }}>24 Ağu</div>
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>FORMAT</div>
                      <div className="font-bold" style={{ fontSize: '2.5rem', color: '#fff' }}>BO3</div>
                    </div>
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flat-button shimmer-effect" 
                    style={{ padding: '20px 40px', fontSize: '1.3rem', background: activeTab === '1v1' ? 'var(--brand-main)' : '#4169e1', border: 'none', color: '#fff', borderRadius: '12px', boxShadow: `0 10px 20px ${activeTab === '1v1' ? 'rgba(64, 224, 208, 0.4)' : 'rgba(65, 105, 225, 0.4)'}` }}
                  >
                    {activeTab === '1v1' ? 'ARENAYA KATIL (50 ₺)' : 'TAKIMINI KAYDET (250 ₺)'}
                  </motion.button>
                </div>
                
                <div style={{ width: '300px', height: '300px', background: `radial-gradient(circle, ${activeTab === '1v1' ? 'rgba(64, 224, 208, 0.15)' : 'rgba(135, 206, 235, 0.15)'} 0%, transparent 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '10rem', filter: `drop-shadow(0 0 30px ${activeTab === '1v1' ? 'var(--brand-glow)' : 'rgba(135, 206, 235, 0.6)'})` }}>
                    {activeTab === '1v1' ? '⚔️' : '🛡️'}
                  </div>
                </div>

              </div>

              {/* TURNUVA AĞACI (E-SPORTS BRACKET) */}
              <div style={{ marginTop: '80px' }}>
                <h3 className="font-bold text-muted" style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: activeTab === '1v1' ? 'var(--brand-main)' : '#87ceeb' }}>//</span> CANLI TURNUVA AĞACI
                </h3>

                <div className="bracket-wrapper" style={{ cursor: 'grab' }}>
                  
                  {/* Çeyrek Final */}
                  <div className="bracket-column col-qf">
                    {[
                      { p1: 'MustafaKucuk', s1: 2, p2: 'Valiente', s2: 1 },
                      { p1: 'DorukKaya', s1: 0, p2: 'KeremAcar', s2: 2 },
                      { p1: 'GhostSniper', s1: 3, p2: 'Roket', s2: 1 },
                      { p1: 'Kral_10', s1: 2, p2: 'PanterAli', s2: 0 },
                    ].map((m, i) => (
                      <div key={i} className="match-card qf">
                        <div className={`player-row ${m.s1 > m.s2 ? 'winner' : ''}`}>
                          <span className="font-bold">{m.p1}</span>
                          <span className="font-bold">{m.s1}</span>
                        </div>
                        <div className={`player-row ${m.s2 > m.s1 ? 'winner' : ''}`}>
                          <span className="font-bold">{m.p2}</span>
                          <span className="font-bold">{m.s2}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Yarı Final */}
                  <div className="bracket-column col-sf">
                    {[
                      { p1: 'MustafaKucuk', s1: 2, p2: 'KeremAcar', s2: 1 },
                      { p1: 'GhostSniper', s1: 0, p2: 'Kral_10', s2: 2 },
                    ].map((m, i) => (
                      <div key={i} className="match-card sf">
                        <div className={`player-row ${m.s1 > m.s2 ? 'winner' : ''}`}>
                          <span className="font-bold">{m.p1}</span>
                          <span className="font-bold">{m.s1}</span>
                        </div>
                        <div className={`player-row ${m.s2 > m.s1 ? 'winner' : ''}`}>
                          <span className="font-bold">{m.p2}</span>
                          <span className="font-bold">{m.s2}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Final */}
                  <div className="bracket-column col-f">
                    <div className="match-card f" style={{ border: '1px solid #ffd700', boxShadow: '0 0 20px rgba(255,215,0,0.2)' }}>
                      <div className="player-row winner">
                        <span className="font-bold">MustafaKucuk</span>
                        <span className="font-bold">3</span>
                      </div>
                      <div className="player-row">
                        <span className="font-bold">Kral_10</span>
                        <span className="font-bold">1</span>
                      </div>
                    </div>
                  </div>

                  {/* Şampiyon */}
                  <div className="bracket-column col-c">
                    <div className="client-glass interactive shimmer-effect" style={{ width: '260px', padding: '30px', background: 'rgba(30,25,0,0.4)', borderRadius: '16px', textAlign: 'center', boxShadow: '0 0 50px rgba(255,215,0,0.3)' }}>
                      <div style={{ fontSize: '4rem', marginBottom: '16px', filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))' }}>👑</div>
                      <div className="text-muted" style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '8px' }}>ŞAMPİYON</div>
                      <div className="font-bold" style={{ fontSize: '1.8rem', color: '#ffd700', textShadow: '0 0 15px rgba(255,215,0,0.5)' }}>MustafaKucuk</div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =========================================
            SAĞ KOLON (Hall of Fame / Son Şampiyonlar)
            ========================================= */}
        <div className="client-glass" style={{ borderRadius: '24px', padding: '32px 24px', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '32px', height: 'calc(100vh - 140px)', overflowY: 'auto' }}>
          
          <h3 className="font-bold" style={{ fontSize: '1.2rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.3)' }}>
            <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.5))' }}>🏆</span> 
            SON ŞAMPİYONLAR
          </h3>

          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '4px' }}>
            <button 
              onClick={() => setHofTab('1v1')}
              style={{ flex: 1, padding: '8px', background: hofTab === '1v1' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderRadius: '6px', color: hofTab === '1v1' ? '#fff' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              1v1 PRO
            </button>
            <button 
              onClick={() => setHofTab('Team')}
              style={{ flex: 1, padding: '8px', background: hofTab === 'Team' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderRadius: '6px', color: hofTab === 'Team' ? '#fff' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              NIGHT SERIES
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence mode="popLayout">
              {hallOfFame[hofTab].map((champ, idx) => (
                <motion.div 
                  key={champ.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="interactive"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    padding: '16px', 
                    background: idx === 0 ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.02)', 
                    borderRadius: '12px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = idx === 0 ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = idx === 0 ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.02)'}
                >
                  <div style={{ 
                    width: '48px', height: '48px', 
                    borderRadius: '50%', 
                    background: idx === 0 ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'linear-gradient(135deg, #444, #222)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '1.2rem', fontWeight: 'bold', color: '#fff',
                    boxShadow: idx === 0 ? '0 0 15px rgba(255,215,0,0.5)' : 'none'
                  }}>
                    {champ.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-bold" style={{ fontSize: '1.1rem', color: idx === 0 ? '#ffd700' : '#fff', textShadow: idx === 0 ? '0 0 10px rgba(255,215,0,0.5)' : 'none' }}>
                      {champ.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                      {champ.season} <span style={{ opacity: 0.5 }}>• {champ.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* ÖDEME & KAYIT MODALI (WALLET UI) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="client-glass interactive"
              style={{ width: '90%', maxWidth: '500px', background: 'rgba(10,15,20,0.8)', borderRadius: '24px', padding: '40px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 0 50px rgba(64, 224, 208, 0.1)' }}
            >
              
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h3 className="font-bold" style={{ fontSize: '2rem', margin: 0 }}>CÜZDAN <span style={{ color: 'var(--brand-main)' }}>&</span> ÖDEME</h3>
                <p className="text-muted" style={{ marginTop: '8px' }}>Kayıt ücretini ödeyin ve lobideki yerinizi alın.</p>
              </div>

              {isSuccess ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
                  <h3 className="font-bold" style={{ fontSize: '1.5rem', color: '#5de0a0' }}>Ödeme Bildirimi Alındı!</h3>
                  <p className="text-muted">Admin onayı sonrası turnuva ağacına ekleneceksiniz.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Mock Bank Card */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%)' }} />
                    <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>ALICI İBAN (TETA E-SPORTS)</div>
                    <div className="font-bold" style={{ fontSize: '1.2rem', letterSpacing: '2px', color: '#fff' }}>TR99 0000 0000 0000 0000 0000 00</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                      <div className="text-muted" style={{ fontSize: '0.9rem' }}>Açıklama: <span className="font-bold" style={{ color: '#fff' }}>usr_1 Kayıt</span></div>
                      <div className="font-bold" style={{ color: 'var(--brand-main)', cursor: 'pointer' }}>Kopyala</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Gönderici Ad Soyad</label>
                    <input type="text" className="flat-input" placeholder="Banka hesabındaki isminiz" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', padding: '16px', borderRadius: '12px', color: '#fff' }} />
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
                    className="flat-button shimmer-effect"
                    style={{ width: '100%', padding: '16px', fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '16px', boxShadow: '0 10px 20px rgba(64, 224, 208, 0.3)' }}
                  >
                    ÖDEMEYİ BİLDİR
                  </motion.button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
