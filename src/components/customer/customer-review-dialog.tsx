"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Send, Star, X } from "lucide-react";
import { toast } from "sonner";
import { revalidateCatalog } from "@/app/actions";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const MAX_TEXT = 1000;

export function CustomerReviewDialog({
  bookingId,
  bookingNumber,
  serviceTitle,
  onSubmitted,
}: {
  bookingId: string;
  bookingNumber?: string;
  serviceTitle: string;
  onSubmitted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

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

    const trimmed = text.trim();

    if (rating < 1 || rating > 5) {
      setError("Choose a rating from 1 to 5 stars.");
      return;
    }

    if (trimmed.length < 1) {
      setError("Write a short review about the repair.");
      return;
    }

    if (trimmed.length > MAX_TEXT) {
      setError(`Keep the review under ${MAX_TEXT} characters.`);
      return;
    }

    setPending(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/bookings/${encodeURIComponent(bookingId)}/review`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, text: trimmed }),
        },
      );

      const body = (await response.json().catch(() => null)) as
        | { data?: unknown; error?: { message?: string } }
        | null;

      if (!response.ok) {
        throw new Error(body?.error?.message ?? "Could not submit the review.");
      }

      setPending(false);
      setText("");
      setRating(5);
      setOpen(false);
      void revalidateCatalog();
      onSubmitted();
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not submit the review.";
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
        className="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#0e6b54] px-3 text-[11px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
      >
        <Star className="size-3.5" />
        Leave a review
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
              aria-labelledby="customer-review-title"
              onClick={(event) => event.stopPropagation()}
              className="max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-2xl border border-[#e5e1d6] bg-white p-5 shadow-[0_24px_70px_-30px_rgba(15,26,21,0.55)] dark:border-white/10 dark:bg-[#101a16]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0e6b54] dark:text-[#63e6b6]">
                    Verified paid job
                  </p>
                  <h2
                    id="customer-review-title"
                    className="mt-1 font-heading text-[18px] font-bold text-[#0f1a15] dark:text-white"
                  >
                    {serviceTitle}
                  </h2>
                  <p className="mt-1 text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                    {bookingNumber ? `#${bookingNumber} · ` : ""}
                    Your rating updates this service&apos;s public score.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  disabled={pending}
                  aria-label="Close review form"
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

                <fieldset>
                  <legend className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                    Rating
                  </legend>
                  <div className="mt-2 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        disabled={pending}
                        aria-label={`${value} star${value === 1 ? "" : "s"}`}
                        aria-pressed={rating === value}
                        className="rounded-[6px] p-0.5 text-[#eb9f34] transition hover:bg-[#eb9f34]/10 disabled:opacity-60"
                      >
                        <Star
                          className={`size-7 ${
                            value <= rating ? "fill-current" : "opacity-30"
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                    <span className="ml-1.5 text-[12px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                      {rating}/5
                    </span>
                  </div>
                </fieldset>

                <label className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Your review
                  <textarea
                    rows={4}
                    maxLength={MAX_TEXT}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    disabled={pending}
                    placeholder="How was the repair? Mention the technician, timing and quality."
                    className="mt-1.5 w-full resize-none rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 py-2.5 text-[12.5px] leading-[1.6] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:placeholder:text-[#6f8579] dark:focus:border-[#43d3ab]"
                  />
                  <span className="mt-1 block text-right text-[10px] font-normal text-[#87948d]">
                    {text.length}/{MAX_TEXT}
                  </span>
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
                      "Posting review…"
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        Post review
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
