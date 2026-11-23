import Link from "next/link";
import { ArrowUpRight, FileText, Lock, ShieldCheck } from "lucide-react";
import { portalActivity, portalProjects } from "@/data/siteData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Logo } from "@/components/ui/Logo";

const features = [
  "Live programme and progress curves, updated from site every Friday",
  "RFIs, submittals and approvals with a full audit trail",
  "Interim certificates, invoices and retention statements",
  "Safety statistics and audit reports for your board pack",
];

export function PortalTeaser() {
  const project = portalProjects[0]!;

  return (
    <section id="portal" className="relative overflow-hidden bg-ink py-20 text-paper lg:py-28">
      <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-20" aria-hidden />
      <div className="shell relative">
        <SectionHeading
          tone="dark"
          index="06"
          label="Client portal"
          title="Your site, on your screen."
          description="Every Altra Build client gets access to the same live data our project directors use. No monthly PDF pack, no waiting for the consultant to update a spreadsheet."
          action={
            <div className="flex items-center gap-2 border border-paper/15 px-3 py-2">
              <Lock className="size-3.5 text-gold" strokeWidth={1.8} />
              <span className="meta text-paper/45">TLS 1.3 · SSO ready</span>
            </div>
          }
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <ul className="space-y-4 border-t border-paper/15 pt-6">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[13px] leading-relaxed text-paper/60">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.7} />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton href="/portal" size="lg">
                Sign in to portal
              </MagneticButton>
              <MagneticButton href="/#rfq" size="lg" variant="outline-light">
                Request access
              </MagneticButton>
            </div>
            <p className="mt-5 flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/30">
              <FileText className="size-3" />
              Demo credentials available on the portal page
            </p>
          </div>

          {/* Mock portal window */}
          <div className="relative border border-paper/15 bg-ink-800 p-3 sm:p-4">
            <div className="flex items-center justify-between border-b border-paper/10 px-1 pb-3">
              <div className="flex items-center gap-2">
                <Logo variant="mark" tone="inverse" height={18} />
                <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper/50">
                  Altra Portal
                </span>
              </div>
              <span className="flex items-center gap-2">
                <span className="meta text-paper/25">Demo</span>
                <span className="live-dot size-1.5 rounded-full bg-gold" />
              </span>
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-gold">{project.code}</p>
                  <p className="mt-1.5 font-display text-lg tracking-tight text-paper">{project.name}</p>
                  <p className="mt-1 text-[10.5px] text-paper/40">
                    {project.phase} · {project.contractValue}
                  </p>
                </div>
                <span className="border border-gold/40 px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-gold">
                  {project.status}
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <span className="meta text-paper/35">Progress</span>
                  <span className="font-mono text-[11px] text-paper/70">{project.progress}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-paper/10">
                  <div className="h-full bg-gold" style={{ width: `${project.progress}%` }} />
                </div>
                <div className="mt-2 flex flex-wrap justify-between gap-2 font-mono text-[8.5px] uppercase tracking-[0.08em] text-paper/30">
                  <span>Next: {project.nextMilestone}</span>
                  <span>{project.nextMilestoneDate}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="border border-paper/10 p-3">
                  <p className="meta text-paper/30">Documents</p>
                  <ul className="mt-2.5 space-y-2">
                    {project.documents.slice(0, 2).map((doc) => (
                      <li key={doc.name} className="flex items-start justify-between gap-2">
                        <span className="text-[10.5px] leading-snug text-paper/60">{doc.name}</span>
                        <span className="shrink-0 font-mono text-[8px] text-paper/25">{doc.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-paper/10 p-3">
                  <p className="meta text-paper/30">Invoices</p>
                  <ul className="mt-2.5 space-y-2">
                    {project.invoices.slice(0, 2).map((invoice) => (
                      <li key={invoice.ref} className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[9.5px] text-paper/55">{invoice.ref}</span>
                        <span className="text-[10px] text-paper/50">{invoice.amount}</span>
                        <span
                          className={
                            "font-mono text-[8px] uppercase tracking-[0.08em] " +
                            (invoice.status === "Paid"
                              ? "text-gold"
                              : invoice.status === "Submitted"
                                ? "text-paper/45"
                                : "text-hazard")
                          }
                        >
                          {invoice.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3 border border-paper/10 p-3">
                <div className="flex items-center justify-between">
                  <p className="meta text-paper/30">Today&apos;s activity</p>
                  <Link
                    href="/portal"
                    className="flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-paper/45 hover:text-gold"
                  >
                    Open
                    <ArrowUpRight className="size-2.5" />
                  </Link>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {portalActivity.slice(0, 3).map((entry) => (
                    <li key={entry.text} className="flex items-baseline gap-2.5 text-[10.5px] text-paper/45">
                      <span className="font-mono text-[8.5px] text-paper/25">{entry.time}</span>
                      <span className="flex-1 leading-snug">{entry.text}</span>
                      <span className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-gold/70">
                        {entry.tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
