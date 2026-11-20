import type {
  TechnicianRequest,
  TechnicianService,
} from "@/lib/technician-data";
import { apiFetch } from "@/lib/api";

export type TechnicianOverview = {
  stats: {
    totalServices: number;
    approved: number;
    pendingServices: number;
    rejectedServices: number;
    availableServices: number;
    pendingRequests: number;
    totalRequests: number;
    completed: number;
    paidJobs: number;
    earnings: number;
    averageJob: number;
    rating: number;
  };
  pipeline: Record<string, number>;
  earnings: Array<{ label: string; value: number }>;
  topServices: TechnicianService[];
  latestRequest: TechnicianRequest | null;
  plan: "free" | "pro";
};

export async function getTechnicianOverview() {
  const { data } = await apiFetch<TechnicianOverview>(
    "/api/v1/technician/overview",
    { withCookies: true },
  );

  return data;
}

export async function getTechnicianServices() {
  const { data } = await apiFetch<TechnicianService[]>(
    "/api/v1/technician/services",
    {
      withCookies: true,
      searchParams: { pageSize: 100 },
    },
  );

  return data;
}

export async function getTechnicianRequests() {
  const { data } = await apiFetch<TechnicianRequest[]>(
    "/api/v1/technician/requests",
    {
      withCookies: true,
      searchParams: { pageSize: 100 },
    },
  );

  return data;
}
