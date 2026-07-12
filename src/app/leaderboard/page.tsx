'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// --- ALGORITHM CONSTANTS ---
const VALUE_MULTIPLIERS = {
  goal: 30000,
  assist: 20000,
  clean_sheet: 30000,
  motm: 75000,
  totw: 100000,
  toty: 1000000,
  champ_super: 500000,
  champ_first: 250000,
  champ_karma: 50000,
  champ_tr_cup: 100000,
  champ_super_cup: 150000,
  king_super_goal: 200000,
  king_super_assist: 100000,
  king_first_goal: 100000,
  king_first_assist: 50000,
  best_defense_super: 150000,
  best_defense_first: 75000,
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
  champ_super: 30,
  champ_first: 15,
  champ_super_cup: 20,
  champ_tr_cup: 15,
}

// --- MOCK DATA ---
const MY_USER_ID = 'usr_1' // Simulate logged in user

type PlayerStats = {
  id: string
  name: string
  team: string
  league: 'Süper Lig' | '1. Lig'
  position: string
  goals: number
  assists: number
  clean_sheets: number
  motm: number
  totw: number
  toty: number
  champ_super: number
  champ_first: number
  champ_karma: number
  champ_tr_cup: number
  champ_super_cup: number
  king_super_goal: number
  king_super_assist: number
  king_first_goal: number
  king_first_assist: number
  best_defense_super: number
  best_defense_first: number
  matches_played: number
  wins: number
  draws: number
  losses: number
  avg_rating: number
}

const rawPlayers: PlayerStats[] = [
  { id: 'usr_1', name: 'MustafaKucukbas', team: 'Teta League All Stars', league: 'Süper Lig', position: 'ST', goals: 45, assists: 12, clean_sheets: 0, motm: 10, totw: 8, toty: 1, champ_super: 2, champ_first: 0, champ_karma: 1, champ_tr_cup: 1, champ_super_cup: 1, king_super_goal: 1, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 50, wins: 35, draws: 10, losses: 5, avg_rating: 9.2 },
  { id: 'usr_2', name: 'KeremAcar', team: 'Siber SK', league: 'Süper Lig', position: 'CAM', goals: 18, assists: 35, clean_sheets: 0, motm: 8, totw: 6, toty: 1, champ_super: 1, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 1, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 48, wins: 30, draws: 10, losses: 8, avg_rating: 8.8 },
  { id: 'usr_3', name: 'DorukKaya', team: 'Anadolu FK', league: 'Süper Lig', position: 'CDM', goals: 5, assists: 15, clean_sheets: 12, motm: 5, totw: 4, toty: 0, champ_super: 0, champ_first: 1, champ_karma: 0, champ_tr_cup: 1, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 45, wins: 25, draws: 15, losses: 5, avg_rating: 8.4 },
  { id: 'usr_4', name: 'Valiente', team: 'Teta League All Stars', league: 'Süper Lig', position: 'CB', goals: 8, assists: 2, clean_sheets: 22, motm: 4, totw: 5, toty: 1, champ_super: 2, champ_first: 0, champ_karma: 1, champ_tr_cup: 1, champ_super_cup: 1, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 1, best_defense_first: 0, matches_played: 50, wins: 35, draws: 10, losses: 5, avg_rating: 8.7 },
  { id: 'usr_5', name: 'Kral_10', team: 'Bozkuşlar', league: '1. Lig', position: 'LW', goals: 28, assists: 14, clean_sheets: 0, motm: 6, totw: 5, toty: 0, champ_super: 0, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 1, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 38, wins: 20, draws: 8, losses: 10, avg_rating: 8.1 },
  { id: 'usr_6', name: 'GhostSniper', team: 'Siber SK', league: 'Süper Lig', position: 'ST', goals: 30, assists: 5, clean_sheets: 0, motm: 4, totw: 3, toty: 0, champ_super: 1, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 40, wins: 25, draws: 5, losses: 10, avg_rating: 7.9 },
  { id: 'usr_7', name: 'PanterAli', team: 'Anadolu FK', league: 'Süper Lig', position: 'GK', goals: 0, assists: 1, clean_sheets: 18, motm: 7, totw: 4, toty: 0, champ_super: 0, champ_first: 1, champ_karma: 0, champ_tr_cup: 1, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 45, wins: 25, draws: 15, losses: 5, avg_rating: 8.5 },
  { id: 'usr_8', name: 'NinjaDef', team: 'Kartal ES', league: '1. Lig', position: 'CB', goals: 3, assists: 1, clean_sheets: 15, motm: 2, totw: 2, toty: 0, champ_super: 0, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 1, matches_played: 30, wins: 15, draws: 10, losses: 5, avg_rating: 8.2 },
  { id: 'usr_9', name: 'OrtaSahaBeyi', team: 'Neon FC', league: 'Süper Lig', position: 'CM', goals: 10, assists: 20, clean_sheets: 5, motm: 3, totw: 2, toty: 0, champ_super: 0, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 35, wins: 15, draws: 10, losses: 10, avg_rating: 7.8 },
  { id: 'usr_10', name: 'Firtina', team: 'Teta League All Stars', league: 'Süper Lig', position: 'RW', goals: 22, assists: 18, clean_sheets: 0, motm: 6, totw: 5, toty: 0, champ_super: 2, champ_first: 0, champ_karma: 1, champ_tr_cup: 1, champ_super_cup: 1, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 48, wins: 33, draws: 10, losses: 5, avg_rating: 8.6 },
  { id: 'usr_11', name: 'Kilitci', team: 'Siber SK', league: 'Süper Lig', position: 'CB', goals: 1, assists: 0, clean_sheets: 14, motm: 1, totw: 1, toty: 0, champ_super: 1, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 40, wins: 25, draws: 10, losses: 5, avg_rating: 7.5 },
  { id: 'usr_12', name: 'Maestro', team: 'Anadolu FK', league: 'Süper Lig', position: 'CAM', goals: 8, assists: 22, clean_sheets: 0, motm: 4, totw: 3, toty: 0, champ_super: 0, champ_first: 1, champ_karma: 0, champ_tr_cup: 1, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 42, wins: 22, draws: 15, losses: 5, avg_rating: 8.1 },
  { id: 'usr_13', name: 'Roket', team: 'Kartal ES', league: '1. Lig', position: 'RB', goals: 5, assists: 10, clean_sheets: 12, motm: 2, totw: 1, toty: 0, champ_super: 0, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 35, wins: 15, draws: 12, losses: 8, avg_rating: 7.6 },
  { id: 'usr_14', name: 'Cengaver', team: 'Neon FC', league: 'Süper Lig', position: 'ST', goals: 15, assists: 4, clean_sheets: 0, motm: 2, totw: 1, toty: 0, champ_super: 0, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 30, wins: 12, draws: 8, losses: 10, avg_rating: 7.4 },
  { id: 'usr_15', name: 'DuvarUstasi', team: 'Bozkuşlar', league: '1. Lig', position: 'GK', goals: 0, assists: 0, clean_sheets: 8, motm: 1, totw: 0, toty: 0, champ_super: 0, champ_first: 0, champ_karma: 0, champ_tr_cup: 0, champ_super_cup: 0, king_super_goal: 0, king_super_assist: 0, king_first_goal: 0, king_first_assist: 0, best_defense_super: 0, best_defense_first: 0, matches_played: 20, wins: 8, draws: 5, losses: 7, avg_rating: 6.8 },
]

