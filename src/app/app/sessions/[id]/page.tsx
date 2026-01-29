import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';
import { SessionWorkspace } from './session-workspace';

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SessionPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from('sessions')
    .select('title, spark')
    .eq('id', id)
    .single();

  return {
    title: session?.title
      ? `${session.title} - Songsmith`
      : 'Session - Songsmith',
    description: session?.spark || 'Songwriting session',
  };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const { data: { user } } = await getAuthUser();

  if (!user) {
    notFound();
  }

  const supabase = await createClient();

  // Fetch session with related data
  const [
    { data: session, error: sessionError },
    { data: boxes },
    { data: anchorWords },
    { data: drafts },
  ] = await Promise.all([
    supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('boxes')
      .select('*')
      .eq('session_id', id)
      .order('perspective_index', { ascending: true }),
    supabase
      .from('anchor_words')
      .select('*')
      .eq('session_id', id)
      .order('position', { ascending: true }),
    supabase
      .from('drafts')
      .select('*')
      .eq('session_id', id)
      .order('version', { ascending: false }),
  ]);

  if (sessionError || !session) {
    notFound();
  }

  // Fetch rhymes for anchor words
  const anchorWordIds = anchorWords?.map((aw) => aw.id) || [];
  const { data: rhymes } = anchorWordIds.length > 0
    ? await supabase
        .from('rhymes')
        .select('*')
        .in('anchor_word_id', anchorWordIds)
        .order('position', { ascending: true })
    : { data: [] };

  return (
    <SessionWorkspace
      session={session}
      boxes={boxes || []}
      anchorWords={anchorWords || []}
      rhymes={rhymes || []}
      drafts={drafts || []}
    />
  );
}
