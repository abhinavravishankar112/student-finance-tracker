import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export type Transaction = {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string | null
  date: string
  isOptimistic?: boolean
}

export function useTransactions() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const query = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const isMock = typeof window !== 'undefined' && localStorage.getItem('cc_mock_session') === 'true'
      if (isMock) {
        const localData = localStorage.getItem('cc_mock_transactions')
        if (localData) {
          return JSON.parse(localData)
        } else {
          const initialTransactions: Transaction[] = [
            {
              id: 'mock-tx-1',
              amount: 650.00,
              type: 'expense',
              category: 'Rent',
              description: 'July Rent payment',
              date: new Date().toISOString()
            },
            {
              id: 'mock-tx-2',
              amount: 78.50,
              type: 'expense',
              category: 'Groceries',
              description: 'Weekly Trader Joe\'s run',
              date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'mock-tx-3',
              amount: 250.00,
              type: 'income',
              category: 'Income',
              description: 'Campus Library shift',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'mock-tx-4',
              amount: 15.75,
              type: 'expense',
              category: 'Dining Out',
              description: 'Late night ramen',
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'mock-tx-5',
              amount: 120.00,
              type: 'expense',
              category: 'Books',
              description: 'CS Textbook second-hand',
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
          localStorage.setItem('cc_mock_transactions', JSON.stringify(initialTransactions))
          return initialTransactions
        }
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      return data as Transaction[]
    },
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const isMock = typeof window !== 'undefined' && localStorage.getItem('cc_mock_session') === 'true'
      if (isMock) {
        const localData = localStorage.getItem('cc_mock_transactions')
        const currentTransactions = localData ? JSON.parse(localData) : []
        const updated = currentTransactions.filter((t: any) => t.id !== id)
        localStorage.setItem('cc_mock_transactions', JSON.stringify(updated))
        return
      }

      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] })
      const previousTransactions = queryClient.getQueryData(['transactions'])

      // Optimistically remove from the list
      queryClient.setQueryData(['transactions'], (old: Transaction[] | undefined) => 
        old?.filter(t => t.id !== deletedId)
      )

      return { previousTransactions }
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions)
      toast.error("Failed to delete transaction.")
    },
    onSuccess: () => {
      toast.success("Transaction deleted.")
    }
  })

  return { ...query, deleteTransaction: deleteMutation.mutate }
}