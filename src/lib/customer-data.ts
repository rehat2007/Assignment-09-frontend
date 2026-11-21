import type { ServiceCategory } from "@/lib/services";

export type BookingStatus =
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "rejected";

export type CustomerBooking = {
  id: string;
  bookingNumber?: string;
  serviceId: string;
  serviceSlug?: string;
  title: string;
  category: ServiceCategory;
  technician: string;
  preferredDate: string;
  basePrice: number;
  finalAmount: number | null;
  status: BookingStatus;
  paymentStatus: "paid" | "unpaid";
  reviewed?: boolean;
  updatedAt: string;
};

export type CustomerPayment = {
  id: string;
  bookingId: string;
  bookingNumber?: string;
  serviceTitle: string;
  technician: string;
  amount: number;
  paidAt: string;
  transactionId: string;
};

/* Preview data for the customer dashboard. Replace with MongoDB records
   once the bookings/payments collections are added. */
export const CUSTOMER_BOOKINGS: CustomerBooking[] = [
  {
    id: "b10",
    serviceId: "android-battery-replacement",
    title: "Android Battery Replacement",
    category: "Smartphone",
    technician: "Sadia Islam",
    preferredDate: "2026-11-26",
    basePrice: 29,
    finalAmount: 29,
    status: "requested",
    paymentStatus: "unpaid",
    updatedAt: "2026-11-18",
  },
  {
    id: "b3",
    serviceId: "laptop-overheating-fan-cleaning",
    title: "Laptop Overheating & Fan Cleaning",
    category: "Laptop & PC",
    technician: "Sadia Islam",
    preferredDate: "2026-11-22",
    basePrice: 39,
    finalAmount: 39,
    status: "requested",
    paymentStatus: "unpaid",
    updatedAt: "2026-11-17",
  },
  {
    id: "b7",
    serviceId: "ac-gas-refill-leak-test",
    title: "AC Gas Refill & Leak Test",
    category: "AC",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-24",
    basePrice: 65,
    finalAmount: 65,
    status: "accepted",
    paymentStatus: "unpaid",
    updatedAt: "2026-11-17",
  },
  {
    id: "b2",
    serviceId: "split-ac-deep-cleaning",
    title: "Split AC Deep Cleaning",
    category: "AC",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-20",
    basePrice: 45,
    finalAmount: 45,
    status: "in-progress",
    paymentStatus: "unpaid",
    updatedAt: "2026-11-18",
  },
  {
    id: "b1",
    serviceId: "iphone-13-screen-replacement",
    title: "iPhone 13 Screen Replacement",
    category: "Smartphone",
    technician: "Sadia Islam",
    preferredDate: "2026-11-10",
    basePrice: 49,
    finalAmount: 52,
    status: "completed",
    paymentStatus: "unpaid",
    updatedAt: "2026-11-10",
  },
  {
    id: "b4",
    serviceId: "smart-tv-backlight-panel-repair",
    title: "Smart TV Backlight & Panel Repair",
    category: "TV",
    technician: "Sadia Islam",
    preferredDate: "2026-10-26",
    basePrice: 89,
    finalAmount: 89,
    status: "completed",
    paymentStatus: "paid",
    updatedAt: "2026-10-28",
  },
  {
    id: "b8",
    serviceId: "ceiling-fan-installation",
    title: "Ceiling Fan Installation",
    category: "Electrical",
    technician: "Nayeem Chowdhury",
    preferredDate: "2026-09-10",
    basePrice: 18,
    finalAmount: 25,
    status: "completed",
    paymentStatus: "paid",
    updatedAt: "2026-09-12",
  },
  {
    id: "b9",
    serviceId: "home-electrical-wiring-inspection",
    title: "Home Electrical Wiring Inspection",
    category: "Electrical",
    technician: "Nayeem Chowdhury",
    preferredDate: "2026-08-17",
    basePrice: 40,
    finalAmount: 45,
    status: "completed",
    paymentStatus: "paid",
    updatedAt: "2026-08-19",
  },
  {
    id: "b5",
    serviceId: "washing-machine-drum-cleaning",
    title: "Washing Machine Drum Cleaning",
    category: "Washing Machine",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-06",
    basePrice: 32,
    finalAmount: 32,
    status: "cancelled",
    paymentStatus: "unpaid",
    updatedAt: "2026-11-02",
  },
  {
    id: "b6",
    serviceId: "refrigerator-cooling-repair",
    title: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-02",
    basePrice: 55,
    finalAmount: 55,
    status: "rejected",
    paymentStatus: "unpaid",
    updatedAt: "2026-10-30",
  },
];

