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

  // Regex Mention Parser
  const renderTextWithMentions = (text: string) => {
    const mentionRegex = /(@\w+)/g
    const parts = text.split(mentionRegex)

    return parts.map((part, index) => {
      if (part.match(mentionRegex)) {
        const username = part.substring(1) // remove '@'
        return (
          <Link key={index} href={`/profile/${username}`} style={{ color: 'var(--brand-light)', fontWeight: 'bold', textDecoration: 'none' }}>
            {part}
          </Link>
        )
      }
      return part
    })
  }

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center' }}>
        <h1 className="font-bold" style={{ fontSize: '2.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0 }}>Teta Network</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '8px' }}>Ligin nabzı burada atıyor. Dedikodular, transferler ve taktikler.</p>
      </div>

      {/* CREATE POST PANEL */}
      <div className="game-panel interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 0 10px var(--brand-glow)' }}>
            B
          </div>
          <textarea 
            className="flat-input"
            placeholder="Lige dair son havadisler neler? Veya bir @oyuncu etiketle..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            style={{ minHeight: '100px', resize: 'vertical', background: 'rgba(0,0,0,0.4)' }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button className="flat-button" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📷</span> Görsel (Mock)
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', color: isBuildPost ? 'var(--brand-light)' : 'var(--text-muted)' }}>
              <input 
                type="checkbox" 
                checked={isBuildPost} 
                onChange={(e) => setIsBuildPost(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-main)' }}
              />
              ⚔️ Build Paylaş
            </label>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePostSubmit}
            className="flat-button primary" 
            style={{ padding: '10px 32px', fontSize: '0.9rem', opacity: postContent.trim() ? 1 : 0.5, cursor: postContent.trim() ? 'pointer' : 'not-allowed' }}
            disabled={!postContent.trim()}
          >
            AĞA GÖNDER
          </motion.button>
        </div>
      </div>

      {/* FEED (AKIŞ) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="game-panel interactive" 
              style={{ padding: '24px', display: 'flex', gap: '16px' }}
            >
              {/* Avatar */}
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: post.isVerifiedJournalist ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)', border: post.isVerifiedJournalist ? '2px solid var(--brand-light)' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                {post.avatarLetter}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Link href={`/profile/${post.username}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {post.author}
                  </Link>
                  {post.isVerifiedJournalist && (
                    <span title="Doğrulanmış Teta Habercisi" style={{ color: '#1d9bf0', fontSize: '1.1rem', background: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ✓
                    </span>
                  )}
                  <span className="text-subtle" style={{ fontSize: '0.85rem', marginLeft: 'auto' }}>{post.timestamp}</span>
                </div>

                {/* Text Content */}
                <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: post.isBuildShare ? '16px' : '0' }}>
                  {renderTextWithMentions(post.content)}
                </p>

                {/* Build Share Card */}
                {post.isBuildShare && (
                  <Link href={`/profile/${post.username}?tab=builds`} style={{ textDecoration: 'none' }}>
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      style={{ background: 'rgba(217, 119, 95, 0.05)', border: '1px solid rgba(217, 119, 95, 0.2)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                    >
                      <div style={{ width: '40px', height: '40px', background: 'var(--brand-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 0 15px var(--brand-glow)' }}>
                        ⚙️
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="font-bold" style={{ color: 'var(--brand-light)', fontSize: '0.95rem' }}>{post.buildTitle}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Oyuncunun özel taktiksel dizilimini incelemek için tıkla.</div>
                      </div>
                      <div className="text-muted" style={{ fontSize: '1.2rem' }}>&rarr;</div>
                    </motion.div>
                  </Link>
                )}

                {/* Interaction Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '20px' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--brand-main)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    ❤️ {post.likes}
                  </button>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    💬 Yanıtla
                  </button>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    🔁 Yeniden Paylaş
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
