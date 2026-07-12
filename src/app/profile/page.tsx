'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const POSITIONS = ['GK', 'CB', 'RB', 'LB', 'CDM', 'CM', 'CAM', 'RM', 'LM', 'RW', 'LW', 'ST', 'CF']
const PLATFORMS = ['PS5', 'Xbox', 'PC']

interface Profile {
  username: string
  ea_id: string
  avatar_url: string
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
    username: '', ea_id: '', avatar_url: '', jersey_number: null, platform: 'PS5',
    main_position: 'CAM', playable_positions: [], bio: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
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
        ea_id: data.ea_id ?? '',
        avatar_url: data.avatar_url ?? '',
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

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Yüklemek için bir görsel seçmelisiniz.')
      }
      if (!user) throw new Error('Oturum bulunamadı.')

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }))
      showToast('Profil resmi başarıyla yüklendi! Kaydetmeyi unutmayın.')
    } catch (error: any) {
      showToast(error.message || 'Resim yüklenirken bir hata oluştu.', true)
    } finally {
      setUploading(false)
    }
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
    else { showToast('Karakter donanımları başarıyla senkronize edildi!') }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' as const, duration: 0.5 } }
  }

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', paddingLeft: '40px', paddingRight: '40px', marginTop: '60px' }}>
      
      {/* CSS ANIMATIONS FOR AAA HUD */}
      <style>{`
        .hud-input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: none;
          border-bottom: 2px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 16px 20px;
          border-radius: 8px 8px 0 0;
          font-size: 1.1rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }
        .hud-input:focus {
          outline: none;
          background: rgba(64,224,208,0.05);
          border-bottom: 2px solid var(--brand-main);
          box-shadow: inset 0 -20px 20px -20px rgba(64,224,208,0.4);
        }
        .hud-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2340E0D0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
        }
        .hud-label {
          display: block;
          font-weight: bold;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          letter-spacing: 3px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .hud-badge-gold {
          background: rgba(255,184,0,0.1);
          border: 1px solid rgba(255,184,0,0.3);
          color: #FFB800;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
          letter-spacing: 1px;
          box-shadow: 0 0 10px rgba(255,184,0,0.2);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hud-badge-gold:hover {
          background: rgba(255,184,0,0.2);
          box-shadow: 0 0 20px rgba(255,184,0,0.5);
          text-shadow: 0 0 10px rgba(255,184,0,0.8);
        }
      `}</style>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}
      >
        {/* SOL: VIP PLAYER ID CARD (HUD EKRANI) */}
        <motion.aside 
          className="client-glass" 
          variants={itemVariants}
          style={{ gridColumn: 'span 4', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '32px', background: 'rgba(5,10,15,0.4)', border: '1px solid rgba(64,224,208,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(64,224,208,0.02)', position: 'relative', overflow: 'hidden' }}
        >
          {/* Süzülen Işıma */}
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)' }} />

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <span className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>ID: {user ? user.id.substring(0, 8).toUpperCase() : 'GUEST'}</span>
            <span style={{ fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold', color: 'var(--brand-main)', textShadow: '0 0 10px var(--brand-main)' }}>{profile.platform}</span>
          </div>

          <div style={{ width: '160px', height: '160px', border: '2px solid rgba(64,224,208,0.4)', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 30px rgba(64,224,208,0.15)', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.2)' }}>?</span>
              </div>
            )}
          </div>

          <h1 className="font-bold" style={{ fontSize: '2rem', color: '#fff', textAlign: 'center', marginBottom: '4px', textShadow: '0 4px 20px rgba(64,224,208,0.5)', position: 'relative', zIndex: 1 }}>
            {profile.ea_id || profile.username || 'BİLİNMEYEN OYUNCU'}
          </h1>
          <div className="text-muted" style={{ fontSize: '1rem', marginBottom: '40px', letterSpacing: '2px', position: 'relative', zIndex: 1 }}>Serbest Oyuncu</div>

          <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>ANA POZİSYON</span>
              <span style={{ color: '#FFB800', fontWeight: '900', fontSize: '1.2rem', textShadow: '0 0 10px rgba(255,184,0,0.5)' }}>{profile.main_position}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>FORMA NO</span>
              <span style={{ color: '#fff', fontWeight: '900', fontSize: '1.2rem' }}>{profile.jersey_number || '--'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', width: '100%', gap: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px', border: '1px solid rgba(64,224,208,0.2)', borderRadius: '12px', background: 'rgba(64,224,208,0.05)', boxShadow: 'inset 0 0 20px rgba(64,224,208,0.05)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>0</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-main)', fontWeight: 'bold', letterSpacing: '1px' }}>MAÇ</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px', border: '1px solid rgba(255,184,0,0.2)', borderRadius: '12px', background: 'rgba(255,184,0,0.05)', boxShadow: 'inset 0 0 20px rgba(255,184,0,0.05)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>0.0</div>
              <div style={{ fontSize: '0.8rem', color: '#FFB800', fontWeight: 'bold', letterSpacing: '1px' }}>REYTİNG</div>
            </div>
          </div>
        </motion.aside>

        {/* SAĞ: SİSTEM TERMİNALİ (FORM) */}
        <motion.section 
          className="client-glass" 
          variants={itemVariants}
          style={{ gridColumn: 'span 8', padding: '50px 60px', borderRadius: '32px', background: 'rgba(5,10,15,0.4)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}
        >
          {/* Sağ üst ışıma */}
          <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255, 184, 0, 0.08) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />

          {/* Lock Screen for Guests */}
          {isLocked && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '32px' }}>
              <h1 className="font-bold" style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--accent-danger)', textShadow: '0 0 20px rgba(239, 68, 68, 0.6)' }}>SİSTEME ERİŞİM REDDEDİLDİ</h1>
              <p className="text-muted" style={{ marginBottom: '32px', fontSize: '1.1rem', letterSpacing: '1px' }}>Ağ kayıtlarını güncellemek için sisteme bağlı olmalısınız.</p>
              <Link href="/login" style={{ padding: '16px 32px', background: 'rgba(64,224,208,0.1)', border: '1px solid var(--brand-main)', color: '#fff', fontWeight: 'bold', letterSpacing: '2px', borderRadius: '12px', boxShadow: '0 0 20px rgba(64,224,208,0.3)', transition: 'all 0.3s' }}>
                AĞA BAĞLAN
              </Link>
            </div>
          )}

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
            <h2 className="font-bold" style={{ fontSize: '2rem', color: '#fff', textShadow: '0 4px 15px rgba(255,255,255,0.3)' }}>KARAKTER HUD ARAYÜZÜ</h2>
            <p className="text-muted" style={{ margin: '8px 0 0 0', fontSize: '1.1rem' }}>Teta League evrenindeki donanımlarınızı buradan konfigüre edin.</p>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label className="hud-label">SİBER PROFİL FOTOĞRAFI</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <label style={{ cursor: 'pointer', padding: '12px 24px', background: 'rgba(64,224,208,0.05)', border: '1px solid rgba(64,224,208,0.3)', color: 'var(--brand-main)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px', borderRadius: '8px', transition: 'all 0.3s', display: 'inline-block' }}>
                  {uploading ? 'YÜKLENİYOR...' : 'YENİ GÖRSEL SEÇ'}
                  <input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} style={{ display: 'none' }} />
                </label>
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>Desteklenen: JPG, PNG, WEBP</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label className="hud-label">KULLANICI ADI</label>
                <input className="hud-input" type="text" value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} placeholder="Sistem Adınız" />
              </div>
              <div>
                <label className="hud-label">EA ID (OYUNİÇİ AD)</label>
                <input className="hud-input" type="text" value={profile.ea_id} onChange={e => setProfile(p => ({ ...p, ea_id: e.target.value }))} placeholder="EA Oyuncu Adı" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label className="hud-label">FORMA NUMARASI</label>
                <input className="hud-input" type="number" min={1} max={99} value={profile.jersey_number ?? ''} onChange={e => setProfile(p => ({ ...p, jersey_number: parseInt(e.target.value) || null }))} placeholder="10" />
              </div>
              <div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label className="hud-label">PLATFORM</label>
                <select className="hud-input hud-select" value={profile.platform} onChange={e => setProfile(p => ({ ...p, platform: e.target.value }))}>
                  {PLATFORMS.map(pl => <option key={pl} value={pl} style={{ background: '#0a1015' }}>{pl}</option>)}
                </select>
              </div>
              <div>
                <label className="hud-label">ANA POZİSYON</label>
                <select className="hud-input hud-select" value={profile.main_position} onChange={e => setProfile(p => ({ ...p, main_position: e.target.value }))}>
                  {POSITIONS.map(pos => <option key={pos} value={pos} style={{ background: '#0a1015' }}>{pos}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="hud-label">EKSTRA POZİSYONLAR</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {POSITIONS.map(pos => {
                  const isActive = profile.playable_positions.includes(pos)
                  return (
                    <button 
                      key={pos} type="button" onClick={() => togglePosition(pos)}
                      style={{ 
                        padding: '10px 20px', 
                        background: isActive ? 'rgba(64,224,208,0.15)' : 'rgba(255,255,255,0.02)', 
                        border: `1px solid ${isActive ? 'rgba(64,224,208,0.5)' : 'rgba(255,255,255,0.1)'}`, 
                        color: isActive ? 'var(--brand-main)' : 'var(--text-muted)', 
                        fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer',
                        transition: 'all 0.3s', borderRadius: '8px',
                        boxShadow: isActive ? '0 0 15px rgba(64,224,208,0.2)' : 'none',
                        textShadow: isActive ? '0 0 10px rgba(64,224,208,0.5)' : 'none'
                      }}
                    >
                      {pos}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className="hud-label" style={{ margin: 0 }}>SİBER BİYOGRAFİ</label>
                {/* TETA+ PREMIUM BADGE */}
                <div className="hud-badge-gold">
                  <span style={{ fontSize: '1rem' }}>👑</span> TETA+ PREMIUM <span style={{ fontWeight: 'normal', opacity: 0.8 }}>Sınırsız Karakter</span>
                </div>
              </div>
              <textarea className="hud-input" rows={4} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Sistem kayıtlarına geçecek yetenekleriniz ve efsaneleriniz..." style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '24px' }}>
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(255, 184, 0, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={saving} 
                style={{ 
                  flex: 3,
                  padding: '20px', 
                  background: 'rgba(255, 184, 0, 0.1)', 
                  border: '1px solid #FFB800', 
                  borderRadius: '16px', 
                  color: '#FFB800', 
                  fontWeight: '900', 
                  fontSize: '1.2rem', 
                  letterSpacing: '4px',
                  boxShadow: '0 0 25px rgba(255, 184, 0, 0.2)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.3s',
                  textShadow: '0 0 10px rgba(255,184,0,0.5)'
                }}
              >
                {saving ? 'SENKRONİZE EDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
              </motion.button>
              
              <button 
                type="button" 
                onClick={() => setProfile({ username: '', ea_id: '', avatar_url: '', jersey_number: null, platform: 'PS5', main_position: 'CAM', playable_positions: [], bio: '' })} 
                style={{ flex: 1, padding: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontWeight: 'bold', borderRadius: '16px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
              >
                SIFIRLA
              </button>
            </div>
          </form>
        </motion.section>
      </motion.div>

      {/* Siber Toast Message */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'rgba(10,15,20,0.95)', backdropFilter: 'blur(10px)', border: `1px solid ${toast.error ? 'var(--accent-danger)' : 'var(--brand-main)'}`, padding: '16px 24px', color: toast.error ? 'var(--accent-danger)' : 'var(--brand-main)', borderRadius: '12px', zIndex: 1000, boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px ${toast.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(64, 224, 208, 0.2)'}`, fontWeight: 'bold' }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
