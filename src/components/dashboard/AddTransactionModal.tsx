"use client"

import { useModalStore } from '@/store/modal-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner' // We will install this for notifications
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const CATEGORIES = ['Rent', 'Groceries', 'Dining Out', 'Transport', 'Entertainment', 'Books', 'Income']

export default function AddTransactionModal() {
  const supabase = createClient()
  const { isTransactionModalOpen, closeTransactionModal } = useModalStore()
  const queryClient = useQueryClient()
  
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  // Optimistic UI Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: parseFloat(amount),
        type,
        category,
        description
      })
      if (error) throw error
    },
    onMutate: async () => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['transactions'] })

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData(['transactions'])

      // Optimistically update the cache
      queryClient.setQueryData(['transactions'], (old: any) => {
        const newTransaction = {
          id: `temp-${Date.now()}`,
          amount: parseFloat(amount),
          type,
          category,
          description,
          date: new Date().toISOString(),
          isOptimistic: true // Flag for UI styling
        }
        return old ? [newTransaction, ...old] : [newTransaction]
      })

      // Return context with the snapshotted value
      return { previousTransactions }
    },
    onError: (err, newTodo, context) => {
      // If error, roll back to the snapshot
      queryClient.setQueryData(['transactions'], context?.previousTransactions)
      toast.error("Failed to add transaction. Please try again.")
    },
    onSuccess: () => {
      toast.success("Transaction added successfully!")
      // Invalidate to refetch the real data from the server
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) {
      toast.error("Please fill in all required fields.")
      return
    }
    mutate()
    // Reset form
    setAmount('')
    setCategory('')
    setDescription('')
    closeTransactionModal()
  }

  return (
    <Dialog open={isTransactionModalOpen} onOpenChange={closeTransactionModal}>
      <DialogContent className="glass-card border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Transaction</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Log a new income or expense. It will update instantly.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-lg">
            <button 
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-md text-sm font-medium transition-colors ${type === 'expense' ? 'bg-destructive text-white' : 'text-muted-foreground'}`}
            >
              Expense
            </button>
            <button 
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-md text-sm font-medium transition-colors ${type === 'income' ? 'bg-primary text-black' : 'text-muted-foreground'}`}
            >
              Income
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input 
              id="amount" 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} required>
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Input 
              id="description" 
              placeholder="e.g., Pizza for study group" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 border-white/10"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full bg-primary text-black hover:bg-primary/90 font-semibold">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}