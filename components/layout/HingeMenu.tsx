"use client";

import Link from "next/link";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone, Search } from "lucide-react";
import { company, offices, primaryNavigation, utilityNavigation } from "@/data/siteData";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LocalClock } from "@/components/ui/LocalClock";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { cn } from "@/lib/utils";

interface HingeMenuProps {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
}

/**
 * Full-screen navigation that opens like a pair of hinged panels — the
 * HingeMenu idea rebuilt natively with framer-motion on the brand palette.
 */
export function HingeMenu({ open, onClose, onSearch }: HingeMenuProps) {
  const reduced = useReducedMotion();
  const { stop, start } = useSmoothScroll();

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    stop();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      start();
      window.removeEventListener("keydown", onKey);
    };
  }, [close, open, start, stop]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] overflow-y-auto bg-[#0B0D13] text-paper"
          style={{ perspective: 1900 }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          data-lenis-prevent
        >
          <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-[0.18]" aria-hidden />
          <div className="grain pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative flex min-h-full flex-col pt-[68px] lg:pt-[84px]">
            <div className="grid flex-1 lg:grid-cols-[1.12fr_0.88fr]">
              {/* hinge — left leaf */}
              <motion.div
                initial={reduced ? { opacity: 0 } : { rotateY: -72, opacity: 0.4 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { rotateY: -55, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                className="relative flex flex-col justify-between bg-[#0F1117] px-5 pb-8 pt-8 sm:px-8 lg:px-12 lg:py-12"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="eyebrow text-gold">Navigate</p>
                  </div>

                  <nav aria-label="Primary" className="mt-6">
                    <ul>
                      {primaryNavigation.map((item, index) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.16 + index * 0.055,
                            duration: 0.55,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="border-b border-paper/10"
                        >
                          <Link
                            href={item.href}
                            onClick={close}
                            className="group flex items-baseline justify-between gap-4 py-4 lg:py-5"
                          >
                            <span className="flex items-baseline gap-4">
                              <span className="font-mono text-[12.5px] tracking-[0.12em] text-paper/30">
                                {item.index}
                              </span>
                              <span className="font-display text-[clamp(1.75rem,4.2vw,2.9rem)] uppercase leading-[1.02] tracking-[-0.03em] text-paper/90 transition-colors group-hover:text-gold">
                                {item.label}
                              </span>
                            </span>
                            <span className="hidden shrink-0 font-mono text-[12px] uppercase tracking-[0.12em] text-paper/30 sm:block">
                              {item.meta}
                            </span>
                            <ArrowUpRight className="size-4 shrink-0 text-paper/25 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold sm:hidden" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.42, duration: 0.5 }}
                    className="mt-7 grid gap-x-6 sm:grid-cols-2"
                  >
                    {utilityNavigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="group flex items-center justify-between gap-3 border-b border-paper/10 py-2.5 text-[15.5px] text-paper/70 transition-colors hover:text-gold"
                      >
                        {item.label}
                        <span className="hidden shrink-0 font-mono text-[11.5px] uppercase tracking-[0.1em] text-paper/25 sm:block">
                          {item.meta}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                </div>

                {/* mobile utility footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-8 space-y-4 lg:hidden"
                >
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onSearch();
                    }}
                    className="flex w-full items-center gap-3 border border-paper/15 px-3 py-3 text-left text-[15px] text-paper/80"
                  >
                    <Search className="size-4 text-gold" />
                    Search the site
                    <kbd className="ml-auto rounded border border-paper/15 px-1.5 py-0.5 font-mono text-[11px] text-paper/40">
                      ⌘K
                    </kbd>
                  </button>
                  <div className="flex">
                    <MagneticButton href="/contact" size="lg" className="w-full justify-center">
                      Request project tender
                    </MagneticButton>
                  </div>
                  <div className="flex items-center justify-between border-t border-paper/10 pt-4">
                    <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="text-[15px] text-paper/75">
                      {company.phone}
                    </a>
                    <a href={`mailto:${company.email}`} className="text-[15px] text-gold">
                      {company.email}
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* hinge — right leaf */}
              <motion.aside
                initial={reduced ? { opacity: 0 } : { rotateY: 72, opacity: 0.4 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { rotateY: 55, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
                className="relative hidden flex-col justify-between border-l border-paper/12 bg-[#101219] px-10 py-12 lg:flex"
              >
                <div className="space-y-8">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onSearch();
                    }}
                    className="group flex w-full items-center gap-3 border border-paper/15 bg-paper/[0.03] px-4 py-3.5 text-left transition-colors hover:border-gold/60"
                  >
                    <Search className="size-4 text-gold" strokeWidth={1.8} />
                    <span className="text-[16px] text-paper/70">Search projects, services, pages…</span>
                    <kbd className="ml-auto rounded border border-paper/15 px-2 py-1 font-mono text-[11.5px] text-paper/40">
                      ⌘K
                    </kbd>
                  </button>

                  <div>
                    <p className="eyebrow text-paper/35">Tender desk</p>
                    <a
                      href={`mailto:${company.email}`}
                      className="mt-3 flex items-center gap-2.5 text-[17px] text-paper/85 transition-colors hover:text-gold"
                    >
                      <Mail className="size-4 text-gold" strokeWidth={1.6} />
                      {company.email}
                    </a>
                    <a
                      href={`tel:${company.phone.replace(/\s/g, "")}`}
                      className="mt-2.5 flex items-center gap-2.5 text-[17px] text-paper/85 transition-colors hover:text-gold"
                    >
                      <Phone className="size-4 text-gold" strokeWidth={1.6} />
                      {company.phone}
                    </a>
                    <p className="mt-2.5 flex items-start gap-2.5 text-[15px] leading-relaxed text-paper/50">
                      <MapPin className="mt-1 size-4 shrink-0 text-paper/35" strokeWidth={1.6} />
                      {offices[0]?.address}
                    </p>
                  </div>

                  <div>
                    <p className="eyebrow text-paper/35">Yards &amp; offices</p>
                    <ul className="mt-3 divide-y divide-paper/10">
                      {offices.slice(1).map((office) => (
                        <li key={office.id} className="flex items-baseline justify-between gap-3 py-2.5">
                          <span className="text-[15px] text-paper/75">{office.city}</span>
                          <span className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-paper/30">
                            {office.kind}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex">
                    <MagneticButton href="/contact" size="lg" className="w-full justify-center">
                      Request project tender
                    </MagneticButton>
                  </div>
                </div>

                <div className="mt-10 flex items-end justify-between gap-6 border-t border-paper/10 pt-5">
                  <div>
                    <p className="eyebrow text-paper/30">Dar es Salaam</p>
                    <div className="mt-1.5">
                      <LocalClock />
                    </div>
                  </div>
                  <Logo variant="mark" tone="inverse" height={34} />
                </div>
              </motion.aside>
            </div>

            <div
              className={cn(
                "relative flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 px-5 py-3.5 sm:px-8 lg:px-12",
                "font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper/30",
              )}
            >
              <span>{company.registration}</span>
              <span className="hidden sm:block">{company.crb}</span>
              <span>ISO 9001 · 45001 · 14001</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
