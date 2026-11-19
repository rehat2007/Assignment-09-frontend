import {
  ArrowRight,
  CreditCard,
  Search,
  Send,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

const STEPS: Array<{
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    number: "01",
    title: "Find a service",
    description:
      "Search by device or browse a category. Every card shows the starting price, area and the technician behind it.",
    icon: Search,
  },
  {
    number: "02",
    title: "Send a request",
    description:
      "Pick a date, describe the fault and share your address. No payment yet — the technician confirms first.",
    icon: Send,
  },
  {
    number: "03",
    title: "Technician fixes it",
    description:
      "Follow the job from accepted to in-progress to completed, right inside your dashboard.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Pay after completion",
    description:
      "The technician sets the final amount. You review it, then pay securely with Stripe. Never before.",
    icon: CreditCard,
  },
];

const STATS = [
  { value: "2,400+", label: "Repairs completed", note: "▲ 18% this quarter" },
  { value: "4.9/5", label: "Average rating", note: "Across 1,900 reviews" },
  { value: "94%", label: "First-visit fix rate", note: "Or we return free" },
  { value: "$0", label: "Paid up front", note: "Pay after service" },
];

const EYEBROW_CLASSES =
  "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3fae80] dark:text-[#5be0a5]";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-[68px]">
      <div className="mx-auto max-w-[1280px] px-5 pb-24 pt-4 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <p className={EYEBROW_CLASSES}>
              <span className="h-px w-7 bg-current" />
              How FixMate works
            </p>

            <h2 className="mt-4 max-w-[620px] font-heading text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-[#0b1510] sm:text-[3rem] dark:text-white">
              Four steps. Zero guesswork.
            </h2>
          </div>

          <a
            href="#how-it-works"
            className="group inline-flex shrink-0 items-center gap-2 self-start text-[13px] font-semibold text-[#1b2922] transition-colors hover:text-[#0c7b52] md:self-auto md:pb-2 dark:text-white dark:hover:text-[#63e6b6]"
          >
            Read the full story
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Numbered steps with a dashed connector, like a progress track. */}
        <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li key={step.number}>
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex size-[46px] shrink-0 items-center justify-center rounded-[10px] text-[14px] font-bold",
                      index === 0
                        ? "bg-[#0c7b52] text-white shadow-[0_6px_18px_rgba(12,123,82,0.22)] dark:bg-[#5be0a5] dark:text-[#04251a] dark:shadow-[0_0_22px_rgba(91,224,165,0.24)]"
                        : "border border-black/10 bg-black/[0.03] text-[#0c7b52] dark:border-[#274637] dark:bg-[#0a1610] dark:text-[#63e6b6]",
                    )}
                  >
                    {step.number}
                  </span>

                  <span className="hidden h-px flex-1 border-t border-dashed border-black/15 sm:block dark:border-white/15" />
                  <Icon
                    className="hidden size-3.5 shrink-0 text-[#8a968f] sm:block dark:text-[#7e948a]"
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="mt-6 text-[15px] font-semibold text-[#0b1510] dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[255px] text-[13px] leading-[1.6] text-[#5c6861] dark:text-[#8fa39a]">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Trust metrics panel */}
        <div className="relative mt-24 overflow-hidden rounded-2xl border border-black/[0.07] bg-[linear-gradient(120deg,#f3f4ed_0%,#eaf1e9_60%,#e2efe7_100%)] px-6 py-10 sm:px-12 sm:py-14 dark:border-white/[0.06] dark:bg-[linear-gradient(115deg,#08120d_0%,#0a1711_50%,#0a1a13_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_100%,rgba(60,190,140,0.12),transparent_55%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.6fr)] lg:items-center lg:gap-14">
            <div>
              <p className={EYEBROW_CLASSES}>
                <span className="h-px w-7 bg-current" />
                Trust, measured
              </p>

              <h3 className="mt-4 max-w-[430px] font-heading text-[2.2rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0b1510] sm:text-[2.4rem] dark:text-white">
                A repair platform that behaves like one.
              </h3>

              <p className="mt-4 max-w-[380px] text-[13.5px] leading-[1.65] text-[#5c6861] dark:text-[#8fa39a]">
                Every technician is reviewed before a listing goes live. Every
                job has a trail. Every payment waits for your confirmation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-0">
              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex flex-col",
                    index > 0 &&
                      "sm:border-l sm:border-black/[0.08] sm:pl-6 dark:sm:border-white/[0.09]",
                  )}
                >
                  <p className="text-[28px] font-extrabold leading-none tracking-[-0.03em] text-[#0b1510] sm:text-[30px] dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[11.5px] text-[#66736c] dark:text-[#8fa39a]">
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "mt-2.5 text-[10px] font-semibold",
                      index === 0
                        ? "text-[#2f9e70] dark:text-[#63e6b6]"
                        : "text-[#6d8f7e] dark:text-[#58977c]",
                    )}
                  >
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
