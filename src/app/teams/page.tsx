import Link from 'next/link'
import { superLeagueStandings, firstLeagueStandings } from '@/lib/data'

export const metadata = { title: 'Takımlar' }

const allTeams = [
  ...superLeagueStandings.map(t => ({ ...t, league: 'Süper Lig' })),
  ...firstLeagueStandings.map(t => ({ ...t, league: '1. Lig' })),
]

export default function TeamsPage() {
  return (
    <>
      <style>{`
        .t-page-title { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 900; margin: 0; background: linear-gradient(to right, #fff, #b8941e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.03em; }
        .t-page-desc { color: var(--muted); margin: 8px 0 32px; font-size: 1rem; }
        .t-leaderboard { display: flex; flex-direction: column; gap: 10px; }
        .t-row { display: grid; grid-template-columns: 48px 1fr 60px 60px 60px 60px 60px 80px 140px; align-items: center; background: linear-gradient(145deg, rgba(20,14,12,0.6),rgba(8,6,6,0.8)); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 14px 24px; text-decoration: none; transition: all 0.3s cubic-bezier(0.2,0.8,0.2,1); position: relative; overflow: hidden; }
        .t-row:hover { border-color: rgba(184,148,30,0.3); transform: translateX(4px); box-shadow: 0 8px 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(184,148,30,0.05); }
        .t-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--gold); opacity: 0; transition: opacity 0.3s; }
        .t-row:hover::before { opacity: 1; }
        .t-row-header { grid-template-columns: 48px 1fr 60px 60px 60px 60px 60px 80px 140px; background: transparent !important; border: none; padding: 0 24px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px; }
        .t-rank { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 800; color: rgba(255,255,255,0.25); }
        .t-row:hover .t-rank { color: var(--gold); }
        .t-club { display: flex; align-items: center; gap: 14px; }
        .t-club-logo { width: 38px; height: 38px; border-radius: 50%; background: #111; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: 'Outfit', sans-serif; font-size: 0.8rem; flex-shrink: 0; transition: box-shadow 0.3s; }
        .t-row:hover .t-club-logo { box-shadow: 0 0 20px var(--glow-color, transparent); }
        .t-club-name { color: var(--text); font-weight: 700; font-family: 'Outfit', sans-serif; }
        .t-club-meta { display: flex; flex-direction: column; }
        .t-club-tag { color: var(--muted); font-size: 0.75rem; }
        .t-stat { color: var(--text); font-weight: 500; font-size: 0.9rem; }
        .t-pts { color: var(--gold); font-weight: 800; font-size: 1.05rem; }
        .t-form { display: flex; gap: 4px; }
        .t-form-pill { width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; }
        .t-form-pill.w { background: rgba(93,224,160,0.2); color: #5de0a0; border: 1px solid rgba(93,224,160,0.4); }
        .t-form-pill.d { background: rgba(255,255,255,0.08); color: #aaa; border: 1px solid rgba(255,255,255,0.18); }
        .t-form-pill.l { background: rgba(204,10,29,0.2); color: #cc0a1d; border: 1px solid rgba(204,10,29,0.4); }
        .t-section-label { font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin: 32px 0 12px; display: flex; align-items: center; gap: 10px; }
        .t-section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, rgba(184,148,30,0.3), transparent); }
        .t-col-label { color: var(--muted); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
      `}</style>

      <h1 className="t-page-title">Takımlar &amp; Puan Durumu</h1>
      <p className="t-page-desc">Teta League rekabetindeki tüm kulüpler ve güncel sıralamaları.</p>

      {/* Süper Lig */}
      <div className="t-section-label">TETA Süper Lig</div>
      <div className="t-leaderboard">
        <div className="t-row t-row-header">
          <span className="t-col-label">#</span>
          <span className="t-col-label">KULÜP</span>
          <span className="t-col-label">O</span>
          <span className="t-col-label">G</span>
          <span className="t-col-label">B</span>
          <span className="t-col-label">M</span>
          <span className="t-col-label">AV</span>
          <span className="t-col-label">P</span>
          <span className="t-col-label">FORM</span>
        </div>
        {superLeagueStandings.map(team => (
          <Link key={team.tag} href={`/teams/${team.tag.toLowerCase()}`} className="t-row" style={{ ['--glow-color' as string]: team.accent }}>
            <div className="t-rank">{team.position}</div>
            <div className="t-club">
              <div className="t-club-logo" style={{ color: team.accent }}>{team.tag.slice(0, 3)}</div>
              <div className="t-club-meta">
                <span className="t-club-name">{team.name}</span>
                <span className="t-club-tag">{team.tag}</span>
              </div>
            </div>
            <div className="t-stat">{team.played}</div>
            <div className="t-stat" style={{ color: 'rgba(93,224,160,0.8)' }}>{team.won}</div>
            <div className="t-stat" style={{ color: 'rgba(255,255,255,0.4)' }}>{team.drawn}</div>
            <div className="t-stat" style={{ color: 'rgba(204,10,29,0.8)' }}>{team.lost}</div>
            <div className="t-stat">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</div>
            <div className="t-pts">{team.points}</div>
            <div className="t-form">
              {team.form.split(' ').filter(Boolean).map((r, i) => (
                <span key={i} className={`t-form-pill ${r.toLowerCase()}`}>{r}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* 1. Lig */}
      <div className="t-section-label">TETA 1. Lig</div>
      <div className="t-leaderboard">
        <div className="t-row t-row-header">
          <span className="t-col-label">#</span>
          <span className="t-col-label">KULÜP</span>
          <span className="t-col-label">O</span>
          <span className="t-col-label">G</span>
          <span className="t-col-label">B</span>
          <span className="t-col-label">M</span>
          <span className="t-col-label">AV</span>
          <span className="t-col-label">P</span>
          <span className="t-col-label">FORM</span>
        </div>
        {firstLeagueStandings.map(team => (
          <Link key={team.tag} href={`/teams/${team.tag.toLowerCase()}`} className="t-row" style={{ ['--glow-color' as string]: team.accent }}>
            <div className="t-rank">{team.position}</div>
            <div className="t-club">
              <div className="t-club-logo" style={{ color: team.accent }}>{team.tag.slice(0, 3)}</div>
              <div className="t-club-meta">
                <span className="t-club-name">{team.name}</span>
                <span className="t-club-tag">{team.tag}</span>
              </div>
            </div>
            <div className="t-stat">{team.played}</div>
            <div className="t-stat" style={{ color: 'rgba(93,224,160,0.8)' }}>{team.won}</div>
            <div className="t-stat" style={{ color: 'rgba(255,255,255,0.4)' }}>{team.drawn}</div>
            <div className="t-stat" style={{ color: 'rgba(204,10,29,0.8)' }}>{team.lost}</div>
            <div className="t-stat">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</div>
            <div className="t-pts">{team.points}</div>
            <div className="t-form">
              {team.form.split(' ').filter(Boolean).map((r, i) => (
                <span key={i} className={`t-form-pill ${r.toLowerCase()}`}>{r}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
