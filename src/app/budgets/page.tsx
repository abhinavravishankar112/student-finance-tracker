"use client"

import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { useBudgets } from '@/hooks/use-budgets'
import { useTransactions } from '@/hooks/use-transactions'
import { useCurrency } from '@/hooks/use-currency'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useModalStore } from '@/store/modal-store'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BudgetsPage() {
  const { data: budgets, isLoading } = useBudgets()
  const { data: transactions } = useTransactions()
  const { openBudgetModal } = useModalStore()
  const { format: formatCurrency } = useCurrency()

  // Calculate spent amount per category for the CURRENT month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const calculateSpent = (category: string) => {
    return transactions
      ?.filter(t => 
        t.type === 'expense' && 
        t.category === category &&
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0) || 0
  }

  return (
    <div className="md:pl-64">
      <Sidebar />
      <Header />
      <main className="p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monthly Budgets</h1>
            <p className="text-muted-foreground mt-1">Track your spending limits for this month.</p>
          </div>
          <Button onClick={openBudgetModal} className="bg-primary text-black hover:bg-primary/90 font-semibold">
            <Plus className="h-4 w-4 mr-1" /> Set Budget
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full bg-white/5 rounded-xl" />)
          ) : budgets?.length === 0 ? (
            <Card className="glass-card border-white/5 p-10 col-span-full text-center">
              <p className="text-muted-foreground">No budgets set for this month. Click "Set Budget" to get started!</p>
            </Card>
          ) : (
            budgets?.map((budget, index) => {
              const spent = calculateSpent(budget.category)
              const percentage = Math.min((spent / budget.limit_amount) * 100, 100)
              const isOver = spent > budget.limit_amount
              const isWarning = percentage >= 80 && !isOver
              
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-card border-white/5 p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold">{budget.category}</h3>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${isOver ? 'bg-destructive/20 text-destructive' : isWarning ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'}`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-2xl font-bold mb-4">
                        {formatCurrency(spent)} 
                        <span className="text-sm font-normal text-muted-foreground"> / {formatCurrency(budget.limit_amount)}</span>
                      </p>
                      <Progress 
                        value={percentage} 
                        className="h-2 bg-secondary [&>div]:bg-primary [&>div]:transition-all" 
                      />
                    </div>
                    <div className="mt-4 text-sm">
                      {isOver ? (
                        <p className="text-destructive font-medium">Over budget by {formatCurrency(spent - budget.limit_amount)}!</p>
                      ) : (
                        <p className="text-muted-foreground">{formatCurrency(budget.limit_amount - spent)} left to spend</p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}