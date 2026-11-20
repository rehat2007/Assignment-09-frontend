import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function DashboardPageError({
  title = "We could not load your data",
  description = "The dashboard API did not respond. Please try again.",
  retryHref = "/dashboard",
}: {
  title?: string;
  description?: string;
  retryHref?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e7cda1] bg-[#fcf0d7] p-6 text-center dark:border-[#6b4c24] dark:bg-[#241b10]">
      <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-white/60 text-[#a65c07] dark:bg-[#3a2a10] dark:text-[#f0bb6a]">
        <AlertTriangle className="size-5" />
      </span>
      <h2 className="mt-3 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-[46ch] text-[12px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
        {description}
      </p>
      <Link
        href={retryHref}
        className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-[#0e6b54] px-3.5 text-[11.5px] font-semibold text-white dark:bg-[#63e6b6] dark:text-[#06231b]"
      >
        <RefreshCw className="size-3.5" />
        Try again
      </Link>
    </div>
  );
}
