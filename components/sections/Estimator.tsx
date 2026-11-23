"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowRight, Check, Download, Info } from "lucide-react";
import {
  estimatorConfig,
  estimatorFinish,
  estimatorGround,
  estimatorLocations,
  estimatorTypes,
} from "@/data/siteData";
import { estimateProject } from "@/lib/estimator";
import { cn, formatTZS, usdFromTzs } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

function OptionGrid({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: { id: string; label: string; detail?: string }[];
  value: string;
  onChange: (id: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <div className={cn("grid gap-2", columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
            className={cn(
              "group relative border px-4 py-3 text-left transition-all duration-300",
              selected
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 bg-cream/40 text-ink/75 hover:border-ink/40 hover:bg-cream",
            )}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-display text-[13.5px] tracking-tight">{option.label}</span>
              {selected ? (
                <Check className="size-3.5 shrink-0 text-gold" strokeWidth={2.4} />
              ) : (
                <span className="size-1.5 shrink-0 rounded-full bg-ink/15 transition-colors group-hover:bg-ink/40" />
              )}
            </span>
            {option.detail && (
              <span
                className={cn(
                  "mt-1 block font-mono text-[9px] uppercase leading-relaxed tracking-[0.08em]",
                  selected ? "text-paper/45" : "text-ink/35",
                )}
              >
                {option.detail}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Estimator() {
  const { scrollTo } = useSmoothScroll();
  const [typeId, setTypeId] = useState("commercial");
  const [area, setArea] = useState(estimatorConfig.defaultArea);
  const [locationId, setLocationId] = useState("dar");
  const [groundId, setGroundId] = useState("sand");
  const [finishId, setFinishId] = useState("standard");
  const [exported, setExported] = useState(false);

  const estimate = useMemo(
    () => estimateProject({ typeId, area, locationId, groundId, finishId }),
    [typeId, area, locationId, groundId, finishId],
  );

  const typeLabel = estimatorTypes.find((t) => t.id === typeId)?.label ?? "Commercial";
  const locationLabel = estimatorLocations.find((l) => l.id === locationId)?.label ?? "";
  const groundLabel = estimatorGround.find((g) => g.id === groundId)?.label ?? "";
  const finishLabel = estimatorFinish.find((f) => f.id === finishId)?.label ?? "";
  const fillPercent = ((area - estimatorConfig.minArea) / (estimatorConfig.maxArea - estimatorConfig.minArea)) * 100;

  async function exportScope() {
    let logo = "";
    try {
      const response = await fetch("/brand/altra-logo.svg");
      logo = await response.text();
    } catch {
      logo = "";
    }

    const rows = [
      ["Discipline", typeLabel],
      ["Floor area", `${area.toLocaleString("en-US")} m²`],
      ["Location", locationLabel],
      ["Ground conditions", groundLabel],
      ["Finish level", finishLabel],
      ["Indicative rate", `${formatTZS(estimate.ratePerSqm)} / m²`],
      ["Indicative range", `${formatTZS(estimate.low)} – ${formatTZS(estimate.high)}`],
      ["Programme", `${estimate.weeksMin} – ${estimate.weeksMax} weeks`],
      ["Structural steel (est.)", `${estimate.tonnesSteel.toLocaleString("en-US")} tonnes`],
      ["Concrete (est.)", `${estimate.cubicMetresConcrete.toLocaleString("en-US")} m³`],
      ["Peak workforce (est.)", `${estimate.crew} people`],
    ]
      .map(
        ([label, value]) =>
          `<tr><th align="left">${label}</th><td>${value}</td></tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Altra Build — Indicative Scope of Work</title>
<style>
  @page { margin: 18mm; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1C1C26; background:#FFF3E7; margin:0; padding:48px; }
  .sheet { max-width: 760px; margin: 0 auto; background:#fff; padding: 48px; border-top: 6px solid #F7BC32; }
  .logo svg { height: 44px; width:auto; }
  h1 { font-size: 30px; letter-spacing:-0.02em; margin: 36px 0 6px; }
  .sub { font-family: monospace; font-size: 11px; letter-spacing:.16em; text-transform:uppercase; color:#8C8577; }
  table { width:100%; border-collapse: collapse; margin-top: 28px; font-size: 13px; }
  th, td { padding: 10px 0; border-bottom: 1px solid #E9DDC7; text-align:left; vertical-align: top; }
  th { font-weight: 500; color:#47566B; width: 46%; }
  .total { margin-top: 28px; padding: 20px; background:#0F1117; color:#FFF3E7; }
  .total strong { display:block; font-size: 24px; color:#F7BC32; margin-top:6px; }
  .meta { margin-top: 28px; font-size: 11px; line-height:1.7; color:#6b6a66; }
  ul { font-size: 12.5px; line-height:1.8; padding-left: 18px; }
  footer { margin-top: 40px; border-top:1px solid #E9DDC7; padding-top:14px; font-family:monospace; font-size:10px; letter-spacing:.1em; color:#8C8577; text-transform:uppercase; }
</style></head>
<body><div class="sheet">
  <div class="logo">${logo}</div>
  <p class="sub">Indicative scope of work · generated ${new Date().toISOString().slice(0, 10)}</p>
  <h1>${typeLabel} · ${area.toLocaleString("en-US")} m²</h1>
  <p class="sub">${locationLabel} · ${groundLabel}</p>
  <table>${rows}</table>
  <div class="total">
    <span class="sub" style="color:#98a1ac">Indicative order of cost</span>
    <strong>${formatTZS(estimate.low)} – ${formatTZS(estimate.high)}</strong>
    <span style="font-size:11px;color:#98a1ac">${usdFromTzs(estimate.low)} – ${usdFromTzs(estimate.high)} · incl. ${Math.round(estimatorConfig.contingency * 100)}% contingency</span>
  </div>
  <p class="sub" style="margin-top:32px">Next steps</p>
  <ul>
    <li>Site inspection and geotechnical investigation (2–3 weeks).</li>
    <li>Design coordination workshop and buildability review.</li>
    <li>Formal tender with measured bills of quantities.</li>
  </ul>
  <p class="meta">${estimatorConfig.disclaimer}</p>
  <footer>Altra Build Limited · Plot 1482 Msasani Peninsula, Dar es Salaam · tender@altrabuild.co.tz · +255 22 550 0148</footer>
</div></body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `altra-scope-${typeId}-${area}sqm.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExported(true);
    window.setTimeout(() => setExported(false), 4000);
  }

  function sendToTender() {
    const payload = { discipline: typeId, area, location: locationId };
    try {
      sessionStorage.setItem("altra:prefill", JSON.stringify(payload));
    } catch {
      /* storage may be unavailable */
    }
    window.dispatchEvent(new CustomEvent("altra:prefill", { detail: payload }));
    scrollTo("#rfq", -70);
  }

  return (
    <section id="estimator" className="scroll-mt-24 bg-paper py-20 text-ink lg:py-28">
      <div className="shell">
        <SectionHeading
          index="05"
          label="Tender intelligence"
          title="Price the shape of your project in ninety seconds."
          description="Our order-of-cost model uses delivered rates from 214 Tanzanian commissions. It will not replace a tender — it will tell you whether your budget and programme are in the same room."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
          <div className="space-y-8">
            {/* Step 1 */}
            <div>
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-ink/45">
                  <span className="mr-2 text-gold-deep">01</span>Discipline
                </p>
                <span className="meta text-ink/30">Required</span>
              </div>
              <div className="mt-3">
                <OptionGrid
                  options={estimatorTypes}
                  value={typeId}
                  onChange={setTypeId}
                />
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-ink/45">
                  <span className="mr-2 text-gold-deep">02</span>Scale
                </p>
                <span className="meta text-ink/30">Gross floor area</span>
              </div>
              <div className="mt-4 border border-ink/15 bg-cream/40 p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <input
                      type="number"
                      min={estimatorConfig.minArea}
                      max={estimatorConfig.maxArea}
                      step={250}
                      value={area}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setArea(Number.isFinite(next) ? next : estimatorConfig.minArea);
                      }}
                      onBlur={() => {
                        if (area < estimatorConfig.minArea) setArea(estimatorConfig.minArea);
                        if (area > estimatorConfig.maxArea) setArea(estimatorConfig.maxArea);
                      }}
                      aria-label="Gross floor area in square metres"
                      className="w-[7ch] border-b border-ink/30 bg-transparent pb-1 font-display text-[clamp(2.2rem,5vw,3rem)] leading-none tracking-tight text-ink outline-none focus:border-gold-deep [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink/40">m²</span>
                  </div>
                  <div className="flex gap-2">
                    {[2500, 8500, 25000, 50000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setArea(preset)}
                        className={cn(
                          "border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.08em] transition-colors",
                          area === preset
                            ? "border-ink bg-ink text-paper"
                            : "border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink",
                        )}
                      >
                        {preset >= 1000 ? `${preset / 1000}k` : preset}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="range"
                  min={estimatorConfig.minArea}
                  max={estimatorConfig.maxArea}
                  step={250}
                  value={area}
                  onChange={(event) => setArea(Number(event.target.value))}
                  aria-label="Area slider"
                  className="altra-range mt-6"
                  style={{ "--fill": `${fillPercent}%` } as React.CSSProperties}
                />
                <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-ink/30">
                  <span>{estimatorConfig.minArea} m²</span>
                  <span>{estimatorConfig.maxArea.toLocaleString("en-US")} m²</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-ink/45">
                  <span className="mr-2 text-gold-deep">03</span>Site conditions
                </p>
                <span className="meta text-ink/30">Location &amp; ground</span>
              </div>
              <div className="mt-3 space-y-4">
                <div>
                  <p className="meta mb-2 text-ink/35">Location</p>
                  <OptionGrid options={estimatorLocations} value={locationId} onChange={setLocationId} columns={3} />
                </div>
                <div>
                  <p className="meta mb-2 text-ink/35">Ground</p>
                  <div className="flex flex-wrap gap-2">
                    {estimatorGround.map((option) => {
                      const selected = option.id === groundId;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setGroundId(option.id)}
                          aria-pressed={selected}
                          title={option.detail}
                          className={cn(
                            "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
                            selected
                              ? "border-gold-deep bg-gold/20 text-ink"
                              : "border-ink/15 text-ink/55 hover:border-ink/40 hover:text-ink",
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="meta mb-2 text-ink/35">Finish</p>
                  <OptionGrid options={estimatorFinish} value={finishId} onChange={setFinishId} columns={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Estimate card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden bg-ink p-6 text-paper">
              <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-20" aria-hidden />
              <div className="relative">
                <div className="flex items-start justify-between border-b border-paper/15 pb-4">
                  <div className="flex items-start gap-3">
                    <Image src="/brand/altra-mark-inverse.svg" alt="" width={30} height={28} unoptimized />
                    <div>
                    <p className="eyebrow text-gold">Indicative order of cost</p>
                    <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-paper/35">
                      REF: AB/EST/2026 · v4.2
                    </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/40">
                    <span className="live-dot size-1.5 rounded-full bg-gold" />
                    Live
                  </span>
                </div>

                <div className="py-6">
                  <p className="font-display text-[clamp(1.55rem,2.6vw,2rem)] leading-tight tracking-tight text-paper">
                    {formatTZS(estimate.low)}
                    <br />
                    <span className="text-paper/40">—</span> {formatTZS(estimate.high)}
                  </p>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.1em] text-paper/40">
                    {usdFromTzs(estimate.low)} – {usdFromTzs(estimate.high)}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-paper/15 pt-5">
                  {[
                    { label: "Rate / m²", value: formatTZS(estimate.ratePerSqm) },
                    { label: "Programme", value: `${estimate.weeksMin}–${estimate.weeksMax} wks` },
                    { label: "Steel (est.)", value: `${(estimate.tonnesSteel / 1000).toFixed(2)}k t` },
                    { label: "Concrete (est.)", value: `${(estimate.cubicMetresConcrete / 1000).toFixed(1)}k m³` },
                    { label: "Peak workforce", value: `${estimate.crew} people` },
                    { label: "Contingency", value: `${Math.round(estimatorConfig.contingency * 100)}% incl.` },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/35">
                        {item.label}
                      </dt>
                      <dd className="mt-1 font-display text-[15px] leading-none text-paper">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 space-y-2 border-t border-paper/15 pt-5">
                  {estimate.lines.map((line) => (
                    <div key={line.label} className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-paper/30">
                        {line.label}
                      </span>
                      <span className="text-right text-[11px] text-paper/65">{line.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2.5">
                  <MagneticButton
                    size="md"
                    variant="gold"
                    onClick={exportScope}
                    icon={false}
                    className="w-full justify-center"
                  >
                    <Download className="size-3.5" />
                    Export scope of work
                  </MagneticButton>
                  <MagneticButton
                    size="md"
                    variant="outline-light"
                    onClick={sendToTender}
                    className="w-full justify-center"
                  >
                    Send to tender desk
                  </MagneticButton>
                </div>

                {exported && (
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-gold">
                    <Check className="size-3" /> Branded scope downloaded
                  </p>
                )}

                <p className="mt-5 flex items-start gap-2 border-t border-paper/15 pt-4 text-[9.5px] leading-relaxed text-paper/35">
                  <Info className="mt-0.5 size-3 shrink-0" />
                  {estimatorConfig.disclaimer}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border border-ink/15 bg-cream/50 px-4 py-3">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink/45">
                Prefer a conversation?
              </p>
              <a
                href="tel:+255225500148"
                className="group flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink/70 hover:text-ink"
              >
                Call pre-construction
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </aside>
        </div>

        <p className="mt-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/30">
          <ArrowDownToLine className="size-3.5" />
          Estimates refresh instantly · nothing is submitted until you choose to
        </p>
      </div>
    </section>
  );
}
