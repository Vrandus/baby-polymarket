'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bet } from '@/types'

interface Props {
  onBetPlaced: (bet: Bet) => void
}

const PRESET_AMOUNTS = [1, 5, 10, 20, 50]

export default function BetForm({ onBetPlaced }: Props) {
  const [name, setName] = useState('')
  const [choice, setChoice] = useState<'boy' | 'girl' | null>(null)
  const [presetAmount, setPresetAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [placed, setPlaced] = useState<Bet | null>(null)

  const nameTrimmed = name.trim()
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
    effectiveAmount > 0

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
      setError(dbError.message)
      return
    }

    const bet = data as Bet
    onBetPlaced(bet)
    setPlaced(bet)
  }

  if (placed) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center pop-in">
        <div
          className="text-6xl mb-3 inline-block animate-bounce"
          style={{ animationDuration: '0.8s', animationIterationCount: 3 }}
        >
          {placed.choice === 'boy' ? '👦🏽' : '👧🏽'}
        </div>
        <div className="font-display text-2xl font-bold text-gray-800 mb-1">
          Bet placed! 🎉
        </div>
        <p className="text-gray-500 text-sm">
          <span className="font-bold text-gray-700">{placed.name}</span> bet{' '}
          <span className={`font-bold ${placed.choice === 'boy' ? 'text-blue-500' : 'text-pink-500'}`}>
            ${Number(placed.amount).toFixed(0)} on {placed.choice === 'boy' ? 'Boy' : 'Girl'}
          </span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Good luck! 🍀</p>
        <button
          onClick={() => {
            setPlaced(null)
            setName('')
            setChoice(null)
            setPresetAmount(null)
            setCustomAmount('')
            setError(null)
          }}
          className="mt-6 w-full rounded-2xl py-3 text-sm font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition-colors"
        >
          Place another bet
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="bet-name" className="block text-sm font-bold text-gray-600 mb-1.5">
            Your Name
          </label>
          <input
            id="bet-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 placeholder-gray-300 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-200 focus:bg-white transition-colors"
          />
        </div>

        {/* Boy / Girl cards */}
        <div>
          <p className="text-sm font-bold text-gray-600 mb-2">Your Prediction</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setChoice('boy')}
              className={`rounded-3xl py-6 text-center transition-all duration-200 ${
                choice === 'boy'
                  ? 'bg-gradient-to-br from-blue-400 to-sky-500 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                  : 'bg-blue-50 border-2 border-blue-100 text-blue-400 hover:border-blue-200 hover:bg-blue-100/80'
              }`}
            >
              <div className="text-4xl mb-1.5">👦🏽</div>
              <div className="font-display text-xl font-bold">Boy</div>
            </button>
            <button
              type="button"
              onClick={() => setChoice('girl')}
              className={`rounded-3xl py-6 text-center transition-all duration-200 ${
                choice === 'girl'
                  ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-200 scale-[1.02]'
                  : 'bg-pink-50 border-2 border-pink-100 text-pink-400 hover:border-pink-200 hover:bg-pink-100/80'
              }`}
            >
              <div className="text-4xl mb-1.5">👧🏽</div>
              <div className="font-display text-xl font-bold">Girl</div>
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <p className="text-sm font-bold text-gray-600 mb-2">Bet Amount ($)</p>
          <div className="flex gap-2 flex-wrap mb-2.5">
            {PRESET_AMOUNTS.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => { setPresetAmount(amt); setCustomAmount('') }}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition-all duration-150 ${
                  presetAmount === amt
                    ? choice === 'girl'
                      ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-md shadow-pink-200'
                      : 'bg-gradient-to-br from-blue-400 to-sky-500 text-white shadow-md shadow-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="w-full rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 placeholder-gray-300 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-200 focus:bg-white transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={`w-full rounded-2xl py-4 font-display font-bold text-base transition-all duration-200 ${
            !canSubmit || loading
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : choice === 'girl'
                ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-gradient-to-r from-blue-400 to-sky-500 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {loading
            ? 'Placing bet…'
            : `Place Bet${effectiveAmount && effectiveAmount > 0 ? ` — $${effectiveAmount}` : ''} ✨`}
        </button>
      </form>
    </div>
  )
}
