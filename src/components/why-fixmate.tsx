import { WHY_REASONS } from "@/lib/home-data";

export function WhyFixmate() {
  return (
    <div id="why-fixmate" className="mt-6 scroll-mt-[74px]">
      <div data-reveal className="mb-[22px]">
        <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
          <span className="h-px w-[18px] bg-current opacity-60" />
          Why FixMate
        </p>

        <h2 className="mt-3 max-w-[640px] font-heading text-[clamp(1.5rem,2.3vw,2rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0f1a15] dark:text-white">
          Built around the part everyone else skips: trust.
        </h2>
      </div>

      <div
        data-reveal-group
        className="grid grid-cols-1 gap-4 min-[761px]:grid-cols-2 min-[981px]:grid-cols-3"
      >
        {WHY_REASONS.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="flex flex-col gap-[11px] rounded-2xl border border-[#e5e1d6] bg-white p-[22px] dark:border-white/[0.08] dark:bg-[#101a16]"
          >
            <span className="flex size-10 items-center justify-center rounded-[11px] bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
              <Icon className="size-5" strokeWidth={1.9} />
            </span>

            <h3 className="font-heading text-[14.5px] font-bold leading-[1.12] text-[#0f1a15] dark:text-white">
              {title}
            </h3>
            <p className="text-[12.8px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
              {description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
