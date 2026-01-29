import { LandingShell } from "@/components/landing/landing-shell";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata = {
  title: "Changelog - Songsmith",
  description:
    "See what's new in Songsmith - the latest features and improvements.",
};

const changelog = [
  {
    date: "January 2026",
    changes: [
      "Initial release of Songsmith",
      "Three-boxes technique workflow",
      "Timed freewriting with customizable timer",
      "Anchor word selection",
      "Rhyme palette builder",
      "Draft editor with reference material",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <LandingShell>
      <LandingHeader showBackLink showAuthButtons={false} />

      <main className="flex-1 py-8 md:py-12 lg:py-16 xl:py-20 mt-16 md:mt-20">
        <div className="container mx-auto px-4 lg:max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Changelog
          </h1>
          <p className="text-muted-foreground mb-12">
            New features and improvements to Songsmith.
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-medium">
            {changelog.map((entry) => (
              <section key={entry.date} className="mb-12">
                <h2 className="!mt-0">{entry.date}</h2>
                <ul>
                  {entry.changes.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
