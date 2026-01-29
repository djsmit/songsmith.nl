-- Songsmith Database Schema
-- Pat Pattison's three-boxes technique for songwriting

-- Add timer_duration to profiles
alter table profiles add column if not exists timer_duration int default 600;

-- Sessions: a songwriting session
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  spark text not null,
  perspectives jsonb default '[]'::jsonb,
  status text default 'active' check (status in ('active', 'completed', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Boxes: freewriting for each perspective
create table if not exists boxes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  perspective_index int not null check (perspective_index >= 0 and perspective_index <= 2),
  content text default '',
  duration_seconds int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Anchor words: the 9 selected words
create table if not exists anchor_words (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  word text not null,
  source_box int check (source_box is null or (source_box >= 0 and source_box <= 2)),
  position int not null check (position >= 0 and position <= 8),
  created_at timestamptz default now()
);

-- Rhymes: filled columns for each anchor word
create table if not exists rhymes (
  id uuid primary key default gen_random_uuid(),
  anchor_word_id uuid references anchor_words(id) on delete cascade not null,
  word text not null,
  rhyme_type text not null check (rhyme_type in ('perfect', 'near', 'consonance', 'assonance')),
  source text not null check (source in ('box', 'suggested', 'manual')),
  position int not null,
  created_at timestamptz default now()
);

-- Drafts: the actual lyric drafts
create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  content text default '',
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

-- RLS policies for sessions
create policy "Users can view own sessions" on sessions for select using (auth.uid() = user_id);
create policy "Users can create own sessions" on sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on sessions for update using (auth.uid() = user_id);
create policy "Users can delete own sessions" on sessions for delete using (auth.uid() = user_id);

-- RLS policies for boxes
create policy "Users can view own boxes" on boxes for select using (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can create own boxes" on boxes for insert with check (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can update own boxes" on boxes for update using (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can delete own boxes" on boxes for delete using (
  session_id in (select id from sessions where user_id = auth.uid())
);

-- RLS policies for anchor_words
create policy "Users can view own anchor_words" on anchor_words for select using (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can create own anchor_words" on anchor_words for insert with check (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can update own anchor_words" on anchor_words for update using (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can delete own anchor_words" on anchor_words for delete using (
  session_id in (select id from sessions where user_id = auth.uid())
);

-- RLS policies for rhymes
create policy "Users can view own rhymes" on rhymes for select using (
  anchor_word_id in (
    select aw.id from anchor_words aw
    join sessions s on aw.session_id = s.id
    where s.user_id = auth.uid()
  )
);
create policy "Users can create own rhymes" on rhymes for insert with check (
  anchor_word_id in (
    select aw.id from anchor_words aw
    join sessions s on aw.session_id = s.id
    where s.user_id = auth.uid()
  )
);
create policy "Users can update own rhymes" on rhymes for update using (
  anchor_word_id in (
    select aw.id from anchor_words aw
    join sessions s on aw.session_id = s.id
    where s.user_id = auth.uid()
  )
);
create policy "Users can delete own rhymes" on rhymes for delete using (
  anchor_word_id in (
    select aw.id from anchor_words aw
    join sessions s on aw.session_id = s.id
    where s.user_id = auth.uid()
  )
);

-- RLS policies for drafts
create policy "Users can view own drafts" on drafts for select using (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can create own drafts" on drafts for insert with check (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can update own drafts" on drafts for update using (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Users can delete own drafts" on drafts for delete using (
  session_id in (select id from sessions where user_id = auth.uid())
);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger sessions_updated_at before update on sessions
  for each row execute function update_updated_at();

create trigger boxes_updated_at before update on boxes
  for each row execute function update_updated_at();

create trigger drafts_updated_at before update on drafts
  for each row execute function update_updated_at();

-- Index for faster lookups
create index if not exists sessions_user_id_idx on sessions(user_id);
create index if not exists boxes_session_id_idx on boxes(session_id);
create index if not exists anchor_words_session_id_idx on anchor_words(session_id);
create index if not exists rhymes_anchor_word_id_idx on rhymes(anchor_word_id);
create index if not exists drafts_session_id_idx on drafts(session_id);
