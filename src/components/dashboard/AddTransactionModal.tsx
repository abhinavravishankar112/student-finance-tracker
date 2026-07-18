"use client"

import { useModalStore } from '@/store/modal-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { useCurrency } from '@/hooks/use-currency'
import { CURRENCIES } from '@/lib/currency'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { Loader2, ScanLine, Upload } from 'lucide-react'

const CATEGORIES = ['Rent', 'Groceries', 'Dining Out', 'Transport', 'Entertainment', 'Books', 'Income']

export default function AddTransactionModal() {
  const supabase = createClient()
  const { isTransactionModalOpen, closeTransactionModal } = useModalStore()
  const queryClient = useQueryClient()
  const { currency } = useCurrency()

  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Optimistic UI Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: { amount: number; type: 'income' | 'expense'; category: string; description: string }) => {
      const isMock = typeof window !== 'undefined' && localStorage.getItem('cc_mock_session') === 'true'
      if (isMock) {
        const newTransaction = {
          id: `mock-tx-${Date.now()}`,
          amount: variables.amount,
          type: variables.type,
          category: variables.category,
          description: variables.description || null,
          date: new Date().toISOString()
        }
        const localData = localStorage.getItem('cc_mock_transactions')
        const currentTransactions = localData ? JSON.parse(localData) : []
        const updated = [newTransaction, ...currentTransactions]
        localStorage.setItem('cc_mock_transactions', JSON.stringify(updated))
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: variables.amount,
        type: variables.type,
        category: variables.category,
        description: variables.description || null
      })
      if (error) throw error
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] })
      const previousTransactions = queryClient.getQueryData(['transactions'])

      queryClient.setQueryData(['transactions'], (old: any) => {
        const newTransaction = {
          id: `temp-${Date.now()}`,
          amount: variables.amount,
          type: variables.type,
          category: variables.category,
          description: variables.description || null,
          date: new Date().toISOString(),
          isOptimistic: true
        }
        return old ? [newTransaction, ...old] : [newTransaction]
      })

      return { previousTransactions }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions)
      toast.error("Failed to add transaction. Please try again.")
    },
    onSuccess: () => {
      toast.success("Transaction added successfully!")
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    }
  })

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    try {
      // Convert to base64 using a Promise so errors propagate to our catch block
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target?.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })

      // Call our secure API route
      const res = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan receipt')
      }

      setAmount(data.amount.toString())
      setCategory(data.category)
      setDescription(data.description)
      setType('expense') // Default receipt scans to expense
      toast.success("Receipt scanned! Review the details and save.")
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message ?? "Couldn't read the receipt. Try a clearer photo or enter manually.")
    } finally {
      setIsScanning(false)
      // Reset input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) {
      toast.error("Please fill in all required fields.")
      return
    }
    mutate({
      amount: parseFloat(amount),
      type,
      category,
      description
    })
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
            Log a new income or expense, or scan a receipt with AI.
          </DialogDescription>
        </DialogHeader>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleScanReceipt}
        />

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* AI Scan Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:text-primary font-medium"
          >
            {isScanning ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> AI is reading receipt...</>
            ) : (
              <><ScanLine className="h-4 w-4 mr-2" /> Scan Receipt with AI</>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or enter manually</span>
            </div>
          </div>

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
            <Label htmlFor="amount">Amount ({CURRENCIES[currency].symbol})</Label>
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
            <Select onValueChange={setCategory} value={category} required>
              <SelectTrigger className="w-full bg-background/50 border-white/10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="border-white/10" position="popper">
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

          <Button type="submit" disabled={isPending || isScanning} className="w-full bg-primary text-black hover:bg-primary/90 font-semibold">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}