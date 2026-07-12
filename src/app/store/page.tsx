'use client'

import { motion } from 'framer-motion'

export default function StorePage() {
  
  // Custom Check Icon for VIP Card
  const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffd700', filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.5))', flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* CSS ANIMATIONS FOR LUXURY FEEL */}
      <style>{`
        @keyframes liquid-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .store-header-bg {
          background: linear-gradient(-45deg, rgba(20,20,20,0.9), rgba(40,20,10,0.8), rgba(10,30,40,0.8), rgba(20,10,30,0.9));
          background-size: 400% 400%;
          animation: liquid-gradient 15s ease infinite;
        }
        .holographic-shimmer {
          background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 40%, rgba(255,215,0,0.2) 50%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 100%);
          background-size: 200% 200%;
          animation: liquid-gradient 6s linear infinite;
        }
        .glass-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          color: #fff;
          font-weight: bold;
          font-family: 'Inter', sans-serif;
          padding: 16px 32px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          font-size: 1.1rem;
          letter-spacing: 1px;
        }
        .glass-btn:hover {
          background: rgba(255,255,255,0.2);
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* HEADER: MAĞAZA VİTRİNİ */}
      <div className="store-header-bg game-panel interactive" style={{ padding: '60px 40px', borderRadius: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        <h1 className="font-bold" style={{ fontSize: '4rem', margin: 0, textShadow: '0 10px 30px rgba(0,0,0,0.8)', letterSpacing: '8px', color: '#fff' }}>
          TETA <span style={{ color: 'var(--brand-main)' }}>STORE</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '16px', letterSpacing: '2px' }}>PROJEYİ DESTEKLE, EFSANE OL.</p>
      </div>

      {/* 2 KOZMETİK KART (YAN YANA) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* KART 1: Profil Özelleştirme */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="game-panel interactive" style={{ background: 'linear-gradient(135deg, rgba(10,20,30,0.9), rgba(5,10,15,0.95))', border: '2px solid rgba(135,206,235,0.3)', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 50px rgba(135,206,235,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(135,206,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div>
            <h2 className="font-bold" style={{ fontSize: '1.8rem', color: '#87ceeb', marginBottom: '8px', textShadow: '0 0 15px rgba(135,206,235,0.4)' }}>Profil Özelleştirme Paketi</h2>
            <div className="font-bold" style={{ fontSize: '2.5rem', color: '#fff' }}>100 ₺</div>
          </div>
          
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6 }}>Anonim silüet yerine kendi Pro karakterinin yüzünü profiline ekle. Karanlık gölgelerden çık ve yüzünü tüm lige göster.</p>
          </div>

          <motion.button whileTap={{ scale: 0.95 }} className="glass-btn" style={{ borderColor: 'rgba(135,206,235,0.5)', background: 'rgba(135,206,235,0.1)' }}>
            SATIN AL
          </motion.button>
        </motion.div>

        {/* KART 2: Tema Paketi */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="game-panel interactive" style={{ background: 'linear-gradient(135deg, rgba(30,10,25,0.9), rgba(15,5,15,0.95))', border: '2px solid rgba(255,0,255,0.3)', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 50px rgba(255,0,255,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255,0,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div>
            <h2 className="font-bold" style={{ fontSize: '1.8rem', color: '#ff66ff', marginBottom: '8px', textShadow: '0 0 15px rgba(255,0,255,0.4)' }}>Tema Paketi</h2>
            <div className="font-bold" style={{ fontSize: '2.5rem', color: '#fff' }}>50 ₺</div>
          </div>
          
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6 }}>Arayüzün tema renklerini kendi tarzına göre özelleştir. Teta League deneyimini tamamen kendi karakterine büründür.</p>
          </div>

          <motion.button whileTap={{ scale: 0.95 }} className="glass-btn" style={{ borderColor: 'rgba(255,0,255,0.5)', background: 'rgba(255,0,255,0.1)' }}>
            SATIN AL
          </motion.button>
        </motion.div>

      </div>

      {/* TETA+ PREMIUM ABONELİK (DEVASA ANA KART) */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="game-panel interactive holographic-shimmer" style={{ background: 'linear-gradient(180deg, rgba(30,25,10,0.9) 0%, rgba(10,10,5,1) 100%)', border: '2px solid rgba(255,215,0,0.5)', borderRadius: '24px', padding: '60px', display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 0 80px rgba(255,215,0,0.1)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Sol Taraf: Başlık & Fiyat */}
        <div style={{ flex: '1 1 300px', borderRight: '1px solid rgba(255,215,0,0.2)', paddingRight: '40px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '8px', color: '#ffd700', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '24px' }}>
            👑 VIP ABONELİK
          </div>
          
          <h2 className="font-bold" style={{ fontSize: '3.5rem', color: '#fff', marginBottom: '16px', lineHeight: 1.1, textShadow: '0 4px 20px rgba(255,215,0,0.4)' }}>TETA+ <span style={{ color: '#ffd700' }}>PREMIUM</span></h2>
          
          <div className="font-bold" style={{ fontSize: '4rem', color: '#ffd700', marginBottom: '32px', textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>500 ₺ <span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.4)', textShadow: 'none' }}>/ Sezon</span></div>
          
          <motion.button whileTap={{ scale: 0.95 }} className="glass-btn" style={{ borderColor: 'rgba(255,215,0,0.8)', background: 'rgba(255,215,0,0.15)', color: '#ffd700', padding: '24px 32px', fontSize: '1.3rem' }}>
            HEMEN KATIL
          </motion.button>
        </div>

        {/* Sağ Taraf: Ayrıcalıklar Listesi */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
          <h3 className="font-bold" style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Efsanevi Ayrıcalıklar:</h3>
          
          {[
            'TETA Turnuvalarına Ücretsiz Katılım Hakkı',
            'Discord\'da Özel VIP Rol Hakkı',
            'Sezon İçi Takım Adı ve Logo Değiştirme Hakkı',
            'Profilde Daha Uzun "Hakkında" Kısmı Kullanabilme',
            'Resmi Maç Yayınlarında İsim Okunması ve Vurgulanması'
          ].map((perk, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.4)', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <CheckIcon />
              <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '500' }}>{perk}</span>
            </div>
          ))}
        </div>

      </motion.div>

    </div>
  )
}
