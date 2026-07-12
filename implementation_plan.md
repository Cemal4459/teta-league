# Supabase Entegrasyonu Faz 2: Takım ve Kadro Motoru

Bu plan, Teta League projesi için "Takım Oluşturma" (Guild/Clan) sistemini Supabase veritabanına ve arayüze entegre etmeyi amaçlar. Admin panelinden takım yaratılmasından, Kaptanların kendi kadrolarını "AAA Client HUD" estetiğinde yönetebilmesine kadar uzanan bir mimari öngörülmektedir.

> [!IMPORTANT]  
> Supabase veritabanı şemasını (SQL kodları) benim (Antigravity'nin) doğrudan sizin Supabase panelinize bağlanarak çalıştırma yetkim yoktur. Bu nedenle, aşağıda verilen "SQL Şeması" adımlarını plan onayından sonra size bir `.sql` dosyası olarak veya metin formatında sunacağım. Bu komutları **Supabase Dashboard > SQL Editor** üzerinden manuel olarak çalıştırmanız gerekecek.

## User Review Required
Lütfen aşağıdaki SQL veritabanı şemasını ve UI değişikliklerini inceleyin. Özellikle `profiles` tablosuna `role` ve `team_id` eklemelerinin sisteminizle uyumlu olup olmadığını kontrol edin. Her şey uygunsa "Onaylıyorum" diyerek işleme başlayabiliriz.

## Proposed Changes

### 1. Veritabanı Şeması (Supabase SQL)
- **Yeni Tablo (`teams`):**
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `logo_url` (text, nullable)
  - `budget` (numeric, default 50000000)
  - `captain_id` (uuid, references profiles(id))
  - `created_at` (timestamp)
- **Tablo Güncellemesi (`profiles`):**
  - `team_id` (uuid, references teams(id), nullable)
  - `role` (text, default 'player', check in ('player', 'captain', 'admin'))

### 2. Admin Paneli - Takım Yaratma
#### [MODIFY] [admin/page.tsx](file:///c:/Users/hp/Documents/teta-league-nextjs/src/app/admin/page.tsx)
- "Kulüp Yönetimi" sekmesindeki sahte (mock) verileri Supabase ile gerçek verilere bağlayacağım.
- "+ YENİ KULÜP KUR" butonuna tıklandığında açılan şeffaf bir "Takım Yaratma Formu" (Glassmorphism Modal) ekleyeceğim.
- Bu formda Admin:
  - Takım adı girecek.
  - Veritabanındaki "Serbest (team_id is null)" oyunculardan birini "Kaptan" olarak seçecek.
- Form onaylandığında Supabase'e takım kaydedilecek, seçilen kaptanın `role` değeri `captain`, `team_id` değeri ise yeni oluşturulan takımın id'si olarak güncellenecek.

### 3. Kaptan Paneli (Kadro Yönetim HUD'ı)
#### [NEW] [captain/page.tsx](file:///c:/Users/hp/Documents/teta-league-nextjs/src/app/captain/page.tsx)
- Sadece `role === 'captain'` olanların girebileceği (middleware veya client-side korumalı) yeni bir "Kaptan Komuta Merkezi" sayfası oluşturacağım.
- Estetik olarak Profil sayfasındaki karanlık, neon turkuaz ve altın parlamalı AAA Client HUD arayüzünü baz alacağım.
- **Özellikler:**
  - **Mevcut Kadro:** Takımdaki oyuncuların süzülen satırlar (glass rows) halinde listelenmesi.
  - **Kadro Dışı Bırakma (Kick):** Kaptanın, takımındaki bir oyuncuyu takımdan çıkarma eylemi (`team_id` değerini null yapma).
  - **Transfer Odası İskeleti:** Sistemdeki serbest oyuncuların listelendiği ve (ileriki fazlarda) davet gönderilebilecek bir vitrin alanı.

## Verification Plan
1. Admin panelinden yeni bir takım oluşturulup, oluşturulan takımın Supabase `teams` tablosuna düştüğü doğrulanacak.
2. Atanan kaptanın `profiles` tablosundaki `role` ve `team_id` değerlerinin başarıyla güncellendiği teyit edilecek.
3. Kaptan kullanıcısıyla sisteme giriş yapıldığında `/captain` HUD arayüzüne başarıyla erişildiği, takım arkadaşlarının listelendiği doğrulanacak.
4. Kaptanın bir oyuncuyu (kick) takımdan çıkardığında oyuncunun `team_id` sinin silindiği doğrulanacak.
