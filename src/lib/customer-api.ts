import type {
  CustomerBooking,
  CustomerPayment,
} from "@/lib/customer-data";
import { apiFetch } from "@/lib/api";

export type CustomerOverview = {
  stats: {
    total: number;
    active: number;
    completed: number;
    spent: number;
    completionRate: number;
    paymentCount: number;
  };
  counts: Record<string, number>;
  active: CustomerBooking | null;
  recent: CustomerBooking[];
  spend: Array<{ label: string; value: number }>;
};

export async function getCustomerOverview() {
  const { data } = await apiFetch<CustomerOverview>(
    "/api/v1/customer/overview",
    { withCookies: true },
  );

  return data;
}

export async function getCustomerBookings() {
  const { data } = await apiFetch<CustomerBooking[]>("/api/v1/bookings", {
    withCookies: true,
    searchParams: { pageSize: 100 },
  });

  return data;
}

export async function getCustomerPayments() {
  const { data } = await apiFetch<CustomerPayment[]>(
    "/api/v1/customer/payments",
    {
      withCookies: true,
      searchParams: { pageSize: 100 },
    },
  );

  return data;
}

export async function getPaymentVerification(sessionId: string) {
  const { data } = await apiFetch<CustomerPayment>(
    "/api/v1/payments/verify",
    {
      withCookies: true,
      searchParams: { session_id: sessionId },
    },
  );

  return data;
}
