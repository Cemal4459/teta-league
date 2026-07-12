'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsented = localStorage.getItem('teta_cookie_consent')
    if (!hasConsented) {
      // Short delay for a smoother entrance
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('teta_cookie_consent', 'true')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="game-panel interactive"
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            width: 'calc(100% - 80px)',
            maxWidth: '450px',
            background: 'linear-gradient(135deg, rgba(20,20,15,0.85) 0%, rgba(5,5,5,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '20px',
            padding: '24px 32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,215,0,0.05)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))' }}>🍪</div>
            <h3 className="font-bold" style={{ fontSize: '1.2rem', color: '#fff', margin: 0, letterSpacing: '1px' }}>Deneyiminizi Kişiselleştirin</h3>
          </div>
          
          <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
            Teta League platformunda size en iyi e-spor deneyimini sunabilmek için çerezleri (cookies) kullanıyoruz. Devam ederek çerez kullanımını kabul etmiş olursunuz.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleAccept}
              className="flat-button shimmer-effect"
              style={{ flex: 1, padding: '12px', background: 'var(--brand-main)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(217,119,95,0.3)' }}
            >
              KABUL ET
            </motion.button>
            <Link href="/cookies" style={{ textDecoration: 'none', flex: 1 }}>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="flat-button interactive"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                DETAYLARI İNCELE
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
