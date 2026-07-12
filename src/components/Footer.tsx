'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'

const SOCIAL_LINKS = [
  { name: 'Discord', url: '#', icon: '🎮', label: 'Katıl ve takımını bul' },
  { name: 'Kick', url: 'https://kick.com/tetaleague', icon: '🟢', label: 'Canlı maç yayınları', isExternal: true },
  { name: 'X / Instagram', url: '#', icon: '📱', label: 'Sosyal ağlar' }
]

const CORPORATE_LINKS = [
  { name: 'Kurallar ve Fair Play', href: '/rules' },
  { name: 'KVKK Aydınlatma Metni', href: '/privacy' },
  { name: 'Çerez Politikası', href: '/cookies' },
  { name: 'İletişim / Destek Talebi', href: '/support' }
]

export default function Footer() {
  return (
    <footer style={{ 
      background: 'rgba(5, 10, 15, 0.8)', 
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(64, 224, 208, 0.2)', 
      boxShadow: '0 -10px 30px rgba(64, 224, 208, 0.05)',
      paddingTop: '60px',
      marginTop: 'auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Neon Glow Effect */}
      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'radial-gradient(ellipse at center, rgba(64, 224, 208, 0.8) 0%, transparent 70%)', boxShadow: '0 0 20px rgba(64, 224, 208, 0.5)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* ÜST KISIM (3 Sütun Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          
          {/* SOL: Sadece Marka ve Açıklama */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Logo width={70} height={70} />
            </Link>
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '300px' }}>
              Türkiye'nin en rekabetçi ve premium E-Spor ekosistemi. Takımını kur, yeteneklerini geliştir ve zirveye oyna.
            </p>
          </div>

          {/* ORTA: Sosyal Ağlar (TOPLULUK) */}
          <div>
            <h4 className="font-bold" style={{ color: 'var(--brand-main)', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '24px', textShadow: '0 0 10px rgba(64, 224, 208, 0.3)' }}>TOPLULUK</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SOCIAL_LINKS.map(link => (
                <a key={link.name} href={link.url} target={link.isExternal ? "_blank" : "_self"} rel={link.isExternal ? "noopener noreferrer" : ""} style={{ textDecoration: 'none' }}>
                  <motion.div 
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)', boxShadow: link.isExternal ? '0 0 15px rgba(64, 224, 208, 0.2)' : 'none' }}
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 12px', borderRadius: '8px', transition: 'all 0.3s' }}
                  >
                    <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }}>{link.icon}</span>
                    <div>
                      <div className="font-bold" style={{ color: '#fff', fontSize: '0.95rem' }}>{link.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{link.label}</div>
                    </div>
                  </motion.div>
                </a>
              ))}
            </div>
          </div>

          {/* SAĞ: Kurumsal Linkler */}
          <div>
            <h4 className="font-bold" style={{ color: 'var(--brand-main)', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '24px', textShadow: '0 0 10px rgba(64, 224, 208, 0.3)' }}>KURUMSAL & DESTEK</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {CORPORATE_LINKS.map(link => (
                <Link key={link.name} href={link.href} style={{ textDecoration: 'none' }}>
                  <motion.span 
                    whileHover={{ color: 'var(--brand-main)', x: 5 }}
                    style={{ color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s', display: 'inline-block' }}
                  >
                    {link.name}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* ALT SATIR (Divider & Copyright) */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '30px 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          
          <div className="text-muted" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
            Tüm hakları saklıdır Doruk Kaya © 2026
          </div>

          <div className="text-muted" style={{ fontSize: '0.85rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Made by 
            <motion.a 
              href="#"
              whileHover={{ color: 'var(--brand-main)', textShadow: '0 0 15px rgba(64, 224, 208, 0.8)', scale: 1.05 }}
              style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none', transition: 'color 0.3s', display: 'inline-block' }}
            >
              Cemal Yıldız
            </motion.a>
          </div>

        </div>

      </div>
    </footer>
  )
}
