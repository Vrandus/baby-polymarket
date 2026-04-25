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
  const { boyPct, girlPct, boyVolume, girlVolume, totalVolume, boyCount, girlCount, totalBets } =
    stats

  return (
    <div className="rounded-2xl border border-[#1E2433] bg-[#11141B] p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-[#64748B]">🍼 Baby Gender Market</p>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          LIVE
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">
        Will it be a <span className="text-blue-400">Boy</span> or{' '}
        <span className="text-pink-400">Girl</span>?
      </h1>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[#1E2433] rounded-xl" />
          <div className="h-3 bg-[#1E2433] rounded-full" />
        </div>
      ) : (
        <>
          {/* Probability numbers */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-4xl font-black text-blue-400 leading-none tabular-nums">
                {boyPct.toFixed(1)}%
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-xl">👦</span>
                <div>
                  <div className="text-sm font-semibold text-white">Boy</div>
                  <div className="text-xs text-[#64748B]">
                    {fmt(boyVolume)} &middot; {boyCount} bet{boyCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-[#64748B] uppercase tracking-wider mb-0.5">
                Total Volume
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">{fmt(totalVolume)}</div>
              <div className="text-xs text-[#64748B] mt-0.5">
                {totalBets} bet{totalBets !== 1 ? 's' : ''} placed
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-black text-pink-400 leading-none tabular-nums">
                {girlPct.toFixed(1)}%
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 justify-end">
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">Girl</div>
                  <div className="text-xs text-[#64748B]">
                    {fmt(girlVolume)} &middot; {girlCount} bet{girlCount !== 1 ? 's' : ''}
                  </div>
                </div>
                <span className="text-xl">👧</span>
              </div>
            </div>
          </div>

          {/* Probability bar */}
          <div className="h-3 rounded-full overflow-hidden flex bg-[#0A0B0E]">
            <div
              className="h-full bg-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${boyPct}%` }}
            />
            <div className="h-full bg-pink-500 transition-all duration-700 ease-out flex-1" />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-[#475569]">
            <span>Boy {boyPct.toFixed(0)}%</span>
            <span>Girl {girlPct.toFixed(0)}%</span>
          </div>
        </>
      )}
    </div>
  )
}
