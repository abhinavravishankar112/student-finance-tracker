"use client"

import { useModalStore } from '@/store/modal-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useBudgets } from '@/hooks/use-budgets'
import { useCurrency } from '@/hooks/use-currency'
import { CURRENCIES } from '@/lib/currency'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const CATEGORIES = ['Rent', 'Groceries', 'Dining Out', 'Transport', 'Entertainment', 'Books']

export default function AddBudgetModal() {
  const { isBudgetModalOpen, closeBudgetModal } = useModalStore()
  const { addBudget, isPending } = useBudgets()
  const { currency } = useCurrency()

  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !limit) return
    addBudget({ category, limit_amount: parseFloat(limit) })
    setCategory('')
    setLimit('')
    closeBudgetModal()
  }

  return (
    <Dialog open={isBudgetModalOpen} onOpenChange={closeBudgetModal}>
      <DialogContent className="glass-card border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Set Monthly Budget</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            How much do you want to spend in this category this month?
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category} required>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Monthly Limit ({CURRENCIES[currency].symbol})</Label>
            <Input 
              id="limit" 
              type="number" 
              placeholder="e.g., 200.00" 
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
              className="bg-background/50 border-white/10"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full bg-primary text-black hover:bg-primary/90 font-semibold">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Budget
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}