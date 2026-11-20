import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { AdminExportButton } from "@/components/admin/admin-export-button";
import { CategoryTile } from "@/components/customer/category-tile";
import { DashboardPageError } from "@/components/dashboard/dashboard-page-error";
import { getAdminOverview, type AdminOverview } from "@/lib/admin-api";
import { requireRole } from "@/lib/authz";
import { formatDate, money } from "@/lib/customer-data";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);

  let overview: AdminOverview;

  try {
    overview = await getAdminOverview();
  } catch {
    return (
      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="mx-auto max-w-[1264px] px-6 py-8">
          <DashboardPageError
            title="We could not load the platform overview"
            description="Platform statistics could not be loaded. Please try again."
            retryHref="/dashboard/admin"
          />
        </div>
      </main>
    );
  }

  const stats = overview.stats;
  const roleSummary = overview.roleSummary;
  const pendingServices = overview.pendingServices;
  const recentPayments = overview.recentPayments;
  const revenueSeries = overview.revenueSeries;
  const categoryJobs = overview.categoryJobs;
  const roleTotal = roleSummary.reduce(
    (total, role) => total + role.value,
    0,
  );
  const roleGradient =
    roleSummary
      .reduce<{
        stops: string[];
        cursor: number;
      }>(
        (result, role) => {
          if (!role.value) return result;
          const end = result.cursor + (role.value / roleTotal) * 100;
          return {
            cursor: end,
            stops: [...result.stops, `${role.color} ${result.cursor}% ${end}%`],
          };
        },
        { stops: [], cursor: 0 },
      )
      .stops.join(", ") || "#e5e1d6 0% 100%";
  const maxJobs = Math.max(...categoryJobs.map((item) => item.value), 1);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
              Platform overview
            </h1>
            <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
              Users, listings, jobs and money — all in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/admin/services"
              className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]"
            >
              <ShieldCheck className="size-4" />
              Review {stats.pendingServices} pending
            </Link>
            <AdminExportButton
              filename="fixmate-platform-report.csv"
              rows={[
                ["Metric", "Value"],
                ["Total users", String(stats.totalUsers)],
                ["Technicians", String(stats.technicians)],
                ["Pending services", String(stats.pendingServices)],
                ["Total revenue", String(stats.revenue)],
                ["Transactions", String(stats.payments)],
                ["Bookings", String(stats.listings)],
              ]}
            />
          </div>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <AdminStat
            label="Total users"
            value={String(stats.totalUsers)}
            note={`+${stats.newUsers} this month`}
            icon={<Users className="size-4" />}
            tone="mint"
          />
          <AdminStat
            label="Technicians"
            value={String(stats.technicians)}
            note={`${stats.proTechnicians} on Pro plan`}
            icon={<Wrench className="size-4" />}
            tone="indigo"
          />
          <AdminStat
            label="Pending services"
            value={String(stats.pendingServices)}
            note="Awaiting approval"
            icon={<ShieldCheck className="size-4" />}
            tone="amber"
          />
          <AdminStat
            label="Total revenue"
            value={money(stats.revenue)}
            note="Verified payments"
            icon={<Wallet className="size-4" />}
            tone="mint"
            spark={<Sparkline series={revenueSeries} />}
          />
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <section className="min-w-0 rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                  <TrendingUp className="size-4 text-[#87948d]" />
                  Revenue
                </h2>
                <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  Completed payments, last 6 months
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] bg-[#e4f2ec] px-2.5 py-1 text-[10px] font-semibold text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                <span className="size-1.5 rounded-full bg-current" />
                {money(stats.revenue)} lifetime
              </span>
            </div>

            <div className="-mx-1 mt-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <RevenueChart series={revenueSeries} />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-4 border-t border-[#e5e1d6] pt-4 sm:grid-cols-4 dark:border-white/[0.08]">
              <MiniStat label="Payments" value={String(stats.payments)} />
              <MiniStat
                label="Avg. transaction"
                value={money(stats.avgTransaction)}
              />
              <MiniStat
                label="This month"
                value={money(stats.thisMonth)}
              />
              <Link
                href="/dashboard/admin/transactions"
                className="flex items-center justify-end gap-1.5 self-end text-[11.5px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
              >
                All transactions <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
            <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
              <Users className="size-4 text-[#87948d]" />
              Users by role
            </h2>
            <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
              {roleTotal} accounts on the platform
            </p>

            <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
              <div
                role="img"
                aria-label={`${roleTotal} accounts by role`}
                className="relative size-[150px] shrink-0 rounded-full"
                style={{ background: `conic-gradient(${roleGradient})` }}
              >
                <div className="absolute inset-[20px] flex flex-col items-center justify-center rounded-full bg-white dark:bg-[#101a16]">
                  <span className="font-heading text-[24px] font-extrabold leading-none text-[#0f1a15] dark:text-white">
                    {roleTotal}
                  </span>
                  <span className="mt-1 text-[10px] text-[#87948d]">
                    accounts
                  </span>
                </div>
              </div>

              <div className="w-full space-y-3">
                {roleSummary.map((role) => (
                  <div
                    key={role.label}
                    className="flex items-center justify-between gap-3 text-[11px]"
                  >
                    <span className="flex items-center gap-2 text-[#5f6f68] dark:text-[#9dab9f]">
                      <span
                        className="size-2 rounded-[2px]"
                        style={{ backgroundColor: role.color }}
                      />
                      {role.label}
                    </span>
                    <b className="font-semibold text-[#0f1a15] dark:text-white">
                      {role.value}
                    </b>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-[#e5e1d6] pt-4 dark:border-white/[0.08]">
              <div className="flex items-center justify-between">
                <p className="text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  Bookings by category
                </p>
                <Link
                  href="/dashboard/admin/bookings"
                  className="text-[11.5px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                >
                  Jobs
                </Link>
              </div>

              <div className="mt-3 grid gap-2.5">
                {categoryJobs.slice(0, 4).map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-[86px] shrink-0 truncate text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                      {item.label}
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#eef1f5] dark:bg-white/[0.06]">
                      <span
                        className="block h-full rounded-full bg-[#3ddc97]"
                        style={{
                          width: `${Math.max(
                            4,
                            (item.value / maxJobs) * 100,
                          )}%`,
                        }}
                      />
                    </span>
                    <span className="w-4 text-right text-[11px] font-semibold text-[#0f1a15] dark:text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
                {categoryJobs.length === 0 && (
                  <p className="text-[11px] text-[#87948d]">
                    No bookings yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                  <ShieldCheck className="size-4 text-[#87948d]" />
                  Awaiting approval
                </h2>
                <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  These listings are invisible to customers
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] bg-[#fcf0d7] px-2.5 py-1 text-[10px] font-semibold text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]">
                <span className="size-1.5 rounded-full bg-current" />
                {stats.pendingServices} pending
              </span>
            </div>

            <div className="mt-2 divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
              {pendingServices.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CategoryTile category={service.category} small />
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                        {service.title}
                      </p>
                      <p className="mt-0.5 truncate text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                        {service.technician} · {service.category} ·{" "}
                        {money(service.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href="/dashboard/admin/services"
                      className="inline-flex h-8 items-center rounded-[7px] border border-[#d2ccbc] px-3 text-[11px] font-semibold text-[#27352f] dark:border-white/15 dark:text-white"
                    >
                      Reject
                    </Link>
                    <Link
                      href="/dashboard/admin/services"
                      className="inline-flex h-8 items-center rounded-[7px] bg-[#3ddc97] px-3 text-[11px] font-semibold text-[#06231b]"
                    >
                      Approve
                    </Link>
                  </div>
                </div>
              ))}
              {pendingServices.length === 0 && (
                <p className="py-4 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  No listings awaiting approval.
                </p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#e5e1d6] pt-3 text-[11px] dark:border-white/[0.08]">
              <Link
                href="/dashboard/admin/services"
                className="inline-flex items-center gap-1.5 font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
              >
                Review all listings <ArrowRight className="size-3.5" />
              </Link>
              <span className="text-[#87948d]">
                {stats.listings} total
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                  <ClipboardList className="size-4 text-[#87948d]" />
                  Recent transactions
                </h2>
                <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  Newest payments first
                </p>
              </div>
              <Link
                href="/dashboard/admin/transactions"
                className="shrink-0 text-[11.5px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
              >
                All
              </Link>
            </div>

            <div className="mt-2 divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-start gap-2.5 py-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f6e7c8] text-[9px] font-bold text-[#a86a12]">
                    {initials(payment.customer)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold text-[#0f1a15] dark:text-white">
                      {payment.customer}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-[#87948d]">
                      {formatDate(payment.paidAt)} · {payment.title}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-[#87948d]">
                      {payment.technician}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11.5px] font-bold text-[#0f1a15] dark:text-white">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {recentPayments.length === 0 && (
                <p className="py-4 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  No payments yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
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

function AdminStat({
  label,
  value,
  note,
  icon,
  tone,
  spark,
}: {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  tone: "mint" | "indigo" | "amber";
  spark?: ReactNode;
}) {
  const tones = {
    mint: "bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]",
    indigo:
      "bg-[#ecebff] text-[#4f46e5] dark:bg-[#1c1a3a] dark:text-[#a9a4ff]",
    amber:
      "bg-[#fcf0d7] text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]",
  };

  return (
    <div className="rounded-2xl border border-[#e5e1d6] bg-white p-4 dark:border-white/[0.08] dark:bg-[#101a16]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
          {label}
        </p>
        <span
          className={`flex size-8 items-center justify-center rounded-[8px] ${tones[tone]}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-heading text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#0f1a15] dark:text-white">
          {value}
        </p>
        {spark}
      </div>
      <p className="mt-3 text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
        {note}
      </p>
    </div>
  );
}

function Sparkline({
  series,
}: {
  series: Array<{ label: string; value: number }>;
}) {
  const max = Math.max(...series.map((item) => item.value), 1);
  const points = series.map((item, index) => {
    const x = (index / Math.max(series.length - 1, 1)) * 66;
    const y = 22 - (item.value / max) * 20;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 66 24"
      className="h-6 w-[66px] text-[#3ddc97] dark:text-[#63e6b6]"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RevenueChart({
  series,
}: {
  series: Array<{ label: string; value: number }>;
}) {
  const width = 640;
  const height = 260;
  const left = 44;
  const right = 12;
  const top = 14;
  const bottom = 34;
  const maxValue = Math.ceil(
    Math.max(...series.map((item) => item.value), 1) / 78,
  ) * 78;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
    Math.round(maxValue * ratio),
  );
  const x = (index: number) =>
    left +
    (index / Math.max(series.length - 1, 1)) *
      (width - left - right);
  const y = (value: number) =>
    top + (1 - value / maxValue) * (height - top - bottom);

  const points = series.map((item, index) => ({
    x: x(index),
    y: y(item.value),
    label: item.label,
    value: item.value,
  }));
  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const area = `${line} L${points[points.length - 1].x},${height - bottom} L${points[0].x},${height - bottom} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full min-w-[520px] text-[#2fae7f] dark:text-[#63e6b6]"
      role="img"
      aria-label={`Revenue for the last 6 months: ${series.map(
        (item) => `${item.label} ${money(item.value)}`,
      ).join(", ")}`}
    >
      <defs>
        <linearGradient id="admin-revenue-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={left}
            x2={width - right}
            y1={y(tick)}
            y2={y(tick)}
            className="stroke-[#e5e1d6] dark:stroke-white/10"
            strokeDasharray="4 5"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={left - 8}
            y={y(tick) + 3.5}
            textAnchor="end"
            className="fill-[#87948d] text-[10px]"
          >
            {money(tick)}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#admin-revenue-area)" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {points.map((point) => (
        <circle
          key={point.label}
          cx={point.x}
          cy={point.y}
          r="3.6"
          fill="#f6f4ee"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        >
          <title>{`${point.label}: ${money(point.value)}`}</title>
        </circle>
      ))}

      {points.map((point) => (
        <text
          key={`label-${point.label}`}
          x={point.x}
          y={height - 10}
          textAnchor="middle"
          className="fill-[#87948d] text-[10px]"
        >
          {point.label}
        </text>
      ))}
    </svg>
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
