'use client'

import { Bet } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  bets: Bet[]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

export default function BetFeed({ bets }: Props) {
  if (bets.length === 0) return null

  return (
    <div className="rounded-2xl border border-[#1E2433] bg-[#11141B] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
          All Bets
        </h2>
        <span className="text-xs text-[#475569]">{bets.length} total</span>
      </div>

      <div className="space-y-1">
        {bets.map((bet, i) => (
          <div
            key={bet.id}
            className={`flex items-center gap-3 py-3 ${
              i !== bets.length - 1 ? 'border-b border-[#1a1f2e]' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                bet.choice === 'boy'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-pink-500/20 text-pink-400'
              }`}
            >
              {getInitials(bet.name)}
            </div>

            {/* Name + badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white truncate">{bet.name}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    bet.choice === 'boy'
                      ? 'bg-blue-500/15 text-blue-400'
                      : 'bg-pink-500/15 text-pink-400'
                  }`}
                >
                  {bet.choice === 'boy' ? '👦 Boy' : '👧 Girl'}
                </span>
              </div>
              <div className="text-xs text-[#475569] mt-0.5">
                {formatDistanceToNow(new Date(bet.created_at), { addSuffix: true })}
              </div>
            </div>

            {/* Amount */}
            <div
              className={`text-sm font-bold flex-shrink-0 tabular-nums ${
                bet.choice === 'boy' ? 'text-blue-400' : 'text-pink-400'
              }`}
            >
              ${Number(bet.amount).toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
