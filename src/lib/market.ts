import { format } from 'date-fns'
import { Bet, ChartDataPoint, MarketStats } from '@/types'

export function computeMarketStats(bets: Bet[]): MarketStats {
  const boyBets = bets.filter(b => b.choice === 'boy')
  const girlBets = bets.filter(b => b.choice === 'girl')
  const boyVolume = boyBets.reduce((sum, b) => sum + Number(b.amount), 0)
  const girlVolume = girlBets.reduce((sum, b) => sum + Number(b.amount), 0)
  const totalVolume = boyVolume + girlVolume
  const boyPct = totalVolume === 0 ? 50 : (boyVolume / totalVolume) * 100
  const girlPct = totalVolume === 0 ? 50 : (girlVolume / totalVolume) * 100

  return {
    boyVolume,
    girlVolume,
    totalVolume,
    boyPct,
    girlPct,
    boyCount: boyBets.length,
    girlCount: girlBets.length,
    totalBets: bets.length,
  }
}

export function computeChartData(bets: Bet[]): ChartDataPoint[] {
  const sorted = [...bets].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const points: ChartDataPoint[] = [{ label: 'Start', boy: 50, girl: 50 }]

  // Need at least 2 points for recharts to draw a line
  if (sorted.length === 0) {
    points.push({ label: '...', boy: 50, girl: 50 })
    return points
  }

  let boyTotal = 0
  let girlTotal = 0

  sorted.forEach(bet => {
    if (bet.choice === 'boy') boyTotal += Number(bet.amount)
    else girlTotal += Number(bet.amount)
    const total = boyTotal + girlTotal
    points.push({
      label: format(new Date(bet.created_at), 'h:mm a'),
      boy: Math.round((boyTotal / total) * 1000) / 10,
      girl: Math.round((girlTotal / total) * 1000) / 10,
    })
  })

  return points
}
