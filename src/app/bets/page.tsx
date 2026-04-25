'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bet } from '@/types'
import { computeMarketStats, computeChartData } from '@/lib/market'
import MarketHeader from '@/components/MarketHeader'
import ProbabilityChart from '@/components/ProbabilityChart'
import BetForm from '@/components/BetForm'
import BetFeed from '@/components/BetFeed'

export default function BetsPage() {
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

  async function handleDeleteBet(id: string) {
    await supabase.from('bets').delete().eq('id', id)
    setBets(prev => prev.filter(b => b.id !== id))
  }

  const stats = computeMarketStats(bets)
  const chartData = computeChartData(bets)

  return (
    <main className="min-h-screen bg-celebration">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
        <div className="text-center pt-2 pb-1">
          <span className="text-4xl">🎀</span>
          <h1 className="font-display text-3xl font-semibold text-gray-700 mt-1">
            Make your guess!
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Boy or girl? Place your bet and find out!
          </p>
        </div>
        <BetForm
          onBetPlaced={bet =>
            setBets(prev => prev.some(b => b.id === bet.id) ? prev : [...prev, bet])
          }
        />
        <MarketHeader stats={stats} loading={loading} />
        <ProbabilityChart data={chartData} />
        <BetFeed bets={[...bets].reverse()} onDelete={handleDeleteBet} />
      </div>
    </main>
  )
}
