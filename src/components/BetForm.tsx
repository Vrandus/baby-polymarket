'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bet } from '@/types'

interface Props {
  existingNames: string[]
  onBetPlaced: (bet: Bet) => void
}

const PRESET_AMOUNTS = [5, 10, 25, 50]

export default function BetForm({ existingNames, onBetPlaced }: Props) {
  const [name, setName] = useState('')
  const [choice, setChoice] = useState<'boy' | 'girl' | null>(null)
  const [presetAmount, setPresetAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [placed, setPlaced] = useState<Bet | null>(null)

  const nameTrimmed = name.trim()
  const isNameTaken = nameTrimmed.length > 0 && existingNames.includes(nameTrimmed.toLowerCase())
  const effectiveAmount =
    presetAmount !== null
      ? presetAmount
      : customAmount !== ''
        ? parseFloat(customAmount)
        : null
  const canSubmit =
    nameTrimmed.length > 0 &&
    choice !== null &&
    effectiveAmount !== null &&
    effectiveAmount > 0 &&
    !isNameTaken

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !choice || effectiveAmount === null) return

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('bets')
      .insert({ name: nameTrimmed, choice, amount: effectiveAmount })
      .select()
      .single()

    setLoading(false)

    if (dbError) {
      setError(
        dbError.code === '23505'
          ? `${nameTrimmed} has already placed a bet.`
          : dbError.message
      )
      return
    }

    const bet = data as Bet
    onBetPlaced(bet)
    setPlaced(bet)
  }

  if (placed) {
    return (
      <div className="rounded-2xl border border-[#1E2433] bg-[#11141B] p-8 text-center">
        <div className="text-5xl mb-3">{placed.choice === 'boy' ? '👦' : '👧'}</div>
        <div className="text-xl font-bold text-white mb-1">Bet placed!</div>
        <div className="text-[#94A3B8] text-sm">
          <span className="font-semibold text-white">{placed.name}</span> bet{' '}
          <span className={placed.choice === 'boy' ? 'text-blue-400' : 'text-pink-400'}>
            ${Number(placed.amount).toFixed(0)} on {placed.choice === 'boy' ? 'Boy' : 'Girl'}
          </span>
        </div>
        <div className="text-xs text-[#475569] mt-2">Good luck! 🍀</div>
        <button
          onClick={() => {
            setPlaced(null)
            setName('')
            setChoice(null)
            setPresetAmount(null)
            setCustomAmount('')
            setError(null)
          }}
          className="mt-6 w-full rounded-xl py-3 text-sm font-semibold bg-[#1a1f2e] hover:bg-[#222840] border border-[#1E2433] text-[#94A3B8] hover:text-white transition-colors"
        >
          Place another bet
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#1E2433] bg-[#11141B] p-6">
      <h2 className="text-lg font-bold text-white mb-5">Place Your Bet</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="bet-name" className="block text-sm font-medium text-[#94A3B8] mb-1.5">
            Your Full Name
          </label>
          <input
            id="bet-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full rounded-xl bg-[#1a1f2e] border border-[#1E2433] text-white placeholder-[#475569] px-4 py-3 text-sm focus:outline-none focus:border-[#3B4565] transition-colors"
          />
          {isNameTaken && (
            <p className="text-xs text-amber-400 mt-1.5">
              ⚠️ {nameTrimmed} has already placed a bet.
            </p>
          )}
        </div>

        {/* Boy / Girl */}
        <div>
          <p className="text-sm font-medium text-[#94A3B8] mb-1.5">Your Prediction</p>
          <div className="grid grid-cols-2 gap-3">
            {(['boy', 'girl'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setChoice(opt)}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-4 font-semibold text-sm transition-all duration-200 ${
                  choice === opt
                    ? opt === 'boy'
                      ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-300'
                      : 'bg-pink-500/20 border-2 border-pink-500 text-pink-300'
                    : 'bg-[#1a1f2e] border-2 border-[#1E2433] text-[#64748B] hover:border-[#2d3748]'
                }`}
              >
                <span className="text-xl">{opt === 'boy' ? '👦' : '👧'}</span>
                <span>{opt === 'boy' ? 'Boy' : 'Girl'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="custom-amount" className="block text-sm font-medium text-[#94A3B8] mb-1.5">
            Bet Amount ($)
          </label>
          <div className="flex gap-2 flex-wrap mb-2">
            {PRESET_AMOUNTS.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => { setPresetAmount(amt); setCustomAmount('') }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  presetAmount === amt
                    ? 'bg-blue-500/20 border border-blue-500 text-blue-300'
                    : 'bg-[#1a1f2e] border border-[#1E2433] text-[#64748B] hover:border-[#2d3748]'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <input
            id="custom-amount"
            type="number"
            value={customAmount}
            onChange={e => { setCustomAmount(e.target.value); setPresetAmount(null) }}
            placeholder="Or enter a custom amount…"
            min="1"
            step="1"
            className="w-full rounded-xl bg-[#1a1f2e] border border-[#1E2433] text-white placeholder-[#475569] px-4 py-3 text-sm focus:outline-none focus:border-[#3B4565] transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={`w-full rounded-xl py-3.5 font-semibold text-sm transition-all duration-200 ${
            !canSubmit || loading
              ? 'bg-[#1a1f2e] text-[#475569] cursor-not-allowed'
              : choice === 'boy'
                ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20'
                : choice === 'girl'
                  ? 'bg-pink-500 hover:bg-pink-400 text-white shadow-lg shadow-pink-500/20'
                  : 'bg-[#1a1f2e] text-[#475569] cursor-not-allowed'
          }`}
        >
          {loading
            ? 'Placing bet…'
            : `Place Bet${effectiveAmount && effectiveAmount > 0 ? ` — $${effectiveAmount}` : ''}`}
        </button>
      </form>
    </div>
  )
}
