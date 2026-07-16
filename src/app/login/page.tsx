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
              <p className="text-sm text-muted-foreground mt-1">Visual limits so you don&apos;t run out of ramen money.</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <Wallet className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold">Instant Updates</h3>
              <p className="text-sm text-muted-foreground mt-1">Optimistic UI means zero lag.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Login Card */}
      <div className="flex items-center justify-center p-8 md:p-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-8 rounded-2xl w-full max-w-sm space-y-6"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">Sign in to manage your finances</p>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FcGoogle className="h-5 w-5" />
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.setItem('cc_mock_session', 'true')
              window.location.href = '/'
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer"
          >
            Try Demo Mode (No Login)
          </button>

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our{' '}
            <span className="underline cursor-pointer">Terms</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}