"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, ChevronDown, Loader2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import {
  budgetLabels,
  rfqDefaults,
  rfqSchema,
  timeframeLabels,
  type RFQValues,
} from "@/lib/validation";
import { company, divisions } from "@/data/siteData";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full border-b border-ink/20 bg-transparent pb-2.5 pt-1 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-gold-deep";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="meta mb-2 block text-ink/40">
      {children}
    </label>
  );
}

function ErrorLine({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.06em] text-hazard">{message}</p>;
}

export function ContactRFQ() {
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RFQValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      name: "",
      organisation: "",
      email: "",
      phone: "",
      discipline: "commercial",
      location: "",
      area: 8500,
      budget: "1b-5b",
      timeframe: "6-12",
      brief: "",
      consent: false,
      ...rfqDefaults,
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const discipline = watch("discipline");

  useEffect(() => {
    const apply = (payload: { discipline?: string; area?: number }) => {
      if (payload.discipline && ["civil", "commercial", "industrial", "retrofit"].includes(payload.discipline)) {
        setValue("discipline", payload.discipline as RFQValues["discipline"]);
      }
      if (typeof payload.area === "number" && payload.area >= 100) {
        setValue("area", Math.round(payload.area));
      }
    };

    try {
      const stored = sessionStorage.getItem("altra:prefill");
      if (stored) apply(JSON.parse(stored) as { discipline?: string; area?: number });
    } catch {
      /* ignore */
    }

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ discipline?: string; area?: number }>).detail;
      if (detail) apply(detail);
    };
    window.addEventListener("altra:prefill", handler);
    return () => window.removeEventListener("altra:prefill", handler);
  }, [setValue]);

  async function onSubmit(values: RFQValues) {
    setServerError(null);
    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Submission failed");
      const data = (await response.json()) as { reference: string };
      setReference(data.reference);
      window.scrollTo({ top: window.scrollY, behavior: "smooth" });
    } catch {
      setServerError("We could not reach the tender desk. Please email tender@altrabuild.co.tz directly.");
    }
  }

  return (
    <section id="rfq" className="scroll-mt-20 border-t border-ink/15 bg-cream py-20 text-ink lg:py-28">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="meta text-gold-deep">08</span>
              <span className="eyebrow text-ink/45">Request for tender</span>
            </div>
            <SplitHeading as="h2" className="display-lg mt-5 uppercase">
              Tell us what has to stand.
            </SplitHeading>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/60">
              Send us the outline — site, scale, programme. A pre-construction engineer replies within
              two working days with the questions that matter, not a brochure.
            </p>

            <div className="mt-9 space-y-4 border-t border-ink/15 pt-6">
              {[
                { k: "01", t: "Acknowledgement", d: "Reference issued within 2 working hours." },
                { k: "02", t: "Pre-construction call", d: "A 45-minute technical call within 2 working days." },
                { k: "03", t: "Tender or budget", d: "Measured tender within 10 working days of site data." },
              ].map((step) => (
                <div key={step.k} className="flex gap-4">
                  <span className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-gold-deep">{step.k}</span>
                  <div>
                    <p className="text-[13px] font-medium text-ink">{step.t}</p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink/45">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 grid gap-4 border-t border-ink/15 pt-6 sm:grid-cols-2">
              <a href={`mailto:${company.email}`} className="group flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 text-ink/40" strokeWidth={1.7} />
                <span>
                  <span className="meta block text-ink/35">Tender desk</span>
                  <span className="mt-1 block text-[12px] text-ink/75 group-hover:text-ink">{company.email}</span>
                </span>
              </a>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="group flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 text-ink/40" strokeWidth={1.7} />
                <span>
                  <span className="meta block text-ink/35">Head office</span>
                  <span className="mt-1 block text-[12px] text-ink/75 group-hover:text-ink">{company.phone}</span>
                </span>
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 text-ink/40" strokeWidth={1.7} />
                <span>
                  <span className="meta block text-ink/35">Head office</span>
                  <span className="mt-1 block text-[12px] leading-relaxed text-ink/60">
                    Msasani Peninsula, Dar es Salaam
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 text-ink/40" strokeWidth={1.7} />
                <span>
                  <span className="meta block text-ink/35">Emergency site line</span>
                  <span className="mt-1 block text-[12px] text-hazard">{company.emergency}</span>
                </span>
              </div>
            </div>
          </div>

          <div>
            {reference ? (
              <div className="relative overflow-hidden border border-ink/15 bg-paper p-7 sm:p-9">
                <div className="flex size-11 items-center justify-center rounded-full bg-gold text-ink">
                  <Check className="size-5" strokeWidth={2.4} />
                </div>
                <h3 className="display-md mt-6">Enquiry received.</h3>
                <p className="mt-3 max-w-md text-[13px] leading-relaxed text-ink/60">
                  Your reference is{" "}
                  <span className="font-mono text-[12px] tracking-[0.06em] text-ink">{reference}</span>.
                  A pre-construction engineer will acknowledge within two working hours and schedule a
                  technical call within two working days.
                </p>

                <div className="mt-7 grid gap-3 border-t border-ink/15 pt-5 sm:grid-cols-3">
                  {[
                    { t: "Review", d: "Scope checked against live site capacity." },
                    { t: "Call", d: "45 minutes with a project director." },
                    { t: "Tender", d: "Budget or measured tender issued." },
                  ].map((item) => (
                    <div key={item.t}>
                      <p className="font-display text-[13px] text-ink">{item.t}</p>
                      <p className="mt-1 text-[10.5px] leading-relaxed text-ink/45">{item.d}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <MagneticButton
                    href="/portal"
                    size="md"
                    variant="ink"
                  >
                    Open client portal
                  </MagneticButton>
                  <button
                    type="button"
                    onClick={() => {
                      setReference(null);
                      reset();
                    }}
                    className="inline-flex h-12 items-center border border-ink/20 px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60 transition-colors hover:border-ink hover:text-ink"
                  >
                    Submit another enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="border border-ink/15 bg-paper p-6 sm:p-8"
              >
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <p className="eyebrow text-ink/45">Tender enquiry · AB/RFQ</p>
                  <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/30">
                    <span className="size-1.5 rounded-full bg-gold" />
                    Secure
                  </span>
                </div>

                <div className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <input id="name" className={inputBase} placeholder="Amina Mushi" {...register("name")} />
                    <ErrorLine message={errors.name?.message} />
                  </div>
                  <div>
                    <Label htmlFor="organisation">Organisation</Label>
                    <input
                      id="organisation"
                      className={inputBase}
                      placeholder="Company or institution"
                      {...register("organisation")}
                    />
                    <ErrorLine message={errors.organisation?.message} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <input
                      id="email"
                      type="email"
                      className={inputBase}
                      placeholder="you@company.co.tz"
                      {...register("email")}
                    />
                    <ErrorLine message={errors.email?.message} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <input
                      id="phone"
                      type="tel"
                      className={inputBase}
                      placeholder="+255 ..."
                      {...register("phone")}
                    />
                    <ErrorLine message={errors.phone?.message} />
                  </div>
                </div>

                <fieldset className="mt-7">
                  <legend className="meta mb-2 text-ink/40">Discipline</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {divisions.map((division) => (
                      <label
                        key={division.id}
                        className={cn(
                          "cursor-pointer border px-3 py-2.5 text-center transition-colors",
                          discipline === division.id
                            ? "border-ink bg-ink text-paper"
                            : "border-ink/15 text-ink/55 hover:border-ink/40",
                        )}
                      >
                        <input
                          type="radio"
                          value={division.id}
                          className="sr-only"
                          {...register("discipline")}
                        />
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.06em]">
                          {division.shortName}
                        </span>
                      </label>
                    ))}
                  </div>
                  <ErrorLine message={errors.discipline?.message} />
                </fieldset>

                <div className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <Label htmlFor="location">Site location</Label>
                    <input
                      id="location"
                      className={inputBase}
                      placeholder="City / district / plot"
                      {...register("location")}
                    />
                    <ErrorLine message={errors.location?.message} />
                  </div>
                  <div>
                    <Label htmlFor="area">Approx. area (m²)</Label>
                    <input
                      id="area"
                      type="number"
                      min={100}
                      className={inputBase}
                      placeholder="8500"
                      {...register("area", { valueAsNumber: true })}
                    />
                    <ErrorLine message={errors.area?.message} />
                  </div>
                  <div className="relative">
                    <Label htmlFor="budget">Budget band</Label>
                    <select id="budget" className={cn(inputBase, "appearance-none pr-7")} {...register("budget")}>
                      {Object.entries(budgetLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-[34px] size-3.5 text-ink/40" />
                    <ErrorLine message={errors.budget?.message} />
                  </div>
                  <div className="relative sm:col-span-2">
                    <Label htmlFor="timeframe">Programme window</Label>
                    <select
                      id="timeframe"
                      className={cn(inputBase, "appearance-none pr-7")}
                      {...register("timeframe")}
                    >
                      {Object.entries(timeframeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-[34px] size-3.5 text-ink/40" />
                    <ErrorLine message={errors.timeframe?.message} />
                  </div>
                </div>

                <div className="mt-7">
                  <Label htmlFor="brief">Scope outline</Label>
                  <textarea
                    id="brief"
                    rows={4}
                    className={cn(inputBase, "resize-none")}
                    placeholder="What are you building, what constraints matter, and what does success look like?"
                    {...register("brief")}
                  />
                  <ErrorLine message={errors.brief?.message} />
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3">
                  <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer size-4 appearance-none border border-ink/30 bg-transparent transition-colors checked:border-ink checked:bg-ink"
                      {...register("consent")}
                    />
                    <Check className="pointer-events-none absolute size-3 text-gold opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                  </span>
                  <span className="text-[11px] leading-relaxed text-ink/50">
                    I agree to Altra Build processing this enquiry for tender purposes, in line with the
                    Tanzanian Personal Data Protection Act.
                  </span>
                </label>
                <ErrorLine message={errors.consent?.message} />

                {serverError && (
                  <p className="mt-4 border border-hazard/30 bg-hazard/5 px-3 py-2 text-[11px] text-hazard">
                    {serverError}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                  <MagneticButton type="submit" size="lg" variant="ink" icon={false} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Transmitting
                      </>
                    ) : (
                      <>
                        Submit tender enquiry
                        <ArrowUpRight className="size-4" />
                      </>
                    )}
                  </MagneticButton>
                  <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.08em] text-ink/30">
                    Encrypted · NDA available
                    <br />
                    Reply within 2 working hours
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
