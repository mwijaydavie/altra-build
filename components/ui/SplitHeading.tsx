"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import SplitType from "split-type";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface SplitHeadingProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  start?: string;
}

/**
 * Line-by-line masked reveal using SplitType.
 * Split runs after fonts settle, and is reverted on cleanup so React never
 * reconciles against injected DOM.
 */
export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  start = "top 85%",
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let split: SplitType | null = null;
      let cancelled = false;

      if (typeof children !== "string") {
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(el, {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: el, start },
        });
        return;
      }

      const run = async () => {
        if (document.fonts?.ready) {
          try {
            await document.fonts.ready;
          } catch {
            /* no-op */
          }
        }
        if (cancelled) return;

        split = new SplitType(el, { types: "lines", lineClass: "split-line" });
        const lines = split.lines ?? [];
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(lines, {
          yPercent: 115,
          duration: 1.15,
          stagger: 0.085,
          ease: "power4.out",
          delay,
          scrollTrigger: { trigger: el, start },
        });
      };

      gsap.set(el, { autoAlpha: 0 });
      void run();

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [children] },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
