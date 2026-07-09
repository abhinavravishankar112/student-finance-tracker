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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

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