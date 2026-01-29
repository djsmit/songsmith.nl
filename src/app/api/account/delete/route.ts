import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const supabaseAdmin = getAdminClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Delete user's avatars from storage
    const { data: avatarFiles } = await supabaseAdmin.storage
      .from('avatars')
      .list(userId);

    if (avatarFiles && avatarFiles.length > 0) {
      const filePaths = avatarFiles.map((f) => `${userId}/${f.name}`);
      await supabaseAdmin.storage.from('avatars').remove(filePaths);
    }

    // Delete user's setlist_songs first (foreign key constraint)
    const { data: setlists } = await supabase
      .from('setlists')
      .select('id')
      .eq('user_id', userId);

    if (setlists && setlists.length > 0) {
      const setlistIds = setlists.map((s) => s.id);
      const { error: setlistSongsError } = await supabaseAdmin
        .from('setlist_songs')
        .delete()
        .in('setlist_id', setlistIds);
      if (setlistSongsError) console.error('Error deleting setlist_songs:', setlistSongsError);
    }

    // Delete user's setlists
    const { error: setlistsError } = await supabaseAdmin.from('setlists').delete().eq('user_id', userId);
    if (setlistsError) console.error('Error deleting setlists:', setlistsError);

    // Delete user's songs
    const { error: songsError } = await supabaseAdmin.from('songs').delete().eq('user_id', userId);
    if (songsError) console.error('Error deleting songs:', songsError);

    // Delete user's feedback
    const { error: feedbackError } = await supabaseAdmin.from('feedback').delete().eq('user_id', userId);
    if (feedbackError) console.error('Error deleting feedback:', feedbackError);

    // Delete user's profile
    const { error: profileError } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
    if (profileError) console.error('Error deleting profile:', profileError);

    // Delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
