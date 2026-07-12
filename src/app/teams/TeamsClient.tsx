'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  league: string
  value: number
  logo_url: string | null
  primary_color: string
  abbreviation: string
  stadium_name: string
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || !hex.startsWith('#')) return `rgba(64, 224, 208, ${alpha})`
  const r = parseInt(hex.slice(1, 3), 16) || 64
  const g = parseInt(hex.slice(3, 5), 16) || 224
  const b = parseInt(hex.slice(5, 7), 16) || 208
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function TeamsClient({ teams }: { teams: Team[] }) {
  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* RESPONSIVE GRID & HOVER EFFECTS CSS */}
      <style>{`
        .teams-grid {
          display: grid;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .teams-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .teams-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        }
        @media (max-width: 639px) {
          .teams-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        }

        .team-card {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .team-card:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          transform: translateY(-5px);
        }
        .team-card:hover .bg-glow {
          opacity: 0.8 !important;
          transform: translate(-50%, -50%) scale(1.4) !important;
        }
        .bg-glow {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .team-card:hover .team-value {
          text-shadow: 0 0 25px rgba(255, 215, 0, 1) !important;
          color: #fff !important;
          transform: scale(1.05);
        }
        .team-card .team-value {
          transition: all 0.3s;
        }
        .team-card:hover .team-logo-container {
          filter: drop-shadow(0 0 15px rgba(255,255,255,0.4));
        }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '80px' }}>
        <h1 className="font-bold" style={{ fontSize: '4.5rem', textShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(64,224,208,0.2)', margin: 0, letterSpacing: '4px' }}>
          TAKIMLAR
        </h1>
        <p className="text-muted" style={{ fontSize: '1.3rem', marginTop: '12px', letterSpacing: '1px', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
          Teta League evreninin devasa kulüplerini keşfet.
        </p>
      </div>

      {/* CSS GRID GALERİSİ */}
      <div className="teams-grid">
        {teams.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Henüz ağda takım bulunmuyor.
          </div>
        ) : (
          teams.map((team, i) => {
            const glowColor = hexToRgba(team.primary_color, 0.2)
            const activeGlowColor = hexToRgba(team.primary_color, 0.4)

            return (
              <Link href={`/teams/${team.id}`} key={team.id} style={{ textDecoration: 'none' }}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="client-glass interactive team-card"
                  style={{ 
                    padding: '32px 24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '24px', 
                    background: 'transparent', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    cursor: 'pointer', 
                    position: 'relative', 
                    overflow: 'hidden', 
                    height: '100%' 
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `inset 0 0 30px ${activeGlowColor}`; e.currentTarget.style.borderColor = activeGlowColor; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                >
                  
                  {/* Holografik Arka Plan Glow Efekti (Logo Arkasında) */}
                  <div 
                    className="bg-glow"
                    style={{ 
                      position: 'absolute', 
                      top: '35%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%) scale(1)', 
                      width: '160px', 
                      height: '160px', 
                      background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`, 
                      pointerEvents: 'none',
                      opacity: 0.4
                    }} 
                  />

                  {/* Takım Logosu / Kısaltması (Süzülen) */}
                  <div className="team-logo-container" style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', zIndex: 1, transition: 'all 0.3s', fontWeight: 'bold', color: team.primary_color, textShadow: `0 0 15px ${activeGlowColor}` }}>
                    {team.logo_url ? <img src={team.logo_url} alt={team.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : team.abbreviation.slice(0, 2)}
                  </div>

                  {/* Takım Bilgileri */}
                  <div style={{ textAlign: 'center', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h2 className="font-bold" style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 8px 0', textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
                      {team.name}
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px', letterSpacing: '2px' }}>{team.stadium_name}</div>
                    
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 'bold' }}>LİG</div>
                        <div className="font-bold" style={{ fontSize: '0.9rem', color: team.primary_color, textShadow: `0 0 10px ${glowColor}` }}>
                          {team.league}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                        <div className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 'bold' }}>DEĞER</div>
                        <div className="font-bold team-value" style={{ fontSize: '1.2rem', color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.4)', transformOrigin: 'right center' }}>
                          {formatCurrency(team.value)}
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </Link>
            )
          })
        )}
      </div>

    </div>
  )
}
