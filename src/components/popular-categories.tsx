import {
  ArrowRight,
  Laptop,
  Refrigerator,
  Smartphone,
  Snowflake,
  Tv,
  WashingMachine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

type Category = {
  label: string;
  services: number;
  icon: LucideIcon;
  tile: string;
  glow: string;
};

const CATEGORIES: Category[] = [
  {
    label: "Smartphone",
    services: 2,
    icon: Smartphone,
    tile: "border-[#cdddf6] bg-[#e9f1ff] text-[#2f6bd8] dark:border-[#1d3050] dark:bg-[#132238] dark:text-[#8ab4f8]",
    glow: "bg-[radial-gradient(circle_100px_at_96%_112%,rgba(74,141,255,0.18),transparent_72%)] dark:bg-[radial-gradient(circle_100px_at_96%_112%,rgba(74,141,255,0.34),transparent_72%)]",
  },
  {
    label: "Laptop & PC",
    services: 3,
    icon: Laptop,
    tile: "border-[#e0d4f8] bg-[#f1eaff] text-[#6d3fd6] dark:border-[#31244f] dark:bg-[#211a38] dark:text-[#b79cf5]",
    glow: "bg-[radial-gradient(circle_100px_at_96%_112%,rgba(140,100,240,0.16),transparent_72%)] dark:bg-[radial-gradient(circle_100px_at_96%_112%,rgba(140,100,240,0.32),transparent_72%)]",
  },
  {
    label: "AC",
    services: 2,
    icon: Snowflake,
    tile: "border-[#c8eae2] bg-[#e2f7f1] text-[#0f8a72] dark:border-[#153f37] dark:bg-[#0e2a28] dark:text-[#6fdcc8]",
    glow: "bg-[radial-gradient(circle_100px_at_96%_112%,rgba(50,200,175,0.16),transparent_72%)] dark:bg-[radial-gradient(circle_100px_at_96%_112%,rgba(50,200,175,0.30),transparent_72%)]",
  },
  {
    label: "Refrigerator",
    services: 2,
    icon: Refrigerator,
    tile: "border-[#cdebd8] bg-[#e4f7eb] text-[#1c8a52] dark:border-[#17402b] dark:bg-[#12281c] dark:text-[#82dea6]",
    glow: "bg-[radial-gradient(circle_100px_at_96%_112%,rgba(70,200,120,0.16),transparent_72%)] dark:bg-[radial-gradient(circle_100px_at_96%_112%,rgba(70,200,120,0.30),transparent_72%)]",
  },
  {
    label: "TV",
    services: 1,
    icon: Tv,
    tile: "border-[#f0dccd] bg-[#f9eee4] text-[#b2622f] dark:border-[#43291b] dark:bg-[#2b1b12] dark:text-[#dda27d]",
    glow: "bg-[radial-gradient(circle_100px_at_96%_112%,rgba(210,140,90,0.16),transparent_72%)] dark:bg-[radial-gradient(circle_100px_at_96%_112%,rgba(210,140,90,0.30),transparent_72%)]",
  },
  {
    label: "Washing Machine",
    services: 2,
    icon: WashingMachine,
    tile: "border-[#e4d6f7] bg-[#f3ebff] text-[#7a3fd0] dark:border-[#362449] dark:bg-[#241a33] dark:text-[#b995f0]",
    glow: "bg-[radial-gradient(circle_100px_at_96%_112%,rgba(150,110,240,0.16),transparent_72%)] dark:bg-[radial-gradient(circle_100px_at_96%_112%,rgba(150,110,240,0.30),transparent_72%)]",
  },
  {
    label: "Electrical",
    services: 3,
    icon: Zap,
    tile: "border-[#efe5c4] bg-[#f9f3dc] text-[#a9861b] dark:border-[#433a1b] dark:bg-[#2a2410] dark:text-[#e5ca74]",
    glow: "bg-[radial-gradient(circle_100px_at_96%_112%,rgba(220,190,80,0.16),transparent_72%)] dark:bg-[radial-gradient(circle_100px_at_96%_112%,rgba(220,190,80,0.28),transparent_72%)]",
  },
];

const EYEBROW_CLASSES =
  "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3fae80] dark:text-[#5be0a5]";

const CARD_CLASSES =
  "group relative flex min-h-[156px] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(20,50,35,0.03)] transition-colors hover:border-black/15 dark:border-white/[0.09] dark:bg-[#08130e] dark:shadow-none dark:hover:border-white/[0.18]";

export function PopularCategories() {
  return (
    <section id="categories" className="scroll-mt-[68px]">
      <div className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-8">
        <p className={EYEBROW_CLASSES}>
          <span className="h-px w-7 bg-current" />
          Popular categories
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 className="font-heading text-[2.2rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-[#0b1510] sm:text-[2.75rem] dark:text-white">
            What can we fix for you?
          </h2>

          <p className="shrink-0 text-[13px] font-medium text-[#78847d] md:pb-2.5 dark:text-[#8b9a92]">
            15 live services <span className="px-0.5">·</span> 3 verified
            technicians
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ label, services, icon: Icon, tile, glow }) => (
            <a key={label} href="#services" className={CARD_CLASSES}>
              {/* Soft color wash tucked into the bottom-right corner. */}
              <span
                aria-hidden="true"
                className={cn("pointer-events-none absolute inset-0", glow)}
              />

              <span
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-[10px] border",
                  tile,
                )}
              >
                <Icon className="size-[17px]" strokeWidth={1.9} />
              </span>

              <h3 className="relative mt-auto pt-6 text-[15.5px] font-bold tracking-[-0.01em] text-[#0b1510] dark:text-white">
                {label}
              </h3>
              <p className="relative mt-1.5 text-[12.5px] text-[#6b766f] dark:text-[#8b9a92]">
                {services} {services === 1 ? "service" : "services"} available
              </p>
            </a>
          ))}

          <a
            href="#services"
            className="group relative flex min-h-[156px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(150deg,#6fe8bd_0%,#50dfae_55%,#44d6a5_100%)] p-6 text-center transition-shadow hover:shadow-[0_12px_36px_rgba(72,216,168,0.28)]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-10 size-52 rounded-full bg-[radial-gradient(circle,rgba(228,255,246,0.55),rgba(228,255,246,0.14)_58%,transparent_72%)]"
            />

            <span className="relative flex size-9 items-center justify-center rounded-full bg-white/35 text-[#053527] ring-1 ring-inset ring-white/40">
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>

            <span className="relative mt-3.5 text-[15.5px] font-bold text-[#04291d]">
              See all services
            </span>
            <span className="relative mt-1.5 text-[11.5px] font-medium text-[#0b4a35]/80">
              Search, filter and sort
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
