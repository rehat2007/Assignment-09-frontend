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
  category: ServiceCategory;
  title: string;
  location: string;
  duration: string;
  rating: number;
  reviews: number;
  provider: { initials: string; name: string };
  price: number;
  mode: ServiceMode;
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

// The first three listings match the featured order on the services page.
export const SERVICES: Service[] = [
  {
    id: "cctv-camera-setup",
    category: "Electrical",
    title: "CCTV Camera Setup (4 cameras)",
    location: "Uttara, Dhaka",
    duration: "1 day",
    rating: 4.8,
    reviews: 19,
    provider: { initials: "NC", name: "Nayeem Chowdhury" },
    price: 75,
    mode: "Home Visit",
  },
  {
    id: "ceiling-fan-installation",
    category: "Electrical",
    title: "Ceiling Fan Installation",
    location: "Mirpur, Dhaka",
    duration: "1 hour",
    rating: 4.6,
    reviews: 41,
    provider: { initials: "NC", name: "Nayeem Chowdhury" },
    price: 18,
    mode: "Home Visit",
  },
  {
    id: "washing-machine-motor-repair",
    category: "Washing Machine",
    title: "Washing Machine Motor Repair",
    location: "Uttara, Dhaka",
    duration: "1 day",
    rating: 4.7,
    reviews: 33,
    provider: { initials: "NC", name: "Nayeem Chowdhury" },
    price: 58,
    mode: "Home Visit",
  },
  {
    id: "iphone-screen-replacement",
    category: "Smartphone",
    title: "iPhone 13 Screen Replacement",
    location: "Gulshan, Dhaka",
    duration: "2 hours",
    rating: 4.9,
    reviews: 64,
    provider: { initials: "RH", name: "Rakib Hasan" },
    price: 65,
    mode: "Shop Drop-off",
  },
  {
    id: "android-battery-replacement",
    category: "Smartphone",
    title: "Android Battery Replacement",
    location: "Mohammadpur, Dhaka",
    duration: "1 hour",
    rating: 4.5,
    reviews: 37,
    provider: { initials: "SI", name: "Sadia Islam" },
    price: 22,
    mode: "Shop Drop-off",
  },
  {
    id: "macbook-battery-replacement",
    category: "Laptop & PC",
    title: "MacBook Battery Replacement",
    location: "Bashundhara, Dhaka",
    duration: "1 day",
    rating: 4.9,
    reviews: 52,
    provider: { initials: "SI", name: "Sadia Islam" },
    price: 85,
    mode: "Shop Drop-off",
  },
  {
    id: "laptop-ram-upgrade",
    category: "Laptop & PC",
    title: "Laptop RAM Upgrade (16GB)",
    location: "Banani, Dhaka",
    duration: "3 hours",
    rating: 4.7,
    reviews: 44,
    provider: { initials: "NC", name: "Nayeem Chowdhury" },
    price: 40,
    mode: "Shop Drop-off",
  },
  {
    id: "desktop-pc-deep-clean",
    category: "Laptop & PC",
    title: "Desktop PC Deep Clean",
    location: "Uttara, Dhaka",
    duration: "2 hours",
    rating: 4.6,
    reviews: 21,
    provider: { initials: "RH", name: "Rakib Hasan" },
    price: 28,
    mode: "Shop Drop-off",
  },
  {
    id: "ac-deep-cleaning",
    category: "AC",
    title: "AC Deep Cleaning & Gas Refill",
    location: "Dhanmondi, Dhaka",
    duration: "2 hours",
    rating: 4.9,
    reviews: 27,
    provider: { initials: "RH", name: "Rakib Hasan" },
    price: 42,
    mode: "Home Visit",
  },
  {
    id: "split-ac-installation",
    category: "AC",
    title: "Split AC Installation",
    location: "Mirpur, Dhaka",
    duration: "4 hours",
    rating: 4.7,
    reviews: 30,
    provider: { initials: "SI", name: "Sadia Islam" },
    price: 60,
    mode: "Home Visit",
  },
  {
    id: "refrigerator-compressor-repair",
    category: "Refrigerator",
    title: "Refrigerator Compressor Repair",
    location: "Mirpur, Dhaka",
    duration: "1 day",
    rating: 4.8,
    reviews: 22,
    provider: { initials: "SI", name: "Sadia Islam" },
    price: 65,
    mode: "Shop Drop-off",
  },
  {
    id: "fridge-door-seal",
    category: "Refrigerator",
    title: "Fridge Door Seal Replacement",
    location: "Mohammadpur, Dhaka",
    duration: "2 hours",
    rating: 4.5,
    reviews: 18,
    provider: { initials: "NC", name: "Nayeem Chowdhury" },
    price: 32,
    mode: "Home Visit",
  },
  {
    id: "tv-panel-repair",
    category: "TV",
    title: "TV Panel & Backlight Repair",
    location: "Gulshan, Dhaka",
    duration: "1 day",
    rating: 4.6,
    reviews: 23,
    provider: { initials: "RH", name: "Rakib Hasan" },
    price: 55,
    mode: "Shop Drop-off",
  },
  {
    id: "front-load-drum-cleaning",
    category: "Washing Machine",
    title: "Front Load Drum Cleaning",
    location: "Bashundhara, Dhaka",
    duration: "2 hours",
    rating: 4.6,
    reviews: 25,
    provider: { initials: "RH", name: "Rakib Hasan" },
    price: 30,
    mode: "Home Visit",
  },
  {
    id: "electrical-wiring-inspection",
    category: "Electrical",
    title: "Electrical Wiring Inspection",
    location: "Dhanmondi, Dhaka",
    duration: "2 hours",
    rating: 4.7,
    reviews: 28,
    provider: { initials: "SI", name: "Sadia Islam" },
    price: 35,
    mode: "Home Visit",
  },
];
