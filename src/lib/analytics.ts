import { Transaction } from '@/hooks/use-transactions'

export type DayBucket = { date: string; label: string; income: number; expense: number; net: number }

export function groupByDay(transactions: Transaction[], days = 30): DayBucket[] {
  const buckets = new Map<string, DayBucket>()
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toDateString()
    buckets.set(key, {
      date: key,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: 0,
      expense: 0,
      net: 0,
    })
  }

  for (const t of transactions) {
    const key = new Date(t.date).toDateString()
    const bucket = buckets.get(key)
    if (!bucket) continue
    if (t.type === 'income') bucket.income += t.amount
    else bucket.expense += t.amount
    bucket.net = bucket.income - bucket.expense
  }

  return Array.from(buckets.values())
}
