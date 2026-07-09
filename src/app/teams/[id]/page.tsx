'use client'

import { useState } from 'react'
import { superLeagueStandings, firstLeagueStandings } from '@/lib/data'

const allTeams = [
  ...superLeagueStandings.map(t => ({ ...t, league: 'Süper Lig' })),
  ...firstLeagueStandings.map(t => ({ ...t, league: '1. Lig' })),
]

const trophies = [
  { icon: 'trophy', name: 'Sezon 4 Şampiyonu', date: 'Mayıs 2026', earned: true },
  { icon: 'medal', name: 'Elit Kupa', date: 'Nisan 2026', earned: true },
  { icon: 'crown', name: 'Şampiyonlar Ligi', date: 'Kilitli', earned: false },
  { icon: 'award', name: 'Yenilgisiz Sezon', date: 'Kilitli', earned: false },
]

const TABS = ['Profil', 'Kadro', 'İstatistikler', 'Kupa Dolabı']

export default function TeamProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('Profil')

  const team = allTeams.find(t => t.tag.toLowerCase() === params.id) ?? allTeams[0]

  return (
    <>
      <style>{`
        .tp-layout { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 24px; align-items: start; }
        .tp-card { position: relative; background: linear-gradient(180deg, #181512 0%, #0c0a09 100%); border-radius: 16px; padding: 32px 24px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 20px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; overflow: hidden; }
        .tp-glow { position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(184,148,30,0.15) 0%, transparent 70%); pointer-events: none; }
        .tp-logo-wrap { width: 110px; height: 110px; border-radius: 50%; background: #111; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(184,148,30,0.3); box-shadow: 0 0 30px rgba(184,148,30,0.2), inset 0 0 20px rgba(184,148,30,0.1); margin-bottom: 20px; z-index: 1; }
        .tp-logo-text { font-family: 'Outfit', sans-serif; font-size: 1.8rem; font-weight: 900; color: var(--gold); }
        .tp-title { font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--text); margin: 0 0 4px; text-align: center; }
        .tp-tag { color: var(--muted); font-size: 0.85rem; letter-spacing: 0.1em; margin-bottom: 28px; }
        .tp-stats-list { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .tp-stat-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.03); }
        .tp-stat-label { color: var(--muted); font-size: 0.82rem; }
        .tp-stat-value { color: var(--text); font-weight: 600; font-size: 0.9rem; font-family: 'Outfit', sans-serif; }
        .tp-content { background: rgba(14,10,9,0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; min-height: 480px; backdrop-filter: blur(10px); }
        .tp-tabs { display: flex; gap: 28px; padding: 0 28px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .tp-tab-btn { background: none; border: none; color: var(--muted); font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.9rem; padding: 22px 0; cursor: pointer; position: relative; transition: color 0.3s; }
        .tp-tab-btn:hover { color: var(--text); }
        .tp-tab-btn.active { color: var(--gold); }
        .tp-tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--gold); box-shadow: 0 -2px 10px rgba(184,148,30,0.5); }
        .tp-tab-content { padding: 28px; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .tp-trophy-room { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 20px; }
        .tp-trophy { display: flex; flex-direction: column; align-items: center; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.03); border-radius: 12px; padding: 22px 14px; text-align: center; transition: transform 0.3s, box-shadow 0.3s; }
        .tp-trophy.earned { border-color: rgba(184,148,30,0.2); box-shadow: inset 0 0 20px rgba(184,148,30,0.05); }
        .tp-trophy.earned:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.4), inset 0 0 30px rgba(184,148,30,0.1); }
        .tp-trophy.locked { opacity: 0.22; filter: grayscale(100%); }
        .tp-trophy-icon { color: var(--gold); margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(184,148,30,0.4)); }
        .tp-trophy-name { color: var(--text); font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px; }
        .tp-trophy-date { color: var(--muted); font-size: 0.7rem; }
        @media (max-width: 900px) { .tp-layout { grid-template-columns: 1fr; } }
      `}</style>

      <div className="tp-layout">
        {/* SOL KİMLİK */}
        <aside className="tp-card">
          <div className="tp-glow" />
          <div className="tp-logo-wrap">
            <span className="tp-logo-text" style={{ color: team.accent }}>{team.tag.slice(0, 3)}</span>
          </div>
          <h1 className="tp-title">{team.name}</h1>
          <div className="tp-tag">{team.league}</div>
          <div className="tp-stats-list">
            {[
              ['Bölge', 'Türkiye'],
              ['Platform', 'Yeni Nesil (Cross)'],
              ['Sıralama', `#${team.position}`],
              ['Maç', String(team.played)],
              ['Galibiyet', `%${Math.round(team.won / team.played * 100)}`],
              ['Puan', String(team.points)],
            ].map(([label, value]) => (
              <div key={label} className="tp-stat-item">
                <span className="tp-stat-label">{label}</span>
                <span className="tp-stat-value" style={label === 'Sıralama' ? { color: 'var(--gold)' } : label === 'Galibiyet' ? { color: '#5de0a0' } : {}}>{value}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* SAĞ İÇERİK */}
        <main className="tp-content">
          <nav className="tp-tabs">
            {TABS.map(tab => (
              <button key={tab} className={`tp-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </nav>

          <div className="tp-tab-content" key={activeTab}>
            {activeTab === 'Profil' && (
              <>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', color: '#fff', margin: '0 0 14px' }}>Kulüp Hakkında</h2>
                <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
                  {team.name}, rekabetçi e-spor sahnesinde disiplini ve taktiksel zekasıyla bilinen elit bir Pro Clubs takımıdır. Bu sezon {team.league} kadrosunda {team.played} maçta {team.won} galibiyet elde etti.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[['Atılan', String(team.goalsFor)], ['Yenilen', String(team.goalsAgainst)], ['AV', (team.goalDifference > 0 ? '+' : '') + team.goalDifference]].map(([label, val]) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '16px 12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)' }}>{val}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'Kadro' && <p style={{ color: 'var(--muted)' }}>Kadro verileri çok yakında entegre edilecek.</p>}
            {activeTab === 'İstatistikler' && <p style={{ color: 'var(--muted)' }}>İstatistik verileri çok yakında eklenecek.</p>}
            {activeTab === 'Kupa Dolabı' && (
              <div className="tp-trophy-room">
                {trophies.map(trophy => (
                  <div key={trophy.name} className={`tp-trophy ${trophy.earned ? 'earned' : 'locked'}`}>
                    <svg className="tp-trophy-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {trophy.icon === 'trophy' && <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>}
                      {trophy.icon === 'medal' && <><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/></>}
                      {trophy.icon === 'crown' && <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21 6l-1.5 9.5A2 2 0 0 1 17.53 17H6.47a2 2 0 0 1-1.97-1.5L3 6l4.094 3.164a1 1 0 0 0 1.516-.294z"/>}
                      {trophy.icon === 'award' && <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>}
                    </svg>
                    <span className="tp-trophy-name">{trophy.name}</span>
                    <span className="tp-trophy-date">{trophy.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
