'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const POSITIONS = ['GK', 'CB', 'RB', 'LB', 'CDM', 'CM', 'CAM', 'RM', 'LM', 'RW', 'LW', 'ST', 'CF']
const PLATFORMS = ['PS5', 'Xbox', 'PC']

interface Profile {
  username: string
  jersey_number: number | null
  platform: string
  main_position: string
  playable_positions: string[]
  bio: string
}

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile>({
    username: '', jersey_number: null, platform: 'PS5',
    main_position: 'CAM', playable_positions: [], bio: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null)
  const [isLocked, setIsLocked] = useState(true)

  const showToast = (message: string, error = false) => {
    setToast({ message, error })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setProfile({
        username: data.username ?? '',
        jersey_number: data.jersey_number ?? null,
        platform: data.platform ?? 'PS5',
        main_position: data.main_position ?? 'CAM',
        playable_positions: data.playable_positions ?? [],
        bio: data.bio ?? '',
      })
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setIsLocked(false)
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser(session.user)
        setIsLocked(false)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setIsLocked(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [fetchProfile, supabase])

  const togglePosition = (pos: string) => {
    setProfile(prev => ({
      ...prev,
      playable_positions: prev.playable_positions.includes(pos)
        ? prev.playable_positions.filter(p => p !== pos)
        : [...prev.playable_positions, pos],
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) { showToast('Kayıt sırasında bir hata oluştu.', true) }
    else { showToast('Profil başarıyla güncellendi!') }
  }

  return (
    <>
      <div className="pid-layout">
        {/* SOL: VIP PLAYER ID CARD */}
        <aside className="pid-card" aria-label="Oyuncu Kimlik Kartı">
          <div className="pid-glow pid-glow--top" aria-hidden="true"></div>
          <div className="pid-glow pid-glow--bottom" aria-hidden="true"></div>
          <span className="pid-corner pid-corner--tl" aria-hidden="true"></span>
          <span className="pid-corner pid-corner--tr" aria-hidden="true"></span>
          <span className="pid-corner pid-corner--bl" aria-hidden="true"></span>
          <span className="pid-corner pid-corner--br" aria-hidden="true"></span>
          <div className="pid-header-strip">
            <span className="pid-country"><span className="pid-flag">TR</span>Türkiye</span>
            <span className="pid-platform-badge">{profile.platform}</span>
          </div>
          <div className="pid-avatar-wrap">
            <div className="pid-avatar-ring">
              <img src="/images/teta-logo.jpg" alt="Profil fotoğrafı" className="pid-avatar" />
            </div>
          </div>
          <div className="pid-identity">
            <h1 className="pid-username">{profile.username || 'Kullanıcı Adı'}</h1>
            <span className="pid-club">Serbest Oyuncu</span>
          </div>
          <div className="pid-primary-pos">
            <span className="pid-pos-label">Pozisyon</span>
            <span className="pid-pos-value">{profile.main_position}</span>
          </div>
          <div className="pid-badges">
            <span className="pid-badge pid-badge--active">{profile.main_position}</span>
            {profile.playable_positions.filter(p => p !== profile.main_position).slice(0, 3).map(p => (
              <span key={p} className="pid-badge">{p}</span>
            ))}
          </div>
          <div className="pid-divider"></div>
          <div className="pid-stats">
            <div className="pid-stat"><span className="pid-stat-val">0</span><span className="pid-stat-key">Reyting</span></div>
            <div className="pid-stat"><span className="pid-stat-val">0</span><span className="pid-stat-key">Maç</span></div>
            <div className="pid-stat"><span className="pid-stat-val">S5</span><span className="pid-stat-key">Sezon</span></div>
          </div>
        </aside>

        {/* SAĞ: FORM PANELİ */}
        <section className="pid-form-panel" style={{ position: 'relative' }}>
          {/* Lock Screen */}
          {isLocked && (
            <div className="pid-lock-screen" style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(14, 10, 9, 0.65)', backdropFilter: 'blur(12px)', borderRadius: 'var(--radius-lg)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--gold)', filter: 'drop-shadow(0 0 12px rgba(184,148,30,0.4))', marginBottom: 16 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Oturum Açın</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: 24, textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>Profil bilgilerinizi düzenlemek için giriş yapmalısınız.</p>
              <a href="/login" className="button button-primary">Giriş Yap</a>
            </div>
          )}

          <header className="pid-form-header">
            <div>
              <p className="pid-form-eyebrow">Hesap Ayarları</p>
              <h2 className="pid-form-title">Profil Bilgileri</h2>
            </div>
            <span className="pid-form-badge">Aktif</span>
          </header>
          <div className="pid-form-separator"></div>

          <form className="pid-form" onSubmit={handleSave}>
            <div className="pid-section-label"><span>01</span> Kimlik</div>
            <div className="pid-row">
              <div className="pid-field">
                <label className="pid-label" htmlFor="f-username">Kullanıcı Adı</label>
                <div className="pid-input-wrap">
                  <input className="pid-input" id="f-username" type="text" value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} autoComplete="username" />
                </div>
              </div>
              <div className="pid-field">
                <label className="pid-label" htmlFor="f-jersey">Forma Numarası</label>
                <div className="pid-input-wrap">
                  <input className="pid-input" id="f-jersey" type="number" min={1} max={99} value={profile.jersey_number ?? ''} onChange={e => setProfile(p => ({ ...p, jersey_number: parseInt(e.target.value) || null }))} />
                </div>
              </div>
            </div>

            <div className="pid-section-label"><span>02</span> Oyun Tercihleri</div>
            <div className="pid-row">
              <div className="pid-field">
                <label className="pid-label" htmlFor="f-platform">Platform</label>
                <div className="pid-input-wrap pid-select-wrap">
                  <select className="pid-input pid-select" id="f-platform" value={profile.platform} onChange={e => setProfile(p => ({ ...p, platform: e.target.value }))}>
                    {PLATFORMS.map(pl => <option key={pl} value={pl}>{pl}</option>)}
                  </select>
                </div>
              </div>
              <div className="pid-field">
                <label className="pid-label" htmlFor="f-position">Ana Pozisyon</label>
                <div className="pid-input-wrap pid-select-wrap">
                  <select className="pid-input pid-select" id="f-position" value={profile.main_position} onChange={e => setProfile(p => ({ ...p, main_position: e.target.value }))}>
                    {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="pid-field pid-field--full">
              <label className="pid-label">Oynayabileceğiniz Pozisyonlar</label>
              <div className="pid-pos-chips" id="pos-chips" role="group">
                {POSITIONS.map(pos => (
                  <button key={pos} type="button" className={`pid-chip ${profile.playable_positions.includes(pos) ? 'pid-chip--on' : ''}`} data-pos={pos} onClick={() => togglePosition(pos)}>{pos}</button>
                ))}
              </div>
            </div>

            <div className="pid-section-label"><span>03</span> Hakkında</div>
            <div className="pid-field pid-field--full">
              <label className="pid-label" htmlFor="f-bio">Profil Açıklaması</label>
              <div className="pid-input-wrap pid-textarea-wrap">
                <textarea className="pid-input pid-textarea" id="f-bio" rows={4} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Kendini kısaca tanıt..." />
              </div>
            </div>

            <div className="pid-actions">
              <button className="pid-btn pid-btn--ghost" type="button" onClick={() => setProfile({ username: '', jersey_number: null, platform: 'PS5', main_position: 'CAM', playable_positions: [], bio: '' })}>
                Sıfırla
              </button>
              <button className="pid-btn pid-btn--primary" type="submit" disabled={saving}>
                <span className="pid-btn-shine" aria-hidden="true"></span>
                {saving ? (
                  <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                ) : null}
                <span>Profili Kaydet</span>
              </button>
            </div>
          </form>
        </section>
      </div>

      {toast && (
        <div className="pid-toast show" style={{ borderColor: toast.error ? 'rgba(204,10,29,0.3)' : undefined }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pid-toast-icon" style={{ color: toast.error ? '#cc0a1d' : '#5de0a0' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span className="pid-toast-text">{toast.message}</span>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
