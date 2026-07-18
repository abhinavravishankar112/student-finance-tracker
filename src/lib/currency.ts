export const CURRENCIES = {
  INR: { label: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  USD: { label: 'US Dollar', symbol: '$', locale: 'en-US' },
  EUR: { label: 'Euro', symbol: '€', locale: 'en-IE' },
  GBP: { label: 'British Pound', symbol: '£', locale: 'en-GB' },
  JPY: { label: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  AUD: { label: 'Australian Dollar', symbol: '$', locale: 'en-AU' },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

export const DEFAULT_CURRENCY: CurrencyCode = 'INR'

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCIES
}
