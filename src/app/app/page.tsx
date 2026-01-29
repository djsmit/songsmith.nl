import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SessionCard } from "@/components/songsmith";
import { Plus, Sparkles } from "lucide-react";
import type { Session } from "@/types/songsmith";

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

  const [{ data: profile }, { data: sessions }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single(),
    supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  const displayName = profile?.stage_name || profile?.display_name || user.email?.split('@')[0] || 'Songwriter';

  return (
    <div className="pt-16 lg:pt-0 px-4 py-8 max-w-4xl mx-auto">
      {/* Welcome header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-serif font-semibold">
          Welcome, {displayName}
        </h1>
        <p className="text-muted-foreground">
          Ready to write your next song?
        </p>
      </div>

      {/* Quick action */}
      <div className="flex justify-center mb-10">
        <Button asChild size="lg">
          <Link href="/app/sessions/new">
            <Plus className="h-4 w-4 mr-2" />
            Start New Session
          </Link>
        </Button>
      </div>

      {/* Recent sessions */}
      {sessions && sessions.length > 0 ? (
        <div>
          <h2 className="text-lg font-medium mb-4">Recent Sessions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(sessions as Session[]).map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <Sparkles className="h-10 w-10 mx-auto mb-3 text-teal opacity-60" />
          <p className="text-muted-foreground">
            No sessions yet. Start your first songwriting session!
          </p>
        </div>
      )}
    </div>
  );
}
