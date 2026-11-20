import { Check } from "lucide-react";
import { cn } from "cn";
import {
  BOOKING_STATUS_BADGE,
  BOOKING_STATUS_LABEL,
  type BookingStatus,
} from "@/lib/customer-data";

const STEPS = ["Requested", "Accepted", "In Progress", "Completed", "Paid"];

export function StatusBadge({
  status,
  paymentStatus,
}: {
  status: BookingStatus;
  paymentStatus?: "paid" | "unpaid";
}) {
  if (paymentStatus === "paid") {
    return (
      <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-[5px] bg-[#e2f4e9] px-2 text-[10.5px] font-semibold text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]">
        <span className="size-1.5 rounded-full bg-current" />
        Paid
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-[5px] px-2 text-[10.5px] font-semibold",
        BOOKING_STATUS_BADGE[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {BOOKING_STATUS_LABEL[status]}
    </span>
  );
}

export function BookingTimeline({
  status,
  paymentStatus,
  compact = false,
}: {
  status: BookingStatus;
  paymentStatus: "paid" | "unpaid";
  compact?: boolean;
}) {
  const current =
    status === "requested"
      ? 0
      : status === "accepted"
        ? 1
        : status === "in-progress"
          ? 2
          : status === "completed"
            ? paymentStatus === "paid"
              ? 4
              : 3
            : 0;

  return (
    <ol
      aria-label="Booking progress"
      className={cn(
        "flex w-full items-start",
        compact ? "text-[10px]" : "text-[10.5px]",
      )}
    >
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const reachable = done || active;

        return (
          <li
            key={step}
            className="relative flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
          >
            {index > 0 && (
              <span
                className={cn(
                  "absolute right-1/2 top-[9px] h-px w-full",
                  index <= current
                    ? "bg-[#2bb37f] dark:bg-[#43d3ab]"
                    : "bg-[#d2ccbc] dark:bg-[#334740]",
                )}
              />
            )}

            <span
              className={cn(
                "relative z-10 flex size-[18px] items-center justify-center rounded-full border",
                active
                  ? "border-[#0e6b54] bg-[#e4f2ec] text-[#0e6b54] dark:border-[#63e6b6] dark:bg-[#0e2a20] dark:text-[#63e6b6]"
                  : done
                    ? "border-[#0e6b54] bg-[#0e6b54] text-white dark:border-[#43d3ab] dark:bg-[#43d3ab] dark:text-[#06231b]"
                    : "border-[#d2ccbc] bg-white text-[#c4cfc8] dark:border-[#334740] dark:bg-[#101a16] dark:text-[#4f665b]",
              )}
            >
              {done ? (
                <Check className="size-3" strokeWidth={2.5} />
              ) : active ? (
                <span className="size-1.5 rounded-full bg-current" />
              ) : (
                <span className="size-1.5 rounded-full bg-current opacity-50" />
              )}
            </span>

            <span
              className={cn(
                "truncate",
                reachable
                  ? "font-semibold text-[#27352f] dark:text-[#cfdbd3]"
                  : "text-[#87948d]",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
