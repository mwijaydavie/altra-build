"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Logo } from "@/components/ui/Logo";

const KEY = "altra-intro-seen";

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(KEY) === "1";

    if (reduced || seen) {
      setVisible(false);
      sessionStorage.setItem(KEY, "1");
      return;
    }

    document.documentElement.classList.add("overflow-hidden");
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("overflow-hidden");
        sessionStorage.setItem(KEY, "1");
        setVisible(false);
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.v)),
    })
      .to("[data-preloader-line]", { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, 0)
      .to("[data-preloader-content]", { autoAlpha: 0, y: -18, duration: 0.45, ease: "power2.in" }, 1.0)
      .to(rootRef.current, {
        yPercent: -100,
        duration: 0.85,
        ease: "expo.inOut",
      });

    return () => {
      tl.kill();
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      data-preloader
      aria-hidden="true"
      className="fixed inset-0 z-[120] flex flex-col justify-between overflow-hidden bg-ink px-6 py-7 text-paper sm:px-10 sm:py-9"
    >
      <div data-preloader-content className="flex items-start justify-between">
        <Logo variant="mark" tone="inverse" height={44} />
        <p className="eyebrow text-paper/45">Est. 2009 · Dar es Salaam</p>
      </div>

      <div data-preloader-content className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-6">
          <Logo variant="lockup" tone="inverse" height={58} className="max-w-[62%]" />
          <p className="font-mono text-[11px] tracking-[0.2em] text-paper/50">
            {String(count).padStart(3, "0")}%
          </p>
        </div>
        <div className="h-px w-full bg-paper/15">
          <div
            data-preloader-line
            className="h-px origin-left scale-x-0 bg-gold"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <p className="meta text-paper/40">Loading structural model · Kifaru Standard</p>
      </div>
    </div>
  );
}
