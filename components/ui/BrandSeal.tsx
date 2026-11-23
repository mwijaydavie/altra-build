import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

interface BrandSealProps {
  size?: number;
  className?: string;
  tone?: "ink" | "inverse";
  label?: string;
}

/**
 * Rotating seal built from the brand emblem — the rhino inside a ring of
 * technical lettering. Used as a signature detail on dark sections.
 */
export function BrandSeal({ size = 132, className, tone = "inverse", label = "ALTRA BUILD · KIFARU STANDARD · DAR ES SALAAM ·" }: BrandSealProps) {
  const id = label.replace(/[^a-z0-9]/gi, "").slice(0, 18);
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full motion-safe:animate-[altra-spin_38s_linear_infinite]"
        aria-hidden
      >
        <defs>
          <path id={`seal-${id}`} d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" fill="none" />
        </defs>
        <text
          className={tone === "inverse" ? "fill-paper/45" : "fill-ink/45"}
          style={{ fontFamily: "var(--font-mono)", fontSize: 6.1, letterSpacing: "0.34em" }}
        >
          <textPath href={`#seal-${id}`} startOffset="0">
            {label}
          </textPath>
        </text>
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.4" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Logo variant="mark" tone={tone} height={size * 0.42} />
      </div>
    </div>
  );
}
