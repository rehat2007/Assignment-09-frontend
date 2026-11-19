import Link from "next/link";
import { ArrowRight, BadgeCheck, Briefcase, Clock, House, MapPin, Star } from "lucide-react";
import type { Service } from "@/lib/services";
import { CATEGORY_ICONS, CATEGORY_TONES, TONES } from "@/lib/service-styles";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function ServiceCard({ service }: { service: Service }) {
  const Icon = CATEGORY_ICONS[service.category];
  const tone = TONES[CATEGORY_TONES[service.category]];
  const ModeIcon = service.mode === "Home Visit" ? House : Briefcase;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[18px] border border-[#e5e1d6] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(15,26,21,0.35)] dark:border-white/[0.08] dark:bg-[#101a16]">
      <div
        className={`relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-black/[0.06] ${tone.media}`}
      >
        <div className={`pointer-events-none absolute inset-0 ${tone.glow}`} />

        <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-[7px] border border-black/[0.06] bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-[#27352f] backdrop-blur dark:border-white/10 dark:bg-black/45 dark:text-white">
          <Icon className={`size-3 ${tone.icon}`} />
          {service.category}
        </span>

        <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-[7px] bg-[#0c1713]/65 px-2.5 py-1.5 text-[10.5px] font-semibold text-[#eaf5ee] backdrop-blur">
          <ModeIcon className="size-3" />
          {service.mode}
        </span>

        <div
          className={`relative flex size-[88px] items-center justify-center rounded-3xl border transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-3deg] ${tone.tile}`}
        >
          <Icon className={`size-10 ${tone.icon}`} strokeWidth={1.7} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4 pt-3.5">
        <h3 className="line-clamp-2 min-h-[40px] font-heading text-[15.5px] font-bold leading-snug tracking-[-0.022em] text-[#0f1a15] dark:text-white">
          {service.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
          <span className="flex items-center gap-1">
            <MapPin className="size-3 text-[#87948d]" />
            {service.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3 text-[#87948d]" />
            {service.duration}
          </span>
          <span className="flex items-center gap-1 font-semibold text-[#27352f] dark:text-white">
            <Star className="size-3 fill-[#eb9f34] text-[#eb9f34]" />
            {service.rating.toFixed(1)}
            <span className="font-normal text-[#87948d]">
              ({service.reviews})
            </span>
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
          <span className="flex size-5 items-center justify-center rounded-full bg-[#c9f5db] text-[9px] font-bold text-[#0b3b26]">
            {initials(service.technician)}
          </span>
          {service.technician}
          <BadgeCheck className="size-3.5 text-[#0e6b54] dark:text-[#43d3ab]" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#e5e1d6] bg-[#fbfaf6] px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <p className="flex items-baseline gap-1.5 font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
          <span className="text-[11px] font-semibold text-[#5f6f68] dark:text-[#9dab9f]">
            from
          </span>
          ${service.price}
        </p>

        <Link
          href={`/services/${service.id}`}
          className="flex items-center gap-1.5 rounded-[9px] border border-[#d2ccbc] bg-white px-3 py-2 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/[0.06]"
        >
          View details
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
