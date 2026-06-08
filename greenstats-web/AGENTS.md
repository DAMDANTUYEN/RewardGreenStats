<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.1) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Run `npm install` first, then read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint (flat config, next/core-web-vitals) |

Run `npm install` before anything else.

## Stack & conventions

- **Next.js 16 App Router** — all pages are `"use client"`; no Server Components or Server Actions
- **Tailwind CSS v4** — new `@import "tailwindcss"` syntax in `globals.css`; no `tailwind.config.js`
- **React 19** — be aware of breaking changes vs 18
- **JavaScript (no TypeScript)** — path alias `@/` → `./src/` (configured in `jsconfig.json`)
- **Icons** — `lucide-react` throughout

## Supabase

- Public client: `@supabase/supabase-js` singleton in `src/lib/supabase.js`
- Admin client (bypasses RLS): created inline in API routes using `SUPABASE_SERVICE_ROLE_KEY`
- Database schema: `profiles`, `prizes`, `inventory`, `spin_history` (see `../../db.sql`)

## Required env vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY    # server-side only
GOOGLE_WEBHOOK_SECRET
```

## Key structural facts

- **API routes** follow App Router convention: `route.js` exports named HTTP methods (`POST`)
- **No shared component directory** — each page defines UI inline; no `src/components/`
- **Admin guard** — `src/app/admin/layout.js` checks auth + hardcoded `ADMIN_EMAILS`
- **Destinations page** wraps `useSearchParams` in `<Suspense>` (required by Next.js)
- **`axios` and `canvas-confetti`** are declared in `package.json` but unused in source

## Route map

| Route | File |
|-------|------|
| `/` | `src/app/page.js` |
| `/admin` | `src/app/admin/page.js` |
| `/contact` | `src/app/contact/page.js` |
| `/destinations` | `src/app/destinations/page.js` |
| `/spin` | `src/app/spin/page.js` |
| `POST /api/spin` | `src/app/api/spin/route.js` |
| `POST /api/webhooks/google-form` | `src/app/api/webhooks/google-form/route.js` |
