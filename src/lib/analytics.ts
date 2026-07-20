import { Transaction } from '@/hooks/use-transactions'

export type DayBucket = { date: string; label: string; income: number; expense: number; net: number }
export type CategoryBucket = { category: string; total: number }
export type MonthBucket = { month: string; label: string; income: number; expense: number }

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

export function groupByCategory(
  transactions: Transaction[],
  month = new Date().getMonth(),
  year = new Date().getFullYear()
): CategoryBucket[] {
  const totals = new Map<string, number>()

  for (const t of transactions) {
    if (t.type !== 'expense') continue
    const d = new Date(t.date)
    if (d.getMonth() !== month || d.getFullYear() !== year) continue
    totals.set(t.category, (totals.get(t.category) || 0) + t.amount)
  }

  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export function groupByMonth(transactions: Transaction[], months = 6): MonthBucket[] {
  const buckets = new Map<string, MonthBucket>()
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    buckets.set(key, {
      month: key,
      label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      income: 0,
      expense: 0,
    })
  }

  for (const t of transactions) {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const bucket = buckets.get(key)
    if (!bucket) continue
    if (t.type === 'income') bucket.income += t.amount
    else bucket.expense += t.amount
  }

  return Array.from(buckets.values())
}
