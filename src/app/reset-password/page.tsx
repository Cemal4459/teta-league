'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    
    if (password !== confirmPassword) {
      showToast('Şifreler eşleşmiyor, lütfen kontrol edin.', true)
      return
    }

    if (password.length < 6) {
      showToast('Şifre en az 6 karakter olmalıdır.', true)
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        showToast(error.message || 'Şifre güncellenirken hata oluştu.', true)
      } else {
        showToast('Güvenlik anahtarınız başarıyla güncellendi! Yönlendiriliyorsunuz...')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (err: any) {
      showToast(err?.message || 'Beklenmeyen bir ağ hatası oluştu.', true)
    } finally {
      setLoading(false)
    }
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
          position: 'relative',
          padding: '48px 40px'
        }}
      >
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-150px', left: '-150px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '-150px', right: '-150px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(135, 206, 235, 0.1) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)' }} />

        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(64,224,208,0.05)', border: '1px solid rgba(64,224,208,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', boxShadow: 'inset 0 0 30px rgba(64,224,208,0.1), 0 0 20px rgba(64,224,208,0.1)' }}>
            <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--brand-main)', textShadow: '0 0 15px rgba(64,224,208,0.6)' }}>T</span>
          </div>
          <h2 className="font-bold" style={{ fontSize: '2rem', color: '#fff', marginBottom: '8px' }}>YENİ ANAHTAR</h2>
          <p className="text-muted" style={{ fontSize: '1rem', letterSpacing: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Ağ erişimi için yeni güvenlik anahtarınızı belirleyin.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
          <div>
            <label className="auth-label">YENİ GÜVENLİK ANAHTARI</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="auth-label">YENİ ANAHTAR (TEKRAR)</label>
            <input
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(64, 224, 208, 0.6)' }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              marginTop: '16px', 
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
            {loading ? 'GÜNCELLENİYOR...' : 'ANAHTARI GÜNCELLE'}
          </motion.button>
        </form>
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
