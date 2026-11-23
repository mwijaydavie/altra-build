"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { divisions } from "@/data/siteData";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function Capabilities() {
  const [active, setActive] = useState(0);
  const division = divisions[active] ?? divisions[0]!;

  // Deep link: /capabilities?division=civil opens that division.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("division");
    const index = divisions.findIndex((item) => item.id === wanted);
    if (index >= 0) setActive(index);
  }, []);

  return (
    <section id="capabilities" className="scroll-mt-24 bg-paper py-14 text-ink lg:py-20">
      <div className="shell">
        <div className="flex items-center justify-between border-t border-ink/15 pt-5">
          <p className="eyebrow text-ink/45">Select a division</p>
          <p className="meta text-ink/35">04 / divisions</p>
        </div>

        {/* Interactive — desktop */}
        <div className="mt-8 hidden gap-12 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-ink/10">
            {divisions.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={cn(
                    "group relative flex w-full items-start gap-5 border-t border-ink/10 py-7 text-left transition-colors",
                    isActive ? "bg-cream/70" : "hover:bg-cream/40",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-full w-[2px] origin-top transition-transform duration-500",
                      isActive ? "scale-y-100 bg-gold" : "scale-y-0 bg-gold",
                    )}
                  />
                  <span
                    className={cn(
                      "ml-4 mt-1 font-mono text-[12.5px] tracking-[0.14em] transition-colors",
                      isActive ? "text-gold-deep" : "text-ink/35",
                    )}
                  >
                    {item.index}
                  </span>
                  <span className="flex-1 pr-4">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="display-md text-[clamp(1.35rem,2vw,1.85rem)] text-ink">
                        {item.shortName}
                      </span>
                      <span
                        className={cn(
                          "meta shrink-0 transition-colors",
                          isActive ? "text-ink/55" : "text-ink/30",
                        )}
                      >
                        {item.ref}
                      </span>
                    </span>
                    <span className="mt-2 block text-[15.5px] leading-relaxed text-ink/50">
                      {item.summary}
                    </span>
                    <span
                      className={cn(
                        "mt-4 flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.16em] transition-all duration-500",
                        isActive ? "text-gold-deep opacity-100" : "text-ink/40 opacity-70",
                      )}
                    >
                      {item.kicker}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative h-[640px] overflow-hidden bg-ink">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={division.id}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={division.image}
                  alt={division.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-between p-6 text-paper">
              <div className="flex items-start justify-between">
                <span className="border border-paper/25 bg-ink/40 px-2.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-paper/80 backdrop-blur">
                  {division.ref} / {division.index}
                </span>
                <span className="max-w-[16ch] text-right font-mono text-[11.5px] uppercase leading-relaxed tracking-[0.14em] text-paper/55">
                  {division.kicker}
                </span>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-4 border-t border-paper/20 pt-5">
                  {division.specs.map((spec) => (
                    <div key={spec.label}>
                      <p className="font-display text-xl leading-none text-gold">{spec.value}</p>
                      <p className="mt-2 text-[11.5px] uppercase leading-snug tracking-[0.1em] text-paper/50">
                        {spec.label}
                      </p>
                    </div>
                  ))}
                </div>
                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2">
                  {division.capabilities.slice(0, 4).map((capability) => (
                    <li key={capability} className="flex items-start gap-1.5 text-[13px] leading-snug text-paper/70">
                      <Check className="mt-0.5 size-3 shrink-0 text-gold" strokeWidth={2} />
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stacked — mobile/tablet */}
        <div className="mt-12 space-y-6 lg:hidden">
          {divisions.map((item) => (
            <Reveal key={item.id} className="overflow-hidden border border-ink/10 bg-cream/50">
              <div className="relative aspect-[16/10]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 640px) 90vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <div>
                    <p className="meta text-gold">{item.ref}</p>
                    <h3 className="display-md mt-1 text-paper">{item.shortName}</h3>
                  </div>
                  <span className="font-mono text-[11.5px] text-paper/50">{item.index}</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[15.5px] leading-relaxed text-ink/60">{item.summary}</p>
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
                  {item.specs.map((spec) => (
                    <div key={spec.label}>
                      <p className="font-display text-lg leading-none text-ink">{spec.value}</p>
                      <p className="mt-1.5 text-[11px] uppercase leading-snug tracking-[0.08em] text-ink/40">
                        {spec.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