// --- HELPER ALGORITHM ---
const calculateValue = (p: PlayerStats) => {
  let v = 0
  v += p.goals * VALUE_MULTIPLIERS.goal
  v += p.assists * VALUE_MULTIPLIERS.assist
  v += p.clean_sheets * VALUE_MULTIPLIERS.clean_sheet
  v += p.motm * VALUE_MULTIPLIERS.motm
  v += p.totw * VALUE_MULTIPLIERS.totw
  v += p.toty * VALUE_MULTIPLIERS.toty
  
  v += p.champ_super * VALUE_MULTIPLIERS.champ_super
  v += p.champ_first * VALUE_MULTIPLIERS.champ_first
  v += p.champ_karma * VALUE_MULTIPLIERS.champ_karma
  v += p.champ_tr_cup * VALUE_MULTIPLIERS.champ_tr_cup
  v += p.champ_super_cup * VALUE_MULTIPLIERS.champ_super_cup
  
  v += p.king_super_goal * VALUE_MULTIPLIERS.king_super_goal
  v += p.king_super_assist * VALUE_MULTIPLIERS.king_super_assist
  v += p.king_first_goal * VALUE_MULTIPLIERS.king_first_goal
  v += p.king_first_assist * VALUE_MULTIPLIERS.king_first_assist
  
  v += p.best_defense_super * VALUE_MULTIPLIERS.best_defense_super
  v += p.best_defense_first * VALUE_MULTIPLIERS.best_defense_first
  
  v += p.matches_played * VALUE_MULTIPLIERS.match_played
  v += p.wins * VALUE_MULTIPLIERS.win
  v += p.draws * VALUE_MULTIPLIERS.draw
  v += p.losses * VALUE_MULTIPLIERS.loss
  
  if (p.avg_rating >= 8.0) v += VALUE_MULTIPLIERS.rating_high
  if (p.avg_rating <= 6.0) v += VALUE_MULTIPLIERS.rating_low
  
  return v > 0 ? v : 0
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}

// --- COMPONENTS ---

