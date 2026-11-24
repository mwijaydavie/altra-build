import type { ReactNode } from "react";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  description?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  align?: "left" | "between";
  action?: ReactNode;
}

export function SectionHeading({
  index,
  label,
  title,
  description,
  tone = "light",
  className,
  align = "between",
  action,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn("border-t pt-6", dark ? "border-paper/15" : "border-ink/15", className)}>
      <div
        className={cn(
          "flex flex-col gap-6",
          align === "between" && "lg:flex-row lg:items-end lg:justify-between",
        )}
      >
        <div className="max-w-3xl">
          <div className="flex items-baseline gap-3">
            <span className={cn("meta", dark ? "text-gold" : "text-gold-deep")}>{index}</span>
            <span className={cn("eyebrow", dark ? "text-paper/55" : "text-ink/65")}>{label}</span>
          </div>
          <SplitHeading
            as="h2"
            className={cn(
              "display-lg mt-5 uppercase",
              dark ? "text-paper" : "text-ink",
            )}
          >
            {title}
          </SplitHeading>
          {description && (
            <p
              className={cn(
                "mt-5 max-w-xl text-[15.5px] leading-relaxed sm:text-[17px]",
                dark ? "text-paper/55" : "text-ink/60",
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
