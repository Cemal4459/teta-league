'use client'

import { motion } from 'framer-motion'

export default function StorePage() {
  
  // Custom Check Icon for VIP Card
  const CheckIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffd700', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))', flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* CSS ANIMATIONS FOR LUXURY FEEL */}
      <style>{`
        @keyframes liquid-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .holographic-shimmer {
          background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 40%, rgba(255,215,0,0.1) 50%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0) 100%);
          background-size: 200% 200%;
          animation: liquid-gradient 6s linear infinite;
        }
        
        /* Glass Buttons */
        .glass-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-weight: bold;
          font-family: 'Inter', sans-serif;
          padding: 16px 32px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          width: 100%;
          font-size: 1.1rem;
          letter-spacing: 2px;
          position: relative;
          overflow: hidden;
        }
        
        /* Neon Glows based on classes */
        .btn-blue:hover {
          background: rgba(135,206,235,0.15);
          border-color: rgba(135,206,235,0.5);
          box-shadow: 0 0 30px rgba(135,206,235,0.6);
          color: #87ceeb;
          text-shadow: 0 0 10px rgba(135,206,235,0.8);
        }
        .btn-magenta:hover {
          background: rgba(255,0,255,0.15);
          border-color: rgba(255,0,255,0.5);
          box-shadow: 0 0 30px rgba(255,0,255,0.6);
          color: #ff66ff;
          text-shadow: 0 0 10px rgba(255,0,255,0.8);
        }
        .btn-gold:hover {
          background: rgba(255,215,0,0.15);
          border-color: rgba(255,215,0,0.8);
          box-shadow: 0 0 40px rgba(255,215,0,0.8);
          color: #ffd700;
          text-shadow: 0 0 15px rgba(255,215,0,0.8);
        }
      `}</style>

      {/* HEADER: SİNEMATİK BAŞLIK (Kutular Kaldırıldı) */}
      <div style={{ textAlign: 'center', marginTop: '60px', position: 'relative' }}>
        {/* Background ambient glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '100px', background: 'radial-gradient(ellipse, rgba(64,224,208,0.2) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />
        
        <h1 className="font-bold" style={{ fontSize: '5rem', margin: 0, textShadow: '0 15px 40px rgba(0,0,0,0.9)', letterSpacing: '10px', color: '#fff', position: 'relative', zIndex: 1 }}>
          TETA <span style={{ color: 'var(--brand-main)', textShadow: '0 0 30px rgba(64,224,208,0.6), 0 0 60px rgba(64,224,208,0.2)' }}>STORE</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.4rem', marginTop: '16px', letterSpacing: '4px', textShadow: '0 5px 15px rgba(0,0,0,0.8)', position: 'relative', zIndex: 1, fontWeight: 'bold' }}>
          PROJEYİ DESTEKLE, EFSANE OL.
        </p>
      </div>

      {/* 2 KOZMETİK KART (YAN YANA - GLASSMORPHISM) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
        
        {/* KART 1: Profil Özelleştirme */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="client-glass interactive" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', borderRadius: '24px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(135,206,235,0.1)', position: 'relative', overflow: 'hidden' }}>
          {/* Mavi Süzülen Arkaplan Işıması */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(135,206,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h2 className="font-bold" style={{ fontSize: '2rem', color: '#87ceeb', marginBottom: '12px', textShadow: '0 0 20px rgba(135,206,235,0.5)' }}>Profil Özelleştirme</h2>
            <div className="font-bold" style={{ fontSize: '3rem', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>100 ₺</div>
          </div>
          
          <div style={{ flex: 1, position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', lineHeight: 1.6 }}>Anonim silüet yerine kendi Pro karakterinin yüzünü profiline ekle. Karanlık gölgelerden çık ve yüzünü tüm lige göster.</p>
          </div>

          <motion.button whileTap={{ scale: 0.95 }} className="glass-btn btn-blue" style={{ position: 'relative', zIndex: 1, border: '1px solid rgba(135,206,235,0.3)' }}>
            SATIN AL
          </motion.button>
        </motion.div>

        {/* KART 2: Tema Paketi */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="client-glass interactive" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', borderRadius: '24px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,0,255,0.1)', position: 'relative', overflow: 'hidden' }}>
          {/* Magenta Süzülen Arkaplan Işıması */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,0,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h2 className="font-bold" style={{ fontSize: '2rem', color: '#ff66ff', marginBottom: '12px', textShadow: '0 0 20px rgba(255,0,255,0.5)' }}>Tema Paketi</h2>
            <div className="font-bold" style={{ fontSize: '3rem', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>50 ₺</div>
          </div>
          
          <div style={{ flex: 1, position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', lineHeight: 1.6 }}>Arayüzün tema renklerini kendi tarzına göre özelleştir. Teta League deneyimini tamamen kendi karakterine büründür.</p>
          </div>

          <motion.button whileTap={{ scale: 0.95 }} className="glass-btn btn-magenta" style={{ position: 'relative', zIndex: 1, border: '1px solid rgba(255,0,255,0.3)' }}>
            SATIN AL
          </motion.button>
        </motion.div>

      </div>

      {/* TETA+ PREMIUM ABONELİK (ŞEFFAF VIP PANEL) */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="client-glass interactive holographic-shimmer" style={{ padding: '60px', display: 'flex', gap: '80px', alignItems: 'center', flexWrap: 'wrap', borderRadius: '32px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.2)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Arkada süzülen devasa altın ışıma */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 60%)', pointerEvents: 'none', filter: 'blur(30px)' }} />

        {/* Sol Taraf: Başlık & Fiyat */}
        <div style={{ flex: '1 1 350px', borderRight: '1px solid rgba(255,215,0,0.1)', paddingRight: '40px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', padding: '10px 20px', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '12px', color: '#ffd700', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '4px', marginBottom: '32px', boxShadow: '0 0 20px rgba(255,215,0,0.1)' }}>
            👑 VIP ABONELİK
          </div>
          
          <h2 className="font-bold" style={{ fontSize: '4rem', color: '#fff', marginBottom: '16px', lineHeight: 1.1, textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}>TETA+ <span style={{ color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>PREMIUM</span></h2>
          
          <div className="font-bold" style={{ fontSize: '4.5rem', color: '#ffd700', marginBottom: '40px', textShadow: '0 0 40px rgba(255,215,0,0.6)' }}>500 ₺ <span style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)', textShadow: 'none', fontWeight: 'normal' }}>/ Sezon</span></div>
          
          <motion.button whileTap={{ scale: 0.95 }} className="glass-btn btn-gold" style={{ borderColor: 'rgba(255,215,0,0.5)', background: 'rgba(255,215,0,0.05)', color: '#ffd700', padding: '24px 32px', fontSize: '1.4rem', textShadow: '0 0 15px rgba(255,215,0,0.5)' }}>
            HEMEN KATIL
          </motion.button>
        </div>

        {/* Sağ Taraf: Ayrıcalıklar Listesi (Kutularsız) */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
          <h3 className="font-bold" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '8px', letterSpacing: '2px', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>Efsanevi Ayrıcalıklar:</h3>
          
          {[
            'TETA Turnuvalarına Ücretsiz Katılım Hakkı',
            'Discord\'da Özel VIP Rol Hakkı',
            'Sezon İçi Takım Adı ve Logo Değiştirme Hakkı',
            'Profilde Daha Uzun "Hakkında" Kısmı Kullanabilme',
            'Resmi Maç Yayınlarında İsim Okunması ve Vurgulanması'
          ].map((perk, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <CheckIcon />
              <span style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{perk}</span>
            </div>
          ))}
        </div>

      </motion.div>

    </div>
  )
}
