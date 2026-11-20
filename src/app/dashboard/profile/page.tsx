import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Info,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getAppRole, requireUser } from "@/lib/authz";
import { ADMIN_STATS } from "@/lib/admin-data";
import { CUSTOMER_PAYMENTS, getCustomerStats, money } from "@/lib/customer-data";
import { getTechnicianStats, TECHNICIAN_PREVIEW } from "@/lib/technician-data";

const ROLE_LABEL = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
} as const;

export default async function ProfilePage() {
  const session = await requireUser();
  const role = getAppRole(session.user);
  const user = session.user;
  const stats = getCustomerStats();
  const techStats = getTechnicianStats();
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
              Update profile
            </h1>
            <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
              Keep your details current. Your name and photo appear in the
              navbar and dashboards.
            </p>
          </div>

          <Link
            href={
              role === "technician" ? "/dashboard/technician" : "/dashboard"
            }
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]"
          >
            <ArrowLeft className="size-4" />
            Back to overview
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <span
                  className="flex size-[74px] items-center justify-center rounded-full bg-[#f6e7c8] bg-cover bg-center text-[20px] font-bold text-[#a86a12]"
                  style={
                    user.image
                      ? { backgroundImage: `url(${user.image})` }
                      : undefined
                  }
                >
                  {!user.image && initials}
                </span>
                <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#0f1a15] text-white dark:border-[#101a16] dark:bg-[#63e6b6] dark:text-[#06231b]">
                  <Camera className="size-3" />
                </span>
              </div>

              <h2 className="mt-3 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                {user.name}
              </h2>
              <p className="mt-0.5 max-w-full truncate text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                {user.email}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#e4f2ec] px-2 py-1 text-[10px] font-semibold text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                  <span className="size-1.5 rounded-full bg-current" />
                  {ROLE_LABEL[role]}
                </span>
                {(role === "technician" || role === "admin") && (
                  <span className="inline-flex items-center rounded-[5px] bg-[#0f1a15] px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.06em] text-white dark:bg-white dark:text-[#0f1a15]">
                    Pro
                  </span>
                )}
              </div>
            </div>

            {role === "customer" ? (
              <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[#e5e1d6] py-4 text-center dark:border-white/[0.08]">
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {stats.total}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Bookings</p>
                </div>
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {CUSTOMER_PAYMENTS.length}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Paid</p>
                </div>
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {money(stats.spent)}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Spent</p>
                </div>
              </div>
            ) : role === "technician" ? (
              <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[#e5e1d6] py-4 text-center dark:border-white/[0.08]">
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {techStats.totalServices}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Services</p>
                </div>
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {TECHNICIAN_PREVIEW.jobs}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Jobs</p>
                </div>
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {TECHNICIAN_PREVIEW.rating.toFixed(1)} ★
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Rating</p>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[#e5e1d6] py-4 text-center dark:border-white/[0.08]">
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {ADMIN_STATS.totalUsers}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Users</p>
                </div>
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {ADMIN_STATS.listings}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Listings</p>
                </div>
                <div>
                  <p className="font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {money(ADMIN_STATS.revenue)}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">Revenue</p>
                </div>
              </div>
            )}

            <dl className="mt-4 grid gap-3 text-[11px]">
              <InfoRow
                icon={<MapPin className="size-3.5" />}
                label="Area"
                value={user.area || "Not set"}
              />
              <InfoRow
                icon={<Phone className="size-3.5" />}
                label="Phone"
                value={user.phone || "Not set"}
              />
              <InfoRow
                icon={<CalendarDays className="size-3.5" />}
                label="Joined"
                value={joined}
              />
              <InfoRow
                icon={<ShieldCheck className="size-3.5" />}
                label="Status"
                value="Verified"
              />
            </dl>

            <p className="mt-4 flex items-start gap-2 rounded-[9px] border border-[#bfe7d5] bg-[#e9f6ef] p-3 text-[10.5px] leading-[1.5] text-[#0e6b54] dark:border-[#1b4b39] dark:bg-[#0d231a] dark:text-[#63e6b6]">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              Profile changes appear instantly in the navbar — no re-login
              needed.
            </p>
          </aside>

          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              image: user.image,
              phone: user.phone,
              area: user.area,
              bio: user.bio,
            }}
            role={role}
          />
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-1.5 text-[#5f6f68] dark:text-[#9dab9f]">
        <span className="text-[#87948d]">{icon}</span>
        {label}
      </dt>
      <dd className="max-w-[140px] truncate text-right font-medium text-[#27352f] dark:text-[#cfdbd3]">
        {value}
      </dd>
    </div>
  );
}
