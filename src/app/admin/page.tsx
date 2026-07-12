'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

// --- MOCK DATA FOR OTHER TABS ---
const MOCK_STATS = {
  activePlayers: 142,
  matchesPlayed: 450,
  totalBudget: 152000000,
  pendingApprovals: 8,
  systemHealth: 99.9
}

// --- SUB-COMPONENTS ---
const TabButton = ({ active, label, icon, onClick }: { active: boolean, label: string, icon: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px', 
      width: '100%', 
      padding: '16px 24px', 
      background: active ? 'rgba(64, 224, 208, 0.15)' : 'transparent', 
      border: 'none', 
      borderLeft: active ? '4px solid var(--brand-main)' : '4px solid transparent',
      color: active ? '#fff' : 'var(--text-muted)',
      fontWeight: active ? 'bold' : 'normal',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: active ? 'inset 20px 0 30px -20px rgba(64, 224, 208, 0.3)' : 'none',
      textShadow: active ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
    }}
    onMouseEnter={e => { if(!active) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
    onMouseLeave={e => { if(!active) e.currentTarget.style.background = 'transparent' }}
  >
    <span style={{ fontSize: '1.4rem', filter: active ? 'drop-shadow(0 0 5px rgba(64,224,208,0.8))' : 'none' }}>{icon}</span>
    {label}
  </button>
)

const GlassCard = ({ children, title, icon }: { children: React.ReactNode, title?: string, icon?: string }) => (
  <div className="client-glass" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(64,224,208,0.3), transparent)' }} />
    {title && (
      <h3 className="font-bold" style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon && <span style={{ color: 'var(--brand-main)', textShadow: '0 0 10px var(--brand-main)' }}>{icon}</span>}
        {title}
      </h3>
    )}
    {children}
  </div>
)

const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)

