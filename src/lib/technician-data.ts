import type { BookingStatus } from "@/lib/customer-data";
import type { ServiceCategory } from "@/lib/services";

export type TechnicianApproval = "approved" | "pending" | "rejected";

export type TechnicianService = {
  id: string;
  serviceId?: string;
  serviceSlug?: string;
  title: string;
  category: ServiceCategory;
  description?: string;
  location?: string;
  price: number;
  duration: string;
  mode?: "Home Visit" | "Shop Drop-off";
  approval: TechnicianApproval;
  rejectionReason?: string;
  available: boolean;
  createdAt: string;
  updatedAt?: string;
  rating: number;
  reviews: number;
  includes?: string[];
  warranty?: string;
  availabilityNote?: string;
  coverImage?: string | null;
};

export type TechnicianRequest = {
  id: string;
  bookingNumber?: string;
  serviceId: string;
  serviceSlug?: string;
  serviceTitle: string;
  serviceImage?: string | null;
  category: ServiceCategory;
  customer: string;
  phone: string | null;
  address: string | null;
  preferredDate: string;
  problem: string;
  status: BookingStatus;
  amount: number;
  basePrice?: number;
  finalAmount?: number | null;
  paymentStatus: "paid" | "unpaid";
  createdAt?: string;
  updatedAt?: string;
};

/* Preview data for the technician dashboard. Replace with MongoDB
   listings/bookings when those collections are added. */
export const TECHNICIAN_SERVICES: TechnicianService[] = [
  {
    id: "s6",
    serviceId: "split-ac-deep-cleaning",
    title: "Split AC Deep Cleaning",
    category: "AC",
    price: 45,
    duration: "2–3 hours",
    approval: "approved",
    available: true,
    createdAt: "2026-11-05",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "s7",
    serviceId: "ac-gas-refill-leak-test",
    title: "AC Gas Refill & Leak Test",
    category: "AC",
    price: 65,
    duration: "3–4 hours",
    approval: "approved",
    available: true,
    createdAt: "2026-09-24",
    rating: 4.8,
    reviews: 88,
  },
  {
    id: "s8",
    serviceId: "refrigerator-cooling-repair",
    title: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    price: 55,
    duration: "1 day",
    approval: "approved",
    available: true,
    createdAt: "2026-10-09",
    rating: 4.8,
    reviews: 71,
  },
  {
    id: "s9",
    serviceId: "refrigerator-door-seal-replacement",
    title: "Refrigerator Door Seal Replacement",
    category: "Refrigerator",
    price: 35,
    duration: "2 hours",
    approval: "approved",
    available: true,
    createdAt: "2026-08-22",
    rating: 4.6,
    reviews: 29,
  },
  {
    id: "s11",
    serviceId: "washing-machine-drum-cleaning",
    title: "Washing Machine Drum Cleaning",
    category: "Washing Machine",
    price: 32,
    duration: "2 hours",
    approval: "approved",
    available: true,
    createdAt: "2026-11-08",
    rating: 4.7,
    reviews: 54,
  },
  {
    id: "s17",
    title: "Inverter AC Installation",
    category: "AC",
    price: 95,
    duration: "4–5 hours",
    approval: "pending",
    available: true,
    createdAt: "2026-11-17",
    rating: 0,
    reviews: 0,
  },
  {
    id: "s18",
    title: "Window AC Installation",
    category: "AC",
    price: 70,
    duration: "3 hours",
    approval: "rejected",
    available: true,
    createdAt: "2026-10-15",
    rating: 0,
    reviews: 0,
  },
];