const SilhouetteAvatar = () => (
  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
    <svg width="32" height="38" viewBox="0 0 24 24" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  </div>
)

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'Oyuncu' | 'Takım'>('Oyuncu')
  const [flashingRowId, setFlashingRowId] = useState<string | null>(null)

  // Compute values and sort
  const playersWithValues = useMemo(() => {
    const list = rawPlayers.map(p => ({ ...p, value: calculateValue(p) }))
    return list.sort((a, b) => b.value - a.value)
  }, [])

  const teamsWithValues = useMemo(() => {
    const teamMap: Record<string, { 
      name: string, value: number, players: number, points: number,
      matches: number, wins: number, draws: number, losses: number,
      champ_super: number, champ_first: number, champ_super_cup: number, champ_tr_cup: number 
    }> = {}
    
    playersWithValues.forEach(p => {
      if (!teamMap[p.team]) {
        teamMap[p.team] = { 
          name: p.team, value: 0, players: 0, points: 0,
          matches: 0, wins: 0, draws: 0, losses: 0,
          champ_super: 0, champ_first: 0, champ_super_cup: 0, champ_tr_cup: 0
        }
      }
      teamMap[p.team].value += p.value
      teamMap[p.team].players += 1
      
      teamMap[p.team].matches = Math.max(teamMap[p.team].matches, p.matches_played)
      teamMap[p.team].wins = Math.max(teamMap[p.team].wins, p.wins)
      teamMap[p.team].draws = Math.max(teamMap[p.team].draws, p.draws)
      teamMap[p.team].losses = Math.max(teamMap[p.team].losses, p.losses)
      teamMap[p.team].champ_super = Math.max(teamMap[p.team].champ_super, p.champ_super)
      teamMap[p.team].champ_first = Math.max(teamMap[p.team].champ_first, p.champ_first)
      teamMap[p.team].champ_super_cup = Math.max(teamMap[p.team].champ_super_cup, p.champ_super_cup)
      teamMap[p.team].champ_tr_cup = Math.max(teamMap[p.team].champ_tr_cup, p.champ_tr_cup)
    })
    
    Object.values(teamMap).forEach(t => {
      t.points = 
        (t.matches * TEAM_POINTS_MULTIPLIERS.match_played) +
        (t.wins * TEAM_POINTS_MULTIPLIERS.win) +
        (t.draws * TEAM_POINTS_MULTIPLIERS.draw) +
        (t.losses * TEAM_POINTS_MULTIPLIERS.loss) +
        (t.champ_super * TEAM_POINTS_MULTIPLIERS.champ_super) +
        (t.champ_first * TEAM_POINTS_MULTIPLIERS.champ_first) +
        (t.champ_super_cup * TEAM_POINTS_MULTIPLIERS.champ_super_cup) +
        (t.champ_tr_cup * TEAM_POINTS_MULTIPLIERS.champ_tr_cup)
    })
    
    return Object.values(teamMap).sort((a, b) => b.points - a.points)
  }, [playersWithValues])

  // Locate User UX
  const locateMe = () => {
    setActiveTab('Oyuncu')
    setTimeout(() => {
      const el = document.getElementById(`row-${MY_USER_ID}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setFlashingRowId(MY_USER_ID)
        setTimeout(() => setFlashingRowId(null), 2000)
      }
    }, 100)
  }

  // Generate Podium Props
  const getPodiumProps = (rank: number) => {
    if (rank === 1) return { color: '#ffd700', height: '320px', label: '1. SIRA', glow: 'rgba(255, 215, 0, 0.4)' }
    if (rank === 2) return { color: '#c0c0c0', height: '280px', label: '2. SIRA', glow: 'rgba(192, 192, 192, 0.2)' }
    if (rank === 3) return { color: '#cd7f32', height: '260px', label: '3. SIRA', glow: 'rgba(205, 127, 50, 0.2)' }
    return { color: '#fff', height: 'auto', label: '', glow: 'transparent' }
  }

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '40px', paddingRight: '40px', position: 'relative' }}>
      
      {/* CSS KEYFRAMES */}
      <style>{`
        @keyframes neon-flash {
          0% { box-shadow: 0 0 0 transparent; border-color: rgba(255,255,255,0.1); }
          20% { box-shadow: 0 0 30px var(--brand-glow); border-color: var(--brand-main); background: rgba(217, 119, 95, 0.1); }
          80% { box-shadow: 0 0 30px var(--brand-glow); border-color: var(--brand-main); background: rgba(217, 119, 95, 0.1); }
          100% { box-shadow: 0 0 0 transparent; border-color: rgba(255,255,255,0.1); background: transparent; }
        }
        .row-flash {
          animation: neon-flash 2s ease-in-out;
        }
      `}</style>

      {/* BEN NEREDEYİM BUTTON (STICKY) */}
      <button 
        onClick={locateMe}
        className="flat-button interactive" 
        style={{ position: 'fixed', top: '120px', left: '40px', zIndex: 100, background: 'rgba(20,20,20,0.8)', border: '1px solid var(--brand-main)', color: 'var(--brand-light)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 20px rgba(217, 119, 95, 0.3)', backdropFilter: 'blur(10px)' }}
      >
        <span style={{ fontSize: '1.2rem' }}>🎯</span> Ben Neredeyim
      </button>

      {/* HEADER & TABS */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h1 className="font-bold" style={{ fontSize: '3rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0 }}>Liderlik Tablosu</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '8px', marginBottom: '40px' }}>Teta League algoritmasına göre güncel piyasa değerleri.</p>

        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {(['Oyuncu', 'Takım'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', background: activeTab === tab ? 'linear-gradient(135deg, var(--brand-main), var(--brand-dark))' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.1rem' }}
            >
              {tab.toUpperCase()} SIRALAMASI
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          
          {/* PODYUM (İLK 3) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', marginBottom: '60px', marginTop: '40px' }}>
            {[2, 1, 3].map(rank => {
              const data = activeTab === 'Oyuncu' ? playersWithValues[rank - 1] : teamsWithValues[rank - 1]
              if (!data) return null
              
              const pProps = getPodiumProps(rank)
              const isFirst = rank === 1

              return (
                <div key={data.name} className="game-panel" style={{ width: '300px', height: pProps.height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(5,5,5,1) 100%)`, border: `2px solid ${pProps.color}40`, boxShadow: `0 10px 40px rgba(0,0,0,0.8), inset 0 0 40px ${pProps.glow}`, position: 'relative', zIndex: isFirst ? 2 : 1, transform: isFirst ? 'scale(1.05)' : 'none' }}>
                  
                  {isFirst && (
                    <div style={{ position: 'absolute', top: '-40px', fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))', zIndex: 10 }}>
                      👑
                    </div>
                  )}

                  <div style={{ fontSize: '3rem', fontWeight: '900', color: pProps.color, opacity: 0.2, position: 'absolute', top: '10px', right: '20px' }}>{rank}</div>
                  
                  {activeTab === 'Oyuncu' && <div style={{ transform: 'scale(1.5)', marginBottom: '32px' }}><SilhouetteAvatar /></div>}
                  
                  <div className="font-bold" style={{ fontSize: isFirst ? '1.8rem' : '1.4rem', textAlign: 'center', marginBottom: '8px', zIndex: 1 }}>{data.name}</div>
                  {activeTab === 'Oyuncu' && <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>{(data as PlayerStats).team}</div>}
                  
                  <div className="font-bold" style={{ fontSize: isFirst ? '2rem' : '1.5rem', color: pProps.color, textShadow: `0 0 15px ${pProps.glow}` }}>
                    {activeTab === 'Oyuncu' ? formatCurrency(data.value) : `${(data as any).points} Puan`}
                  </div>
                  {activeTab === 'Takım' && (
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                      Takım Değeri: {formatCurrency(data.value)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* LİSTE (4+) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(activeTab === 'Oyuncu' ? playersWithValues : teamsWithValues).slice(3).map((data, index) => {
              const rank = index + 4
              const rowId = activeTab === 'Oyuncu' ? `row-${(data as PlayerStats).id}` : `row-team-${data.name}`
              const isFlashing = flashingRowId === (activeTab === 'Oyuncu' ? (data as PlayerStats).id : null)

              return (
                <div 
                  key={data.name} 
                  id={rowId}
                  className={`game-panel interactive ${isFlashing ? 'row-flash' : ''}`} 
                  style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div className="font-bold text-muted" style={{ width: '40px', fontSize: '1.2rem', textAlign: 'center' }}>{rank}</div>
                  
                  {activeTab === 'Oyuncu' && <SilhouetteAvatar />}
                  
                  <div style={{ flex: 1 }}>
                    <div className="font-bold" style={{ fontSize: '1.3rem' }}>
                      {activeTab === 'Oyuncu' ? <Link href={`/profile/${data.name.toLowerCase()}`} style={{ color: '#fff', textDecoration: 'none' }}>{data.name}</Link> : data.name}
                    </div>
                    {activeTab === 'Oyuncu' && <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>{(data as PlayerStats).team} • {(data as PlayerStats).position}</div>}
                    {activeTab === 'Takım' && <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Kadro: {(data as any).players} Oyuncu</div>}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--brand-light)', textShadow: '0 0 10px rgba(217,119,95,0.3)', letterSpacing: '1px' }}>
                      {activeTab === 'Oyuncu' ? formatCurrency(data.value) : `${(data as any).points} Puan`}
                    </div>
                    {activeTab === 'Takım' && (
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                        Değer: {formatCurrency(data.value)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  )
}
