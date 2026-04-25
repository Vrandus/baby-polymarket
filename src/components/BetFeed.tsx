'use client'

import { Bet } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  bets: Bet[]
  onDelete?: (id: string) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

export default function BetFeed({ bets, onDelete }: Props) {
  if (bets.length === 0) return null

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base font-semibold text-gray-600">All Bets</h2>
        <span className="text-xs text-gray-400 font-semibold bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
          {bets.length} total
        </span>
      </div>

      <div>
        {bets.map((bet, i) => (
          <div
            key={bet.id}
            className={`flex items-center gap-3 py-3 ${i !== bets.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                bet.choice === 'boy' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
              }`}
            >
              {getInitials(bet.name)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-gray-700 truncate">{bet.name}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    bet.choice === 'boy'
                      ? 'bg-blue-50 text-blue-500'
                      : 'bg-pink-50 text-pink-500'
                  }`}
                >
                  {bet.choice === 'boy' ? '👦🏽 Boy' : '👧🏽 Girl'}
                </span>
              </div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">
                {formatDistanceToNow(new Date(bet.created_at), { addSuffix: true })}
              </div>
            </div>

            <div
              className={`text-sm font-bold flex-shrink-0 tabular-nums ${
                bet.choice === 'boy' ? 'text-blue-500' : 'text-pink-500'
              }`}
            >
              ${Number(bet.amount).toFixed(0)}
            </div>

            {onDelete && (
              <button
                onClick={() => onDelete(bet.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors flex-shrink-0 text-sm font-bold"
                title="Delete bet"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
