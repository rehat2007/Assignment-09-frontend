import { ArrowRight, Quote, Star } from "lucide-react";
import { cn } from "cn";

const REVIEWS = [
  {
    quote:
      "“I have been burned by \"technicians\" before. FixMate showed me the price, the person's profile and every status change. I paid after the washing machine actually spun again.”",
    name: "Nusrat Jahan",
    area: "Mohammadpur",
    initials: "NJ",
    avatar: "bg-[#f7d9dc] text-[#7a3138]",
  },
  {
    quote:
      "“The MacBook battery was swollen and I was quoted a scary price elsewhere. Sadia explained the part, did the job in a day, and the invoice matched the quote.”",
    name: "Mehedi Hasan",
    area: "Bashundhara",
    initials: "MH",
    avatar: "bg-[#f3e4c6] text-[#6b4c1f]",
  },
  {
    quote:
      "“Booked a PC upgrade at 11pm, got accepted by morning and picked up the same afternoon. The status tracker is such a simple but brilliant idea.”",
    name: "Farhan Kabir",
    area: "Uttara",
    initials: "FK",
    avatar: "bg-[#e4e2fb] text-[#45407a]",
  },
];

const EYEBROW_CLASSES =
  "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3fae80] dark:text-[#5be0a5]";

function RatingStars({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-0.5 text-[#f0b23c]", className)}
      aria-label="Rated 5 out of 5 stars"
    >
      {[0, 1, 2, 3, 4].map((star) => (
        <Star key={star} className="size-3.5 fill-current" strokeWidth={1.5} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-[68px]">
      <div className="mx-auto max-w-[1280px] px-5 pb-24 pt-4 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <p className={EYEBROW_CLASSES}>
              <span className="h-px w-7 bg-current" />
              From our customers
            </p>

            <h2 className="mt-4 max-w-[560px] font-heading text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-[#0b1510] sm:text-[3rem] dark:text-white">
              Repairs people actually recommend.
            </h2>
          </div>

          <div className="flex items-center gap-2.5 md:pb-2">
            <RatingStars />
            <p className="text-[12px] text-[#5c6861] dark:text-[#8fa39a]">
              4.9 average across Dhaka
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col rounded-xl border border-black/[0.07] bg-white p-6 dark:border-white/[0.07] dark:bg-[#0a1611]"
            >
              <div className="flex items-start justify-between gap-4">
                <RatingStars />
                <Quote
                  className="size-5 shrink-0 -scale-x-100 text-black/10 dark:text-white/15"
                  strokeWidth={1.5}
                />
              </div>

              <blockquote className="mt-4 text-[13.5px] leading-[1.7] text-[#4b5851] dark:text-[#c3d0c9]">
                {review.quote}
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3 pt-6">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    review.avatar,
                  )}
                >
                  {review.initials}
                </span>

                <div>
                  <p className="text-[13px] font-semibold text-[#0b1510] dark:text-white">
                    {review.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#66736c] dark:text-[#8fa39a]">
                    {review.area} · Verified customer
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Technician recruitment panel */}
        <div className="relative mt-24 overflow-hidden rounded-2xl border border-black/[0.07] bg-[linear-gradient(120deg,#f3f5ee_0%,#e8f2ea_55%,#e1efe7_100%)] px-6 py-10 sm:px-12 sm:py-14 lg:mt-40 dark:border-white/[0.06] dark:bg-[linear-gradient(115deg,#0b1a13_0%,#0a1510_45%,#08110d_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(60,190,140,0.14),transparent_55%)]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div>
              <p className={EYEBROW_CLASSES}>
                <span className="h-px w-7 bg-current" />
                Technicians welcome
              </p>

              <h3 className="mt-3 max-w-[600px] font-heading text-[1.7rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#0b1510] sm:text-[1.9rem] dark:text-white">
                Good at fixing things? Get paid on time.
              </h3>

              <p className="mt-3 max-w-[400px] text-[13px] leading-[1.65] text-[#5c6861] dark:text-[#8fa39a]">
                List your services, set your own area and manage every request
                from one dashboard. No listing fee, no commission on your first
                five jobs.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-[10px] border border-black/15 px-6 py-3 text-[13.5px] font-semibold text-[#1b2922] transition-colors hover:bg-black/[0.04] dark:border-white/20 dark:text-white dark:hover:bg-white/[0.06]"
              >
                How it works
              </a>

              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#0c7b52] px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_6px_16px_rgba(12,123,82,0.2)] transition-colors hover:bg-[#09593c] dark:bg-[#5be0a5] dark:text-[#04251a] dark:shadow-[0_0_18px_rgba(91,224,165,0.18)] dark:hover:bg-[#7cf0c6]"
              >
                Join as a technician
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
