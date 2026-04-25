'use client'

import { ChartDataPoint } from '@/types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface Props {
  data: ChartDataPoint[]
  chartHeight?: number
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; name: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 text-xs shadow-lg">
      <p className="text-gray-400 font-semibold mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-3">
          <span className={p.name === 'boy' ? 'text-blue-500 font-semibold' : 'text-pink-500 font-semibold'}>
            {p.name === 'boy' ? '👦🏽 Boy' : '👧🏽 Girl'}
          </span>
          <span className="text-gray-700 font-bold ml-auto">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function ProbabilityChart({ data, chartHeight = 208 }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base font-semibold text-gray-600">
          Probability Over Time
        </h2>
        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-400 inline-block rounded-full" />
            Boy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-pink-400 inline-block rounded-full" />
            Girl
          </span>
        </div>
      </div>

      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="boyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="girlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F472B6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F472B6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'var(--font-nunito)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'var(--font-nunito)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <ReferenceLine y={50} stroke="#E5E7EB" strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="linear"
              dataKey="boy"
              stroke="#60A5FA"
              strokeWidth={2.5}
              fill="url(#boyGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#60A5FA', strokeWidth: 0 }}
            />
            <Area
              type="linear"
              dataKey="girl"
              stroke="#F472B6"
              strokeWidth={2.5}
              fill="url(#girlGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#F472B6', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
