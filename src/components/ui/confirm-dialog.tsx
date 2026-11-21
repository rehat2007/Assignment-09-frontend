"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  pending = false,
  onConfirm,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, pending, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4"
      role="presentation"
      onClick={() => {
        if (!pending) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[440px] overflow-y-auto rounded-2xl border border-[#e5e1d6] bg-white p-5 shadow-[0_24px_70px_-30px_rgba(15,26,21,0.55)] dark:border-white/10 dark:bg-[#101a16]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                destructive
                  ? "bg-[#fcecea] text-[#b42318] dark:bg-[#2e1613] dark:text-[#ff8f82]"
                  : "bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]"
              }`}
            >
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <h2
                id="confirm-dialog-title"
                className="font-heading text-[17px] font-bold text-[#0f1a15] dark:text-white"
              >
                {title}
              </h2>
              <p className="mt-1.5 text-[12px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            aria-label="Close confirmation"
            className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-[#87948d] transition hover:bg-black/[0.04] disabled:opacity-50 dark:hover:bg-white/[0.06]"
          >
            <X className="size-4" />
          </button>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#e5e1d6] pt-4 sm:flex-row sm:justify-end dark:border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="inline-flex h-10 items-center justify-center rounded-[9px] border border-[#d2ccbc] px-4 text-[12px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`inline-flex h-10 items-center justify-center rounded-[9px] px-4 text-[12px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              destructive
                ? "bg-[#b42318] hover:bg-[#951d14]"
                : "bg-[#0e6b54] hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
            }`}
          >
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
