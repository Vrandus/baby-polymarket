'use client'

import { MarketStats } from '@/types'

interface Props {
  stats: MarketStats
  loading: boolean
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function MarketHeader({ stats, loading }: Props) {
  const { boyPct, girlPct, boyVolume, girlVolume, totalVolume, boyCount, girlCount, totalBets } = stats

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-base font-semibold text-gray-600">Current Odds</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          LIVE
        </span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-gray-50 rounded-2xl" />
          <div className="h-2.5 bg-gray-50 rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-blue-50 rounded-2xl p-3 text-center">
              <div className="font-display text-2xl font-bold text-blue-500 tabular-nums leading-none">
                {boyPct.toFixed(1)}%
              </div>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <span className="text-base">👦🏽</span>
                <span className="text-xs font-bold text-blue-600">Boy</span>
              </div>
              <div className="text-xs text-blue-400 mt-0.5 tabular-nums">
                {fmt(boyVolume)} · {boyCount} bets
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Total
              </div>
              <div className="font-display text-xl font-bold text-gray-700 tabular-nums">
                {fmt(totalVolume)}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {totalBets} bet{totalBets !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="bg-pink-50 rounded-2xl p-3 text-center">
              <div className="font-display text-2xl font-bold text-pink-500 tabular-nums leading-none">
                {girlPct.toFixed(1)}%
              </div>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <span className="text-base">👧🏽</span>
                <span className="text-xs font-bold text-pink-600">Girl</span>
              </div>
              <div className="text-xs text-pink-400 mt-0.5 tabular-nums">
                {fmt(girlVolume)} · {girlCount} bets
              </div>
            </div>
          </div>

          <div className="h-2.5 rounded-full overflow-hidden flex bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-sky-500 transition-all duration-700 ease-out"
              style={{ width: `${boyPct}%` }}
            />
            <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 flex-1 transition-all duration-700 ease-out" />
          </div>
        </>
      )}
    </div>
  )
}
