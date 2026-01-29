# SONGSMITH — Build from Fretlist Scaffold

You are helping me transform a clone of Fretlist (a song/setlist manager for musicians) into Songsmith, a songwriting tool based on Pat Pattison's three-boxes technique.

## Context

Songsmith helps songwriters finish songs by guiding them through Pat Pattison's proven technique:
1. Capture a song idea (the "spark")
2. Explore it from three AI-suggested perspectives via timed freewriting
3. Select 9 anchor words from the freewriting material
4. Build a rhyme palette for each anchor word
5. Draft the actual lyric with all material as reference

The tool includes an AI mentor that provides craft feedback on demand.

---

## Phase 1: Strip to Scaffold

Remove all Fretlist-specific code while keeping the infrastructure:

### KEEP:
- Next.js 16 + App Router structure
- Supabase setup (client/server patterns, auth)
- Tailwind 4 + shadcn/ui + Radix UI components
- Theme context (dark/light mode)
- Sidebar context and layout shell
- Auth flow (Google OAuth + Magic Link)
- Server actions pattern in `/lib/actions`
- The `-client.tsx` naming convention
- Turnstile spam protection
- Environment variable structure
- Geist Mono, Lora, Inter fonts
- Teal accent color

### REMOVE:
- All song, setlist, chord-related code and components
- `/components/songs`, `/components/setlists`, `/components/export`
- Encryption system (`/lib/crypto`, `use-encryption.ts`)
- Stripe/subscription system (`/components/subscription`, `subscription-context.tsx`)
- Export functionality (`/lib/export`)
- Chord parsing utilities (`/lib/utils` chord-related)
- `/lib/constants.ts` (keys, tunings, chord shapes)
- Feedback system
- Landing page content (keep structure, clear content)
- All Fretlist copy/branding

### RENAME:
- App name to "Songsmith"
- Update metadata, titles, favicon references
- Update CLAUDE.md to describe Songsmith

---

## Phase 2: Songsmith Domain

### Database Schema (Supabase)

```sql
-- Sessions: a songwriting session
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text, -- optional song title/working name
  spark text, -- initial song idea
  perspectives jsonb, -- AI-suggested perspectives [{label, description}]
  status text default 'active', -- active | completed | archived
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Boxes: freewriting for each perspective
create table boxes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  perspective_index int, -- 0, 1, 2
  content text,
  duration_seconds int, -- how long they wrote
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Anchor words: the 9 selected words
create table anchor_words (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  word text,
  source_box int, -- which box it came from (0,1,2) or null if manual
  position int, -- 0-8, column position
  created_at timestamptz default now()
);

-- Rhymes: filled columns for each anchor word
create table rhymes (
  id uuid primary key default gen_random_uuid(),
  anchor_word_id uuid references anchor_words(id) on delete cascade,
  word text,
  rhyme_type text, -- perfect | near | consonance | assonance
  source text, -- 'box' | 'suggested' | 'manual'
  position int, -- row position in column
  created_at timestamptz default now()
);

-- Drafts: the actual lyric drafts
create table drafts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  content text,
  version int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on all tables
alter table sessions enable row level security;
alter table boxes enable row level security;
alter table anchor_words enable row level security;
alter table rhymes enable row level security;
alter table drafts enable row level security;

-- RLS policies (user can only access their own data)
create policy "Users can CRUD own sessions" on sessions for all using (auth.uid() = user_id);
create policy "Users can CRUD own boxes" on boxes for all using (session_id in (select id from sessions where user_id = auth.uid()));
create policy "Users can CRUD own anchor_words" on anchor_words for all using (session_id in (select id from sessions where user_id = auth.uid()));
create policy "Users can CRUD own rhymes" on rhymes for all using (anchor_word_id in (select aw.id from anchor_words aw join sessions s on aw.session_id = s.id where s.user_id = auth.uid()));
create policy "Users can CRUD own drafts" on drafts for all using (session_id in (select id from sessions where user_id = auth.uid()));
```

### Types

Create `/src/types/songsmith.ts`:

```typescript
export interface Session {
  id: string;
  user_id: string;
  title: string | null;
  spark: string;
  perspectives: Perspective[];
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Perspective {
  label: string;
  description: string;
}

export interface Box {
  id: string;
  session_id: string;
  perspective_index: number;
  content: string;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface AnchorWord {
  id: string;
  session_id: string;
  word: string;
  source_box: number | null;
  position: number;
  created_at: string;
}

export interface Rhyme {
  id: string;
  anchor_word_id: string;
  word: string;
  rhyme_type: 'perfect' | 'near' | 'consonance' | 'assonance';
  source: 'box' | 'suggested' | 'manual';
  position: number;
  created_at: string;
}

export interface Draft {
  id: string;
  session_id: string;
  content: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface RhymeCandidate {
  word: string;
  rhyme_type: 'perfect' | 'near' | 'consonance' | 'assonance';
  source: 'box' | 'suggested';
}
```

### App Structure

```
/src/app/app
├── page.tsx               # Dashboard: list of sessions
├── /sessions
│   ├── /new
│   │   └── page.tsx       # Start new session (spark input)
│   └── /[id]
│       └── page.tsx       # Main workspace (fluid navigation)
└── /settings
    └── page.tsx           # User preferences (timer duration, etc.)
```

### Core Components to Create

