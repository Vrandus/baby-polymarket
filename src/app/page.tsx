'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    <main className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* Nav */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍼</span>
          <span className="text-lg font-bold text-white">Baby Gender Market</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            LIVE
          </div>
        </div>

        {/* Big stats card */}
        <div className="rounded-2xl border border-[#1E2433] bg-[#11141B] p-4 sm:p-8">
          {loading ? (
            <div className="animate-pulse space-y-5">
              <div className="h-20 bg-[#1E2433] rounded-xl" />
              <div className="h-5 bg-[#1E2433] rounded-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 sm:gap-6">
                {/* Boy */}
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-blue-400 tabular-nums leading-none">
                    {stats.boyPct.toFixed(1)}%
                  </div>
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                    <span className="text-xl sm:text-3xl">👦</span>
                    <div className="text-left">
                      <div className="text-sm sm:text-base font-bold text-white">Boy</div>
                      <div className="text-xs text-[#64748B] hidden sm:block">
                        {fmt(stats.boyVolume)} &middot; {stats.boyCount} bet{stats.boyCount !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-[#64748B] sm:hidden">
                        {stats.boyCount} bet{stats.boyCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Volume */}
                <div className="text-center flex flex-col items-center justify-center border-x border-[#1E2433] px-1 sm:px-0">
                  <div className="text-xs text-[#64748B] uppercase tracking-widest mb-1 sm:mb-1.5">
                    <span className="hidden sm:inline">Total Volume</span>
                    <span className="sm:hidden">Volume</span>
                  </div>
                  <div className="text-xl sm:text-3xl lg:text-4xl font-black text-white tabular-nums">
                    {fmt(stats.totalVolume)}
                  </div>
                  <div className="text-xs text-[#64748B] mt-1 sm:mt-1.5">
                    {stats.totalBets} bet{stats.totalBets !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Girl */}
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-pink-400 tabular-nums leading-none">
                    {stats.girlPct.toFixed(1)}%
                  </div>
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                    <span className="text-xl sm:text-3xl">👧</span>
                    <div className="text-left">
                      <div className="text-sm sm:text-base font-bold text-white">Girl</div>
                      <div className="text-xs text-[#64748B] hidden sm:block">
                        {fmt(stats.girlVolume)} &middot; {stats.girlCount} bet{stats.girlCount !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-[#64748B] sm:hidden">
                        {stats.girlCount} bet{stats.girlCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Probability bar */}
              <div className="mt-4 sm:mt-7 h-3 sm:h-4 rounded-full overflow-hidden flex bg-[#0A0B0E]">
                <div
                  className="h-full bg-blue-500 transition-all duration-700 ease-out"
                  style={{ width: `${stats.boyPct}%` }}
                />
                <div className="h-full bg-pink-500 transition-all duration-700 ease-out flex-1" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-[#475569]">
                <span>Boy {stats.boyPct.toFixed(0)}%</span>
                <span>Girl {stats.girlPct.toFixed(0)}%</span>
              </div>
            </>
          )}
        </div>

        {/* Chart — taller for watch view */}
        <ProbabilityChart data={chartData} chartHeight={300} />

        {/* Live feed */}
        <LiveFeed bets={[...bets].reverse()} newBetIds={newBetIds} />

      </div>
    </main>
  )
}
