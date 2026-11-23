"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShieldCheck, X } from "lucide-react";
import { navigation, company } from "@/data/siteData";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const pathname = usePathname();
  const { scrollTo, stop, start } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Every page opens on an obsidian header except the legal documents, which
  // sit on alabaster. The nav therefore starts inverse and flips on scroll.
  const darkTop = !pathname.startsWith("/legal");
  const onDarkHero = darkTop && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    stop();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, start, stop]);

  function handleAnchor(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("/#")) return;
    const hash = href.slice(1);
    if (pathname === "/") {
      event.preventDefault();
      setOpen(false);
      window.setTimeout(() => scrollTo(hash, -80), 60);
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
          scrolled || open
            ? "border-b border-ink/10 bg-paper/85 backdrop-blur-xl supports-[backdrop-filter]:bg-paper/70"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 lg:h-[82px]">
          <Link
            href="/"
            aria-label="Altra Build home"
            className="relative z-10 flex shrink-0 items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <Logo
              variant="lockup"
              tone={onDarkHero ? "inverse" : "ink"}
              height={onDarkHero ? 30 : 28}
              priority
            />
            <span
              className={cn(
                "hidden h-7 w-px xl:block",
                onDarkHero ? "bg-paper/20" : "bg-ink/15",
              )}
            />
            <span
              className={cn(
                "hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] xl:flex",
                onDarkHero ? "text-paper/50" : "text-ink/45",
              )}
            >
              <ShieldCheck className="size-3" strokeWidth={1.7} />
              ISO 9001:2015
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleAnchor(event, item.href)}
                className={cn(
                  "group relative font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors",
                  onDarkHero
                    ? "text-paper/70 hover:text-paper"
                    : "text-ink/65 hover:text-ink",
                  pathname === item.href && "text-gold",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                    onDarkHero ? "bg-gold" : "bg-ink",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className={cn(
                "hidden font-mono text-[10.5px] tracking-[0.12em] transition-colors xl:block",
                onDarkHero ? "text-paper/55 hover:text-gold" : "text-ink/50 hover:text-ink",
              )}
            >
              {company.phone}
            </a>
            <div className="hidden sm:block">
              <MagneticButton
                href="/#rfq"
                size="sm"
                variant={onDarkHero ? "gold" : "ink"}
                strength={8}
                className="font-mono"
              >
                Request tender
              </MagneticButton>
            </div>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={cn(
                "flex size-10 items-center justify-center border transition-colors lg:hidden",
                onDarkHero
                  ? "border-paper/25 text-paper hover:border-gold hover:text-gold"
                  : "border-ink/20 text-ink hover:border-ink",
              )}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[95] flex flex-col overflow-y-auto bg-ink pt-[68px] text-paper lg:hidden"
          >
            <div className="shell flex flex-1 flex-col justify-between py-8">
              <nav className="flex flex-col" aria-label="Mobile">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ y: 36, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.12 + index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={(event) => handleAnchor(event, item.href)}
                      className="group flex items-baseline justify-between gap-4 border-b border-paper/10 py-5"
                    >
                      <span className="display-md text-[clamp(1.9rem,8vw,2.6rem)] uppercase text-paper/90 transition-colors group-hover:text-gold">
                        {item.label}
                      </span>
                      <span className="meta shrink-0 text-paper/35">{item.meta}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42, duration: 0.6 }}
                className="mt-10 space-y-6"
              >
                <MagneticButton href="/#rfq" size="lg" className="w-full justify-center">
                  Request project tender
                </MagneticButton>
                <div className="grid grid-cols-2 gap-4 border-t border-paper/10 pt-6">
                  <div>
                    <p className="meta text-paper/35">Tender desk</p>
                    <a href={`mailto:${company.email}`} className="mt-1 block text-sm text-paper/85">
                      {company.email}
                    </a>
                  </div>
                  <div>
                    <p className="meta text-paper/35">24h site line</p>
                    <a href={`tel:${company.emergency.replace(/\s/g, "")}`} className="mt-1 block text-sm text-gold">
                      {company.emergency}
                    </a>
                  </div>
                </div>
                <Logo variant="mark" tone="inverse" height={30} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
