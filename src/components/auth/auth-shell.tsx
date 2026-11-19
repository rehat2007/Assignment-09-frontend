import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

const BENEFITS = [
  { icon: ShieldCheck, text: "ID-verified technicians and admin-approved listings" },
  { icon: Eye, text: "A live status timeline for every repair" },
  { icon: CreditCard, text: "Secure Stripe payment, only after completion" },
];

const STATS = [
  { value: "2,400+", label: "Repairs completed" },
  { value: "4.9/5", label: "Average rating" },
  { value: "30-day", label: "Workmanship cover" },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen overflow-x-hidden bg-[#f6f4ee] lg:grid-cols-2 dark:bg-[#050c08]">
      <aside className="relative hidden min-h-screen flex-col overflow-hidden border-r border-black/[0.06] bg-[#eef3ed] px-14 py-10 lg:flex dark:border-white/[0.06] dark:bg-[#07130e]">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[720px] rounded-full bg-[radial-gradient(circle,rgba(67,211,171,0.2),transparent_64%)]" />
        <div className="pointer-events-none absolute -bottom-72 -right-40 size-[700px] rounded-full bg-[radial-gradient(circle,rgba(67,211,171,0.1),transparent_66%)]" />

        <div className="relative">
          <Brand />
        </div>

        <div className="relative my-auto max-w-[560px] py-10">
          <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
            <span className="h-px w-[18px] bg-current opacity-60" />
            Repair, without the runaround
          </p>

          <h1 className="mt-5 max-w-[16ch] font-heading text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-[#0f1a15] dark:text-white">
            The person fixing your device is accountable for it.
          </h1>

          <p className="mt-5 max-w-[39ch] text-[14px] leading-[1.65] text-[#5f6f68] dark:text-[#9dab9f]">
            Join 2,400+ households in Dhaka who book verified technicians and
            pay only when the repair is done.
          </p>

          <ul className="mt-7 grid gap-3.5">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-[#27352f] dark:text-[#cfdbd3]"
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-[#0e6b54] dark:text-[#43d3ab]" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-9 grid grid-cols-3 gap-4 border-t border-black/10 pt-6 dark:border-white/10">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index > 0
                    ? "border-l border-black/10 pl-4 dark:border-white/10"
                    : ""
                }
              >
                <p className="font-heading text-[20px] font-extrabold leading-none tracking-[-0.03em] text-[#0f1a15] dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[10.5px] leading-snug text-[#5f6f68] dark:text-[#9dab9f]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen min-w-0 flex-1 flex-col bg-white dark:bg-[#050c08]">
        <header className="flex items-center justify-between gap-4 px-6 pb-4 pt-6 sm:px-8 lg:px-7">
          <Brand />

          <div className="flex items-center gap-2">
            <ThemeToggle className="border border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.03]" />
            <Link
              href="/"
              aria-label="Back home"
              className="flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-black/[0.04] dark:text-[#cfdbd3] dark:hover:bg-white/[0.06]"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back home</span>
            </Link>
          </div>
        </header>

        <div className="flex min-w-0 flex-1 items-start justify-center px-6 py-8 sm:px-8 lg:items-center lg:py-4">
          <div className="w-full min-w-0 max-w-[428px]">{children}</div>
        </div>

        <footer className="px-6 pb-6 text-right text-[11.5px] text-[#87948d] sm:px-8 lg:px-7">
          © 2026 FixMate ·{" "}
          <Link href="/privacy" className="hover:text-[#0f1a15] dark:hover:text-white">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:text-[#0f1a15] dark:hover:text-white">
            Terms
          </Link>
        </footer>
      </section>
    </div>
  );
}
