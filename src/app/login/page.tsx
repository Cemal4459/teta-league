'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot_password'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [initializing, setInitializing] = useState(true)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setInitializing(false)
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

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
          setTimeout(() => router.push('/'), 1000)
        }
      } else if (activeTab === 'register') {
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
        setTimeout(() => router.push('/'), 1500)
      } else if (activeTab === 'forgot_password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) {
          showToast(error.message || 'Sıfırlama maili gönderilemedi.', true)
        } else {
          showToast('Şifre sıfırlama bağlantısı ağ adresinize gönderildi!')
          setTimeout(() => setActiveTab('login'), 2000)
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Beklenmeyen bir ağ hatası oluştu.', true)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      showToast(error.message, true)
    } else {
      showToast('Oturum kapatıldı. Ağdan ayrıldınız.')
      router.refresh()
    }
    setLoading(false)
  }

  if (initializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(10,20,30,0.6) 0%, rgba(5,10,15,1) 100%)' }}>
        <div style={{ color: 'var(--brand-main)', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 0 10px rgba(64,224,208,0.5)' }}>SİSTEM BAŞLATILIYOR...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'radial-gradient(circle at center, rgba(10,20,30,0.6) 0%, rgba(5,10,15,1) 100%)' }}>
      
      {/* CSS for Inputs and Animations (AAA Client Aesthetic) */}
      <style>{`
        .auth-input {
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
        .auth-input:focus {
          outline: none;
          background: rgba(64,224,208,0.05);
          border-bottom: 2px solid var(--brand-main);
          box-shadow: inset 0 -20px 20px -20px rgba(64,224,208,0.4);
        }
        .auth-label {
          display: block;
          font-weight: bold;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          letter-spacing: 3px;
          margin-bottom: 12px;
        }
        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          padding: 24px 20px;
          font-weight: bold;
          font-size: 1.1rem;
          letter-spacing: 2px;
          cursor: pointer;
          position: relative;
          opacity: 0.5;
          transition: all 0.3s;
        }
        .auth-tab.active {
          opacity: 1;
          color: var(--brand-main);
          text-shadow: 0 0 15px rgba(64,224,208,0.6);
        }
        .forgot-link {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
          margin-top: 12px;
        }
        .forgot-link:hover {
          color: var(--brand-main);
          text-shadow: 0 0 10px rgba(64,224,208,0.8);
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="client-glass interactive"
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          background: 'rgba(5,10,15,0.3)', 
          backdropFilter: 'blur(30px)', 
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '32px', 
          border: '1px solid rgba(255,255,255,0.05)', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.02)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-150px', left: '-150px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '-150px', right: '-150px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(135, 206, 235, 0.1) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)' }} />

        {user ? (
          /* LOGGED IN VIEW (SIGN OUT) */
          <div style={{ padding: '60px 40px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(93,224,160,0.1)', border: '1px solid #5de0a0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', boxShadow: '0 0 30px rgba(93,224,160,0.2)' }}>
              <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 10px rgba(93,224,160,0.8))' }}>✓</span>
            </div>
            <h2 className="font-bold" style={{ fontSize: '2rem', color: '#fff', marginBottom: '8px' }}>AĞA BAĞLI</h2>
            <p className="text-muted" style={{ marginBottom: '40px' }}>
              Şu anda sisteme giriş yapmış durumdasınız.
              <br />
              <span style={{ color: 'var(--brand-main)', fontWeight: 'bold' }}>{user.email}</span>
            </p>

            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '20px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--accent-danger)', 
                borderRadius: '16px', 
                color: 'var(--accent-danger)', 
                fontWeight: '900', 
                fontSize: '1.2rem', 
                letterSpacing: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s',
              }}
            >
              {loading ? 'AYRILIYOR...' : 'AĞDAN ÇIK (SIGN OUT)'}
            </motion.button>
          </div>
        ) : (
          /* LOGIN / REGISTER / FORGOT PASSWORD VIEW */
          <>
            {/* TABS (Giriş ve Kayıt) */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
              <button className={`auth-tab ${activeTab === 'login' || activeTab === 'forgot_password' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
                AĞA GİRİŞ
                {(activeTab === 'login' || activeTab === 'forgot_password') && <motion.div layoutId="auth-tab-indicator" style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '3px', background: 'var(--brand-main)', borderRadius: '3px', boxShadow: '0 0 15px rgba(64,224,208,0.8), 0 -5px 15px rgba(64,224,208,0.3)' }} />}
              </button>
              <button className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>
                YENİ KİMLİK
                {activeTab === 'register' && <motion.div layoutId="auth-tab-indicator" style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '3px', background: 'var(--brand-main)', borderRadius: '3px', boxShadow: '0 0 15px rgba(64,224,208,0.8), 0 -5px 15px rgba(64,224,208,0.3)' }} />}
              </button>
            </div>

            {/* FORM CONTENT */}
            <div style={{ padding: '48px 40px', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(64,224,208,0.05)', border: '1px solid rgba(64,224,208,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', boxShadow: 'inset 0 0 30px rgba(64,224,208,0.1), 0 0 20px rgba(64,224,208,0.1)' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--brand-main)', textShadow: '0 0 15px rgba(64,224,208,0.6)' }}>T</span>
                </div>
                <p className="text-muted" style={{ fontSize: '1.1rem', letterSpacing: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {activeTab === 'forgot_password' ? 'Güvenlik protokolü sıfırlanıyor.' : activeTab === 'login' ? 'Teta League ağına bağlanılıyor.' : 'Yeni bir efsane doğuyor.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <AnimatePresence mode="popLayout">
                  {activeTab === 'register' && (
                    <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }}>
                      <label className="auth-label">SİSTEM ADI (KULLANICI ADI)</label>
                      <input
                        type="text"
                        className="auth-input"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required={activeTab === 'register'}
                        placeholder="Efsanevi İsminiz"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="auth-label">AĞ ADRESİ (E-POSTA)</label>
                  <input
                    type="email"
                    className="auth-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="oyuncu@teta.gg"
                  />
                </div>
                
                {activeTab !== 'forgot_password' && (
                  <div>
                    <label className="auth-label">{activeTab === 'login' ? 'GÜVENLİK ANAHTARI (ŞİFRE)' : 'GÜVENLİK ANAHTARI (MİN 6 KARAKTER)'}</label>
                    <input
                      type="password"
                      className="auth-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required={activeTab !== 'forgot_password'}
                      minLength={activeTab === 'register' ? 6 : undefined}
                      placeholder="••••••••"
                    />
                    {activeTab === 'login' && (
                      <div style={{ textAlign: 'right' }}>
                        <span className="forgot-link" onClick={() => setActiveTab('forgot_password')}>
                          Şifremi Unuttum?
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(64, 224, 208, 0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading} 
                  style={{ 
                    width: '100%', 
                    marginTop: '24px', 
                    padding: '20px', 
                    background: 'rgba(64, 224, 208, 0.1)', 
                    border: '1px solid var(--brand-main)', 
                    borderRadius: '16px', 
                    color: '#fff', 
                    fontWeight: '900', 
                    fontSize: '1.2rem', 
                    letterSpacing: '4px',
                    boxShadow: '0 0 25px rgba(64, 224, 208, 0.3)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s',
                    textShadow: '0 0 10px rgba(255,255,255,0.5)'
                  }}
                >
                  {loading 
                    ? 'BAĞLANILIYOR...' 
                    : activeTab === 'forgot_password' ? 'SIFIRLAMA BAĞLANTISI GÖNDER' : activeTab === 'login' ? 'AĞA BAĞLAN' : 'KAYDI TAMAMLA'
                  }
                </motion.button>
                
                {activeTab === 'forgot_password' && (
                  <div style={{ textAlign: 'center', marginTop: '-16px' }}>
                    <span className="forgot-link" onClick={() => setActiveTab('login')}>
                      ← Geri Dön
                    </span>
                  </div>
                )}
              </form>
            </div>
          </>
        )}
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
