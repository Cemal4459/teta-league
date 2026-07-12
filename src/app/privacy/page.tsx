import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'Teta League Kişisel Verilerin Korunması Aydınlatma Metni',
}

export default function PrivacyPage() {
  return (
    <div style={{ paddingBottom: '100px', maxWidth: '1000px', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
        <h1 className="font-bold" style={{ fontSize: '3rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0, letterSpacing: '1px' }}>
          KVKK AYDINLATMA METNİ
        </h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '12px' }}>
          Kişisel Verilerin Korunması ve İşlenmesi Hakkında Bilgilendirme
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
            1. Veri Sorumlusunun Kimliği
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            Teta League platformu olarak, kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla, sizi kişisel verilerinizin işlenme amaçları, hukuki nedenleri, toplanma yöntemleri ve haklarınız konusunda bilgilendirmek isteriz.
          </p>
        </section>

        <section>
          <h2 className="font-bold" style={{ fontSize: '1.4rem', color: '#ffd700', margin: '0 0 16px 0', textShadow: '0 0 15px rgba(255,215,0,0.2)' }}>
            2. Kişisel Verilerin İşlenme Amacı
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            Platforma kayıt olurken ve e-spor ekosistemimizde yer alırken paylaştığınız veriler (kullanıcı adı, e-posta adresi, IP adresi, oyun içi istatistikler);
            <br/><br/>
            • Turnuva kayıtlarının oluşturulması ve eşleştirmelerin yapılması,<br/>
            • Liderlik ve skor tablolarının dinamik olarak güncellenmesi,<br/>
            • TETA+ abonelik ve mağaza işlemlerinin güvenliğinin sağlanması,<br/>
            • İletişim ve destek hizmetlerinin sürdürülmesi amacıyla işlenmektedir.
          </p>
        </section>

        <section>
          <h2 className="font-bold" style={{ fontSize: '1.4rem', color: '#ffd700', margin: '0 0 16px 0', textShadow: '0 0 15px rgba(255,215,0,0.2)' }}>
            3. Kişisel Verilerin Aktarılması
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            Toplanan kişisel verileriniz; kanuni yükümlülüklerimizin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşlarıyla, e-spor turnuva kurallarının işletilmesi amacıyla ise turnuva hakemleri ve denetleyicileriyle mevzuata uygun şekilde paylaşılabilmektedir. Üçüncü taraf reklam firmalarına veri satışı kesinlikle yapılmamaktadır.
          </p>
        </section>

        <section>
          <h2 className="font-bold" style={{ fontSize: '1.4rem', color: '#ffd700', margin: '0 0 16px 0', textShadow: '0 0 15px rgba(255,215,0,0.2)' }}>
            4. İlgili Kişinin Hakları (KVKK Madde 11)
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            KVKK'nın 11. maddesi uyarınca veri sahipleri; kişisel veri işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenen verilerin düzeltilmesini isteme ve verilerin silinmesini talep etme haklarına sahiptir. Bu haklarınızı kullanmak için iletişim kanallarımızdan bize ulaşabilirsiniz.
          </p>
        </section>

      </div>
    </div>
  )
}
