"use client";

import { Check, Monitor, Moon, Settings2, ShieldCheck, Smartphone, Sun } from "lucide-react";
import Link from "next/link";

import { Chip, Eyebrow, LoadingBlock, Panel, PanelHeader } from "@/components/dashboard/ui";
import { useTheme, type ThemePreference } from "@/components/theme/ThemeProvider";
import { useOpsSnapshot } from "@/lib/ops/hooks";
import { cn } from "@/lib/utils";

const THEMES: {
  id: ThemePreference;
  label: string;
  icon: typeof Moon;
  note: string;
  preview: { shell: string; panel: string; line: string };
}[] = [
  {
    id: "dark",
    label: "Command dark",
    icon: Moon,
    note: "The default night-shift palette. Obsidian surfaces, gold telemetry.",
    preview: { shell: "#0F1117", panel: "#151821", line: "rgba(247,242,231,0.18)" },
  },
  {
    id: "light",
    label: "Site white",
    icon: Sun,
    note: "Warm white surfaces for daylight reviews, printing and client screens.",
    preview: { shell: "#F5F0E5", panel: "#FFFDF8", line: "rgba(27,29,36,0.16)" },
  },
  {
    id: "system",
    label: "Match device",
    icon: Monitor,
    note: "Follows your operating system. Switches automatically at dusk.",
    preview: { shell: "linear-gradient(90deg,#0F1117 0 50%,#F5F0E5 50% 100%)", panel: "#151821", line: "rgba(247,242,231,0.18)" },
  },
];

export default function SettingsPage() {
  const { theme, resolved, setTheme } = useTheme();
  const { data, isLoading } = useOpsSnapshot();

  if (isLoading || !data) {
    return (
      <div className="space-y-3 px-3 py-5 sm:px-5">
        <LoadingBlock className="h-16 w-1/2" />
        <LoadingBlock className="h-64" />
        <LoadingBlock className="h-40" />
      </div>
    );
  }

  const { viewer, projects } = data;
  const assigned = projects.filter((project) => project.status === "active").length;

  return (
    <div className="px-3 pb-10 pt-5 sm:px-5 sm:pt-6">
      <div className="flex flex-col gap-4 border-b border-paper/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Workspace settings · 23 Nov 2026 · EAT</Eyebrow>
          <h1 className="mt-2 font-display text-[27px] font-semibold leading-[1.05] tracking-[-0.035em] text-paper sm:text-[34px]">
            Settings.
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-paper/50">
            Appearance, interface treatment and the account attached to this command console. Changes apply to the
            dashboard and the field app on this device — no reload needed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="neutral">
            <Settings2 className="h-3 w-3" /> {theme === "system" ? "System preference" : theme === "light" ? "White theme" : "Dark theme"}
          </Chip>
          <span className="inline-flex items-center gap-1.5 border border-paper/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/45">
            <span
              className={cn("h-1.5 w-1.5 rounded-full", resolved === "light" ? "bg-gold" : "bg-[#6FD3A6]")}
              aria-hidden
            />
            Rendering {resolved}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader
            eyebrow="01 / Appearance"
            title="Colour theme"
            action={<span className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35">Saved on this device</span>}
          />
          <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5" role="group" aria-label="Colour theme">
            {THEMES.map((option) => {
              const Icon = option.icon;
              const active = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  aria-pressed={active}
                  className={cn(
                    "group flex flex-col overflow-hidden rounded-lg border p-0 text-left transition-colors",
                    active
                      ? "border-gold/60 bg-gold/[0.06]"
                      : "border-paper/12 bg-[var(--ops-panel-2)] hover:border-paper/25 hover:bg-[var(--ops-raised)]",
                  )}
                >
                  <span
                    className="flex h-24 w-full flex-col gap-1.5 p-3"
                    style={{ background: option.preview.shell }}
                    aria-hidden
                  >
                    <span className="h-2 w-1/3 rounded-[2px]" style={{ background: option.preview.line }} />
                    <span
                      className="mt-auto flex h-12 w-full items-center gap-2 rounded-[6px] px-2"
                      style={{ background: option.preview.panel }}
                    >
                      <span className="h-6 w-6 rounded-[4px]" style={{ border: `1px solid ${option.preview.line}` }} />
                      <span className="flex flex-1 flex-col gap-1.5">
                        <span className="h-1.5 w-2/3 rounded-full" style={{ background: option.preview.line }} />
                        <span className="h-1.5 w-1/2 rounded-full opacity-60" style={{ background: option.preview.line }} />
                      </span>
                    </span>
                  </span>
                  <span className="flex w-full items-start gap-2.5 border-t border-paper/10 p-3">
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-gold" : "text-paper/45")} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[13px] font-medium text-paper">
                        {option.label}
                        {active ? <Check className="h-3.5 w-3.5 text-gold" /> : null}
                      </span>
                      <span className="mt-1 block text-[11.5px] leading-relaxed text-paper/45">{option.note}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="border-t border-paper/10 px-4 py-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper/35 sm:px-5">
            Softened corners and lighter hairlines are applied to both themes · system preference follows your device
          </p>
        </Panel>

        <Panel>
          <PanelHeader eyebrow="02 / Interface" title="Treatment" />
          <dl className="divide-y divide-paper/10 text-[12.5px]">
            {[
              { label: "Corners", value: "Soft · 7 px" },
              { label: "Hairlines", value: "12% ink" },
              { label: "Density", value: "Comfortable" },
              { label: "Motion", value: "Respects reduced motion" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
                <dt className="text-paper/45">{row.label}</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/75">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="border-t border-paper/10 px-4 py-3 text-[11.5px] leading-relaxed text-paper/40 sm:px-5">
            Interface treatment is locked to the brand system for this demo build.
          </p>
        </Panel>

        <Panel className="xl:col-span-3">
          <PanelHeader eyebrow="03 / Account" title="Signed-in profile" />
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-paper/35">Name</p>
              <p className="mt-1 text-[13px] text-paper">{viewer.fullName}</p>
            </div>
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-paper/35">Role</p>
              <p className="mt-1 text-[13px] capitalize text-paper">{viewer.role}</p>
            </div>
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-paper/35">Email</p>
              <p className="mt-1 truncate text-[13px] text-paper">{viewer.email}</p>
            </div>
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-paper/35">Portfolio</p>
              <p className="mt-1 text-[13px] text-paper">{assigned} active sites</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-paper/10 px-4 py-3 sm:px-5">
            <Link
              href="/dashboard"
              className="inline-flex min-h-9 items-center gap-2 rounded-[7px] border border-paper/20 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Command centre
            </Link>
            <Link
              href="/field"
              className="inline-flex min-h-9 items-center gap-2 rounded-[7px] border border-paper/20 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <Smartphone className="h-3.5 w-3.5" /> Field app
            </Link>
            <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
              Demo session · {viewer.role} access
            </span>
          </div>
        </Panel>
      </div>
    </div>
  );
}