export default function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState('teams') 
  
  // Real Supabase State
  const supabase = createClient()
  const [leagues, setLeagues] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [freeAgents, setFreeAgents] = useState<any[]>([])
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [toast, setToast] = useState<{ message: string, error?: boolean } | null>(null)

  // League Creation State
  const [showLeagueModal, setShowLeagueModal] = useState(false)
  const [newLeagueName, setNewLeagueName] = useState('')
  const [selectedLeagueAdminId, setSelectedLeagueAdminId] = useState('')
  const [creatingLeague, setCreatingLeague] = useState(false)

  // Team Creation Form State
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamEaClubId, setNewTeamEaClubId] = useState('')
  const [selectedCaptainId, setSelectedCaptainId] = useState('')
  const [newTeamLeagueId, setNewTeamLeagueId] = useState('')
  const [newTeamAbbreviation, setNewTeamAbbreviation] = useState('')
  const [newTeamStadium, setNewTeamStadium] = useState('')
  const [newTeamColor, setNewTeamColor] = useState('#40E0D0')
  const [newTeamLogoUrl, setNewTeamLogoUrl] = useState('')
  const [creatingTeam, setCreatingTeam] = useState(false)

  // Edit Team Form State
  const [showEditTeamModal, setShowEditTeamModal] = useState(false)
  const [editTeamId, setEditTeamId] = useState('')
  const [editTeamName, setEditTeamName] = useState('')
  const [editTeamEaClubId, setEditTeamEaClubId] = useState('')
  const [editTeamLeagueId, setEditTeamLeagueId] = useState('')
  const [editTeamCaptainId, setEditTeamCaptainId] = useState('')
  const [editTeamAbbreviation, setEditTeamAbbreviation] = useState('')
  const [editTeamStadium, setEditTeamStadium] = useState('')
  const [editTeamColor, setEditTeamColor] = useState('')
  const [editTeamLogoUrl, setEditTeamLogoUrl] = useState('')
  const [updatingTeam, setUpdatingTeam] = useState(false)

  // League Engine State
  const [showFixtureModal, setShowFixtureModal] = useState(false)
  const [newFixtureHome, setNewFixtureHome] = useState('')
  const [newFixtureAway, setNewFixtureAway] = useState('')
  const [newFixtureWeek, setNewFixtureWeek] = useState(1)
  const [creatingFixture, setCreatingFixture] = useState(false)

  // Score Entry State
  const [scoreModalMatchId, setScoreModalMatchId] = useState<string | null>(null)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [updatingScore, setUpdatingScore] = useState(false)

  const showToast = (message: string, error = false) => {
    setToast({ message, error })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchLeagues = async () => {
    const { data } = await supabase.from('leagues').select('*, admin:profiles!leagues_admin_id_fkey(username, ea_id)').order('created_at', { ascending: false })
    if (data) setLeagues(data)
  }

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setAllProfiles(data)
  }

  const fetchTeamsAndAgents = async () => {
    setLoadingData(true)
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select(`*, captain:profiles!teams_captain_id_fkey(username, ea_id), league:leagues!teams_league_id_fkey(name), profiles!profiles_team_id_fkey(id)`)
      .order('created_at', { ascending: false })
    if (!teamsError && teamsData) setTeams(teamsData)

    const { data: agentsData, error: agentsError } = await supabase.from('profiles').select('*').is('team_id', null)
    if (!agentsError && agentsData) setFreeAgents(agentsData)
    setLoadingData(false)
  }

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*, home:teams!matches_home_team_id_fkey(name), away:teams!matches_away_team_id_fkey(name)')
      .order('week', { ascending: false })
      .order('created_at', { ascending: false })
    if (data) setMatches(data)
  }

  useEffect(() => {
    if (activeTab === 'teams') {
      fetchLeagues()
      fetchTeamsAndAgents()
    } else if (activeTab === 'league') {
      fetchTeamsAndAgents()
      fetchMatches()
    } else if (activeTab === 'leagues_manage') {
      fetchLeagues()
      fetchProfiles()
    }
  }, [activeTab])

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeagueName) return

    setCreatingLeague(true)
    try {
      const { error } = await supabase.from('leagues').insert({
        name: newLeagueName,
        admin_id: selectedLeagueAdminId || null
      })
      if (error) throw error

      if (selectedLeagueAdminId) {
        await supabase.from('profiles').update({ role: 'league_admin' }).eq('id', selectedLeagueAdminId)
      }

      showToast(`Lig "${newLeagueName}" başarıyla oluşturuldu!`)
      setShowLeagueModal(false)
      setNewLeagueName('')
      setSelectedLeagueAdminId('')
      fetchLeagues()
    } catch (err: any) {
      showToast(err.message, true)
    } finally {
      setCreatingLeague(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName || !selectedCaptainId || !newTeamLeagueId || !newTeamAbbreviation) {
      showToast('Lütfen zorunlu alanları (Ad, Lig, Kaptan, Kısaltma) doldurun.', true)
      return
    }

    setCreatingTeam(true)
    try {
      const { data: newTeam, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: newTeamName,
          ea_club_id: newTeamEaClubId || null,
          captain_id: selectedCaptainId,
          league_id: newTeamLeagueId,
          abbreviation: newTeamAbbreviation.toUpperCase(),
          stadium_name: newTeamStadium || null,
          primary_color: newTeamColor,
          logo_url: newTeamLogoUrl || null
        })
        .select()
        .single()

      if (teamError) throw teamError

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          team_id: newTeam.id,
          role: 'captain'
        })
        .eq('id', selectedCaptainId)

      if (profileError) throw profileError

      showToast(`Kulüp "${newTeamName}" başarıyla kuruldu!`)
      setShowTeamModal(false)
      setNewTeamName('')
      setNewTeamEaClubId('')
      setSelectedCaptainId('')
      setNewTeamAbbreviation('')
      setNewTeamStadium('')
      fetchTeamsAndAgents() 

    } catch (err: any) {
      showToast(err.message || 'Kulüp oluşturulurken bir hata meydana geldi.', true)
    } finally {
      setCreatingTeam(false)
    }
  }

  const openEditTeamModal = (team: any) => {
    setEditTeamId(team.id)
    setEditTeamName(team.name)
    setEditTeamEaClubId(team.ea_club_id || '')
    setEditTeamLeagueId(team.league_id || '')
    setEditTeamCaptainId(team.captain_id || '')
    setEditTeamAbbreviation(team.abbreviation || '')
    setEditTeamStadium(team.stadium_name || '')
    setEditTeamColor(team.primary_color || '#40E0D0')
    setEditTeamLogoUrl(team.logo_url || '')
    setShowEditTeamModal(true)
  }

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTeamName || !editTeamLeagueId || !editTeamAbbreviation) {
      showToast('Lütfen zorunlu alanları doldurun.', true)
      return
    }

    setUpdatingTeam(true)
    try {
      const { error: teamError } = await supabase
        .from('teams')
        .update({
          name: editTeamName,
          ea_club_id: editTeamEaClubId || null,
          captain_id: editTeamCaptainId || null,
          league_id: editTeamLeagueId,
          abbreviation: editTeamAbbreviation.toUpperCase(),
          stadium_name: editTeamStadium || null,
          primary_color: editTeamColor,
          logo_url: editTeamLogoUrl || null
        })
        .eq('id', editTeamId)

      if (teamError) throw teamError

      if (editTeamCaptainId) {
        await supabase
          .from('profiles')
          .update({ team_id: editTeamId, role: 'captain' })
          .eq('id', editTeamCaptainId)
      }

      showToast(`Kulüp "${editTeamName}" başarıyla güncellendi!`)
      setShowEditTeamModal(false)
      fetchTeamsAndAgents() 

    } catch (err: any) {
      showToast(err.message || 'Kulüp güncellenirken bir hata meydana geldi.', true)
    } finally {
      setUpdatingTeam(false)
    }
  }

  const handleCreateFixture = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFixtureHome || !newFixtureAway || newFixtureHome === newFixtureAway) {
      showToast('Lütfen farklı iki takım seçin.', true)
      return
    }

    setCreatingFixture(true)
    try {
      const { error } = await supabase.from('matches').insert({
        home_team_id: newFixtureHome,
        away_team_id: newFixtureAway,
        week: newFixtureWeek,
        status: 'pending'
      })
      if (error) throw error

      showToast('Fikstür başarıyla eklendi!')
      setShowFixtureModal(false)
      fetchMatches()
    } catch (err: any) {
      showToast(err.message, true)
    } finally {
      setCreatingFixture(false)
    }
  }

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scoreModalMatchId) return

    setUpdatingScore(true)
    try {
      const { error } = await supabase.from('matches').update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'completed'
      }).eq('id', scoreModalMatchId)

      if (error) throw error

      showToast('Skor kaydedildi ve maç tamamlandı.')
      setScoreModalMatchId(null)
      fetchMatches()
    } catch (err: any) {
      showToast(err.message, true)
    } finally {
      setUpdatingScore(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'radial-gradient(ellipse at top, rgba(10,20,30,0.8) 0%, rgba(5,10,15,1) 100%)', color: '#fff' }}>
      
      {/* GLOBAL CSS FOR ADMIN */}
      <style>{`
        .admin-glow-btn {
          background: rgba(64, 224, 208, 0.1);
          border: 1px solid var(--brand-main);
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
          box-shadow: inset 0 0 10px rgba(64, 224, 208, 0.2);
        }
        .admin-glow-btn:hover {
          background: rgba(64, 224, 208, 0.2);
          box-shadow: 0 0 20px rgba(64, 224, 208, 0.6), inset 0 0 15px rgba(64, 224, 208, 0.4);
        }
        .admin-danger-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--accent-danger);
          color: var(--accent-danger);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }
        .admin-danger-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
          color: #fff;
        }
        .admin-input {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 12px 16px;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s;
          width: 100%;
        }
        .admin-input:focus {
          border-color: var(--brand-main);
          box-shadow: inset 0 0 10px rgba(64, 224, 208, 0.2);
        }
      `}</style>

      {/* SOL: KOMUTA MENÜSÜ */}
      <div style={{ width: '320px', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5,10,15,0.6)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Logo/Header */}
        <div style={{ padding: '40px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
          <h1 className="font-bold" style={{ fontSize: '2rem', margin: 0, textShadow: '0 0 20px rgba(64,224,208,0.5)' }}>
            TETA <span style={{ color: 'var(--brand-main)' }}>ADMIN</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '3px', marginTop: '8px' }}>KOMUTA MERKEZİ</p>
        </div>

        {/* Tabs */}
        <div style={{ padding: '24px 0', flex: 1 }}>
          <TabButton active={activeTab === 'overlord'} onClick={() => setActiveTab('overlord')} icon="📊" label="Overlord Paneli" />
          <TabButton active={activeTab === 'leagues_manage'} onClick={() => setActiveTab('leagues_manage')} icon="🌍" label="Lig Yönetimi" />
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon="👥" label="Oyuncu Yönetimi" />
          <TabButton active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} icon="🛡️" label="Kulüp Yönetimi" />
          <TabButton active={activeTab === 'league'} onClick={() => setActiveTab('league')} icon="🏆" label="Lig Motoru" />
          <TabButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon="💰" label="Transfer & Finans" />
          <TabButton active={activeTab === 'mod'} onClick={() => setActiveTab('mod')} icon="📡" label="Ağ Moderasyonu" />
        </div>

        {/* User Info */}
        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#111', boxShadow: '0 0 15px var(--brand-glow)' }}>O</div>
          <div>
            <div className="font-bold" style={{ fontSize: '1rem' }}>Overlord</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--brand-main)' }}>Sistem Yöneticisi</div>
          </div>
        </div>
      </div>

      {/* SAĞ: DİNAMİK OPERASYON ALANI */}
      <div style={{ flex: 1, padding: '60px 80px', overflowY: 'auto', position: 'relative' }}>
        
        {/* Arkaplan Ortam Işıması */}
        <div style={{ position: 'fixed', top: '20%', right: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(64, 224, 208, 0.05) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />

        <AnimatePresence mode="wait">
          
          {/* 1. OVERLORD PANELİ (DASHBOARD) */}
          {activeTab === 'overlord' && (
            <motion.div key="overlord-tab-main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 key="overlord-title" className="font-bold" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Sistem Durumu</h2>
              <p key="overlord-desc" className="text-muted" style={{ marginBottom: '40px' }}>Tüm Teta League sunucularının genel sağlık ve aktivite raporu.</p>

              <div key="overlord-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {[
                  { id: 'stat1', label: 'AKTİF OYUNCU', value: MOCK_STATS.activePlayers, color: 'var(--brand-main)' },
                  { id: 'stat2', label: 'OYNANAN MAÇ', value: MOCK_STATS.matchesPlayed, color: '#ff66ff' },
                  { id: 'stat3', label: 'BEKLEYEN ONAY', value: MOCK_STATS.pendingApprovals, color: 'var(--accent-warning)' },
                  { id: 'stat4', label: 'SİSTEM SAĞLIĞI', value: `%${MOCK_STATS.systemHealth}`, color: '#5de0a0' },
                ].map((stat, index) => (
                  <div key={`overlord-stat-${stat.id || index}`} className="client-glass" style={{ padding: '32px 24px', borderRadius: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div className="text-muted font-bold" style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '16px' }}>{stat.label}</div>
                    <div className="font-bold" style={{ fontSize: '3.5rem', color: stat.color, textShadow: `0 0 20px ${stat.color}80` }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div key="overlord-wide-cards" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <GlassCard key="overlord-economy" title="Ekonomi Hacmi" icon="💰">
                  <div className="font-bold" style={{ fontSize: '4rem', color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.4)', textAlign: 'center', padding: '40px 0' }}>
                    {formatCurrency(MOCK_STATS.totalBudget)}
                  </div>
                  <p className="text-muted" style={{ textAlign: 'center' }}>Ligde dönen toplam transfer ve maaş bütçesi.</p>
                </GlassCard>
                <GlassCard key="overlord-logs" title="Canlı Akış (Loglar)" icon="📡">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                    <div key="log1" style={{ fontSize: '0.9rem' }}><span style={{ color: 'var(--brand-main)' }}>[10:45]</span> Kullanıcı KeremAcar giriş yaptı.</div>
                    <div key="log2" style={{ fontSize: '0.9rem' }}><span style={{ color: 'var(--accent-warning)' }}>[10:42]</span> Yeni transfer teklifi oluşturuldu (Tr#002).</div>
                    <div key="log3" style={{ fontSize: '0.9rem' }}><span style={{ color: '#ff66ff' }}>[10:30]</span> Siber SK taktik diziliş güncelledi.</div>
                    <div key="log4" style={{ fontSize: '0.9rem' }}><span style={{ color: 'var(--brand-main)' }}>[09:15]</span> Sistem yedeği alındı.</div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {/* 2. LEAGUE MANAGEMENT */}
          {activeTab === 'leagues_manage' && (
            <motion.div key="leagues-manage-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                  <h2 className="font-bold" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Lig Yönetimi</h2>
                  <p className="text-muted">Ağ üzerinde aktif olan ligleri denetleyin ve yeni ligler inşa edin.</p>
                </div>
                <button 
                  onClick={() => setShowLeagueModal(true)} 
                  className="admin-glow-btn" 
                  style={{ padding: '16px 32px', fontSize: '1.1rem' }}
                >
                  + YENİ LİG KUR
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                {leagues.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Sistemde aktif lig bulunamadı.</div>
                ) : (
                  leagues.map((l, index) => (
                    <GlassCard key={l.id || `league-${index}`}>
                      <h3 className="font-bold" style={{ fontSize: '1.8rem', margin: 0, textShadow: '0 0 10px rgba(0,0,0,0.5)', marginBottom: '16px', color: '#fff' }}>{l.name}</h3>
                      <div className="text-muted font-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '4px' }}>LİG YÖNETİCİSİ</div>
                      <div className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-main)', marginBottom: '24px' }}>
                        {l.admin?.ea_id || l.admin?.username || 'Atanmadı'}
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="admin-glow-btn" style={{ flex: 1 }}>DETAYLAR</button>
                        <button className="admin-danger-btn" title="Sil">⚠️ Kapat</button>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* 3. TAKIM YÖNETİMİ (SUPABASE ENTEGRELİ) */}
          {activeTab === 'teams' && (
            <motion.div key="teams-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                  <h2 className="font-bold" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Kulüp Komuta Merkezi</h2>
                  <p className="text-muted">Supabase ağından takımları kur, yönet, EA ID eşleştir ve kaptanları onayla.</p>
                </div>
                <button 
                  onClick={() => setShowTeamModal(true)} 
                  className="admin-glow-btn" 
                  style={{ padding: '16px 32px', fontSize: '1.1rem' }}
                >
                  + YENİ KULÜP KUR
                </button>
              </div>

              {loadingData ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--brand-main)', fontWeight: 'bold' }}>SİSTEM VERİLERİ ÇEKİLİYOR...</div>
              ) : teams.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Ağda kayıtlı hiçbir kulüp bulunamadı.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                  {teams.map((t, index) => (
                    <GlassCard key={t.id || `team-${index}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                          <h3 className="font-bold" style={{ fontSize: '1.6rem', margin: 0, textShadow: `0 0 10px ${t.primary_color || '#40E0D0'}`, color: t.primary_color || '#fff' }}>
                            {t.name}
                          </h3>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>[{t.abbreviation || 'N/A'}] • {t.league?.name || 'Lig Yok'}</div>
                        </div>
                        {t.logo_url ? <img src={t.logo_url} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{(t.abbreviation || 'T').slice(0, 2)}</div>}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        <div>
                          <div className="text-muted font-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>KAPTAN (YÖNETİCİ)</div>
                          <div className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--brand-main)' }}>
                            {t.captain?.ea_id || t.captain?.username || 'Atanmadı'}
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <div className="text-muted font-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>STADYUM</div>
                            <div className="font-bold" style={{ fontSize: '1rem', color: '#fff' }}>{t.stadium_name || 'Bilinmiyor'}</div>
                          </div>
                          <div>
                            <div className="text-muted font-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>TAKIM DEĞERİ</div>
                            <div className="font-bold" style={{ fontSize: '1.1rem', color: '#ffd700' }}>Hesaplanıyor...</div>
                          </div>
                        </div>
                        {t.ea_club_id && (
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>EA CLUB ID: </span>
                            <span className="font-bold" style={{ fontSize: '0.9rem', color: '#5de0a0' }}>{t.ea_club_id}</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => openEditTeamModal(t)} className="admin-glow-btn" style={{ flex: 1, borderColor: t.primary_color || 'var(--brand-main)' }}>YÖNET</button>
                        <button className="admin-danger-btn" title="Puan Sil / Ceza">⚠️ CEZA</button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* 4. LİG MOTORU (SUPABASE ENTEGRELİ) */}
          {activeTab === 'league' && (
            <motion.div key="league-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="font-bold" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Lig ve Turnuva Motoru</h2>
              <p className="text-muted" style={{ marginBottom: '40px' }}>Fikstürleri belirle, maç sonuçlarını onayla ve lig tablosuna hükmet.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <GlassCard title="Aktif Fikstür / Maç Girişi" icon="⚔️">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                    {matches.length === 0 ? (
                      <div className="text-muted" style={{ textAlign: 'center', padding: '40px' }}>Ağda henüz fikstür bulunmuyor.</div>
                    ) : (
                      matches.map((m, index) => (
                        <div key={m.id || `match-${index}`} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${m.status === 'completed' ? 'rgba(93,224,160,0.3)' : 'rgba(255,255,255,0.05)'}`, padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>{m.home?.name}</div>
                          <div style={{ padding: '0 24px', textAlign: 'center' }}>
                            {m.status === 'completed' ? (
                              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#5de0a0', textShadow: '0 0 10px rgba(93,224,160,0.4)' }}>
                                {m.home_score} - {m.away_score}
                              </div>
                            ) : (
                              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--brand-main)' }}>VS</div>
                            )}
                            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>Hafta {m.week}</div>
                          </div>
                          <div style={{ flex: 1, textAlign: 'left', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>{m.away?.name}</div>
                          
                          <div style={{ marginLeft: '24px' }}>
                            <button 
                              onClick={() => {
                                setScoreModalMatchId(m.id)
                                setHomeScore(m.home_score || 0)
                                setAwayScore(m.away_score || 0)
                              }}
                              className="admin-glow-btn" 
                              style={{ background: m.status === 'completed' ? 'rgba(255,255,255,0.05)' : '', borderColor: m.status === 'completed' ? 'rgba(255,255,255,0.2)' : '' }}
                            >
                              {m.status === 'completed' ? 'GÜNCELLE' : 'SKOR GİR'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button onClick={() => setShowFixtureModal(true)} className="admin-glow-btn" style={{ width: '100%', marginTop: '24px', padding: '16px', background: 'transparent' }}>+ YENİ MAÇ OLUŞTUR</button>
                </GlassCard>

                <GlassCard title="Sistem Kontrolleri" icon="⚙️">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '20px', background: 'rgba(64,224,208,0.05)', border: '1px solid rgba(64,224,208,0.2)', borderRadius: '12px' }}>
                      <h4 className="font-bold" style={{ color: 'var(--brand-main)', marginBottom: '8px' }}>Lig Algoritması Devrede</h4>
                      <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>Girdiğiniz maç skorları, İstemci (Client) tarafındaki Lig Merkezi Puan Durumu ve Global Liderlik istatistiklerini anında (0 gecikme) etkileyecek şekilde Core Loop sistemine bağlıdır.</p>
                    </div>
                    <button className="admin-danger-btn" style={{ padding: '20px', textAlign: 'left', fontSize: '1.1rem' }}>Tüm Fikstürü ve İstatistikleri Sıfırla (Tehlikeli)</button>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEAGUE CREATION MODAL */}
        <AnimatePresence>
          {showLeagueModal && (
            <motion.div 
              key="league-creation-modal"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,15,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="client-glass"
                style={{ width: '100%', maxWidth: '500px', background: 'rgba(10,20,30,0.9)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(64,224,208,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}
              >
                <h2 className="font-bold" style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--brand-main)' }}>YENİ LİG KUR</h2>
                <p className="text-muted" style={{ marginBottom: '32px' }}>Teta League sistemine yeni bir organizasyon şemsiyesi ekleyin.</p>

                <form onSubmit={handleCreateLeague} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>LİG ADI</label>
                    <input type="text" required className="admin-input" value={newLeagueName} onChange={e => setNewLeagueName(e.target.value)} placeholder="Örn: Süper Lig" />
                  </div>

                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>LİG ADMİNİ ATAMASI</label>
                    <select 
                      className="admin-input" 
                      value={selectedLeagueAdminId} 
                      onChange={e => setSelectedLeagueAdminId(e.target.value)}
                      style={{ appearance: 'none', background: 'rgba(0,0,0,0.3) url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2340E0D0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 16px center', backgroundSize: '1em' }}
                    >
                      <option value="">(Admin Atanmadı - Opsiyonel)</option>
                      {allProfiles.map((p, i) => (
                        <option key={p.id || `profile-${i}`} value={p.id} style={{ background: '#0a141e' }}>
                          {p.ea_id || p.username || 'İsimsiz'} ({p.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <button type="submit" disabled={creatingLeague} className="admin-glow-btn" style={{ flex: 2, padding: '16px', fontSize: '1.1rem', letterSpacing: '1px' }}>
                      {creatingLeague ? 'ONAYLANIYOR...' : 'LİGİ OLUŞTUR'}
                    </button>
                    <button type="button" onClick={() => setShowLeagueModal(false)} className="admin-danger-btn" style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: 'transparent' }}>
                      İPTAL
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TEAM CREATION MODAL */}
        <AnimatePresence>
          {showTeamModal && (
            <motion.div 
              key="team-creation-modal"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,15,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="client-glass"
                style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(10,20,30,0.95)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(64,224,208,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(64,224,208,0.05)' }}
              >
                <h2 className="font-bold" style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--brand-main)', textShadow: '0 0 15px rgba(64,224,208,0.5)' }}>YENİ KULÜP KUR</h2>
                <p className="text-muted" style={{ marginBottom: '32px' }}>Supabase ağına lig hiyerarşisine bağlı yeni bir takım protokolü ekleniyor.</p>

                <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>KULÜP ADI *</label>
                      <input type="text" required className="admin-input" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Örn: Siber Espor Kulübü" />
                    </div>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>KISALTMA (MAX 3 HARF) *</label>
                      <input type="text" required maxLength={3} className="admin-input" value={newTeamAbbreviation} onChange={e => setNewTeamAbbreviation(e.target.value.toUpperCase())} placeholder="Örn: SIB" style={{ textTransform: 'uppercase' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>BAĞLI OLDUĞU LİG *</label>
                      <select required className="admin-input" value={newTeamLeagueId} onChange={e => setNewTeamLeagueId(e.target.value)} style={{ appearance: 'none', background: 'rgba(0,0,0,0.3) url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2340E0D0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 16px center', backgroundSize: '1em' }}>
                        <option value="" disabled>Lütfen bir lig seçin...</option>
                        {leagues.map((l, i) => <option key={l.id || `l-${i}`} value={l.id} style={{ background: '#0a141e' }}>{l.name}</option>)}
                      </select>
                      {leagues.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--accent-warning)', marginTop: '8px' }}>Önce Lig Yönetimi'nden bir lig oluşturmalısınız.</p>}
                    </div>

                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>KAPTAN ATAMASI *</label>
                      <select required className="admin-input" value={selectedCaptainId} onChange={e => setSelectedCaptainId(e.target.value)} style={{ appearance: 'none', background: 'rgba(0,0,0,0.3) url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2340E0D0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 16px center', backgroundSize: '1em' }}>
                        <option value="" disabled>Serbest oyunculardan seçin...</option>
                        {freeAgents.map((agent, i) => (
                          <option key={agent.id || `agent-${i}`} value={agent.id} style={{ background: '#0a141e' }}>
                            {agent.ea_id || agent.username || 'İsimsiz'} ({agent.main_position || 'Mevki Yok'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>STADYUM / ARENA</label>
                      <input type="text" className="admin-input" value={newTeamStadium} onChange={e => setNewTeamStadium(e.target.value)} placeholder="Örn: Siber Arena" />
                    </div>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>TEMA RENGİ</label>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input type="color" value={newTeamColor} onChange={e => setNewTeamColor(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: newTeamColor }}>{newTeamColor}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>LOGO URL (Opsiyonel)</label>
                    <input type="text" className="admin-input" value={newTeamLogoUrl} onChange={e => setNewTeamLogoUrl(e.target.value)} placeholder="https://..." />
                  </div>

                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>EA CLUB ID (Opsiyonel)</label>
                    <input type="text" className="admin-input" value={newTeamEaClubId} onChange={e => setNewTeamEaClubId(e.target.value)} placeholder="EA Pro Clubs Kulüp ID'si" />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <button type="submit" disabled={creatingTeam || leagues.length === 0} className="admin-glow-btn" style={{ flex: 2, padding: '16px', fontSize: '1.1rem', letterSpacing: '2px', opacity: (creatingTeam || leagues.length === 0) ? 0.5 : 1 }}>
                      {creatingTeam ? 'KURULUYOR...' : 'PROTOKOLÜ ONAYLA'}
                    </button>
                    <button type="button" onClick={() => setShowTeamModal(false)} className="admin-danger-btn" style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: 'transparent' }}>
                      İPTAL
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TEAM EDIT MODAL */}
        <AnimatePresence>
          {showEditTeamModal && (
            <motion.div 
              key="team-edit-modal"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,15,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="client-glass"
                style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(10,20,30,0.95)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(64,224,208,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(64,224,208,0.05)' }}
              >
                <h2 className="font-bold" style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--brand-main)', textShadow: '0 0 15px rgba(64,224,208,0.5)' }}>KULÜP DÜZENLE</h2>
                <p className="text-muted" style={{ marginBottom: '32px' }}>Takım protokolü verilerini güncelleyin.</p>

                <form onSubmit={handleUpdateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>KULÜP ADI *</label>
                      <input type="text" required className="admin-input" value={editTeamName} onChange={e => setEditTeamName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>KISALTMA (MAX 3 HARF) *</label>
                      <input type="text" required maxLength={3} className="admin-input" value={editTeamAbbreviation} onChange={e => setEditTeamAbbreviation(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>BAĞLI OLDUĞU LİG *</label>
                      <select required className="admin-input" value={editTeamLeagueId} onChange={e => setEditTeamLeagueId(e.target.value)} style={{ appearance: 'none', background: 'rgba(0,0,0,0.3) url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2340E0D0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 16px center', backgroundSize: '1em' }}>
                        {leagues.map((l, i) => <option key={l.id || `l-${i}`} value={l.id} style={{ background: '#0a141e' }}>{l.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>KAPTAN ATAMASI</label>
                      <select className="admin-input" value={editTeamCaptainId} onChange={e => setEditTeamCaptainId(e.target.value)} style={{ appearance: 'none', background: 'rgba(0,0,0,0.3) url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2340E0D0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 16px center', backgroundSize: '1em' }}>
                        <option value="">(Kaptan Yok)</option>
                        {teams.find(t => t.id === editTeamId)?.captain && (
                          <option value={teams.find(t => t.id === editTeamId)?.captain_id} style={{ background: '#0a141e' }}>
                            {teams.find(t => t.id === editTeamId)?.captain?.ea_id || teams.find(t => t.id === editTeamId)?.captain?.username} (Mevcut Kaptan)
                          </option>
                        )}
                        {freeAgents.map((agent, i) => (
                          <option key={agent.id || `agent-${i}`} value={agent.id} style={{ background: '#0a141e' }}>
                            {agent.ea_id || agent.username || 'İsimsiz'} ({agent.main_position || 'Mevki Yok'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>STADYUM / ARENA</label>
                      <input type="text" className="admin-input" value={editTeamStadium} onChange={e => setEditTeamStadium(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>TEMA RENGİ</label>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input type="color" value={editTeamColor} onChange={e => setEditTeamColor(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: editTeamColor }}>{editTeamColor}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>LOGO URL (Opsiyonel)</label>
                    <input type="text" className="admin-input" value={editTeamLogoUrl} onChange={e => setEditTeamLogoUrl(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>EA CLUB ID (Opsiyonel)</label>
                    <input type="text" className="admin-input" value={editTeamEaClubId} onChange={e => setEditTeamEaClubId(e.target.value)} />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <button type="submit" disabled={updatingTeam} className="admin-glow-btn" style={{ flex: 2, padding: '16px', fontSize: '1.1rem', letterSpacing: '2px', opacity: updatingTeam ? 0.5 : 1 }}>
                      {updatingTeam ? 'GÜNCELLENİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
                    </button>
                    <button type="button" onClick={() => setShowEditTeamModal(false)} className="admin-danger-btn" style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: 'transparent' }}>
                      İPTAL
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FIXTURE CREATION MODAL */}
        <AnimatePresence>
          {showFixtureModal && (
            <motion.div 
              key="fixture-creation-modal"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,15,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="client-glass"
                style={{ width: '100%', maxWidth: '500px', background: 'rgba(10,20,30,0.9)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(64,224,208,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}
              >
                <h2 className="font-bold" style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--brand-main)' }}>YENİ FİKSTÜR</h2>
                <p className="text-muted" style={{ marginBottom: '32px' }}>Ağ üzerinde yeni bir karşılaşma protokolü başlatın.</p>

                <form onSubmit={handleCreateFixture} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>EV SAHİBİ</label>
                    <select required className="admin-input" value={newFixtureHome} onChange={e => setNewFixtureHome(e.target.value)}>
                      <option value="" disabled>Takım Seçin...</option>
                      {teams.map((t, i) => <option key={t.id || `home-${i}`} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>DEPLASMAN</label>
                    <select required className="admin-input" value={newFixtureAway} onChange={e => setNewFixtureAway(e.target.value)}>
                      <option value="" disabled>Takım Seçin...</option>
                      {teams.map((t, i) => <option key={t.id || `away-${i}`} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-muted font-bold" style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>HAFTA</label>
                    <input type="number" min={1} max={38} required className="admin-input" value={newFixtureWeek} onChange={e => setNewFixtureWeek(Number(e.target.value))} />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <button type="submit" disabled={creatingFixture} className="admin-glow-btn" style={{ flex: 2, padding: '16px', fontSize: '1.1rem' }}>
                      {creatingFixture ? 'OLUŞTURULUYOR...' : 'ONAYLA'}
                    </button>
                    <button type="button" onClick={() => setShowFixtureModal(false)} className="admin-danger-btn" style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: 'transparent' }}>İPTAL</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCORE ENTRY MODAL */}
        <AnimatePresence>
          {scoreModalMatchId && (
            <motion.div 
              key="score-entry-modal"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,15,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="client-glass"
                style={{ width: '100%', maxWidth: '400px', background: 'rgba(10,20,30,0.9)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(64,224,208,0.2)' }}
              >
                <h2 className="font-bold" style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--brand-main)', textAlign: 'center' }}>SKOR GİRİŞİ</h2>
                <p className="text-muted" style={{ marginBottom: '32px', textAlign: 'center' }}>Maç sonucunu resmi olarak onayla.</p>

                <form onSubmit={handleUpdateScore} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                    <input type="number" min={0} required className="admin-input" style={{ width: '80px', fontSize: '2rem', textAlign: 'center', padding: '16px' }} value={homeScore} onChange={e => setHomeScore(Number(e.target.value))} />
                    <span className="font-bold" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>-</span>
                    <input type="number" min={0} required className="admin-input" style={{ width: '80px', fontSize: '2rem', textAlign: 'center', padding: '16px' }} value={awayScore} onChange={e => setAwayScore(Number(e.target.value))} />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <button type="submit" disabled={updatingScore} className="admin-glow-btn" style={{ flex: 2, padding: '16px', fontSize: '1.1rem' }}>
                      {updatingScore ? 'KAYDEDİLİYOR...' : 'SONUCU TESCİL ET'}
                    </button>
                    <button type="button" onClick={() => setScoreModalMatchId(null)} className="admin-danger-btn" style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: 'transparent' }}>İPTAL</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Siber Toast Message */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            key="toast-message"
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
