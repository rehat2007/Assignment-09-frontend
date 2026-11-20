import { STATS } from "@/lib/home-data";

export function TrustBand() {
  return (
    <section className="py-[clamp(38px,4.5vw,60px)]">
      <div className="site-container">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[26px] bg-[#0b1713] p-[30px] min-[981px]:p-12"
        >
          <div className="pointer-events-none absolute -bottom-64 -right-24 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(80,215,175,0.16),transparent_66%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:22px_22px] opacity-20 [mask-image:linear-gradient(120deg,#000,transparent_55%)]" />

          <div className="relative z-10 grid gap-6 min-[981px]:grid-cols-[1.25fr_2fr] min-[981px]:items-center min-[981px]:gap-10">
            <div>
              <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#7de0bd]">
                <span className="h-px w-[18px] bg-current opacity-60" />
                Trust, measured
              </p>

              <h2 className="mt-3 max-w-[430px] font-heading text-[clamp(1.85rem,3.1vw,2.65rem)] font-extrabold leading-[1.02] tracking-[-0.038em] text-white">
                A repair platform that behaves like one.
              </h2>

              <p className="mt-3 max-w-[40ch] text-[14px] leading-[1.65] text-[#a9b8b0]">
                Every technician is reviewed before a listing goes live. Every
                job has a trail. Every payment waits for your confirmation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-2.5 gap-y-[18px] min-[981px]:grid-cols-4">
              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className={
                    index > 0
                      ? "min-[981px]:border-l min-[981px]:border-white/15 min-[981px]:px-4"
                      : "min-[981px]:pr-4"
                  }
                >
                  <p className="font-heading text-[26px] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-[32px]">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-[#a9b8b0]">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-[10.5px] font-semibold text-[#5ad19a]">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
