"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

function format(value: number, decimals: number): string {
  const fixed = value.toFixed(decimals);
  const [whole, fraction] = fixed.split(".");
  const grouped = (whole ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}

export function Counter({ value, decimals = 0, prefix = "", suffix = "", className, duration = 2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const state = { v: 0 };
      const render = () => {
        el.textContent = `${prefix}${format(state.v, decimals)}${suffix}`;
      };
      render();

      gsap.to(state, {
        v: value,
        duration,
        ease: "power2.out",
        onUpdate: render,
        scrollTrigger: { trigger: el, start: "top 94%", once: true },
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)} suppressHydrationWarning>
      {prefix}
      {format(value, decimals)}
      {suffix}
    </span>
  );
}
