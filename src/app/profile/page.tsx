'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
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
    else { showToast('Profil başarıyla güncellendi!') }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.5 } }
  }

  return (
    <>
      <motion.div 
        className="bento-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* SOL: VIP PLAYER ID CARD */}
        <motion.aside 
          className="glass-panel" 
          variants={itemVariants}
          style={{ gridColumn: 'span 4', gridRow: 'span 6', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span className="text-muted heading-orbitron" style={{ fontSize: '0.8rem' }}>ID: {user ? user.id.substring(0, 8).toUpperCase() : 'GUEST'}</span>
            <span className="heading-orbitron text-accent-red" style={{ fontSize: '0.8rem' }}>{profile.platform}</span>
          </div>

          <div style={{ width: '120px', height: '120px', border: '2px solid rgba(212,175,55,0.3)', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 0 20px rgba(212,175,55,0.05)', overflow: 'hidden' }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <span className="heading-orbitron text-accent-red" style={{ fontSize: '2rem' }}>?</span>
              </div>
            )}
          </div>

          <h1 className="heading-orbitron" style={{ fontSize: '1.8rem', color: '#fff', textAlign: 'center', marginBottom: '4px' }}>
            {profile.ea_id || profile.username || 'BİLİNMEYEN'}
          </h1>
          <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '30px' }}>Serbest Oyuncu</div>

          <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>POZİSYON</span>
              <span className="heading-orbitron text-accent-gold">{profile.main_position}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>FORMA NO</span>
              <span className="heading-orbitron" style={{ color: '#fff' }}>{profile.jersey_number || '--'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1px solid rgba(224, 49, 49, 0.2)', borderRadius: '4px', background: 'rgba(224, 49, 49, 0.02)' }}>
              <div className="heading-orbitron" style={{ fontSize: '1.2rem' }}>0</div>
              <div className="text-accent-red" style={{ fontSize: '0.7rem' }}>MAÇ</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', background: 'rgba(212, 175, 55, 0.02)' }}>
              <div className="heading-orbitron" style={{ fontSize: '1.2rem' }}>0.0</div>
              <div className="text-accent-gold" style={{ fontSize: '0.7rem' }}>REYTİNG</div>
            </div>
          </div>
        </motion.aside>

        {/* SAĞ: SİSTEM TERMİNALİ (FORM) */}
        <motion.section 
          className="glass-panel" 
          variants={itemVariants}
          style={{ gridColumn: 'span 8', gridRow: 'span 6', padding: '40px', position: 'relative' }}
        >
          {/* Lock Screen for Guests */}
          {isLocked && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
              <h1 className="heading-orbitron text-accent-red" style={{ fontSize: '2rem', marginBottom: '16px' }}>ERİŞİM REDDEDİLDİ</h1>
              <p className="text-muted" style={{ marginBottom: '24px' }}>Terminal erişimi için yetkilendirme (Oturum Açma) gerekiyor.</p>
              <Link href="/login" className="premium-button">SİSTEME GİRİŞ YAP</Link>
            </div>
          )}

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '30px' }}>
            <h2 className="heading-orbitron text-accent-gold" style={{ fontSize: '1.5rem' }}>// SİSTEM TERMİNALİ</h2>
            <p className="text-muted" style={{ margin: '8px 0 0 0' }}>Oyuncu verilerinizi buradan güncelleyin.</p>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="heading-orbitron text-accent-gold" style={{ fontSize: '0.8rem' }}>SİBER PROFİL FOTOĞRAFI</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label className="premium-button" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.8rem', display: 'inline-block', flexShrink: 0 }}>
                  {uploading ? 'YÜKLENİYOR...' : 'GÖRSEL SEÇ'}
                  <input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} style={{ display: 'none' }} />
                </label>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Supabase /avatars bucket</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>KULLANICI ADI</label>
                <input className="premium-input" type="text" value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} placeholder="Sistem Adınız" />
              </div>
              <div>
                <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>EA ID (OYUNİÇİ AD)</label>
                <input className="premium-input" type="text" value={profile.ea_id} onChange={e => setProfile(p => ({ ...p, ea_id: e.target.value }))} placeholder="EA Oyuncu Adı" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>FORMA NUMARASI</label>
                <input className="premium-input" type="number" min={1} max={99} value={profile.jersey_number ?? ''} onChange={e => setProfile(p => ({ ...p, jersey_number: parseInt(e.target.value) || null }))} placeholder="10" />
              </div>
              <div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>PLATFORM</label>
                <select className="premium-input" value={profile.platform} onChange={e => setProfile(p => ({ ...p, platform: e.target.value }))}>
                  {PLATFORMS.map(pl => <option key={pl} value={pl} style={{ background: '#000' }}>{pl}</option>)}
                </select>
              </div>
              <div>
                <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>ANA POZİSYON</label>
                <select className="premium-input" value={profile.main_position} onChange={e => setProfile(p => ({ ...p, main_position: e.target.value }))}>
                  {POSITIONS.map(pos => <option key={pos} value={pos} style={{ background: '#000' }}>{pos}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '12px' }}>EKSTRA POZİSYONLAR</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {POSITIONS.map(pos => {
                  const isActive = profile.playable_positions.includes(pos)
                  return (
                    <button 
                      key={pos} type="button" onClick={() => togglePosition(pos)}
                      style={{ 
                        padding: '8px 16px', background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)', 
                        border: `1px solid ${isActive ? 'var(--glass-border)' : 'transparent'}`, 
                        color: isActive ? '#fff' : 'var(--text-muted)', fontFamily: 'var(--font-orbitron)', fontSize: '0.8rem', cursor: 'pointer',
                        transition: 'all 0.3s', borderRadius: '4px'
                      }}
                    >
                      {pos}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>BİYOGRAFİ / VERİ</label>
              <textarea className="premium-input" rows={4} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Sistem kayıtlarına geçecek veriler..." />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button type="submit" className="premium-button accent-red" disabled={saving} style={{ flex: 2 }}>
                {saving ? 'KAYDEDİLİYOR...' : 'VERİLERİ GÜNCELLE'}
              </button>
              <button type="button" onClick={() => setProfile({ username: '', ea_id: '', avatar_url: '', jersey_number: null, platform: 'PS5', main_position: 'CAM', playable_positions: [], bio: '' })} className="premium-button" style={{ flex: 1 }}>
                SIFIRLA
              </button>
            </div>
          </form>
        </motion.section>
      </motion.div>

      {/* Siber Toast Message */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: 'rgba(20,20,20,0.95)', border: `1px solid ${toast.error ? 'var(--neon-red)' : 'var(--glass-border)'}`, padding: '16px 24px', color: '#fff', borderRadius: '6px', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {toast.message}
        </div>
      )}
    </>
  )
}
