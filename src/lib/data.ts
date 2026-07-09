// ── Data Models ──────────────────────────────────────────────────────────────
// TypeScript port of LeagueSeed.cs from the original .NET Core project

export interface TeamStanding {
  position: number
  name: string
  tag: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
  form: string
  accent: string
  goalDifference: number
}

export interface MatchPreview {
  competition: string
  homeTeam: string
  awayTeam: string
  time: string
  status: string
  venue: string
}

export interface PlayerLeader {
  rank: number
  player: string
  team: string
  position: string
  stat: string
  value: string
  trend: string
}

export interface NewsItem {
  type: string
  title: string
  detail: string
  date: string
}

export interface TeamOverview {
  name: string
  tag: string
  captain: string
  form: string
  nextMatch: string
  squadCount: number
  transferRights: number
  accent: string
}

export interface RegisteredPlayer {
  userName: string
  displayName: string
  position: string
  team: string | null
  platform: string
  status: string
  rating: string
  marketValue: string
  isCaptain: boolean
}

export interface TournamentSummary {
  name: string
  status: string
  detail: string
  winner: string
}

export interface LeagueDivision {
  slug: string
  name: string
  shortName: string
  season: string
  accent: string
  logoIcon: string
  teamCount: number
  playerCount: number
  standings: TeamStanding[]
  fixtures: MatchPreview[]
  leaders: PlayerLeader[]
}

// ── Helper ───────────────────────────────────────────────────────────────────
const gd = (gf: number, ga: number) => gf - ga

// ── Standings ────────────────────────────────────────────────────────────────
export const superLeagueStandings: TeamStanding[] = [
  { position: 1, name: 'Bolton VFC',          tag: 'BLT', played: 6, won: 5, drawn: 1, lost: 0, goalsFor: 23, goalsAgainst: 6,  points: 16, form: 'W W D W W', accent: '#1f6dff', goalDifference: gd(23, 6)  },
  { position: 2, name: 'Turk Legends',        tag: 'TUR', played: 6, won: 5, drawn: 1, lost: 0, goalsFor: 16, goalsAgainst: 8,  points: 16, form: 'W W W D W', accent: '#d73b3e', goalDifference: gd(16, 8)  },
  { position: 3, name: 'FC BIG BANG',         tag: 'FCB', played: 6, won: 4, drawn: 2, lost: 0, goalsFor: 14, goalsAgainst: 4,  points: 14, form: 'D W W W D', accent: '#f0a11c', goalDifference: gd(14, 4)  },
  { position: 4, name: 'Anatolian Lions',     tag: 'ANT', played: 6, won: 4, drawn: 1, lost: 1, goalsFor: 23, goalsAgainst: 6,  points: 13, form: 'W L W W D', accent: '#c49a45', goalDifference: gd(23, 6)  },
  { position: 5, name: 'Abrakadabra Esports', tag: 'ABR', played: 6, won: 4, drawn: 0, lost: 2, goalsFor: 13, goalsAgainst: 8,  points: 12, form: 'W W L W L', accent: '#33c653', goalDifference: gd(13, 8)  },
  { position: 6, name: 'Good Fellas FK',      tag: 'GF',  played: 6, won: 3, drawn: 1, lost: 2, goalsFor: 15, goalsAgainst: 10, points: 10, form: 'L W D W L', accent: '#49b8ff', goalDifference: gd(15, 10) },
  { position: 7, name: 'Gegi Esport',         tag: 'GE',  played: 6, won: 3, drawn: 1, lost: 2, goalsFor: 10, goalsAgainst: 7,  points: 10, form: 'D W L W W', accent: '#46505c', goalDifference: gd(10, 7)  },
  { position: 8, name: 'Diamond FK',          tag: 'DIA', played: 6, won: 3, drawn: 0, lost: 3, goalsFor: 12, goalsAgainst: 12, points: 9,  form: 'W L L W L', accent: '#9ec8ff', goalDifference: gd(12, 12) },
]

