"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import { certifications, processSteps, safety } from "@/data/siteData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function MethodSafety() {
  const [open, setOpen] = useState(0);

  return (
    <section id="method" className="scroll-mt-24 bg-paper py-14 text-ink lg:py-20">
      <div className="shell">
        <SectionHeading
          index="03"
          label="Method, safety & compliance"
          title="Programme discipline is a safety system."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* process accordion */}
          <div>
            {processSteps.map((step, index) => {
              const isOpen = open === index;
              return (
                <div key={step.id} className="border-t border-ink/15 last:border-b">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={`step-${step.id}`}
                    className="flex w-full items-start gap-5 py-6 text-left"
                  >
                    <span
                      className={cn(
                        "mt-1 font-mono text-[12.5px] tracking-[0.14em] transition-colors",
                        isOpen ? "text-gold-deep" : "text-ink/65",
                      )}
                    >
                      {step.index}
                    </span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          "block font-display text-[1.15rem] tracking-tight transition-colors sm:text-[1.35rem]",
                          isOpen ? "text-ink" : "text-ink/70",
                        )}
                      >
                        {step.title}
                      </span>
                    </span>
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-ink/20 text-ink/60">
                      {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`step-${step.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pl-9 pr-10">
                          <p className="max-w-lg text-[16px] leading-relaxed text-ink/60">{step.detail}</p>
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {step.outputs.map((output) => (
                              <li
                                key={output}
                                className="border border-ink/15 bg-cream px-2.5 py-1 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink/65"
                              >
                                {output}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* safety HUD */}
          <Reveal className="relative overflow-hidden bg-ink p-6 text-paper sm:p-8">
            <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-25" aria-hidden />
            <div className="pointer-events-none absolute -bottom-14 -right-12 opacity-[0.07]" aria-hidden>
              <Logo variant="mark" tone="inverse" height={220} />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between border-b border-paper/15 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-gold" strokeWidth={1.8} />
                  <p className="eyebrow text-gold">Kifaru Standard</p>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55">
                  <span className="live-dot size-1.5 rounded-full bg-gold" />
                  Live record
                </span>
              </div>

              <div className="flex items-end justify-between gap-6 py-7">
                <div>
                  <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-paper/55">
                    Lost-time injuries
                  </p>
                  <p className="mt-1 font-display text-[clamp(4.5rem,9vw,7rem)] leading-[0.8] tracking-tighter text-gold">
                    0
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl leading-none text-paper">26</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/55">
                    months
                  </p>
                  <p className="mt-4 font-display text-2xl leading-none text-paper">4.26M</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/55">
                    man-hours
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-5 border-t border-paper/15 pt-5">
                {safety.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-lg leading-none text-paper">{stat.value}</p>
                    <p className="mt-1.5 text-[12px] uppercase leading-snug tracking-[0.08em] text-paper/55">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-paper/55">{stat.note}</p>
                  </div>
                ))}
              </div>

              <ul className="mt-7 space-y-2 border-t border-paper/15 pt-5">
                {safety.kifaruPoints.slice(0, 4).map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[13px] leading-snug text-paper/60">
                    <span className="mt-1.5 size-1 shrink-0 bg-gold" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-paper/15 pt-5">
                {certifications.slice(0, 3).map((cert) => (
                  <span
                    key={cert.code}
                    className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-paper/55"
                  >
                    {cert.code}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ESG strip */}
        <div className="mt-14 border-t border-ink/15 pt-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-sm">
              <p className="eyebrow text-gold-deep">ESG benchmarks</p>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/65">
                We report environmental performance on the same dashboard as programme and cost.
                Certifications currently in delivery include EDGE Advanced and LEED Gold.
              </p>
            </div>
            <dl className="grid flex-1 grid-cols-2 gap-x-8 gap-y-6 sm:max-w-2xl sm:grid-cols-4">
              {safety.esg.map((item) => (
                <div key={item.label} className="flex flex-col border-t border-ink/15 pt-3">
                  <dt className="order-2 mt-2 text-[12px] uppercase leading-snug tracking-[0.06em] text-ink/65">
                    {item.label}
                  </dt>
                  <dd className="order-1 font-display text-2xl leading-none tracking-tight text-ink">
                    {item.value}
                  </dd>
                  <dd className="order-3 mt-0.5 text-[11px] text-ink/65">{item.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
