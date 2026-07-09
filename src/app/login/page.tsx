'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
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
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        console.error('Supabase Login Error:', error.message)
        showToast(error.message || 'Giriş başarısız oldu. Bilgilerinizi kontrol edin.', true)
      } else {
        showToast('Başarıyla giriş yapıldı! Profilinize yönlendiriliyorsunuz...')
        setTimeout(() => router.push('/profile'), 1000)
      }
    } catch (err: any) {
      console.error('Unexpected Login Error:', err)
      showToast(err?.message || 'Beklenmeyen bir hata oluştu.', true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="auth-shell" id="auth">
        <div className="auth-panel">
          <img src="/images/teta-logo.jpg" alt="Teta Pro Clubs logosu" />
          <span className="eyebrow">Hesap</span>
          <h1>Oturum Aç</h1>
          <form className="control-form" onSubmit={handleSubmit}>
            <label>
              E-posta
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="ornek@teta.gg"
              />
            </label>
            <label>
              Şifre
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </label>
            <button className="button button-primary" type="submit" disabled={loading} style={{ width: '100%', minHeight: 42 }}>
              {loading ? (
                <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              )}
              {loading ? '' : 'Giriş Yap'}
            </button>
          </form>
          <Link href="/register">Kayıt oluştur</Link>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="pid-toast show" style={{ borderColor: toast.error ? 'rgba(204,10,29,0.3)' : 'rgba(59,186,114,0.3)', boxShadow: toast.error ? '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(204,10,29,0.15)' : undefined }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: toast.error ? '#cc0a1d' : '#5de0a0' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span className="pid-toast-text">{toast.message}</span>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
