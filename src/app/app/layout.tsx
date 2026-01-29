import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';
import { AppLayoutClient } from './layout-client';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { Toaster } from 'sonner';

export const dynamic = 'force-dynamic';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: { user } } = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Merge with user metadata (Google avatar, etc.)
  const profile = profileData ? {
    ...profileData,
    avatar_url: profileData.avatar_url || user.user_metadata?.avatar_url || null,
    display_name: profileData.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || null,
    stage_name: profileData.stage_name || null,
  } : null;

  return (
    <SidebarProvider profile={profile}>
      <AppLayoutClient profile={profile}>
        {children}
      </AppLayoutClient>
      <Toaster position="top-center" richColors />
    </SidebarProvider>
  );
}
