"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calculator,
  CornerDownLeft,
  FileText,
  HardHat,
  LayoutGrid,
  Lock,
  Search,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { matchEntries, searchGroups, type SearchGroup } from "@/lib/siteSearch";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

type Filter = SearchGroup | "All";

const filters: Filter[] = ["All", ...searchGroups];

const quickActions = [
  {
    label: "Get a budget estimate",
    hint: "60 sec",
    href: "/estimator",
    icon: Calculator,
  },
  {
    label: "Request a tender",
    hint: "2h SLA",
    href: "/contact",
    icon: FileText,
  },
  {
    label: "Client portal",
    hint: "Sign in",
    href: "/portal",
    icon: Lock,
  },
  {
    label: "Field app",
    hint: "Offline",
    href: "/field",
    icon: HardHat,
  },
];

const groupIcon: Record<SearchGroup, typeof Building2> = {
  Pages: LayoutGrid,
  Services: Wrench,
  Projects: Building2,
};

interface SiteSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Site search — a native port of the VengeanceUI search-modal pattern:
 * live-filtered rows, removable-feeling filter chips, quick actions and
 * keyboard hints. Rebuilt on Radix-free framer-motion + lucide so it matches
 * the Altra token set and ships no extra icon dependency.
 */
export function SiteSearch({ open, onOpenChange }: SiteSearchProps) {
  const router = useRouter();
  const { stop, start } = useSmoothScroll();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState(0);

  const results = useMemo(() => matchEntries(query, filter), [query, filter]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  // ⌘K / Ctrl+K opens from anywhere, Escape closes.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
      if (event.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, open, onOpenChange]);

  // Scroll lock + focus.
  useEffect(() => {
    if (!open) return;
    stop();
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      start();
    };
  }, [open, start, stop]);

  // Reset the query a beat after closing so the exit animation stays stable.
  useEffect(() => {
    if (open) return;
    const id = window.setTimeout(() => {
      setQuery("");
      setFilter("All");
    }, 220);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => setActive(0), [query, filter]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    }
    if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active]!.href);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[10vh] sm:pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search the site"
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={close}
            className="absolute inset-0 cursor-default bg-ink/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-lg border border-paper/12 bg-[#101219] text-paper shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          >
            {/* query */}
            <div className="flex items-center gap-3 border-b border-paper/10 px-5 py-4">
              <Search className="size-5 shrink-0 text-gold" strokeWidth={1.7} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search projects, services, pages…"
                aria-label="Search"
                className="min-w-0 flex-1 bg-transparent text-[17px] text-paper outline-none placeholder:text-paper/35"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="flex size-8 items-center justify-center rounded border border-paper/12 text-paper/50 transition-colors hover:border-paper/30 hover:text-paper"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* filters */}
            <div className="flex flex-wrap items-center gap-2 border-b border-paper/10 px-5 py-3.5">
              <span className="mr-1 font-mono text-[12px] uppercase tracking-[0.16em] text-paper/35">
                Filter
              </span>
              {filters.map((item) => {
                const selected = filter === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[13.5px] transition-colors",
                      selected
                        ? "border-gold bg-gold text-ink"
                        : "border-paper/15 text-paper/65 hover:border-paper/35 hover:text-paper",
                    )}
                  >
                    {item}
                  </button>
                );
              })}
              <span className="ml-auto font-mono text-[12px] uppercase tracking-[0.14em] text-paper/35">
                {results.length} result{results.length === 1 ? "" : "s"}
              </span>
            </div>

            {/* results */}
            <div className="max-h-[46vh] overflow-y-auto px-2 py-2" data-lenis-prevent>
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-[16px] text-paper/70">No match for “{query}”.</p>
                  <p className="mt-2 text-[14px] text-paper/40">
                    Try “bridge”, “Dodoma”, “BIM” or ask the tender desk directly.
                  </p>
                </div>
              ) : (
                <ul>
                  {results.map((entry, index) => {
                    const Icon = groupIcon[entry.group];
                    const isActive = index === active;
                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(index)}
                          onClick={() => go(entry.href)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition-colors",
                            isActive ? "bg-paper/[0.07]" : "hover:bg-paper/[0.04]",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded border",
                              isActive
                                ? "border-gold/40 bg-gold/10 text-gold"
                                : "border-paper/10 text-paper/45",
                            )}
                          >
                            <Icon className="size-4" strokeWidth={1.6} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[16px] leading-snug text-paper">
                              {entry.title}
                            </span>
                            <span className="block truncate text-[13.5px] text-paper/45">
                              {entry.meta}
                            </span>
                          </span>
                          <ArrowRight
                            className={cn(
                              "size-4 shrink-0 transition-opacity",
                              isActive ? "text-gold opacity-100" : "text-paper/30 opacity-0",
                            )}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* quick actions */}
            <div className="border-t border-paper/10 px-3 py-3">
              <p className="px-2 font-mono text-[12px] uppercase tracking-[0.16em] text-paper/35">
                Quick actions
              </p>
              <div className="mt-2 grid gap-1 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <button
                    key={action.href}
                    type="button"
                    onClick={() => go(action.href)}
                    className="group flex items-center gap-2.5 rounded px-2 py-2 text-left transition-colors hover:bg-paper/[0.05]"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded bg-paper/[0.06] text-paper/60 group-hover:text-gold">
                      <action.icon className="size-4" strokeWidth={1.6} />
                    </span>
                    <span className="text-[15px] text-paper/80 group-hover:text-paper">
                      {action.label}
                    </span>
                    <span className="ml-auto font-mono text-[11.5px] uppercase tracking-[0.12em] text-paper/30">
                      {action.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* key hints */}
            <div className="flex items-center justify-between gap-4 border-t border-paper/10 bg-black/20 px-5 py-2.5">
              <div className="flex items-center gap-4 font-mono text-[11.5px] uppercase tracking-[0.12em] text-paper/35">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-paper/15 px-1.5 py-0.5">↑</kbd>
                  <kbd className="rounded border border-paper/15 px-1.5 py-0.5">↓</kbd>
                  move
                </span>
                <span className="flex items-center gap-1.5">
                  <CornerDownLeft className="size-3.5" /> open
                </span>
                <span className="hidden items-center gap-1.5 sm:flex">
                  <kbd className="rounded border border-paper/15 px-1.5 py-0.5">esc</kbd> close
                </span>
              </div>
              <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-paper/25">
                ALTRA / SEARCH
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
