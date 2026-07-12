import { createClient } from '@/utils/supabase/server'
import TeamProfileClient from './TeamProfileClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function TeamProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const teamId = resolvedParams.id
  
  const supabase = await createClient()

  // Takım Detayları
  const { data: team, error } = await supabase
    .from('teams')
    .select('*, league:leagues(name)')
    .eq('id', teamId)
    .single()

  if (error || !team) {
    notFound()
  }

  // Oyuncu Kadrosu
  const { data: roster } = await supabase
    .from('profiles')
    .select('*')
    .eq('team_id', teamId)

  // Takım Maçları ve İstatistikleri
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .eq('status', 'completed')

  let played = 0, won = 0, drawn = 0, lost = 0, points = 0
  if (matches) {
    matches.forEach((m: any) => {
      played++
      const isHome = m.home_team_id === teamId
      const myScore = isHome ? m.home_score : m.away_score
      const oppScore = isHome ? m.away_score : m.home_score
      if (myScore > oppScore) { won++; points += 3 }
      else if (myScore === oppScore) { drawn++; points += 1 }
      else { lost++ }
    })
  }

  const formattedTeam = {
    ...team,
    league_name: team.league?.name || 'Serbest',
    stats: {
      played, won, drawn, lost, points
    }
  }

  return <TeamProfileClient team={formattedTeam} roster={roster || []} matches={matches || []} />
}
