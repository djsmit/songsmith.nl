import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./scroll-reveal";
import { Container } from "./container";

export function HeroSection() {
  return (
    <section className="min-h-[calc(100svh-4rem)] lg:min-h-[calc(100svh-5rem)] flex items-center py-16 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
      <Container className="text-center">
        <ScrollReveal>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6">
            Finish more songs.
            <br />
            <span className="gradient-text">Write with clarity.</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Songsmith guides you through Pat Pattison&apos;s three-boxes technique
            to help you move from spark to finished lyric. AI-assisted
            perspectives, timed freewriting, and a structured rhyme palette.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-teal hover:bg-teal/90 text-teal-foreground text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              <Link href="/login">Start Writing</Link>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
