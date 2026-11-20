import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  ClipboardList,
  Clock,
  CreditCard,
  Eye,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { BookingTimeline, StatusBadge } from "@/components/customer/booking-status";
import { CategoryTile } from "@/components/customer/category-tile";
import { CustomerPageError } from "@/components/customer/customer-page-error";
import { requireRole } from "@/lib/authz";
import { getServices, type ServiceSummary } from "@/lib/catalog";
import {
  getCustomerOverview,
  type CustomerOverview,
} from "@/lib/customer-api";
import {
  BOOKING_STATUS_COLOR,
  BOOKING_STATUS_LABEL,
  formatDate,
  money,
} from "@/lib/customer-data";

const STATUS_ORDER = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
] as const;

export default async function CustomerOverviewPage() {
  const { session } = await requireRole(["customer"]);
  const user = session.user;
  const firstName = user.name.split(" ")[0];

  let overview: CustomerOverview;
  let recommended: ServiceSummary | null = null;

  try {
    const [overviewData, recommendedData] = await Promise.all([
      getCustomerOverview(),
      getServices({ category: "Smartphone", sort: "rating", pageSize: 1 }),
    ]);

    overview = overviewData;
    recommended = recommendedData.data[0] ?? null;
  } catch {
    return (
      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="mx-auto max-w-[1264px] px-6 py-8">
          <CustomerPageError
            title="We could not load your dashboard"
            description="Your bookings and payment summary could not be loaded. Please try again."
            retryHref="/dashboard/customer"
          />
        </div>
      </main>
    );
  }

  const { stats, counts, active, recent, spend } = overview;
  const maxSpend = Math.max(...spend.map((entry) => entry.value), 1);

  const segments = STATUS_ORDER.map((status) => ({
    status,
    count: counts[status] ?? 0,
    color: BOOKING_STATUS_COLOR[status],
  }));

  const gradient =
    stats.total > 0
      ? segments
          .filter((segment) => segment.count > 0)
          .reduce<{ stops: string[]; cursor: number }>(
            (result, segment) => {
              const end = result.cursor + (segment.count / stats.total) * 100;
              return {
                cursor: end,
                stops: [
                  ...result.stops,
                  `${segment.color} ${result.cursor}% ${end}%`,
                ],
              };
            },
            { stops: [], cursor: 0 },
          )
          .stops.join(", ")
      : "#e5e1d6 0% 100%";

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
              Hi {firstName} <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-1 text-[13.5px] text-[#5f6f68] dark:text-[#9dab9f]">
              Here is what is happening with your repairs right now.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/customer/payments"
              className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]"
            >
              <CreditCard className="size-4" />
              Payments
            </Link>
            <Link
              href="/services"
              className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#0e6b54] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
            >
              <span className="text-[17px] leading-none">+</span>
              Book a repair
            </Link>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard
            label="Total requests"
            value={String(stats.total)}
            note="All time"
            icon={<ClipboardList className="size-4" />}
            tone="mint"
          />
          <StatCard
            label="Active jobs"
            value={String(stats.active)}
            note="In progress or waiting"
            icon={<Wrench className="size-4" />}
            tone="amber"
          />
          <StatCard
            label="Completed jobs"
            value={String(stats.completed)}
            note={`${stats.completionRate}% completion rate`}
            icon={<CircleCheck className="size-4" />}
            tone="violet"
          />
          <StatCard
            label="Total spent"
            value={money(stats.spent)}
            note={`${stats.paymentCount} secure payments`}
            icon={<CreditCard className="size-4" />}
            tone="mint"
          />
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="grid gap-4">
            <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                    <Eye className="size-4 text-[#87948d]" />
                    Active repair
                  </h2>
                  <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                    Live status, straight from the technician
                  </p>
                </div>
                <Link
                  href="/dashboard/customer/bookings"
                  className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                >
                  All bookings <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {active ? (
                <div className="mt-4 rounded-xl border border-[#e5e1d6] bg-[#fbfaf6] p-4 dark:border-white/[0.08] dark:bg-[#0b1510]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <CategoryTile category={active.category} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
                        {active.title}
                      </h3>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                        {active.technician}
                        <span>·</span>
                        Dhaka
                        <span>·</span>
                        {formatDate(active.preferredDate)}
                      </p>
                    </div>
                    <StatusBadge status={active.status} />
                  </div>

                  <div className="mt-6">
                    <BookingTimeline
                      status={active.status}
                      paymentStatus={active.paymentStatus}
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-[#e5e1d6] pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
                    <p className="flex items-center gap-1.5 text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                      <Clock className="size-3.5" />
                      {active.status === "requested"
                        ? `${active.technician} will confirm your request shortly.`
                        : `${active.technician} is on the job. Payment opens after completion.`}
                    </p>
                    <Link
                      href={`/services/${active.serviceSlug ?? active.serviceId}`}
                      className="inline-flex h-9 items-center justify-center rounded-[7px] bg-[#0e6b54]/10 px-3 text-[11.5px] font-semibold text-[#0e6b54] transition hover:bg-[#0e6b54]/15 dark:bg-[#63e6b6]/10 dark:text-[#63e6b6]"
                    >
                      View service
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-[#d2ccbc] p-5 text-[12px] text-[#5f6f68] dark:border-white/15 dark:text-[#9dab9f]">
                  No active repairs right now.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                    <ClipboardList className="size-4 text-[#87948d]" />
                    Recent bookings
                  </h2>
                  <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                    Newest first
                  </p>
                </div>
                <Link
                  href="/dashboard/customer/bookings"
                  className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                >
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </div>

              <div className="mt-3 divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
                {recent.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 py-3"
                  >
                    <CategoryTile category={booking.category} small />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                        {booking.title}
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-[#87948d]">
                        #{booking.bookingNumber ?? booking.id.toUpperCase()} ·{" "}
                        {formatDate(booking.preferredDate)} ·{" "}
                        {money(booking.basePrice)}
                      </p>
                    </div>
                    <StatusBadge
                      status={booking.status}
                      paymentStatus={booking.paymentStatus}
                    />
                    <Link
                      href="/dashboard/customer/bookings"
                      className="shrink-0 text-[11.5px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                    >
                      Details
                    </Link>
                  </div>
                ))}
                {recent.length === 0 && (
                  <p className="py-4 text-[12px] text-[#5f6f68] dark:text-[#9dab9f]">
                    No bookings yet.{" "}
                    <Link
                      href="/services"
                      className="font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                    >
                      Browse services
                    </Link>
                    .
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="grid gap-4">
            <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
              <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                <CalendarDays className="size-4 text-[#87948d]" />
                Booking status
              </h2>
              <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                All {stats.total} requests
              </p>

              <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
                <div
                  role="img"
                  aria-label={`Booking status: ${stats.total} total requests`}
                  className="relative size-[150px] shrink-0 rounded-full"
                  style={{ background: `conic-gradient(${gradient})` }}
                >
                  <div className="absolute inset-[20px] flex flex-col items-center justify-center rounded-full bg-white dark:bg-[#101a16]">
                    <span className="font-heading text-[24px] font-extrabold leading-none text-[#0f1a15] dark:text-white">
                      {stats.total}
                    </span>
                    <span className="mt-1 text-[10px] text-[#87948d]">
                      bookings
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2.5">
                  {segments.map((segment) => (
                    <div
                      key={segment.status}
                      className="flex items-center justify-between gap-3 text-[11.5px]"
                    >
                      <span className="flex items-center gap-2 text-[#5f6f68] dark:text-[#9dab9f]">
                        <span
                          className="size-2 rounded-[2px]"
                          style={{ backgroundColor: segment.color }}
                        />
                        {BOOKING_STATUS_LABEL[segment.status]}
                      </span>
                      <b className="font-semibold text-[#0f1a15] dark:text-white">
                        {segment.count}
                      </b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#e5e1d6] pt-4 dark:border-white/[0.08]">
                <p className="text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  Spend, last 6 months
                </p>
                <p className="text-[11.5px] font-bold text-[#0f1a15] dark:text-white">
                  {money(stats.spent)} total
                </p>
              </div>

              <div className="mt-4 flex h-28 items-end gap-3">
                {spend.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div
                      className="w-full max-w-[26px] rounded-t-[3px] bg-[#3aa77c] dark:bg-[#23624a]"
                      style={{
                        height:
                          entry.value > 0
                            ? `${Math.max(8, (entry.value / maxSpend) * 100)}%`
                            : "3px",
                      }}
                      title={`${entry.label}: ${money(entry.value)}`}
                    />
                    <span className="text-[10px] text-[#87948d]">
                      {entry.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
              <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                <Sparkles className="size-4 text-[#87948d]" />
                Recommended for you
              </h2>
              <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                Top rated in your area
              </p>

              {recommended && (
                <Link
                  href={`/services/${recommended.id}`}
                  className="mt-4 flex items-center gap-3 rounded-xl border border-[#e5e1d6] bg-[#fbfaf6] p-3 transition hover:border-[#d2ccbc] dark:border-white/[0.08] dark:bg-[#0b1510]"
                >
                  <CategoryTile category={recommended.category} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                      {recommended.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                      {recommended.technician} · {recommended.rating.toFixed(1)}
                      <Star className="size-3 fill-[#eb9f34] text-[#eb9f34]" />
                    </p>
                  </div>
                  <span className="shrink-0 text-[12px] font-bold text-[#0f1a15] dark:text-white">
                    {money(recommended.price)}
                  </span>
                </Link>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  note,
  icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  tone: "mint" | "amber" | "violet";
}) {
  const tones = {
    mint: "bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]",
    amber: "bg-[#fcf0d7] text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]",
    violet: "bg-[#ecebff] text-[#4338ca] dark:bg-[#1d1b3a] dark:text-[#a9a4ff]",
  };

  return (
    <div className="rounded-2xl border border-[#e5e1d6] bg-white p-4 dark:border-white/[0.08] dark:bg-[#101a16]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11.5px] font-medium text-[#5f6f68] dark:text-[#9dab9f]">
          {label}
        </p>
        <span
          className={`flex size-8 items-center justify-center rounded-[8px] ${tones[tone]}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 font-heading text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#0f1a15] dark:text-white">
        {value}
      </p>
      <p className="mt-3 text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
        {note}
      </p>
    </div>
  );
}


