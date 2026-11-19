import {
  ArrowRight,
  Laptop,
  Refrigerator,
  Smartphone,
  Snowflake,
  Tv,
  WashingMachine,
  Zap,
} from "lucide-react";

const CATEGORIES = [
  { label: "Smartphone", icon: Smartphone },
  { label: "Laptop & PC", icon: Laptop },
  { label: "AC", icon: Snowflake },
  { label: "Refrigerator", icon: Refrigerator },
  { label: "TV", icon: Tv },
  { label: "Washing Machine", icon: WashingMachine },
  { label: "Electrical", icon: Zap },
];

export function PopularStrip() {
  return (
    <div className="border-y border-black/[0.06] bg-[#efece4] dark:border-white/[0.07] dark:bg-[#07120d]">
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-5 py-5 sm:gap-8 sm:px-8">
        <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a968f] sm:block dark:text-[#7f9188]">
          Popular right now
        </span>

        {/* Categories scroll on narrow screens while the main link stays visible. */}
        <div className="min-w-0 flex-1 overflow-x-auto [mask-image:linear-gradient(to_right,black_90%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav aria-label="Popular categories" className="flex w-max items-center gap-6">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#services"
                className="group flex items-center gap-2 text-[13px] font-medium text-[#435049] transition-colors hover:text-[#0b1510] dark:text-[#d3ded7] dark:hover:text-white"
              >
                <Icon className="size-3.5 text-[#7d8b83] transition-colors group-hover:text-[#0c7b52] dark:text-[#748a7d] dark:group-hover:text-[#5be0a5]" />
                {label}
              </a>
            ))}
          </nav>
        </div>

        <a
          href="#services"
          className="group flex shrink-0 items-center gap-2 text-[13px] font-semibold text-[#253129] transition-colors hover:text-[#0c7b52] dark:text-white/90 dark:hover:text-[#5be0a5]"
        >
          All services
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
