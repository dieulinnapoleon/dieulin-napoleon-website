# Dieulin Napoleon — Professional Website

A production-ready personal brand platform built with **Next.js 14**, **TypeScript**, **Firebase**, and **Tailwind CSS**.

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home
│   ├── about/             # About page
│   ├── cv/                # CV / Resume
│   ├── projects/          # Projects (with client-side filtering)
│   ├── insights/          # Blog listing + [slug] dynamic routes
│   ├── services/          # Services grid
│   ├── contact/           # Contact form (Zod validation)
│   ├── media/             # Media & recognition
│   ├── admin/             # Protected admin dashboard
│   │   ├── login/         # Firebase Auth login
│   │   ├── dashboard/     # Overview with stats
│   │   ├── blog/          # Blog CRUD
│   │   ├── projects/      # Projects CRUD
│   │   ├── cv/            # CV management (education, experience, meta)
│   │   ├── services/      # Services CRUD
│   │   ├── messages/      # Contact submissions viewer
│   │   ├── media/         # Media items CRUD
│   │   ├── settings/      # Social links management
│   │   └── site-settings/ # Global site settings
│   └── api/
│       ├── admin/         # Admin CRUD API (Firestore via Admin SDK)
│       ├── auth/          # Session management (login/logout/verify)
│       ├── contact/       # Contact form submissions
│       └── revalidate/    # On-demand ISR revalidation
├── components/
│   ├── ui/                # Reusable UI (Button, etc.)
│   └── layout/            # Navigation, Footer, LanguageSwitcher
├── lib/
│   ├── firebase-client.ts # Browser-side Firebase SDK (Auth, Firestore, Storage)
│   ├── firebase-admin.ts  # Server-side Firebase Admin SDK
│   ├── admin-api.ts       # Client-side helper for admin CRUD via /api/admin
│   ├── data.ts            # Data fetching (Firestore Admin SDK)
│   └── utils.ts           # Utility functions
├── styles/globals.css     # Tailwind + custom styles
├── types/index.ts         # TypeScript interfaces
├── middleware.ts           # Route protection (__session cookie check)
└── i18n/                  # EN/FR/HT translations
firebase/
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Composite indexes
├── storage.rules          # Firebase Storage security rules
└── seed.ts                # Database seed script
```

## Firestore Collection Structure

```
blogPosts/{docId}
  title, slug, category, excerpt, content[], tags[], published, featured,
  read_time, original_lang, created_at, updated_at

projects/{docId}
  title, slug, category, description, problem, solution, role, status,
  tech[], impact, url, image_url, sort_order, published, created_at, updated_at

services/{docId}
  title, description, for_whom, deliverables, outcomes, icon, sort_order,
  published, created_at, updated_at

cvSections/education/items/{docId}
  degree, institution, year, details, sort_order

cvSections/experience/items/{docId}
  title, organization, period, description, sub_items[], sort_order

cvSections/meta  (single document)
  summary, skills[], languages[], certifications[], awards[]

hero/main  (single document)
  tagline, title, subtitle, cta_primary, cta_secondary

contactMessages/{docId}
  name, email, organization, reason, message, read, created_at

socialLinks/{docId}
  platform, url, icon, sort_order

siteSettings/{key}
  value

mediaItems/{docId}
  title, description, type, url, date, sort_order

adminUsers/{uid}
  email, role
```

## Prerequisites

- Node.js 18+
- A Firebase project (Blaze plan recommended for full features)
- A Vercel account (for deployment)

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd dn-firebase
npm install
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Authentication** → Email/Password sign-in method
3. Enable **Cloud Firestore** → Start in production mode
4. Enable **Storage** → Start in production mode
5. Go to **Project Settings** → **General** → Add a **Web app**
   - Copy the Firebase config values

### 3. Firebase Admin SDK

1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key** → download JSON
3. Save as `firebase/service-account-key.json` (gitignored)

### 4. Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase values:

```env
# Client SDK (from Firebase Console → Web app config)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Admin SDK
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase/service-account-key.json

# Site
NEXT_PUBLIC_SITE_URL=https://dieulinnapoleon.com
REVALIDATION_SECRET=your-random-secret
```

### 5. Deploy Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules,storage
firebase deploy --only firestore:indexes
```

### 6. Create Admin User

1. In Firebase Console → **Authentication** → **Add user**
2. Create with email + password
3. Copy the **User UID**
4. In **Firestore** → Create document:
   - Collection: `adminUsers`
   - Document ID: `<the UID you copied>`
   - Fields: `email` (string), `role` = `"admin"`

### 7. Seed Data

```bash
npx tsx firebase/seed.ts
```

This loads all 11 blog posts, 6 projects, 6 services, full CV, social links, media items, hero content, and site settings.

### 8. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy on Vercel

1. Import at [vercel.com/new](https://vercel.com/new)
2. Add environment variables — use **individual values** instead of the JSON file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   NEXT_PUBLIC_SITE_URL=https://dieulinnapoleon.com
   REVALIDATION_SECRET=...
   ```
3. Deploy

### 3. Custom Domain

1. Vercel → Settings → Domains → Add `dieulinnapoleon.com`
2. Update DNS as instructed
3. Update `NEXT_PUBLIC_SITE_URL` to match

## Auth Flow

1. Admin visits `/admin/login` → enters email/password
2. Firebase Client SDK authenticates → returns ID token
3. ID token sent to `/api/auth/login` → Admin SDK verifies token, checks `adminUsers` collection
4. Server creates a session cookie (`__session`, 5-day expiry, httpOnly)
5. Middleware checks cookie on all `/admin/*` routes
6. API routes verify session cookie before any Firestore write

## Admin Dashboard

Navigate to `/admin/login` and sign in.

The dashboard provides full CRUD for:
- **Blog Posts** — create, edit, publish/unpublish, featured toggle, content JSON editor
- **Projects** — all fields including tech stack, status, role, impact
- **CV** — education, experience (with sub-items for lecturer role), summary, skills, languages, certifications, awards
- **Services** — title, description, for_whom, deliverables, outcomes, icon, ordering
- **Messages** — view contact submissions, mark read/unread, reply via email, delete
- **Media** — awards, press, speaking, platform items
- **Social Links** — manage footer/site social links
- **Site Settings** — global configuration (titles, descriptions, email, analytics)

## Key Features

- **Firebase Auth** — Email/password with server-side session cookies
- **Firestore** — Real-time database with security rules and composite indexes
- **Firebase Storage** — Resume PDF and image uploads with auth-gated rules
- **ISR** — Blog and project pages revalidate hourly; on-demand via `/api/revalidate`
- **SEO** — Per-page metadata, Open Graph, JSON-LD (Person + Article), dynamic sitemap, robots.txt
- **Form Validation** — Zod schemas with react-hook-form on contact page
- **i18n Ready** — Language switcher (EN/FR/HT) with cookie-based locale storage
- **Responsive** — Mobile-first design with scroll-aware navigation
- **Accessibility** — Semantic HTML, ARIA labels, focus management

## Factual Corrections Applied

| Item | Incorrect (prototype) | Correct (production) |
|---|---|---|
| Creasti tech stack | React Native, Node.js | **Flutter, Firebase, Riverpod** |
| Pegasus fellowship | 2023–2024 | **2025** |
| GTA at CSU | 2023–2024 | **2024–2025** |

## License

Private. All rights reserved.
