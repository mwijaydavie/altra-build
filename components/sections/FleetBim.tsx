import Image from "next/image";
import { Cpu, Radar } from "lucide-react";
import { bimStack, fleet } from "@/data/siteData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Active: "text-gold",
  Standby: "text-paper/55",
  Yard: "text-paper/35",
};

export function FleetBim() {
  return (
    <section id="fleet" className="scroll-mt-24 bg-ink py-20 text-paper lg:py-28">
      <div className="shell">
        <SectionHeading
          tone="dark"
          index="04"
          label="Machinery, fleet & digital delivery"
          title="Own the plant. Own the programme."
          description="We are not a broker with a phone book of subcontractors. Our fleet, batching plants and survey instruments are bought, maintained and operated in-house — which is why we can commit to a date."
          action={
            <div className="flex items-center gap-2 border border-paper/15 px-3 py-2">
              <Radar className="size-3.5 text-gold" strokeWidth={1.8} />
              <span className="meta text-paper/55">Telemetry · synced</span>
            </div>
          }
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="relative overflow-hidden">
            <div className="relative aspect-[16/11] w-full">
              <Image
                src="/images/machinery-fleet.jpg"
                alt="Altra Build excavator and concrete pump fleet staged at dawn"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5">
                <div>
                  <p className="meta text-gold">Ubungo plant yard · 06°47&apos;22&quot;S</p>
                  <p className="mt-2 font-display text-xl tracking-tight text-paper">
                    96 owned machines. 3 batching plants. 1 standard.
                  </p>
                </div>
                <span className="border border-paper/25 bg-ink/50 px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper/60 backdrop-blur">
                  Fleet uptime 96.4%
                </span>
              </div>
            </div>
          </Reveal>

          <div className="border border-paper/10">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-paper/10 px-4 py-3">
              <p className="meta text-paper/35">Asset register</p>
              <p className="meta text-paper/35">Units</p>
            </div>
            <ul>
              {fleet.map((machine) => (
                <li
                  key={machine.id}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-paper/10 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-paper/[0.03]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-[10px] tracking-[0.1em] text-gold">{machine.tag}</span>
                      <span className="text-[13px] text-paper/85">{machine.name}</span>
                      <span className={cn("font-mono text-[9px] uppercase tracking-[0.12em]", statusStyles[machine.status])}>
                        {machine.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[10.5px] text-paper/35">{machine.capability}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-base leading-none text-paper">{machine.units}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">
                      {machine.telemetry[0]?.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-paper/15 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow flex items-center gap-2 text-gold">
                <Cpu className="size-3.5" strokeWidth={1.8} />
                BIM Level 3 · ISO 19650
              </p>
              <h3 className="display-md mt-3 max-w-xl text-paper">
                The model is the contract. Everything else is evidence.
              </h3>
            </div>
            <p className="max-w-xs text-[11.5px] leading-relaxed text-paper/45">
              Every project runs a federated common data environment. Clients get read access to the
              same model, programme and quality records our teams work from.
            </p>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
            {bimStack.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 0.04}
                className="group relative bg-ink p-5 transition-colors hover:bg-ink-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-display text-[15px] tracking-tight text-paper/90">{item.name}</h4>
                  <span className="shrink-0 border border-paper/15 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-paper/40">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-2.5 text-[11.5px] leading-relaxed text-paper/45">{item.detail}</p>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
