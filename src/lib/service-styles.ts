import {
  Laptop,
  Plug,
  Refrigerator,
  Smartphone,
  Snowflake,
  Tv,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";
import type { ServiceCategory } from "@/lib/services";

// Each tone bundles the tinted preview panel, its glow, icon colour and icon tile.
export const TONES = {
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
  rose: {
    media:
      "bg-[linear-gradient(155deg,#fbeaf0_0%,#f6dce6_48%,#f7e9ee_100%)] dark:bg-[linear-gradient(155deg,#3a1524_0%,#220d16_46%,#0f0709_100%)]",
    glow: "bg-[radial-gradient(circle_at_50%_58%,rgba(225,90,140,0.24),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_58%,rgba(244,114,182,0.18),transparent_62%)]",
    icon: "text-[#b5275d] dark:text-[#f9a8d4]",
    tile: "border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(181,39,93,0.16)] dark:border-white/[0.07] dark:bg-[#14090e] dark:shadow-[0_0_50px_rgba(244,114,182,0.18)]",
  },
};

export type ServiceTone = keyof typeof TONES;

export const CATEGORY_ICONS: Record<ServiceCategory, LucideIcon> = {
  Smartphone,
  "Laptop & PC": Laptop,
  AC: Snowflake,
  Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: Plug,
};

export const CATEGORY_TONES: Record<ServiceCategory, ServiceTone> = {
  Smartphone: "sky",
  "Laptop & PC": "slate",
  AC: "sky",
  Refrigerator: "teal",
  TV: "rose",
  "Washing Machine": "violet",
  Electrical: "amber",
};
