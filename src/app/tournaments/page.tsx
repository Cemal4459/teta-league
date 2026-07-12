'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<'1v1' | 'Team'>('1v1')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePayment = () => {
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setIsModalOpen(false)
    }, 2000)
  }

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px', paddingLeft: '40px', paddingRight: '40px' }}>
      
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
        
        /* Column Specific Heights to space them correctly */
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

        /* The connection lines logic */
        /* Quarter Finals connects to Semi Finals */
        .match-card.qf:nth-child(odd)::after {
          content: '';
          position: absolute;
          right: -30px;
          top: 50%;
          width: 30px;
          height: calc(100px + 50%);
          border-top: 2px solid var(--brand-main);
          border-right: 2px solid var(--brand-main);
          border-top-right-radius: 8px;
          z-index: 1;
        }
        .match-card.qf:nth-child(even)::after {
          content: '';
          position: absolute;
          right: -30px;
          bottom: 50%;
          width: 30px;
          height: calc(100px + 50%);
          border-bottom: 2px solid var(--brand-main);
          border-right: 2px solid var(--brand-main);
          border-bottom-right-radius: 8px;
          z-index: 1;
        }

        /* Semi Finals connects to Final */
        .match-card.sf:nth-child(1)::after {
          content: '';
          position: absolute;
          right: -30px;
          top: 50%;
          width: 30px;
          height: calc(200px + 50%);
          border-top: 2px solid var(--brand-main);
          border-right: 2px solid var(--brand-main);
          border-top-right-radius: 8px;
          z-index: 1;
        }
        .match-card.sf:nth-child(2)::after {
          content: '';
          position: absolute;
          right: -30px;
          bottom: 50%;
          width: 30px;
          height: calc(200px + 50%);
          border-bottom: 2px solid var(--brand-main);
          border-right: 2px solid var(--brand-main);
          border-bottom-right-radius: 8px;
          z-index: 1;
        }

        /* Final connects to Champion */
        .match-card.f::after {
          content: '';
          position: absolute;
          right: -30px;
          top: 50%;
          width: 30px;
          border-top: 2px solid #ffd700;
          z-index: 1;
        }

        .player-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 4px;
        }
        .player-row:last-child { margin-bottom: 0; }
        .player-row.winner { background: rgba(217, 119, 95, 0.15); border-left: 3px solid var(--brand-main); }
      `}</style>

      {/* HEADER & TABS */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 className="font-bold" style={{ fontSize: '3rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0 }}>LOBİ</h1>
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

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          
          {/* LOBİ KARTI (HERO BANNER) */}
          <div className="game-panel interactive shimmer-effect" style={{ background: activeTab === '1v1' ? 'linear-gradient(180deg, rgba(217, 119, 95, 0.2) 0%, rgba(20,20,20,0.9) 100%)' : 'linear-gradient(180deg, rgba(135, 206, 235, 0.2) 0%, rgba(20,20,20,0.9) 100%)', border: `1px solid ${activeTab === '1v1' ? 'var(--brand-main)' : '#87ceeb'}`, borderRadius: '24px', padding: '60px', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', justifyContent: 'space-between', boxShadow: `0 20px 40px rgba(0,0,0,0.6), inset 0 0 50px ${activeTab === '1v1' ? 'rgba(217, 119, 95, 0.1)' : 'rgba(135, 206, 235, 0.1)'}` }}>
            
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>KAYITLAR AÇIK</div>
              <h2 className="font-bold" style={{ fontSize: '3rem', marginBottom: '16px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                {activeTab === '1v1' ? 'TETA 1v1 PRO ARENA' : 'NIGHT SERIES BATTLE'}
              </h2>
              <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '32px' }}>
                {activeTab === '1v1' ? 'Sadece bireysel yeteneğin konuştuğu, en iyilerin hayatta kaldığı efsanevi 1v1 turnuvası. Kaydını yaptır ve eşleşmeni bekle.' : 'Takımını kur, stratejini belirle ve Teta League e-spor arenasında geceye damganı vur.'}
              </p>
              
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>ÖDÜL HAVUZU</div>
                  <div className="font-bold" style={{ fontSize: '2rem', color: '#ffd700', textShadow: '0 0 15px rgba(255,215,0,0.4)' }}>{activeTab === '1v1' ? '10.000 ₺' : '50.000 ₺'}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>BAŞLANGIÇ</div>
                  <div className="font-bold" style={{ fontSize: '2rem', color: '#fff' }}>24 Ağustos</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>FORMAT</div>
                  <div className="font-bold" style={{ fontSize: '2rem', color: '#fff' }}>Eleme (BO3)</div>
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flat-button shimmer-effect" 
                style={{ padding: '20px 40px', fontSize: '1.3rem', background: activeTab === '1v1' ? 'var(--brand-main)' : '#4169e1', border: 'none', color: '#fff', borderRadius: '12px', boxShadow: `0 10px 20px ${activeTab === '1v1' ? 'rgba(217, 119, 95, 0.4)' : 'rgba(65, 105, 225, 0.4)'}` }}
              >
                {activeTab === '1v1' ? 'ARENAYA KATIL (50 ₺)' : 'TAKIMINI KAYDET (250 ₺)'}
              </motion.button>
            </div>
            
            <div style={{ width: '300px', height: '300px', background: `radial-gradient(circle, ${activeTab === '1v1' ? 'rgba(217, 119, 95, 0.2)' : 'rgba(135, 206, 235, 0.2)'} 0%, transparent 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '10rem', filter: `drop-shadow(0 0 30px ${activeTab === '1v1' ? 'var(--brand-glow)' : 'rgba(135, 206, 235, 0.6)'})` }}>
                {activeTab === '1v1' ? '⚔️' : '🛡️'}
              </div>
            </div>

          </div>

          {/* TURNUVA AĞACI (E-SPORTS BRACKET) */}
          <div style={{ marginTop: '80px' }}>
            <h3 className="font-bold text-muted" style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: activeTab === '1v1' ? 'var(--brand-main)' : '#87ceeb' }}>//</span> CANLI TURNUVA AĞACI
            </h3>

            <div className="bracket-wrapper" style={{ cursor: 'grab' }}>
              
              {/* Çeyrek Final (4 Maç) */}
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

              {/* Yarı Final (2 Maç) */}
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

              {/* Final (1 Maç) */}
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

              {/* Şampiyon (1 Kutu) */}
              <div className="bracket-column col-c">
                <div className="game-panel interactive shimmer-effect" style={{ width: '260px', padding: '30px', background: 'linear-gradient(135deg, rgba(30,25,0,0.9), rgba(10,5,0,1))', border: '2px solid #ffd700', borderRadius: '16px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 40px rgba(255,215,0,0.2)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px', filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))' }}>👑</div>
                  <div className="text-muted" style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '8px' }}>ŞAMPİYON</div>
                  <div className="font-bold" style={{ fontSize: '1.8rem', color: '#ffd700', textShadow: '0 0 15px rgba(255,215,0,0.5)' }}>MustafaKucuk</div>
                </div>
              </div>

            </div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* ÖDEME & KAYIT MODALI (WALLET UI) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="game-panel interactive"
              style={{ width: '90%', maxWidth: '500px', background: 'linear-gradient(180deg, #181512 0%, #0c0a09 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.9)' }}
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
                  <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
                    <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>ALICI İBAN (TETA E-SPORTS)</div>
                    <div className="font-bold" style={{ fontSize: '1.2rem', letterSpacing: '2px', color: '#fff' }}>TR99 0000 0000 0000 0000 0000 00</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                      <div className="text-muted" style={{ fontSize: '0.9rem' }}>Açıklama: <span className="font-bold" style={{ color: '#fff' }}>usr_1 Kayıt</span></div>
                      <div className="font-bold" style={{ color: 'var(--brand-main)' }}>Kopyala</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Gönderici Ad Soyad</label>
                    <input type="text" className="flat-input" placeholder="Banka hesabındaki isminiz" style={{ width: '100%' }} />
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
                    className="flat-button shimmer-effect"
                    style={{ width: '100%', padding: '16px', fontSize: '1.2rem', background: 'var(--brand-main)', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '16px' }}
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
