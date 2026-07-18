"use client"

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CurrencyCode, DEFAULT_CURRENCY, isCurrencyCode } from '@/lib/currency'
import { formatCurrency } from '@/lib/utils'

const STORAGE_KEY = 'cc_currency'

type CurrencyContextValue = {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  format: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isCurrencyCode(stored)) setCurrencyState(stored)
  }, [])

  const setCurrency = (next: CurrencyCode) => {
    setCurrencyState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  const value = useMemo<CurrencyContextValue>(() => ({
    currency,
    setCurrency,
    format: (amount: number) => formatCurrency(amount, currency),
  }), [currency])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