export const CUSTOMER_PAYMENTS: CustomerPayment[] = [
  {
    id: "p1",
    bookingId: "b4",
    serviceTitle: "Smart TV Backlight & Panel Repair",
    technician: "Sadia Islam",
    amount: 89,
    paidAt: "2026-10-28",
    transactionId: "pi_3Qf8kL2eZvKYlo2C0a1b2c3d",
  },
  {
    id: "p2",
    bookingId: "b8",
    serviceTitle: "Ceiling Fan Installation",
    technician: "Nayeem Chowdhury",
    amount: 25,
    paidAt: "2026-09-12",
    transactionId: "pi_3Qf7bJ2eZvKYlo2C9x8y7z6w",
  },
  {
    id: "p3",
    bookingId: "b9",
    serviceTitle: "Home Electrical Wiring Inspection",
    technician: "Nayeem Chowdhury",
    amount: 45,
    paidAt: "2026-08-19",
    transactionId: "pi_3Qf6cK2eZvKYlo2C5v4u3t2s",
  },
];

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export const BOOKING_STATUS_COLOR: Record<BookingStatus, string> = {
  requested: "#6366f1",
  accepted: "#8b5cf6",
  "in-progress": "#f59e0b",
  completed: "#2dd4a7",
  cancelled: "#94a3b8",
  rejected: "#f87171",
};

export const BOOKING_STATUS_BADGE: Record<BookingStatus, string> = {
  requested:
    "bg-[#e9efff] text-[#1d4ed8] dark:bg-[#14203c] dark:text-[#8fb4ff]",
  accepted:
    "bg-[#ecebff] text-[#4338ca] dark:bg-[#1d1b3a] dark:text-[#a9a4ff]",
  "in-progress":
    "bg-[#fcf0d7] text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]",
  completed:
    "bg-[#e2f4e9] text-[#147a4b] dark:bg-[#0f2a20] dark:text-[#5ad19a]",
  cancelled:
    "bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]",
  rejected:
    "bg-[#fcecea] text-[#b42318] dark:bg-[#2e1613] dark:text-[#ff8f82]",
};

export function money(value: number) {
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
}

export function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getCustomerStats() {
  const total = CUSTOMER_BOOKINGS.length;
  const active = CUSTOMER_BOOKINGS.filter((booking) =>
    ["requested", "accepted", "in-progress"].includes(booking.status),
  ).length;
  const completed = CUSTOMER_BOOKINGS.filter(
    (booking) => booking.status === "completed",
  ).length;
  const spent = CUSTOMER_PAYMENTS.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return {
    total,
    active,
    completed,
    spent,
    completionRate: Math.round((completed / total) * 100),
  };
}

export function getBookingCounts() {
  return CUSTOMER_BOOKINGS.reduce<Record<string, number>>(
    (counts, booking) => {
      counts.all = (counts.all ?? 0) + 1;
      counts[booking.status] = (counts[booking.status] ?? 0) + 1;
      return counts;
    },
    { all: 0 },
  );
}

export function getSpendSeries() {
  const months = [
    { label: "Jun", year: 2026, month: 5 },
    { label: "Jul", year: 2026, month: 6 },
    { label: "Aug", year: 2026, month: 7 },
    { label: "Sep", year: 2026, month: 8 },
    { label: "Oct", year: 2026, month: 9 },
    { label: "Nov", year: 2026, month: 10 },
  ];

  return months.map((entry) => ({
    ...entry,
    value: CUSTOMER_PAYMENTS.filter((payment) => {
      const date = new Date(`${payment.paidAt}T00:00:00`);
      return date.getFullYear() === entry.year && date.getMonth() === entry.month;
    }).reduce((sum, payment) => sum + payment.amount, 0),
  }));
}

export function getLastPayment() {
  return [...CUSTOMER_PAYMENTS].sort((a, b) =>
    b.paidAt.localeCompare(a.paidAt),
  )[0];
}
