"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { ServiceThumbnail } from "@/components/service-thumbnail";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { revalidateCatalog } from "@/app/actions";
import {
  type AdminApproval,
  type AdminService,
} from "@/lib/admin-data";
import { formatDate, money } from "@/lib/customer-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const FILTERS: Array<{ key: AdminApproval | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const APPROVAL_STYLES: Record<AdminApproval, string> = {
  approved:
    "bg-[#e2f4e9] text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]",
  pending:
    "bg-[#fcf0d7] text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]",
  rejected:
    "bg-[#fcecea] text-[#b42318] dark:bg-[#2e1613] dark:text-[#ff8f82]",
};

const APPROVAL_RANK: Record<AdminApproval, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

export function AdminServiceApproval({
  initialServices,
}: {
  initialServices: AdminService[];
}) {
  const [services, setServices] = useState(initialServices);
  const [filter, setFilter] = useState<AdminApproval | "all">("all");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminService | null>(null);
  const [rejectReason, setRejectReason] = useState(
    "Does not meet the listing guidelines.",
  );

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

  const visible = useMemo(() => {
    const filtered =
      filter === "all"
        ? services
        : services.filter((service) => service.approval === filter);
    return filtered
      .slice()
      .sort(
        (a, b) => APPROVAL_RANK[a.approval] - APPROVAL_RANK[b.approval],
      );
  }, [services, filter]);

  const availableCount = services.filter((service) => service.available).length;

  async function approveService(service: AdminService) {
    if (pendingId) return;

    setPendingId(service.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/services/${service.id}/approve`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const body = (await response.json().catch(() => null)) as
        | { data?: AdminService; error?: { message?: string } }
        | null;

      if (!response.ok || !body?.data) {
        throw new Error(body?.error?.message ?? "Could not approve this listing.");
      }

      const updated = body.data;
      setServices((current) =>
        current.map((item) => (item.id === service.id ? updated : item)),
      );
      toast.success(`${service.title} approved and published.`);
      void revalidateCatalog();
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not approve this listing.";
      setError(message);
      toast.error(message);
    } finally {
      setPendingId(null);
    }
  }

  function openRejectDialog(service: AdminService) {
    setRejectTarget(service);
    setRejectReason("Does not meet the listing guidelines.");
    setError("");
  }

  async function confirmRejectService() {
    const target = rejectTarget;

    if (!target || pendingId) return;

    const reason = rejectReason.trim();

    if (!reason) {
      setError("Enter a rejection reason.");
      toast.error("Enter a rejection reason.");
      return;
    }

    setPendingId(target.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/services/${target.id}/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        },
      );
      const body = (await response.json().catch(() => null)) as
        | { data?: AdminService; error?: { message?: string } }
        | null;

      if (!response.ok || !body?.data) {
        throw new Error(body?.error?.message ?? "Could not reject this listing.");
      }

      const updated = body.data;
      setServices((current) =>
        current.map((item) => (item.id === target.id ? updated : item)),
      );
      setRejectTarget(null);
      toast.success(
        `${target.title} rejected. The reason is stored for the technician.`,
      );
      void revalidateCatalog();
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not reject this listing.";
      setError(message);
      toast.error(message);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
            Service approval
          </h1>
          <p className="mt-1 max-w-[62ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
            Every listing is reviewed before customers can see it. Pending items
            are shown first.
          </p>
        </div>

        {counts.pending > 0 && (
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[7px] bg-[#fcf0d7] px-3 py-2 text-[10.5px] font-semibold text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]">
            <span className="size-1.5 rounded-full bg-current" />
            {counts.pending} waiting
          </span>
        )}
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
          {availableCount} currently visible to customers
        </p>
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1020px] text-left">
            <thead>
              <tr className="border-b border-[#e5e1d6] text-[9.5px] uppercase tracking-[0.08em] text-[#87948d] dark:border-white/[0.08]">
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-3 py-3 font-semibold">Technician</th>
                <th className="px-3 py-3 font-semibold">Price</th>
                <th className="px-3 py-3 font-semibold">Approval</th>
                <th className="px-3 py-3 font-semibold">Visibility</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
              {visible.map((service) => (
                <tr
                  key={service.id}
                  className={cn(
                    "text-[11.5px]",
                    service.approval === "pending" &&
                      "bg-[#fcf0d7]/30 dark:bg-[#2b2415]/20",
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <ServiceThumbnail
                        image={service.coverImage}
                        category={service.category}
                        small
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0f1a15] dark:text-white">
                          {service.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#87948d]">
                          {service.category} · #{service.serviceSlug ?? service.id.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <p className="font-medium text-[#27352f] dark:text-[#cfdbd3]">
                      {service.technician}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#87948d]">
                      {service.technicianArea}
                    </p>
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
                    {service.approval === "rejected" &&
                      service.rejectionReason && (
                        <p className="mt-1 max-w-[150px] text-[9.5px] leading-[1.4] text-[#87948d]">
                          {service.rejectionReason}
                        </p>
                      )}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={cn(
                        "inline-flex h-6 items-center gap-1.5 rounded-[5px] px-2 text-[10.5px] font-semibold",
                        service.available
                          ? "bg-[#e2f4e9] text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]"
                          : "bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]",
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {service.available ? "Live" : "Paused"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex gap-1.5">
                        {service.approval !== "rejected" && (
                          <button
                            type="button"
                            onClick={() => openRejectDialog(service)}
                            disabled={pendingId === service.id}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[7px] px-2.5 text-[10.5px] font-semibold text-[#b42318] disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#ff8f82]"
                          >
                            <X className="size-3.5" />
                            Reject
                          </button>
                        )}
                        {service.approval !== "approved" && (
                          <button
                            type="button"
                            onClick={() => approveService(service)}
                            disabled={pendingId === service.id}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#3ddc97] px-3 text-[10.5px] font-semibold text-[#06231b] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Check className="size-3.5" />
                            Approve
                          </button>
                        )}
                      </div>
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
                <ServiceThumbnail
                  image={service.coverImage}
                  category={service.category}
                  small
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                    {service.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#87948d]">
                    {service.category} · #{service.serviceSlug ?? service.id.toUpperCase()} ·{" "}
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
                <span
                  className={cn(
                    "inline-flex h-6 items-center gap-1.5 rounded-[5px] px-2 text-[10.5px] font-semibold",
                    service.available
                      ? "bg-[#e2f4e9] text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]"
                      : "bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {service.available ? "Live" : "Paused"}
                </span>
                <span className="text-[10px] text-[#87948d]">
                  {service.technician} · {service.technicianArea}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                {service.approval !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => openRejectDialog(service)}
                    disabled={pendingId === service.id}
                    className="inline-flex h-8 items-center gap-1.5 rounded-[7px] px-2.5 text-[10.5px] font-semibold text-[#b42318] disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#ff8f82]"
                  >
                    <X className="size-3.5" />
                    Reject
                  </button>
                )}
                {service.approval !== "approved" && (
                  <button
                    type="button"
                    onClick={() => approveService(service)}
                    disabled={pendingId === service.id}
                    className="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#3ddc97] px-3 text-[10.5px] font-semibold text-[#06231b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Check className="size-3.5" />
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="p-10 text-center text-[12px] text-[#5f6f68] dark:text-[#9dab9f]">
            No listings with this status.
          </p>
        )}

        <div className="flex flex-col gap-2 border-t border-[#e5e1d6] px-5 py-3 text-[10px] text-[#87948d] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
          <span>
            Approving publishes a listing immediately. Rejected listings return
            to pending review when the technician edits them.
          </span>
          <span>{visible.length} shown</span>
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        title="Reject this listing?"
        description={
          rejectTarget
            ? `Reject “${rejectTarget.title}”? The technician will see your reason and the listing will leave the approval queue.`
            : ""
        }
        confirmLabel="Reject listing"
        cancelLabel="Keep listing"
        destructive
        pending={pendingId === rejectTarget?.id}
        onConfirm={() => void confirmRejectService()}
        onClose={() => {
          if (pendingId !== rejectTarget?.id) setRejectTarget(null);
        }}
      >
        <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
          Reason
          <textarea
            rows={3}
            maxLength={500}
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="Explain what needs to change before this listing can be approved."
            className="mt-1.5 w-full resize-none rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 py-2.5 text-[12.5px] leading-[1.6] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:placeholder:text-[#6f8579] dark:focus:border-[#43d3ab]"
          />
          <span className="mt-1 block text-right text-[10px] font-normal text-[#87948d]">
            {rejectReason.length}/500
          </span>
        </label>
      </ConfirmDialog>
    </div>
  );
}
