import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  House,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { HomeMotion } from "@/components/home-motion";
import { SiteFooter } from "@/components/site-footer";
import { SERVICES } from "@/lib/services";
import { CATEGORY_ICONS, CATEGORY_TONES, TONES } from "@/lib/service-styles";

type Props = {
  params: Promise<{ id: string }>;
};

async function getService(id: string) {
  return SERVICES.find((service) => service.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  return {
    title: service ? `${service.title} — FixMate` : "Service — FixMate",
    description: service?.description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) notFound();

  const Icon = CATEGORY_ICONS[service.category];
  const tone = TONES[CATEGORY_TONES[service.category]];
  const ModeIcon = service.mode === "Home Visit" ? House : Briefcase;

  return (
    <>
      <HomeMotion />

      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="mx-auto max-w-[1264px] px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 py-4 text-[12px] text-[#87948d]"
          >
            <Link href="/" className="hover:text-[#0f1a15] dark:hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href="/services"
              className="hover:text-[#0f1a15] dark:hover:text-white"
            >
              Services
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href={`/services?category=${encodeURIComponent(service.category)}`}
              className="hover:text-[#0f1a15] dark:hover:text-white"
            >
              {service.category}
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-[#27352f] dark:text-[#cfdbd3]">
              {service.title}
            </span>
          </nav>

          <div className="grid gap-8 pb-16 pt-2 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,0.9fr)] lg:items-start">
            <div data-reveal>
              <div
                className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[20px] border border-[#e5e1d6] ${tone.media} dark:border-white/[0.08]`}
              >
                <div className={`pointer-events-none absolute inset-0 ${tone.glow}`} />

                <span className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-[7px] border border-black/[0.06] bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-[#27352f] backdrop-blur dark:border-white/10 dark:bg-black/45 dark:text-white">
                  <BadgeCheck className="size-3.5 text-[#0e6b54] dark:text-[#43d3ab]" />
                  Approved listing
                </span>

                <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-[7px] bg-[#0c1713]/65 px-2.5 py-1.5 text-[10.5px] font-semibold text-[#eaf5ee] backdrop-blur">
                  <ModeIcon className="size-3" />
                  {service.mode}
                </span>

                <div
                  className={`relative flex size-[140px] items-center justify-center rounded-[36px] border sm:size-[160px] ${tone.tile}`}
                >
                  <Icon
                    className={`size-[64px] sm:size-[72px] ${tone.icon}`}
                    strokeWidth={1.6}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/services?category=${encodeURIComponent(service.category)}`}
                  className="flex h-[30px] items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-white px-3 text-[12.5px] text-[#27352f] dark:border-white/10 dark:bg-[#101a16] dark:text-[#cfdbd3]"
                >
                  <Icon className={`size-3.5 ${tone.icon}`} />
                  {service.category}
                </Link>
                <span className="flex h-[30px] items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-white px-3 text-[12.5px] text-[#27352f] dark:border-white/10 dark:bg-[#101a16] dark:text-[#cfdbd3]">
                  <ModeIcon className="size-3.5 text-[#87948d]" />
                  {service.mode}
                </span>
                <span className="flex h-[30px] items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-white px-3 text-[12.5px] text-[#27352f] dark:border-white/10 dark:bg-[#101a16] dark:text-[#cfdbd3]">
                  <MapPin className="size-3.5 text-[#87948d]" />
                  {service.location}
                </span>
              </div>

              <h1 className="mt-5 font-heading text-[1.8rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
                {service.title}
              </h1>

              <p className="mt-3 max-w-[65ch] text-[14px] leading-[1.75] text-[#27352f] dark:text-[#cfdbd3]">
                {service.description}
              </p>

              <section className="mt-9">
                <h2 className="flex items-center gap-2 font-heading text-[17px] font-bold text-[#0f1a15] dark:text-white">
                  <ShieldCheck className="size-4 text-[#0e6b54] dark:text-[#43d3ab]" />
                  Service details
                </h2>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Spec icon={<Clock className="size-4" />} label="Duration" value={service.duration} />
                  <Spec icon={<ModeIcon className="size-4" />} label="Service mode" value={service.mode} />
                  <Spec icon={<MapPin className="size-4" />} label="Area" value={service.location} />
                  <Spec
                    icon={<Star className="size-4 fill-[#eb9f34] text-[#eb9f34]" />}
                    label="Rating"
                    value={`${service.rating.toFixed(1)} · ${service.reviews} reviews`}
                  />
                </div>
              </section>

              <section className="mt-9 rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
                <h2 className="font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                  How it works
                </h2>
                <ul className="mt-3 grid gap-2.5 text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
                  {[
                    "Send a request with your area and preferred time.",
                    "The technician confirms the visit and final price.",
                    "Pay securely only after the repair is completed.",
                  ].map((step) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#0e6b54] dark:text-[#43d3ab]" />
                      {step}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="mt-9 flex flex-wrap items-center gap-4 rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
                <span className="flex size-12 items-center justify-center rounded-full bg-[#c9f5db] text-[13px] font-bold text-[#0b3b26]">
                  {service.technician
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
                    {service.technician}
                    <BadgeCheck className="size-4 text-[#0e6b54] dark:text-[#43d3ab]" />
                  </p>
                  <p className="mt-1 text-[12px] text-[#5f6f68] dark:text-[#9dab9f]">
                    Verified technician · {service.rating.toFixed(1)} rating from{" "}
                    {service.reviews} reviews
                  </p>
                </div>
              </div>

              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#0e6b54] hover:underline dark:text-[#43d3ab]"
              >
                <ArrowLeft className="size-4" />
                Back to all services
              </Link>
            </div>

            <aside data-reveal>
              <div className="rounded-2xl border border-[#e5e1d6] bg-white p-5 shadow-sm lg:sticky lg:top-[94px] dark:border-white/[0.08] dark:bg-[#101a16]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#87948d]">
                  Starting price
                </p>
                <p className="mt-1 flex items-baseline gap-2 font-heading text-[32px] font-extrabold tracking-[-0.04em] text-[#0f1a15] dark:text-white">
                  ${service.price}
                  <span className="text-[12px] font-medium text-[#87948d]">
                    from
                  </span>
                </p>

                <div className="mt-5 grid gap-3 border-y border-[#e5e1d6] py-4 text-[12.5px] dark:border-white/[0.08]">
                  <Row label="Service mode" value={service.mode} />
                  <Row label="Estimated time" value={service.duration} />
                  <Row label="Area" value={service.location} />
                  <Row label="Payment" value="After completion" />
                </div>

                <Link
                  href="/sign-in"
                  className="mt-5 flex h-12 items-center justify-center gap-2 rounded-[13px] bg-[#0e6b54] px-5 text-[14px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
                >
                  Request this service
                  <ArrowRight className="size-4" />
                </Link>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#87948d]">
                  <ShieldCheck className="size-3.5 text-[#0e6b54] dark:text-[#43d3ab]" />
                  You pay only after the job is completed
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e5e1d6] bg-white px-3.5 py-3 dark:border-white/[0.08] dark:bg-[#101a16]">
      <span className="flex size-9 items-center justify-center rounded-[9px] bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]">
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#87948d]">
          {label}
        </p>
        <p className="mt-0.5 text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[#5f6f68] dark:text-[#9dab9f]">{label}</span>
      <span className="text-right font-semibold text-[#0f1a15] dark:text-white">
        {value}
      </span>
    </div>
  );
}
