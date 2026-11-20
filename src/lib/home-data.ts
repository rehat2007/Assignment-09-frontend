import {
  CreditCard,
  Eye,
  Search,
  Send,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* Static copy for the homepage. Catalog-derived data comes from the Express
   API in `src/app/page.tsx` so these components stay presentational. */

export const STEPS: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Find a service",
    description:
      "Search by device or browse a category. Every card shows the starting price, area and the technician behind it.",
    icon: Search,
  },
  {
    title: "Send a request",
    description:
      "Pick a date, describe the fault and share your address. No payment yet — the technician confirms first.",
    icon: Send,
  },
  {
    title: "Technician fixes it",
    description:
      "Follow the job from accepted to in-progress to completed, right inside your dashboard.",
    icon: Wrench,
  },
  {
    title: "Pay after completion",
    description:
      "The technician sets the final amount. You review it, then pay securely with Stripe. Never before.",
    icon: CreditCard,
  },
];

export const STATS = [
  { value: "2,400+", label: "Repairs completed", note: "▲ 18% this quarter" },
  { value: "4.9/5", label: "Average rating", note: "Across 1,900 reviews" },
  { value: "94%", label: "First-visit fix rate", note: "Or we return free" },
  { value: "$0", label: "Paid up front", note: "Pay after service" },
];

export const WHY_REASONS: Array<{
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

export const TESTIMONIALS = [
  {
    quote:
      "I have been burned by \"technicians\" before. FixMate showed me the price, the person's profile and every status change. I paid after the washing machine actually spun again.",
    name: "Nusrat Jahan",
    area: "Mohammadpur",
    initials: "NJ",
    avatar: "bg-[#f7d9dc] text-[#7a3138]",
  },
  {
    quote:
      "The MacBook battery was swollen and I was quoted a scary price elsewhere. Sadia explained the part, did the job in a day, and the invoice matched the quote.",
    name: "Mehedi Hasan",
    area: "Bashundhara",
    initials: "MH",
    avatar: "bg-[#f3e4c6] text-[#6b4c1f]",
  },
  {
    quote:
      "Booked a PC upgrade at 11pm, got accepted by morning and picked up the same afternoon. The status tracker is such a simple but brilliant idea.",
    name: "Farhan Kabir",
    area: "Uttara",
    initials: "FK",
    avatar: "bg-[#e4e2fb] text-[#45407a]",
  },
];
