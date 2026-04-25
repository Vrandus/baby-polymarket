export interface Bet {
  id: string
  name: string
  choice: 'boy' | 'girl'
  amount: number
  created_at: string
}

export interface MarketStats {
  boyVolume: number
  girlVolume: number
  totalVolume: number
  boyPct: number
  girlPct: number
  boyCount: number
  girlCount: number
  totalBets: number
}

export interface ChartDataPoint {
  label: string
  boy: number
  girl: number
}