export const firstLeagueStandings: TeamStanding[] = [
  { position: 1, name: 'Vakıf SK',       tag: 'VAK', played: 6, won: 5, drawn: 1, lost: 0, goalsFor: 19, goalsAgainst: 5,  points: 16, form: 'W W D W W', accent: '#d8b24a', goalDifference: gd(19, 5)  },
  { position: 2, name: 'Lodos Birliği', tag: 'LB',  played: 6, won: 5, drawn: 1, lost: 0, goalsFor: 17, goalsAgainst: 7,  points: 16, form: 'W D W W W', accent: '#8f7a56', goalDifference: gd(17, 7)  },
  { position: 3, name: 'Supa Strikers', tag: 'SUP', played: 6, won: 4, drawn: 1, lost: 1, goalsFor: 15, goalsAgainst: 8,  points: 13, form: 'W W L D W', accent: '#ead180', goalDifference: gd(15, 8)  },
  { position: 4, name: 'Kuzey FK',      tag: 'KZY', played: 6, won: 4, drawn: 0, lost: 2, goalsFor: 14, goalsAgainst: 9,  points: 12, form: 'L W W W L', accent: '#66d8d0', goalDifference: gd(14, 9)  },
  { position: 5, name: 'Nova Clubs',    tag: 'NOV', played: 6, won: 3, drawn: 2, lost: 1, goalsFor: 12, goalsAgainst: 8,  points: 11, form: 'D W D W L', accent: '#ef5b5b', goalDifference: gd(12, 8)  },
  { position: 6, name: 'Atlas XI',      tag: 'ATL', played: 6, won: 3, drawn: 1, lost: 2, goalsFor: 11, goalsAgainst: 9,  points: 10, form: 'W L D W L', accent: '#4fa3ff', goalDifference: gd(11, 9)  },
  { position: 7, name: 'Marmara Elite', tag: 'MRM', played: 6, won: 2, drawn: 2, lost: 2, goalsFor: 10, goalsAgainst: 10, points: 8,  form: 'D L W D L', accent: '#ff9f43', goalDifference: gd(10, 10) },
  { position: 8, name: 'Sancakspor',   tag: 'SNC', played: 6, won: 2, drawn: 1, lost: 3, goalsFor: 8,  goalsAgainst: 12, points: 7,  form: 'L W L D W', accent: '#b890ff', goalDifference: gd(8, 12)  },
]

export const goalLeaders: PlayerLeader[] = [
  { rank: 1, player: 'Ruzgar', team: 'Teta United',   position: 'ST',  stat: 'Gol',   value: '28', trend: '+4' },
  { rank: 2, player: 'Berkay', team: 'Anka Esports',  position: 'LW',  stat: 'Gol',   value: '24', trend: '+2' },
  { rank: 3, player: 'Efe',    team: 'Kuzey FK',      position: 'CAM', stat: 'Gol',   value: '22', trend: '+1' },
  { rank: 4, player: 'Mert',   team: 'Nova Clubs',    position: 'ST',  stat: 'Gol',   value: '20', trend: '+3' },
]

export const assistLeaders: PlayerLeader[] = [
  { rank: 1, player: 'Deniz', team: 'Kuzey FK',    position: 'CAM', stat: 'Asist', value: '19', trend: '+3' },
  { rank: 2, player: 'Arda',  team: 'Teta United', position: 'CM',  stat: 'Asist', value: '17', trend: '+1' },
  { rank: 3, player: 'Can',   team: 'Vortex City', position: 'RW',  stat: 'Asist', value: '15', trend: '+2' },
  { rank: 4, player: 'Doruk', team: 'Sancakspor',  position: 'CM',  stat: 'Asist', value: '14', trend: '+1' },
]

export const leagues: LeagueDivision[] = [
  {
    slug: 'super', name: 'TETA Süper Lig', shortName: 'Süper Lig',
    season: 'TETA League 5. Sezon', accent: '#d6a52d', logoIcon: 'shield',
    teamCount: 16, playerCount: 272,
    standings: superLeagueStandings,
    fixtures: [
      { competition: 'TETA Süper Lig', homeTeam: 'Bolton VFC',    awayTeam: 'Turk Legends',   time: '09 Tem 21:30', status: '8. Hafta', venue: 'Ana Lig' },
      { competition: 'TETA Süper Lig', homeTeam: 'Diamond FK',    awayTeam: 'FC BIG BANG',    time: '09 Tem 22:00', status: '8. Hafta', venue: 'Ana Lig' },
      { competition: 'TETA Süper Lig', homeTeam: 'Gegi Esport',   awayTeam: 'Anatolian Lions', time: '10 Tem 21:30', status: '8. Hafta', venue: 'Ana Lig' },
    ],
    leaders: goalLeaders,
  },
  {
    slug: 'birinci', name: 'TETA 1. Lig', shortName: '1. Lig',
    season: 'TETA League 5. Sezon', accent: '#32d6d0', logoIcon: 'shield',
    teamCount: 16, playerCount: 253,
    standings: firstLeagueStandings,
    fixtures: [
      { competition: 'TETA 1. Lig', homeTeam: 'Vakıf SK',       awayTeam: 'Lodos Birliği', time: '09 Tem 21:30', status: '8. Hafta', venue: '1. Lig' },
      { competition: 'TETA 1. Lig', homeTeam: 'Supa Strikers',  awayTeam: 'Kuzey FK',      time: '09 Tem 22:00', status: '8. Hafta', venue: '1. Lig' },
      { competition: 'TETA 1. Lig', homeTeam: 'Nova Clubs',     awayTeam: 'Atlas XI',      time: '10 Tem 21:30', status: '8. Hafta', venue: '1. Lig' },
    ],
    leaders: assistLeaders,
  },
]

