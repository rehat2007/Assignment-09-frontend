import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { PaymentSuccessToast } from "@/components/payment/payment-toast";
import { SiteFooter } from "@/components/site-footer";
import { getPaymentVerification } from "@/lib/customer-api";
import { formatDate, money, type CustomerPayment } from "@/lib/customer-data";

export const metadata: Metadata = {
  title: "Payment successful — FixMate",
  description: "Your FixMate payment has been verified by Stripe.",
};

type Props = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;

  let payment: CustomerPayment | null = null;
  let error = "";

  if (!sessionId) {
    error = "The payment session is missing from the return URL.";
  } else {
    try {
      payment = await getPaymentVerification(sessionId);
    } catch (caught) {
      error =
        caught instanceof Error
          ? caught.message
          : "We could not verify this payment.";
    }
  }

  return (
    <>
      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        {payment && (
          <PaymentSuccessToast
            amount={payment.amount}
            transactionId={payment.transactionId}
          />
        )}
        <div className="mx-auto flex max-w-[760px] flex-col px-6 py-12 sm:py-16">
          <section className="overflow-hidden rounded-[20px] border border-[#e5e1d6] bg-white shadow-[0_18px_40px_-30px_rgba(15,26,21,0.35)] dark:border-white/[0.08] dark:bg-[#101a16]">
            <div
              className={`border-b px-6 py-7 sm:px-8 ${
                payment
                  ? "border-[#bfe7d5] bg-[#e9f6ef] dark:border-[#1b4b39] dark:bg-[#0d231a]"
                  : "border-[#e7cda1] bg-[#fcf0d7] dark:border-[#6b4c24] dark:bg-[#241b10]"
              }`}
            >
              <span
                className={`flex size-12 items-center justify-center rounded-full ${
                  payment
                    ? "bg-[#0e6b54] text-white dark:bg-[#63e6b6] dark:text-[#06231b]"
                    : "bg-[#b87918] text-white dark:bg-[#f0bb6a] dark:text-[#2b1b05]"
                }`}
              >
                {payment ? (
                  <CheckCircle2 className="size-6" />
                ) : (
                  <AlertTriangle className="size-6" />
                )}
              </span>

              <p className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#63e6b6]">
                {payment ? "Stripe payment verified" : "Payment not verified"}
              </p>
              <h1 className="mt-1.5 font-heading text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] dark:text-white">
                {payment ? "Payment successful" : "We could not verify this payment"}
              </h1>
              <p className="mt-2 max-w-[52ch] text-[13px] leading-[1.65] text-[#5f6f68] dark:text-[#9dab9f]">
                {payment
                  ? "Thanks — your payment is recorded and the technician has been notified. You can open the invoice details from your payment history."
                  : error ||
                    "Open My Bookings to see the current payment status for this job."}
              </p>
            </div>

            {payment ? (
              <div className="px-6 py-6 sm:px-8">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0f1a15] dark:text-white">
                  <Receipt className="size-4 text-[#0e6b54] dark:text-[#63e6b6]" />
                  Payment receipt
                </div>

                <dl className="mt-4 grid gap-3 rounded-[13px] border border-[#e5e1d6] bg-[#fbfaf6] p-4 text-[12.5px] dark:border-white/[0.08] dark:bg-[#0b1510]">
                  <Row label="Service" value={payment.serviceTitle} />
                  <Row
                    label="Booking"
                    value={`#${payment.bookingNumber ?? payment.bookingId.toUpperCase()}`}
                  />
                  <Row label="Technician" value={payment.technician} />
                  <Row label="Paid on" value={formatDate(payment.paidAt)} />
                  <Row
                    label="Transaction"
                    value={payment.transactionId}
                    mono
                  />
                  <div className="flex items-center justify-between gap-4 border-t border-dashed border-[#d2ccbc] pt-3 dark:border-white/10">
                    <dt className="font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                      Amount paid
                    </dt>
                    <dd className="font-heading text-[22px] font-extrabold tracking-[-0.03em] text-[#0e6b54] dark:text-[#63e6b6]">
                      {money(payment.amount)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <Link
                    href="/dashboard/customer/bookings"
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[11px] bg-[#0e6b54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
                  >
                    Back to My Bookings
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/dashboard/customer/payments"
                    className="flex h-11 flex-1 items-center justify-center rounded-[11px] border border-[#d2ccbc] px-5 text-[13px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
                  >
                    Payment history
                  </Link>
                </div>
              </div>
            ) : (
              <div className="px-6 py-6 sm:px-8">
                <div className="flex items-start gap-2 rounded-[10px] border border-[#e7cda1] bg-[#fcf0d7] px-3.5 py-3 text-[11.5px] leading-[1.6] text-[#a65c07] dark:border-[#6b4c24] dark:bg-[#241b10] dark:text-[#e4b97a]">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    If you completed the payment, wait a moment and refresh this
                    page. Stripe sometimes takes a few seconds to confirm.
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <Link
                    href="/dashboard/customer/bookings"
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[11px] bg-[#0e6b54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
                  >
                    Go to My Bookings
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/sign-in"
                    className="flex h-11 flex-1 items-center justify-center rounded-[11px] border border-[#d2ccbc] px-5 text-[13px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 border-t border-[#e5e1d6] px-6 py-4 text-[10.5px] leading-[1.55] text-[#5f6f68] dark:border-white/[0.08] dark:text-[#9dab9f]">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#0e6b54] dark:text-[#63e6b6]" />
              <span>
                Payments are recorded once per booking. Refreshing this page
                will not charge you again.
              </span>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[#5f6f68] dark:text-[#9dab9f]">{label}</dt>
      <dd
        className={`text-right font-medium text-[#0f1a15] dark:text-white ${
          mono ? "break-all font-mono text-[10.5px]" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
