import Link from "next/link";
import { Wrench } from "lucide-react";

export function Brand({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-[11px]" aria-label="FixMate home">
      <span className="flex size-[38px] items-center justify-center rounded-[11px] bg-gradient-to-br from-[#43b986] via-[#178257] to-[#075136] shadow-[0_4px_14px_rgba(11,107,69,0.25)] dark:from-[#bdf9df] dark:via-[#79ebc2] dark:to-[#3dd3a1] dark:shadow-[0_0_22px_rgba(95,227,176,0.22)]">
        <Wrench
          className="size-[21px] text-white dark:text-[#052e21]"
          strokeWidth={2.6}
          aria-hidden="true"
        />
      </span>

      <span className="flex flex-col">
        <span
          className={`text-[20px] font-extrabold leading-none tracking-[-0.045em] ${
            onDark ? "text-white" : "text-[#101613] dark:text-white"
          }`}
        >
          Fix
          <span
            className={
              onDark
                ? "text-[#5be0a5]"
                : "text-[#0c7b52] dark:text-[#5be0a5]"
            }
          >
            Mate
          </span>
        </span>
        <span
          className={`mt-0.5 block text-[9px] font-semibold uppercase leading-[1.2] tracking-[0.17em] ${
            onDark ? "text-white/45" : "text-[#6c7570] dark:text-[#8ba399]"
          }`}
        >
          Repair, Tracked
        </span>
      </span>
    </Link>
  );
}