```
/src/components/songsmith
├── spark-input.tsx        # Initial song idea form
├── perspective-cards.tsx  # Show/edit AI-suggested perspectives
├── writing-box.tsx        # Timed freewriting component
├── timer.tsx              # Countdown timer (configurable default: 10min)
├── anchor-selector.tsx    # Pick 9 words from boxes
├── anchor-word-grid.tsx   # Display selected 9 anchor words
├── rhyme-grid.tsx         # 9-column rhyme palette
├── rhyme-column.tsx       # Single column with rhyme candidates
├── rhyme-candidate.tsx    # Single rhyme with type label badge
├── draft-editor.tsx       # Lyric writing workspace
├── ai-feedback-button.tsx # Request mentor feedback
├── session-nav.tsx        # Fluid navigation between phases
└── session-card.tsx       # Session preview for dashboard
```

### Settings/Preferences

Add to profiles table or create user_settings table:

```sql
alter table profiles add column timer_duration int default 600; -- 10 minutes in seconds
```

### AI Integration Points

Create server actions in `/src/lib/actions/ai.ts`:

```typescript
'use server'

// These will call Claude API — stub with mock data for now

export async function suggestPerspectives(spark: string): Promise<Perspective[]> {
  // TODO: Wire up Claude API
  // Returns 3 perspectives based on song idea
  return [
    { label: 'What you see', description: 'The visual imagery, the scene' },
    { label: 'What you feel', description: 'Physical sensations, emotions in the body' },
    { label: 'What you think', description: 'Inner thoughts, reflections, meanings' },
  ];
}

export async function suggestAnchorWords(boxes: Box[]): Promise<string[]> {
  // TODO: Wire up Claude API
  // Surfaces candidate words from box content
  return [];
}

export async function suggestRhymes(word: string, boxes: Box[]): Promise<RhymeCandidate[]> {
  // TODO: Wire up Claude API
  // Returns rhyme candidates with type labels
  // Pulls from boxes first, then suggests outside words
  return [];
}

export async function getFeedback(content: string, context: string): Promise<string> {
  // TODO: Wire up Claude API
  // Mentor feedback on writing — craft, prosody, clichés, sensory depth
  return '';
}
```

---

## Phase 3: UI Flow

### Session Workspace Layout

The session page (`/app/sessions/[id]/page.tsx`) should have:

1. **Header**: Session title (editable), status indicator
2. **Navigation**: Tabs or pills for fluid movement between phases
   - Boxes (with sub-indicators for each perspective)
   - Anchors
   - Rhymes
   - Draft
3. **Main content**: Current phase view
4. **AI Feedback button**: Floating or in header, available in all phases

### Phase Views

**Boxes Phase:**
- Tab for each of the 3 perspectives
- Timer component (start/pause/reset)
- Large textarea for freewriting
- "Get feedback" button
- Show perspective label and description as context

**Anchors Phase:**
- Display all three boxes side by side (or tabbed on mobile)
- Words from boxes are clickable/selectable
- Selected words appear in a 9-slot grid below
- AI "Suggest words" button
- Can manually type words not in boxes

**Rhymes Phase:**
- 9 columns, one per anchor word (header = anchor word)
- Click column to fill it
- Shows rhyme candidates with type badges: `perfect` `near` `consonance` `assonance`
- Candidates come from boxes + AI suggestions
- Click to add to column, click again to remove
- Manual entry option per column

**Draft Phase:**
- Full-width editor for writing the lyric
- Collapsible sidebar/panel showing:
  - The three boxes (collapsed by default)
  - The rhyme grid (visible)
- "Get feedback" button
- Version history (later enhancement)

### Navigation Behavior

- User can freely move between phases at any time
- Progress is auto-saved
- Visual indicator of completion state per phase (e.g., checkmark or progress dot)

---

## Phase 4: Polish & Edge Cases

### Handle Later:
- Export finished lyric to Fretlist (as a song)
- Export to plain text / PDF
- Session archiving
- Collaborative sessions (Band tier, future)
- Mobile-optimized timer UX
- Keyboard shortcuts for power users

---

## Instructions for Claude Code

1. **First, strip the Fretlist-specific code (Phase 1)**
   - Go file by file, remove domain-specific code
   - Keep infrastructure intact
   - Update branding to Songsmith
   - Commit: "Strip Fretlist domain, establish Songsmith scaffold"

2. **Set up the database schema (Phase 2)**
   - Create migration file for Supabase
   - Add types
   - Commit: "Add Songsmith database schema and types"

3. **Create the app structure and stub components**
   - Set up routes
   - Create component files with basic structure
   - Commit: "Add Songsmith app structure and component stubs"

4. **Build out the UI flow (Phase 3)**
   - Start with the session workspace layout
   - Implement each phase view
   - Wire up navigation
   - Commit frequently per feature

**Ask me before making major decisions. Commit frequently with clear messages.**

---

## Reference: Pat Pattison's Three-Boxes Technique

The technique separates generation from structure:

1. **Spark**: Start with a song idea, emotion, or situation
2. **Three perspectives**: Explore the idea from three different angles (often see/feel/think, but varies)
3. **Timed freewriting**: Write without stopping for 10 minutes per perspective, focusing on sensory detail
4. **Anchor words**: Select 9 key words that capture the essence
5. **Rhyme palette**: For each anchor word, find rhymes (perfect and imperfect) to build options
6. **Draft**: Write the actual lyric using your raw material and rhyme palette

The goal is to separate the creative/generative phase from the structural/craft phase, avoiding clichés that sneak in when you reach for rhymes before knowing what you want to say.
