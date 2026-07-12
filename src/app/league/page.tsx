import { createClient } from '@/utils/supabase/server'
import LeagueClient from './LeagueClient'

export const dynamic = 'force-dynamic'

export default async function LeaguePage() {
  const supabase = await createClient()

  // Fetch Session
  const { data: { session } } = await supabase.auth.getSession()
  let userProfile = null
  let teamPlayers: any[] = []

  if (session?.user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    if (profile) {
      userProfile = profile
      if (profile.role === 'captain' && profile.team_id) {
        const { data: players } = await supabase.from('profiles').select('*').eq('team_id', profile.team_id)
        if (players) teamPlayers = players
      }
    }
  }

  // Fetch Tables
  const { data: leaguesData } = await supabase.from('leagues').select('*').order('created_at')
  const { data: teamsData } = await supabase.from('teams').select('*')
  const { data: matchesData } = await supabase.from('matches').select('*').order('week', { ascending: true })

  // Fetch match stats
  const { data: statsData } = await supabase
    .from('match_stats')
    .select('*, profile:profiles!match_stats_player_id_fkey(ea_id, username, main_position), team:teams!match_stats_team_id_fkey(name, abbreviation)')

  const allStats: any[] = []
  if (statsData) {
    const grouped: Record<string, any> = {}
    statsData.forEach(s => {
      if (!grouped[s.player_id]) {
        grouped[s.player_id] = {
          player_id: s.player_id,
          name: s.profile?.ea_id || s.profile?.username || 'Bilinmiyor',
          team: s.team?.abbreviation || s.team?.name || 'Serbest',
          pos: s.profile?.main_position || 'Bilinmiyor',
          goals: 0,
          assists: 0,
          cs: 0,
          ratingSum: 0,
          matches_played: 0
        }
      }
      grouped[s.player_id].goals += s.goals
      grouped[s.player_id].assists += s.assists
      if (s.clean_sheet) grouped[s.player_id].cs += 1
      grouped[s.player_id].ratingSum += s.rating
      grouped[s.player_id].matches_played += 1
    })

    const aggregatedArray = Object.values(grouped).map(g => ({
      ...g,
      rating: g.matches_played > 0 ? Number((g.ratingSum / g.matches_played).toFixed(2)) : 0
    }))
    allStats.push(...aggregatedArray)
  }

  return (
    <LeagueClient 
      userProfile={userProfile} 
      teamPlayers={teamPlayers} 
      leagues={leaguesData || []} 
      teams={teamsData || []} 
      matches={matchesData || []} 
      allStats={allStats} 
    />
  )
}
