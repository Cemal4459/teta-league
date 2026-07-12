'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// Mock Teams Data
const teams = [
  { id: 'siber-sk', name: 'Siber SK', league: 'Süper Lig', value: 12200000, logo: '⚡' },
  { id: 'anadolu-fk', name: 'Anadolu FK', league: 'Süper Lig', value: 9800000, logo: '🦅' },
  { id: 'bozkuslar', name: 'Bozkuşlar', league: '1. Lig', value: 5500000, logo: '🐺' },
  { id: 'neon-fc', name: 'Neon FC', league: 'Süper Lig', value: 8700000, logo: '🔮' },
  { id: 'kartal-es', name: 'Kartal ES', league: '1. Lig', value: 4200000, logo: '⚔️' },
  { id: 'kuzey-yildizi', name: 'Kuzey Yıldızı', league: 'Süper Lig', value: 7600000, logo: '⭐' },
  { id: 'demir-guc', name: 'Demir Güç', league: '1. Lig', value: 3100000, logo: '🛡️' },
  { id: 'firtina-sk', name: 'Fırtına SK', league: 'Süper Lig', value: 8900000, logo: '🌪️' }
]

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}

export default function TeamsGalleryPage() {
  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* RESPONSIVE GRID CSS */}
      <style>{`
        .teams-grid {
          display: grid;
          gap: 24px;
        }
        /* Masaüstü: 4 kolon */
        @media (min-width: 1024px) {
          .teams-grid { grid-template-columns: repeat(4, 1fr); }
        }
        /* Tablet: 2 veya 3 kolon */
        @media (min-width: 640px) and (max-width: 1023px) {
          .teams-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        }
        /* Mobil: 1 veya 2 kolon */
        @media (max-width: 639px) {
          .teams-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
        <h1 className="font-bold" style={{ fontSize: '3.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0, letterSpacing: '2px' }}>
          TAKIMLAR
        </h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '8px', letterSpacing: '1px' }}>
          Teta League evreninin devasa kulüplerini keşfet.
        </p>
      </div>

      {/* CSS GRID GALERİSİ */}
      <div className="teams-grid">
        
        {teams.map((team, i) => (
          <Link href={`/teams/${team.id}`} key={team.id} style={{ textDecoration: 'none' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="game-panel interactive shimmer-effect"
              style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'linear-gradient(180deg, rgba(30,25,20,0.9) 0%, rgba(10,5,5,1) 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', cursor: 'pointer', position: 'relative', overflow: 'hidden', height: '100%' }}
            >
              
              {/* Arka Plan Glow Efekti */}
              <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(217, 119, 95, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

              {/* Takım Logosu */}
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,215,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: 'inset 0 0 15px rgba(255,215,0,0.1), 0 0 20px rgba(0,0,0,0.8)', zIndex: 1, filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.3))' }}>
                {team.logo}
              </div>

              {/* Takım Bilgileri */}
              <div style={{ textAlign: 'center', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 className="font-bold" style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 16px 0', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {team.name}
                </h2>
                
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>LİG</div>
                    <div className="font-bold" style={{ fontSize: '0.85rem', color: team.league === 'Süper Lig' ? 'var(--brand-main)' : '#87ceeb' }}>
                      {team.league}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                    <div className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>DEĞER</div>
                    <div className="font-bold" style={{ fontSize: '1rem', color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.3)' }}>
                      {formatCurrency(team.value)}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </Link>
        ))}

      </div>

    </div>
  )
}
