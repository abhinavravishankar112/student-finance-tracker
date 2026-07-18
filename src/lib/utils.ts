import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CURRENCIES, DEFAULT_CURRENCY, type CurrencyCode } from "./currency"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatCurrency(amount: number, currency: CurrencyCode = DEFAULT_CURRENCY) {
  return new Intl.NumberFormat(CURRENCIES[currency].locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}