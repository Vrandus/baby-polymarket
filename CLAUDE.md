# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server at localhost:3000
npm run build        # production build
npm run lint         # ESLint
```

## Setup

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Run `supabase/schema.sql` in the Supabase SQL editor to create the `bets` table, RLS policies, unique index, and enable realtime.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — PostgreSQL database + realtime subscriptions via `postgres_changes`
- **Recharts** — probability area chart
- **date-fns** — relative timestamps in the bet feed

## Architecture

`src/app/page.tsx` is a single client component that owns all state:
- Loads bets from Supabase on mount and subscribes to `INSERT` events for live updates
- Deduplicates incoming realtime events against optimistic updates from `onBetPlaced`
- Passes computed `MarketStats` and `ChartDataPoint[]` (derived in `src/lib/market.ts`) down to child components

**Key data flow:**
```
Supabase DB
  └── initial fetch + realtime subscription  →  bets[]  (page.tsx state)
        ├── computeMarketStats()  →  MarketHeader (probability bars, volume)
        ├── computeChartData()    →  ProbabilityChart (area chart, starts at 50/50)
        ├── existingNames[]       →  BetForm (client-side dupe check before insert)
        └── bets.reverse()        →  BetFeed (newest-first changelog)
```

**One-bet-per-person enforcement:** dual-layer — client checks `existingNames` before submit; DB has a `UNIQUE INDEX` on `lower(name)` that returns Postgres error code `23505` on collision.

**Amounts** are stored as `numeric(10,2)` in Postgres; always wrap reads with `Number(bet.amount)` since the Supabase JS client may return them as strings.
