"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  ArrowRight,
  Check,
  Download,
  FileText,
  LogOut,
  Mail,
  ShieldCheck,
  TriangleAlert,
  User,
} from "lucide-react";
import { portalLoginSchema, type PortalLoginValues } from "@/lib/validation";
import { portalActivity, portalProjects } from "@/data/siteData";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const DEMO = { email: "projects@tumaini.co.tz", password: "kifaru2026" };

export function PortalClient() {
  const [hydrated, setHydrated] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [activeId, setActiveId] = useState(portalProjects[0]?.id ?? "pp1");

  const form = useForm<PortalLoginValues>({
    resolver: zodResolver(portalLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    setHydrated(true);
    try {
      setAuthed(sessionStorage.getItem("altra-portal") === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const project = useMemo(
    () => portalProjects.find((item) => item.id === activeId) ?? portalProjects[0]!,
    [activeId],
  );

  function signIn() {
    try {
      sessionStorage.setItem("altra-portal", "1");
    } catch {
      /* ignore */
    }
    setAuthed(true);
  }

  function signOut() {
    try {
      sessionStorage.removeItem("altra-portal");
    } catch {
      /* ignore */
    }
    setAuthed(false);
    form.reset();
  }

  function downloadReport() {
    const payload = {
      generatedAt: new Date().toISOString(),
      project,
      activity: portalActivity,
      issuedBy: "Altra Build Limited",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `altra-${project.code.replace(/\//g, "-")}-report.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ink">
        <Logo variant="lockup" tone="inverse" height={32} className="opacity-60" />
      </div>
    );
  }

  if (!authed) {
    return (
      <section className="relative min-h-[100svh] overflow-hidden bg-ink pb-20 pt-28 text-paper lg:pt-32">
        <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-20" aria-hidden />
        <div className="pointer-events-none absolute -right-32 -top-24 opacity-[0.06]" aria-hidden>
          <Logo variant="mark" tone="inverse" height={520} />
        </div>

        <div className="shell relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow flex items-center gap-2 text-gold">
              <ShieldCheck className="size-3.5" strokeWidth={1.8} />
              Secure client access
            </p>
            <h1 className="display-lg mt-5 uppercase">
              Your project, <span className="text-outline">live.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/55">
              Programme, documents, RFIs, invoices and safety records — the same dashboard our project
              directors work from, scoped to your contract.
            </p>

            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-paper/15 pt-6 sm:grid-cols-4">
              {[
                { k: "Live projects", v: "17" },
                { k: "Documents", v: "4,280" },
                { k: "RFI response", v: "1.8 d" },
                { k: "Uptime", v: "99.9%" },
              ].map((item) => (
                <div key={item.k}>
                  <dd className="font-display text-xl leading-none text-paper">{item.v}</dd>
                  <dt className="mt-2 text-[9.5px] uppercase tracking-[0.08em] text-paper/35">{item.k}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex items-start gap-3 border border-paper/15 bg-paper/[0.03] p-4">
              <Logo variant="mark" tone="inverse" height={32} />
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-gold">Demo access</p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-paper/45">
                  Use <span className="text-paper/75">{DEMO.email}</span> with{" "}
                  <span className="text-paper/75">{DEMO.password}</span> to explore the portal.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-paper/15 bg-ink-800 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-paper/10 pb-4">
              <p className="eyebrow text-paper/45">Client sign in</p>
              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">
                <span className="size-1.5 rounded-full bg-gold" />
                TLS 1.3
              </span>
            </div>

            <form
              className="mt-6 space-y-5"
              onSubmit={form.handleSubmit(signIn)}
              noValidate
            >
              <div>
                <label htmlFor="portal-email" className="meta mb-2 block text-paper/40">
                  Registered email
                </label>
                <div className="flex items-center gap-3 border-b border-paper/25 pb-2.5 focus-within:border-gold">
                  <Mail className="size-4 text-paper/30" strokeWidth={1.7} />
                  <input
                    id="portal-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.co.tz"
                    className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-paper/20"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-hazard">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="portal-password" className="meta mb-2 block text-paper/40">
                  Password
                </label>
                <div className="flex items-center gap-3 border-b border-paper/25 pb-2.5 focus-within:border-gold">
                  <User className="size-4 text-paper/30" strokeWidth={1.7} />
                  <input
                    id="portal-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-paper/20"
                    {...form.register("password")}
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-hazard">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <MagneticButton type="submit" size="md" variant="gold" className="flex-1 justify-center">
                  Sign in
                </MagneticButton>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("email", DEMO.email);
                    form.setValue("password", DEMO.password);
                  }}
                  className="inline-flex h-12 items-center border border-paper/20 px-5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60 transition-colors hover:border-gold hover:text-gold"
                >
                  Use demo access
                </button>
              </div>
            </form>

            <p className="mt-6 border-t border-paper/10 pt-4 text-[10.5px] leading-relaxed text-paper/30">
              Access is issued per organisation and protected by SSO or MFA. Lost credentials? Contact
              your account manager or email tender@altrabuild.co.tz.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const openRfis = portalProjects.reduce(
    (total, item) => total + item.rfis.filter((rfi) => rfi.status === "Open").length,
    0,
  );
  const documents = portalProjects.reduce((total, item) => total + item.documents.length, 0);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink pb-20 pt-24 text-paper lg:pt-28">
      <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-15" aria-hidden />
      <div className="shell relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/15 pb-5">
          <div className="flex items-center gap-3">
            <Logo variant="mark" tone="inverse" height={30} />
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-gold">Altra Portal</p>
              <p className="mt-0.5 text-[12px] text-paper/55">Tumaini Estates · Client access</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadReport}
              className="hidden h-9 items-center gap-2 border border-paper/20 px-3 font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/60 transition-colors hover:border-gold hover:text-gold sm:flex"
            >
              <Download className="size-3" />
              Export record
            </button>
            <button
              type="button"
              onClick={signOut}
              className="flex h-9 items-center gap-2 border border-paper/20 px-3 font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/60 transition-colors hover:border-hazard hover:text-hazard"
            >
              <LogOut className="size-3" />
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <p className="eyebrow text-paper/35">Your portfolio</p>
              <div className="mt-4 space-y-2">
                {portalProjects.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      "w-full border p-4 text-left transition-colors",
                      item.id === activeId
                        ? "border-gold/50 bg-paper/[0.06]"
                        : "border-paper/10 hover:border-paper/25",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-gold/80">
                        {item.code}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[8.5px] uppercase tracking-[0.08em]",
                          item.status === "At risk" ? "text-hazard" : "text-paper/35",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] text-paper/85">{item.name}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-[3px] flex-1 bg-paper/10">
                        <div className="h-full bg-gold" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="font-mono text-[9px] text-paper/40">{item.progress}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Open RFIs", value: String(openRfis) },
                { label: "Documents", value: String(documents) },
                { label: "Contracts", value: String(portalProjects.length) },
                { label: "Safety", value: "0 LTI" },
              ].map((stat) => (
                <div key={stat.label} className="border border-paper/10 p-3.5">
                  <p className="font-display text-lg leading-none text-paper">{stat.value}</p>
                  <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.08em] text-paper/30">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="border border-paper/10 bg-ink-800 p-4">
              <p className="meta text-paper/30">Your account manager</p>
              <p className="mt-2 text-[13px] text-paper/80">Eng. Neema Mwakalinga</p>
              <p className="mt-1 text-[10.5px] text-paper/40">Project Director · +255 754 118 220</p>
              <a
                href="mailto:neema.mwakalinga@altrabuild.co.tz"
                className="mt-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-gold/80 hover:text-gold"
              >
                Message
                <ArrowRight className="size-3" />
              </a>
            </div>
          </div>

          {/* Main panel */}
          <div className="border border-paper/10 bg-paper/[0.03] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-paper/10 pb-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-gold">{project.code}</p>
                <h2 className="display-md mt-2 text-paper">{project.name}</h2>
                <p className="mt-1.5 text-[11.5px] text-paper/40">
                  {project.phase} · {project.contractValue}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl leading-none text-gold">{project.progress}%</p>
                <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-paper/30">
                  Complete
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="border border-paper/10 p-4">
                <p className="meta text-paper/30">Next milestone</p>
                <p className="mt-2 text-[12.5px] leading-snug text-paper/75">{project.nextMilestone}</p>
                <p className="mt-1 font-mono text-[9.5px] text-gold/70">{project.nextMilestoneDate}</p>
              </div>
              <div className="border border-paper/10 p-4">
                <p className="meta text-paper/30">Safety · project to date</p>
                <p className="mt-2 text-[12.5px] leading-snug text-paper/75">
                  0 lost-time injuries · 612,000 man-hours
                </p>
                <p className="mt-1 flex items-center gap-1.5 font-mono text-[9.5px] text-paper/35">
                  <ShieldCheck className="size-3 text-gold" />
                  Kifaru Standard verified
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="border border-paper/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="meta text-paper/30">Documents</p>
                  <FileText className="size-3.5 text-paper/25" />
                </div>
                <ul className="mt-3 space-y-2.5">
                  {project.documents.map((doc) => (
                    <li key={doc.name} className="flex items-start justify-between gap-2">
                      <span className="text-[11px] leading-snug text-paper/60">{doc.name}</span>
                      <span className="shrink-0 font-mono text-[8px] text-paper/25">{doc.updated}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-paper/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="meta text-paper/30">Invoices</p>
                  <FileText className="size-3.5 text-paper/25" />
                </div>
                <ul className="mt-3 space-y-2.5">
                  {project.invoices.map((invoice) => (
                    <li key={invoice.ref} className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] text-paper/55">{invoice.ref}</span>
                      <span className="text-[10.5px] text-paper/50">{invoice.amount}</span>
                      <span
                        className={cn(
                          "font-mono text-[8px] uppercase tracking-[0.06em]",
                          invoice.status === "Paid"
                            ? "text-gold"
                            : invoice.status === "Due"
                              ? "text-hazard"
                              : "text-paper/40",
                        )}
                      >
                        {invoice.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="border border-paper/10 p-4">
                <p className="meta text-paper/30">Requests for information</p>
                <ul className="mt-3 space-y-2.5">
                  {project.rfis.map((rfi) => (
                    <li key={rfi.ref} className="flex items-start gap-2">
                      {rfi.status === "Open" ? (
                        <TriangleAlert className="mt-0.5 size-3 shrink-0 text-hazard" />
                      ) : (
                        <Check className="mt-0.5 size-3 shrink-0 text-gold" />
                      )}
                      <div>
                        <p className="text-[11px] leading-snug text-paper/60">{rfi.subject}</p>
                        <p className="mt-0.5 font-mono text-[8px] text-paper/25">
                          {rfi.ref} · {rfi.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-paper/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="meta text-paper/30">Activity</p>
                  <Activity className="size-3.5 text-paper/25" />
                </div>
                <ul className="mt-3 space-y-2">
                  {portalActivity.slice(0, 4).map((entry) => (
                    <li key={entry.text} className="flex items-baseline gap-2 text-[10.5px] text-paper/45">
                      <span className="font-mono text-[8px] text-paper/25">{entry.time}</span>
                      <span className="flex-1 leading-snug">{entry.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-paper/25">
                Data synced from site · updated 07:42 EAT
              </p>
              <a
                href="/#rfq"
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-gold/80 hover:text-gold"
              >
                Raise a new scope
                <ArrowRight className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
