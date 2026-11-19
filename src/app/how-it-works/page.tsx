import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Eye,
  Lock,
  Plus,
  Send,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { HomeMotion } from "@/components/home-motion";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "How FixMate works — FixMate",
  description:
    "A tracked repair from request to payment. See the job pipeline, the rules behind it, and the questions customers ask most.",
};

const PIPELINE = [
  { title: "Request sent", time: "Nov 16 · 18:22", dot: "bg-[#2f6bd8] dark:bg-[#8fb4ff]", faded: false },
  { title: "Rakib accepted", time: "Nov 17 · 08:15", dot: "bg-[#4338ca] dark:bg-[#a9a4ff]", faded: false },
  { title: "On the way", time: "Nov 18 · 09:03", dot: "bg-[#a65c07] dark:bg-[#f0bb6a]", faded: false },
  { title: "Final amount set", time: "Pending", dot: "bg-[#d2ccbc] dark:bg-[#334740]", faded: true },
  { title: "Payment released", time: "After completion", dot: "bg-[#d2ccbc] dark:bg-[#334740]", faded: true },
];

const PRINCIPLES = [
  { number: "01", label: "Visible status at every step" },
  { number: "02", label: "Final price before payment" },
  { number: "03", label: "Admin approval on listings" },
  { number: "04", label: "One record per repair" },
];

const STEPS: Array<{
  status: string;
  who: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    status: "Requested",
    who: "Customer",
    text: "You describe the fault and pick a date. The technician is notified instantly.",
    icon: Send,
  },
  {
    status: "Accepted",
    who: "Technician",
    text: "The technician confirms the job. Your address and phone number are shared with them.",
    icon: BadgeCheck,
  },
  {
    status: "In Progress",
    who: "Technician",
    text: "Work starts. The job timer and timeline update from the technician dashboard.",
    icon: Wrench,
  },
  {
    status: "Completed",
    who: "Technician",
    text: "The technician enters the final amount. The Pay Now button appears for you.",
    icon: CheckCircle2,
  },
  {
    status: "Paid",
    who: "Stripe",
    text: "You pay by card. The payment is recorded once, and your invoice is available forever.",
    icon: CreditCard,
  },
];

const VALUES: Array<{
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    title: "Payment is not a deposit",
    text: "Holding money before the work is how trust breaks. We only open checkout when the technician has finished and set the amount.",
    icon: Lock,
  },
  {
    title: "Technicians are professionals",
    text: "They get a real dashboard, their own pricing and a clean pipeline — not a WhatsApp inbox and unpaid invoices.",
    icon: Users,
  },
  {
    title: "Nothing happens off-record",
    text: "Every status change, payment and service edit is written to the same job. Support can see exactly what happened.",
    icon: Eye,
  },
  {
    title: "Approval is a feature",
    text: "A listing cannot reach the public site until an admin approves it. Editing a service sends it back for review.",
    icon: ShieldCheck,
  },
];

const FAQS = [
  [
    "Do I pay before the repair?",
    "No. FixMate is pay-after-service. You request a job for free, the technician completes the work, sets the final amount, and only then does the Pay Now button appear in your dashboard.",
  ],
  [
    "What happens if the technician rejects my request?",
    "You are notified immediately and the booking is closed. Nothing is charged. You can send a request to another technician offering the same service.",
  ],
  [
    "Can I cancel a booking?",
    "Yes — while the job is still in the “Requested” state. Once a technician has accepted and started work, cancellation is handled by support so the technician is not left out of pocket.",
  ],
  [
    "How are technicians verified?",
    "Every technician submits an ID and their trade experience. An admin reviews each service listing before it appears publicly, and can suspend accounts that break the rules.",
  ],
  [
    "Which areas do you cover?",
    "Dhaka for now — Mirpur, Dhanmondi, Uttara and surrounding areas. Each listing shows the exact coverage area, and home-visit jobs are matched by area.",
  ],
  [
    "How do refunds work?",
    "Because payment happens after completion, refunds are rare. If a repair fails within the 30-day workmanship window, support arranges a free return visit or a full refund.",
  ],
];

