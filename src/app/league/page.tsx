'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Team { id: string; name: string; logo: string; league: string }
interface Match { id: string; home_team_id: string; away_team_id: string; home_score: number; away_score: number; week: number; is_completed: boolean }
interface Profile { id: string; username: string; ea_id: string; is_captain: boolean; team_id: string | null; main_position: string }
interface MatchStat { id?: string; match_id: string; team_id: string; player_id: string; goals: number; assists: number; clean_sheet: boolean; yellow_card: number; red_card: number; rating: number }

interface MatchStatForm { player_id: string; goals: string; assists: string; clean_sheet: boolean; yellow_card: string; red_card: string; rating: string }

export default function LeaguePage() {
  const supabase = createClient()
  
  const [activeTab, setActiveTab] = useState<'standings' | 'stats' | 'fixtures'>('standings')
  const [activeLeague, setActiveLeague] = useState<'Süper Lig' | '1. Lig'>('Süper Lig')
  
  // States
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [teamPlayers, setTeamPlayers] = useState<Profile[]>([])
  const [allStats, setAllStats] = useState<any[]>([]) // MOCK: Gerçek uygulamada veritabanından çekilecek genel istatistik verisi.
  
  // Stats Tab States
  const [statCategory, setStatCategory] = useState<'GOL' | 'ASİST' | 'CLEAN_SHEET' | 'REYTING' | 'MVP'>('GOL')
  const [positionFilter, setPositionFilter] = useState<'TÜMÜ' | 'KALECİ' | 'DEFANS' | 'ORTASAHA' | 'HÜCUM'>('TÜMÜ')
  const minMatchesThreshold = 3

  // Fixture Tab States
  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null)
  const [statsForm, setStatsForm] = useState<Record<string, MatchStatForm>>({})
  const [savingStats, setSavingStats] = useState(false)
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null)

  const showToast = (message: string, error = false) => {
    setToast({ message, error })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (profileData) {
          setUserProfile(profileData)
          if (profileData.is_captain && profileData.team_id) {
            const { data: players } = await supabase.from('profiles').select('*').eq('team_id', profileData.team_id)
            if (players) setTeamPlayers(players)
          }
        }
      }

      const { data: teamsData } = await supabase.from('teams').select('*')
      if (teamsData) setTeams(teamsData)

      const { data: matchesData } = await supabase.from('matches').select('*').order('week', { ascending: true })
      if (matchesData) setMatches(matchesData)
        
      // TODO: Fetch match_stats joining profiles for the Stats Tab. MOCK data for now to demonstrate layout.
      setAllStats([
        { player_id: '1', name: 'Kral10', team: 'Anadolu FK', goals: 12, assists: 4, cs: 0, matches_played: 5, rating: 8.7, pos: 'HÜCUM' },
        { player_id: '2', name: 'DefansBakanı', team: 'Siber SK', goals: 1, assists: 0, cs: 4, matches_played: 4, rating: 7.9, pos: 'DEFANS' },
        { player_id: '3', name: 'Goleador', team: 'Bozkuşlar', goals: 9, assists: 2, cs: 0, matches_played: 5, rating: 8.2, pos: 'HÜCUM' },
        { player_id: '4', name: 'YeniTransfer', team: 'Kartal ES', goals: 2, assists: 1, cs: 0, matches_played: 2, rating: 9.1, pos: 'ORTASAHA' }, // Played < 3 matches
      ])
    }
    fetchData()
  }, [supabase])

  // --- İKİLİ AVERAJ ALGORİTMASIYLA PUAN DURUMU ---
  const standings = useMemo(() => {
    if (!teams.length || !matches.length) return []

    const table: Record<string, any> = {}
    teams.filter(t => t.league === activeLeague).forEach(t => {
      table[t.id] = { id: t.id, name: t.name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }
    })

    const completedLeagueMatches = matches.filter(m => m.is_completed && table[m.home_team_id] && table[m.away_team_id])
    
    completedLeagueMatches.forEach(m => {
      const home = table[m.home_team_id]; const away = table[m.away_team_id];
      home.played++; away.played++;
      home.goalsFor += m.home_score; home.goalsAgainst += m.away_score;
      away.goalsFor += m.away_score; away.goalsAgainst += m.home_score;

      if (m.home_score > m.away_score) { home.won++; home.points += 5; away.lost++; away.points -= 1; }
      else if (m.home_score < m.away_score) { away.won++; away.points += 5; home.lost++; home.points -= 1; }
      else { home.drawn++; home.points += 1; away.drawn++; away.points += 1; }
    })

    const sortedTable = Object.values(table).map(t => ({ ...t, goalDifference: t.goalsFor - t.goalsAgainst })).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      
      // İkili Averaj (Head-to-Head)
      const h2hMatches = completedLeagueMatches.filter(m => 
        (m.home_team_id === a.id && m.away_team_id === b.id) || 
        (m.home_team_id === b.id && m.away_team_id === a.id)
      )
      
      let aH2hPts = 0, bH2hPts = 0
      h2hMatches.forEach(m => {
        if (m.home_team_id === a.id) {
          if (m.home_score > m.away_score) aH2hPts += 3; else if (m.home_score < m.away_score) bH2hPts += 3; else { aH2hPts++; bH2hPts++; }
        } else {
          if (m.away_score > m.home_score) aH2hPts += 3; else if (m.away_score < m.home_score) bH2hPts += 3; else { aH2hPts++; bH2hPts++; }
        }
      })
      
      if (aH2hPts !== bH2hPts) return bH2hPts - aH2hPts
      
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    return sortedTable
  }, [teams, matches, activeLeague])

  // --- STATS FILTERING ---
  const filteredStats = useMemo(() => {
    let sorted = [...allStats]
    
    // Threshold Check for Reyting & MVP
    if (statCategory === 'REYTING' || statCategory === 'MVP') {
      sorted = sorted.filter(s => s.matches_played >= minMatchesThreshold)
    }
    
    // Position Check for MVP
    if (statCategory === 'MVP' && positionFilter !== 'TÜMÜ') {
      sorted = sorted.filter(s => s.pos === positionFilter)
    }

    if (statCategory === 'GOL') sorted.sort((a,b) => b.goals - a.goals)
    else if (statCategory === 'ASİST') sorted.sort((a,b) => b.assists - a.assists)
    else if (statCategory === 'CLEAN_SHEET') sorted.sort((a,b) => b.cs - a.cs)
    else sorted.sort((a,b) => b.rating - a.rating) // Both Reyting & MVP sort by rating primarily

    return sorted
  }, [allStats, statCategory, positionFilter])

  // --- CAPTAIN FORM ---
  const toggleMatchForm = (matchId: string) => {
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null)
    } else {
      setExpandedMatchId(matchId)
      // Formu temizle
      const initialForm: Record<string, MatchStatForm> = {}
      teamPlayers.forEach(p => {
        initialForm[p.id] = { player_id: p.id, goals: '', assists: '', clean_sheet: false, yellow_card: '', red_card: '', rating: '' }
      })
      setStatsForm(initialForm)
    }
  }

  const handleStatChange = (playerId: string, field: keyof MatchStatForm, value: any) => {
    setStatsForm(prev => ({ ...prev, [playerId]: { ...prev[playerId], [field]: value } }))
  }

  const submitStats = async (matchId: string) => {
    if (!userProfile?.team_id) return
    setSavingStats(true)

    // Sadece "Rating" girilmiş veya "Goal" girilmiş gibi en az 1 istatistiği dolu olan oyuncuları filtrele
    // Boş satırlar oynamadı sayılır.
    const statsToInsert = Object.values(statsForm).filter(s => s.rating !== '' || s.goals !== '' || s.assists !== '').map(stat => ({
      match_id: matchId,
      team_id: userProfile.team_id,
      player_id: stat.player_id,
      goals: parseInt(stat.goals) || 0,
      assists: parseInt(stat.assists) || 0,
      clean_sheet: stat.clean_sheet,
      yellow_card: parseInt(stat.yellow_card) || 0,
      red_card: parseInt(stat.red_card) || 0,
      rating: parseFloat(stat.rating) || 0.0
    }))

    if (statsToInsert.length === 0) {
      showToast('Gönderilecek istatistik bulunamadı. Lütfen en az bir oyuncunun verisini girin.', true)
      setSavingStats(false)
      return
    }

    const { error } = await supabase.from('match_stats').upsert(statsToInsert, { onConflict: 'match_id, player_id' })
    
    setSavingStats(false)
    if (error) {
      showToast('Hata: ' + error.message, true)
    } else {
      showToast('İstatistikler başarıyla sisteme aktarıldı.')
      setExpandedMatchId(null) // Formu kapat
    }
  }

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Bilinmeyen Takım'

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* HEADER & TOGGLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="font-bold" style={{ fontSize: '2.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>Lig Merkezi</h1>
        
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={() => setActiveLeague('Süper Lig')}
            style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: activeLeague === 'Süper Lig' ? 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
          >SÜPER LİG</button>
          <button 
            onClick={() => setActiveLeague('1. Lig')}
            style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: activeLeague === '1. Lig' ? 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
          >1. LİG</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
        {[
          { id: 'standings', label: 'PUAN DURUMU' },
          { id: 'stats', label: 'İSTATİSTİKLER' },
          { id: 'fixtures', label: 'FİKSTÜR & SONUÇLAR' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="flat-button"
            style={{ background: activeTab === tab.id ? 'rgba(217, 119, 95, 0.15)' : 'transparent', borderColor: activeTab === tab.id ? 'var(--brand-main)' : 'transparent', color: activeTab === tab.id ? 'var(--brand-light)' : 'var(--text-muted)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ===================== STANDINGS TAB ===================== */}
        {activeTab === 'standings' && (
          <motion.div key="standings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <div className="game-panel" style={{ padding: '32px' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px' }}>
                  <thead>
                    <tr className="text-subtle" style={{ fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '16px 8px', textAlign: 'left' }}>Sıra</th>
                      <th style={{ padding: '16px 8px', textAlign: 'left' }}>Takım</th>
                      <th style={{ padding: '16px 8px' }}>O</th>
                      <th style={{ padding: '16px 8px' }}>G</th>
                      <th style={{ padding: '16px 8px' }}>B</th>
                      <th style={{ padding: '16px 8px' }}>M</th>
                      <th style={{ padding: '16px 8px' }}>AG</th>
                      <th style={{ padding: '16px 8px' }}>YG</th>
                      <th style={{ padding: '16px 8px' }}>AV</th>
                      <th style={{ padding: '16px 8px', color: 'var(--brand-main)' }}>Puan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.length > 0 ? standings.map((team, index) => (
                      <tr key={team.id} className="interactive" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td className="font-bold text-muted" style={{ padding: '16px 8px', textAlign: 'left' }}>{index + 1}</td>
                        <td style={{ padding: '16px 8px', textAlign: 'left', fontWeight: '600' }}>{team.name}</td>
                        <td className="text-muted" style={{ padding: '16px 8px' }}>{team.played}</td>
                        <td style={{ padding: '16px 8px', color: '#5de0a0' }}>{team.won}</td>
                        <td className="text-muted" style={{ padding: '16px 8px' }}>{team.drawn}</td>
                        <td style={{ padding: '16px 8px', color: 'var(--accent-danger)' }}>{team.lost}</td>
                        <td className="text-muted" style={{ padding: '16px 8px' }}>{team.goalsFor}</td>
                        <td className="text-muted" style={{ padding: '16px 8px' }}>{team.goalsAgainst}</td>
                        <td style={{ padding: '16px 8px', color: team.goalDifference > 0 ? '#5de0a0' : (team.goalDifference < 0 ? 'var(--accent-danger)' : 'var(--text-muted)') }}>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                        <td className="font-bold" style={{ padding: '16px 8px', fontSize: '1.2rem', color: 'var(--brand-light)' }}>{team.points}</td>
                      </tr>
                    )) : <tr><td colSpan={10} className="text-muted" style={{ padding: '40px' }}>Hesaplanmış veri bulunamadı.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===================== STATS TAB ===================== */}
        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '12px' }}>
              {(['GOL', 'ASİST', 'CLEAN_SHEET', 'REYTING', 'MVP'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setStatCategory(tab)}
                  style={{ flex: 1, padding: '12px', background: statCategory === tab ? 'var(--panel-hover)' : 'transparent', border: 'none', borderRadius: '8px', color: statCategory === tab ? 'var(--brand-light)' : 'var(--text-muted)', fontWeight: statCategory === tab ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                >
                  {tab === 'CLEAN_SHEET' ? 'CLEAN SHEET' : tab === 'REYTING' ? 'ORTALAMA REYTİNG' : tab === 'MVP' ? 'EN İYİ OYUNCULAR' : `${tab} KRALLIĞI`}
                </button>
              ))}
            </div>

            <div className="game-panel" style={{ padding: '32px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                {(statCategory === 'REYTING' || statCategory === 'MVP') && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--brand-main)', padding: '6px 12px', background: 'rgba(217, 119, 95, 0.1)', borderRadius: '6px', border: '1px solid rgba(217, 119, 95, 0.2)' }}>
                    ⚠️ Listeye girmek için min. {minMatchesThreshold} maç oynanmalıdır.
                  </span>
                )}
                {statCategory === 'MVP' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['TÜMÜ', 'KALECİ', 'DEFANS', 'ORTASAHA', 'HÜCUM'] as const).map(pos => (
                      <button key={pos} onClick={() => setPositionFilter(pos)} className="flat-button" style={{ padding: '6px 12px', fontSize: '0.75rem', background: positionFilter === pos ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                        {pos}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredStats.map((stat, i) => (
                  <div key={stat.player_id} className="interactive" style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <span className="font-bold text-muted" style={{ width: '40px', fontSize: '1.2rem' }}>{i + 1}</span>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', marginRight: '24px' }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="font-bold" style={{ fontSize: '1.1rem' }}>{stat.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.85rem' }}>{stat.team} • {stat.pos}</div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>MAÇ</div>
                        <div className="font-bold">{stat.matches_played}</div>
                      </div>
                      <div style={{ textAlign: 'center', width: '60px' }}>
                        <div className="text-subtle" style={{ fontSize: '0.7rem' }}>
                          {statCategory === 'GOL' ? 'GOL' : statCategory === 'ASİST' ? 'ASİST' : statCategory === 'CLEAN_SHEET' ? 'CS' : 'RTG'}
                        </div>
                        <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--brand-light)' }}>
                          {statCategory === 'GOL' ? stat.goals : statCategory === 'ASİST' ? stat.assists : statCategory === 'CLEAN_SHEET' ? stat.cs : stat.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredStats.length === 0 && <div className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>Kritere uyan istatistik bulunamadı.</div>}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===================== FIXTURES & CAPTAIN TAB ===================== */}
        {activeTab === 'fixtures' && (
          <motion.div key="fixtures" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <select className="flat-input" style={{ width: '200px' }} value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))}>
                {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>Hafta {i+1}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {matches.filter(m => m.week === selectedWeek).map(match => {
                const isMyTeam = userProfile?.team_id === match.home_team_id || userProfile?.team_id === match.away_team_id;
                const canEnterStats = userProfile?.is_captain && isMyTeam;

                return (
                  <div key={match.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    <div className="game-panel interactive" style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                        <span className="font-bold" style={{ fontSize: '1.2rem' }}>{getTeamName(match.home_team_id)}</span>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                      </div>
                      
                      <div style={{ margin: '0 40px', textAlign: 'center' }}>
                        <div className="text-muted font-bold" style={{ fontSize: '0.7rem', marginBottom: '8px', letterSpacing: '1px' }}>{match.is_completed ? 'MAÇ SONUCU' : 'YAKLAŞAN MAÇ'}</div>
                        {match.is_completed ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span className="font-bold" style={{ fontSize: '2.5rem', color: 'var(--brand-light)' }}>{match.home_score}</span>
                            <span className="text-subtle">-</span>
                            <span className="font-bold" style={{ fontSize: '2.5rem', color: 'var(--brand-light)' }}>{match.away_score}</span>
                          </div>
                        ) : (
                          <div className="font-bold text-muted" style={{ fontSize: '1.5rem' }}>VS</div>
                        )}
                      </div>

                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '24px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                        <span className="font-bold" style={{ fontSize: '1.2rem' }}>{getTeamName(match.away_team_id)}</span>
                      </div>
                      
                      {/* Kaptan Butonu */}
                      {canEnterStats && (
                        <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)' }}>
                          <button onClick={() => toggleMatchForm(match.id)} className="flat-button primary" style={{ padding: '8px 16px', fontSize: '0.8rem', boxShadow: '0 0 15px var(--brand-glow)' }}>
                            {expandedMatchId === match.id ? 'İPTAL ET' : 'İSTATİSTİKLERİ GİR'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Accordion Stats Form */}
                    <AnimatePresence>
                      {expandedMatchId === match.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          <div className="game-panel" style={{ padding: '32px', background: 'rgba(217, 119, 95, 0.05)', border: '1px solid rgba(217, 119, 95, 0.2)' }}>
                            <h3 className="font-bold" style={{ fontSize: '1.1rem', marginBottom: '24px', color: 'var(--brand-light)' }}>Takım İstatistik Veri Girişi</h3>
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px' }}>
                                <thead>
                                  <tr className="text-subtle" style={{ fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>OYUNCU</th>
                                    <th style={{ padding: '12px 8px', width: '90px' }}>GOL</th>
                                    <th style={{ padding: '12px 8px', width: '90px' }}>ASİST</th>
                                    <th style={{ padding: '12px 8px', width: '110px' }}>RTG (örn: 8.5)</th>
                                    <th style={{ padding: '12px 8px', width: '70px', color: '#ffb800' }}>S. KART</th>
                                    <th style={{ padding: '12px 8px', width: '70px', color: 'var(--accent-danger)' }}>K. KART</th>
                                    <th style={{ padding: '12px 8px', width: '90px' }}>C. SHEET</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {teamPlayers.map(player => {
                                    const stat = statsForm[player.id] || { player_id: player.id, goals: '', assists: '', clean_sheet: false, yellow_card: '', red_card: '', rating: '' };
                                    return (
                                      <tr key={player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500' }}>
                                          {player.ea_id || player.username} <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>{player.main_position}</span>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}><input type="number" min={0} className="flat-input" style={{ padding: '6px', textAlign: 'center' }} value={stat.goals} onChange={(e) => handleStatChange(player.id, 'goals', e.target.value)} placeholder="-" /></td>
                                        <td style={{ padding: '12px 8px' }}><input type="number" min={0} className="flat-input" style={{ padding: '6px', textAlign: 'center' }} value={stat.assists} onChange={(e) => handleStatChange(player.id, 'assists', e.target.value)} placeholder="-" /></td>
                                        <td style={{ padding: '12px 8px' }}><input type="number" step="0.1" min={0} max={10} className="flat-input" style={{ padding: '6px', textAlign: 'center', color: 'var(--brand-light)' }} value={stat.rating} onChange={(e) => handleStatChange(player.id, 'rating', e.target.value)} placeholder="-" /></td>
                                        <td style={{ padding: '12px 8px' }}><input type="number" min={0} max={2} className="flat-input" style={{ padding: '6px', textAlign: 'center' }} value={stat.yellow_card} onChange={(e) => handleStatChange(player.id, 'yellow_card', e.target.value)} placeholder="-" /></td>
                                        <td style={{ padding: '12px 8px' }}><input type="number" min={0} max={1} className="flat-input" style={{ padding: '6px', textAlign: 'center' }} value={stat.red_card} onChange={(e) => handleStatChange(player.id, 'red_card', e.target.value)} placeholder="-" /></td>
                                        <td style={{ padding: '12px 8px' }}><input type="checkbox" checked={stat.clean_sheet} onChange={(e) => handleStatChange(player.id, 'clean_sheet', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--brand-main)' }} /></td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                              <span className="text-muted" style={{ fontSize: '0.85rem' }}>İstatistiği boş bırakılan oyuncular maçta oynamadı sayılır.</span>
                              <button onClick={() => submitStats(match.id)} disabled={savingStats} className="flat-button primary" style={{ padding: '12px 32px' }}>
                                {savingStats ? 'KAYDEDİLİYOR...' : 'VERİLERİ SİSTEME YÜKLE'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '40px', right: '40px', background: toast.error ? 'rgba(255, 59, 48, 0.9)' : 'rgba(217, 119, 95, 0.9)', padding: '16px 24px', color: '#fff', borderRadius: '8px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: 'bold' }}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
