"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Transaction } from '@/hooks/use-transactions'
import { groupByCategory } from '@/lib/analytics'
import { useCurrency } from '@/hooks/use-currency'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export default function CategoryBreakdownChart({ transactions }: { transactions: Transaction[] }) {
  const { format: formatCurrency } = useCurrency()
  const data = groupByCategory(transactions)

  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-16">No expenses recorded this month yet.</p>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="category" innerRadius={60} outerRadius={100} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'rgba(20, 20, 20, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: '#fff'
            }}
          />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#888888' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
