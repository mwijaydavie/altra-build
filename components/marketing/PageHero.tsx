import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { company } from "@/data/siteData";
import { TextMotion } from "@/components/ui/TextMotion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label: string;
  title: string;
  deck?: string;
  meta?: { k: string; v: string }[];
  actions?: ReactNode;
  tone?: "dark" | "light";
}

/** Shared inner-page masthead. Large type, short deck, no wall of copy. */
export function PageHero({
  label,
  title,
  deck,
  meta,
  actions,
  tone = "dark",
}: PageHeroProps) {
  const dark = tone === "dark";
  return (
    <section
      className={cn(
        "relative overflow-hidden pb-11 pt-[108px] lg:pb-12 lg:pt-[146px]",
        dark ? "bg-ink text-paper" : "bg-paper text-ink",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-20",
          dark ? "text-paper blueprint" : "text-ink blueprint",
        )}
      />
      <div className="shell relative">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px]">
          <Link
            href="/"
            className={cn(
              "transition-colors",
              dark ? "text-paper/45 hover:text-gold" : "text-ink/45 hover:text-ink",
            )}
          >
            Home
          </Link>
          <ChevronRight className={cn("size-3.5", dark ? "text-paper/25" : "text-ink/25")} />
          <span className={dark ? "text-paper/70" : "text-ink/70"}>{label}</span>
        </nav>

        <p className={cn("eyebrow mt-6", dark ? "text-gold" : "text-gold-deep")}>{label}</p>

        <TextMotion
          as="h1"
          text={title}
          className={cn(
            "display-lg mt-5 max-w-[24ch] uppercase",
            dark ? "text-paper" : "text-ink",
          )}
        />

        {deck && (
          <p
            className={cn(
              "mt-6 max-w-[62ch] text-[17px] leading-[1.65] sm:text-[18px]",
              dark ? "text-paper/65" : "text-ink/65",
            )}
          >
            {deck}
          </p>
        )}

        {(actions || meta) && (
          <div
            className={cn(
              "mt-8 flex flex-col gap-6 border-t pt-6 sm:flex-row sm:items-end sm:justify-between",
              dark ? "border-paper/15" : "border-ink/15",
            )}
          >
            {meta && (
              <dl className="flex flex-wrap gap-x-10 gap-y-4">
                {meta.map((item) => (
                  <div key={item.k}>
                    <dt className={cn("meta", dark ? "text-paper/35" : "text-ink/40")}>{item.k}</dt>
                    <dd
                      className={cn(
                        "mt-1.5 font-display text-[19px] tracking-tight",
                        dark ? "text-paper/90" : "text-ink",
                      )}
                    >
                      {item.v}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>
        )}

        <p
          className={cn(
            "mt-10 font-mono text-[12px] uppercase tracking-[0.16em]",
            dark ? "text-paper/25" : "text-ink/30",
          )}
        >
          {company.legalName} · {company.crb}
        </p>
      </div>
    </section>
  );
}
