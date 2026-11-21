import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Check,
  ClipboardList,
  Star,
  TrendingUp,
  Wallet,
  Wrench,
} from "lucide-react";
import { DashboardPageError } from "@/components/dashboard/dashboard-page-error";
import { ServiceThumbnail } from "@/components/service-thumbnail";
import { requireRole } from "@/lib/authz";
import { BOOKING_STATUS_COLOR, BOOKING_STATUS_LABEL, formatDate, money } from "@/lib/customer-data";
import {
  getTechnicianOverview,
  type TechnicianOverview,
} from "@/lib/technician-api";

const PIPELINE = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
] as const;

export default async function TechnicianOverviewPage() {
  await requireRole(["technician"]);

  let overview: TechnicianOverview;

  try {
    overview = await getTechnicianOverview();
  } catch {
    return (
      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="mx-auto max-w-[1264px] px-6 py-8">
          <DashboardPageError
            title="We could not load your overview"
            description="Your listings, requests and earnings could not be loaded. Please try again."
            retryHref="/dashboard/technician"
          />
        </div>
      </main>
    );
  }

  const { stats, pipeline, earnings, topServices, latestRequest } = overview;
  const counts = pipeline;
  const maxEarning = Math.max(
    ...earnings.map((month) => month.value),
    1,
  );
  const pipelineTotal = stats.totalRequests;
  const statusTotal =
    PIPELINE.reduce((sum, status) => sum + (counts[status] ?? 0), 0) || 1;

  const gradient =
    PIPELINE.reduce<{ stops: string[]; cursor: number }>(
      (result, status) => {
        const count = counts[status] ?? 0;
        if (!count) return result;
        const end = result.cursor + (count / statusTotal) * 100;
        return {
          cursor: end,
          stops: [
            ...result.stops,
            `${BOOKING_STATUS_COLOR[status]} ${result.cursor}% ${end}%`,
          ],
        };
      },
      { stops: [], cursor: 0 },
    ).stops.join(", ") || "#e5e1d6 0% 100%";

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
              Technician overview
            </h1>
            <p className="mt-1 text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
              Your listings, requests and earnings at a glance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/technician/requests"
              className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]"
            >
              <ClipboardList className="size-4" />
              Requests
              {stats.pendingRequests > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-[#6366f1] text-[9px] font-bold text-white">
                  {stats.pendingRequests}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard/technician/add-service"
              className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#0e6b54] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
            >
              <span className="text-[17px] leading-none">+</span>
              Add service
            </Link>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard
            label="Total services"
            value={String(stats.totalServices)}
            note={`${stats.availableServices} available now`}
            icon={<Wrench className="size-4" />}
            tone="mint"
          />
          <StatCard
            label="Approved services"
            value={String(stats.approved)}
            note={`${stats.pendingServices} awaiting review`}
            icon={<Check className="size-4" />}
            tone="mint"
          />
          <StatCard
            label="Pending requests"
            value={String(stats.pendingRequests)}
            note="Needs your response"
            icon={<ClipboardList className="size-4" />}
            tone="amber"
          />
          <StatCard
            label="Earnings"
            value={money(stats.earnings)}
            note={`${stats.paidJobs} paid job${stats.paidJobs === 1 ? "" : "s"}`}
            icon={<Wallet className="size-4" />}
            tone="mint"
          />
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="grid gap-4 lg:contents">
            <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 lg:col-start-1 lg:row-start-1 dark:border-white/[0.08] dark:bg-[#101a16]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                    <TrendingUp className="size-4 text-[#87948d]" />
                    Earnings
                  </h2>
                  <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                    Paid jobs, last 6 months
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#e4f2ec] px-2.5 py-1 text-[10px] font-semibold text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                  <span className="size-1.5 rounded-full bg-current" />
                  {money(stats.earnings)} total
                </span>
              </div>

              <div className="mt-6 flex h-32 items-end gap-3">
                {earnings.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div
                      className={`w-full max-w-[32px] rounded-t-[3px] ${
                        entry.label ===
                        earnings[earnings.length - 1]?.label
                          ? "bg-[#f0bb6a]"
                          : "bg-[#3aa77c] dark:bg-[#23624a]"
                      }`}
                      style={{
                        height:
                          entry.value > 0
                            ? `${Math.max(8, (entry.value / maxEarning) * 100)}%`
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

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#e5e1d6] pt-4 sm:grid-cols-4 dark:border-white/[0.08]">
                <MiniStat label="Completed jobs" value={String(stats.completed)} />
                <MiniStat label="Avg. job value" value={money(stats.averageJob)} />
                <MiniStat
                  label="Rating"
                  value={`${stats.rating.toFixed(1)} ★`}
                />
                <Link
                  href="/dashboard/technician/requests"
                  className="flex items-center justify-end gap-1.5 text-[11.5px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                >
                  Manage <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 lg:col-start-1 lg:row-start-2 dark:border-white/[0.08] dark:bg-[#101a16]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                    <Bell className="size-4 text-[#87948d]" />
                    New requests
                  </h2>
                  <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                    Respond within 24 hours to keep your response rate
                  </p>
                </div>
                {stats.pendingRequests > 0 && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] bg-[#6366f1] px-2.5 py-1 text-[10px] font-semibold text-white">
                    {stats.pendingRequests} waiting
                  </span>
                )}
              </div>

              {latestRequest ? (
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#e5e1d6] bg-[#fbfaf6] p-3 sm:flex-row sm:items-center dark:border-white/[0.08] dark:bg-[#0b1510]">
                  <ServiceThumbnail
                    image={latestRequest.serviceImage}
                    category={latestRequest.category}
                    small
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                      {latestRequest.serviceTitle}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                      {latestRequest.customer} ·{" "}
                      {formatDate(latestRequest.preferredDate)} ·{" "}
                      {money(latestRequest.amount)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href="/dashboard/technician/requests"
                      className="inline-flex h-8 items-center rounded-[7px] border border-[#d2ccbc] px-3 text-[11px] font-semibold text-[#27352f] dark:border-white/15 dark:text-white"
                    >
                      Reject
                    </Link>
                    <Link
                      href="/dashboard/technician/requests"
                      className="inline-flex h-8 items-center rounded-[7px] bg-[#3ddc97] px-3 text-[11px] font-semibold text-[#06231b]"
                    >
                      Accept
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-[#d2ccbc] p-4 text-[11.5px] text-[#5f6f68] dark:border-white/15 dark:text-[#9dab9f]">
                  No new requests waiting.
                </p>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-[#e5e1d6] pt-3 text-[11px] dark:border-white/[0.08]">
                <Link
                  href="/dashboard/technician/requests"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                >
                  Open request manager <ArrowRight className="size-3.5" />
                </Link>
                <span className="text-[#87948d]">
                  {stats.totalRequests} total
                </span>
              </div>
            </section>
          </div>

          <div className="grid gap-4 lg:contents">
            <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 lg:col-start-2 lg:row-start-1 dark:border-white/[0.08] dark:bg-[#101a16]">
              <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                <ClipboardList className="size-4 text-[#87948d]" />
                Request pipeline
              </h2>
              <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                All {pipelineTotal} bookings assigned to you
              </p>

              <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
                <div
                  role="img"
                  aria-label={`Request pipeline: ${pipelineTotal} requests`}
                  className="relative size-[150px] shrink-0 rounded-full"
                  style={{ background: `conic-gradient(${gradient})` }}
                >
                  <div className="absolute inset-[20px] flex flex-col items-center justify-center rounded-full bg-white dark:bg-[#101a16]">
                    <span className="font-heading text-[24px] font-extrabold leading-none text-[#0f1a15] dark:text-white">
                      {pipelineTotal}
                    </span>
                    <span className="mt-1 text-[10px] text-[#87948d]">
                      requests
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  {PIPELINE.map((status) => (
                    <div
                      key={status}
                      className="flex items-center justify-between gap-3 text-[11px]"
                    >
                      <span className="flex items-center gap-2 text-[#5f6f68] dark:text-[#9dab9f]">
                        <span
                          className="size-2 rounded-[2px]"
                          style={{ backgroundColor: BOOKING_STATUS_COLOR[status] }}
                        />
                        {BOOKING_STATUS_LABEL[status]}
                      </span>
                      <b className="font-semibold text-[#0f1a15] dark:text-white">
                        {counts[status] ?? 0}
                      </b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-[#e5e1d6] pt-4 dark:border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <p className="text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                    Approval status of your listings
                  </p>
                  <Link
                    href="/dashboard/technician/my-services"
                    className="text-[11.5px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                  >
                    Manage
                  </Link>
                </div>

                <div className="mt-3 grid gap-2.5">
                  <ProgressRow
                    label="Approved"
                    value={stats.approved}
                    total={stats.totalServices}
                    color="#3ddc97"
                  />
                  <ProgressRow
                    label="Pending"
                    value={stats.pendingServices}
                    total={stats.totalServices}
                    color="#f0bb6a"
                  />
                  <ProgressRow
                    label="Rejected"
                    value={stats.rejectedServices}
                    total={stats.totalServices}
                    color="#ff8f82"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 lg:col-start-2 lg:row-start-2 dark:border-white/[0.08] dark:bg-[#101a16]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                    <Star className="size-4 text-[#87948d]" />
                    Your top services
                  </h2>
                  <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                    Ranked by rating and bookings
                  </p>
                </div>
                <Link
                  href="/dashboard/technician/my-services"
                  className="shrink-0 text-[11.5px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                >
                  All {stats.totalServices}
                </Link>
              </div>

              <div className="mt-3 divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
                {topServices.map((service) => (
                  <Link
                    key={service.id}
                    href={
                      service.serviceSlug
                        ? `/services/${service.serviceSlug}`
                        : "/dashboard/technician/my-services"
                    }
                    className="flex items-center gap-3 py-3"
                  >
                    <ServiceThumbnail
                      image={service.coverImage}
                      category={service.category}
                      small
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-[#0f1a15] dark:text-white">
                        {service.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#5f6f68] dark:text-[#9dab9f]">
                        <span className="size-1.5 rounded-full bg-[#3ddc97]" />
                        Approved · {service.rating.toFixed(1)} ·{" "}
                        {service.reviews} reviews
                      </p>
                    </div>
                    <span className="shrink-0 text-[11.5px] font-bold text-[#0f1a15] dark:text-white">
                      {money(service.price)}
                    </span>
                  </Link>
                ))}
                {topServices.length === 0 && (
                  <p className="py-4 text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                    No approved listings yet.{" "}
                    <Link
                      href="/dashboard/technician/add-service"
                      className="font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                    >
                      Add a service
                    </Link>
                    .
                  </p>
                )}
              </div>
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
  tone: "mint" | "amber";
}) {
  return (
    <div className="rounded-2xl border border-[#e5e1d6] bg-white p-4 dark:border-white/[0.08] dark:bg-[#101a16]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
          {label}
        </p>
        <span
          className={`flex size-8 items-center justify-center rounded-[8px] ${
            tone === "amber"
              ? "bg-[#fcf0d7] text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]"
              : "bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]"
          }`}
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#87948d]">{label}</p>
      <p className="mt-1 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
        {value}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[76px] shrink-0 text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
        {label}
      </span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#eef1f5] dark:bg-white/[0.06]">
        <span
          className="block h-full rounded-full"
          style={{
            width: `${Math.max(3, (value / Math.max(total, 1)) * 100)}%`,
            backgroundColor: color,
          }}
        />
      </span>
      <span className="w-4 text-right text-[11px] font-semibold text-[#0f1a15] dark:text-white">
        {value}
      </span>
    </div>
  );
}
