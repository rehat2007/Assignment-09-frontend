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

export function HeroSection({ categories }: { categories: string[] }) {
  return (
    <section className="relative z-10">
      <div className="site-container grid items-center gap-[18px] pt-[clamp(32px,4vw,46px)] pb-[clamp(44px,5vw,68px)] min-[861px]:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] min-[861px]:gap-7 min-[1101px]:gap-[56px]">
        {/* Left side: headline, search and trust signals */}
        <div data-hero className="flex flex-col gap-5 py-3 min-[861px]:py-6">
          <div className="inline-flex w-fit items-center gap-[9px] rounded-full border border-[#e5e1d6] bg-white py-1.5 pl-[7px] pr-[13px] text-[12.5px] font-medium text-[#27352f] shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-[#d6e4dc]">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
              <ShieldCheck className="size-3" />
            </span>
            <span className="font-bold">Verified technicians</span>
            <span className="text-[#9aa79f] dark:text-[#5f7a6d]">·</span>
            <span className="text-[#66736c] dark:text-[#91a69c]">
              pay after the fix
            </span>
          </div>

          <h1 className="max-w-[650px] font-heading text-[clamp(2.5rem,4.5vw,3.85rem)] font-extrabold leading-[1.015] tracking-[-0.045em] text-[#0f1a15] dark:text-white">
            Broken device?
            <br />
            Get it{" "}
            <span className="relative inline-block text-[#0e6b54] dark:text-[#63e6b6]">
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

          <p className="max-w-[46ch] text-[clamp(14.5px,1.3vw,16.5px)] leading-[1.65] text-[#5c6861] dark:text-[#97a9a0]">
            Phones, laptops, ACs, fridges, washing machines and wiring
            <br className="hidden sm:block" /> — booked in minutes, tracked at
            every step, and paid for only when the repair is done.
          </p>

          <form
            action="/services"
            method="get"
            role="search"
            className="flex max-w-[560px] flex-col gap-1.5 rounded-[15px] border border-[#e5e1d6] bg-white p-1.5 shadow-[0_18px_50px_rgba(24,56,39,0.09)] focus-within:border-[#0e6b54] min-[721px]:flex-row min-[721px]:items-center min-[721px]:gap-1.5 dark:border-[#1d4c38] dark:bg-[#07130d]/95 dark:shadow-[0_0_0_1px_rgba(46,180,126,0.06),0_0_34px_rgba(32,160,112,0.12)]"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search className="size-4 shrink-0 text-[#8a968f] dark:text-[#769184]" />
              <input
                type="search"
                name="q"
                aria-label="What needs fixing?"
                placeholder="What needs fixing?"
                className="h-10 w-full min-w-0 bg-transparent text-sm text-[#1b2922] outline-none placeholder:text-[#7e8b84] dark:text-white dark:placeholder:text-[#7f9a8c]"
              />
            </div>

            <span className="hidden h-6 w-px bg-black/10 min-[721px]:block dark:bg-white/10" />

            <div className="relative flex items-center gap-2 px-3">
              <LayoutGrid className="size-4 shrink-0 text-[#8a968f] dark:text-[#769184]" />
              <select
                name="category"
                aria-label="Category"
                defaultValue=""
                className="h-10 w-full cursor-pointer appearance-none bg-transparent pr-6 text-[13.5px] text-[#5f6f68] outline-none min-[721px]:w-[130px] dark:text-[#b6c8be] dark:[&>option]:bg-[#07130d]"
              >
                <option value="">All categories</option>
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 size-4 text-[#8a968f] dark:text-[#769184]" />
            </div>

            <button
              type="submit"
              className="flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-[11px] bg-[#0e6b54] px-[18px] text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(11,107,71,0.2)] transition-colors hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
            >
              <Search className="size-4" />
              Find a technician
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex -space-x-2.5">
              {AVATARS.map((avatar) => (
                <span
                  key={avatar.initials}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-[#f6f4ee] dark:ring-[#080f0c]",
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
                    className="size-[13px] fill-current"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="mt-0.5 text-[12.5px] leading-[1.35] text-[#5d6962] dark:text-[#93a69c]">
                <span className="font-bold text-[#111814] dark:text-white">
                  4.9/5
                </span>{" "}
                from 2,400+ completed repairs
              </p>
            </div>
          </div>

          <ul className="flex flex-wrap items-center gap-x-[18px] gap-y-2.5 text-[12.5px] font-medium text-[#5a6760] dark:text-[#8fa39a]">
            {TRUST_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CircleCheck className="size-[15px] shrink-0 text-[#0e6b54] dark:text-[#63e6b6]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: product illustration */}
        <div data-hero-art>
          <RepairVisual />
        </div>
      </div>
    </section>
  );
}
