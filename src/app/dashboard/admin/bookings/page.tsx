import Link from "next/link";
import { cn } from "cn";
import { StatusBadge } from "@/components/customer/booking-status";
import { DashboardPageError } from "@/components/dashboard/dashboard-page-error";
import { getAdminBookings } from "@/lib/admin-api";
import { requireRole } from "@/lib/authz";
import {
  type BookingStatus,
  formatDate,
  money,
} from "@/lib/customer-data";

const FILTERS: Array<{ key: BookingStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_RANK: Record<BookingStatus, number> = {
  requested: 0,
  accepted: 1,
  "in-progress": 2,
  completed: 3,
  rejected: 4,
  cancelled: 5,
};

const AVATAR_TONES = [
  "bg-[#f6e7c8] text-[#a86a12]",
  "bg-[#e9efff] text-[#274ec4]",
  "bg-[#e2f4e9] text-[#147a4b]",
  "bg-[#fcecea] text-[#b42318]",
  "bg-[#f3e8ff] text-[#7e22ce]",
  "bg-[#e0f2fe] text-[#0369a1]",
];

export default async function AdminBookingsPage({
  searchParams,
}: PageProps<"/dashboard/admin/bookings">) {
  await requireRole(["admin"]);

  const params = await searchParams;
  const rawStatus = Array.isArray(params.status)
    ? params.status[0]
    : params.status;

  const allBookings = await getAdminBookings().catch(() => null);

  if (!allBookings) {
    return (
      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="mx-auto max-w-[1264px] px-6 py-8">
          <DashboardPageError
            title="We could not load bookings"
            description="The platform booking list could not be loaded. Please try again."
            retryHref="/dashboard/admin/bookings"
          />
        </div>
      </main>
    );
  }

  const bookingCounts: Record<string, number> = { all: allBookings.length };

  for (const status of Object.keys(STATUS_RANK) as BookingStatus[]) {
    bookingCounts[status] = 0;
  }

  for (const booking of allBookings) {
    bookingCounts[booking.status] = (bookingCounts[booking.status] ?? 0) + 1;
  }

  const active: BookingStatus | "all" =
    rawStatus && rawStatus in bookingCounts
      ? (rawStatus as BookingStatus)
      : "all";

  const list = (
    active === "all"
      ? allBookings
      : allBookings.filter((booking) => booking.status === active)
  )
    .slice()
    .sort(
      (a, b) =>
        STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
        b.createdAt.localeCompare(a.createdAt),
    );

  const pipelineValue = allBookings.reduce(
    (total, booking) => total + (booking.finalAmount ?? booking.basePrice),
    0,
  );

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
              All bookings
            </h1>
            <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
              Read-only view of every repair job on the platform.
            </p>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-[7px] bg-[#e4f2ec] px-3 py-2 text-[10.5px] font-semibold text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
            <span className="size-1.5 rounded-full bg-current" />
            {money(pipelineValue)} pipeline value
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((item) => {
              const activeFilter = active === item.key;
              return (
                <Link
                  key={item.key}
                  href={
                    item.key === "all"
                      ? "/dashboard/admin/bookings"
                      : `/dashboard/admin/bookings?status=${item.key}`
                  }
                  aria-current={activeFilter ? "page" : undefined}
                  className={cn(
                    "inline-flex h-8 items-center gap-2 rounded-[8px] border px-3 text-[11.5px] font-medium transition-colors",
                    activeFilter
                      ? "border-[#0f1a15] bg-[#0f1a15] text-white dark:border-white dark:bg-white dark:text-[#0f1a15]"
                      : "border-[#e5e1d6] bg-[#fbfaf6] text-[#5f6f68] hover:text-[#0f1a15] dark:border-white/[0.08] dark:bg-[#101a16] dark:text-[#9dab9f] dark:hover:text-white",
                  )}
                >
                  {item.label}
                  <span className="text-[10px] opacity-60">
                    {bookingCounts[item.key]}
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="text-[11.5px] text-[#87948d]">
            Admin view · no editing
          </p>
        </div>

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]">
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1060px] text-left">
              <thead>
                <tr className="border-b border-[#e5e1d6] text-[9.5px] uppercase tracking-[0.08em] text-[#87948d] dark:border-white/[0.08]">
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-3 py-3 font-semibold">Customer</th>
                  <th className="px-3 py-3 font-semibold">Technician</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
                {list.map((booking, index) => (
                  <tr key={booking.id} className="text-[11.5px]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0f1a15] dark:text-white">
                        {booking.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#87948d]">
                        #{booking.bookingNumber ?? booking.id.toUpperCase()} · {booking.category}
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                            AVATAR_TONES[index % AVATAR_TONES.length],
                          )}
                        >
                          {initials(booking.customer)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#0f1a15] dark:text-white">
                            {booking.customer}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-[#87948d]">
                            {booking.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-[#5f6f68] dark:text-[#9dab9f]">
                      {booking.technician}
                    </td>
                    <td className="px-3 py-4 text-[#5f6f68] dark:text-[#9dab9f]">
                      {formatDate(booking.preferredDate)}
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-3 py-4">
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-[#0f1a15] dark:text-white">
                      {money(
                        booking.status === "completed"
                          ? (booking.finalAmount ?? booking.basePrice)
                          : booking.basePrice,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[#e5e1d6] lg:hidden dark:divide-white/[0.07]">
            {list.map((booking, index) => (
              <div key={booking.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#0f1a15] dark:text-white">
                      {booking.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#87948d]">
                      #{booking.bookingNumber ?? booking.id.toUpperCase()} · {booking.category}
                    </p>
                  </div>
                  <p className="shrink-0 text-[12px] font-bold text-[#0f1a15] dark:text-white">
                    {money(
                      booking.status === "completed"
                        ? (booking.finalAmount ?? booking.basePrice)
                        : booking.basePrice,
                    )}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                      AVATAR_TONES[index % AVATAR_TONES.length],
                    )}
                  >
                    {initials(booking.customer)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[#0f1a15] dark:text-white">
                      {booking.customer}
                    </p>
                    <p className="truncate text-[9.5px] text-[#87948d]">
                      {booking.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <p className="text-[#87948d]">Technician</p>
                    <p className="mt-0.5 font-medium text-[#27352f] dark:text-[#cfdbd3]">
                      {booking.technician}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#87948d]">Date</p>
                    <p className="mt-0.5 font-medium text-[#27352f] dark:text-[#cfdbd3]">
                      {formatDate(booking.preferredDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={booking.status} />
                  <PaymentBadge status={booking.paymentStatus} />
                </div>
              </div>
            ))}
          </div>

          {list.length === 0 && (
            <p className="p-10 text-center text-[12px] text-[#5f6f68] dark:text-[#9dab9f]">
              No bookings in this status.
            </p>
          )}

          <div className="flex flex-col gap-2 border-t border-[#e5e1d6] px-5 py-3 text-[10px] text-[#87948d] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
            <span>
              Read-only admin view · technicians and customers update these jobs.
            </span>
            <span>{list.length} shown</span>
          </div>
        </section>
      </div>
    </main>
  );
}

function PaymentBadge({ status }: { status: "paid" | "unpaid" }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-[5px] px-2 text-[10.5px] font-semibold",
        status === "paid"
          ? "bg-[#e2f4e9] text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]"
          : "bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status === "paid" ? "Paid" : "Unpaid"}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
