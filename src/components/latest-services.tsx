import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FEATURED_SERVICES } from "@/lib/home-data";
import { ServiceCard } from "@/components/service-card";

export function LatestServices() {
  return (
    <section id="services" className="scroll-mt-[74px] py-14 lg:py-20">
      <div className="mx-auto max-w-[1264px] px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div data-reveal className="max-w-[640px]">
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              Latest services
            </p>

            <h2 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.02] tracking-[-0.038em] text-[#0f1a15] sm:text-[2.65rem] dark:text-white">
              Fresh from our verified technicians.
            </h2>

            <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.65] text-[#5f6f68] sm:text-[17px] dark:text-[#9dab9f]">
              The six newest approved listings on FixMate. Same card size, same
              clear pricing — pick one and see the full breakdown.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-[11px] border border-[#d2ccbc] bg-white px-4 py-[11px] text-[14px] font-semibold text-[#27352f] transition hover:-translate-y-px hover:shadow-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
          >
            Browse all 15 services
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div
          data-reveal-group
          className="mt-8 grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURED_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
