'use client'

import { useState } from 'react'
import Link from 'next/link'
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

      // Insert initial profile row
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
    <>
      <section className="auth-shell">
        <div className="auth-panel">
          <img src="/images/teta-logo.jpg" alt="Teta Pro Clubs logosu" />
          <span className="eyebrow">Hesap</span>
          <h1>Kayıt Ol</h1>
          <form className="control-form" onSubmit={handleSubmit}>
            <label>
              Kullanıcı adı
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Babba10" />
            </label>
            <label>
              E-posta
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ornek@teta.gg" />
            </label>
            <label>
              Şifre
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
            </label>
            <button className="button button-primary" type="submit" disabled={loading} style={{ width: '100%', minHeight: 42 }}>
              {loading ? (
                <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              )}
              {loading ? '' : 'Kayıt Ol'}
            </button>
          </form>
          <Link href="/login">Zaten hesabım var</Link>
        </div>
      </section>

      {toast && (
        <div className="pid-toast show" style={{ borderColor: toast.error ? 'rgba(204,10,29,0.3)' : 'rgba(59,186,114,0.3)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: toast.error ? '#cc0a1d' : '#5de0a0' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span className="pid-toast-text">{toast.message}</span>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
