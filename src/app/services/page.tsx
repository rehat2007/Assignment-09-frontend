import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  House,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { HomeMotion } from "@/components/home-motion";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { getCatalogMeta, getServices } from "@/lib/catalog";
import { CATEGORY_ICONS } from "@/lib/service-styles";

export const metadata: Metadata = {
  title: "Browse repair services — FixMate",
  description:
    "Approved, available repair services from verified technicians. Search, filter and sort by price.",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const;

type Sort = (typeof SORT_OPTIONS)[number]["value"];

type SearchValues = {
  q?: string | string[];
  category?: string | string[];
  mode?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

type Props = {
  searchParams: Promise<SearchValues>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export default async function ServicesPage({ searchParams }: Props) {
  const params = await searchParams;

  const q = first(params.q).trim().slice(0, 100);
  const rawCategory = first(params.category);
  const rawMode = first(params.mode);
  const rawSort = first(params.sort);
  const rawPage = first(params.page);

  const meta = await getCatalogMeta();

  const category =
    meta.categories.find(({ name }) => name === rawCategory)?.name ?? "";
  const mode = meta.modes.find((value) => value === rawMode) ?? "";
  const sort: Sort = SORT_OPTIONS.some((option) => option.value === rawSort)
    ? (rawSort as Sort)
    : "newest";
  const page = Math.max(1, Math.floor(Number(rawPage) || 1));

  const result = await getServices({
    q,
    category,
    mode,
    sort,
    page,
    pageSize: meta.pageSize,
  });

  const shown = result.data;
  const total = result.meta.total;
  const pages = Math.max(1, result.meta.totalPages);
  const current = result.meta.page;
  const hasFilters = Boolean(q || category || mode || sort !== "newest");
  const serviceCount = meta.stats.services;

  function hrefFor(
    overrides: Partial<{
      q: string;
      category: string;
      mode: string;
      sort: string;
      page: number;
    }>,
  ) {
    const next = { q, category, mode, sort, page: 1, ...overrides };
    const nextParams = new URLSearchParams();

    if (next.q) nextParams.set("q", next.q);
    if (next.category) nextParams.set("category", next.category);
    if (next.mode) nextParams.set("mode", next.mode);
    if (next.sort !== "newest") nextParams.set("sort", next.sort);
    if (next.page > 1) nextParams.set("page", String(next.page));

    const query = nextParams.toString();
    return query ? `/services?${query}` : "/services";
  }

  const techCount = meta.stats.technicians;

  return (
    <>
      <HomeMotion />

      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <header className="border-b border-[#e5e1d6] bg-[#fbfaf6] dark:border-white/[0.08] dark:bg-[#0a1410]">
          <div className="mx-auto flex max-w-[1264px] flex-col gap-8 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
            <div data-reveal>
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-[12px] text-[#87948d]"
              >
                <Link
                  href="/"
                  className="transition-colors hover:text-[#0f1a15] dark:hover:text-white"
                >
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span className="text-[#27352f] dark:text-[#cfdbd3]">
                  Services
                </span>
              </nav>

              <h1 className="mt-3 font-heading text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0f1a15] sm:text-[2.7rem] dark:text-white">
                Browse repair services
              </h1>

              <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                Approved, available services from verified technicians. Search,
                filter by category or service mode, and sort by price.
              </p>
            </div>

            <div className="flex w-full justify-between gap-6 border-t border-[#e5e1d6] pt-5 sm:w-auto sm:justify-start sm:border-0 sm:pt-0 dark:border-white/[0.08]">
              <Stat value={serviceCount} label="Live services" />
              <Stat value={techCount} label="Verified technicians" />
              <Stat value={meta.categories.length} label="Categories" />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1264px] px-6 pb-16">
          <div data-reveal className="mb-6 mt-7 flex flex-col gap-3.5">
            <form
              action="/services"
              method="get"
              role="search"
              className="flex flex-wrap items-center gap-3"
            >
              <input type="hidden" name="category" value={category} />
              <input type="hidden" name="mode" value={mode} />

              <div className="relative min-w-[240px] flex-1">
                <Search className="pointer-events-none absolute left-[13px] top-1/2 size-[17px] -translate-y-1/2 text-[#87948d]" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  maxLength={100}
                  placeholder="Search services or areas…"
                  aria-label="Search services"
                  className="h-11 w-full rounded-[11px] border border-[#e5e1d6] bg-white py-0 pl-[39px] pr-3.5 text-[14px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 dark:border-[#24332c] dark:bg-[#101a16] dark:text-white dark:focus:border-[#43d3ab]"
                />
              </div>

              <div className="relative min-w-[150px] flex-1 sm:flex-none">
                <select
                  name="sort"
                  defaultValue={sort}
                  aria-label="Sort services"
                  className="h-11 w-full cursor-pointer appearance-none rounded-[11px] border border-[#e5e1d6] bg-white py-0 pl-[13px] pr-[38px] text-[13.5px] font-medium text-[#27352f] outline-none focus:border-[#0e6b54] sm:w-[175px] dark:border-[#24332c] dark:bg-[#101a16] dark:text-[#cfdbd3] dark:focus:border-[#43d3ab]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#87948d]" />
              </div>

              <button
                type="submit"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[11px] bg-[#0e6b54] px-[18px] text-[14px] font-semibold text-white transition hover:bg-[#0a5342] sm:flex-none dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
              >
                <Search className="size-4" />
                Search
              </button>
            </form>

            <div className="-mx-6 flex items-center gap-[7px] overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              <Chip
                href={hrefFor({ category: "", page: 1 })}
                active={!category}
                label="All services"
                count={serviceCount}
              />

              {meta.categories.map(({ name, count }) => {
                const Icon = CATEGORY_ICONS[name];

                return (
                  <Chip
                    key={name}
                    href={hrefFor({
                      category: category === name ? "" : name,
                      page: 1,
                    })}
                    active={category === name}
                    label={name}
                    count={count}
                    icon={<Icon className="size-3.5" />}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-0.5 overflow-x-auto rounded-[10px] bg-[#f2efe7] p-[3px] dark:bg-[#14201b]">
                <ModeLink
                  href={hrefFor({ mode: "", page: 1 })}
                  active={!mode}
                  label="Any mode"
                />
                <ModeLink
                  href={hrefFor({ mode: "Home Visit", page: 1 })}
                  active={mode === "Home Visit"}
                  label="Home visit"
                  icon={<House className="size-3.5" />}
                />
                <ModeLink
                  href={hrefFor({ mode: "Shop Drop-off", page: 1 })}
                  active={mode === "Shop Drop-off"}
                  label="Shop drop-off"
                  icon={<Briefcase className="size-3.5" />}
                />
              </div>

              <p className="flex items-center gap-1.5 text-[12px] text-[#87948d]">
                <SlidersHorizontal className="size-3.5" />
                Filters are kept in the URL — reload and they stay.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3.5 pb-[18px] pt-2">
            <p className="text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
              <b className="font-bold text-[#27352f] dark:text-[#cfdbd3]">
                {total}
              </b>{" "}
              service{total === 1 ? "" : "s"}
              {category && (
                <>
                  {" "}
                  in{" "}
                  <b className="font-bold text-[#27352f] dark:text-[#cfdbd3]">
                    {category}
                  </b>
                </>
              )}
              {q && (
                <>
                  {" "}
                  for “
                  <b className="font-bold text-[#27352f] dark:text-[#cfdbd3]">
                    {q}
                  </b>
                  ”
                </>
              )}
              {mode && <> · {mode}</>}
            </p>

            {hasFilters ? (
              <Link
                href="/services"
                className="text-[13px] font-semibold text-[#0e6b54] transition hover:underline dark:text-[#43d3ab]"
              >
                Clear all filters
              </Link>
            ) : (
              <p className="text-[13px] text-[#87948d]">
                Showing page {current} of {pages}
              </p>
            )}
          </div>

          {shown.length > 0 ? (
            <div
              data-reveal-group
              className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3"
            >
              {shown.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d2ccbc] bg-[#fbfaf6] px-6 py-16 text-center dark:border-white/15 dark:bg-white/[0.02]">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-[#e5e1d6] bg-white text-[#87948d] dark:border-white/10 dark:bg-[#101a16]">
                <Search className="size-8" />
              </div>
              <h2 className="mt-4 font-heading text-[19px] font-bold text-[#0f1a15] dark:text-white">
                No services match that search
              </h2>
              <p className="mx-auto mt-2 max-w-[42ch] text-[13.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                We could not find anything for these filters. Try a broader
                category, or reset everything and start again.
              </p>
              <Link
                href="/services"
                className="mt-5 inline-flex h-10 items-center rounded-[11px] bg-[#0e6b54] px-[18px] text-[14px] font-semibold text-white dark:bg-[#43d3ab] dark:text-[#06231b]"
              >
                Reset filters
              </Link>
            </div>
          )}

          {pages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-9 flex flex-wrap items-center justify-center gap-1.5"
            >
              {current > 1 ? (
                <PageLink href={hrefFor({ page: current - 1 })}>
                  <ChevronLeft className="size-3.5" />
                  Previous
                </PageLink>
              ) : (
                <span className="flex h-[38px] items-center gap-1.5 rounded-[9px] border border-[#e5e1d6] px-2.5 text-[13px] font-semibold text-[#87948d] opacity-40 dark:border-white/10">
                  <ChevronLeft className="size-3.5" />
                  Previous
                </span>
              )}

              {Array.from({ length: pages }, (_, index) => index + 1).map(
                (number) =>
                  number === current ? (
                    <span
                      key={number}
                      aria-current="page"
                      className="flex size-[38px] items-center justify-center rounded-[9px] bg-[#0e6b54] text-[13px] font-semibold text-white dark:bg-[#43d3ab] dark:text-[#06231b]"
                    >
                      {number}
                    </span>
                  ) : (
                    <PageLink key={number} href={hrefFor({ page: number })}>
                      {number}
                    </PageLink>
                  ),
              )}

              {current < pages ? (
                <PageLink href={hrefFor({ page: current + 1 })}>
                  Next
                  <ChevronRight className="size-3.5" />
                </PageLink>
              ) : (
                <span className="flex h-[38px] items-center gap-1.5 rounded-[9px] border border-[#e5e1d6] px-2.5 text-[13px] font-semibold text-[#87948d] opacity-40 dark:border-white/10">
                  Next
                  <ChevronRight className="size-3.5" />
                </span>
              )}
            </nav>
          )}

          <div className="relative mt-14 flex flex-col gap-5 overflow-hidden rounded-3xl border border-[#e5e1d6] bg-white px-7 py-9 sm:px-10 lg:flex-row lg:items-center lg:justify-between dark:border-white/[0.08] dark:bg-[#101a16]">
            <div className="relative">
              <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
                <span className="h-px w-[18px] bg-current opacity-60" />
                Can’t find your device?
              </p>
              <h2 className="mt-2.5 max-w-[540px] font-heading text-[1.55rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0f1a15] dark:text-white">
                Tell us what is broken. We will find the right technician.
              </h2>
              <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                Custom jobs, old appliances, weird faults — our team routes the
                request manually within one working day.
              </p>
            </div>

            <a
              href="mailto:hello@fixmate.dev"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[13px] bg-[#0e6b54] px-6 text-[14px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
            >
              Contact support
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-right">
      <p className="font-heading text-[20px] font-extrabold leading-none tracking-[-0.03em] text-[#0f1a15] dark:text-white">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
        {label}
      </p>
    </div>
  );
}

function Chip({
  href,
  active,
  label,
  count,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "flex h-[34px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[9px] border border-transparent bg-[#0f1a15] px-[13px] text-[12.5px] font-semibold text-white dark:bg-white dark:text-[#0f1a15]"
          : "flex h-[34px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[9px] border border-[#e5e1d6] bg-white px-[13px] text-[12.5px] font-medium text-[#5f6f68] transition hover:border-[#d2ccbc] hover:text-[#0f1a15] dark:border-[#24332c] dark:bg-[#101a16] dark:text-[#9dab9f] dark:hover:border-white/20 dark:hover:text-white"
      }
    >
      {icon}
      {label}
      <span className="text-[11px] opacity-60">{count}</span>
    </Link>
  );
}

function ModeLink({
  href,
  active,
  label,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-[12.5px] font-semibold text-[#0f1a15] shadow-sm dark:bg-white dark:text-[#0f1a15]"
          : "flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-medium text-[#5f6f68] transition hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:text-white"
      }
    >
      {icon}
      {label}
    </Link>
  );
}

function PageLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex h-[38px] min-w-[38px] items-center justify-center gap-1.5 rounded-[9px] border border-[#e5e1d6] bg-white px-2.5 text-[13px] font-semibold text-[#5f6f68] transition hover:border-[#d2ccbc] hover:text-[#0f1a15] dark:border-[#24332c] dark:bg-[#101a16] dark:text-[#9dab9f] dark:hover:border-white/20 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}
