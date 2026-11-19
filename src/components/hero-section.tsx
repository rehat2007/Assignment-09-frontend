import {
  ChevronDown,
  CircleCheck,
  LayoutGrid,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { cn } from "cn";
import { RepairVisual } from "@/components/repair-visual";

const AVATARS = [
  { initials: "RH", color: "bg-[#cf6d6c]" },
  { initials: "SI", color: "bg-[#6f8fb8]" },
  { initials: "NC", color: "bg-[#4f9a86]" },
  { initials: "AR", color: "bg-[#c3a05e]" },
];

const TRUST_ITEMS = [
  "Background-checked pros",
  "Fixed price, no surprises",
  "30-day workmanship cover",
];

export function HeroSection() {
  return (
    <section className="relative z-10">
      <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-8 lg:pb-20 lg:pt-8">
        {/* Left side: headline, search and trust signals */}
        <div className="lg:pt-11">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/60 px-3.5 py-2 text-[12px] font-medium text-[#2b3831] shadow-[0_2px_8px_rgba(16,48,34,0.03)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-[#d6e4dc]">
            <ShieldCheck className="size-4 text-[#0c7b52] dark:text-[#63e6b6]" />
            <span>Verified technicians</span>
            <span className="text-[#9aa79f] dark:text-[#5f7a6d]">·</span>
            <span className="text-[#66736c] dark:text-[#91a69c]">
              pay after the fix
            </span>
          </div>

          <h1 className="mt-5 max-w-[650px] font-heading text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.05em] text-[#0b1510] min-[380px]:text-[2.8rem] sm:text-[3.7rem] lg:text-[4.1rem] xl:text-[4.35rem] dark:text-white">
            Broken device?
            <br />
            Get it{" "}
            <span className="relative inline-block text-[#0f8a5f] dark:text-[#63e6b6]">
              fixed
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-3 w-[108%] overflow-visible text-[#f0b46e] dark:text-[#f2b56e]"
                viewBox="0 0 150 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 8C38 3 89 2 147 6"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            by a pro.
          </h1>

          <p className="mt-6 max-w-[515px] text-[16px] leading-[1.65] text-[#5c6861] sm:text-[17px] dark:text-[#97a9a0]">
            Phones, laptops, ACs, fridges, washing machines and wiring
            <br className="hidden sm:block" /> — booked in minutes, tracked at
            every step, and paid for only when the repair is done.
          </p>

          <form
            action="/#services"
            className="mt-7 flex max-w-[600px] flex-col gap-2 rounded-2xl border border-black/[0.08] bg-white/95 p-2 shadow-[0_18px_50px_rgba(24,56,39,0.09)] sm:flex-row sm:items-center sm:gap-0 sm:p-1.5 dark:border-[#1d4c38] dark:bg-[#07130d]/95 dark:shadow-[0_0_0_1px_rgba(46,180,126,0.06),0_0_34px_rgba(32,160,112,0.12)]"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search className="size-4 shrink-0 text-[#8a968f] dark:text-[#769184]" />
              <input
                type="search"
                name="q"
                aria-label="What needs fixing?"
                placeholder="What needs fixing?"
                className="h-11 w-full min-w-0 bg-transparent text-sm text-[#1b2922] outline-none placeholder:text-[#7e8b84] dark:text-white dark:placeholder:text-[#7f9a8c]"
              />
            </div>

            <span className="hidden h-7 w-px bg-black/10 sm:block dark:bg-white/10" />

            <div className="relative flex items-center gap-2 px-3">
              <LayoutGrid className="size-4 shrink-0 text-[#8a968f] dark:text-[#769184]" />
              <select
                name="category"
                aria-label="Category"
                defaultValue="all"
                className="h-11 w-full cursor-pointer appearance-none bg-transparent pr-6 text-sm font-medium text-[#415049] outline-none sm:w-[130px] dark:text-[#b6c8be] dark:[&>option]:bg-[#07130d]"
              >
                <option value="all">All categories</option>
                <option value="phone">Phone repair</option>
                <option value="laptop">Laptop repair</option>
                <option value="ac">AC repair</option>
                <option value="appliance">Appliance repair</option>
                <option value="electrical">Electrical</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 size-4 text-[#8a968f] dark:text-[#769184]" />
            </div>

            <button
              type="submit"
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0b6b47] px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(11,107,71,0.2)] transition-colors hover:bg-[#09593c] dark:bg-[#63e6b6] dark:text-[#04251a] dark:hover:bg-[#7cf0c6]"
            >
              <Search className="size-4" />
              Find a technician
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex -space-x-2.5">
              {AVATARS.map((avatar) => (
                <span
                  key={avatar.initials}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-[#f6f5f0] dark:ring-[#04100b]",
                    avatar.color,
                  )}
                >
                  {avatar.initials}
                </span>
              ))}
            </div>

            <div>
              <div
                className="flex items-center gap-0.5 text-[#f0b46e]"
                aria-label="Rated 4.9 out of 5 stars"
              >
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className="size-3 fill-current"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="mt-1 text-[12px] text-[#5d6962] dark:text-[#93a69c]">
                <span className="font-bold text-[#111814] dark:text-white">
                  4.9/5
                </span>{" "}
                from 2,400+ completed repairs
              </p>
            </div>
          </div>

          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12px] font-medium text-[#5a6760] dark:text-[#8fa39a]">
            {TRUST_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CircleCheck className="size-4 shrink-0 text-[#0c7b52] dark:text-[#63e6b6]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: product illustration */}
        <div className="mt-4 lg:mt-0">
          <RepairVisual />
        </div>
      </div>
    </section>
  );
}
