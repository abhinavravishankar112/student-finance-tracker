"use client"

import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { useTransactions } from '@/hooks/use-transactions'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts' // We'll use Recharts directly, it's already installed via Tremor/Shadcn

export default function DashboardPage() {
  const { data: transactions, isLoading } = useTransactions()

  // Calculations
  const income = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0
  const expenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0
  const balance = income - expenses

  // Chart Data formatting (last 7 days dummy logic for visual flair)
  // In a real app, you'd group by date. We'll do a quick mock for now to make it look alive.
  const chartData = (transactions || []).slice(0, 7).reverse().map(t => ({
    date: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
    amount: t.type === 'expense' ? -t.amount : t.amount
  }))

  return (
    <>
      <Sidebar />
      <Header />
      <main className="p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your financial snapshot.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Balance Card */}
          <Card className="glass-card border-white/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? (
                <Skeleton className="h-8 w-32 bg-white/5" />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-3xl font-bold ${balance >= 0 ? 'text-primary' : 'text-destructive'}`}
                >
                  {formatCurrency(balance)}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Income Card */}
          <Card className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32 bg-white/5" />
              ) : (
                <div className="text-3xl font-bold text-primary">{formatCurrency(income)}</div>
              )}
            </CardContent>
          </Card>

          {/* Expense Card */}
          <Card className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32 bg-white/5" />
              ) : (
                <div className="text-3xl font-bold text-destructive">{formatCurrency(expenses)}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart and Recent Transactions */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Chart */}
          <Card className="glass-card border-white/5 p-6">
            <CardTitle className="mb-6">Recent Activity</CardTitle>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 20, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="glass-card border-white/5 p-6">
            <CardTitle className="mb-6">Recent Transactions</CardTitle>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {isLoading ? (
                [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full bg-white/5" />)
              ) : transactions?.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-10">No transactions yet. Add one to get started!</p>
              ) : (
                <AnimatePresence>
                  {transactions?.slice(0, 6).map((t, index) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${t.isOptimistic ? 'bg-white/5 animate-pulse' : 'hover:bg-white/5 transition-colors'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                          {t.type === 'income' ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t.category}</p>
                          <p className="text-xs text-muted-foreground">{t.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${t.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}