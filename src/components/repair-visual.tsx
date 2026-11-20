import { Check, Clock, CreditCard, ShieldCheck, Wrench } from "lucide-react";

export function RepairVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative grid min-h-[380px] place-items-center min-[861px]:min-h-[430px]"
    >
      {/* Soft green light behind the card */}
      <div className="pointer-events-none absolute aspect-square w-[92%] rounded-full bg-[#2bb37f]/10 blur-3xl dark:bg-[#2bb37f]/20" />

      {/* Main repair card */}
      <div className="relative z-10 w-[min(100%,360px)] rounded-[26px] border border-[#17382a] bg-[#06110c] p-[22px] shadow-[0_50px_80px_-44px_rgba(11,23,19,0.65),0_2px_0_rgba(255,255,255,0.06)_inset] min-[861px]:w-[min(100%,390px)] min-[861px]:rotate-[-1.4deg]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-[14px] font-bold leading-tight text-white">
              Repair in progress
            </h3>
            <p className="mt-0.5 text-[11px] text-[#7f998c]">
              Job #FM-2481 · Rakib Hasan
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#e6f6ec] px-2 py-1 text-[9.5px] font-semibold text-[#204a35]">
            <span className="size-1.5 rounded-full bg-[#e5a24d]" />
            On site
          </span>
        </div>

        {/* Simple phone illustration built with CSS */}
        <div className="relative mx-auto mb-[18px] mt-[10px] h-[190px] w-[150px]">
          <div className="absolute inset-0 rounded-[27px] border border-[#2d8f68] bg-[#07160f] shadow-[0_0_30px_rgba(38,180,124,0.14)]">
            <div className="mx-auto mt-4 h-1 w-8 rounded-full bg-[#163c2c]" />

            <div className="mx-auto mt-8 flex size-16 items-center justify-center rounded-full border-2 border-[#4fe1a8] bg-[#0a2419] shadow-[0_0_22px_rgba(79,225,168,0.25)]">
              <Check className="size-8 text-[#4fe1a8]" strokeWidth={2.5} />
            </div>

            <div className="mx-auto mt-5 h-1.5 w-14 rounded-full bg-[#173d2d]" />
            <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-[#173d2d]" />

            <div className="mx-auto mt-3 flex w-12 items-center gap-1 rounded-full border border-[#276c50] px-2 py-1">
              <Check className="size-2.5 text-[#4fe1a8]" />
              <span className="h-1 w-5 rounded-full bg-[#276c50]" />
            </div>
          </div>

          <div className="absolute -bottom-2 -right-3 flex size-8 items-center justify-center rounded-full bg-[#f0b46e] shadow-md">
            <Wrench className="size-4 text-[#5b3516]" />
          </div>

          <div
            data-scan
            className="absolute left-1/2 top-[46%] h-0.5 w-[210px] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,transparent,#5ad19a,transparent)] shadow-[0_0_18px_3px_rgba(90,209,154,0.4)]"
          />
        </div>

        <div className="border-t border-white/[0.08]">
          <div className="flex items-center justify-between gap-2.5 py-[11px] text-[12px]">
            <span className="text-[#81998c]">Device diagnosis</span>
            <span className="font-heading font-semibold text-[#63e6b6]">
              Passed
            </span>
          </div>
          <div className="flex items-center justify-between gap-2.5 py-[11px] text-[12px]">
            <span className="text-[#81998c]">Payment</span>
            <span className="font-heading font-semibold text-white">
              Held until completion
            </span>
          </div>
        </div>
      </div>

      {/* Orange "pay after service" seal */}
      <div className="absolute right-[6px] top-[-10px] z-20 flex size-[74px] rotate-[9deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-[#7d4c22]/40 bg-[#f0b46e] text-center text-[#5b3516] shadow-[0_10px_25px_rgba(93,56,20,0.18)] min-[861px]:right-[18px] min-[861px]:top-[-6px]">
        <ShieldCheck className="mb-1 size-4" />
        <span className="font-heading text-[9.5px] font-extrabold leading-[1.15] tracking-[0.06em]">
          PAY AFTER
          <br />
          SERVICE
        </span>
      </div>

      {/* Floating verification card */}
      <div
        data-float
        data-float-delay="-1.4"
        className="absolute left-0 top-2 z-20 flex w-fit items-center gap-2.5 rounded-[14px] border border-black/[0.06] bg-white/95 p-[10px_13px] shadow-[0_12px_30px_rgba(16,48,34,0.12)] backdrop-blur min-[861px]:left-[10px] min-[861px]:top-[-54px] dark:border-white/10 dark:bg-[#0a1711]/95"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#e3f7ec] dark:bg-[#102b20]">
          <ShieldCheck className="size-4 text-[#0c7b52] dark:text-[#63e6b6]" />
        </span>

        <div>
          <p className="font-heading text-[12px] font-bold leading-tight text-[#111814] dark:text-white">
            Technician verified
          </p>
          <p className="mt-0.5 text-[10.5px] text-[#748179] dark:text-[#91a69c]">
            ID + skills checked
          </p>
        </div>
      </div>

      {/* Floating payment card */}
      <div
        data-float
        data-float-delay="-3.2"
        className="absolute bottom-[18px] right-0 z-20 flex w-fit items-center gap-2.5 rounded-[14px] border border-black/[0.06] bg-white/95 p-[10px_13px] shadow-[0_12px_30px_rgba(16,48,34,0.10)] min-[861px]:bottom-[-68px] min-[861px]:right-[6px] dark:border-white/10 dark:bg-[#0a1711]/95"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#e6f6ec] dark:bg-[#102b20]">
          <CreditCard className="size-4 text-[#0c7b52] dark:text-[#63e6b6]" />
        </span>
        <div>
          <p className="font-heading text-[12px] font-bold leading-tight text-[#111814] dark:text-white">
            Secure payment
          </p>
          <p className="mt-0.5 text-[10.5px] text-[#748179] dark:text-[#91a69c]">
            Only when completed
          </p>
        </div>
      </div>

      {/* Floating arrival card */}
      <div
        data-float
        className="absolute bottom-[-68px] left-[30px] z-20 hidden w-fit items-center gap-2.5 rounded-[14px] border border-black/[0.06] bg-white/95 p-[10px_13px] shadow-[0_12px_30px_rgba(16,48,34,0.10)] min-[861px]:flex dark:border-white/10 dark:bg-[#0a1711]/95"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#e6f6ec] dark:bg-[#102b20]">
          <Clock className="size-4 text-[#0c7b52] dark:text-[#63e6b6]" />
        </span>
        <div>
          <p className="font-heading text-[12px] font-bold leading-tight text-[#111814] dark:text-white">
            2–3 hours
          </p>
          <p className="mt-0.5 text-[10.5px] text-[#748179] dark:text-[#91a69c]">
            Average arrival
          </p>
        </div>
      </div>
    </div>
  );
}
