# OnlineAcademy

A production-ready multilingual online learning platform built with Next.js 14, Supabase, and Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js (credentials provider)
- **Video**: YouTube IFrame API
- **i18n**: next-intl (Uzbek 🇺🇿, Russian 🇷🇺, English 🇬🇧)
- **Deployment**: Vercel

---

## Quick Start

### 1. Clone & Install

```bash
cd "online academy"
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and keys from **Project Settings → API**

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXTAUTH_SECRET=your-random-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

ADMIN_EMAIL=admin@youracademy.com
ADMIN_PASSWORD_HASH=$2a$12$...   # see below
```

### 4. Generate Admin Password Hash

```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('yourpassword', 12))"
```

Copy the output hash into `ADMIN_PASSWORD_HASH` in `.env.local`.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it will redirect to `/uz` (default locale).

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Project Structure

```
/app
  /[locale]               ← i18n routing (uz, ru, en)
    /page.tsx             ← Homepage
    /courses/page.tsx     ← Course listing
    /courses/[id]/page.tsx← Course detail + video player
    /announcements/       ← Announcements
    /pricing/page.tsx     ← Pricing plans
  /admin
    /login/page.tsx       ← Admin login
    /page.tsx             ← Dashboard
    /courses/page.tsx     ← Course CRUD
    /announcements/       ← Announcement CRUD
    /students/page.tsx    ← Student list + CSV export
    /pricing/page.tsx     ← Pricing plan CRUD
  /api
    /auth/[...nextauth]/  ← NextAuth handler
    /enroll/              ← Student enrollment
    /admin/...            ← Protected admin APIs

/components
  /ui/                    ← shadcn/ui components
  /public-site/           ← Header, Footer, CourseCard, VideoPlayer, etc.
  /admin/                 ← Sidebar
  /providers/             ← SessionProvider

/lib
  /supabase.ts            ← Supabase clients
  /auth.ts                ← NextAuth config
  /youtube.ts             ← YouTube URL helpers
  /types.ts               ← TypeScript types + localization helpers
  /utils.ts               ← cn(), formatDate(), formatPrice()

/messages
  /uz.json                ← Uzbek translations
  /ru.json                ← Russian translations
  /en.json                ← English translations

/i18n
  /routing.ts             ← next-intl locale config
  /navigation.ts          ← Localized Link/router helpers

/supabase
  /schema.sql             ← Database schema + seed data
```

---

## Features

### Public Website
- **Homepage**: Hero, stats, featured courses, announcements, pricing, testimonials
- **Courses**: Search + category filter, course cards grid
- **Course Detail**: YouTube video player (embedded, no redirect), enrollment form
- **Announcements**: List + detail pages
- **Pricing**: Plans from database
- **Language Switcher**: UZ | RU | EN in header, persists to localStorage

### Admin Panel (`/admin`)
- **Dashboard**: Stats overview + recent enrollments
- **Courses**: Full CRUD with multilingual tabs (UZ/RU/EN)
- **Announcements**: Full CRUD with multilingual tabs
- **Students**: Search, view, export to CSV
- **Pricing**: Full CRUD with feature lists

### Video Player
- Uses YouTube IFrame API
- Admin pastes full YouTube URL → system extracts video ID automatically
- Custom thumbnail + click-to-play UI
- 16:9 responsive, plays directly on site (no YouTube redirect)

---

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/online-academy.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Add all environment variables from `.env.local`
4. Deploy!

### Environment Variables for Vercel

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `NEXTAUTH_SECRET` | Random string ≥32 chars |
| `NEXTAUTH_URL` | Your Vercel deployment URL |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password |

> **Note**: Update `NEXTAUTH_URL` to your actual Vercel domain after first deploy.

---

## Supabase RLS Configuration

The schema sets up Row Level Security automatically:

- **courses**: Public can SELECT where `is_published = true`
- **announcements**: Public can SELECT where `is_published = true`
- **pricing_plans**: Public can SELECT where `is_active = true`
- **students**: No public access (all operations via service role key in API routes)

---

## Admin Password

To change the admin password:

```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('NEW_PASSWORD', 12))"
```

Update `ADMIN_PASSWORD_HASH` in your environment variables.

---

## Adding Languages

To add a new language (e.g., Turkish):

1. Add `'tr'` to the `locales` array in `i18n/routing.ts`
2. Create `messages/tr.json` (copy from `en.json` and translate)
3. Add the locale button to `components/public-site/Header.tsx`
4. Add corresponding database columns (`title_tr`, etc.) to Supabase

---

## License

MIT — feel free to use for personal or commercial projects.
