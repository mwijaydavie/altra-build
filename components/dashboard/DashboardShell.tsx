"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ArrowUpRight,
  Bell,
  Boxes,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Command,
  ExternalLink,
  HardHat,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Smartphone,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, useTransition } from "react";

import { Avatar, Chip } from "@/components/dashboard/ui";
import { switchRole, useClock, useOnline } from "@/lib/ops/hooks";
import { cn } from "@/lib/utils";
import type { Profile, Role } from "@/types/construction";

type ShellProject = { id: string; name: string; status: string; light: "green" | "amber" | "red" };

const ROLE_LABEL: Record<Role, string> = {
  executive: "Executive",
  pm: "Project manager",
  engineer: "Engineer",
  client: "Client",
};

const NAV = [
  { href: "/dashboard", label: "Command centre", icon: LayoutDashboard, staff: false },
  { href: "/dashboard/procurement", label: "Procurement", icon: Boxes, staff: true },
  { href: "/dashboard/safety", label: "Safety & compliance", icon: ShieldCheck, staff: true },
  { href: "/field", label: "Field app", icon: Smartphone, staff: true },
] as const;

const DEMO_ROLES: { role: Role; name: string; note: string }[] = [
  { role: "executive", name: "Neema Mwakalinga", note: "CEO · full portfolio" },
  { role: "pm", name: "Baraka Mwakyusa", note: "PM · 4 assigned sites" },
  { role: "engineer", name: "Halima Juma", note: "Engineer · Msasani, Dodoma" },
  { role: "client", name: "Zahara Kimaro", note: "Client · read-only" },
];

