# Fokus — Flight Tracker

Track flights end to end: gates, delays, weather, live progress, and maps.

**Live:** deploy the `cursor/web-version-d737` branch on Vercel.

## Features

- Redesigned UI (sky atmosphere, Syne + DM Sans, dark mode)
- Journey timeline (Scheduled → Boarding → Departed → En route → Landed)
- Delay vs scheduled (+25m style)
- Recent searches + tracked flights (localStorage)
- Airport weather (Open-Meteo, free)
- Flight path map (Leaflet)
- Share flight link
- Optional live data via AviationStack API
- PWA manifest + installable on phone

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Live flight data (optional)

1. Get a free key at https://aviationstack.com/
2. Copy `.env.example` → `.env.local`
3. Set `AVIATIONSTACK_API_KEY=your_key`
4. Redeploy on Vercel (Project → Settings → Environment Variables)

Without a key, rich mock flights still work (AA100, DL200, UA300, BA178, EK201, NH9).

## Deploy

Vercel → Import repo → Branch: `cursor/web-version-d737` → Root: `./` → Deploy

Or: https://vercel.com/new/clone?repository-url=https://github.com/rajivharlalka/Fokus/tree/cursor/web-version-d737

## Stack

Next.js 14 · TypeScript · Tailwind · Leaflet · Open-Meteo · AviationStack (optional)
