import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard - Songsmith",
  description: "Your Songsmith dashboard with recent sessions.",
};

export default async function AppPage() {
  const { data: { user } } = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.stage_name || profile?.display_name || user.email?.split('@')[0] || 'Songwriter';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-serif font-semibold">
          Welcome, {displayName}
        </h1>
        <p className="text-muted-foreground">
          Ready to write your next song? Songsmith guides you through Pat Pattison&apos;s three-boxes technique to help you finish more songs.
        </p>
        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            Sessions coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
