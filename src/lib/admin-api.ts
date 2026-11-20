import type {
  AdminBooking,
  AdminPayment,
  AdminService,
  AdminUser,
} from "@/lib/admin-data";
import { apiFetch } from "@/lib/api";

export type AdminOverview = {
  stats: {
    totalUsers: number;
    technicians: number;
    proTechnicians: number;
    customers: number;
    admins: number;
    pendingServices: number;
    revenue: number;
    avgTransaction: number;
    thisMonth: number;
    thisMonthCount: number;
    payments: number;
    techniciansPaid: number;
    newUsers: number;
    listings: number;
    pipelineValue: number;
  };
  revenueSeries: Array<{ label: string; value: number }>;
  roleSummary: Array<{ label: string; value: number; color: string }>;
  categoryJobs: Array<{ label: string; value: number }>;
  pendingServices: AdminService[];
  recentPayments: AdminPayment[];
  bookingCounts: Record<string, number>;
};

export async function getAdminOverview() {
  const { data } = await apiFetch<AdminOverview>("/api/v1/admin/overview", {
    withCookies: true,
  });

  return data;
}

export async function getAdminUsers() {
  const { data } = await apiFetch<AdminUser[]>("/api/v1/admin/users", {
    withCookies: true,
    searchParams: { pageSize: 100 },
  });

  return data;
}

export async function getAdminServices() {
  const { data } = await apiFetch<AdminService[]>("/api/v1/admin/services", {
    withCookies: true,
    searchParams: { pageSize: 100 },
  });

  return data;
}

export async function getAdminBookings() {
  const { data } = await apiFetch<AdminBooking[]>("/api/v1/admin/bookings", {
    withCookies: true,
    searchParams: { pageSize: 100 },
  });

  return data;
}

export async function getAdminPayments() {
  const { data } = await apiFetch<AdminPayment[]>("/api/v1/admin/payments", {
    withCookies: true,
    searchParams: { pageSize: 100 },
  });

  return data;
}
