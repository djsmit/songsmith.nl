# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Songsmith?

**Songsmith** is a songwriting tool that helps writers finish more songs by guiding them through Pat Pattison's three-boxes technique. The workflow:

1. **Spark**: Capture a song idea (emotion, situation, image)
2. **Perspectives**: AI suggests 3 angles to explore the idea
3. **Timed Freewriting**: Write without stopping for 10 minutes per perspective
4. **Anchor Words**: Select 9 key words that capture the essence
5. **Rhyme Palette**: Build rhyme options for each anchor word
6. **Draft**: Write the actual lyric with all material as reference

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2
- **Styling**: Tailwind CSS 4 + shadcn/ui + Radix UI
- **Database**: Supabase (Postgres + Auth + Row Level Security)
- **Authentication**: Supabase Auth (Google OAuth + Magic Link)
- **Language**: TypeScript with strict mode
- **Icons**: Lucide React

## Project Structure

```
/src
├── /app                          # Next.js App Router
│   ├── /(auth)                   # Auth routes (login, callback)
│   ├── /api                      # API routes
│   ├── /app                      # Authenticated app (requires login)
│   │   ├── /sessions/[id]        # Session workspace
│   │   └── /settings             # User settings
│   ├── /changelog                # Public changelog
│   ├── /privacy                  # Privacy policy
│   └── /terms                    # Terms of service
├── /components
│   ├── /auth                     # Login, user menu
│   ├── /landing                  # Landing page sections
│   ├── /layout                   # Sidebar, topbar, nav
│   ├── /songsmith                # Songsmith-specific components (to be built)
│   └── /ui                       # shadcn/ui components
├── /contexts                     # React contexts
│   ├── sidebar-context.tsx       # Sidebar state
│   └── theme-context.tsx         # Dark/light mode
├── /hooks                        # Custom hooks
├── /lib
│   ├── /actions                  # Server actions
│   ├── /supabase                 # Client/server setup
│   └── /utils                    # Utility functions
└── /types                        # TypeScript definitions
    ├── index.ts                  # Base types (Profile)
    └── songsmith.ts              # Songsmith domain types
```

### Path Alias
Use `@/*` to import from `./src/*` (configured in tsconfig.json).

## Database Schema (Supabase)

**profiles** - User accounts (existing from auth)
- `display_name`, `stage_name`, `avatar_url`
- `timer_duration` - Default timer duration in seconds (default: 600)

**sessions** - Songwriting sessions
- `title` - Optional song title/working name
- `spark` - Initial song idea
- `perspectives` - AI-suggested perspectives (JSONB)
- `status` - active | completed | archived

**boxes** - Freewriting for each perspective
- `session_id`, `perspective_index` (0, 1, 2)
- `content`, `duration_seconds`

**anchor_words** - Selected words (9 per session)
- `session_id`, `word`, `source_box`, `position` (0-8)

**rhymes** - Rhyme palette entries
- `anchor_word_id`, `word`, `rhyme_type`, `source`, `position`

**drafts** - Lyric drafts
- `session_id`, `content`, `version`

## Visual Design

- **Accent**: Teal `oklch(0.76 0.14 181.16)`
- **Fonts**:
  - Geist Mono for freewriting/draft editor
  - Lora (serif) for headings
  - Inter (sans-serif) for UI
- **Dark mode**: Purple-tinted dark background with gradient orbs

## Environment Variables

**Public (client-side)**:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_CLIENT_ID
NEXT_PUBLIC_TURNSTILE_SITE_KEY
NEXT_PUBLIC_APP_URL
```

**Server-side**:
```
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
TURNSTILE_SECRET_KEY
```

## Code Patterns

- **Server Components**: Pages fetch data server-side with `async/await`
- **Client Components**: Named with `-client.tsx` suffix for interactivity
- **Server Actions**: Used for mutations (in `/lib/actions`)
- **Contexts**: Global state (theme, sidebar)
- **Naming**: PascalCase components, camelCase utilities, snake_case DB columns

## AI Integration Points

AI features are stubbed in `/src/lib/actions/ai.ts`:
- `suggestPerspectives(spark)` - Generate 3 perspectives from song idea
- `suggestAnchorWords(boxes)` - Surface candidate words from freewriting
- `suggestRhymes(word, boxes)` - Find rhymes (perfect, near, consonance, assonance)
- `getFeedback(content, context)` - Mentor feedback on writing craft

## Key Libraries

- `@supabase/ssr` - Supabase client
- `@dnd-kit/*` - Drag and drop (for anchor word reordering)
- `sonner` - Toast notifications
- `@radix-ui/*` - UI primitives
