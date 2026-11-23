import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatedLink {
  label: string;
  href: string;
  meta: string;
}

export function RelatedLinks({
  title,
  links,
  tone = "light",
}: {
  title: string;
  links: RelatedLink[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <section
      className={cn(
        "border-t py-12",
        dark ? "border-paper/12 bg-ink text-paper" : "border-ink/12 bg-paper text-ink",
      )}
    >
      <div className="shell">
        <p className={cn("eyebrow", dark ? "text-paper/40" : "text-ink/45")}>{title}</p>
        <div className="mt-5 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group border-b py-4 pr-3 transition-colors",
                dark
                  ? "border-paper/10 hover:text-gold"
                  : "border-ink/10 hover:text-gold-deep",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-display text-[19px] uppercase tracking-tight">
                  {link.label}
                </span>
                <ArrowUpRight className="size-4 shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </span>
              <span
                className={cn(
                  "mt-1 block font-mono text-[12px] uppercase tracking-[0.12em]",
                  dark ? "text-paper/40" : "text-ink/45",
                )}
              >
                {link.meta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
