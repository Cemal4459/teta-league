'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function CaptainCommandCenter() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [activeTab, setActiveTab] = useState<'roster' | 'transfer'>('roster')
  
  const [captainProfile, setCaptainProfile] = useState<any>(null)
  const [teamInfo, setTeamInfo] = useState<any>(null)
  const [roster, setRoster] = useState<any[]>([])
  const [freeAgents, setFreeAgents] = useState<any[]>([])
  
  const [toast, setToast] = useState<{ message: string, error?: boolean } | null>(null)

  const showToast = (message: string, error = false) => {
    setToast({ message, error })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchRoster = async (teamId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('team_id', teamId)
      .order('role', { ascending: false }) // Captain first ideally, or just order by rating later
    
    if (data) setRoster(data)
  }

  const fetchFreeAgents = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .is('team_id', null)
    
    if (data) setFreeAgents(data)
  }

  const loadCaptainData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      setAccessDenied(true)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'captain' || !profile.team_id) {
      setAccessDenied(true)
      setLoading(false)
      return
    }

    setCaptainProfile(profile)

    const { data: team } = await supabase
      .from('teams')
      .select('*')
      .eq('id', profile.team_id)
      .single()

    setTeamInfo(team)
    await fetchRoster(profile.team_id)
    await fetchFreeAgents()

    setLoading(false)
  }

  useEffect(() => {
    loadCaptainData()
  }, [supabase])

  const handleKickPlayer = async (playerId: string, playerName: string) => {
    if (playerId === captainProfile.id) {
      showToast('Kaptan kendini takımdan atamaz.', true)
      return
    }

    if (!confirm(`${playerName} isimli oyuncuyu kadro dışı bırakmak istediğinize emin misiniz?`)) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team_id: null }) // Remove from team
        .eq('id', playerId)

      if (error) throw error

      showToast(`${playerName} kadro dışı bırakıldı ve serbest oyuncu statüsüne geçti.`)
      fetchRoster(captainProfile.team_id) // Refresh roster
      fetchFreeAgents() // Refresh free agents
    } catch (err: any) {
      showToast(err.message || 'İşlem sırasında bir hata oluştu.', true)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(10,20,30,0.8) 0%, rgba(5,10,15,1) 100%)' }}>
        <div style={{ color: 'var(--brand-main)', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', textShadow: '0 0 10px rgba(64,224,208,0.5)' }}>KOMUTA MERKEZİ BAĞLANTISI KURULUYOR...</div>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(10,20,30,0.8) 0%, rgba(5,10,15,1) 100%)' }}>
        <h1 className="font-bold" style={{ fontSize: '3rem', color: 'var(--accent-danger)', textShadow: '0 0 20px rgba(239, 68, 68, 0.6)', marginBottom: '16px' }}>YETKİSİZ ERİŞİM</h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '32px' }}>Bu protokole erişim yalnızca kulüp kaptanlarına özeldir.</p>
        <Link href="/" style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '2px' }}>
          ANA AĞA DÖN
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '60px 40px', background: 'radial-gradient(ellipse at top, rgba(10,20,30,0.8) 0%, rgba(5,10,15,1) 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      
      {/* Arkaplan Işımaları */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(64, 224, 208, 0.08) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255, 184, 0, 0.05) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* HEADER */}
        <div className="client-glass" style={{ padding: '40px', borderRadius: '24px', background: 'rgba(5,10,15,0.6)', border: '1px solid rgba(64,224,208,0.2)', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(64,224,208,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '2px solid var(--brand-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(64,224,208,0.2)', overflow: 'hidden' }}>
              {teamInfo?.logo_url ? <img src={teamInfo.logo_url} style={{ width: '100%', height: '100%' }} /> : <span style={{ fontSize: '2rem', color: 'var(--brand-main)' }}>🛡️</span>}
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: '0.9rem', letterSpacing: '3px', fontWeight: 'bold', marginBottom: '8px' }}>KAPTAN KOMUTA MERKEZİ</div>
              <h1 className="font-bold" style={{ fontSize: '3rem', margin: 0, textShadow: '0 0 15px rgba(64,224,208,0.5)' }}>{teamInfo?.name || 'KULÜP'}</h1>
            </div>
          </div>
          
          <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '8px' }}>HAZİNE BÜTÇESİ</div>
            <div className="font-bold" style={{ fontSize: '2rem', color: '#FFB800', textShadow: '0 0 15px rgba(255,184,0,0.5)' }}>
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(teamInfo?.budget || 0)}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <button 
            onClick={() => setActiveTab('roster')}
            style={{ padding: '16px 32px', background: activeTab === 'roster' ? 'rgba(64,224,208,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: activeTab === 'roster' ? 'var(--brand-main)' : 'rgba(255,255,255,0.05)', color: activeTab === 'roster' ? '#fff' : 'var(--text-muted)', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '1px', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: activeTab === 'roster' ? 'inset 0 0 20px rgba(64,224,208,0.2)' : 'none', textShadow: activeTab === 'roster' ? '0 0 10px rgba(255,255,255,0.5)' : 'none' }}
          >
            MEVCUT KADRO ({roster.length})
          </button>
          <button 
            onClick={() => setActiveTab('transfer')}
            style={{ padding: '16px 32px', background: activeTab === 'transfer' ? 'rgba(255,184,0,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: activeTab === 'transfer' ? '#FFB800' : 'rgba(255,255,255,0.05)', color: activeTab === 'transfer' ? '#fff' : 'var(--text-muted)', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '1px', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: activeTab === 'transfer' ? 'inset 0 0 20px rgba(255,184,0,0.2)' : 'none', textShadow: activeTab === 'transfer' ? '0 0 10px rgba(255,255,255,0.5)' : 'none' }}
          >
            TRANSFER ODASI
          </button>
        </div>

        <AnimatePresence mode="wait">
          
          {/* ROSTER TAB */}
          {activeTab === 'roster' && (
            <motion.div key="roster" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="client-glass" style={{ background: 'rgba(5,10,15,0.6)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                
                {/* Tablo Başlığı */}
                <div style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 120px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '2px', fontWeight: 'bold', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>NO</div>
                  <div>OYUNCU KİMLİĞİ</div>
                  <div>POZİSYON</div>
                  <div>PLATFORM</div>
                  <div>STATÜ</div>
                  <div style={{ textAlign: 'center' }}>AKSİYON</div>
                </div>

                {/* Oyuncu Satırları (Süzülen glass rows) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                  {roster.map(player => (
                    <div key={player.id} style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 120px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px 0', borderRadius: '12px', transition: 'background 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                      <div className="font-bold" style={{ textAlign: 'center', fontSize: '1.2rem', color: '#fff' }}>{player.jersey_number || '-'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: player.role === 'captain' ? '2px solid var(--brand-main)' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {player.avatar_url ? <img src={player.avatar_url} style={{ width: '100%', height: '100%' }} /> : <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>?</span>}
                        </div>
                        <div className="font-bold" style={{ fontSize: '1.2rem', color: player.role === 'captain' ? 'var(--brand-main)' : '#fff', textShadow: player.role === 'captain' ? '0 0 10px rgba(64,224,208,0.5)' : 'none' }}>
                          {player.ea_id || player.username || 'Bilinmiyor'}
                        </div>
                      </div>
                      <div className="font-bold" style={{ color: '#FFB800' }}>{player.main_position || 'BELİRSİZ'}</div>
                      <div className="text-muted">{player.platform || 'PS5'}</div>
                      <div>
                        {player.role === 'captain' ? (
                          <span style={{ padding: '4px 12px', background: 'rgba(64,224,208,0.1)', color: 'var(--brand-main)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>KAPTAN</span>
                        ) : (
                          <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>OYUNCU</span>
                        )}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        {player.role !== 'captain' ? (
                          <button 
                            onClick={() => handleKickPlayer(player.id, player.ea_id || player.username)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-danger)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.boxShadow = 'none' }}
                          >
                            KICK
                          </button>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}>-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}

          {/* TRANSFER TAB (ÖN İSKELET) */}
          {activeTab === 'transfer' && (
            <motion.div key="transfer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="client-glass" style={{ background: 'rgba(5,10,15,0.6)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 className="font-bold" style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#FFB800' }}>Serbest Oyuncu Vitrini</h2>
                <p className="text-muted" style={{ marginBottom: '32px' }}>Ağdaki takım bulamamış oyuncuları inceleyin ve teklif gönderin.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                  {freeAgents.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Şu anda ağda uygun serbest oyuncu bulunmuyor.</div>
                  ) : (
                    freeAgents.map(agent => (
                      <div key={agent.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {agent.avatar_url ? <img src={agent.avatar_url} style={{ width: '100%', height: '100%' }} /> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>?</span>}
                          </div>
                          <div>
                            <div className="font-bold" style={{ fontSize: '1.2rem', color: '#fff' }}>{agent.ea_id || agent.username || 'İsimsiz'}</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>{agent.platform || 'PS5'} | <span style={{ color: 'var(--brand-main)' }}>{agent.main_position || 'Mevki Yok'}</span></div>
                          </div>
                        </div>
                        <button 
                          style={{ width: '100%', background: 'rgba(255,184,0,0.1)', border: '1px solid #FFB800', color: '#FFB800', padding: '12px', borderRadius: '8px', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,184,0,0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(255,184,0,0.3)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,184,0,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                          TEKLİF GÖNDER (YAKINDA)
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Siber Toast Message */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'rgba(10,15,20,0.95)', backdropFilter: 'blur(10px)', border: `1px solid ${toast.error ? 'var(--accent-danger)' : 'var(--brand-main)'}`, padding: '16px 24px', color: toast.error ? 'var(--accent-danger)' : 'var(--brand-main)', borderRadius: '12px', zIndex: 2000, boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px ${toast.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(64, 224, 208, 0.2)'}`, fontWeight: 'bold' }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
