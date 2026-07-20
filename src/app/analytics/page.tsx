"use client"

import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { useTransactions } from '@/hooks/use-transactions'
import { useCurrency } from '@/hooks/use-currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, Tag, CalendarDays } from 'lucide-react'
import SpendingTrendChart from '@/components/analytics/SpendingTrendChart'
import CategoryBreakdownChart from '@/components/analytics/CategoryBreakdownChart'
import IncomeVsExpenseChart from '@/components/analytics/IncomeVsExpenseChart'
import { groupByCategory, groupByMonth } from '@/lib/analytics'

export default function AnalyticsPage() {
  const { data: transactions, isLoading } = useTransactions()
  const { format: formatCurrency } = useCurrency()

  const txns = transactions || []
  const categories = groupByCategory(txns)
  const topCategory = categories[0]

  const dayOfMonth = new Date().getDate()
  const currentMonthExpense = categories.reduce((sum, c) => sum + c.total, 0)
  const avgDailySpend = currentMonthExpense / dayOfMonth

  const [prevMonth, currMonth] = groupByMonth(txns, 2)
  const momChange = prevMonth && prevMonth.expense > 0
    ? ((currMonth.expense - prevMonth.expense) / prevMonth.expense) * 100
    : null

  return (
    <div className="md:pl-64">
      <Sidebar />
      <Header />
      <main className="p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">A closer look at how your money moves.</p>
        </div>

        {/* Stat row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Category</CardTitle>
              <Tag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32 bg-white/5" />
              ) : topCategory ? (
                <>
                  <div className="text-2xl font-bold">{topCategory.category}</div>
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(topCategory.total)} this month</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No expenses yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Daily Spend</CardTitle>
              <CalendarDays className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32 bg-white/5" />
              ) : (
                <div className="text-2xl font-bold">{formatCurrency(avgDailySpend)}</div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vs. Last Month</CardTitle>
              {momChange !== null && momChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-destructive" />
              ) : (
                <TrendingDown className="h-4 w-4 text-primary" />
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32 bg-white/5" />
              ) : momChange === null ? (
                <p className="text-sm text-muted-foreground">Not enough data</p>
              ) : (
                <div className={`text-2xl font-bold ${momChange > 0 ? 'text-destructive' : 'text-primary'}`}>
                  {momChange > 0 ? '+' : ''}{momChange.toFixed(0)}%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Spending trend */}
        <Card className="glass-card border-white/5 p-6">
          <CardTitle className="mb-6">Spending Trend (30 Days)</CardTitle>
          {isLoading ? <Skeleton className="h-[300px] w-full bg-white/5" /> : <SpendingTrendChart transactions={txns} />}
        </Card>

        {/* Category breakdown + income vs expense */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass-card border-white/5 p-6">
            <CardTitle className="mb-6">Spending by Category</CardTitle>
            {isLoading ? <Skeleton className="h-[300px] w-full bg-white/5" /> : <CategoryBreakdownChart transactions={txns} />}
          </Card>

          <Card className="glass-card border-white/5 p-6">
            <CardTitle className="mb-6">Income vs. Expense</CardTitle>
            {isLoading ? <Skeleton className="h-[300px] w-full bg-white/5" /> : <IncomeVsExpenseChart transactions={txns} />}
          </Card>
        </div>
      </main>
    </div>
  )
}
