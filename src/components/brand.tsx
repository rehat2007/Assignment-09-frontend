import Link from "next/link";
import { Wrench } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="FixMate home">
      <span className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#43b986] via-[#178257] to-[#075136] shadow-[0_4px_14px_rgba(11,107,69,0.25)] dark:from-[#bdf9df] dark:via-[#79ebc2] dark:to-[#3dd3a1] dark:shadow-[0_0_22px_rgba(95,227,176,0.22)]">
        <Wrench
          className="size-5 text-white dark:text-[#052e21]"
          strokeWidth={2.6}
          aria-hidden="true"
        />
      </span>

      <span className="flex flex-col">
        <span className="text-[22px] font-bold leading-none tracking-[-0.03em] text-[#101613] dark:text-white">
          Fix
          <span className="text-[#0c7b52] dark:text-[#5be0a5]">Mate</span>
        </span>
        <span className="mt-1 block text-[8px] font-semibold uppercase leading-none tracking-[0.24em] text-[#6c7570] dark:text-[#8ba399]">
          Repair, Tracked
        </span>
      </span>
    </Link>
  );
}
