'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
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
      if (activeTab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          showToast(error.message || 'Giriş başarısız oldu.', true)
        } else {
          showToast('Sisteme başarıyla giriş yapıldı! Yönlendiriliyorsunuz...')
          setTimeout(() => window.location.href = '/', 1000)
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          showToast(error.message || 'Kayıt başarısız oldu.', true)
          return
        }
        if (data?.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            username,
            updated_at: new Date().toISOString(),
          })
        }
        showToast('Yeni kimlik başarıyla oluşturuldu! Yönlendiriliyorsunuz...')
        setTimeout(() => window.location.href = '/', 1500)
      }
    } catch (err: any) {
      showToast(err?.message || 'Beklenmeyen bir ağ hatası oluştu.', true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'radial-gradient(circle at center, rgba(30,20,15,0.8) 0%, rgba(5,5,5,1) 100%)' }}>
      
      {/* CSS for Inputs and Animations */}
      <style>{`
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid transparent;
          color: #fff;
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
        }
        .auth-input:focus {
          outline: none;
          background: rgba(255,215,0,0.05);
          border-color: rgba(255,215,0,0.5);
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.2);
        }
        .auth-label {
          display: block;
          font-weight: bold;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 2px;
          margin-bottom: 8px;
        }
        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          padding: 20px;
          font-weight: bold;
          font-size: 1.1rem;
          letter-spacing: 2px;
          cursor: pointer;
          position: relative;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .auth-tab.active {
          opacity: 1;
          color: #ffd700;
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="game-panel interactive"
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          background: 'rgba(15,10,10,0.6)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px', 
          border: '1px solid rgba(255,255,255,0.05)', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 50px rgba(217, 119, 95, 0.1)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(217, 119, 95, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
          <button className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
            SİSTEME GİRİŞ
            {activeTab === 'login' && <motion.div layoutId="auth-tab-indicator" style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '3px', background: '#ffd700', borderRadius: '3px', boxShadow: '0 0 10px rgba(255,215,0,0.5)' }} />}
          </button>
          <button className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>
            YENİ KİMLİK
            {activeTab === 'register' && <motion.div layoutId="auth-tab-indicator" style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '3px', background: '#ffd700', borderRadius: '3px', boxShadow: '0 0 10px rgba(255,215,0,0.5)' }} />}
          </button>
        </div>

        {/* FORM CONTENT */}
        <div style={{ padding: '40px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: 'inset 0 0 20px rgba(255,215,0,0.1)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>T</span>
            </div>
            <p className="text-muted" style={{ fontSize: '1rem', letterSpacing: '1px' }}>
              {activeTab === 'login' ? 'Ağ kimliğinizi doğrulayın.' : 'Teta League evrenine katılın.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AnimatePresence mode="popLayout">
              {activeTab === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }}>
                  <label className="auth-label">KULLANICI ADI</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required={activeTab === 'register'}
                    placeholder="Sistem Adınız"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="auth-label">E-POSTA ADRESİ</label>
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="ornek@teta.gg"
              />
            </div>
            
            <div>
              <label className="auth-label">{activeTab === 'login' ? 'ŞİFRE' : 'ŞİFRE (MİN 6 KARAKTER)'}</label>
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={activeTab === 'register' ? 6 : undefined}
                placeholder="••••••••"
              />
            </div>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flat-button shimmer-effect" 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: '100%', 
                marginTop: '16px', 
                padding: '18px', 
                background: 'linear-gradient(90deg, var(--brand-main), var(--brand-dark))', 
                border: 'none', 
                borderRadius: '12px', 
                color: '#fff', 
                fontWeight: '900', 
                fontSize: '1.2rem', 
                letterSpacing: '2px',
                boxShadow: '0 10px 30px rgba(217, 119, 95, 0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading 
                ? 'DOĞRULANIYOR...' 
                : activeTab === 'login' ? 'OTURUM AÇ' : 'KAYIT OL'
              }
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Siber Toast Message */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'rgba(20,20,20,0.95)', border: `1px solid ${toast.error ? 'var(--accent-danger)' : '#ffd700'}`, padding: '16px 24px', color: '#fff', borderRadius: '12px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: 'bold' }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
