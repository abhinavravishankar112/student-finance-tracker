"use client"

import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrency } from '@/hooks/use-currency'
import { CURRENCIES, CurrencyCode } from '@/lib/currency'

export default function SettingsPage() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="md:pl-64">
      <Sidebar />
      <Header />
      <main className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your CampusCoin preferences.</p>
        </div>

        <Card className="glass-card border-white/5 p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-1">Currency</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the currency used to display amounts across the app.
          </p>
          <div className="space-y-2">
            <Label htmlFor="currency">Display Currency</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
              <SelectTrigger id="currency" className="bg-background/50 border-white/10">
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                {Object.entries(CURRENCIES).map(([code, { label, symbol }]) => (
                  <SelectItem key={code} value={code}>
                    {symbol} {label} ({code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      </main>
    </div>
  )
}
