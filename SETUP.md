# QuranTogether — Setup & Deployment Guide

## 1. Supabase Setup

### Create a project
1. Go to https://supabase.com and create a new project
2. Note your **Project URL** and **API keys** (Settings → API)

### Run the database migration
1. In your Supabase dashboard, go to **SQL Editor**
2. Open and run `supabase/migrations/001_initial_schema.sql`

### Enable authentication providers
1. Go to **Authentication → Providers**
2. Enable **Email** (magic links are enabled by default)
3. Enable **Google OAuth**:
   - Create OAuth credentials at https://console.cloud.google.com
   - Add your Supabase callback URL as an authorized redirect URI
   - Paste Client ID and Secret into Supabase

### Configure auth redirect URLs
In **Authentication → URL Configuration**, add:
- Site URL: `https://your-domain.com` (or `http://localhost:3000` for dev)
- Redirect URLs: `https://your-domain.com/auth/callback`

---

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # Keep secret!
NEXT_PUBLIC_APP_URL=http://localhost:3000          # Change for production
```

---

## 3. Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 4. Deploy to Vercel

1. Push your code to GitHub
2. Import the repo at https://vercel.com/new
3. Add all 4 environment variables in the Vercel project settings
4. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://qurantogether.vercel.app`)
5. Deploy

---

## Architecture Overview

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 App Router + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (magic link + Google + anonymous) |
| Realtime | Supabase Realtime (live grid updates) |

### Key Routes

| Route | Description |
|-------|-------------|
| `/` | Public homepage — all active journeys |
| `/journeys/new` | Create a new journey |
| `/journeys/[id]` | Journey detail + interactive grid |
| `/dashboard` | User dashboard — my journeys + assignments |
| `/auth/login` | Sign in with email magic link, Google, or guest |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/journeys` | List all active journeys |
| POST | `/api/journeys` | Create new journey |
| GET | `/api/journeys/[id]` | Get journey detail |
| POST | `/api/journeys/[id]/join` | Join via invite code |
| POST | `/api/units/[unitId]/assign` | Assign unit to user |
| DELETE | `/api/units/[unitId]/assign` | Unassign unit |
| PATCH | `/api/units/[unitId]/status` | Mark complete/incomplete |
| GET | `/api/participants/[journeyId]` | Get participants with stats |

### Sharing a Journey

Every journey has a unique `invite_code`. The shareable URL is:
```
/journeys/[id]?code=[invite_code]
```

When a visitor opens this URL, the Join banner auto-populates the code — they just tap "Join Journey".
