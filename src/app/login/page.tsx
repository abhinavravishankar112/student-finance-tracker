"use client"

import { createClient } from '@/lib/supabase/client'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion'
import { Loader2, ScanLine, Wallet, PiggyBank } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />

      {/* Left Side: Hero & Features */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Campus<span className="text-primary">Coin</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
            The finance tracker designed for the broke college student. Track expenses, set budgets, and scan receipts with AI.
          </p>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
            <div className="glass-card p-4 rounded-xl">
              <ScanLine className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold">AI Receipt Scanner</h3>
              <p className="text-sm text-muted-foreground mt-1">Snap a photo, let AI do the math.</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <PiggyBank className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold">Smart Budgets</h3>
              <p className="text-sm text-muted-foreground mt-1">Visual limits so you don't run out of ramen money.</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <Wallet className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold">Instant Updates</h3>
              <p className="text-sm text-muted-foreground mt-1">Optimistic UI means zero lag.</p>