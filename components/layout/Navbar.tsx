"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShieldCheck, X } from "lucide-react";
import { company, primaryNavigation } from "@/data/siteData";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Logo } from "@/components/ui/Logo";
import { HingeMenu } from "@/components/layout/HingeMenu";
import { SiteSearch } from "@/components/layout/SiteSearch";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Legal documents sit on alabaster; everything else opens on obsidian.
  const darkTop = !pathname.startsWith("/legal");
  const overlayOpen = menuOpen || searchOpen;
  const onDarkHero = darkTop && (overlayOpen || !scrolled);
  const solid = scrolled && !overlayOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[130] transition-all duration-500",
          solid
            ? "border-b border-ink/10 bg-paper/85 backdrop-blur-xl supports-[backdrop-filter]:bg-paper/70"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-4 lg:h-[82px]">
          <Link
            href="/"
            aria-label="Altra Build home"
            className="relative z-10 flex shrink-0 items-center gap-3"
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
                "hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] 2xl:flex",
                onDarkHero ? "text-paper/50" : "text-ink/45",
              )}
            >
              <ShieldCheck className="size-3.5" strokeWidth={1.7} />
              ISO 9001:2015
            </span>
          </Link>

          <nav
            className={cn(
              "hidden items-center gap-5 lg:flex xl:gap-7",
              overlayOpen && "lg:hidden",
            )}
            aria-label="Primary"
          >
            {primaryNavigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.12em] transition-colors",
                    onDarkHero ? "text-paper/70 hover:text-paper" : "text-ink/65 hover:text-ink",
                    active && "text-gold",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      onDarkHero ? "bg-gold" : "bg-ink",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className={cn(
                "hidden font-mono text-[12px] tracking-[0.08em] transition-colors 2xl:block",
                overlayOpen && "xl:hidden",
                onDarkHero ? "text-paper/55 hover:text-gold" : "text-ink/50 hover:text-ink",
              )}
            >
              {company.phone}
            </a>

            <div className={cn("hidden shrink-0 xl:block", overlayOpen && "xl:hidden")}>
              <MagneticButton
                href="/contact"
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
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              aria-label="Search the site"
              aria-expanded={searchOpen}
              className={cn(
                "flex size-10 items-center justify-center border transition-colors",
                onDarkHero
                  ? "border-paper/25 text-paper hover:border-gold hover:text-gold"
                  : "border-ink/20 text-ink hover:border-ink",
              )}
            >
              <Search className="size-4" strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMenuOpen((value) => !value);
              }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className={cn(
                "group flex h-10 items-center gap-2 border px-3 transition-colors",
                onDarkHero
                  ? "border-paper/25 text-paper hover:border-gold hover:text-gold"
                  : "border-ink/20 text-ink hover:border-ink",
              )}
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              <span className="hidden font-mono text-[12px] uppercase tracking-[0.14em] sm:block">
                {menuOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <HingeMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSearch={() => setSearchOpen(true)}
      />
      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
