import { Quote } from "lucide-react";
import { testimonials } from "@/data/siteData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  return (
    <section className="bg-paper py-20 text-ink lg:py-24">
      <div className="shell">
        <SectionHeading
          index="03·B"
          label="Client verdicts"
          title="Judged by the people who hold the risk."
          description="Developers, harbour masters, infrastructure funds and traders' associations. Different risks, same conclusion."
        />

        <div className="mt-12 grid gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.id}
              delay={index * 0.06}
              className="group relative flex flex-col justify-between bg-paper p-6 transition-colors hover:bg-cream sm:p-7"
            >
              <Quote className="size-6 text-gold-deep" strokeWidth={1.4} />
              <blockquote className="mt-6 font-display text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.35] tracking-tight text-ink/85">
                “{testimonial.quote}”
              </blockquote>
              <div className="mt-8 border-t border-ink/10 pt-4">
                <p className="text-[15.5px] font-medium text-ink">{testimonial.author}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-ink/45">{testimonial.role}</p>
                <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink/30">
                  {testimonial.project}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
