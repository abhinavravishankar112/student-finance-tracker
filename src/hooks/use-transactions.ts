import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

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

  return useQuery<Transaction[]>({
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
}