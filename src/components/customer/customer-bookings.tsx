"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Plus,
  RotateCcw,
  Star,
  XCircle,
} from "lucide-react";
import { cn } from "cn";
import { BookingTimeline, StatusBadge } from "@/components/customer/booking-status";
import { CustomerReviewDialog } from "@/components/customer/customer-review-dialog";
import { ServiceThumbnail } from "@/components/service-thumbnail";
import {
  BOOKING_STATUS_LABEL,
  type BookingStatus,
  type CustomerBooking,
  formatDate,
  money,
} from "@/lib/customer-data";

const FILTERS: Array<{ key: BookingStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "rejected", label: "Rejected" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function CustomerBookings({
  initialBookings,
}: {
  initialBookings: CustomerBooking[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const router = useRouter();

  const counts = useMemo(
    () =>
      bookings.reduce<Record<string, number>>(
        (result, booking) => {
          result.all += 1;
          result[booking.status] = (result[booking.status] ?? 0) + 1;
          return result;
        },
        { all: 0 },
      ),
    [bookings],
  );

  const visible = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter],
  );

  async function cancelBooking(id: string) {
    if (pendingId) return;

    setPendingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/bookings/${encodeURIComponent(id)}/cancel`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const body = (await response.json().catch(() => null)) as
        | {
            data?: CustomerBooking;
            error?: { message?: string };
          }
        | null;

      if (!response.ok || !body?.data) {
        throw new Error(
          body?.error?.message ?? "Could not cancel this booking.",
        );
      }

      const updated = body.data;
      setBookings((current) =>
        current.map((booking) => (booking.id === id ? updated : booking)),
      );
      toast.success("Request cancelled. The technician has been notified.");
      router.refresh();
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not cancel this booking.";
      setError(message);
      toast.error(message);
    } finally {
      setPendingId(null);
    }
  }

  function markReviewed(id: string) {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, reviewed: true } : booking,
      ),
    );
    toast.success("Review posted. Thanks for helping other customers.");
    router.refresh();
  }

  async function startCheckout(booking: CustomerBooking) {
    if (checkoutId) return;

    setCheckoutId(booking.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/bookings/${booking.id}/checkout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const body = (await response.json().catch(() => null)) as
        | {
            data?: { url?: string };
            error?: { message?: string };
          }
        | null;

      if (!response.ok || !body?.data?.url) {
        throw new Error(
          body?.error?.message ?? "Could not start checkout.",
        );
      }

      window.location.href = body.data.url;
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not start checkout.";
      setError(message);
      toast.error(message);
      setCheckoutId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
            My Bookings
          </h1>
          <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
            Every repair request you have sent, with live status and payment.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[9px] bg-[#0e6b54] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
        >
          <Plus className="size-4" />
          New request
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[9px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[11.5px] text-[#b42318] dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-6 flex max-w-full items-center gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            const count = counts[item.key] ?? 0;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-2 rounded-[8px] border px-3 text-[11.5px] font-medium transition-colors",
                  active
                    ? "border-[#0f1a15] bg-[#0f1a15] text-white dark:border-white dark:bg-white dark:text-[#0f1a15]"
                    : "border-[#e5e1d6] bg-[#fbfaf6] text-[#5f6f68] hover:text-[#0f1a15] dark:border-white/[0.08] dark:bg-[#101a16] dark:text-[#9dab9f] dark:hover:text-white",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "text-[10px]",
                    active ? "opacity-70" : "opacity-60",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setFilter("all")}
          className="flex shrink-0 items-center gap-1.5 text-[11.5px] font-semibold text-[#5f6f68] hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:text-white"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {visible.map((booking) => (
          <article
            key={booking.id}
            className="overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]"
          >
            <div className="flex flex-col gap-3 p-4 md:grid md:grid-cols-[minmax(0,1fr)_130px_120px_auto] md:items-center md:gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <ServiceThumbnail
                  image={booking.serviceImage}
                  category={booking.category}
                />
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-[13.5px] font-bold text-[#0f1a15] dark:text-white">
                    {booking.title}
                  </h2>
                  <p className="mt-0.5 truncate text-[10.5px] text-[#87948d]">
                    #{booking.bookingNumber ?? booking.id.toUpperCase()} ·{" "}
                    {booking.technician}
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.06em] text-[#87948d]">
                  Preferred date
                </p>
                <p className="mt-1 text-[11.5px] font-medium text-[#27352f] dark:text-[#cfdbd3]">
                  {formatDate(booking.preferredDate)}
                </p>
              </div>

              <div className="hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.06em] text-[#87948d]">
                  {booking.paymentStatus === "paid"
                    ? "Final amount"
                    : "Base price"}
                </p>
                <p className="mt-1 text-[11.5px] font-semibold text-[#0f1a15] dark:text-white">
                  {money(
                    booking.paymentStatus === "paid"
                      ? (booking.finalAmount ?? booking.basePrice)
                      : booking.basePrice,
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <StatusBadge
                  status={booking.status}
                  paymentStatus={booking.paymentStatus}
                />

                {booking.status === "requested" && (
                  <button
                    type="button"
                    onClick={() => cancelBooking(booking.id)}
                    disabled={pendingId !== null}
                    className="inline-flex h-8 items-center rounded-[7px] border border-[#d2ccbc] px-3 text-[11px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
                  >
                    {pendingId === booking.id ? "Cancelling…" : "Cancel"}
                  </button>
                )}

                {["accepted", "in-progress"].includes(booking.status) && (
                  <Link
                    href={`/services/${booking.serviceSlug ?? booking.serviceId}`}
                    className="inline-flex h-8 items-center gap-1 rounded-[7px] border border-[#d2ccbc] px-3 text-[11px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
                  >
                    View <ArrowRight className="size-3" />
                  </Link>
                )}

                {booking.status === "completed" &&
                  booking.paymentStatus === "unpaid" && (
                    <button
                      type="button"
                      onClick={() => startCheckout(booking)}
                      disabled={checkoutId === booking.id}
                      className="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#0e6b54]/10 px-3 text-[11px] font-semibold text-[#0e6b54] transition hover:bg-[#0e6b54]/15 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#63e6b6]/10 dark:text-[#63e6b6]"
                    >
                      {checkoutId === booking.id
                        ? "Redirecting…"
                        : "Pay now"}
                    </button>
                  )}

                {booking.status === "completed" &&
                  booking.paymentStatus === "paid" && (
                    <>
                      {booking.reviewed ? (
                        <span className="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#0e6b54]/10 px-3 text-[11px] font-semibold text-[#0e6b54] dark:bg-[#63e6b6]/10 dark:text-[#63e6b6]">
                          <Star className="size-3.5 fill-current" />
                          Reviewed
                        </span>
                      ) : (
                        <CustomerReviewDialog
                          bookingId={booking.id}
                          bookingNumber={booking.bookingNumber}
                          serviceTitle={booking.title}
                          onSubmitted={() => markReviewed(booking.id)}
                        />
                      )}
                      <Link
                        href="/dashboard/customer/payments"
                        className="inline-flex h-8 items-center rounded-[7px] border border-[#d2ccbc] px-3 text-[11px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
                      >
                        Invoice
                      </Link>
                    </>
                  )}
              </div>
            </div>

            <div className="border-t border-[#e5e1d6] px-4 py-4 dark:border-white/[0.08]">
              {["cancelled", "rejected"].includes(booking.status) ? (
                <p className="flex items-center gap-2 text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                  <XCircle className="size-3.5 shrink-0" />
                  {booking.status === "cancelled"
                    ? "This request was cancelled before work started."
                    : "The technician declined this request before work started."}
                </p>
              ) : (
                <BookingTimeline
                  status={booking.status}
                  paymentStatus={booking.paymentStatus}
                />
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#87948d]">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3" />
                  Updated {formatDate(booking.updatedAt)}
                </span>
                <span className="md:hidden">
                  {formatDate(booking.preferredDate)} ·{" "}
                  {money(
                    booking.paymentStatus === "paid"
                      ? (booking.finalAmount ?? booking.basePrice)
                      : booking.basePrice,
                  )}
                </span>
              </div>
            </div>
          </article>
        ))}

        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#d2ccbc] bg-[#fbfaf6] p-10 text-center dark:border-white/15 dark:bg-white/[0.02]">
            <p className="font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
              {filter === "all"
                ? "No bookings"
                : `No ${BOOKING_STATUS_LABEL[filter as BookingStatus]} bookings`}
            </p>
            <p className="mt-2 text-[12px] text-[#5f6f68] dark:text-[#9dab9f]">
              Switch the filter or send a new request.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
