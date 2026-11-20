import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  House,
  Info,
  Lock,
  MapPin,
  ShieldCheck,
  Star,
  UserRound,
  Wrench,
} from "lucide-react";
import { HomeMotion } from "@/components/home-motion";
import { SiteFooter } from "@/components/site-footer";
import { getAppRole, getSession } from "@/lib/authz";
import { getServiceBySlug, getServiceReviews } from "@/lib/catalog";
import { formatDate } from "@/lib/customer-data";
import { CATEGORY_ICONS, CATEGORY_TONES, TONES } from "@/lib/service-styles";

// Placeholder until Phase 8 replaces this with an aggregation over reviews.
const REVIEW_DISTRIBUTION = [78, 14, 5, 2, 1];

type Props = {
  params: Promise<{ id: string }>;
};

async function getService(id: string) {
  return getServiceBySlug(id);
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

  const reviews = (await getServiceReviews(id, { pageSize: 3 })).data;
  const session = await getSession();
  const user = session?.user ?? null;
  const role = user ? getAppRole(user) : null;
  const blocked = Boolean(user && role !== "customer");
  const Icon = CATEGORY_ICONS[service.category];
  const tone = TONES[CATEGORY_TONES[service.category]];
  const ModeIcon = service.mode === "Home Visit" ? House : Briefcase;
  const initials = service.technician
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <HomeMotion />

      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="site-container pt-[18px]">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-[7px] text-[12px] text-[#87948d]"
          >
            <Link href="/" className="transition-colors hover:text-[#0e6b54] dark:hover:text-[#63e6b6]">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href="/services"
              className="transition-colors hover:text-[#0e6b54] dark:hover:text-[#63e6b6]"
            >
              Services
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href={`/services?category=${encodeURIComponent(service.category)}`}
              className="transition-colors hover:text-[#0e6b54] dark:hover:text-[#63e6b6]"
            >
              {service.category}
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-[#27352f] dark:text-[#cfdbd3]">
              {service.title}
            </span>
          </nav>
        </div>

        <div className="site-container grid gap-[34px] pb-[60px] pt-8 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,0.9fr)] lg:items-start">
          <div data-reveal>
            <div
              className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[20px] border ${tone.media} dark:border-white/[0.08]`}
            >
              <div className="pointer-events-none absolute inset-0 bg-transparent dark:bg-[#04100b]/35" />
              <div className={`pointer-events-none absolute inset-0 ${tone.glow}`} />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(15,26,21,0.14)_1px,transparent_1px)] bg-[size:18px_18px] opacity-40 [mask-image:radial-gradient(circle_at_22%_78%,#000,transparent_62%)] dark:bg-[radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)]" />

              <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-[6px] bg-[#e2f4e9] px-2.5 py-1.5 text-[10.5px] font-semibold text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]">
                <span className="size-1.5 rounded-full bg-current" />
                Approved
              </span>

              <div
                className={`relative z-[1] flex size-[120px] items-center justify-center rounded-[32px] border sm:size-[150px] sm:rounded-[38px] ${tone.tile}`}
              >
                <Icon
                  className={`size-[56px] sm:size-[72px] ${tone.icon}`}
                  strokeWidth={1.6}
                />
              </div>

              <span className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-[7px] rounded-[9px] border border-[#e5e1d6] bg-white/90 px-3 py-[7px] text-[11.5px] font-semibold text-[#27352f] backdrop-blur dark:border-white/10 dark:bg-[#0c1713]/80 dark:text-[#eaf5ee]">
                <ShieldCheck className="size-[13px] text-[#0e6b54] dark:text-[#43d3ab]" />
                Admin-approved listing
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              <Link
                href={`/services?category=${encodeURIComponent(service.category)}`}
                className="inline-flex h-[30px] items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-white px-3 text-[12.5px] text-[#27352f] transition-colors hover:border-[#d2ccbc] dark:border-white/10 dark:bg-[#101a16] dark:text-[#cfdbd3]"
              >
                <Icon className={`size-3.5 ${tone.icon}`} />
                {service.category}
              </Link>
              <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-white px-3 text-[12.5px] text-[#27352f] dark:border-white/10 dark:bg-[#101a16] dark:text-[#cfdbd3]">
                <ModeIcon className="size-3.5 text-[#87948d]" />
                {service.mode}
              </span>
              <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-white px-3 text-[12.5px] text-[#27352f] dark:border-white/10 dark:bg-[#101a16] dark:text-[#cfdbd3]">
                <MapPin className="size-3.5 text-[#87948d]" />
                {service.location}
              </span>
              <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-white px-3 text-[12.5px] text-[#27352f] dark:border-white/10 dark:bg-[#101a16] dark:text-[#cfdbd3]">
                <Star className="size-3.5 fill-[#eb9f34] text-[#eb9f34]" />
                {service.rating.toFixed(1)} · {service.reviews} reviews
              </span>
            </div>

            <h1 className="mt-[22px] font-heading text-[clamp(2.2rem,3.2vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.038em] text-[#0f1a15] dark:text-white">
              {service.title}
            </h1>

            <p className="mt-3 text-[14px] leading-[1.75] text-[#27352f] dark:text-[#cfdbd3]">
              {service.description}
            </p>

            <section className="mt-[30px]">
              <h2 className="mb-3 flex items-center gap-[9px] font-heading text-[17px] font-bold text-[#0f1a15] dark:text-white">
                <CheckCircle2 className="size-[17px] text-[#0e6b54] dark:text-[#43d3ab]" />
                What&apos;s included
              </h2>
              <div className="grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-[9px] text-[13.5px] text-[#27352f] dark:text-[#cfdbd3]"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-[#0e6b54] dark:text-[#43d3ab]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-[30px]">
              <h2 className="mb-3 flex items-center gap-[9px] font-heading text-[17px] font-bold text-[#0f1a15] dark:text-white">
                <Info className="size-[17px] text-[#0e6b54] dark:text-[#43d3ab]" />
                Service details
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Spec
                  icon={<CreditCard className="size-4" />}
                  label="Starting price"
                  value={`$${service.price}`}
                />
                <Spec
                  icon={<Clock className="size-4" />}
                  label="Estimated duration"
                  value={service.duration}
                />
                <Spec
                  icon={<ModeIcon className="size-4" />}
                  label="Service mode"
                  value={service.mode}
                />
                <Spec
                  icon={<MapPin className="size-4" />}
                  label="Coverage area"
                  value={service.location}
                />
                <Spec
                  icon={<CalendarDays className="size-4" />}
                  label="Earliest availability"
                  value={service.availabilityNote}
                />
                <Spec
                  icon={<ShieldCheck className="size-4" />}
                  label="Warranty"
                  value={service.warranty}
                />
              </div>
            </section>

            <section className="mt-[30px]">
              <h2 className="mb-3 flex items-center gap-[9px] font-heading text-[17px] font-bold text-[#0f1a15] dark:text-white">
                <UserRound className="size-[17px] text-[#0e6b54] dark:text-[#43d3ab]" />
                About your technician
              </h2>

              <div className="flex flex-col gap-3.5 rounded-2xl border border-[#e5e1d6] bg-white p-[18px] sm:flex-row dark:border-white/[0.08] dark:bg-[#101a16]">
                <span className="flex size-[54px] shrink-0 items-center justify-center rounded-full bg-[#c9f5db] text-[18px] font-bold text-[#0b3b26] dark:bg-[#123c2a] dark:text-[#8bf0c4]">
                  {initials}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="flex flex-wrap items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                    {service.technicianProfile.name}
                    {service.technicianProfile.plan === "pro" && (
                      <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#f7dfb4] px-2 py-0.5 text-[9.5px] font-bold text-[#8a5200] dark:bg-[#3a2a10] dark:text-[#f2b25c]">
                        <span className="size-1 rounded-full bg-current" />
                        Pro
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                    {service.technicianProfile.bio}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-[14px] gap-y-3">
                    <TechStat
                      value={`${service.technicianProfile.rating.toFixed(1)} ★`}
                      label="Rating"
                    />
                    <TechStat value={String(service.technicianProfile.jobs)} label="Jobs done" />
                    <TechStat value={service.technicianProfile.area} label="Based in" />
                    <TechStat value={service.technicianProfile.repliesIn} label="Replies in" />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-[30px]">
              <h2 className="mb-3 flex items-center gap-[9px] font-heading text-[17px] font-bold text-[#0f1a15] dark:text-white">
                <Star className="size-[17px] fill-[#eb9f34] text-[#eb9f34]" />
                Reviews
              </h2>

              <div className="flex flex-wrap items-center gap-[22px] rounded-[14px] border border-[#e5e1d6] bg-white p-4 dark:border-white/[0.08] dark:bg-[#101a16]">
                <div>
                  <p className="font-heading text-[40px] font-extrabold leading-none tracking-[-0.05em] text-[#0f1a15] dark:text-white">
                    {service.rating.toFixed(1)}
                  </p>
                  <StarRow count={5} className="mt-2" />
                  <p className="mt-[5px] text-[10.5px] text-[#87948d]">
                    {service.reviews} verified reviews
                  </p>
                </div>

                <div className="grid min-w-[180px] flex-1 gap-1">
                  {REVIEW_DISTRIBUTION.map((percent, index) => (
                    <div
                      key={percent}
                      className="flex items-center gap-2 text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]"
                    >
                      <span className="w-5 shrink-0">{5 - index} ★</span>
                      <span className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-[#eef1f5] dark:bg-white/[0.07]">
                        <span
                          className="block h-full rounded-[3px] bg-[#eb9f34]"
                          style={{ width: `${percent}%` }}
                        />
                      </span>
                      <span className="w-[26px] shrink-0 text-right">
                        {percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-1.5">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-3 border-b border-[#e5e1d6] py-4 last:border-0 dark:border-white/[0.07]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f6e7c8] text-[10px] font-bold text-[#a86a12] dark:bg-[#2b2415] dark:text-[#f0bb6a]">
                        {review.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <b className="font-heading text-[13px] font-bold text-[#0f1a15] dark:text-white">
                            {review.name}
                          </b>
                          <span className="text-[10px] text-[#87948d]">
                            {formatDate(review.at)}
                          </span>
                        </div>
                        <StarRow count={review.rating} className="mt-1" />
                        <p className="mt-1 text-[12.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                          {review.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-3.5">
                    <p className="text-[12.5px] text-[#87948d]">
                      Showing the 3 most recent reviews.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside data-reveal className="lg:self-start">
            <div className="overflow-hidden rounded-[20px] border border-[#e5e1d6] bg-white shadow-[0_18px_40px_-30px_rgba(15,26,21,0.35)] dark:border-white/[0.08] dark:bg-[#101a16]">
              <div className="border-b border-[#e5e1d6] px-5 pb-4 pt-5 dark:border-white/[0.08]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#87948d]">
                    Starting from
                  </span>
                  <ApprovedBadge />
                </div>

                <div className="mt-3 flex flex-wrap items-baseline gap-[7px]">
                  <span className="font-heading text-[16px] font-bold text-[#5f6f68] dark:text-[#9dab9f]">
                    $
                  </span>
                  <span className="font-heading text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#0f1a15] dark:text-white">
                    {service.price}
                  </span>
                  <span className="text-[11px] font-medium text-[#87948d]">
                    final amount confirmed after inspection
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-[12px]">
                  <Star className="size-3.5 fill-[#eb9f34] text-[#eb9f34]" />
                  <span className="font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                    {service.rating.toFixed(1)}
                  </span>
                  <span className="text-[#87948d]">
                    · {service.reviews} reviews
                  </span>
                </div>
              </div>

              <div className="grid px-5 py-1.5">
                <BookRow
                  icon={<UserRound className="size-3.5" />}
                  label="Technician"
                  value={service.technicianProfile.name}
                />
                <BookRow
                  icon={<ModeIcon className="size-3.5" />}
                  label="Mode"
                  value={service.mode}
                />
                <BookRow
                  icon={<MapPin className="size-3.5" />}
                  label="Area"
                  value={service.location}
                />
                <BookRow
                  icon={<Clock className="size-3.5" />}
                  label="Duration"
                  value={service.duration}
                />
                <BookRow
                  icon={<CreditCard className="size-3.5" />}
                  label="Payment"
                  value="After completion"
                />
              </div>

              <div className="grid gap-2.5 px-5 pb-5 pt-4">
                {!user ? (
                  <>
                    <Link
                      href={`/sign-in?next=${encodeURIComponent(
                        `/services/${service.id}`,
                      )}`}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[#0e6b54] px-5 text-[14px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
                    >
                      <Lock className="size-4" />
                      Sign in to request
                    </Link>
                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-[1.5] text-[#87948d]">
                      <Info className="size-3.5 shrink-0" />
                      You will return to this service after signing in.
                    </p>
                  </>
                ) : blocked ? (
                  <>
                    <button
                      type="button"
                      disabled
                      className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-[13px] bg-[#357f6d] px-5 text-[14px] font-semibold text-white/95 dark:bg-[#2e7563] dark:text-white"
                    >
                      <Lock className="size-4" />
                      Customers only
                    </button>

                    <div className="flex items-start gap-2 rounded-[10px] border border-[#e7cda1] bg-[#fcf0d7] px-3 py-2.5 text-[11.5px] leading-[1.55] text-[#a65c07] dark:border-[#6b4c24] dark:bg-[#241b10] dark:text-[#e4b97a]">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                      <span>
                        Only customers can request a repair. You are signed in
                        as {role}.
                      </span>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-[1.5] text-[#87948d]">
                      <ShieldCheck className="size-3.5 shrink-0" />
                      Technician &amp; admin accounts cannot book services.
                    </p>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard/customer/bookings"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[#0e6b54] px-5 text-[14px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
                    >
                      <Wrench className="size-4" />
                      Request this repair
                    </Link>
                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-[1.5] text-[#87948d]">
                      <ShieldCheck className="size-3.5 shrink-0" />
                      No payment now · cancel while it is still “requested”
                    </p>
                  </>
                )}

                <Link
                  href="/services"
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[9px] text-[13px] font-semibold text-[#27352f] transition-colors hover:bg-black/[0.04] dark:text-[#cfdbd3] dark:hover:bg-white/[0.06]"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to all services
                </Link>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#bfe7d5] bg-[#e9f6ef] px-3.5 py-[13px] text-[10.5px] leading-[1.55] text-[#0e6b54] dark:border-[#1b4b39] dark:bg-[#0d231a] dark:text-[#63e6b6]">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              <div>
                <b className="font-heading text-[11.5px]">FixMate promise</b>
                <p className="mt-0.5">
                  If the fault is not fixed, you do not pay. Every payment is
                  held until you confirm completion.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function ApprovedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#e2f4e9] px-2 py-1 text-[10px] font-semibold text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]">
      <span className="size-1.5 rounded-full bg-current" />
      Approved
    </span>
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
    <div className="flex items-center gap-[11px] rounded-xl border border-[#e5e1d6] bg-white px-3.5 py-[13px] dark:border-white/[0.08] dark:bg-[#101a16]">
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]">
        {icon}
      </span>
      <div>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#87948d]">
          {label}
        </p>
        <p className="mt-0.5 font-heading text-[12.8px] font-semibold text-[#0f1a15] dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function TechStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-heading text-[13px] font-bold text-[#0f1a15] dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
        {label}
      </p>
    </div>
  );
}

function BookRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-[#e5e1d6] py-2.5 text-[12.5px] last:border-0 dark:border-white/[0.08]">
      <span className="flex items-center gap-[7px] text-[#5f6f68] dark:text-[#9dab9f]">
        <span className="text-[#87948d]">{icon}</span>
        {label}
      </span>
      <b className="text-right font-semibold text-[#0f1a15] dark:text-white">
        {value}
      </b>
    </div>
  );
}

function StarRow({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-0.5 text-[#eb9f34] ${className}`}
      aria-label={`${count} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((star) => (
        <Star
          key={star}
          className={`size-3 ${star < count ? "fill-current" : "opacity-25"} `}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}
