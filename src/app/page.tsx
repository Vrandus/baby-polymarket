'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bet } from '@/types'
import { computeMarketStats, computeChartData } from '@/lib/market'
import ProbabilityChart from '@/components/ProbabilityChart'
import LiveFeed from '@/components/LiveFeed'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function WatchPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [newBetIds, setNewBetIds] = useState<Set<string>>(new Set())
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
      .channel('watch-bets')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bets' },
        payload => {
          const incoming = payload.new as Bet
          setBets(prev => {
            if (prev.some(b => b.id === incoming.id)) return prev
            return [...prev, incoming]
          })
          setNewBetIds(prev => { const s = new Set(prev); s.add(incoming.id); return s })
          setTimeout(() => {
            setNewBetIds(prev => {
              const next = new Set(prev)
              next.delete(incoming.id)
              return next
            })
          }, 3000)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const stats = computeMarketStats(bets)
  const chartData = computeChartData(bets)

  return (
    <main className="min-h-screen bg-celebration">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* Header */}
        <div className="text-center pt-2 pb-1">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <span className="text-3xl">🍼</span>
            <h1 className="font-display text-3xl font-semibold text-gray-700 tracking-wide">
              Baby Gender Market
            </h1>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              LIVE
            </span>
            <p className="text-sm text-gray-400 font-medium">Who&apos;s gonna be right? 🤔</p>
          </div>
        </div>

        {/* Hero stats card */}
        {loading ? (
          <div className="animate-pulse bg-white rounded-3xl shadow-sm h-56" />
        ) : (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-orange-50">
            {/* Boy | VS | Girl */}
            <div className="grid grid-cols-[1fr,56px,1fr] sm:grid-cols-[1fr,72px,1fr]">
              {/* Boy */}
              <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-blue-100 p-5 sm:p-8 text-center">
                <div className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-blue-500 tabular-nums leading-none">
                  {stats.boyPct.toFixed(1)}%
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <span className="text-2xl sm:text-3xl">👦🏽</span>
                  <span className="font-display text-lg sm:text-xl font-semibold text-blue-600">Boy</span>
                </div>
                <div className="text-xs text-blue-400 font-semibold mt-1.5 tabular-nums">
                  {fmt(stats.boyVolume)} &middot; {stats.boyCount} bet{stats.boyCount !== 1 ? 's' : ''}
                </div>
              </div>

              {/* VS divider */}
              <div className="flex items-center justify-center bg-white relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400 flex items-center justify-center font-display font-bold text-white text-xs sm:text-sm shadow-lg shadow-amber-200 z-10">
                  VS
                </div>
              </div>

              {/* Girl */}
              <div className="bg-gradient-to-bl from-fuchsia-50 via-pink-50 to-rose-100 p-5 sm:p-8 text-center">
                <div className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-pink-500 tabular-nums leading-none">
                  {stats.girlPct.toFixed(1)}%
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <span className="text-2xl sm:text-3xl">👧🏽</span>
                  <span className="font-display text-lg sm:text-xl font-semibold text-pink-600">Girl</span>
                </div>
                <div className="text-xs text-pink-400 font-semibold mt-1.5 tabular-nums">
                  {fmt(stats.girlVolume)} &middot; {stats.girlCount} bet{stats.girlCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Volume + bar */}
            <div className="px-5 sm:px-8 py-4 border-t border-gray-50">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-400 font-medium">Total pot</span>
                <span className="font-display text-lg font-bold text-gray-700 tabular-nums">
                  {fmt(stats.totalVolume)}
                </span>
                <span className="text-gray-400 font-medium">
                  {stats.totalBets} bet{stats.totalBets !== 1 ? 's' : ''} placed
                </span>
              </div>
              <div className="h-4 rounded-full overflow-hidden flex bg-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-sky-500 transition-all duration-700 ease-out"
                  style={{ width: `${stats.boyPct}%` }}
                />
                <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 flex-1 transition-all duration-700 ease-out" />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-gray-400 font-medium">
                <span>Boy {stats.boyPct.toFixed(0)}%</span>
                <span>Girl {stats.girlPct.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <ProbabilityChart data={chartData} chartHeight={280} />

        {/* Live feed */}
        <LiveFeed bets={[...bets].reverse()} newBetIds={newBetIds} />

      </div>
    </main>
  )
}
