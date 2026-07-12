'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Post {
  id: string
  author: string
  username: string
  avatarLetter: string
  isVerifiedJournalist: boolean
  content: string
  timestamp: string
  likes: number
  isBuildShare?: boolean
  buildTitle?: string
}

export default function SocialPage() {
  const [postContent, setPostContent] = useState('')
  const [isBuildPost, setIsBuildPost] = useState(false)
  
  // Mock Data (AI Journalists and Users)
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Fazribio Romono',
      username: 'fazribioromono',
      avatarLetter: 'F',
      isVerifiedJournalist: true,
      content: '@mustafakucukbas yeni sezonda harikalar yaratıyor! Beklenmedik bir çıkış, piyasasını çok yükseltti. Here we go!',
      timestamp: '5 dk önce',
      likes: 1245
    },
    {
      id: '2',
      author: 'Valiente',
      username: 'valiente_cb',
      avatarLetter: 'V',
      isVerifiedJournalist: false,
      content: 'Sonunda defansın kilidini çözecek o mükemmel ayarı buldum. İkili mücadelelerde duvar olmak isteyenler buyursun.',
      timestamp: '1 saat önce',
      likes: 84,
      isBuildShare: true,
      buildTitle: '🛡️ Adam Biçen CB Buildi - Valiente\'nin Yapılandırması'
    },
    {
      id: '3',
      author: 'Sağız Yabuncuoğlu',
      username: 'sagizyabuncuoglu',
      avatarLetter: 'S',
      isVerifiedJournalist: true,
      content: '🚨 ÖZEL HABER! @keremacar takımdan ayrılmak için transfer görüşmelerine başladı. Yakında resmi açıklama gelir, şok gelişmeler kapıda.',
      timestamp: '3 saat önce',
      likes: 3200
    },
    {
      id: '4',
      author: 'Kral10',
      username: 'kral_10',
      avatarLetter: 'K',
      isVerifiedJournalist: false,
      content: 'Dünkü maçta inanılmaz efor sarf ettik ama yetmedi. Önümüzdeki hafta @dorukkaya yı geçebilirsek şampiyonluk yolumuz açılacak.',
      timestamp: '5 saat önce',
      likes: 42
    },
    {
      id: '5',
      author: 'THalks',
      username: 'thalks_espor',
      avatarLetter: 'T',
      isVerifiedJournalist: true,
      content: 'Analiz Zamanı: Bu hafta @dorukkaya defansta resmen duvar ördü. Rakiplerin xG oranını dibe çekti. Adam geçilmiyor!',
      timestamp: '8 saat önce',
      likes: 890
    }
  ])

  // Handle Post Creation
  const handlePostSubmit = () => {
    if (!postContent.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Benim Profilim',
      username: 'kullanici_adiniz',
      avatarLetter: 'B',
      isVerifiedJournalist: false,
      content: postContent,
      timestamp: 'Şimdi',
      likes: 0,
      ...(isBuildPost && { isBuildShare: true, buildTitle: '⚔️ Yeni Taktiksel Build - Özel Yapılandırma' })
    }

    setPosts([newPost, ...posts])
    setPostContent('')
    setIsBuildPost(false)
  }

  // Regex Mention Parser with Neon Glow
  const renderTextWithMentions = (text: string) => {
    const mentionRegex = /(@\w+)/g
    const parts = text.split(mentionRegex)

    return parts.map((part, index) => {
      if (part.match(mentionRegex)) {
        const username = part.substring(1) // remove '@'
        return (
          <Link key={index} href={`/profile/${username}`} style={{ color: 'var(--brand-main)', fontWeight: 'bold', textDecoration: 'none', textShadow: '0 0 10px rgba(64, 224, 208, 0.5)' }}>
            {part}
          </Link>
        )
      }
      return part
    })
  }

  return (
    <div style={{ paddingBottom: '100px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* HUD & GLOW CSS */}
      <style>{`
        .hud-action-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .hud-action-btn:hover {
          color: var(--brand-main);
          background: rgba(64, 224, 208, 0.1);
          box-shadow: inset 0 0 15px rgba(64, 224, 208, 0.2);
          text-shadow: 0 0 10px rgba(64, 224, 208, 0.5);
        }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h1 className="font-bold" style={{ fontSize: '3.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)', margin: 0, letterSpacing: '2px' }}>TETA NETWORK</h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '12px' }}>Ligin nabzı burada atıyor. Dedikodular, transferler ve taktikler.</p>
      </div>

      {/* CREATE POST PANEL (GLASSMORPHISM) */}
      <div className="client-glass interactive" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '24px', background: 'rgba(10,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(64,224,208,0.2), transparent)', border: '1px solid rgba(64,224,208,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', flexShrink: 0, boxShadow: '0 0 20px rgba(64, 224, 208, 0.3)' }}>
            B
          </div>
          <textarea 
            className="flat-input"
            placeholder="Lige dair son havadisler neler? Veya bir @oyuncu etiketle..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            style={{ minHeight: '120px', resize: 'vertical', background: 'transparent', border: 'none', fontSize: '1.1rem', color: '#fff', outline: 'none', padding: '16px' }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '76px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button className="flat-button" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>📷</span> Görsel (Mock)
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold', color: isBuildPost ? 'var(--brand-main)' : 'var(--text-muted)', transition: 'all 0.3s', textShadow: isBuildPost ? '0 0 10px rgba(64, 224, 208, 0.5)' : 'none' }}>
              <input 
                type="checkbox" 
                checked={isBuildPost} 
                onChange={(e) => setIsBuildPost(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--brand-main)', cursor: 'pointer' }}
              />
              ⚔️ Build Paylaş
            </label>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(64,224,208,0.8)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePostSubmit}
            style={{ 
              padding: '12px 32px', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              letterSpacing: '1px',
              opacity: postContent.trim() ? 1 : 0.5, 
              cursor: postContent.trim() ? 'pointer' : 'not-allowed',
              background: 'rgba(64, 224, 208, 0.1)',
              border: '1px solid var(--brand-main)',
              color: '#fff',
              borderRadius: '8px',
              boxShadow: '0 0 15px rgba(64, 224, 208, 0.4)',
              transition: 'all 0.3s'
            }}
            disabled={!postContent.trim()}
          >
            AĞA GÖNDER
          </motion.button>
        </div>
      </div>

      {/* FEED (AKIŞ) - SÜZÜLEN BLOKLAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: '32px 16px', display: 'flex', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Avatar */}
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: post.isVerifiedJournalist ? 'rgba(255,255,255,0.05)' : 'transparent', border: post.isVerifiedJournalist ? '2px solid #1d9bf0' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', flexShrink: 0, boxShadow: post.isVerifiedJournalist ? '0 0 15px rgba(29, 155, 240, 0.4)' : 'none' }}>
                {post.avatarLetter}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Link href={`/profile/${post.username}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                    {post.author}
                  </Link>
                  {post.isVerifiedJournalist && (
                    <span title="Doğrulanmış Teta Habercisi" style={{ color: '#1d9bf0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 0 5px rgba(29,155,240,0.5))' }}>
                      ☑️
                    </span>
                  )}
                  <span className="text-subtle" style={{ fontSize: '0.9rem', marginLeft: 'auto' }}>{post.timestamp}</span>
                </div>

                {/* Text Content */}
                <p style={{ fontSize: '1.15rem', lineHeight: 1.6, marginBottom: post.isBuildShare ? '20px' : '0', color: 'rgba(255,255,255,0.9)' }}>
                  {renderTextWithMentions(post.content)}
                </p>

                {/* Build Share Module (Technological Badge) */}
                {post.isBuildShare && (
                  <Link href={`/profile/${post.username}?tab=builds`} style={{ textDecoration: 'none' }}>
                    <motion.div 
                      whileHover={{ scale: 1.01, boxShadow: '0 0 25px rgba(64, 224, 208, 0.2)' }}
                      className="interactive"
                      style={{ background: 'rgba(64, 224, 208, 0.05)', border: '1px solid rgba(64, 224, 208, 0.3)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', boxShadow: '0 0 15px rgba(64, 224, 208, 0.1)', backdropFilter: 'blur(5px)' }}
                    >
                      <div style={{ width: '48px', height: '48px', background: 'rgba(64,224,208,0.1)', border: '1px solid var(--brand-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: 'inset 0 0 15px rgba(64,224,208,0.3)' }}>
                        ⚙️
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="font-bold" style={{ color: 'var(--brand-main)', fontSize: '1.05rem', textShadow: '0 0 10px rgba(64,224,208,0.3)' }}>{post.buildTitle}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>Oyuncunun özel taktiksel dizilimini incelemek için tıkla.</div>
                      </div>
                      <div style={{ fontSize: '1.5rem', color: 'var(--brand-main)' }}>&rarr;</div>
                    </motion.div>
                  </Link>
                )}

                {/* Interaction Footer (HUD Elements) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                  <button className="hud-action-btn">
                    <span>❤️</span> {post.likes}
                  </button>
                  <button className="hud-action-btn">
                    <span>💬</span> Yanıtla
                  </button>
                  <button className="hud-action-btn">
                    <span>🔁</span> Yeniden Paylaş
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
