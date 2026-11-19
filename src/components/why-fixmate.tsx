import { CreditCard, Eye, ShieldCheck, type LucideIcon } from "lucide-react";

const REASONS: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Every technician is vetted",
    description:
      "ID verification, skill checks and a review history before a listing can go live. Admins approve every service manually.",
    icon: ShieldCheck,
  },
  {
    title: "You see the whole job",
    description:
      "Requested, accepted, in progress, completed, paid. A live timeline on every booking, so nobody has to chase an update.",
    icon: Eye,
  },
  {
    title: "Payment is the last step",
    description:
      "Stripe checkout opens only after the technician marks the job complete. The final amount is agreed before you pay.",
    icon: CreditCard,
  },
];

const EYEBROW_CLASSES =
  "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3fae80] dark:text-[#5be0a5]";

export function WhyFixmate() {
  return (
    <section id="why-fixmate" className="scroll-mt-[68px]">
      <div className="mx-auto max-w-[1280px] px-5 pb-8 pt-8 sm:px-8">
        <p className={EYEBROW_CLASSES}>
          <span className="h-px w-7 bg-current" />
          Why FixMate
        </p>

        <h2 className="mt-5 max-w-[660px] font-heading text-[1.95rem] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#0b1510] sm:text-[2.15rem] dark:text-white">
          Built around the part everyone else skips:{" "}
          <br className="hidden sm:block" />
          trust.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {REASONS.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(20,50,35,0.03)] dark:border-white/[0.09] dark:bg-[#08130e] dark:shadow-none"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] border border-[#cdebd8] bg-[#e4f7eb] text-[#0c7b52] dark:border-[#17402b] dark:bg-[#0f2b20] dark:text-[#63e6b6]">
                <Icon className="size-[17px]" strokeWidth={1.9} />
              </span>

              <h3 className="mt-5 text-[15px] font-bold text-[#151c15] dark:text-[#e9ecd8]">
                {title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-[1.65] text-[#5c6861] dark:text-[#8b9a92]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
