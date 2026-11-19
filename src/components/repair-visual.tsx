import { Check, Clock, CreditCard, ShieldCheck, Wrench } from "lucide-react";

export function RepairVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[520px]"
    >
      {/* Soft green light behind the card */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2bb37f]/10 blur-3xl dark:bg-[#2bb37f]/20" />

      <div className="relative pt-16">
        {/* Floating verification card */}
        <div className="absolute left-0 top-0 z-20 flex w-[188px] items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white/95 p-3 shadow-[0_12px_30px_rgba(16,48,34,0.12)] backdrop-blur sm:w-[202px] dark:border-white/10 dark:bg-[#0a1711]/95">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e3f7ec] dark:bg-[#102b20]">
            <ShieldCheck className="size-4 text-[#0c7b52] dark:text-[#63e6b6]" />
          </span>

          <div>
            <p className="text-[11px] font-bold text-[#111814] dark:text-white">
              Technician verified
            </p>
            <p className="mt-0.5 text-[9px] text-[#748179] dark:text-[#91a69c]">
              ID + skills checked
            </p>
          </div>
        </div>

        {/* Main repair card */}
        <div className="relative z-10 mx-auto w-[82%] rounded-[28px] border border-[#17382a] bg-[#06110c] px-5 pb-4 pt-5 shadow-[0_30px_80px_rgba(2,15,9,0.45)] sm:w-[76%] sm:px-6 sm:pb-5 sm:pt-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[17px] font-bold leading-tight text-white sm:text-[19px]">
                Repair in progress
              </h3>
              <p className="mt-1 text-[10px] text-[#7f998c] sm:text-[11px]">
                Job #FM-2481 · Rakib Hasan
              </p>
            </div>

            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#e6f6ec] px-2 py-1 text-[9px] font-semibold text-[#204a35] sm:text-[10px]">
              <span className="size-1.5 rounded-full bg-[#e5a24d]" />
              On site
            </span>
          </div>

          {/* Simple phone illustration built with CSS */}
          <div className="relative mx-auto my-5 h-[190px] w-[112px] sm:h-[205px] sm:w-[124px]">
            <div className="absolute inset-0 rounded-[27px] border border-[#2d8f68] bg-[#07160f] shadow-[0_0_30px_rgba(38,180,124,0.14)]">
              <div className="mx-auto mt-4 h-1 w-8 rounded-full bg-[#163c2c]" />

              <div className="mx-auto mt-8 flex size-14 items-center justify-center rounded-full border-2 border-[#4fe1a8] bg-[#0a2419] shadow-[0_0_22px_rgba(79,225,168,0.25)] sm:size-16">
                <Check
                  className="size-7 text-[#4fe1a8] sm:size-8"
                  strokeWidth={2.5}
                />
              </div>

              <div className="mx-auto mt-5 h-1.5 w-14 rounded-full bg-[#173d2d]" />
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-[#173d2d]" />

              <div className="mx-auto mt-3 flex w-12 items-center gap-1 rounded-full border border-[#276c50] px-2 py-1">
                <Check className="size-2.5 text-[#4fe1a8]" />
                <span className="h-1 w-5 rounded-full bg-[#276c50]" />
              </div>
            </div>

            <div className="absolute -left-8 top-1/2 h-px w-8 bg-gradient-to-r from-transparent to-[#2e9d70]/60" />
            <div className="absolute -right-8 top-1/2 h-px w-8 bg-gradient-to-l from-transparent to-[#2e9d70]/60" />

            <div className="absolute -bottom-2 -right-3 flex size-8 items-center justify-center rounded-full bg-[#f0b46e] shadow-md sm:size-9">
              <Wrench className="size-4 text-[#5b3516]" />
            </div>
          </div>

          <div className="mt-3 border-t border-white/[0.08] pt-2.5">
            <div className="flex items-center justify-between gap-3 py-1.5 text-[10px] sm:text-[11px]">
              <span className="text-[#81998c]">Device diagnosis</span>
              <span className="font-semibold text-[#63e6b6]">Passed</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5 text-[10px] sm:text-[11px]">
              <span className="text-[#81998c]">Payment</span>
              <span className="font-semibold text-white">
                Held until completion
              </span>
            </div>
          </div>
        </div>

        {/* Orange "pay after service" seal */}
        <div className="absolute right-0 top-0 z-20 flex size-[72px] -rotate-[8deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-[#7d4c22]/40 bg-[#f0b46e] text-center text-[#5b3516] shadow-[0_10px_25px_rgba(93,56,20,0.18)] sm:size-[80px]">
          <ShieldCheck className="mb-1 size-3.5" />
          <span className="text-[8px] font-extrabold leading-[1.15] tracking-[0.12em]">
            PAY AFTER
            <br />
            SERVICE
          </span>
        </div>
      </div>

      {/* Floating info cards below the main card */}
      <div className="mt-5 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white/95 px-3 py-2.5 shadow-[0_12px_30px_rgba(16,48,34,0.10)] dark:border-white/10 dark:bg-[#0a1711]/95">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e6f6ec] dark:bg-[#102b20]">
            <Clock className="size-3.5 text-[#0c7b52] dark:text-[#63e6b6]" />
          </span>
          <div>
            <p className="text-[10px] font-bold leading-tight text-[#111814] dark:text-white">
              2–3 hours
            </p>
            <p className="mt-0.5 text-[8px] text-[#748179] dark:text-[#91a69c]">
              Average arrival
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white/95 px-3 py-2.5 shadow-[0_12px_30px_rgba(16,48,34,0.10)] dark:border-white/10 dark:bg-[#0a1711]/95">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e6f6ec] dark:bg-[#102b20]">
            <CreditCard className="size-3.5 text-[#0c7b52] dark:text-[#63e6b6]" />
          </span>
          <div>
            <p className="text-[10px] font-bold leading-tight text-[#111814] dark:text-white">
              Secure payment
            </p>
            <p className="mt-0.5 text-[8px] text-[#748179] dark:text-[#91a69c]">
              Only when completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
