"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CalendarDays,
  MapPin,
  Phone,
  Send,
  Wrench,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const INPUT =
  "mt-1.5 h-11 w-full rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 text-[12.5px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:focus:border-[#43d3ab]";

function inputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function BookingRequestDialog({
  serviceSlug,
  serviceTitle,
  defaultPhone = "",
  defaultArea = "",
}: {
  serviceSlug: string;
  serviceTitle: string;
  defaultPhone?: string;
  defaultArea?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [{ today, tomorrow }] = useState(() => {
    const todayDate = new Date();
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    return {
      today: inputDate(todayDate),
      tomorrow: inputDate(tomorrowDate),
    };
  });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, pending]);

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
      const response = await fetch(`${API_URL}/api/v1/bookings`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          preferredDate: String(form.get("preferredDate") ?? ""),
          phone: String(form.get("phone") ?? ""),
          address: String(form.get("address") ?? ""),
          problem: String(form.get("problem") ?? ""),
        }),
      });

      const body = (await response.json().catch(() => null)) as
        | {
            data?: { id?: string };
            error?: { message?: string };
          }
        | null;

      if (!response.ok) {
        throw new Error(
          body?.error?.message ?? "Could not send your request.",
        );
      }

      setOpen(false);
      router.push("/dashboard/customer/bookings");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not send your request.",
      );
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[#0e6b54] px-5 text-[14px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
      >
        <Wrench className="size-4" />
        Request this repair
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
              aria-labelledby="booking-request-title"
              onClick={(event) => event.stopPropagation()}
              className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-[#e5e1d6] bg-white p-5 shadow-[0_24px_70px_-30px_rgba(15,26,21,0.55)] dark:border-white/10 dark:bg-[#101a16]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0e6b54] dark:text-[#63e6b6]">
                    New repair request
                  </p>
                  <h2
                    id="booking-request-title"
                    className="mt-1 font-heading text-[18px] font-bold text-[#0f1a15] dark:text-white"
                  >
                    {serviceTitle}
                  </h2>
                  <p className="mt-1 text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                    Tell us when and where. The technician confirms before any
                    work starts — no payment now.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  disabled={pending}
                  aria-label="Close booking form"
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

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                    Preferred date
                    <input
                      type="date"
                      name="preferredDate"
                      required
                      min={today}
                      defaultValue={tomorrow}
                      disabled={pending}
                      className={INPUT}
                    />
                  </label>

                  <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                    Phone
                    <input
                      type="tel"
                      name="phone"
                      required
                      minLength={6}
                      maxLength={30}
                      defaultValue={defaultPhone}
                      placeholder="+880 1712 345678"
                      disabled={pending}
                      className={INPUT}
                    />
                  </label>
                </div>

                <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-[#87948d]" />
                    Service address
                  </span>
                  <input
                    type="text"
                    name="address"
                    required
                    minLength={5}
                    maxLength={300}
                    defaultValue={defaultArea}
                    placeholder="Flat, house, road, area"
                    disabled={pending}
                    className={INPUT}
                  />
                </label>

                <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  What needs fixing?
                  <textarea
                    name="problem"
                    required
                    minLength={5}
                    maxLength={2000}
                    rows={4}
                    placeholder="Describe the fault, when it started, and anything the technician should know."
                    disabled={pending}
                    className="mt-1.5 w-full resize-none rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 py-2.5 text-[12.5px] leading-[1.6] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:focus:border-[#43d3ab]"
                  />
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
                    {pending ? (
                      "Sending request…"
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        Send request
                      </>
                    )}
                  </button>
                </div>

                <p className="flex items-center gap-1.5 text-[10.5px] text-[#87948d]">
                  <CalendarDays className="size-3.5" />
                  You can cancel while the request is still pending.
                </p>
                <p className="flex items-center gap-1.5 text-[10.5px] text-[#87948d]">
                  <Phone className="size-3.5" />
                  We only share your phone and address with the assigned
                  technician.
                </p>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
