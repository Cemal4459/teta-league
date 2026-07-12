import { createClient } from '@/utils/supabase/server'
import LeaderboardClient from './LeaderboardClient'

export const dynamic = 'force-dynamic'

const VALUE_MULTIPLIERS = {
  goal: 30000,
  assist: 20000,
  clean_sheet: 30000,
  match_played: 5000,
  win: 5000,
  draw: 1000,
  loss: -2000,
  rating_high: 15000, // 8.0+
  rating_low: -5000,  // 6.0-
}

const TEAM_POINTS_MULTIPLIERS = {
  match_played: 1,
  win: 5,
  draw: 1,
  loss: -1,
}

const calculateValue = (p: any) => {
  let v = 0
  v += p.goals * VALUE_MULTIPLIERS.goal
  v += p.assists * VALUE_MULTIPLIERS.assist
  v += p.clean_sheets * VALUE_MULTIPLIERS.clean_sheet
  v += p.matches_played * VALUE_MULTIPLIERS.match_played
  v += p.wins * VALUE_MULTIPLIERS.win
  v += p.draws * VALUE_MULTIPLIERS.draw
  v += p.losses * VALUE_MULTIPLIERS.loss
  
  if (p.avg_rating >= 8.0) v += VALUE_MULTIPLIERS.rating_high
  if (p.avg_rating <= 6.0) v += VALUE_MULTIPLIERS.rating_low
  
  return v > 0 ? v : 0
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  const currentUserId = session?.user?.id || null

  const { data: matches } = await supabase.from('matches').select('*').eq('status', 'completed')
  const { data: statsData } = await supabase
    .from('match_stats')
    .select('*, profile:profiles!match_stats_player_id_fkey(ea_id, username, main_position), team:teams!match_stats_team_id_fkey(name, abbreviation, primary_color)')

  const rawPlayers: any[] = []
  
  if (statsData && matches) {
    const matchMap = new Map(matches.map((m: any) => [m.id, m]))
    const grouped: Record<string, any> = {}
    
    statsData.forEach((s: any) => {
      if (!grouped[s.player_id]) {
        grouped[s.player_id] = {
          id: s.player_id,
          name: s.profile?.ea_id || s.profile?.username || 'Bilinmiyor',
          team: s.team?.abbreviation || s.team?.name || 'Serbest', // Abbreviation for HUD UI
          team_full_name: s.team?.name || 'Serbest',
          position: s.profile?.main_position || 'Bilinmiyor',
          goals: 0,
          assists: 0,
          clean_sheets: 0,
          matches_played: 0,
          ratingSum: 0,
          wins: 0,
          draws: 0,
          losses: 0
        }
      }
      
      const p = grouped[s.player_id]
      p.goals += s.goals
      p.assists += s.assists
      if (s.clean_sheet) p.clean_sheets += 1
      p.matches_played += 1
      p.ratingSum += s.rating

      const match = matchMap.get(s.match_id)
      if (match) {
        const isHome = match.home_team_id === s.team_id
        const isAway = match.away_team_id === s.team_id
        
        if (isHome || isAway) {
          const myScore = isHome ? match.home_score : match.away_score
          const oppScore = isHome ? match.away_score : match.home_score
          if (myScore > oppScore) p.wins += 1
          else if (myScore < oppScore) p.losses += 1
          else p.draws += 1
        }
      }
    })

    const finalPlayers = Object.values(grouped).map(g => ({
      ...g,
      avg_rating: g.matches_played > 0 ? Number((g.ratingSum / g.matches_played).toFixed(2)) : 0
    }))
    rawPlayers.push(...finalPlayers)
  }

  const playersWithValues = rawPlayers.map(p => ({ ...p, value: calculateValue(p) })).sort((a, b) => b.value - a.value)

  const teamMap: Record<string, any> = {}
  playersWithValues.forEach(p => {
    if (!teamMap[p.team_full_name]) {
      teamMap[p.team_full_name] = { 
        name: p.team_full_name, value: 0, players: 0, points: 0,
        matches: 0, wins: 0, draws: 0, losses: 0
      }
    }
    teamMap[p.team_full_name].value += (p.value || 0)
    teamMap[p.team_full_name].players += 1
    
    teamMap[p.team_full_name].matches = Math.max(teamMap[p.team_full_name].matches, p.matches_played)
    teamMap[p.team_full_name].wins = Math.max(teamMap[p.team_full_name].wins, p.wins)
    teamMap[p.team_full_name].draws = Math.max(teamMap[p.team_full_name].draws, p.draws)
    teamMap[p.team_full_name].losses = Math.max(teamMap[p.team_full_name].losses, p.losses)
  })
  
  Object.values(teamMap).forEach(t => {
    t.points = 
      (t.matches * TEAM_POINTS_MULTIPLIERS.match_played) +
      (t.wins * TEAM_POINTS_MULTIPLIERS.win) +
      (t.draws * TEAM_POINTS_MULTIPLIERS.draw) +
      (t.losses * TEAM_POINTS_MULTIPLIERS.loss)
  })
  
  const teamsWithValues = Object.values(teamMap).sort((a, b) => b.points - a.points)

  return (
    <LeaderboardClient 
      currentUserId={currentUserId} 
      playersWithValues={playersWithValues} 
      teamsWithValues={teamsWithValues} 
    />
  )
}
