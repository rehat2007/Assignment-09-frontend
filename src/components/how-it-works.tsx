import { ArrowRight } from "lucide-react";
import { STEPS } from "@/lib/home-data";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-[74px] py-[clamp(38px,4.5vw,60px)]"
    >
      <div className="site-container">
        <div className="flex flex-col gap-5 min-[761px]:flex-row min-[761px]:flex-wrap min-[761px]:items-end min-[761px]:justify-between">
          <div data-reveal>
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              How FixMate works
            </p>

            <h2 className="mt-3 font-heading text-[clamp(1.85rem,3.1vw,2.65rem)] font-extrabold leading-[1.02] tracking-[-0.038em] text-[#0f1a15] dark:text-white">
              Four steps. Zero guesswork.
            </h2>
          </div>

          <a
            href="/how-it-works"
            className="flex w-fit items-center gap-2 text-[13.5px] font-semibold text-[#27352f] transition-colors hover:text-[#0e6b54] dark:text-white dark:hover:text-[#43d3ab]"
          >
            Read the full story
            <ArrowRight className="size-4" />
          </a>
        </div>

        <ol
          data-reveal-group
          className="mt-[34px] grid grid-cols-1 gap-y-5 min-[561px]:grid-cols-2 min-[561px]:gap-y-[26px] min-[981px]:grid-cols-4 min-[981px]:gap-y-0"
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="relative min-[981px]:px-[22px] min-[981px]:first:pl-0 min-[981px]:last:pr-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      index === 0
                        ? "flex size-[42px] shrink-0 items-center justify-center rounded-xl bg-[#0e6b54] font-heading text-[15px] font-extrabold text-white"
                        : "flex size-[42px] shrink-0 items-center justify-center rounded-xl border border-[#e5e1d6] bg-white font-heading text-[15px] font-extrabold text-[#0e6b54] dark:border-white/10 dark:bg-white/[0.03] dark:text-[#43d3ab]"
                    }
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {index < STEPS.length - 1 && (
                    <span className="hidden h-px flex-1 border-t border-dashed border-[#d2ccbc] min-[981px]:block dark:border-white/15" />
                  )}

                  <Icon
                    className="absolute right-0 top-0 hidden size-[18px] shrink-0 text-[#d2ccbc] min-[561px]:block dark:text-white/20"
                    strokeWidth={1.7}
                  />
                </div>

                <h3 className="mt-4 font-heading text-[15px] font-bold leading-[1.12] text-[#0f1a15] dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-[7px] text-[13px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
