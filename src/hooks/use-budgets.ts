import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export type Budget = {
  id: string
  category: string
  limit_amount: number
  month: number
  year: number
}

export function useBudgets() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const query = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: async () => {
      const isMock = typeof window !== 'undefined' && localStorage.getItem('cc_mock_session') === 'true'
      if (isMock) {
        const localData = localStorage.getItem('cc_mock_budgets')
        return localData ? JSON.parse(localData) : []
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', currentMonth)
        .eq('year', currentYear)

      if (error) throw error
      return data as Budget[]
    },
  })

  const addBudgetMutation = useMutation({
    mutationFn: async (newBudget: { category: string; limit_amount: number }) => {
      const isMock = typeof window !== 'undefined' && localStorage.getItem('cc_mock_session') === 'true'
      if (isMock) {
        const newLocalBudget = {
          id: `mock-bg-${Date.now()}`,
          category: newBudget.category,
          limit_amount: newBudget.limit_amount,
          month: currentMonth,
          year: currentYear
        }
        const localData = localStorage.getItem('cc_mock_budgets')
        const currentBudgets = localData ? JSON.parse(localData) : []
        currentBudgets.push(newLocalBudget)
        localStorage.setItem('cc_mock_budgets', JSON.stringify(currentBudgets))
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from('budgets').insert({
        user_id: user.id,
        category: newBudget.category,
        limit_amount: newBudget.limit_amount,
        month: currentMonth,
        year: currentYear
      })
      if (error) throw error
    },
    onSuccess: () => {
      toast.success("Budget created!")
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
    onError: () => toast.error("Failed to create budget.")
  })

  return { ...query, addBudget: addBudgetMutation.mutate }
}