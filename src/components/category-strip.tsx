import { ArrowRight } from "lucide-react";
import { CATEGORY_SUMMARY } from "@/lib/home-data";
import { CATEGORY_ICONS } from "@/lib/service-styles";

export function CategoryStrip() {
  return (
    <div className="border-y border-black/[0.08] bg-white/55 dark:border-white/[0.07] dark:bg-white/[0.02]">
      <div className="mx-auto flex max-w-[1264px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#87948d]">
          Popular right now
        </span>

        <nav
          aria-label="Popular categories"
          className="flex flex-1 flex-wrap items-center justify-center gap-1"
        >
          {CATEGORY_SUMMARY.map(({ name }) => {
            const Icon = CATEGORY_ICONS[name];

            return (
              <a
                key={name}
                href={`/services?category=${encodeURIComponent(name)}`}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#5f6f68] transition-colors hover:bg-white hover:text-[#0f1a15] hover:shadow-sm dark:text-[#9dab9f] dark:hover:bg-white/[0.05] dark:hover:text-white"
              >
                <Icon className="size-[15px] text-[#0e6b54] dark:text-[#43d3ab]" />
                {name}
              </a>
            );
          })}
        </nav>

        <a
          href="/services"
          className="flex items-center gap-2 text-[13px] font-semibold text-[#0e6b54] transition-colors hover:text-[#0a5342] dark:text-[#43d3ab]"
        >
          All services
          <ArrowRight className="size-4" />
        </a>
      </div>
    </div>
  );
}
