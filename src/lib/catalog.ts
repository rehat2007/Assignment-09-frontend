import type {
  Service,
  ServiceCategory,
  ServiceMode,
} from "@/lib/services";
import { apiFetch, ApiRequestError } from "@/lib/api";

export type ServiceSort = "newest" | "price-asc" | "price-desc" | "rating";

export type ServiceSummary = Service;

export type TechnicianProfile = {
  id: string;
  name: string;
  bio: string;
  area: string;
  rating: number;
  jobs: number;
  plan: "free" | "pro";
  repliesIn: string;
  image: string | null;
};

export type ServiceDetail = Service & {
  includes: string[];
  warranty: string;
  availabilityNote: string;
  technicianProfile: TechnicianProfile;
};

export type ServiceReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  at: string;
};

export type CategorySummary = {
  name: ServiceCategory;
  count: number;
};

export type CatalogMeta = {
  categories: CategorySummary[];
  modes: ServiceMode[];
  pageSize: number;
  maxPageSize: number;
  stats: {
    services: number;
    technicians: number;
  };
  flags: Record<string, boolean>;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ListServicesParams = {
  q?: string;
  category?: string;
  mode?: string;
  sort?: ServiceSort;
  page?: number;
  pageSize?: number;
};

function toPaginationMeta(meta: Record<string, unknown>): PaginationMeta {
  return {
    page: Number(meta.page ?? 1),
    pageSize: Number(meta.pageSize ?? 9),
    total: Number(meta.total ?? 0),
    totalPages: Math.max(1, Number(meta.totalPages ?? 1)),
  };
}

export async function getCatalogMeta(): Promise<CatalogMeta> {
  const { data } = await apiFetch<CatalogMeta>("/api/v1/meta");
  return data;
}

export async function getServices(params: ListServicesParams = {}) {
  const { data, meta } = await apiFetch<ServiceSummary[]>("/api/v1/services", {
    searchParams: {
      q: params.q,
      category: params.category,
      mode: params.mode,
      sort: params.sort,
      page: params.page,
      pageSize: params.pageSize,
    },
  });

  return {
    data,
    meta: toPaginationMeta(meta),
  };
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceDetail | null> {
  try {
    const { data } = await apiFetch<ServiceDetail>(
      `/api/v1/services/${encodeURIComponent(slug)}`,
    );

    return data;
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 404 || error.status === 422)
    ) {
      return null;
    }

    throw error;
  }
}

export async function getServiceReviews(
  slug: string,
  params: { page?: number; pageSize?: number } = {},
) {
  const { data, meta } = await apiFetch<ServiceReview[]>(
    `/api/v1/services/${encodeURIComponent(slug)}/reviews`,
    {
      searchParams: {
        page: params.page,
        pageSize: params.pageSize,
      },
    },
  );

  return {
    data,
    meta: toPaginationMeta(meta),
  };
}
