# CampusCoin 🪙

CampusCoin is a modern, AI-powered finance tracker designed specifically for college students. Featuring a sleek "Midnight Glass" UI, optimistic updates for zero-latency feedback, and an AI receipt scanner, it turns boring budgeting into a delightful experience.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-Vision_API-412991?style=for-the-badge&logo=openai)

## ✨ Features

- **AI Receipt Scanner:** Upload a photo of a receipt, and OpenAI's Vision API instantly extracts the merchant, amount, and category, auto-filling the transaction form.
- **Optimistic UI Architecture:** Built with React Query and Zustand. When a user adds or deletes a transaction, the UI updates instantly before the server even responds, rolling back gracefully if an error occurs.
- **Row Level Security (RLS):** Strict Supabase Postgres RLS policies ensure users can never query or mutate another user's financial data.
- **Smart Budgets:** Visual progress bars that dynamically change color (green -> yellow -> red) as students approach their spending limits.
- **Premium Dark UI:** Custom "Midnight Glass" design system utilizing Tailwind CSS, Framer Motion for fluid animations, and Tremor/Recharts for data visualization.
- **PWA Ready:** Installable on mobile devices for a native-app-like experience.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Animations:** Framer Motion
- **Backend/Database:** Supabase (PostgreSQL)
- **State Management:** React Query (Server) + Zustand (Client)
- **AI:** OpenAI Vision API (gpt-4o-mini)
- **Hosting:** Vercel

## 🚀 Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/yourusername/campuscoin.git
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables (`.env.local`)
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_key
   ```
4. Run the development server
   ```bash
   npm run dev
   ```

## 🏗 Architecture Diagram

[ Add a simple screenshot of your Supabase schema or an ERD diagram here ]

---
Built with 💚 and a lot of caffeine.
```

### Your Final Task:
1. Upgrade the Login page.
2. Add the PWA files (`manifest.json` and `icon.svg`).
3. Write the `README.md`.
4. Run `npm run dev` and look at your landing page!