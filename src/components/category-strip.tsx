import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORY_SUMMARY } from "@/lib/home-data";
import { CATEGORY_ICONS } from "@/lib/service-styles";

export function CategoryStrip() {
  return (
    <div className="border-y border-black/[0.08] bg-white/55 dark:border-white/[0.07] dark:bg-white/[0.02]">
      <div className="site-container flex flex-wrap items-center justify-between gap-[18px] py-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#87948d]">
          Popular right now
        </span>

        <nav
          aria-label="Popular categories"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[761px]:order-none min-[761px]:w-auto min-[761px]:flex-1 min-[761px]:flex-wrap min-[761px]:justify-center min-[761px]:overflow-visible min-[761px]:pb-0"
        >
          {CATEGORY_SUMMARY.map(({ name }) => {
            const Icon = CATEGORY_ICONS[name];

            return (
              <Link
                key={name}
                href={`/services?category=${encodeURIComponent(name)}`}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#5f6f68] transition-colors hover:bg-white hover:text-[#0f1a15] hover:shadow-sm dark:text-[#9dab9f] dark:hover:bg-white/[0.05] dark:hover:text-white"
              >
                <Icon className="size-[15px] text-[#0e6b54] dark:text-[#43d3ab]" />
                {name}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/services"
          className="ml-auto flex shrink-0 items-center gap-2 text-[13px] font-semibold text-[#0e6b54] transition-colors hover:text-[#0a5342] sm:ml-0 dark:text-[#43d3ab]"
        >
          All services
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
