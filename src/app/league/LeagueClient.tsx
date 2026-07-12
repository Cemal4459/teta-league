'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface MatchStatForm { player_id: string; goals: string; assists: string; clean_sheet: boolean; rating: string }

export default function LeagueClient({ userProfile, teamPlayers, leagues, teams, matches, allStats }: any) {
  const supabase = createClient()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'standings' | 'stats' | 'fixtures'>('standings')
  const [activeLeagueId, setActiveLeagueId] = useState<string>(leagues.length > 0 ? leagues[0].id : '')
  
  const [statCategory, setStatCategory] = useState<'GOL' | 'ASİST' | 'CLEAN_SHEET' | 'REYTING' | 'MVP'>('GOL')
  const [positionFilter, setPositionFilter] = useState<'TÜMÜ' | 'KALECİ' | 'DEFANS' | 'ORTASAHA' | 'HÜCUM'>('TÜMÜ')
  const minMatchesThreshold = 3

  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null)
  const [statsForm, setStatsForm] = useState<Record<string, MatchStatForm>>({})
  const [savingStats, setSavingStats] = useState(false)
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null)

  const showToast = (message: string, error = false) => {
    setToast({ message, error })
    setTimeout(() => setToast(null), 3000)
  }

  // --- DERIVED DATA BASING ON ACTIVE LEAGUE ---

  const activeTeams = useMemo(() => {
    return teams.filter((t: any) => t.league_id === activeLeagueId)
  }, [teams, activeLeagueId])

  const activeTeamIds = useMemo(() => new Set(activeTeams.map((t: any) => t.id)), [activeTeams])

  const activeMatches = useMemo(() => {
    return matches.filter((m: any) => activeTeamIds.has(m.home_team_id) || activeTeamIds.has(m.away_team_id))
  }, [matches, activeTeamIds])

  // Statlarda takım abbrevation/adı bulunduğundan, aktif takımların ad/abbrevation listesi üzerinden filtreleyebiliriz (veya tümünü gösterebiliriz)
  // Şimdilik istatistiklerde tüm ligleri gösteriyoruz, oyuncular ligler arası serbest veya karışık olabilir.

  const standings = useMemo(() => {
    if (!activeTeams.length) return []

    const table: Record<string, any> = {}
    activeTeams.forEach((t: any) => {
      table[t.id] = { id: t.id, name: t.name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }
    })

    const completedLeagueMatches = activeMatches.filter((m: any) => m.status === 'completed' && table[m.home_team_id] && table[m.away_team_id])
    
    completedLeagueMatches.forEach((m: any) => {
      const home = table[m.home_team_id]; const away = table[m.away_team_id];
      home.played++; away.played++;
      home.goalsFor += m.home_score; home.goalsAgainst += m.away_score;
      away.goalsFor += m.away_score; away.goalsAgainst += m.home_score;

      if (m.home_score > m.away_score) { home.won++; home.points += 3; away.lost++; }
      else if (m.home_score < m.away_score) { away.won++; away.points += 3; home.lost++; }
      else { home.drawn++; home.points += 1; away.drawn++; away.points += 1; }
    })

    return Object.values(table).map(t => ({ ...t, goalDifference: t.goalsFor - t.goalsAgainst })).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })
  }, [activeTeams, activeMatches])

  const filteredStats = useMemo(() => {
    let sorted = [...allStats]
    
    if (statCategory === 'REYTING' || statCategory === 'MVP') {
      sorted = sorted.filter(s => s.matches_played >= minMatchesThreshold)
    }
    
    if (statCategory === 'MVP' && positionFilter !== 'TÜMÜ') {
      sorted = sorted.filter(s => s.pos === positionFilter)
    }

    if (statCategory === 'GOL') sorted.sort((a,b) => b.goals - a.goals)
    else if (statCategory === 'ASİST') sorted.sort((a,b) => b.assists - a.assists)
    else if (statCategory === 'CLEAN_SHEET') sorted.sort((a,b) => b.cs - a.cs)
    else sorted.sort((a,b) => b.rating - a.rating)

    return sorted
  }, [allStats, statCategory, positionFilter])

  const toggleMatchForm = (matchId: string) => {
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null)
    } else {
      setExpandedMatchId(matchId)
      const initialForm: Record<string, MatchStatForm> = {}
      teamPlayers.forEach((p: any) => {
        initialForm[p.id] = { player_id: p.id, goals: '', assists: '', clean_sheet: false, rating: '' }
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

    const statsToInsert = Object.values(statsForm).filter(s => s.rating !== '' || s.goals !== '' || s.assists !== '').map(stat => ({
      match_id: matchId,
      team_id: userProfile.team_id,
      player_id: stat.player_id,
      goals: parseInt(stat.goals) || 0,
      assists: parseInt(stat.assists) || 0,
      clean_sheet: stat.clean_sheet,
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
      setExpandedMatchId(null)
      router.refresh() // Soft refresh to trigger Server Component refetch
    }
  }

  const getTeamName = (id: string) => teams.find((t: any) => t.id === id)?.name || 'Bilinmeyen Takım'

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '40px', paddingRight: '40px' }}>
      
      {/* HEADER & LEAGUE SELECTOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h1 className="font-bold" style={{ fontSize: '3rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>LİG MERKEZİ</h1>
        
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '4px' }}>
          {leagues.length === 0 ? (
            <div className="text-muted" style={{ padding: '10px 24px' }}>Lig Bulunamadı</div>
          ) : (
            leagues.map((l: any) => (
              <button 
                key={l.id}
                onClick={() => setActiveLeagueId(l.id)}
                style={{ 
                  padding: '10px 24px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: activeLeagueId === l.id ? 'rgba(64, 224, 208, 0.1)' : 'transparent', 
                  color: activeLeagueId === l.id ? 'var(--brand-main)' : 'var(--text-muted)', 
                  textShadow: activeLeagueId === l.id ? '0 0 10px rgba(64, 224, 208, 0.5)' : 'none', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s' 
                }}
              >
                {l.name.toUpperCase()}
              </button>
            ))
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0' }}>
        {[
          { id: 'standings', label: 'PUAN DURUMU' },
          { id: 'stats', label: 'İSTATİSTİKLER' },
          { id: 'fixtures', label: 'FİKSTÜR & SONUÇLAR' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              padding: '0 0 16px 0',
              borderBottom: activeTab === tab.id ? '2px solid var(--brand-main)' : '2px solid transparent', 
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)', 
              fontWeight: 'bold',
              textShadow: activeTab === tab.id ? '0 0 15px rgba(64, 224, 208, 0.5)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ===================== STANDINGS TAB ===================== */}
        {activeTab === 'standings' && (
          <motion.div key="standings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <div className="client-glass" style={{ padding: '40px', borderRadius: '24px' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ fontSize: '0.85rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '16px 8px', textAlign: 'left', color: 'var(--brand-main)' }}>Sıra</th>
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
                      <tr 
                        key={team.id} 
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'all 0.2s', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(64, 224, 208, 0.05)'; e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(64, 224, 208, 0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <td className="font-bold text-muted" style={{ padding: '16px 8px', textAlign: 'left' }}>{index + 1}</td>
                        <td style={{ padding: '16px 8px', textAlign: 'left', fontWeight: 'bold' }}>{team.name}</td>
                        <td className="text-muted" style={{ padding: '16px 8px' }}>{team.played}</td>
                        <td style={{ padding: '16px 8px', color: '#5de0a0' }}>{team.won}</td>
                        <td className="text-muted" style={{ padding: '16px 8px' }}>{team.drawn}</td>
                        <td style={{ padding: '16px 8px', color: 'var(--accent-danger)' }}>{team.lost}</td>
                        <td className="text-muted" style={{ padding: '16px 8px' }}>{team.goalsFor}</td>
                        <td className="text-muted" style={{ padding: '16px 8px' }}>{team.goalsAgainst}</td>
                        <td style={{ padding: '16px 8px', color: team.goalDifference > 0 ? '#5de0a0' : (team.goalDifference < 0 ? 'var(--accent-danger)' : 'var(--text-muted)') }}>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                        <td className="font-bold" style={{ padding: '16px 8px', fontSize: '1.2rem', color: 'var(--brand-light)', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>{team.points}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={10} style={{ padding: '80px', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15rem', opacity: 0.02, pointerEvents: 'none', filter: 'blur(5px)' }}>
                            T
                          </div>
                          <div className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>Bu lige ait takım bulunamadı.</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===================== STATS TAB ===================== */}
        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '16px' }}>
              {(['GOL', 'ASİST', 'CLEAN_SHEET', 'REYTING', 'MVP'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setStatCategory(tab)}
                  style={{ flex: 1, padding: '12px', background: statCategory === tab ? 'rgba(64, 224, 208, 0.1)' : 'transparent', border: 'none', borderRadius: '12px', color: statCategory === tab ? 'var(--brand-main)' : 'var(--text-muted)', fontWeight: statCategory === tab ? 'bold' : 'normal', textShadow: statCategory === tab ? '0 0 10px rgba(64, 224, 208, 0.5)' : 'none', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                >
                  {tab === 'CLEAN_SHEET' ? 'CLEAN SHEET' : tab === 'REYTING' ? 'ORTALAMA REYTİNG' : tab === 'MVP' ? 'EN İYİ OYUNCULAR' : `${tab} KRALLIĞI`}
                </button>
              ))}
            </div>

            <div className="client-glass" style={{ padding: '40px', borderRadius: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                {(statCategory === 'REYTING' || statCategory === 'MVP') ? (
                  <span style={{ fontSize: '0.85rem', color: 'var(--brand-main)', padding: '8px 16px', background: 'rgba(64, 224, 208, 0.1)', borderRadius: '8px', border: '1px solid rgba(64, 224, 208, 0.2)' }}>
                    ⚠️ Listeye girmek için min. {minMatchesThreshold} maç oynanmalıdır.
                  </span>
                ) : <div />}
                
                {statCategory === 'MVP' && (
                  <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
                    {(['TÜMÜ', 'KALECİ', 'DEFANS', 'ORTASAHA', 'HÜCUM'] as const).map(pos => (
                      <button key={pos} onClick={() => setPositionFilter(pos)} style={{ padding: '8px 16px', fontSize: '0.8rem', background: positionFilter === pos ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: positionFilter === pos ? '#fff' : 'var(--text-muted)', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>
                        {pos}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredStats.map((stat, i) => (
                  <div 
                    key={stat.player_id} 
                    style={{ display: 'flex', alignItems: 'center', padding: '20px 32px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(64, 224, 208, 0.05)'; e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(64, 224, 208, 0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <span className="font-bold" style={{ width: '40px', fontSize: '1.4rem', color: i < 3 ? 'var(--brand-main)' : 'var(--text-muted)', textShadow: i < 3 ? '0 0 10px rgba(64, 224, 208, 0.5)' : 'none' }}>{i + 1}</span>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)', marginRight: '24px' }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="font-bold" style={{ fontSize: '1.2rem', color: '#fff' }}>{stat.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}><span style={{ color: 'var(--brand-main)' }}>{stat.team}</span> • {stat.pos}</div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>MAÇ</div>
                        <div className="font-bold" style={{ fontSize: '1.1rem' }}>{stat.matches_played}</div>
                      </div>
                      <div style={{ textAlign: 'center', width: '80px' }}>
                        <div className="text-subtle" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--brand-main)' }}>
                          {statCategory === 'GOL' ? 'GOL' : statCategory === 'ASİST' ? 'ASİST' : statCategory === 'CLEAN_SHEET' ? 'CS' : 'RTG'}
                        </div>
                        <div className="font-bold" style={{ fontSize: '1.8rem', color: 'var(--brand-light)', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                          {statCategory === 'GOL' ? stat.goals : statCategory === 'ASİST' ? stat.assists : statCategory === 'CLEAN_SHEET' ? stat.cs : stat.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredStats.length === 0 && (
                  <div style={{ padding: '80px', position: 'relative', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15rem', opacity: 0.02, pointerEvents: 'none', filter: 'blur(5px)' }}>
                      T
                    </div>
                    <div className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>Henüz istatistik girilmemiş.</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===================== FIXTURES & CAPTAIN TAB ===================== */}
        {activeTab === 'fixtures' && (
          <motion.div key="fixtures" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <select className="flat-input" style={{ width: '200px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '12px', borderRadius: '8px' }} value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))}>
                {[...Array(10)].map((_, i) => <option key={i+1} value={i+1} style={{ background: '#111' }}>Hafta {i+1}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {activeMatches.filter((m: any) => m.week === selectedWeek).length === 0 && (
                <div className="client-glass" style={{ padding: '80px', position: 'relative', textAlign: 'center', borderRadius: '24px' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15rem', opacity: 0.02, pointerEvents: 'none', filter: 'blur(5px)' }}>
                    T
                  </div>
                  <div className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>Bu hafta için fikstür verisi bulunamadı.</div>
                </div>
              )}
              {activeMatches.filter((m: any) => m.week === selectedWeek).map((match: any) => {
                const isMyTeam = userProfile?.team_id === match.home_team_id || userProfile?.team_id === match.away_team_id;
                const canEnterStats = userProfile?.role === 'captain' && isMyTeam && match.status === 'completed';

                return (
                  <div key={match.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    <div className="client-glass interactive" style={{ padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                        <span className="font-bold" style={{ fontSize: '1.3rem' }}>{getTeamName(match.home_team_id)}</span>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}></div>
                      </div>
                      
                      <div style={{ margin: '0 60px', textAlign: 'center' }}>
                        <div className="text-muted font-bold" style={{ fontSize: '0.8rem', marginBottom: '8px', letterSpacing: '2px', color: match.status === 'completed' ? 'var(--text-muted)' : 'var(--brand-main)' }}>{match.status === 'completed' ? 'MAÇ SONUCU' : 'YAKLAŞAN MAÇ'}</div>
                        {match.status === 'completed' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span className="font-bold" style={{ fontSize: '3rem', color: 'var(--brand-light)', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>{match.home_score}</span>
                            <span className="text-subtle" style={{ fontSize: '1.5rem' }}>-</span>
                            <span className="font-bold" style={{ fontSize: '3rem', color: 'var(--brand-light)', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>{match.away_score}</span>
                          </div>
                        ) : (
                          <div className="font-bold text-muted" style={{ fontSize: '1.8rem' }}>VS</div>
                        )}
                      </div>

                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '24px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}></div>
                        <span className="font-bold" style={{ fontSize: '1.3rem' }}>{getTeamName(match.away_team_id)}</span>
                      </div>
                      
                      {canEnterStats && (
                        <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)' }}>
                          <button onClick={() => toggleMatchForm(match.id)} className="flat-button primary" style={{ padding: '10px 20px', fontSize: '0.85rem', boxShadow: '0 0 15px var(--brand-glow)' }}>
                            {expandedMatchId === match.id ? 'İPTAL ET' : 'İSTATİSTİKLERİ GİR'}
                          </button>
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedMatchId === match.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          <div className="client-glass" style={{ padding: '32px', background: 'rgba(64, 224, 208, 0.05)', border: '1px solid rgba(64, 224, 208, 0.2)', borderRadius: '16px' }}>
                            <h3 className="font-bold" style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'var(--brand-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ width: '8px', height: '8px', background: 'var(--brand-main)', borderRadius: '50%', boxShadow: '0 0 10px var(--brand-glow)' }} />
                              Takım İstatistik Veri Girişi
                            </h3>
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px' }}>
                                <thead>
                                  <tr className="text-subtle" style={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#fff' }}>OYUNCU</th>
                                    <th style={{ padding: '12px 8px', width: '90px' }}>GOL</th>
                                    <th style={{ padding: '12px 8px', width: '90px' }}>ASİST</th>
                                    <th style={{ padding: '12px 8px', width: '110px' }}>RTG (örn: 8.5)</th>
                                    <th style={{ padding: '12px 8px', width: '90px' }}>C. SHEET</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {teamPlayers.map((player: any) => {
                                    const stat = statsForm[player.id] || { player_id: player.id, goals: '', assists: '', clean_sheet: false, rating: '' };
                                    return (
                                      <tr key={player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>
                                          {player.ea_id || player.username} <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block', fontWeight: 'normal' }}>{player.main_position}</span>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}><input type="number" min={0} className="flat-input" style={{ padding: '8px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px' }} value={stat.goals} onChange={(e) => handleStatChange(player.id, 'goals', e.target.value)} placeholder="-" /></td>
                                        <td style={{ padding: '12px 8px' }}><input type="number" min={0} className="flat-input" style={{ padding: '8px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px' }} value={stat.assists} onChange={(e) => handleStatChange(player.id, 'assists', e.target.value)} placeholder="-" /></td>
                                        <td style={{ padding: '12px 8px' }}><input type="number" step="0.1" min={0} max={10} className="flat-input" style={{ padding: '8px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'var(--brand-light)' }} value={stat.rating} onChange={(e) => handleStatChange(player.id, 'rating', e.target.value)} placeholder="-" /></td>
                                        <td style={{ padding: '12px 8px' }}><input type="checkbox" checked={stat.clean_sheet} onChange={(e) => handleStatChange(player.id, 'clean_sheet', e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--brand-main)', cursor: 'pointer' }} /></td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
                              <span className="text-muted" style={{ fontSize: '0.85rem' }}>İstatistiği boş bırakılan oyuncular maçta oynamadı sayılır.</span>
                              <button onClick={() => submitStats(match.id)} disabled={savingStats} className="flat-button interactive" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
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

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '40px', right: '40px', background: toast.error ? 'rgba(255, 59, 48, 0.9)' : 'rgba(64, 224, 208, 0.9)', padding: '16px 24px', color: '#fff', borderRadius: '8px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: 'bold' }}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