export default function HowItWorksPage() {
  return (
    <>
      <HomeMotion />

      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <section className="mx-auto grid max-w-[1264px] gap-11 px-6 pb-24 pt-3 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-0">
          <div data-reveal>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[12px] text-[#87948d]"
            >
              <Link
                href="/"
                className="transition-colors hover:text-[#0f1a15] dark:hover:text-white"
              >
                Home
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-[#27352f] dark:text-[#cfdbd3]">
                How it works
              </span>
            </nav>

            <p className="mt-5 flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              About FixMate
            </p>

            <h1 className="mt-4 max-w-[16ch] font-heading text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0f1a15] sm:text-[3.2rem] dark:text-white">
              A repair should not feel like a gamble.
            </h1>

            <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-[#5f6f68] sm:text-[16.5px] dark:text-[#9dab9f]">
              FixMate exists because handing your device to a stranger should
              not mean losing visibility, time and money. We turned the repair
              into a tracked job with a clear owner, a clear price and a payment
              that waits for the work.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[13px] bg-[#0e6b54] px-6 text-[14px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
              >
                Find a service
                <ArrowRight className="size-4" />
              </Link>

              <a
                href="#pipeline"
                className="inline-flex h-12 items-center justify-center rounded-[13px] border border-[#d2ccbc] bg-white px-6 text-[14px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/[0.06]"
              >
                See the pipeline
              </a>
            </div>
          </div>

          <div
            data-reveal
            className="rounded-[22px] border border-[#e5e1d6] bg-white p-5 shadow-sm dark:border-[#24332c] dark:bg-[#101a16] dark:shadow-none"
          >
            <div className="flex items-center justify-between gap-3 px-0.5 pb-4">
              <span className="font-heading text-[12.5px] font-bold text-[#0f1a15] dark:text-white">
                Job #FM-2481
              </span>
              <span className="flex h-[25px] items-center gap-1.5 rounded-[7px] bg-[#fcf0d7] px-2.5 text-[11.5px] font-semibold text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]">
                <span className="size-1.5 rounded-full bg-current" />
                In Progress
              </span>
            </div>

            <div className="grid gap-2.5">
              {PIPELINE.map((step) => (
                <div
                  key={step.title}
                  className={`flex items-center gap-3 rounded-[11px] border border-[#e5e1d6] bg-[#fbfaf6] px-3.5 py-3 dark:border-[#24332c] dark:bg-[#14201b] ${
                    step.faded ? "opacity-55" : ""
                  }`}
                >
                  <span className={`size-2 shrink-0 rounded-full ${step.dot}`} />
                  <b className="font-heading text-[12.5px] font-semibold text-[#0f1a15] dark:text-[#edf4ef]">
                    {step.title}
                  </b>
                  <span className="ml-auto text-[11px] text-[#87948d]">
                    {step.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-start gap-2.5 rounded-[10px] border border-[#0e6b54]/20 bg-[#e4f2ec] px-3 py-2.5 text-[11.8px] leading-[1.5] text-[#0e6b54] dark:border-[#43d3ab]/20 dark:bg-[#112c25] dark:text-[#43d3ab]">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              The customer cannot pay until the technician marks this job
              completed.
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1264px] px-6 pb-16">
          <div
            data-reveal
            className="relative overflow-hidden rounded-[26px] bg-[#0b1713] px-7 py-12 sm:px-10 sm:py-14"
          >
            <div className="pointer-events-none absolute -bottom-72 -right-28 size-[560px] rounded-full bg-[radial-gradient(circle,rgba(80,215,175,0.16),transparent_66%)]" />

            <div className="relative grid gap-9 lg:grid-cols-[1.25fr_2fr] lg:items-center">
              <div>
                <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#7de0bd]">
                  <span className="h-px w-[18px] bg-current opacity-60" />
                  Our principles
                </p>

                <h2 className="mt-3 max-w-[420px] font-heading text-[2rem] font-extrabold leading-[1.02] tracking-[-0.038em] text-white sm:text-[2.65rem]">
                  Good work deserves a good system.
                </h2>

                <p className="mt-3 max-w-[42ch] text-[14px] leading-[1.65] text-[#a9b8b0]">
                  Skilled technicians lose hours chasing customers. Customers
                  lose trust chasing technicians. FixMate is the shared record
                  both sides can point at.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-7 sm:grid-cols-4 sm:gap-y-0">
                {PRINCIPLES.map((principle, index) => (
                  <div
                    key={principle.number}
                    className={
                      index > 0
                        ? "sm:border-l sm:border-white/15 sm:px-4"
                        : "sm:pr-4"
                    }
                  >
                    <p className="font-heading text-[32px] font-extrabold leading-none tracking-[-0.04em] text-white">
                      {principle.number}
                    </p>
                    <p className="mt-2 text-[11.5px] leading-snug text-[#a9b8b0]">
                      {principle.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="pipeline"
          className="mx-auto max-w-[1264px] scroll-mt-[90px] px-6 py-12 lg:py-16"
        >
          <div data-reveal className="max-w-[640px]">
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              The job pipeline
            </p>

            <h2 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.02] tracking-[-0.038em] text-[#0f1a15] sm:text-[2.65rem] dark:text-white">
              Each status has one owner.
            </h2>

            <p className="mt-3 text-[15px] leading-[1.65] text-[#5f6f68] dark:text-[#9dab9f]">
              No ambiguous “we’ll call you” stage. Technicians move jobs forward,
              customers can only cancel before acceptance, and payment is a
              separate, final event.
            </p>
          </div>

          <ol
            data-reveal-group
            className="mt-10 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-5"
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <li key={step.status}>
                  <div className="flex items-center gap-3">
                    <span className="flex size-[42px] shrink-0 items-center justify-center rounded-xl bg-[#0e6b54] font-heading text-[15px] font-extrabold text-white dark:bg-[#43d3ab] dark:text-[#06231b]">
                      {index + 1}
                    </span>
                    {index < STEPS.length - 1 && (
                      <span className="h-px flex-1 border-t border-dashed border-[#d2ccbc] dark:border-white/15" />
                    )}
                    <Icon
                      className="hidden size-[18px] shrink-0 text-[#d2ccbc] xl:block dark:text-white/20"
                      strokeWidth={1.7}
                    />
                  </div>

                  <h3 className="mt-4 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                    {step.status}
                  </h3>
                  <p className="mt-1.5 max-w-[280px] text-[13px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                    {step.text}
                  </p>
                  <p className="mt-2 text-[12px] font-semibold text-[#0e6b54] dark:text-[#43d3ab]">
                    {step.who} can change this
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mx-auto max-w-[1264px] px-6 py-10 lg:py-14">
          <div data-reveal className="max-w-[640px]">
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              What we believe
            </p>

            <h2 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.02] tracking-[-0.038em] text-[#0f1a15] sm:text-[2.65rem] dark:text-white">
              Design decisions we refuse to undo.
            </h2>
          </div>

          <div
            data-reveal-group
            className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {VALUES.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="rounded-[18px] border border-[#e5e1d6] bg-white p-6 dark:border-white/[0.08] dark:bg-[#101a16]"
              >
                <span className="flex size-10 items-center justify-center rounded-[11px] bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                  <Icon className="size-5" strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 font-heading text-[15.5px] font-bold text-[#0f1a15] dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 max-w-[48ch] text-[13px] leading-[1.65] text-[#5f6f68] dark:text-[#9dab9f]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1264px] px-6 py-10 lg:py-14">
          <div data-reveal className="max-w-[820px]">
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              FAQ
            </p>

            <h2 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.02] tracking-[-0.038em] text-[#0f1a15] sm:text-[2.65rem] dark:text-white">
              The questions we get every day.
            </h2>

            <div className="mt-8 grid gap-2.5">
              {FAQS.map(([question, answer], index) => (
                <details
                  key={question}
                  open={index === 0}
                  className="group rounded-[13px] border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 font-heading text-[14px] font-semibold text-[#0f1a15] [&::-webkit-details-marker]:hidden dark:text-white">
                    {question}
                    <Plus className="size-[17px] shrink-0 text-[#87948d] transition-transform group-open:rotate-45 group-open:text-[#0e6b54] dark:group-open:text-[#43d3ab]" />
                  </summary>
                  <p className="max-w-[70ch] px-4 pb-4 text-[13px] leading-[1.7] text-[#5f6f68] dark:text-[#9dab9f]">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1264px] px-6 pb-16 pt-10 lg:pb-20">
          <div
            data-reveal
            className="flex flex-col gap-5 overflow-hidden rounded-3xl border border-[#e5e1d6] bg-white px-7 py-9 sm:px-10 lg:flex-row lg:items-center lg:justify-between dark:border-white/[0.08] dark:bg-[#101a16]"
          >
            <div>
              <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
                <span className="h-px w-[18px] bg-current opacity-60" />
                Still deciding?
              </p>
              <h2 className="mt-2.5 max-w-[560px] font-heading text-[1.6rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#0f1a15] sm:text-[1.9rem] dark:text-white">
                Browse the actual services, not a brochure.
              </h2>
              <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                Every listing is live, approved and priced. Request one when you
                are ready — it costs nothing until it is fixed.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[13px] bg-[#0e6b54] px-6 text-[14px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
            >
              Browse services
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
