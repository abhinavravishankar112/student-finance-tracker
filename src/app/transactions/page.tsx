"use client"

import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { useTransactions } from '@/hooks/use-transactions'
import { useCurrency } from '@/hooks/use-currency'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TransactionsPage() {
  const { data: transactions, isLoading, deleteTransaction } = useTransactions()
  const { format: formatCurrency } = useCurrency()
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filteredTransactions = transactions?.filter(t => 
    filter === 'all' ? true : t.type === filter
  )

  return (
    <div className="md:pl-64">
      <Sidebar />
      <Header />
      <main className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Transactions</h1>
            <p className="text-muted-foreground mt-1">View, filter, and manage your history.</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 p-1 bg-secondary rounded-lg w-fit">
            {(['all', 'income', 'expense'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Card className="glass-card border-white/5 p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead> {/* Empty header for delete btn */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i} className="border-white/5">
                    <TableCell colSpan={6}><Skeleton className="h-8 w-full bg-white/5" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTransactions?.length === 0 ? (
                <TableRow className="border-white/5">
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {filteredTransactions?.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`border-white/5 group ${t.isOptimistic ? 'opacity-50' : 'hover:bg-white/5'}`}
                    >
                      <TableCell>
                        <div className={`p-2 rounded-full w-fit ${t.type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                          {t.type === 'income' ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{t.category}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{t.description || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteTransaction(t.id)}
                          disabled={t.isOptimistic}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  )
}