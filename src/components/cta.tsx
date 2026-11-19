import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto max-w-[1264px] px-6">
        <div
          data-reveal
          className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-[#e5e1d6] bg-white px-7 py-9 sm:px-12 sm:py-11 lg:flex-row lg:items-center lg:justify-between dark:border-white/[0.08] dark:bg-[#101a16]"
        >
          <div className="pointer-events-none absolute -left-10 -top-24 size-[340px] rounded-full bg-[radial-gradient(circle,rgba(14,107,84,0.12),transparent_62%)]" />

          <div className="relative">
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              Technicians welcome
            </p>

            <h2 className="mt-2.5 max-w-[600px] font-heading text-[1.6rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#0f1a15] sm:text-[2rem] dark:text-white">
              Good at fixing things? Get paid on time.
            </h2>

            <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
              List your services, set your own area and manage every request
              from one dashboard. No listing fee, no commission on your first
              five jobs.
            </p>
          </div>

          <div className="relative flex flex-col gap-3 sm:flex-row">
            <a
              href="#how-it-works"
              className="inline-flex h-[52px] items-center justify-center rounded-[13px] border border-[#d2ccbc] px-6 text-[15px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06]"
            >
              How it works
            </a>

            <a
              href="/sign-up"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[13px] bg-[#0e6b54] px-6 text-[15px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b]"
            >
              Join as a technician
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
