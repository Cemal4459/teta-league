'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RULES_DATA = [
  {
    id: 'genel-fair-play',
    title: 'Genel Fair Play',
    rules: [
      'Tüm oyuncular rakiplerine, takım arkadaşlarına ve adminlere saygı göstermek zorundadır.',
      'Oyun içi hataları (bug abuse) kullanmak kesinlikle yasaktır ve doğrudan turnuvadan men edilme sebebidir. ⚠️',
      'Irkçılık, cinsiyetçilik veya herhangi bir ayrımcı söylem tolerans gösterilmeksizin cezalandırılır.',
    ]
  },
  {
    id: 'mac-ve-yayin',
    title: 'Maç ve Yayın Kuralları',
    rules: [
      'Maç saatinden en az 15 dakika önce tüm takım üyelerinin lobide hazır bulunması gerekmektedir.',
      'Resmi turnuva maçlarının Discord üzerinden yayınlanması (ekran paylaşımı) zorunludur. ⚠️',
      'Bağlantı kopması durumunda maçın ilk 10 dakikası içindeyse maç yeniden başlatılır. Daha geç yaşanan kopmalarda oyun devam eder.',
    ]
  },
  {
    id: 'kaptan-sorumluluklari',
    title: 'Kaptan Sorumlulukları',
    rules: [
      'Takım kaptanları, kendi oyuncularının disiplininden ve kurallara uymasından birinci derecede sorumludur.',
      'Maç sonu skor tabloları (screenshot) sadece kaptanlar tarafından adminlere iletilmelidir. ⚠️',
      'Kaptanlar, transfer dönemi dışında oyuncu alımı veya atımı yapamazlar.',
    ]
  },
  {
    id: 'transfer-donemi',
    title: 'Transfer Dönemi Kuralları',
    rules: [
      'Transferler sadece resmi transfer penceresi açıkken yapılabilir.',
      'Bir oyuncu bir sezonda en fazla 2 farklı takımda forma giyebilir.',
      'Kaptanlar, serbest oyunculara scout ağı üzerinden teklif yaparken takım bütçelerini aşamazlar. ⚠️',
      'Takımından ayrılan bir oyuncu, 7 gün boyunca başka bir takıma imza atamaz (Cool-down period).'
    ]
  }
]

export default function RulesPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'genel-fair-play': true, // Default open first
    'mac-ve-yayin': false,
    'kaptan-sorumluluklari': false,
    'transfer-donemi': false,
  })

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Auto open when scrolled to
      setOpenSections(prev => ({ ...prev, [id]: true }))
    }
  }

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
        <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px', color: 'var(--neon-red)' }}>
          KULLANICI SÖZLEŞMESİ & KİTAPÇIK
        </div>
        <h1 className="font-bold" style={{ fontSize: '3.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0, letterSpacing: '2px' }}>
          TETA LEAGUE KURALLARI
        </h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '16px' }}>
          Tüm oyuncuların uyması gereken resmi turnuva ve lig şartnamesi.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* MEDIA QUERY FOR DESKTOP GRID */}
        <style>{`
          @media (min-width: 1024px) {
            .rules-layout {
              display: grid;
              grid-template-columns: 300px 1fr;
              gap: 60px;
            }
            .sidebar { display: block !important; }
          }
          .sidebar { display: none; }
          .rule-item::before {
            content: '•';
            color: var(--brand-main);
            position: absolute;
            left: 0;
            top: 0;
            font-size: 1.5rem;
            line-height: 1.2;
          }
        `}</style>

        <div className="rules-layout">
          
          {/* SOL: STICKY NAVİGASYON (SIDEBAR) */}
          <div className="sidebar" style={{ position: 'sticky', top: '120px' }}>
            <div className="game-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(15,10,10,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
              <h3 className="font-bold" style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '8px' }}>
                İÇİNDEKİLER
              </h3>
              {RULES_DATA.map(section => (
                <button 
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  style={{ textAlign: 'left', background: 'transparent', border: 'none', color: openSections[section.id] ? 'var(--brand-main)' : 'rgba(255,255,255,0.5)', fontWeight: openSections[section.id] ? 'bold' : 'normal', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', padding: '8px 0', borderLeft: openSections[section.id] ? '3px solid var(--brand-main)' : '3px solid transparent', paddingLeft: openSections[section.id] ? '12px' : '0' }}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* SAĞ: KURAL AKORDEONLARI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {RULES_DATA.map((section, index) => (
              <div key={section.id} id={section.id} style={{ scrollMarginTop: '120px' }}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="game-panel interactive"
                  style={{ background: 'linear-gradient(180deg, rgba(20,15,15,0.8) 0%, rgba(10,5,5,0.95) 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                >
                  {/* Başlık ve Toggle */}
                  <button 
                    onClick={() => toggleSection(section.id)}
                    style={{ width: '100%', padding: '24px 32px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#fff' }}
                  >
                    <h2 className="font-bold" style={{ fontSize: '1.5rem', margin: 0, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: 'var(--brand-main)', fontSize: '1.2rem' }}>0{index + 1} //</span>
                      {section.title}
                    </h2>
                    <motion.div 
                      animate={{ rotate: openSections[section.id] ? 180 : 0 }} 
                      transition={{ duration: 0.3 }}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                    >
                      ▼
                    </motion.div>
                  </button>

                  {/* Akordeon İçeriği */}
                  <AnimatePresence>
                    {openSections[section.id] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <div style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {section.rules.map((rule, rIndex) => (
                            <div key={rIndex} className="rule-item" style={{ position: 'relative', paddingLeft: '24px', fontSize: '1.1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
                              {rule.includes('⚠️') ? (
                                <span dangerouslySetInnerHTML={{ __html: rule.replace('⚠️', '<span style="color: var(--neon-red); text-shadow: 0 0 10px var(--neon-red); font-size: 1.3rem; margin-left: 8px;">⚠️ DİKKAT</span>') }} />
                              ) : (
                                rule
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
