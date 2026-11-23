"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "li" | "section" | "article";
}

/** Scroll-triggered fade-up. One ScrollTrigger per instance, killed on unmount. */
export function Reveal({ children, className, delay = 0, y = 36, once = true, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref },
  );

  const Tag = as as "div";
  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
