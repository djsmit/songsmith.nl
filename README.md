# Fretlist

A web app for musicians to manage songs (lyrics + chords) and organize setlists.

**Live at [fretlist.com](https://fretlist.com)**

## Features

- **Chord Sheets** — Store lyrics with chords in a clean, readable format. Supports both above-line and inline chord notation.
- **Live Transposition** — Transpose any song to a different key with one click. Capo settings automatically adjust displayed chords.
- **Setlist Management** — Organize songs into setlists for gigs and rehearsals. Track venue, date, and set order.
- **Stage Ready** — Access your songs on any device. Optimized for quick reference during performances.
- **Encrypted Storage** — Song content is encrypted client-side before storage. Only you can read your lyrics.
- **Print Layouts** — Clean print styles for taking chord sheets to rehearsal.
- **Subscription Plans** — Free tier with Pro and Band upgrades via Stripe.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (Postgres + Auth + Storage)
- **Authentication**: Supabase Auth (Google OAuth + Magic Link)
- **Payments**: [Stripe](https://stripe.com/) (Subscriptions)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Installation

```bash
# Clone the repository
git clone https://github.com/djsmit/fretlist.com.git
cd fretlist.com

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENCRYPTION_SECRET=your_32_character_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BAND_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_BAND_PRICE_ID=price_...
```

Generate an encryption secret:

```bash
openssl rand -base64 32
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Deployment

Deployed on [Vercel](https://vercel.com). For production:

1. Add all environment variables to Vercel (use live Stripe keys for production)
2. In Supabase → Authentication → URL Configuration:
   - Set Site URL to your production domain
   - Add `https://yourdomain.com/auth/callback` to redirect URLs
3. In Google Cloud Console (if using Google OAuth):
   - Add production domain to authorized JavaScript origins
   - Add callback URL to authorized redirect URIs
4. In Stripe Dashboard:
   - Create a webhook endpoint pointing to `https://yourdomain.com/api/webhooks/stripe`
   - Update `STRIPE_WEBHOOK_SECRET` with the new signing secret

## Chord Sheet Format

Songs support two chord notation formats:

**Above-line format:**

```
       G              C
Strumming on my guitar tonight
       G              D
Singing songs beneath the light
```

**Inline format:**

```
[G]Strumming on my [C]guitar tonight
[G]Singing songs be[D]neath the light
```

**Section headers:**

```
## Intro
## Verse
## Chorus
## Bridge
## Outro
```

**Metadata:**

```
[Tuning = Half step down]
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes (login)
│   ├── app/               # Main authenticated app
│   │   ├── songs/         # Song routes
│   │   └── setlists/      # Setlist routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── songs/             # Song-related components
│   ├── setlists/          # Setlist-related components
│   ├── layout/            # Layout components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
│   ├── crypto/            # Encryption utilities
│   ├── supabase/          # Supabase client
│   └── utils/             # Chord parsing, transposition
└── types/                 # TypeScript types
```

## License

MIT
