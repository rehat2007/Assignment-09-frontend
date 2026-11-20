import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceCategory } from "@/lib/services";
import { CATEGORY_SUMMARY } from "@/lib/home-data";
import { CATEGORY_ICONS } from "@/lib/service-styles";

const ICON_TILES: Record<ServiceCategory, string> = {
  Smartphone:
    "border-[#cdddf6] bg-[#e9f1ff] text-[#2f6bd8] dark:border-[#1d3050] dark:bg-[#132238] dark:text-[#8ab4f8]",
  "Laptop & PC":
    "border-[#e0d4f8] bg-[#f1eaff] text-[#6d3fd6] dark:border-[#31244f] dark:bg-[#211a38] dark:text-[#b79cf5]",
  AC: "border-[#c8eae2] bg-[#e2f7f1] text-[#0f8a72] dark:border-[#153f37] dark:bg-[#0e2a28] dark:text-[#6fdcc8]",
  Refrigerator:
    "border-[#cdebd8] bg-[#e4f7eb] text-[#1c8a52] dark:border-[#17402b] dark:bg-[#12281c] dark:text-[#82dea6]",
  TV: "border-[#f0dccd] bg-[#f9eee4] text-[#b2622f] dark:border-[#43291b] dark:bg-[#2b1b12] dark:text-[#dda27d]",
  "Washing Machine":
    "border-[#e4d6f7] bg-[#f3ebff] text-[#7a3fd0] dark:border-[#362449] dark:bg-[#241a33] dark:text-[#b995f0]",
  Electrical:
    "border-[#efe5c4] bg-[#f9f3dc] text-[#a9861b] dark:border-[#433a1b] dark:bg-[#2a2410] dark:text-[#e5ca74]",
};

export function PopularCategories() {
  return (
    <section id="categories" className="scroll-mt-[74px] py-14 lg:py-20">
      <div className="mx-auto max-w-[1264px] px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div data-reveal>
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              Popular categories
            </p>

            <h2 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.02] tracking-[-0.038em] text-[#0f1a15] sm:text-[2.65rem] dark:text-white">
              What can we fix for you?
            </h2>
          </div>

          <p className="shrink-0 text-[13px] font-medium text-[#87948d] md:pb-2 dark:text-[#9dab9f]">
            15 live services · 3 verified technicians
          </p>
        </div>

        <div
          data-reveal-group
          className="mt-8 grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4"
        >
          {CATEGORY_SUMMARY.map(({ name, count }) => {
            const Icon = CATEGORY_ICONS[name];

            return (
              <Link
                key={name}
                href={`/services?category=${encodeURIComponent(name)}`}
                className="group relative flex min-h-[148px] flex-col overflow-hidden rounded-[15px] border border-[#e5e1d6] bg-white p-4 transition duration-200 hover:-translate-y-[3px] hover:border-[#d2ccbc] hover:shadow-[0_14px_30px_-18px_rgba(15,26,21,0.28)] sm:min-h-[156px] sm:p-[18px] dark:border-white/[0.08] dark:bg-[#101a16]"
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-xl border ${ICON_TILES[name]}`}
                >
                  <Icon className="size-[23px]" strokeWidth={1.8} />
                </span>

                <ArrowRight className="absolute right-4 top-4 size-4 text-[#87948d] opacity-0 transition group-hover:opacity-100" />

                <h3 className="mt-auto pt-5 font-heading text-[13.5px] font-bold tracking-[-0.01em] text-[#0f1a15] dark:text-white">
                  {name}
                </h3>
                <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  {count} {count === 1 ? "service" : "services"} available
                </p>
              </Link>
            );
          })}

          <Link
            href="/services"
            className="group flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-[15px] bg-[#0e6b54] p-4 text-center transition hover:-translate-y-[3px] hover:shadow-[0_16px_36px_-18px_rgba(14,107,84,0.7)] sm:min-h-[156px] sm:p-[18px] dark:bg-[#43d3ab]"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-white/15 text-white dark:bg-[#06231b]/10 dark:text-[#06231b]">
              <ArrowRight className="size-4" />
            </span>

            <span className="font-heading text-[14px] font-bold text-white dark:text-[#06231b]">
              See all services
            </span>
            <span className="text-[11px] font-medium text-white/70 dark:text-[#06231b]/70">
              Search, filter and sort
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
