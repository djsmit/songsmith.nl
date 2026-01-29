import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingShell } from "@/components/landing/landing-shell";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { HeroSection } from "@/components/landing/hero-section";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  return (
    <LandingShell>
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal/20 blur-[100px] animate-float" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-pink/15 blur-[80px] animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-purple/15 blur-[90px] animate-float" />
      </div>

      <LandingHeader />

      <main className="relative z-10 mt-16 md:mt-20">
        <HeroSection />
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
