"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Transaction } from '@/hooks/use-transactions'
import { groupByDay } from '@/lib/analytics'
import { useCurrency } from '@/hooks/use-currency'

export default function SpendingTrendChart({ transactions }: { transactions: Transaction[] }) {
  const { format: formatCurrency } = useCurrency()
  const data = groupByDay(transactions, 30)

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorExpenseTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'rgba(20, 20, 20, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff'
            }}
          />
          <Area type="monotone" dataKey="expense" name="Spending" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorExpenseTrend)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
