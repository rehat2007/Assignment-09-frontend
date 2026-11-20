"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  ClipboardList,
  CreditCard,
  House,
  LayoutGrid,
  LogOut,
  Menu,
  Plus,
  Receipt,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { Brand } from "@/components/brand";
import { ProfileMenu } from "@/components/profile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import type { AppRole } from "@/lib/roles";
import { PENDING_SERVICES } from "@/lib/admin-data";
import {
  TECHNICIAN_REQUESTS,
  TECHNICIAN_SERVICES,
} from "@/lib/technician-data";

type NavItem = { label: string; href: string; icon: LucideIcon; count?: number };

const CUSTOMER_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard/customer", icon: LayoutGrid },
  { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
  { label: "Payment History", href: "/dashboard/customer/payments", icon: Receipt },
];

const TECHNICIAN_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard/technician", icon: LayoutGrid },
  { label: "Add a Service", href: "/dashboard/technician/add-service", icon: Plus },
  { label: "My Services", href: "/dashboard/technician/my-services", icon: Wrench },
  {
    label: "Manage Requests",
    href: "/dashboard/technician/requests",
    icon: ClipboardList,
    count: TECHNICIAN_REQUESTS.filter((request) => request.status === "requested")
      .length,
  },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutGrid },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  {
    label: "Service Approval",
    href: "/dashboard/admin/services",
    icon: ShieldCheck,
    count: PENDING_SERVICES.length,
  },
  { label: "All Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
];

const ACCOUNT_NAV: NavItem[] = [
  { label: "Update Profile", href: "/dashboard/profile", icon: UserRound },
  { label: "Back to website", href: "/", icon: House },
];

const WORKSPACES: Record<
  AppRole,
  { label: string; nav: NavItem[]; promo: { title: string; text: string; href: string; cta: string } }
