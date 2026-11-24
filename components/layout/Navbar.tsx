"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, Search, X } from "lucide-react";
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
  const onDarkHero = overlayOpen || (darkTop && !scrolled);
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

  const chrome = onDarkHero
    ? {
        link: "text-paper/70 hover:text-paper",
        control: "border-paper/25 text-paper hover:border-gold/70 hover:text-gold",
        divider: "bg-paper/20",
        hover: "hover:bg-paper/10",
      }
    : {
        link: "text-ink/60 hover:text-ink",
        control: "border-ink/20 text-ink hover:border-ink/60 hover:text-ink",
        divider: "bg-ink/15",
        hover: "hover:bg-ink/[0.05]",
      };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[130] transition-[background-color,border-color,box-shadow,height] duration-500",
          solid
            ? "border-b border-ink/10 bg-paper/90 shadow-[0_20px_44px_-38px_rgba(15,17,23,0.65)] backdrop-blur-xl supports-[backdrop-filter]:bg-paper/80"
            : onDarkHero
              ? "border-b border-paper/10 bg-gradient-to-b from-ink/75 via-ink/30 to-transparent"
              : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "shell flex items-center gap-5 transition-[height] duration-500 xl:gap-8",
            solid ? "h-[64px] lg:h-[70px]" : "h-[68px] lg:h-[84px]",
          )}
        >
          <Link
            href="/"
            aria-label="Altra Build home"
            className="relative z-10 flex shrink-0 items-center"
          >
            <Logo
              variant="lockup"
              tone={onDarkHero ? "inverse" : "ink"}
              height={onDarkHero ? 28 : 27}
              priority
            />
          </Link>

          <nav
            className={cn(
              "hidden items-center gap-0.5 lg:flex xl:gap-1",
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
                    "group relative flex h-9 items-center whitespace-nowrap px-2.5 font-mono text-[11.5px] uppercase tracking-[0.13em] transition-colors xl:px-3 xl:text-[12px]",
                    chrome.link,
                    active && "text-gold",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-2.5 bottom-0 h-[2px] origin-left transition-transform duration-300 xl:inset-x-3",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      onDarkHero ? "bg-gold" : "bg-ink",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5 xl:gap-3">
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className={cn(
                "hidden shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[11.5px] tracking-[0.08em] transition-colors 2xl:flex",
                chrome.link,
              )}
            >
              <Phone className="size-3.5" strokeWidth={1.8} />
              {company.phone}
            </a>

            <span
              aria-hidden
              className={cn(
                "hidden h-5 w-px shrink-0 2xl:block",
                chrome.divider,
              )}
            />

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

            <div
              className={cn(
                "flex h-11 items-stretch overflow-hidden rounded-[3px] border transition-colors sm:h-9",
                chrome.control,
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                aria-label="Search the site"
                aria-expanded={searchOpen}
                className={cn(
                  "flex w-10 items-center justify-center outline-none transition-colors focus-visible:bg-gold/15 sm:w-9",
                  chrome.hover,
                )}
              >
                <Search className="size-4" strokeWidth={1.8} />
              </button>
              <span aria-hidden className={cn("w-px", chrome.divider)} />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setMenuOpen((value) => !value);
                }}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className={cn(
                  "group flex items-center gap-2 px-3 outline-none transition-colors focus-visible:bg-gold/15",
                  chrome.hover,
                )}
              >
                {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                <span className="hidden font-mono text-[11.5px] uppercase tracking-[0.14em] sm:block">
                  {menuOpen ? "Close" : "Menu"}
                </span>
              </button>
            </div>
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
