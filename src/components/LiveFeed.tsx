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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-base font-semibold text-gray-600">Live Feed</h2>
          {newBetIds.size > 0 && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
              new!
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 font-semibold bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
          {bets.length} bet{bets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {bets.length === 0 ? (
        <div className="text-center py-14">
          <div className="text-5xl mb-3">🎲</div>
          <p className="text-sm font-semibold text-gray-400">Waiting for the first bet…</p>
          <p className="text-xs text-gray-300 mt-1">Bets appear here in real time</p>
        </div>
      ) : (
        <div>
          {bets.map((bet, i) => {
            const isNew = newBetIds.has(bet.id)
            return (
              <div
                key={bet.id}
                className={`flex items-center gap-4 py-3.5 px-3 rounded-2xl -mx-3 transition-colors ${
                  isNew ? 'bet-new' : ''
                } ${i !== bets.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    bet.choice === 'boy' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                  }`}
                >
                  {getInitials(bet.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">
                    <span className="font-bold">{bet.name}</span>
                    <span className="text-gray-400"> bet </span>
                    <span className={`font-bold ${bet.choice === 'boy' ? 'text-blue-500' : 'text-pink-500'}`}>
                      ${Number(bet.amount).toFixed(0)}
                    </span>
                    <span className="text-gray-400"> on </span>
                    <span className={`font-bold ${bet.choice === 'boy' ? 'text-blue-500' : 'text-pink-500'}`}>
                      {bet.choice === 'boy' ? 'Boy' : 'Girl'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {formatDistanceToNow(new Date(bet.created_at), { addSuffix: true })}
                  </p>
                </div>

                <span
                  className={`text-xl flex-shrink-0 ${isNew ? 'animate-bounce' : ''}`}
                  style={isNew ? { animationDuration: '0.6s', animationIterationCount: 3 } : {}}
                >
                  {bet.choice === 'boy' ? '👦🏽' : '👧🏽'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
