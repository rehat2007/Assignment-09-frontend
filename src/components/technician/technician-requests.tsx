"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MapPin,
  Phone,
  Receipt,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "cn";
import { StatusBadge } from "@/components/customer/booking-status";
import { CategoryTile } from "@/components/customer/category-tile";
import {
  type BookingStatus,
  formatDate,
  money,
} from "@/lib/customer-data";
import type { TechnicianRequest } from "@/lib/technician-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const FILTERS: Array<{ key: BookingStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TechnicianRequests({
  initialRequests,
}: {
  initialRequests: TechnicianRequest[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [completing, setCompleting] = useState<TechnicianRequest | null>(null);
  const [finalAmount, setFinalAmount] = useState("");
  const [completionError, setCompletionError] = useState("");
  const [completionPending, setCompletionPending] = useState(false);

  const counts = useMemo(
    () =>
      requests.reduce<Record<string, number>>(
        (result, request) => {
          result.all += 1;
          result[request.status] = (result[request.status] ?? 0) + 1;
          return result;
        },
        { all: 0 },
      ),
    [requests],
  );

  const visible = useMemo(
    () =>
      filter === "all"
        ? requests
        : requests.filter((request) => request.status === filter),
    [requests, filter],
  );

  async function runAction(
    request: TechnicianRequest,
    action: "accept" | "reject" | "start",
    successMessage: string,
    body?: unknown,
  ) {
    if (pendingId) return;

    setPendingId(request.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/technician/requests/${request.id}/${action}`,
        {
          method: "POST",
          credentials: "include",
          ...(body === undefined
            ? {}
            : {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              }),
        },
      );
      const data = (await response.json().catch(() => null)) as
        | {
            data?: TechnicianRequest;
            error?: { message?: string };
          }
        | null;

      if (!response.ok || !data?.data) {
        throw new Error(
          data?.error?.message ?? "Could not update this request.",
        );
      }

      const updated = data.data;
      setRequests((current) =>
        current.map((item) => (item.id === request.id ? updated : item)),
      );
      toast.success(successMessage);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not update this request.";
      setError(message);
      toast.error(message);
    } finally {
      setPendingId(null);
    }
  }

  function openComplete(request: TechnicianRequest) {
    setCompleting(request);
    setFinalAmount(String(request.basePrice ?? request.amount));
    setCompletionError("");
  }

  function closeComplete() {
    if (completionPending) return;
    setCompleting(null);
    setCompletionError("");
  }

  async function completeRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!completing || completionPending) return;

    const amount = Number(finalAmount);

    if (!Number.isInteger(amount) || amount <= 0) {
      setCompletionError("Enter a whole dollar amount greater than 0.");
      return;
    }

    setCompletionPending(true);
    setCompletionError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/technician/requests/${completing.id}/complete`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ finalAmount: amount }),
        },
      );
      const data = (await response.json().catch(() => null)) as
        | {
            data?: TechnicianRequest;
            error?: { message?: string };
          }
        | null;

      if (!response.ok || !data?.data) {
        throw new Error(
          data?.error?.message ?? "Could not complete this request.",
        );
      }

      const updated = data.data;
      setRequests((current) =>
        current.map((item) => (item.id === completing.id ? updated : item)),
      );
      setCompleting(null);
      toast.success("Job completed. The final amount was saved.");
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not complete this request.";
      setCompletionError(message);
      toast.error(message);
    } finally {
      setCompletionPending(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
            Manage requests
          </h1>
          <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
            Accept jobs, update status and set the final amount when the work is
            done.
          </p>
        </div>

        <Link
          href="/dashboard/technician"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]"
        >
          <ArrowUpRight className="size-4" />
          Overview
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[9px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[11.5px] text-[#b42318] dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex max-w-full flex-wrap items-center gap-2 pb-1">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-2 rounded-[8px] border px-3 text-[11.5px] font-medium transition-colors",
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

        {(counts.requested ?? 0) > 0 && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[7px] bg-[#fcf0d7] px-3 py-2 text-[10.5px] font-semibold text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]">
            <Clock className="size-3.5" />
            {counts.requested} {counts.requested === 1 ? "request needs" : "requests need"} a response
          </span>
        )}
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-[#e5e1d6] text-[9.5px] uppercase tracking-[0.08em] text-[#87948d] dark:border-white/[0.08]">
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Service</th>
                <th className="px-3 py-3 font-semibold">Preferred date</th>
                <th className="px-3 py-3 font-semibold">Problem</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 text-right font-semibold">Amount</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
              {visible.map((request) => (
                <tr key={request.id} className="align-top text-[11.5px]">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e9efff] text-[9px] font-bold text-[#274ec4]">
                        {initials(request.customer)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0f1a15] dark:text-white">
                          {request.customer}
                        </p>
                        {request.status === "requested" ? (
                          <p className="mt-1 max-w-[180px] text-[9.5px] italic leading-[1.4] text-[#87948d]">
                            Contact details unlock after accepting.
                          </p>
                        ) : (
                          <>
                            <p className="mt-0.5 flex items-center gap-1 text-[9.5px] text-[#87948d]">
                              <Phone className="size-2.5" />
                              {request.phone ?? "—"}
                            </p>
                            <p className="mt-1 flex max-w-[180px] items-start gap-1 text-[9.5px] leading-[1.4] text-[#87948d]">
                              <MapPin className="mt-0.5 size-2.5 shrink-0" />
                              {request.address ?? "—"}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2.5">
                      <CategoryTile category={request.category} small />
                      <div>
                        <p className="font-semibold text-[#0f1a15] dark:text-white">
                          {request.serviceTitle}
                        </p>
                        <p className="mt-0.5 text-[9.5px] text-[#87948d]">
                          {request.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[#5f6f68] dark:text-[#9dab9f]">
                    {formatDate(request.preferredDate)}
                  </td>
                  <td className="max-w-[220px] px-3 py-4 text-[10px] leading-[1.5] text-[#5f6f68] dark:text-[#9dab9f]">
                    <span className="line-clamp-2">{request.problem}</span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={request.status} />
                      {request.status === "completed" && (
                        <span
                          className={cn(
                            "inline-flex h-5 items-center gap-1 rounded-[4px] px-1.5 text-[9px] font-semibold",
                            request.paymentStatus === "paid"
                              ? "bg-[#e2f4e9] text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]"
                              : "bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]",
                          )}
                        >
                          <span className="size-1 rounded-full bg-current" />
                          {request.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className={cn(
                      "px-3 py-4 text-right font-semibold",
                      request.status === "completed"
                        ? "text-[#0f1a15] dark:text-white"
                        : "text-[#5f6f68] dark:text-[#9dab9f]",
                    )}
                  >
                    {money(request.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      {request.status === "requested" && (
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              runAction(
                                request,
                                "reject",
                                "Request rejected.",
                                { reason: "Rejected by technician" },
                              )
                            }
                            disabled={pendingId === request.id}
                            className="inline-flex h-8 items-center rounded-[7px] border border-[#d2ccbc] px-3 text-[10.5px] font-semibold text-[#27352f] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-white"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              runAction(
                                request,
                                "accept",
                                "Request accepted.",
                              )
                            }
                            disabled={pendingId === request.id}
                            className="inline-flex h-8 items-center rounded-[7px] bg-[#3ddc97] px-3 text-[10.5px] font-semibold text-[#06231b] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Accept
                          </button>
                        </div>
                      )}

                      {request.status === "accepted" && (
                        <button
                          type="button"
                          onClick={() =>
                            runAction(
                              request,
                              "start",
                              "Job moved to in progress.",
                            )
                          }
                          disabled={pendingId === request.id}
                          className="inline-flex h-8 items-center rounded-[7px] bg-[#3ddc97] px-3 text-[10.5px] font-semibold text-[#06231b] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Start work
                        </button>
                      )}

                      {request.status === "in-progress" && (
                        <button
                          type="button"
                          onClick={() => openComplete(request)}
                          className="inline-flex h-8 items-center rounded-[7px] bg-[#3ddc97] px-3 text-[10.5px] font-semibold text-[#06231b]"
                        >
                          Mark completed
                        </button>
                      )}

                      {request.status === "completed" && (
                        <Link
                          href={`/services/${request.serviceSlug ?? request.serviceId}`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-[7px] border border-[#d2ccbc] px-3 text-[10.5px] font-semibold text-[#27352f] dark:border-white/15 dark:text-white"
                        >
                          <Receipt className="size-3.5" />
                          View
                        </Link>
                      )}

                      {["cancelled", "rejected"].includes(request.status) && (
                        <span className="text-[9.5px] text-[#87948d]">
                          No action available
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#e5e1d6] md:hidden dark:divide-white/[0.07]">
          {visible.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-start gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e9efff] text-[9px] font-bold text-[#274ec4]">
                  {initials(request.customer)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold text-[#0f1a15] dark:text-white">
                    {request.customer}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">
                    {request.status === "requested"
                      ? "Contact hidden until accepted"
                      : (request.phone ?? "—")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={request.status} />
                  {request.status === "completed" && (
                    <span
                      className={cn(
                        "inline-flex h-5 items-center gap-1 rounded-[4px] px-1.5 text-[9px] font-semibold",
                        request.paymentStatus === "paid"
                          ? "bg-[#e2f4e9] text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]"
                          : "bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]",
                      )}
                    >
                      <span className="size-1 rounded-full bg-current" />
                      {request.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                <CategoryTile category={request.category} small />
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold text-[#0f1a15] dark:text-white">
                    {request.serviceTitle}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-[#87948d]">
                    {request.category} ·{" "}
                    {formatDate(request.preferredDate)} ·{" "}
                    {money(request.amount)}
                  </p>
                </div>
              </div>

              <p className="mt-2 line-clamp-2 text-[10px] leading-[1.5] text-[#5f6f68] dark:text-[#9dab9f]">
                {request.problem}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                {request.status === "requested" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          request,
                          "reject",
                          "Request rejected.",
                          { reason: "Rejected by technician" },
                        )
                      }
                      disabled={pendingId === request.id}
                      className="h-8 rounded-[7px] border border-[#d2ccbc] px-3 text-[10.5px] font-semibold text-[#27352f] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-white"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        runAction(request, "accept", "Request accepted.")
                      }
                      disabled={pendingId === request.id}
                      className="h-8 rounded-[7px] bg-[#3ddc97] px-3 text-[10.5px] font-semibold text-[#06231b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Accept
                    </button>
                  </>
                )}

                {request.status === "accepted" && (
                  <button
                    type="button"
                    onClick={() =>
                      runAction(
                        request,
                        "start",
                        "Job moved to in progress.",
                      )
                    }
                    disabled={pendingId === request.id}
                    className="h-8 rounded-[7px] bg-[#3ddc97] px-3 text-[10.5px] font-semibold text-[#06231b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Start work
                  </button>
                )}

                {request.status === "in-progress" && (
                  <button
                    type="button"
                    onClick={() => openComplete(request)}
                    className="h-8 rounded-[7px] bg-[#3ddc97] px-3 text-[10.5px] font-semibold text-[#06231b]"
                  >
                    Mark completed
                  </button>
                )}

                {request.status === "completed" && (
                  <Link
                    href={`/services/${request.serviceSlug ?? request.serviceId}`}
                    className="text-[10.5px] font-semibold text-[#0e6b54] dark:text-[#63e6b6]"
                  >
                    View service
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
              {requests.length
                ? "No requests with this status"
                : "No repair requests assigned yet"}
            </p>
            <p className="mx-auto mt-1 max-w-[42ch] text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
              {requests.length
                ? "Switch the filter to see your other requests."
                : "New customer requests assigned to you will appear here."}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5 border-t border-[#e5e1d6] px-5 py-3 text-[10px] text-[#87948d] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            You only see bookings where the technician email matches yours.
          </span>
          <span>{visible.length} shown</span>
        </div>
      </section>

      {completing &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
            role="presentation"
            onClick={closeComplete}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="complete-request-title"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-[440px] rounded-2xl border border-[#e5e1d6] bg-white p-5 shadow-[0_24px_70px_-30px_rgba(15,26,21,0.55)] dark:border-white/10 dark:bg-[#101a16]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0e6b54] dark:text-[#63e6b6]">
                    Complete job
                  </p>
                  <h2
                    id="complete-request-title"
                    className="mt-1 font-heading text-[18px] font-bold text-[#0f1a15] dark:text-white"
                  >
                    Set the final amount
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeComplete}
                  disabled={completionPending}
                  aria-label="Close completion form"
                  className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-[#87948d] transition hover:bg-black/[0.04] disabled:opacity-50 dark:hover:bg-white/[0.06]"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-[#e5e1d6] bg-[#fbfaf6] p-3 dark:border-white/[0.08] dark:bg-[#0b1510]">
                <p className="text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                  {completing.serviceTitle}
                </p>
                <p className="mt-1 text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  {completing.customer} · {formatDate(completing.preferredDate)}
                </p>
              </div>

              <form onSubmit={completeRequest} className="mt-4 grid gap-3.5">
                {completionError && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-[9px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[11.5px] leading-snug text-[#b42318] dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
                  >
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    {completionError}
                  </p>
                )}

                <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Final amount (USD)
                  <input
                    type="number"
                    required
                    min={1}
                    max={100000}
                    step={1}
                    value={finalAmount}
                    onChange={(event) => setFinalAmount(event.target.value)}
                    disabled={completionPending}
                    className="mt-1.5 h-11 w-full rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 text-[12.5px] text-[#0f1a15] outline-none transition focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:focus:border-[#43d3ab]"
                  />
                </label>

                <p className="text-[10.5px] leading-[1.55] text-[#87948d]">
                  Base price is {money(completing.basePrice ?? completing.amount)}.
                  The customer pays after completion. This is saved once.
                </p>

                <div className="flex flex-col-reverse gap-2 border-t border-[#e5e1d6] pt-4 sm:flex-row sm:justify-end dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={closeComplete}
                    disabled={completionPending}
                    className="inline-flex h-10 items-center justify-center rounded-[9px] border border-[#d2ccbc] px-4 text-[12px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={completionPending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[9px] bg-[#0e6b54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#0a5342] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
                  >
                    {completionPending ? "Saving…" : "Mark completed"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
