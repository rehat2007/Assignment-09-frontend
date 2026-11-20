"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "cn";
import { CategoryTile } from "@/components/customer/category-tile";
import { formatDate, money } from "@/lib/customer-data";
import {
  type TechnicianApproval,
  type TechnicianService,
} from "@/lib/technician-data";

const FILTERS: Array<{ key: TechnicianApproval | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "approved", label: "Approved" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
];

const APPROVAL_STYLES: Record<TechnicianApproval, string> = {
  approved:
    "bg-[#e2f4e9] text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]",
  pending:
    "bg-[#fcf0d7] text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]",
  rejected:
    "bg-[#fcecea] text-[#b42318] dark:bg-[#2e1613] dark:text-[#ff8f82]",
};

export function TechnicianServices({
  initialServices,
}: {
  initialServices: TechnicianService[];
}) {
  const [services, setServices] = useState(initialServices);
  const [filter, setFilter] = useState<TechnicianApproval | "all">("all");
  const [notice, setNotice] = useState("");

  const counts = useMemo(
    () =>
      services.reduce<Record<string, number>>(
        (result, service) => {
          result.all += 1;
          result[service.approval] = (result[service.approval] ?? 0) + 1;
          return result;
        },
        { all: 0 },
      ),
    [services],
  );

  const visible = useMemo(
    () =>
      filter === "all"
        ? services
        : services.filter((service) => service.approval === filter),
    [services, filter],
  );

  const approved = counts.approved ?? 0;
  const pending = counts.pending ?? 0;
  const availableCount = services.filter((service) => service.available).length;

  function toggleAvailability(id: string) {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? { ...service, available: !service.available }
          : service,
      ),
    );
  }

  function removeService(id: string) {
    if (!window.confirm("Remove this listing from the preview?")) return;
    setServices((current) => current.filter((service) => service.id !== id));
    setNotice("Listing removed in this preview. Connect the listings API to persist it.");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
            My services
          </h1>
          <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
            Full control over your listings — edit, pause or remove them.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[9px] bg-[#0e6b54] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
        >
          <Plus className="size-4" />
          Add service
        </Link>
      </div>

      {notice && (
        <p
          role="status"
          className="mt-4 rounded-[9px] border border-[#0e6b54]/20 bg-[#e4f2ec] px-3 py-2.5 text-[11.5px] text-[#0e6b54] dark:border-[#43d3ab]/20 dark:bg-[#112c25] dark:text-[#43d3ab]"
        >
          {notice}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={cn(
                  "inline-flex h-8 items-center gap-2 rounded-[8px] border px-3 text-[11.5px] font-medium transition-colors",
                  active
                    ? "border-[#0f1a15] bg-[#0f1a15] text-white dark:border-white dark:bg-white dark:text-[#0f1a15]"
                    : "border-[#e5e1d6] bg-[#fbfaf6] text-[#5f6f68] hover:text-[#0f1a15] dark:border-white/[0.08] dark:bg-[#101a16] dark:text-[#9dab9f] dark:hover:text-white",
                )}
              >
                {item.label}
                <span className="text-[10px] opacity-60">
                  {counts[item.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[11.5px] text-[#87948d]">
          {availableCount} of {services.length} visible
        </p>
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]">
        <div className="hidden md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#e5e1d6] text-[9.5px] uppercase tracking-[0.08em] text-[#87948d] dark:border-white/[0.08]">
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-3 py-3 font-semibold">Price</th>
                <th className="px-3 py-3 font-semibold">Approval</th>
                <th className="px-3 py-3 font-semibold">Availability</th>
                <th className="px-3 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
              {visible.map((service) => (
                <tr key={service.id} className="text-[11.5px]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CategoryTile category={service.category} small />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0f1a15] dark:text-white">
                          {service.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#87948d]">
                          {service.category} · #{service.id.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <p className="font-semibold text-[#0f1a15] dark:text-white">
                      {money(service.price)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#87948d]">
                      {service.duration}
                    </p>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={cn(
                        "inline-flex h-6 items-center gap-1.5 rounded-[5px] px-2 text-[10.5px] font-semibold capitalize",
                        APPROVAL_STYLES[service.approval],
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {service.approval}
                    </span>
                    {service.approval === "pending" && (
                      <p className="mt-1 text-[9.5px] text-[#87948d]">
                        Awaiting admin
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(service.id)}
                        role="switch"
                        aria-checked={service.available}
                        aria-label={`Toggle availability for ${service.title}`}
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors",
                          service.available
                            ? "bg-[#0e6b54] dark:bg-[#63e6b6]"
                            : "bg-[#d2ccbc] dark:bg-white/20",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute left-0 top-0.5 size-4 rounded-full bg-white transition-transform dark:bg-[#06231b]",
                            service.available
                              ? "translate-x-[18px]"
                              : "translate-x-0.5",
                          )}
                        />
                      </button>
                      <span className="text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                        {service.available ? "Live" : "Off"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[#5f6f68] dark:text-[#9dab9f]">
                    {formatDate(service.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setNotice("The edit form is next; this preview only covers the listing table.")
                        }
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        aria-label={`Delete ${service.title}`}
                        className="text-[#b42318] hover:opacity-70 dark:text-[#ff8f82]"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#e5e1d6] md:hidden dark:divide-white/[0.07]">
          {visible.map((service) => (
            <div key={service.id} className="p-4">
              <div className="flex items-start gap-3">
                <CategoryTile category={service.category} small />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                    {service.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#87948d]">
                    {service.category} · #{service.id.toUpperCase()} ·{" "}
                    {formatDate(service.createdAt)}
                  </p>
                </div>
                <p className="shrink-0 text-[12px] font-bold text-[#0f1a15] dark:text-white">
                  {money(service.price)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-6 items-center gap-1.5 rounded-[5px] px-2 text-[10.5px] font-semibold capitalize",
                    APPROVAL_STYLES[service.approval],
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {service.approval}
                </span>
                <button
                  type="button"
                  onClick={() => toggleAvailability(service.id)}
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#e5e1d6] px-2 py-1 text-[10px] text-[#5f6f68] dark:border-white/10 dark:text-[#9dab9f]"
                >
                  {service.available ? "Live" : "Off"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNotice("The edit form is next; this preview only covers the listing table.")
                  }
                  className="ml-auto text-[10.5px] font-semibold text-[#0e6b54] dark:text-[#63e6b6]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  aria-label={`Delete ${service.title}`}
                  className="text-[#b42318] dark:text-[#ff8f82]"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
              {services.length
                ? "No services with this status"
                : "You have not listed a service yet"}
            </p>
            <p className="mx-auto mt-1 max-w-[42ch] text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
              {services.length
                ? "Switch the filter to see your other listings."
                : "Add your first repair service. It will be reviewed by an admin before going live."}
            </p>
            {!services.length && (
              <Link
                href="/dashboard/technician/add-service"
                className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-[#0e6b54] px-3.5 text-[11.5px] font-semibold text-white dark:bg-[#63e6b6] dark:text-[#06231b]"
              >
                <Plus className="size-3.5" />
                Add a service
              </Link>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-[#e5e1d6] px-5 py-3 text-[10px] text-[#87948d] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
          <span>Editing an approved service resets it to pending review.</span>
          <span>
            {approved} approved · {pending} pending
          </span>
        </div>
      </section>
    </div>
  );
}