export const TECHNICIAN_REQUESTS: TechnicianRequest[] = [
  {
    id: "b11",
    serviceId: "split-ac-deep-cleaning",
    serviceTitle: "Split AC Deep Cleaning",
    category: "AC",
    customer: "Tanvir Ahmed",
    phone: "+880 1555 902211",
    address: "House 12, Road 4, Mirpur 10, Dhaka",
    preferredDate: "2026-11-21",
    problem:
      "Two split units need a deep clean before winter. They have not been serviced for more than 18 months and the outdoor unit is noisy.",
    status: "requested",
    amount: 45,
    paymentStatus: "unpaid",
  },
  {
    id: "b7",
    serviceId: "ac-gas-refill-leak-test",
    serviceTitle: "AC Gas Refill & Leak Test",
    category: "AC",
    customer: "Ayesha Rahman",
    phone: "+880 1712 345678",
    address: "Flat 5B, House 27, Road 9, Dhanmondi, Dhaka",
    preferredDate: "2026-11-24",
    problem:
      "The living room AC runs but never really cools. Last technician said the gas was low but did not check for a leak.",
    status: "accepted",
    amount: 65,
    paymentStatus: "unpaid",
  },
  {
    id: "b2",
    serviceId: "split-ac-deep-cleaning",
    serviceTitle: "Split AC Deep Cleaning",
    category: "AC",
    customer: "Ayesha Rahman",
    phone: "+880 1712 345678",
    address: "Flat 5B, House 27, Road 9, Dhanmondi, Dhaka",
    preferredDate: "2026-11-20",
    problem:
      "The bedroom AC smells damp when it starts and the cooling has become weak over the last month.",
    status: "in-progress",
    amount: 45,
    paymentStatus: "unpaid",
  },
  {
    id: "b12",
    serviceId: "refrigerator-cooling-repair",
    serviceTitle: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    customer: "Tanvir Ahmed",
    phone: "+880 1555 902211",
    address: "House 12, Road 4, Mirpur 10, Dhaka",
    preferredDate: "2026-11-15",
    problem:
      "Fridge is cooling only on the highest setting and the compressor runs continuously. There is ice build-up at the back wall.",
    status: "completed",
    amount: 60,
    paymentStatus: "unpaid",
  },
  {
    id: "b5",
    serviceId: "washing-machine-drum-cleaning",
    serviceTitle: "Washing Machine Drum Cleaning",
    category: "Washing Machine",
    customer: "Ayesha Rahman",
    phone: "+880 1712 345678",
    address: "Flat 5B, House 27, Road 9, Dhanmondi, Dhaka",
    preferredDate: "2026-11-06",
    problem:
      "Front load machine leaves a musty smell on clothes even after a hot wash. I have tried cleaning tablets but the smell returns.",
    status: "cancelled",
    amount: 32,
    paymentStatus: "unpaid",
  },
  {
    id: "b6",
    serviceId: "refrigerator-cooling-repair",
    serviceTitle: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    customer: "Ayesha Rahman",
    phone: "+880 1712 345678",
    address: "Flat 5B, House 27, Road 9, Dhanmondi, Dhaka",
    preferredDate: "2026-11-02",
    problem:
      "The freezer works but the lower compartment stays warm. There is also water collecting at the bottom of the fridge.",
    status: "rejected",
    amount: 55,
    paymentStatus: "unpaid",
  },
  {
    id: "b17",
    serviceId: "ac-gas-refill-leak-test",
    serviceTitle: "AC Gas Refill & Leak Test",
    category: "AC",
    customer: "Farhan Kabir",
    phone: "+880 1999 556677",
    address: "House 8, Sector 7, Uttara, Dhaka",
    preferredDate: "2026-09-24",
    problem:
      "Bedroom AC was blowing warm air and hissing near the outdoor unit. Needs a leak test and a full gas refill.",
    status: "completed",
    amount: 85,
    paymentStatus: "paid",
  },
  {
    id: "b18",
    serviceId: "refrigerator-cooling-repair",
    serviceTitle: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    customer: "Nusrat Jahan",
    phone: "+880 1888 112233",
    address: "House 45, Road 2, Mohammadpur, Dhaka",
    preferredDate: "2026-10-14",
    problem:
      "Freezer works but the fridge section is warm and there is ice on the back panel. Suspect a faulty defrost thermostat.",
    status: "completed",
    amount: 55,
    paymentStatus: "paid",
  },
];

export const TECHNICIAN_EARNINGS = [
  { label: "Jun", value: 0 },
  { label: "Jul", value: 0 },
  { label: "Aug", value: 0 },
  { label: "Sep", value: 85 },
  { label: "Oct", value: 55 },
  { label: "Nov", value: 0 },
];

export const TECHNICIAN_PREVIEW = {
  jobs: 642,
  rating: 4.9,
  plan: "Pro",
};

export function getTechnicianStats() {
  const approved = TECHNICIAN_SERVICES.filter(
    (service) => service.approval === "approved",
  ).length;
  const pendingRequests = TECHNICIAN_REQUESTS.filter(
    (request) => request.status === "requested",
  ).length;
  const earnings = TECHNICIAN_REQUESTS.filter(
    (request) => request.paymentStatus === "paid",
  ).reduce((sum, request) => sum + request.amount, 0);
  const completed = TECHNICIAN_REQUESTS.filter(
    (request) => request.status === "completed",
  ).length;
  const completedTotal = TECHNICIAN_REQUESTS.filter(
    (request) => request.status === "completed",
  ).reduce((sum, request) => sum + request.amount, 0);

  return {
    totalServices: TECHNICIAN_SERVICES.length,
    approved,
    pendingRequests,
    earnings,
    completed,
    averageJob: completed ? Math.round(completedTotal / completed) : 0,
    rating: 4.9,
  };
}

export function getApprovalCounts() {
  return {
    approved: TECHNICIAN_SERVICES.filter(
      (service) => service.approval === "approved",
    ).length,
    pending: TECHNICIAN_SERVICES.filter(
      (service) => service.approval === "pending",
    ).length,
    rejected: TECHNICIAN_SERVICES.filter(
      (service) => service.approval === "rejected",
    ).length,
  };
}
