import Link from "next/link";
import { ArrowLeft, Search, Wrench } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[920px] flex-col items-center justify-center px-6 py-16 text-center">
          <div className="relative flex size-[132px] items-center justify-center rounded-[38px] border border-[#c9e7d7] bg-[#e4f2ec] text-[#0e6b54] shadow-[0_18px_40px_-28px_rgba(15,26,21,0.45)] dark:border-[#1b4b39] dark:bg-[#0d231a] dark:text-[#63e6b6]">
            <span className="absolute -right-3 -top-3 flex size-9 items-center justify-center rounded-full bg-[#f6e7c8] text-[#a86a12] dark:bg-[#2b2415] dark:text-[#f0bb6a]">
              <Search className="size-4" />
            </span>
            <Wrench className="size-14" strokeWidth={1.5} />
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0e6b54] dark:text-[#63e6b6]">
            Error 404
          </p>
          <h1 className="mt-2 font-heading text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#0f1a15] dark:text-white">
            This page needs a repair
          </h1>
          <p className="mt-3 max-w-[48ch] text-[14px] leading-[1.7] text-[#5f6f68] dark:text-[#9dab9f]">
            The page you are looking for does not exist, was moved, or is no
            longer available. Let&apos;s get you back to a working page.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[11px] bg-[#0e6b54] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[11px] border border-[#d2ccbc] bg-white px-5 text-[13px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]"
            >
              Browse services
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
