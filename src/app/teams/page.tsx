import { createClient } from '@/utils/supabase/server'
import TeamsClient from './TeamsClient'

export const dynamic = 'force-dynamic'

export default async function TeamsGalleryPage() {
  const supabase = await createClient()

  const { data: teamsData } = await supabase
    .from('teams')
    .select('*, league:leagues(name)')
    .order('name')

  const teams = (teamsData || []).map(t => ({
    id: t.id,
    name: t.name,
    league: t.league?.name || 'Serbest',
    value: t.budget || 5000000,
    logo_url: t.logo_url || null,
    primary_color: t.primary_color || '#40E0D0',
    abbreviation: t.abbreviation || 'N/A',
    stadium_name: t.stadium_name || 'Bilinmiyor'
  }))

  return <TeamsClient teams={teams} />
}