export const upcomingMatches: MatchPreview[] = [
  { competition: 'Lig', homeTeam: 'Teta United',  awayTeam: 'Kuzey FK',    time: 'Bu akşam 22:30', status: 'Yaklaşıyor', venue: 'Hafta 19' },
  { competition: 'Lig', homeTeam: 'Anka Esports', awayTeam: 'Nova Clubs',  time: 'Yarın 21:45',    status: 'Planlandı',  venue: 'Hafta 19' },
  { competition: 'Night Series', homeTeam: 'Vortex City', awayTeam: 'Sancakspor', time: 'Cuma 23:00', status: 'Kupa', venue: 'Çeyrek Final' },
]

export const news: NewsItem[] = [
  { type: 'Duyuru', title: 'Hafta 19 fikstürü yayında',         detail: 'Kaptanların maç saatlerini 24 saat içinde onaylaması gerekiyor.', date: '08.07.2026' },
  { type: 'Haber',  title: 'Night Series kayıtları açıldı',     detail: '16 takımlık özel kupa formatı için başvurular başladı.',           date: '07.07.2026' },
  { type: 'Disiplin', title: 'Kadro limitleri güncellendi',     detail: 'Maksimum kadro 25 oyuncu, kaptan limiti 3 olarak sabitlendi.',     date: '06.07.2026' },
]

export const players: RegisteredPlayer[] = [
  { userName: 'dorukzinboi',  displayName: 'Doruk Zinboi',  position: 'CAM', team: 'Bolton VFC',     platform: 'PS5',  status: 'Takımlı', rating: '8.7', marketValue: '12.5M EUR', isCaptain: true  },
  { userName: 'ravezdC',      displayName: 'RavezdC',       position: 'ST',  team: 'Bolton VFC',     platform: 'PS5',  status: 'Takımlı', rating: '8.9', marketValue: '14.1M EUR', isCaptain: false },
  { userName: 'erkantunchai', displayName: 'Erkan Tunchai', position: 'CDM', team: 'Turk Legends',   platform: 'PS5',  status: 'Takımlı', rating: '8.2', marketValue: '9.8M EUR',  isCaptain: true  },
  { userName: 'ismail10',     displayName: 'İsmail',        position: 'CM',  team: 'FC BIG BANG',    platform: 'Xbox', status: 'Takımlı', rating: '8.4', marketValue: '10.6M EUR', isCaptain: false },
  { userName: 'syroxinho',    displayName: 'Syroxinho',     position: 'LW',  team: null,             platform: 'PS5',  status: 'Serbest', rating: '7.9', marketValue: '6.2M EUR',  isCaptain: false },
  { userName: 'baran9',       displayName: 'Baran',         position: 'ST',  team: null,             platform: 'PS5',  status: 'Serbest', rating: '8.1', marketValue: '8.4M EUR',  isCaptain: false },
  { userName: 'koral1',       displayName: 'Koral',         position: 'GK',  team: null,             platform: 'PC',   status: 'Serbest', rating: '7.5', marketValue: '4.2M EUR',  isCaptain: false },
  { userName: 'arda8',        displayName: 'Arda',          position: 'CM',  team: 'Vakıf SK',       platform: 'PS5',  status: 'Takımlı', rating: '8.0', marketValue: '7.3M EUR',  isCaptain: true  },
  { userName: 'deniz10',      displayName: 'Deniz',         position: 'CAM', team: 'Kuzey FK',       platform: 'Xbox', status: 'Takımlı', rating: '8.5', marketValue: '11.2M EUR', isCaptain: false },
]

export const teams: TeamOverview[] = [
  { name: 'Teta United',  tag: 'TET', captain: 'Babba',  form: 'W W D W W', nextMatch: 'Kuzey FK',    squadCount: 23, transferRights: 2, accent: '#ff7a45' },
  { name: 'Anka Esports', tag: 'ANK', captain: 'Furkan', form: 'W L W W D', nextMatch: 'Nova Clubs',  squadCount: 24, transferRights: 1, accent: '#f4c15d' },
  { name: 'Kuzey FK',     tag: 'KZY', captain: 'Alp',    form: 'D W W W W', nextMatch: 'Teta United', squadCount: 22, transferRights: 3, accent: '#69d2e7' },
  { name: 'Nova Clubs',   tag: 'NOV', captain: 'Selim',  form: 'W D W L W', nextMatch: 'Anka Esports',squadCount: 21, transferRights: 4, accent: '#ef5b5b' },
  { name: 'Vortex City',  tag: 'VTX', captain: 'Eren',   form: 'L W W D W', nextMatch: 'Sancakspor',  squadCount: 25, transferRights: 0, accent: '#7bd88f' },
  { name: 'Sancakspor',   tag: 'SNC', captain: 'Ozan',   form: 'W D L W D', nextMatch: 'Vortex City', squadCount: 20, transferRights: 2, accent: '#b890ff' },
]
