import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/home-data";

function Stars() {
  return (
    <div
      className="flex min-h-[25px] items-center gap-0.5 text-[#eb9f34]"
      aria-label="Rated 5 out of 5 stars"
    >
      {[0, 1, 2, 3, 4].map((star) => (
        <Star key={star} className="size-[13px] fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-[74px] py-[clamp(38px,4.5vw,60px)]"
    >
      <div className="site-container">
        <div className="flex flex-col gap-7 min-[761px]:flex-row min-[761px]:flex-wrap min-[761px]:items-end min-[761px]:justify-between">
          <div data-reveal>
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
              <span className="h-px w-[18px] bg-current opacity-60" />
              From our customers
            </p>

            <h2 className="mt-3 max-w-[640px] font-heading text-[clamp(1.85rem,3.1vw,2.65rem)] font-extrabold leading-[1.02] tracking-[-0.038em] text-[#0f1a15] dark:text-white">
              Repairs people actually recommend.
            </h2>
          </div>

          <div className="flex items-center gap-2.5 min-[861px]:pb-2">
            <Stars />
            <p className="text-[12.5px] text-[#5f6f68] dark:text-[#9dab9f]">
              4.9 average across Dhaka
            </p>
          </div>
        </div>

        <div
          data-reveal-group
          className="mt-[34px] grid grid-cols-1 gap-4 min-[761px]:grid-cols-2 min-[761px]:gap-[18px] min-[981px]:grid-cols-3"
        >
          {TESTIMONIALS.map((review) => (
            <figure
              key={review.name}
              className="relative flex flex-col gap-3.5 rounded-2xl border border-[#e5e1d6] bg-white p-[22px] min-[981px]:min-h-[239px] dark:border-white/[0.08] dark:bg-[#101a16]"
            >
              <Quote className="absolute right-[18px] top-4 size-[26px] text-[#d2ccbc] dark:text-white/20" />

              <Stars />

              <blockquote className="text-[13.5px] leading-[1.65] text-[#27352f] dark:text-[#cfdbd3]">
                “{review.quote}”
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-2.5 pt-1.5">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${review.avatar}`}
                >
                  {review.initials}
                </span>

                <div>
                  <p className="font-heading text-[12.5px] font-bold text-[#0f1a15] dark:text-white">
                    {review.name}
                  </p>
                  <p className="text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                    {review.area} · Verified customer
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
