import {
  ArrowRight,
  BadgeCheck,
  Clock,
  House,
  Laptop,
  MapPin,
  Plug,
  Refrigerator,
  Snowflake,
  Star,
  WashingMachine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

const TONES = {
  amber: {
    media:
      "bg-[linear-gradient(155deg,#f9eeda_0%,#f4e3c6_48%,#f0e7d5_100%)] dark:bg-[linear-gradient(155deg,#3d2c0e_0%,#241a09_46%,#0b0a06_100%)]",
    glow: "bg-[radial-gradient(circle_at_50%_58%,rgba(240,170,70,0.28),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_58%,rgba(240,170,70,0.18),transparent_62%)]",
    icon: "text-[#a9690c] dark:text-[#f2b25c]",
    tile: "border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(163,105,20,0.18)] dark:border-white/[0.07] dark:bg-[#0d0c08] dark:shadow-[0_0_50px_rgba(240,170,70,0.20)]",
  },
  violet: {
    media:
      "bg-[linear-gradient(155deg,#f4ecff_0%,#e8dafc_48%,#efe8fb_100%)] dark:bg-[linear-gradient(155deg,#291a40_0%,#150f22_46%,#09070e_100%)]",
    glow: "bg-[radial-gradient(circle_at_50%_58%,rgba(139,92,246,0.26),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_58%,rgba(139,92,246,0.18),transparent_62%)]",
    icon: "text-[#7434dc] dark:text-[#c084fc]",
    tile: "border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(116,52,220,0.18)] dark:border-white/[0.07] dark:bg-[#0d0a12] dark:shadow-[0_0_50px_rgba(139,92,246,0.20)]",
  },
  sky: {
    media:
      "bg-[linear-gradient(155deg,#ecf4ff_0%,#dbeafa_48%,#e8eefb_100%)] dark:bg-[linear-gradient(155deg,#122a3d_0%,#0a1723_46%,#070f14_100%)]",
    glow: "bg-[radial-gradient(circle_at_50%_58%,rgba(56,145,235,0.26),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_58%,rgba(96,165,250,0.20),transparent_62%)]",
    icon: "text-[#1c6dc9] dark:text-[#74b8ff]",
    tile: "border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(28,109,201,0.16)] dark:border-white/[0.07] dark:bg-[#080f16] dark:shadow-[0_0_50px_rgba(96,165,250,0.18)]",
  },
  teal: {
    media:
      "bg-[linear-gradient(155deg,#e9f7f2_0%,#d9eee6_48%,#e9f2ee_100%)] dark:bg-[linear-gradient(155deg,#0d2b22_0%,#081a14_46%,#06110d_100%)]",
    glow: "bg-[radial-gradient(circle_at_50%_58%,rgba(16,170,130,0.24),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_58%,rgba(45,212,168,0.18),transparent_62%)]",
    icon: "text-[#0c7b5b] dark:text-[#5ee0b4]",
    tile: "border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(12,123,91,0.16)] dark:border-white/[0.07] dark:bg-[#071310] dark:shadow-[0_0_50px_rgba(45,212,168,0.18)]",
  },
  slate: {
    media:
      "bg-[linear-gradient(155deg,#eef1f5_0%,#e0e6ee_48%,#eceff3_100%)] dark:bg-[linear-gradient(155deg,#1b2530_0%,#0e151d_46%,#080d10_100%)]",
    glow: "bg-[radial-gradient(circle_at_50%_58%,rgba(100,130,160,0.22),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_58%,rgba(148,180,210,0.16),transparent_62%)]",
    icon: "text-[#42566a] dark:text-[#a7c0d6]",
    tile: "border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(66,86,106,0.16)] dark:border-white/[0.07] dark:bg-[#0a0f14] dark:shadow-[0_0_50px_rgba(148,180,210,0.15)]",
  },
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Electrical: Zap,
  "Washing Machine": WashingMachine,
  AC: Snowflake,
  Refrigerator: Refrigerator,
  "Laptop & PC": Laptop,
};

type Service = {
  category: string;
  title: string;
  location: string;
  duration: string;
  rating: string;
  reviews: number;
  provider: { initials: string; name: string };
  price: number;
  icon: LucideIcon;
  tone: keyof typeof TONES;
};

const SERVICES: Service[] = [
  {
    category: "Electrical",
    title: "CCTV Camera Setup (4 cameras)",
    location: "Uttara, Dhaka",
    duration: "1 day",
    rating: "4.8",
    reviews: 19,
    provider: { initials: "NC", name: "Nayeem Chowdhury" },
    price: 75,
    icon: Plug,
    tone: "amber",
  },
  {
    category: "Electrical",
    title: "Ceiling Fan Installation",
    location: "Mirpur, Dhaka",
    duration: "1 hour",
    rating: "4.6",
    reviews: 41,
    provider: { initials: "NC", name: "Nayeem Chowdhury" },
    price: 18,
    icon: Plug,
    tone: "amber",
  },
  {
    category: "Washing Machine",
    title: "Washing Machine Motor Repair",
    location: "Uttara, Dhaka",
    duration: "1 day",
    rating: "4.7",
    reviews: 33,
    provider: { initials: "NC", name: "Nayeem Chowdhury" },
    price: 58,
    icon: WashingMachine,
    tone: "violet",
  },
  {
    category: "AC",
    title: "AC Deep Cleaning & Gas Refill",
    location: "Dhanmondi, Dhaka",
    duration: "2 hours",
    rating: "4.9",
    reviews: 27,
    provider: { initials: "RH", name: "Rakib Hasan" },
    price: 42,
    icon: Snowflake,
    tone: "sky",
  },
  {
    category: "Refrigerator",
    title: "Refrigerator Compressor Repair",
    location: "Mirpur, Dhaka",
    duration: "1 day",
    rating: "4.8",
    reviews: 22,
    provider: { initials: "SI", name: "Sadia Islam" },
    price: 65,
    icon: Refrigerator,
    tone: "teal",
  },
  {
    category: "Laptop & PC",
    title: "Laptop Screen Replacement",
    location: "Gulshan, Dhaka",
    duration: "1 day",
    rating: "4.9",
    reviews: 35,
    provider: { initials: "AR", name: "Amina Rahman" },
    price: 80,
    icon: Laptop,
    tone: "slate",
  },
];

export function LatestServices() {
  return (
    <section id="services" className="scroll-mt-[68px]">
      <div className="mx-auto max-w-[1280px] px-5 pb-24 pt-20 sm:px-8 lg:pt-24">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3fae80] dark:text-[#5be0a5]">
          <span className="h-px w-7 bg-current" />
          Latest services
        </p>

        <h2 className="mt-4 max-w-[560px] font-heading text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-[#0b1510] sm:text-[3rem] dark:text-white">
          Fresh from our verified technicians.
        </h2>

        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <p className="max-w-[620px] text-[16px] leading-[1.7] text-[#5c6861] sm:text-[17px] dark:text-[#97a9a0]">
            The six newest approved listings on FixMate. Same card size, same
            clear pricing — pick one and see the full breakdown.
          </p>

          <a
            href="#services"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-[10px] border border-black/15 px-4 py-3 text-[13px] font-semibold text-[#1b2922] transition-colors hover:bg-black/[0.04] md:self-auto dark:border-white/20 dark:text-white dark:hover:bg-white/[0.06]"
          >
            Browse all 15 services
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const tone = TONES[service.tone];
            const CategoryIcon = CATEGORY_ICONS[service.category];
            const ServiceIcon = service.icon;

            return (
              <article
                key={service.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_2px_12px_rgba(20,50,35,0.04)] dark:border-white/[0.08] dark:bg-[#07120d] dark:shadow-none"
              >
                {/* Tinted preview panel */}
                <div
                  className={cn(
                    "relative flex h-[250px] items-center justify-center border-b border-black/[0.06] px-4 sm:h-[276px] dark:border-white/[0.06]",
                    tone.media,
                  )}
                >
                  <div className={cn("pointer-events-none absolute inset-0", tone.glow)} />

                  <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                    <span className="flex items-center gap-1.5 rounded-[7px] border border-black/[0.06] bg-white/80 px-2.5 py-1.5 text-[10.5px] font-semibold text-[#2b3831] backdrop-blur-sm dark:border-white/10 dark:bg-black/45 dark:text-white">
                      <CategoryIcon className={cn("size-3.5", tone.icon)} />
                      {service.category}
                    </span>

                    <span className="flex items-center gap-1.5 rounded-[7px] border border-black/[0.06] bg-white/80 px-2.5 py-1.5 text-[10.5px] font-semibold text-[#2b3831] backdrop-blur-sm dark:border-white/10 dark:bg-black/45 dark:text-white">
                      <House className="size-3" />
                      Home Visit
                    </span>
                  </div>

                  <div
                    className={cn(
                      "relative flex size-[84px] items-center justify-center rounded-[22px] border",
                      tone.tile,
                    )}
                  >
                    <ServiceIcon className={cn("size-9", tone.icon)} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[17px] font-bold leading-snug text-[#0b1510] dark:text-white">
                    {service.title}
                  </h3>

                  <div className="mt-5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11.5px] text-[#66736c] dark:text-[#8fa39a]">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {service.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {service.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5 fill-[#f0b23c] text-[#f0b23c]" />
                      <span className="font-semibold text-[#1b2922] dark:text-white">
                        {service.rating}
                      </span>
                      <span>({service.reviews})</span>
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#c9f5db] text-[9px] font-bold text-[#0b3b26]">
                      {service.provider.initials}
                    </span>
                    <span className="text-[12px] font-medium text-[#34413a] dark:text-[#c9d8d0]">
                      {service.provider.name}
                    </span>
                    <BadgeCheck className="size-3.5 fill-[#3ddc97] text-[#07130d]" />
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-black/[0.07] pt-5 dark:border-white/[0.07]">
                    <p className="text-[11px] text-[#66736c] dark:text-[#8fa39a]">
                      from{" "}
                      <span className="ml-1 text-[17px] font-bold text-[#0b1510] dark:text-white">
                        ${service.price}
                      </span>
                    </p>

                    <a
                      href="#services"
                      className="group flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-[12px] font-semibold text-[#28342d] transition-colors hover:bg-black/[0.04] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06]"
                    >
                      View details
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