> = {
  customer: {
    label: "Customer",
    nav: CUSTOMER_NAV,
    promo: {
      title: "Need another repair?",
      text: "All services are approved by our team and priced up front.",
      href: "/services",
      cta: "Browse services",
    },
  },
  technician: {
    label: "Technician",
    nav: TECHNICIAN_NAV,
    promo: {
      title: "Keep your work coming in",
      text: "Update your listings and respond to requests from one place.",
      href: "/dashboard/technician/my-services",
      cta: "My services",
    },
  },
  admin: {
    label: "Admin",
    nav: ADMIN_NAV,
    promo: {
      title: "Keep the marketplace clean",
      text: "Review new listings before they reach customers.",
      href: "/dashboard/admin/services",
      cta: "Review listings",
    },
  },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getWorkspace(pathname: string, role: AppRole): AppRole {
  if (pathname.startsWith("/dashboard/customer")) return "customer";
  if (pathname.startsWith("/dashboard/technician")) return "technician";
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  return role;
}

export function DashboardShell({
  user,
  role,
  children,
}: {
  user: {
    name: string;
    email: string;
    image?: string | null;
    area?: string | null;
  };
  role: AppRole;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const workspaceKey = getWorkspace(pathname, role);
  const workspace = WORKSPACES[workspaceKey];
  const allItems = [...workspace.nav, ...ACCOUNT_NAV];

  const exact = allItems.find((item) => item.href === pathname);
  const prefix = allItems
    .filter((item) => pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  const current = exact ?? prefix;
  const pageTitle =
    current?.label ??
    (pathname === "/dashboard/profile" ? "Update profile" : "Overview");

  function isActive(item: NavItem) {
    return (
      item.href === pathname ||
      (current?.href === item.href && pathname.startsWith(`${item.href}/`))
    );
  }

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setMobileOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <div className="min-h-dvh bg-[#f6f4ee] lg:flex dark:bg-[#080f0c]">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[282px] flex-col overflow-y-auto border-r border-[#e5e1d6] bg-[#fbfaf6] px-4 py-5 transition-transform duration-200 lg:sticky lg:inset-y-auto lg:top-0 lg:h-screen lg:translate-x-0 dark:border-white/[0.07] dark:bg-[#0a0f0c]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close dashboard menu"
            className="flex size-9 items-center justify-center rounded-[9px] text-[#5f6f68] hover:bg-black/[0.04] lg:hidden dark:text-[#9dab9f] dark:hover:bg-white/[0.06]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#e5e1d6] bg-white p-2.5 dark:border-white/[0.08] dark:bg-[#101a16]">
          <span
            className="size-10 shrink-0 rounded-full bg-[#f6e7c8] bg-cover bg-center text-[12px] font-bold text-[#a86a12]"
            style={user.image ? { backgroundImage: `url(${user.image})` } : undefined}
          >
            {!user.image && (
              <span className="flex size-full items-center justify-center">
                {initials(user.name)}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
              {user.name}
            </p>
            <p className="mt-0.5 truncate text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
              {user.area || "Dhaka"}
            </p>
          </div>
          {workspaceKey === "technician" && (
            <span className="ml-auto shrink-0 rounded-[5px] bg-[#0e6b54] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.06em] text-white dark:bg-[#63e6b6] dark:text-[#06231b]">
              Pro
            </span>
          )}
        </div>

        <p className="mt-6 px-2 text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#87948d]">
          {workspace.label} workspace
        </p>

        <nav aria-label={`${workspace.label} workspace`} className="mt-2 grid gap-1">
          {workspace.nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-10 items-center gap-2.5 rounded-[9px] px-3 text-[13px] transition-colors",
                  active
                    ? "bg-[#e4f2ec] font-semibold text-[#0e6b54] dark:bg-[#0e2a20] dark:text-[#63e6b6]"
                    : "font-medium text-[#5f6f68] hover:bg-black/[0.04] hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:bg-white/[0.04] dark:hover:text-white",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#0e6b54] dark:bg-[#43d3ab]" />
                )}
                <Icon className="size-4 shrink-0" />
                {item.label}
                {item.count ? (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#fcf0d7] px-1.5 text-[9.5px] font-bold text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]">
                    {item.count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <p className="mt-6 px-2 text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#87948d]">
          Account
        </p>

        <nav aria-label="Account" className="mt-2 grid gap-1">
          {ACCOUNT_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2.5 rounded-[9px] px-3 text-[13px] transition-colors",
                  active
                    ? "bg-[#e4f2ec] font-semibold text-[#0e6b54] dark:bg-[#0e2a20] dark:text-[#63e6b6]"
                    : "font-medium text-[#5f6f68] hover:bg-black/[0.04] hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:bg-white/[0.04] dark:hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          {workspaceKey === "technician" ? (
            <div className="rounded-xl border border-[#bfe7d5] bg-[#e9f6ef] p-3.5 dark:border-[#1b4b39] dark:bg-[#0d231a]">
              <span className="inline-flex rounded-[4px] bg-[#0e6b54] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-white dark:bg-[#63e6b6] dark:text-[#06231b]">
                Pro plan
              </span>
              <p className="mt-2 text-[12px] font-bold text-[#0e6b54] dark:text-[#63e6b6]">
                Unlimited listings
              </p>
              <p className="mt-1 text-[10.5px] leading-[1.5] text-[#5f6f68] dark:text-[#9dab9f]">
                Your services carry the Verified Pro badge.{" "}
                {TECHNICIAN_SERVICES.length} active.
              </p>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileOpen(false)}
                className="mt-3 flex h-9 items-center justify-center rounded-[7px] bg-[#0e6b54] text-[11.5px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
              >
                Manage plan
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-[#bfe7d5] bg-[#e9f6ef] p-3.5 dark:border-[#1b4b39] dark:bg-[#0d231a]">
              <p className="text-[12px] font-bold text-[#0e6b54] dark:text-[#63e6b6]">
                {workspace.promo.title}
              </p>
              <p className="mt-1 text-[10.5px] leading-[1.5] text-[#5f6f68] dark:text-[#9dab9f]">
                {workspace.promo.text}
              </p>
              <Link
                href={workspace.promo.href}
                onClick={() => setMobileOpen(false)}
                className="mt-3 flex h-9 items-center justify-center rounded-[7px] bg-[#0e6b54] text-[11.5px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
              >
                {workspace.promo.cta}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 flex h-10 w-full items-center gap-2.5 rounded-[9px] px-3 text-left text-[13px] font-semibold text-[#5f6f68] transition-colors hover:bg-black/[0.04] hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:bg-white/[0.04] dark:hover:text-white"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-[#e5e1d6] bg-[#f6f4ee]/90 backdrop-blur-md dark:border-white/[0.07] dark:bg-[#080f0c]/90">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open dashboard menu"
              className="flex size-9 shrink-0 items-center justify-center rounded-[9px] text-[#5f6f68] hover:bg-black/[0.04] lg:hidden dark:text-[#9dab9f] dark:hover:bg-white/[0.06]"
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10.5px] text-[#87948d]">
                <span className="capitalize">{workspace.label}</span>
                <ChevronRight className="size-3" />
                <span className="truncate">{pageTitle}</span>
              </div>
              <p className="truncate text-[15px] font-bold text-[#0f1a15] dark:text-white">
                {pageTitle}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                aria-label="Notifications"
                title="Notifications"
                className="relative flex size-10 items-center justify-center rounded-[11px] text-[#5f6f68] transition-colors hover:bg-black/[0.04] dark:text-[#9dab9f] dark:hover:bg-white/[0.06]"
              >
                <Bell className="size-[18px]" />
              </button>
              <ThemeToggle />
              <ProfileMenu
                key={pathname}
                user={user}
                role={role}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </header>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