export function DashboardShell({
  viewer,
  projects,
  pendingApprovals,
  alertCount,
  children,
}: {
  viewer: Profile;
  projects: ShellProject[];
  pendingApprovals: number;
  alertCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const online = useOnline();
  const clock = useClock();

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const labels = segments.map((segment, index) => {
      const project = projects.find((entry) => entry.id === segment);
      if (project) return project.name;
      if (segment === "dashboard") return "Command";
      if (segment === "projects") return "Projects";
      if (segment === "procurement") return "Procurement";
      if (segment === "safety") return "Safety";
      if (segment === "field") return "Field app";
      return segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    });
    return [{ label: "ALTRA", href: "/dashboard" }, ...labels.map((label, index) => ({
      label,
      href: `/${segments.slice(0, index + 1).join("/")}`,
    }))];
  }, [pathname, projects]);

  const matches = projects.filter((project) =>
    project.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const onSwitchRole = (role: Role) => {
    startTransition(async () => {
      await switchRole(role);
      queryClient.clear();
      router.refresh();
      router.push("/dashboard");
    });
  };

  return (
    <div className="min-h-dvh bg-ink text-paper selection:bg-gold selection:text-ink">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-paper/10 bg-[#0B0D13] transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Primary"
      >
        <div className="flex items-center justify-between border-b border-paper/10 px-5 py-4">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center border border-gold/40 bg-gold/10">
              <Command className="h-4 w-4 text-gold" strokeWidth={1.6} />
            </span>
            <span>
              <span className="block font-display text-[15px] font-semibold leading-none tracking-[-0.02em]">
                ALTRA <span className="text-gold">COMMAND</span>
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.28em] text-paper/40">
                Operations HUD · v2.4
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center text-paper/60 hover:text-paper lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 pb-2 font-mono text-[9px] uppercase tracking-[0.26em] text-paper/30">
            Operations
          </p>
          <ul className="space-y-1">
            {NAV.filter((item) => !item.staff || viewer.role !== "client").map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex min-h-11 items-center gap-3 border border-transparent px-2.5 text-[13px] transition-colors",
                      active
                        ? "border-gold/25 bg-gold/10 text-paper"
                        : "text-paper/60 hover:border-paper/10 hover:bg-paper/[0.04] hover:text-paper",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon
                      className={cn("h-4 w-4", active ? "text-gold" : "text-paper/40 group-hover:text-gold")}
                      strokeWidth={1.6}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/field" ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-paper/30" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 flex items-center justify-between px-2 pb-2 font-mono text-[9px] uppercase tracking-[0.26em] text-paper/30">
            <span>Sites</span>
            <span className="text-paper/20">{projects.length}</span>
          </p>
          <ul className="space-y-0.5">
            {projects.map((project) => {
              const active = pathname === `/dashboard/projects/${project.id}`;
              return (
                <li key={project.id}>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className={cn(
                      "flex min-h-10 items-center gap-2.5 px-2.5 py-1.5 text-[12px] transition-colors",
                      active ? "bg-paper/[0.06] text-paper" : "text-paper/55 hover:bg-paper/[0.04] hover:text-paper",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        project.light === "green"
                          ? "bg-[#6FD3A6]"
                          : project.light === "amber"
                            ? "bg-gold"
                            : "bg-[#F26D5B]",
                      )}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {viewer.role !== "client" ? (
          <div className="mt-6 space-y-2 border border-paper/10 bg-paper/[0.03] p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/35">Field link</p>
            <p className="text-[12px] leading-snug text-paper/60">
              Offline-first daily logs for supervisors on site.
            </p>
            <Link
              href="/field"
              className="inline-flex min-h-9 items-center gap-2 border border-gold/40 px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Open field app <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          ) : null}
        </nav>

        <div className="border-t border-paper/10 p-3">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 p-1.5 text-left transition-colors hover:bg-paper/[0.05]"
                aria-label="Account and role"
              >
                <Avatar name={viewer.fullName} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-paper">{viewer.fullName}</span>
                  <span className="block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-gold/80">
                    {ROLE_LABEL[viewer.role]}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-paper/40" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                side="top"
                align="start"
                sideOffset={8}
                className="z-[70] w-[248px] border border-paper/15 bg-[#12141C] p-1.5 shadow-2xl"
              >
                <div className="px-2 py-2">
                  <p className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-paper/40">{viewer.email}</p>
                  <p className="mt-1 text-[12px] text-paper/70">{viewer.title}</p>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-paper/10" />
                <DropdownMenu.Label className="px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/35">
                  Switch demo role
                </DropdownMenu.Label>
                {DEMO_ROLES.map((entry) => (
                  <DropdownMenu.Item
                    key={entry.role}
                    onSelect={() => onSwitchRole(entry.role)}
                    disabled={pending}
                    className="flex cursor-pointer items-center gap-2 px-2 py-2 text-[12px] text-paper/75 outline-none data-[highlighted]:bg-paper/[0.07] data-[highlighted]:text-paper"
                  >
                    <CircleDot
                      className={cn(
                        "h-3 w-3",
                        entry.role === viewer.role ? "text-gold" : "text-paper/25",
                      )}
                    />
                    <span className="flex-1">
                      {entry.name}
                      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">
                        {entry.note}
                      </span>
                    </span>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="my-1 h-px bg-paper/10" />
                <DropdownMenu.Item asChild>
                  <Link
                    href="/portal"
                    className="flex cursor-pointer items-center gap-2 px-2 py-2 text-[12px] text-paper/70 outline-none data-[highlighted]:bg-paper/[0.07] data-[highlighted]:text-paper"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Client portal
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link
                    href="/"
                    className="flex cursor-pointer items-center gap-2 px-2 py-2 text-[12px] text-paper/70 outline-none data-[highlighted]:bg-paper/[0.07] data-[highlighted]:text-paper"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Exit to altrabuild.co.tz
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Main column */}
      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-paper/10 bg-ink/95 backdrop-blur">
          <div className="flex min-h-14 items-center gap-3 px-3 sm:px-5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center border border-paper/15 text-paper/70 hover:text-paper lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 md:flex">
              {crumbs.map((crumb, index) => (
                <span key={`${crumb.href}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? <ChevronRight className="h-3 w-3 text-paper/25" /> : null}
                  <Link
                    href={crumb.href}
                    className={cn(
                      "max-w-[180px] truncate font-mono text-[10px] uppercase tracking-[0.18em]",
                      index === crumbs.length - 1 ? "text-paper/80" : "text-paper/40 hover:text-gold",
                    )}
                  >
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-paper/35" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
                  placeholder="Jump to a site…"
                  aria-label="Search sites"
                  className="h-9 w-44 border border-paper/15 bg-paper/[0.03] pl-8 pr-2 text-[12px] text-paper placeholder:text-paper/30 focus:border-gold/50 focus:outline-none lg:w-56"
                />
                {searchOpen && search.trim() ? (
                  <div className="absolute left-0 top-10 z-40 w-64 border border-paper/15 bg-[#12141C] p-1 shadow-2xl">
                    {matches.length ? (
                      matches.slice(0, 6).map((project) => (
                        <Link
                          key={project.id}
                          href={`/dashboard/projects/${project.id}`}
                          className="flex items-center gap-2 px-2 py-2 text-[12px] text-paper/75 hover:bg-paper/[0.07] hover:text-paper"
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              project.light === "green"
                                ? "bg-[#6FD3A6]"
                                : project.light === "amber"
                                  ? "bg-gold"
                                  : "bg-[#F26D5B]",
                            )}
                          />
                          {project.name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-2 py-2 text-[12px] text-paper/40">No site matches.</p>
                    )}
                  </div>
                ) : null}
              </div>

              <span
                className={cn(
                  "hidden items-center gap-1.5 border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] sm:inline-flex",
                  online
                    ? "border-[#6FD3A6]/30 bg-[#6FD3A6]/10 text-[#6FD3A6]"
                    : "border-gold/40 bg-gold/10 text-gold",
                )}
              >
                {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {online ? "Live" : "Offline"}
              </span>

              <Link
                href="/dashboard/safety"
                className="relative flex h-9 w-9 items-center justify-center border border-paper/15 text-paper/60 hover:border-gold/40 hover:text-gold"
                aria-label={`${alertCount} open alerts`}
              >
                <Bell className="h-4 w-4" />
                {alertCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-[#F26D5B] px-1 font-mono text-[9px] font-bold text-ink">
                    {alertCount}
                  </span>
                ) : null}
              </Link>

              {viewer.role !== "client" ? (
                <Chip tone="gold" className="hidden lg:inline-flex">
                  <HardHat className="h-3 w-3" /> {pendingApprovals} approvals
                </Chip>
              ) : null}

              <div className="hidden items-center gap-2 border-l border-paper/10 pl-2 xl:flex">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/35">EAT</span>
                <span className="font-mono text-[11px] tabular-nums text-paper/70">
                  {clock ? clock.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Dar_es_Salaam" }) : "--:--"}
                </span>
              </div>

              <span className="lg:hidden">
                <Avatar name={viewer.fullName} size="sm" />
              </span>
            </div>
          </div>
        </header>

        <main id="command-main" className="relative">
          {children}
        </main>

        <footer className="border-t border-paper/10 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/30">
            <span>ALTRA COMMAND · Altra Build Co. Ltd · Dar es Salaam</span>
            <span className="flex items-center gap-3">
              <span>ISO 45001 aligned</span>
              <span className="h-1 w-1 rounded-full bg-paper/20" />
              <span>Demo data · {viewer.role}</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
