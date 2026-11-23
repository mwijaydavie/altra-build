import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-20" aria-hidden />
      <div className="shell relative grid gap-12 py-32 lg:grid-cols-2 lg:items-center">
        <div>
          <Logo variant="lockup" tone="inverse" height={34} />
          <p className="eyebrow mt-12 text-gold">Error 404 · out of bounds</p>
          <h1 className="display-xl mt-5 uppercase">
            Off the <span className="text-outline">site</span> plan.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/55">
            This page is not on our drawings. The work we have actually built is a safer place to
            start.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2 bg-gold px-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
            >
              <ArrowLeft className="size-3.5" />
              Return to site
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-12 items-center border border-paper/25 px-6 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70 transition-colors hover:border-gold hover:text-gold"
            >
              Project index
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <Logo variant="mark" tone="inverse" height={280} className="opacity-30" />
        </div>
      </div>
    </section>
  );
}
