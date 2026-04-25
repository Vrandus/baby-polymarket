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
    <div className="bg-[#1a1f2e] border border-[#1E2433] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-[#94A3B8] mb-1.5 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-3">
          <span className={p.name === 'boy' ? 'text-blue-400' : 'text-pink-400'}>
            {p.name === 'boy' ? '👦 Boy' : '👧 Girl'}
          </span>
          <span className="text-white font-bold ml-auto">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function ProbabilityChart({ data, chartHeight = 208 }: Props) {
  return (
    <div className="rounded-2xl border border-[#1E2433] bg-[#11141B] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
          Probability Over Time
        </h2>
        <div className="flex items-center gap-4 text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-400 inline-block rounded" />
            Boy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-pink-400 inline-block rounded" />
            Girl
          </span>
        </div>
      </div>

      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="boyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="girlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2433" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <ReferenceLine y={50} stroke="#2d3748" strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="linear"
              dataKey="boy"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#boyGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
            />
            <Area
              type="linear"
              dataKey="girl"
              stroke="#EC4899"
              strokeWidth={2}
              fill="url(#girlGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#EC4899', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
