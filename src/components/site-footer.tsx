import Link from "next/link";
import {
  Clock,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Brand } from "@/components/brand";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse services", href: "/services" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Become a technician", href: "/sign-up" },
  { label: "Sign in", href: "/sign-in" },
];

const CATEGORY_LINKS = [
  { label: "Smartphone repair", href: "/services?category=Smartphone" },
  { label: "AC servicing", href: "/services?category=AC" },
  { label: "Refrigerator repair", href: "/services?category=Refrigerator" },
  { label: "Laptop & PC", href: "/services?category=Laptop+%26+PC" },
  { label: "Electrical work", href: "/services?category=Electrical" },
];

const CONTACT_ROWS: Array<{ icon: LucideIcon; text: string; href?: string }> = [
  { icon: Mail, text: "hello@fixmate.dev", href: "mailto:hello@fixmate.dev" },
  { icon: Phone, text: "+880 9612 345678", href: "tel:+8809612345678" },
  { icon: MapPin, text: "House 27, Road 9, Dhanmondi, Dhaka 1209" },
  { icon: Clock, text: "Sat–Thu, 8:00 – 22:00" },
];

// Brand icons are not part of Lucide, so the paths are kept here as SVG data.
const SOCIAL_LINKS = [
  {
    label: "FixMate on X",
    href: "#",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Zm-1.291 19.491h2.039L6.486 3.24H4.298Z",
  },
  {
    label: "FixMate on Facebook",
    href: "#",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z",
  },
  {
    label: "FixMate on Instagram",
    href: "#",
    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0Zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03Zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162ZM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439Z",
  },
  {
    label: "FixMate on LinkedIn",
    href: "#",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z",
  },
  {
    label: "FixMate on YouTube",
    href: "#",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z",
  },
];

const HEADING_CLASSES =
  "text-[12px] font-bold uppercase tracking-[0.1em] text-[#f1f5f2]";

const LINK_CLASSES =
  "text-[14px] leading-5 text-[#a9b8b0] transition-colors hover:text-white";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className={HEADING_CLASSES}>{title}</h2>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={LINK_CLASSES}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#0b1713] dark:border-t dark:border-white/[0.05]">
      {/* Soft green light in the corner, matching the reference footer. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_-10%,rgba(76,180,133,0.14),transparent_48%)] dark:bg-[radial-gradient(circle_at_88%_-10%,rgba(52,190,134,0.13),transparent_45%)]" />

      <div className="relative mx-auto max-w-[1264px] px-6 pb-4 pt-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 xl:grid-cols-[1.45fr_0.94fr_0.84fr_1.22fr] xl:gap-10">
          <div className="col-span-2 xl:col-span-1">
            <Brand onDark />

            <p className="mt-6 max-w-[290px] text-[14px] leading-[1.7] text-[#a9b8b0]">
              Verified technicians for phones, laptops, ACs, fridges and
              everything electrical. Every job tracked. Pay only when the repair
              is done.
            </p>

            <div className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-[9px] border border-white/10 bg-white/[0.03] text-[#96a39c] transition-colors hover:border-[#43d3ab]/40 hover:text-[#43d3ab]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-3.5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Quick links" links={QUICK_LINKS} />
          <FooterColumn title="Popular categories" links={CATEGORY_LINKS} />

          <div className="col-span-2 xl:col-span-1">
            <h2 className={HEADING_CLASSES}>Talk to us</h2>

            <ul className="mt-5 space-y-2.5">
              {CONTACT_ROWS.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-[#6e7c75]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  {href ? (
                    <a
                      href={href}
                      className="text-[14px] leading-[1.55] text-[#b7c3bc] transition-colors hover:text-[#43d3ab]"
                    >
                      {text}
                    </a>
                  ) : (
                    <p className="text-[14px] leading-[1.55] text-[#b7c3bc]">
                      {text}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-[7px] border border-white/[0.09] bg-white/[0.03] px-2.5 py-1.5 text-[10.5px] font-medium text-[#c4cfc8]">
                <ShieldCheck
                  className="size-3 text-[#43d3ab]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Verified pros
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-[7px] border border-white/[0.09] bg-white/[0.03] px-2.5 py-1.5 text-[10.5px] font-medium text-[#c4cfc8]">
                <Lock
                  className="size-3 text-[#43d3ab]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Secure payments
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.09] pt-4 text-[11.5px] text-[#78857e] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FixMate Technologies Ltd. All rights reserved.</p>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-[#78857e] transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[#78857e] transition-colors hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/support"
              className="text-[#78857e] transition-colors hover:text-white"
            >
              Support
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
