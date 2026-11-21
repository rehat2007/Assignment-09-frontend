"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f6f4ee] px-6 py-16 dark:bg-[#080f0c]">
      <div className="w-full max-w-[620px] rounded-[20px] border border-[#e5e1d6] bg-white p-7 text-center shadow-[0_18px_40px_-30px_rgba(15,26,21,0.35)] sm:p-9 dark:border-white/[0.08] dark:bg-[#101a16]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#fcecea] text-[#b42318] dark:bg-[#2e1613] dark:text-[#ff8f82]">
          <AlertTriangle className="size-6" />
        </span>

        <p className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#b42318] dark:text-[#ff8f82]">
          Something went wrong
        </p>
        <h1 className="mt-2 font-heading text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] dark:text-white">
          The page hit an unexpected error
        </h1>
        <p className="mx-auto mt-3 max-w-[46ch] text-[13px] leading-[1.7] text-[#5f6f68] dark:text-[#9dab9f]">
          Nothing you did caused this. Try loading the section again, or return
          to the homepage if the problem continues.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[11px] bg-[#0e6b54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
          >
            <RotateCcw className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[11px] border border-[#d2ccbc] px-5 text-[13px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-5 text-[10px] text-[#87948d]">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
