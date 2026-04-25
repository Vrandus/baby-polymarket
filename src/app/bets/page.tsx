'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bet } from '@/types'
import { computeMarketStats, computeChartData } from '@/lib/market'
import MarketHeader from '@/components/MarketHeader'
import ProbabilityChart from '@/components/ProbabilityChart'
import BetForm from '@/components/BetForm'
import BetFeed from '@/components/BetFeed'

export default function Home() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('bets')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setBets(data as Bet[])
        setLoading(false)
      })

    const channel = supabase
      .channel('bets-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bets' },
        payload => {
          setBets(prev => {
            const incoming = payload.new as Bet
            if (prev.some(b => b.id === incoming.id)) return prev
            return [...prev, incoming]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const stats = computeMarketStats(bets)
  const chartData = computeChartData(bets)

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <MarketHeader stats={stats} loading={loading} />
        <ProbabilityChart data={chartData} />
        <BetForm
          existingNames={bets.map(b => b.name.toLowerCase())}
          onBetPlaced={bet =>
            setBets(prev => prev.some(b => b.id === bet.id) ? prev : [...prev, bet])
          }
        />
        <BetFeed bets={[...bets].reverse()} />
      </div>
    </main>
  )
}
