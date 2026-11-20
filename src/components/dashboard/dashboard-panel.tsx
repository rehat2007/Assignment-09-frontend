import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutGrid,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { AppRole } from "@/lib/roles";

type DashboardItem = {
  title: string;
  text: string;
  icon: LucideIcon;
};

const ROLE_LABEL: Record<AppRole, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export function DashboardPanel({
  user,
  role,
  eyebrow,
  heading,
  intro,
  items,
}: {
  user: { name: string; email: string; image?: string | null };
  role: AppRole;
  eyebrow: string;
  heading: string;
  intro: string;
  items: DashboardItem[];
}) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-10">
        <div className="flex flex-col gap-5 border-b border-[#e5e1d6] pb-7 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
          <div>
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              {eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.05] tracking-[-0.038em] text-[#0f1a15] sm:text-[2.4rem] dark:text-white">
              {heading}
            </h1>
            <p className="mt-2 max-w-[58ch] text-[14px] leading-[1.65] text-[#5f6f68] dark:text-[#9dab9f]">
              {intro}
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-[#e5e1d6] bg-white p-3 pr-5 sm:w-auto dark:border-white/[0.08] dark:bg-[#101a16]">
            <span
              className="size-11 shrink-0 rounded-full bg-[#f6e7c8] bg-cover bg-center text-[13px] font-bold text-[#a86a12]"
              style={user.image ? { backgroundImage: `url(${user.image})` } : undefined}
            >
              {!user.image && (
                <span className="flex size-full items-center justify-center">
                  {initials}
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[#0f1a15] dark:text-white">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                {user.email}
              </p>
            </div>
            <span className="flex h-6 shrink-0 items-center gap-1 rounded-[6px] bg-[#e4f2ec] px-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
              <ShieldCheck className="size-3" />
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, text, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]"
            >
              <span className="flex size-10 items-center justify-center rounded-[11px] bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                <Icon className="size-5" strokeWidth={1.9} />
              </span>
              <h2 className="mt-4 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                {title}
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                {text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-dashed border-[#d2ccbc] bg-[#fbfaf6] p-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/15 dark:bg-white/[0.02]">
          <div>
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0f1a15] dark:text-white">
              <BadgeCheck className="size-4 text-[#0e6b54] dark:text-[#43d3ab]" />
              Role-based access is active
            </p>
            <p className="mt-1 max-w-[70ch] text-[12px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
              This page checks your Better Auth session and role on the server
              before rendering. Other roles are redirected automatically.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[10px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#f6f4ee] dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/[0.06]"
          >
            Browse services
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export function CustomerDashboardItems(): DashboardItem[] {
  return [
    {
      title: "My bookings",
      text: "Track requested, accepted and completed repairs from one place.",
      icon: ClipboardList,
    },
    {
      title: "Payments",
      text: "Review completed jobs and pay only after the work is approved.",
      icon: CreditCard,
    },
    {
      title: "Saved services",
      text: "Keep the repairs you book often within easy reach.",
      icon: LayoutGrid,
    },
  ];
}

export function TechnicianDashboardItems(): DashboardItem[] {
  return [
    {
      title: "Assigned jobs",
      text: "Accept requests, update status and set the final amount.",
      icon: Wrench,
    },
    {
      title: "My listings",
      text: "Manage your services, pricing and availability.",
      icon: BadgeCheck,
    },
    {
      title: "Payouts",
      text: "See completed jobs and the payments released to you.",
      icon: Wallet,
    },
  ];
}

export function AdminDashboardItems(): DashboardItem[] {
  return [
    {
      title: "User management",
      text: "Review accounts and manage customer, technician and admin roles.",
      icon: Users,
    },
    {
      title: "Listing approvals",
      text: "Approve new services before they appear on the public site.",
      icon: ShieldCheck,
    },
    {
      title: "Platform activity",
      text: "Monitor bookings, payments and recent account activity.",
      icon: CalendarDays,
    },
  ];
}
