'use client'

import { Bet } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  bets: Bet[]
  newBetIds: Set<string>
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

export default function LiveFeed({ bets, newBetIds }: Props) {
  return (
    <div className="rounded-2xl border border-[#1E2433] bg-[#11141B] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
            Live Feed
          </h2>
          {newBetIds.size > 0 && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              new
            </span>
          )}
        </div>
        <span className="text-xs text-[#475569]">{bets.length} bet{bets.length !== 1 ? 's' : ''}</span>
      </div>

      {bets.length === 0 ? (
        <div className="text-center py-16 text-[#475569]">
          <div className="text-5xl mb-4">🎲</div>
          <p className="text-sm font-medium">Waiting for the first bet…</p>
          <p className="text-xs mt-1 text-[#374151]">Bets will appear here in real time</p>
        </div>
      ) : (
        <div>
          {bets.map((bet, i) => {
            const isNew = newBetIds.has(bet.id)
            const isLast = i === bets.length - 1
            return (
              <div
                key={bet.id}
                className={`flex items-center gap-4 py-3.5 px-3 rounded-xl -mx-3 ${
                  isNew ? 'bet-new' : ''
                } ${!isLast ? 'border-b border-[#161b27]' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    bet.choice === 'boy'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-pink-500/20 text-pink-400'
                  }`}
                >
                  {getInitials(bet.name)}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-snug">
                    <span className="font-semibold">{bet.name}</span>
                    <span className="text-[#64748B]"> bet </span>
                    <span className={`font-semibold ${bet.choice === 'boy' ? 'text-blue-400' : 'text-pink-400'}`}>
                      ${Number(bet.amount).toFixed(0)}
                    </span>
                    <span className="text-[#64748B]"> on </span>
                    <span className={`font-semibold ${bet.choice === 'boy' ? 'text-blue-400' : 'text-pink-400'}`}>
                      {bet.choice === 'boy' ? 'Boy' : 'Girl'}
                    </span>
                  </p>
                  <p className="text-xs text-[#475569] mt-0.5">
                    {formatDistanceToNow(new Date(bet.created_at), { addSuffix: true })}
                  </p>
                </div>

                {/* Choice badge */}
                <span
                  className={`text-lg flex-shrink-0 ${isNew ? 'animate-bounce' : ''}`}
                  style={isNew ? { animationDuration: '0.6s', animationIterationCount: 3 } : {}}
                >
                  {bet.choice === 'boy' ? '👦' : '👧'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
