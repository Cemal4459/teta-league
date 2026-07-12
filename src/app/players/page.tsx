import Link from 'next/link'

export const metadata = { title: 'Oyuncu Ağı' }

export default function PlayersPlaceholder() {
  return (
    <div className="bento-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="cyber-box scanline" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <h3 style={{ color: 'var(--neon-red)', marginBottom: '16px', fontSize: '1.2rem', fontFamily: 'Orbitron' }}>
          // 03. OYUNCU AĞI
        </h3>
        <h1 className="glitch-text" data-text="SİSTEM İNŞA EDİLİYOR..." style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '24px' }}>
          SİSTEM İNŞA EDİLİYOR...
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
          Global oyuncu veritabanı indeksleniyor. Yakında binlerce oyuncu profiline erişebileceksiniz.
        </p>
        <Link href="/" className="cyber-button">
          ANA SİSTEME DÖN
        </Link>
      </div>
    </div>
  )
}
