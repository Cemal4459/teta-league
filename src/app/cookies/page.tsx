import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Çerez Politikası',
  description: 'Teta League Çerez Kullanımı ve Aydınlatma Metni',
}

export default function CookiesPage() {
  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1000px', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
        <h1 className="font-bold" style={{ fontSize: '3rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0, letterSpacing: '1px' }}>
          ÇEREZ POLİTİKASI
        </h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '12px' }}>
          Web Sitesi ve İstemci Çerez (Cookie) Kullanımı Hakkında Bilgilendirme
        </p>
      </div>

      {/* CONTENT BOX */}
      <div 
        className="game-panel"
        style={{ 
          padding: '60px', 
          background: 'linear-gradient(180deg, rgba(20,15,15,0.8) 0%, rgba(10,5,5,0.95) 100%)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '24px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        
        <section>
          <h2 className="font-bold" style={{ fontSize: '1.4rem', color: '#ffd700', margin: '0 0 16px 0', textShadow: '0 0 15px rgba(255,215,0,0.2)' }}>
            1. Çerez (Cookie) Nedir?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            Çerezler, Teta League platformunu ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, platformun düzgün çalışmasını sağlamak, oturum bilgilerinizi hatırlamak ve size daha kişiselleştirilmiş bir e-spor deneyimi sunmak amacıyla kullanılır.
          </p>
        </section>

        <section>
          <h2 className="font-bold" style={{ fontSize: '1.4rem', color: '#ffd700', margin: '0 0 16px 0', textShadow: '0 0 15px rgba(255,215,0,0.2)' }}>
            2. Platformumuzda Kullanılan Çerez Türleri
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            <strong>Zorunlu Çerezler:</strong> Platformun temel işlevlerinin (örn: Supabase oturum yönetimi, güvenli bağlantı) yerine getirilmesi için kesinlikle gerekli olan çerezlerdir. Devre dışı bırakılamazlar.<br/><br/>
            <strong>Performans ve Analiz Çerezleri:</strong> Teta League sunucularındaki yükü ölçmek, sayfa geçiş hızlarını analiz etmek ve sistem optimizasyonları yapmak amacıyla anonim veri toplayan çerezlerdir.<br/><br/>
            <strong>İşlevsellik Çerezleri:</strong> Dil tercihleriniz, aydınlık/karanlık tema seçiminiz ve UI animasyon ayarlarınız gibi tercihlerinizi hatırlayan çerezlerdir.
          </p>
        </section>

        <section>
          <h2 className="font-bold" style={{ fontSize: '1.4rem', color: '#ffd700', margin: '0 0 16px 0', textShadow: '0 0 15px rgba(255,215,0,0.2)' }}>
            3. Çerez Yönetimi ve Tercihler
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            Ziyaretçilerimiz, tarayıcı ayarlarını değiştirerek çerez kullanımını istedikleri zaman sınırlandırabilir veya tamamen engelleyebilirler. Ancak zorunlu çerezlerin engellenmesi durumunda, oturum açma, turnuva kayıtları ve profil yönetimi gibi kritik AAA arayüz fonksiyonlarının çalışmayabileceğini unutmayınız. Çerez onay durumunuzu, tarayıcınızın geçmişini temizleyerek sıfırlayabilirsiniz.
          </p>
        </section>

      </div>
    </div>
  )
}
