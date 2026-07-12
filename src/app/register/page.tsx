'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const showToast = (message: string, error = false) => {
    setToast({ message, error })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      
      if (error) {
        console.error('Supabase Register Error:', error.message)
        showToast(error.message || 'Kayıt başarısız oldu.', true)
        return
      }

      if (data?.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
           console.error('Supabase Profile Insert Error:', profileError.message)
        }
      }

      showToast('Kayıt başarılı! Profilinize yönlendiriliyorsunuz...')
      setTimeout(() => router.push('/profile'), 1500)
    } catch (err: any) {
      console.error('Unexpected Register Error:', err)
      showToast(err?.message || 'Beklenmeyen bir hata oluştu.', true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeOut', duration: 0.5 }}
        style={{ width: '100%', maxWidth: '480px', padding: '50px 40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <span className="heading-orbitron text-accent-gold" style={{ fontSize: '1.2rem' }}>TETA</span>
          </div>
          <h1 className="heading-orbitron" style={{ fontSize: '2rem', marginBottom: '8px' }}>YENİ KİMLİK OLUŞTUR</h1>
          <p className="text-muted">Ağa katılmak için kayıt olun.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>KULLANICI ADI</label>
            <input
              type="text"
              className="premium-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Sistem Adınız"
            />
          </div>
          <div>
            <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>E-POSTA ADRESİ</label>
            <input
              type="email"
              className="premium-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="ornek@teta.gg"
            />
          </div>
          <div>
            <label className="heading-orbitron text-accent-gold" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px' }}>ŞİFRE (MİN 6 KARAKTER)</label>
            <input
              type="password"
              className="premium-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          <button className="premium-button accent-red" type="submit" disabled={loading} style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
            {loading ? 'SİSTEME KAYIT OLUYOR...' : 'KAYIT OL'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <span className="text-muted" style={{ fontSize: '0.9rem' }}>Zaten hesabınız var mı? </span>
          <Link href="/login" className="heading-orbitron" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }}>
            OTURUM AÇ
          </Link>
        </div>
      </motion.div>

      {/* Siber Toast Message */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: 'rgba(20,20,20,0.95)', border: `1px solid ${toast.error ? 'var(--neon-red)' : 'var(--glass-border)'}`, padding: '16px 24px', color: '#fff', borderRadius: '6px', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
