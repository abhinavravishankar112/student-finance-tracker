# CampusCoin

A finance tracker built for the realities of student life: irregular income, tight budgets, and zero patience for clunky spreadsheets. CampusCoin pairs an AI receipt scanner with an optimistic, instant-feedback interface so tracking money never feels like a chore.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![Gemini](https://img.shields.io/badge/Gemini-Vision-8E75B2?style=flat-square&logo=googlegemini)
![Recharts](https://img.shields.io/badge/Recharts-Charts-FF6B6B?style=flat-square)

## Overview

Most budgeting apps ask students to manually key in every transaction — a habit that rarely survives past week one. CampusCoin removes that friction: photograph a receipt and the app extracts the merchant, amount, and category automatically. Every action, from adding a transaction to updating a budget, reflects in the UI immediately, with graceful rollback if the underlying request fails.

The app ships with a no-login demo mode, so anyone can try it against locally stored sample data before connecting a real Supabase project.

## Features

- **AI Receipt Scanning** — Upload a photo and Google Gemini extracts the merchant, amount, and spending category. Requests automatically fail over across `gemini-3.5-flash`, `gemini-3.1-flash-lite`, and `gemini-2.0-flash` when a model hits its quota, so scanning stays reliable without manual intervention.
- **Optimistic UI** — Transactions and budgets update on screen the instant you act, powered by React Query for server state and Zustand for UI state, then reconcile (or roll back) once the server responds.
- **Row Level Security** — Every query runs against Supabase Postgres with RLS policies enforced at the database layer, so a user's financial data is never reachable by anyone else — even in the event of an application bug.
- **Smart Budgets** — Per-category budgets with progress indicators that shift from green to amber to red as a limit approaches, giving an at-a-glance read on spending health.
- **Analytics** — A dedicated page breaking down spending trends over the last 30 days, expenses by category, and income vs. expense across the last 6 months.
- **Multi-Currency Support** — Switch the display currency (INR, USD, EUR, GBP, JPY, AUD) from Settings; the choice persists locally and formats every amount app-wide.
- **Demo Mode** — Explore the full app with locally stored mock data and no account required, via "Try Demo Mode" on the login screen.
- **Installable PWA** — Add CampusCoin to a phone's home screen for a native-app-like experience.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React Compiler) |
| Language | TypeScript |
| UI | Tailwind CSS, Radix UI / shadcn, Framer Motion |
| Data Visualization | Recharts |
| Server State | TanStack React Query |
| Client State | Zustand |
| Database & Auth | Supabase (PostgreSQL, Google OAuth) |
| Receipt AI | Google Gemini (`@google/genai`) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini

### Setup

```bash
git clone https://github.com/yourusername/campuscoin.git
cd campuscoin
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the dev server:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). Sign in with Google, or select **Try Demo Mode** on the login screen to explore without configuring Supabase.

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Home dashboard
│   ├── analytics/       # Spending trends, category breakdown, income vs. expense
│   ├── api/scan-receipt/ # Gemini-backed receipt parsing endpoint
│   ├── auth/callback/   # Supabase OAuth callback
│   ├── budgets/         # Budget management
│   ├── login/           # Auth + demo mode entry
│   ├── settings/        # Currency preferences
│   └── transactions/    # Transaction history
├── components/          # Dashboard UI and shadcn primitives
├── hooks/                # React Query hooks, currency context
├── lib/                  # Supabase clients, currency, analytics, formatting utilities
└── store/                # Zustand stores
```

## Security Model

Financial data is scoped per user through Supabase Row Level Security policies rather than application-level checks alone, so access control holds even if a client-side guard is bypassed.
