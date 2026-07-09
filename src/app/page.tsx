import Link from 'next/link'
import { leagues, news, players, upcomingMatches } from '@/lib/data'

export const metadata = { title: 'Ana Sayfa' }

export default function HomePage() {
  return (
    <section className="home-board">

      {/* ── SOL: Premium League Info Card ─────── */}
      <aside className="league-info-card" aria-label="Lig Bilgileri">
        <div className="lic-crest">
          <img className="lic-badge" src="/images/teta-logo.jpg" alt="Teta Pro Clubs rozeti" />
          <span className="lic-eyebrow">Resmi Lig</span>
          <h2 className="lic-title">Teta League</h2>
          <p className="lic-subtitle">EA FC NEW GEN Pro Clubs</p>
        </div>
        <div className="lic-season">
          <span className="lic-season-label">Aktif Sezon</span>
          <span className="lic-season-value">5</span>
        </div>
        <div className="lic-stats lic-stats-2col">
          <div className="lic-stat">
            <span className="lic-stat-value">32</span>
            <span className="lic-stat-label">Takım</span>
          </div>
          <div className="lic-stat">
            <span className="lic-stat-value">525</span>
            <span className="lic-stat-label">Oyuncu</span>
          </div>
        </div>
        <div className="lic-status">
          <span className="lic-status-dot" aria-hidden="true"></span>
          <span>Sezon <strong>devam ediyor</strong></span>
        </div>
        <div className="lic-footer">
          <Link className="button button-primary" href="/league?division=super">
            Puan Durumu
          </Link>
          <Link className="button button-ghost" href="/teams">
            Takımları Gör
          </Link>
        </div>
      </aside>

      {/* ── ORTA: Haberler / Duyurular ─────────── */}
      <section className="panel home-news" aria-label="Haberler ve Duyurular">
        <div className="panel-title">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
            Haberler &amp; Duyurular
          </span>
        </div>
        <div className="news-list">
          {news.map((item, i) => (
            <article key={i} className="news-item">
              <span className={`news-type news-type--${item.type.toLowerCase()}`}>{item.type}</span>
              <div className="news-body">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-detail">{item.detail}</p>
              </div>
              <time className="news-date">{item.date}</time>
            </article>
          ))}
        </div>
      </section>

      {/* ── ALT BÖLÜM: Son Kayıtlar + Yaklaşan Maçlar ── */}
      <div className="home-bottom">

        {/* Sol alt: Son Kayıtlar */}
        <section className="panel home-list" aria-label="Son Kayıtlar">
          <div className="panel-title">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Son Kayıtlar
            </span>
            <Link href="/players">Tümü</Link>
          </div>
          {players.slice(0, 5).map(player => (
            <Link key={player.userName} className="list-row" href="/players">
              <span className="avatar">{player.userName[0].toUpperCase()}</span>
              <span>
                <b>{player.displayName}</b>
                <small>{player.position} · {player.team ?? 'Serbest'}</small>
              </span>
              <em>{player.platform}</em>
            </Link>
          ))}
        </section>

        {/* Sağ alt: Yaklaşan Maçlar */}
        <section className="panel home-list" aria-label="Yaklaşan Maçlar">
          <div className="panel-title">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Yaklaşan Maçlar
            </span>
            <Link href="/league?division=super&section=fixtures">Fikstür</Link>
          </div>
          {upcomingMatches.map((match, i) => (
            <Link key={i} className="fixture-row" href="/league?division=super&section=fixtures">
              <small>{match.status}</small>
              <span>
                <b>{match.homeTeam}</b>
                <em>vs</em>
                <b>{match.awayTeam}</b>
              </span>
              <strong>{match.time}</strong>
            </Link>
          ))}
        </section>

      </div>

    </section>
  )
}
