export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export type ServiceMode = "Home Visit" | "Shop Drop-off";

export type Service = {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  location: string;
  duration: string;
  rating: number;
  reviews: number;
  technician: string;
  price: number;
  mode: ServiceMode;
  createdAt: string;
};

export const CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export const PAGE_SIZE = 9;

/* The 15 approved, available listings from the reference demo.
   Keep this list as the single source for the homepage and /services. */
export const SERVICES: Service[] = [
  {
    id: "iphone-13-screen-replacement",
    title: "iPhone 13 Screen Replacement",
    category: "Smartphone",
    description:
      "Cracked or unresponsive display? We replace the full OLED assembly with a tested original-grade panel. Includes a free battery health check and a 30-day warranty on the part.",
    location: "Mirpur, Dhaka",
    duration: "1–2 hours",
    rating: 4.9,
    reviews: 128,
    technician: "Sadia Islam",
    price: 49,
    mode: "Home Visit",
    createdAt: "2026-10-20",
  },
  {
    id: "android-battery-replacement",
    title: "Android Battery Replacement",
    category: "Smartphone",
    description:
      "Phone dying before 3pm? We test the cell, replace it with a fresh high-cycle battery, and run a full charge calibration before handing it back.",
    location: "Dhanmondi, Dhaka",
    duration: "45 min",
    rating: 4.8,
    reviews: 94,
    technician: "Sadia Islam",
    price: 29,
    mode: "Shop Drop-off",
    createdAt: "2026-09-28",
  },
  {
    id: "macbook-battery-service",
    title: "MacBook Battery & Service",
    category: "Laptop & PC",
    description:
      "Full service for MacBooks with swollen or short-lived batteries. We replace the battery pack, clean the cooling assembly and verify charging behaviour under load.",
    location: "Dhanmondi, Dhaka",
    duration: "1 day",
    rating: 4.9,
    reviews: 61,
    technician: "Sadia Islam",
    price: 79,
    mode: "Shop Drop-off",
    createdAt: "2026-10-02",
  },
  {
    id: "laptop-overheating-fan-cleaning",
    title: "Laptop Overheating & Fan Cleaning",
    category: "Laptop & PC",
    description:
      "Laptop sounding like a jet engine? We strip the cooling assembly, clear the dust, replace dried thermal compound and stress-test the CPU.",
    location: "Dhanmondi, Dhaka",
    duration: "3–4 hours",
    rating: 4.8,
    reviews: 47,
    technician: "Sadia Islam",
    price: 39,
    mode: "Shop Drop-off",
    createdAt: "2026-09-16",
  },
  {
    id: "gaming-pc-ram-ssd-upgrade",
    title: "Gaming PC RAM & SSD Upgrade",
    category: "Laptop & PC",
    description:
      "Give an older desktop a second life. We advise on compatible parts, fit your RAM or NVMe drive, clone your existing install and verify speeds before pickup.",
    location: "Uttara, Dhaka",
    duration: "2 hours",
    rating: 4.7,
    reviews: 38,
    technician: "Nayeem Chowdhury",
    price: 25,
    mode: "Shop Drop-off",
    createdAt: "2026-08-30",
  },
  {
    id: "split-ac-deep-cleaning",
    title: "Split AC Deep Cleaning",
    category: "AC",
    description:
      "A proper deep clean, not a spray-and-wipe. We remove the indoor unit, wash the coils and blower, clear the drain line and check gas pressure.",
    location: "Mirpur, Dhaka",
    duration: "2–3 hours",
    rating: 4.9,
    reviews: 203,
    technician: "Rakib Hasan",
    price: 45,
    mode: "Home Visit",
    createdAt: "2026-11-05",
  },
  {
    id: "ac-gas-refill-leak-test",
    title: "AC Gas Refill & Leak Test",
    category: "AC",
    description:
      "AC running but not cooling? We pressure-test the circuit, find and seal leaks, vacuum the system and refill with R32/R410a refrigerant to spec.",
    location: "Mirpur, Dhaka",
    duration: "3–4 hours",
    rating: 4.8,
    reviews: 88,
    technician: "Rakib Hasan",
    price: 65,
    mode: "Home Visit",
    createdAt: "2026-09-24",
  },
  {
    id: "refrigerator-cooling-repair",
    title: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    description:
      "Fridge warm at the bottom or freezing everything? We diagnose the thermostat, compressor, relay and gas circuit, then quote before starting.",
    location: "Mirpur, Dhaka",
    duration: "1 day",
    rating: 4.8,
    reviews: 71,
    technician: "Rakib Hasan",
    price: 55,
    mode: "Home Visit",
    createdAt: "2026-10-09",
  },
  {
    id: "refrigerator-door-seal-replacement",
    title: "Refrigerator Door Seal Replacement",
    category: "Refrigerator",
    description:
      "If your fridge sweats or runs all day, the magnetic door gasket is usually the culprit. We replace perished seals, align the door and re-test the temperature.",
    location: "Dhanmondi, Dhaka",
    duration: "2 hours",
    rating: 4.6,
    reviews: 29,
    technician: "Rakib Hasan",
    price: 35,
    mode: "Home Visit",
    createdAt: "2026-08-22",
  },
  {
    id: "smart-tv-backlight-panel-repair",
    title: "Smart TV Backlight & Panel Repair",
    category: "TV",
    description:
      "Dark screen but sound working? That is usually a failed backlight strip. We replace the strips, test the power board and recalibrate the panel.",
    location: "Dhanmondi, Dhaka",
    duration: "1–2 days",
    rating: 4.9,
    reviews: 112,
    technician: "Sadia Islam",
    price: 89,
    mode: "Shop Drop-off",
    createdAt: "2026-11-02",
  },
  {
    id: "washing-machine-drum-cleaning",
    title: "Washing Machine Drum Cleaning",
    category: "Washing Machine",
    description:
      "Clothes smelling musty? We dismantle the drum, remove lint build-up and scale, sanitise the tub and clean the filter and drain pump.",
    location: "Mirpur, Dhaka",
    duration: "2 hours",
    rating: 4.7,
    reviews: 54,
    technician: "Rakib Hasan",
    price: 32,
    mode: "Home Visit",
    createdAt: "2026-11-08",
  },
  {
    id: "washing-machine-motor-repair",
    title: "Washing Machine Motor Repair",
    category: "Washing Machine",
    description:
      "Machine not spinning or tripping the breaker? We test the motor, capacitor and control board, then repair or replace the faulty part.",
    location: "Uttara, Dhaka",
    duration: "1 day",
    rating: 4.7,
    reviews: 33,
    technician: "Nayeem Chowdhury",
    price: 58,
    mode: "Home Visit",
    createdAt: "2026-11-11",
  },
  {
    id: "home-electrical-wiring-inspection",
    title: "Home Electrical Wiring Inspection",
    category: "Electrical",
    description:
      "A safety audit for your flat or small office. We test every circuit, check earthing and breaker ratings, and give you a written report with photos.",
    location: "Uttara, Dhaka",
    duration: "2–4 hours",
    rating: 4.8,
    reviews: 26,
    technician: "Nayeem Chowdhury",
    price: 40,
    mode: "Home Visit",
    createdAt: "2026-11-11",
  },
  {
    id: "ceiling-fan-installation",
    title: "Ceiling Fan Installation",
    category: "Electrical",
    description:
      "New fan or replacing an old one? We mount the hook safely, balance the blades, wire the regulator and test all speeds.",
    location: "Mirpur, Dhaka",
    duration: "1 hour",
    rating: 4.6,
    reviews: 41,
    technician: "Nayeem Chowdhury",
    price: 18,
    mode: "Home Visit",
    createdAt: "2026-11-14",
  },
  {
    id: "cctv-camera-setup",
    title: "CCTV Camera Setup (4 cameras)",
    category: "Electrical",
    description:
      "Complete 4-camera installation with cabling, DVR configuration, mobile app access and a walkthrough of the playback system.",
    location: "Uttara, Dhaka",
    duration: "1 day",
    rating: 4.8,
    reviews: 19,
    technician: "Nayeem Chowdhury",
    price: 75,
    mode: "Home Visit",
    createdAt: "2026-11-16",
  },
];

export function newestServices(limit?: number) {
  const list = [...SERVICES].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return typeof limit === "number" ? list.slice(0, limit) : list;
}
