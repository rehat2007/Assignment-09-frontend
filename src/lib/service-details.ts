import type { Service } from "@/lib/services";

export type ServiceReview = {
  name: string;
  rating: number;
  text: string;
  at: string;
};

export type TechnicianProfile = {
  name: string;
  bio: string;
  area: string;
  rating: number;
  jobs: number;
  plan: "free" | "pro";
  repliesIn: string;
};

export type ServiceDetailExtra = {
  includes: string[];
  reviews: ServiceReview[];
};

/* Detail-page content from the reference demo. Listings live in
   src/lib/services.ts; this file only adds the longer detail copy. */
export const SERVICE_DETAILS: Record<string, ServiceDetailExtra> = {
  "iphone-13-screen-replacement": {
    includes: [
      "Original-grade OLED assembly",
      "True Tone & Face ID preserved",
      "Free battery health report",
      "30-day parts warranty",
    ],
    reviews: [
      {
        name: "Imran Sheikh",
        rating: 5,
        text: "Came to my office, replaced the screen in 40 minutes and showed me the old panel. Flawless.",
        at: "2026-11-04",
      },
      {
        name: "Sumaiya Akter",
        rating: 5,
        text: "The only place that explained why my Face ID stopped working. Fixed properly, not just covered up.",
        at: "2026-10-26",
      },
      {
        name: "Rifat Chowdhury",
        rating: 4,
        text: "Great work, slightly late arrival but kept me updated the whole way.",
        at: "2026-10-12",
      },
    ],
  },
  "android-battery-replacement": {
    includes: [
      "Genuine-capacity battery",
      "Charge cycle calibration",
      "Old part returned to you",
      "15-day replacement warranty",
    ],
    reviews: [],
  },
  "macbook-battery-service": {
    includes: [
      "OEM-spec battery pack",
      "Thermal paste re-application",
      "Fan & vent cleaning",
      "Battery health report",
    ],
    reviews: [],
  },
  "laptop-overheating-fan-cleaning": {
    includes: [
      "Full teardown & dust removal",
      "Premium thermal compound",
      "Fan bearing lubrication",
      "Thermal stress test",
    ],
    reviews: [],
  },
  "gaming-pc-ram-ssd-upgrade": {
    includes: [
      "Compatibility check",
      "Drive cloning to new SSD",
      "Benchmark before & after",
      "Cable management",
    ],
    reviews: [],
  },
  "split-ac-deep-cleaning": {
    includes: [
      "Coil & blower deep wash",
      "Drain line flush",
      "Gas pressure check",
      "Filter sanitisation",
    ],
    reviews: [
      {
        name: "Tanvir Ahmed",
        rating: 5,
        text: "Showed up on time with a full kit. The water that came out of that unit was alarming. Cooling is noticeably better.",
        at: "2026-11-12",
      },
      {
        name: "Nusrat Jahan",
        rating: 5,
        text: "Very tidy — covered the floor and cleaned up afterwards. Booked him again for my parents’ unit.",
        at: "2026-10-29",
      },
      {
        name: "Mehedi Hasan",
        rating: 4,
        text: "Good service overall. Took a bit longer than the estimate but did a thorough job.",
        at: "2026-10-08",
      },
    ],
  },
  "ac-gas-refill-leak-test": {
    includes: [
      "Nitrogen leak pressure test",
      "Brazing & seal repair",
      "Vacuum + gas refill",
      "Cooling performance reading",
    ],
    reviews: [],
  },
  "refrigerator-cooling-repair": {
    includes: [
      "Full cooling system diagnosis",
      "Compressor & relay testing",
      "Gas top-up if required",
      "No-fix, no-fee policy",
    ],
    reviews: [],
  },
  "refrigerator-door-seal-replacement": {
    includes: [
      "Custom-fit magnetic gasket",
      "Door hinge alignment",
      "Temperature hold test",
      "20-day fitting warranty",
    ],
    reviews: [],
  },
  "smart-tv-backlight-panel-repair": {
    includes: [
      "Full backlight strip set",
      "Power board inspection",
      "Panel calibration",
      "Free pickup & drop (3 km)",
    ],
    reviews: [
      {
        name: "Farhan Kabir",
        rating: 5,
        text: 'My 55" Sony was declared dead elsewhere. Sadia fixed the backlight for a fraction of a new TV.',
        at: "2026-10-21",
      },
      {
        name: "Imran Sheikh",
        rating: 5,
        text: "Clear diagnosis, honest pricing, and they returned it a day early.",
        at: "2026-10-05",
      },
    ],
  },
  "washing-machine-drum-cleaning": {
    includes: [
      "Drum removal & descaling",
      "Filter and pump clean",
      "Food-grade sanitiser",
      "Leak check after refit",
    ],
    reviews: [],
  },
  "washing-machine-motor-repair": {
    includes: [
      "Motor & capacitor testing",
      "Belt / coupling replacement",
      "Drain cycle verification",
      "6-month part warranty",
    ],
    reviews: [],
  },
  "home-electrical-wiring-inspection": {
    includes: [
      "Circuit-by-circuit testing",
      "Earthing & RCD check",
      "Photo report with findings",
      "Prioritised fix list",
    ],
    reviews: [],
  },
  "ceiling-fan-installation": {
    includes: [
      "Secure hook & mount fitting",
      "Blade balancing",
      "Regulator wiring",
      "Speed and wobble test",
    ],
    reviews: [],
  },
  "cctv-camera-setup": {
    includes: [
      "4 x 2MP camera mounting",
      "Cable routing & connectors",
      "DVR + mobile app setup",
      "Playback walkthrough",
    ],
    reviews: [],
  },
};

export const TECHNICIANS: Record<string, TechnicianProfile> = {
  "Rakib Hasan": {
    name: "Rakib Hasan",
    bio: "AC & home appliance specialist with 8 years of field experience. 640+ jobs completed, factory-trained on inverter systems.",
    area: "Mirpur, Dhaka",
    rating: 4.9,
    jobs: 642,
    plan: "pro",
    repliesIn: "~12 min",
  },
  "Sadia Islam": {
    name: "Sadia Islam",
    bio: "Board-level phone and laptop repair. Apple-certified (2021), micro-soldering specialist. I explain the fault before I touch a screwdriver.",
    area: "Dhanmondi, Dhaka",
    rating: 4.9,
    jobs: 418,
    plan: "pro",
    repliesIn: "~12 min",
  },
  "Nayeem Chowdhury": {
    name: "Nayeem Chowdhury",
    bio: "Licensed electrician and appliance technician. Smart-home installs, wiring safety audits and CCTV setup.",
    area: "Uttara, Dhaka",
    rating: 4.7,
    jobs: 233,
    plan: "pro",
    repliesIn: "~12 min",
  },
};

export const REVIEW_DISTRIBUTION = [78, 14, 5, 2, 1];

export function getServiceDetail(service: Service) {
  const detail = SERVICE_DETAILS[service.id] ?? {
    includes: [],
    reviews: [],
  };

  return {
    ...detail,
    technician: TECHNICIANS[service.technician] ?? {
      name: service.technician,
      bio: "Verified FixMate technician.",
      area: service.location,
      rating: service.rating,
      jobs: 120,
      plan: "free" as const,
      repliesIn: "~12 min",
    },
    availability: "Tomorrow, 9:00 AM",
    warranty: "30 days on workmanship",
  };
}
