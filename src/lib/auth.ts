import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

/**
 * Cached auth user getter.
 * Uses React's cache() to deduplicate auth calls within the same request.
 * Multiple components calling getAuthUser() in the same render will
 * share the same Promise result.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  return supabase.auth.getUser();
});
