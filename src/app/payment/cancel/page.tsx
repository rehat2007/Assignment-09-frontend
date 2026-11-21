import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, XCircle } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Payment cancelled — FixMate",
  description: "Your FixMate payment was cancelled. Nothing was charged.",
};

export default function PaymentCancelPage() {
  return (
    <>
      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="mx-auto flex max-w-[720px] flex-col px-6 py-12 sm:py-16">
          <section className="overflow-hidden rounded-[20px] border border-[#e5e1d6] bg-white shadow-[0_18px_40px_-30px_rgba(15,26,21,0.35)] dark:border-white/[0.08] dark:bg-[#101a16]">
            <div className="border-b border-[#e5e1d6] px-6 py-7 sm:px-8 dark:border-white/[0.08]">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.05] dark:text-[#9dab9f]">
                <XCircle className="size-6" />
              </span>
              <p className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#87948d]">
                Checkout cancelled
              </p>
              <h1 className="mt-1.5 font-heading text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] dark:text-white">
                Payment cancelled
              </h1>
              <p className="mt-2 max-w-[52ch] text-[13px] leading-[1.65] text-[#5f6f68] dark:text-[#9dab9f]">
                No payment was taken and your booking is still unpaid. You can
                try again whenever you are ready.
              </p>
            </div>

            <div className="grid gap-3 px-6 py-6 sm:px-8">
              <div className="flex items-start gap-2 rounded-[10px] border border-[#bfe7d5] bg-[#e9f6ef] px-3.5 py-3 text-[11.5px] leading-[1.6] text-[#0e6b54] dark:border-[#1b4b39] dark:bg-[#0d231a] dark:text-[#63e6b6]">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                <span>
                  Your job is unchanged. The Pay Now button will still be
                  available on the completed booking.
                </span>
              </div>

              <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/dashboard/customer/bookings"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[11px] bg-[#0e6b54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
                >
                  <CreditCard className="size-4" />
                  Try again from My Bookings
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/services"
                  className="flex h-11 flex-1 items-center justify-center rounded-[11px] border border-[#d2ccbc] px-5 text-[13px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
                >
                  Browse services
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
