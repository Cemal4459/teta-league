'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [toast, setToast] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: 'MustafaKucukbas',
    position: 'ST',
    bio: 'Teta League All Stars takımının golcüsü. Şampiyonluklara aç, kupalara doymayan bir profil.',
    clubsBuilder: 'https://clubsbuilder.com/builds/12345'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    // Mock save logic
    setToast('Profil başarıyla güncellendi!')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
      
      {/* CSS For Input Fields */}
      <style>{`
        .luxury-input {
          width: 100%;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,215,0,0.2);
          color: #fff;
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s;
        }
        .luxury-input:focus {
          outline: none;
          border-color: #ffd700;
          box-shadow: 0 0 15px rgba(255,215,0,0.2);
          background: rgba(255,215,0,0.05);
        }
        .luxury-label {
          display: block;
          font-weight: bold;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        select.luxury-input option {
          background: #111;
          color: #fff;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <h1 className="font-bold" style={{ fontSize: '3.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0, color: '#ffd700' }}>
          PROFİL AYARLARI
        </h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '8px' }}>
          Teta League e-spor arenasında seni yansıtacak detayları düzenle.
        </p>
      </div>

      {/* FORM KART */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="game-panel interactive"
        style={{ padding: '60px 40px', background: 'linear-gradient(135deg, rgba(20,20,15,0.9), rgba(10,10,10,0.95))', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 50px rgba(255,215,0,0.05)', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
          
          <div>
            <label className="luxury-label">KULLANICI ADI</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="luxury-input" 
              placeholder="Örn: Xx_Efsane_xX"
            />
          </div>

          <div>
            <label className="luxury-label">MEVKİ (POZİSYON)</label>
            <select 
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="luxury-input"
            >
              <option value="ST">ST - Forvet</option>
              <option value="LW">LW - Sol Kanat</option>
              <option value="RW">RW - Sağ Kanat</option>
              <option value="CAM">CAM - Ofansif Orta Saha</option>
              <option value="CM">CM - Merkez Orta Saha</option>
              <option value="CDM">CDM - Defansif Orta Saha</option>
              <option value="CB">CB - Stoper</option>
              <option value="LB">LB - Sol Bek</option>
              <option value="RB">RB - Sağ Bek</option>
              <option value="GK">GK - Kaleci</option>
            </select>
          </div>

          <div>
            <label className="luxury-label">HAKKINDA (BİOGRAFİ)</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="luxury-input" 
              placeholder="E-spor kariyerinden bahset..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Daha fazla karakter için <Link href="/store" style={{ color: '#ffd700', textDecoration: 'none' }}>TETA+ Premium</Link> alabilirsiniz.</span>
              <span>{formData.bio.length} / 200</span>
            </div>
          </div>

          <div>
            <label className="luxury-label">CLUBSBUILDER LİNKİ (Yetenek Ağacı)</label>
            <input 
              type="url" 
              name="clubsBuilder"
              value={formData.clubsBuilder}
              onChange={handleChange}
              className="luxury-input" 
              placeholder="https://clubsbuilder.com/builds/..."
            />
            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '8px' }}>Diğer oyuncuların yetenek ve build yapınızı görmesini sağlar.</div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flat-button shimmer-effect"
            style={{ width: '100%', padding: '20px', fontSize: '1.2rem', background: 'linear-gradient(90deg, #ffd700, #ff8c00)', color: '#111', border: 'none', borderRadius: '12px', fontWeight: '900', marginTop: '16px', letterSpacing: '2px', boxShadow: '0 10px 30px rgba(255,215,0,0.3)' }}
          >
            DEĞİŞİKLİKLERİ KAYDET
          </motion.button>

        </div>
      </motion.div>

      {/* TOAST BİLDİRİMİ */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'rgba(93, 224, 160, 0.95)', padding: '16px 24px', color: '#111', borderRadius: '8px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: 'bold', border: '1px solid #5de0a0' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
