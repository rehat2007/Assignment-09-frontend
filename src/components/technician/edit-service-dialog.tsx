"use client";

import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Check,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/services";
import type { TechnicianService } from "@/lib/technician-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const INPUT =
  "mt-1.5 h-11 w-full rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 text-[12.5px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:focus:border-[#43d3ab]";

export function EditServiceDialog({
  service,
  onSaved,
}: {
  service: TechnicianService;
  onSaved: (service: TechnicianService) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function close() {
    if (pending) return;
    setOpen(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/technician/services/${encodeURIComponent(service.id)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: String(form.get("title") ?? "").trim(),
            category: String(form.get("category") ?? ""),
            price: Number(form.get("price")),
            description: String(form.get("description") ?? "").trim(),
            duration: String(form.get("duration") ?? "").trim(),
            location: String(form.get("location") ?? "").trim(),
            mode: String(form.get("mode") ?? ""),
          }),
        },
      );

      const body = (await response.json().catch(() => null)) as
        | {
            data?: TechnicianService;
            error?: { message?: string };
          }
        | null;

      if (!response.ok || !body?.data) {
        throw new Error(body?.error?.message ?? "Could not update this listing.");
      }

      onSaved(body.data);
      setOpen(false);
      setPending(false);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not update this listing.";
      setError(message);
      toast.error(message);
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
      >
        <Pencil className="size-3.5" />
        Edit
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
            role="presentation"
            onClick={close}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-service-title"
              onClick={(event) => event.stopPropagation()}
              className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-[#e5e1d6] bg-white p-5 shadow-[0_24px_70px_-30px_rgba(15,26,21,0.55)] dark:border-white/10 dark:bg-[#101a16]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0e6b54] dark:text-[#63e6b6]">
                    Edit listing
                  </p>
                  <h2
                    id="edit-service-title"
                    className="mt-1 font-heading text-[18px] font-bold text-[#0f1a15] dark:text-white"
                  >
                    {service.title}
                  </h2>
                  <p className="mt-1 text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                    Saving changes to an approved or rejected listing sends it
                    back to pending review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  disabled={pending}
                  aria-label="Close edit form"
                  className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-[#87948d] transition hover:bg-black/[0.04] disabled:opacity-50 dark:hover:bg-white/[0.06]"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 grid gap-3.5">
                {error && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-[9px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[11.5px] leading-snug text-[#b42318] dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
                  >
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    {error}
                  </p>
                )}

                <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Title
                  <input
                    name="title"
                    required
                    minLength={3}
                    maxLength={120}
                    defaultValue={service.title}
                    disabled={pending}
                    className={INPUT}
                  />
                </label>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                    Category
                    <select
                      name="category"
                      required
                      defaultValue={service.category}
                      disabled={pending}
                      className={INPUT}
                    >
                      {CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                    Base price (USD)
                    <input
                      name="price"
                      type="number"
                      required
                      min={1}
                      max={100000}
                      defaultValue={service.price}
                      disabled={pending}
                      className={INPUT}
                    />
                  </label>
                </div>

                <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Description
                  <textarea
                    name="description"
                    required
                    minLength={20}
                    maxLength={2000}
                    rows={4}
                    defaultValue={service.description ?? ""}
                    disabled={pending}
                    className="mt-1.5 w-full resize-none rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 py-2.5 text-[12.5px] leading-[1.6] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:focus:border-[#43d3ab]"
                  />
                </label>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                    Duration
                    <input
                      name="duration"
                      required
                      maxLength={60}
                      defaultValue={service.duration}
                      disabled={pending}
                      className={INPUT}
                    />
                  </label>

                  <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                    Service area
                    <input
                      name="location"
                      required
                      minLength={2}
                      maxLength={120}
                      defaultValue={service.location ?? ""}
                      disabled={pending}
                      className={INPUT}
                    />
                  </label>
                </div>

                <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Service mode
                  <select
                    name="mode"
                    required
                    defaultValue={service.mode ?? "Home Visit"}
                    disabled={pending}
                    className={INPUT}
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Shop Drop-off">Shop Drop-off</option>
                  </select>
                </label>

                <div className="flex flex-col-reverse gap-2 border-t border-[#e5e1d6] pt-4 sm:flex-row sm:justify-end dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={close}
                    disabled={pending}
                    className="inline-flex h-10 items-center justify-center rounded-[9px] border border-[#d2ccbc] px-4 text-[12px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[9px] bg-[#0e6b54] px-4 text-[12px] font-semibold text-white transition hover:bg-[#0a5342] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
                  >
                    {pending ? "Saving…" : (
                      <>
                        <Check className="size-3.5" />
                        Save changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
