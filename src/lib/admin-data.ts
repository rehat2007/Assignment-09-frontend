import type { BookingStatus } from "@/lib/customer-data";
import type { ServiceCategory } from "@/lib/services";

export type AdminRole = "customer" | "technician" | "admin";
export type AdminApproval = "approved" | "pending" | "rejected";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone: string;
  area: string;
  bio: string;
  joined: string;
  plan: "free" | "pro";
  rating?: number;
  jobs?: number;
  banned?: boolean;
  banReason?: string;
  emailVerified?: boolean;
  image?: string | null;
};

export type AdminService = {
  id: string;
  serviceSlug?: string;
  title: string;
  category: ServiceCategory;
  price: number;
  duration: string;
  technician: string;
  technicianArea: string;
  approval: AdminApproval;
  rejectionReason?: string;
  available: boolean;
  createdAt: string;
  updatedAt?: string;
  rating: number;
  reviews: number;
  description?: string;
  location?: string;
  mode?: "Home Visit" | "Shop Drop-off";
  includes?: string[];
  warranty?: string;
  availabilityNote?: string;
  coverImage?: string | null;
};

export type AdminBooking = {
  id: string;
  bookingNumber?: string;
  serviceId: string;
  serviceSlug?: string;
  title: string;
  category: ServiceCategory;
  customer: string;
  customerEmail: string;
  technician: string;
  preferredDate: string;
  status: BookingStatus;
  paymentStatus: "paid" | "unpaid";
  basePrice: number;
  finalAmount: number | null;
  createdAt: string;
  phone?: string;
  address?: string;
  problem?: string;
};

export type AdminPayment = {
  id: string;
  bookingId: string;
  bookingNumber?: string;
  title: string;
  customer: string;
  customerEmail: string;
  technician: string;
  amount: number;
  paidAt: string;
  transactionId: string;
};

/* Preview data for the admin dashboard, mirroring the reference demo.
   Replace with MongoDB collections when users/listings/bookings exist. */
export const ADMIN_USERS: AdminUser[] = [
  {
    id: "u1",
    name: "Ayesha Rahman",
    email: "customer@fixmate.dev",
    role: "customer",
    phone: "+880 1712 345678",
    area: "Dhanmondi, Dhaka",
    bio: "Product designer. I keep my devices forever, so I fix instead of replace.",
    joined: "2026-01-14",
    plan: "free",
  },
  {
    id: "u2",
    name: "Rakib Hasan",
    email: "rakib@fixmate.dev",
    role: "technician",
    phone: "+880 1811 220034",
    area: "Mirpur, Dhaka",
    bio: "AC & home appliance specialist with 8 years of field experience. 640+ jobs completed, factory-trained on inverter systems.",
    joined: "2025-08-02",
    plan: "pro",
    rating: 4.9,
    jobs: 642,
  },
  {
    id: "u3",
    name: "Sadia Islam",
    email: "sadia@fixmate.dev",
    role: "technician",
    phone: "+880 1913 778899",
    area: "Dhanmondi, Dhaka",
    bio: "Board-level phone and laptop repair. Apple-certified (2021), micro-soldering specialist. I explain the fault before I touch a screwdriver.",
    joined: "2025-11-19",
    plan: "pro",
    rating: 4.9,
    jobs: 418,
  },
  {
    id: "u4",
    name: "Nayeem Chowdhury",
    email: "nayeem@fixmate.dev",
    role: "technician",
    phone: "+880 1620 445566",
    area: "Uttara, Dhaka",
    bio: "Licensed electrician and appliance technician. Smart-home installs, wiring safety audits and CCTV setup.",
    joined: "2026-02-08",
    plan: "pro",
    rating: 4.7,
    jobs: 233,
  },
  {
    id: "u5",
    name: "Arif Hossain",
    email: "admin@fixmate.dev",
    role: "admin",
    phone: "+880 1700 000111",
    area: "Gulshan, Dhaka",
    bio: "Platform operations & technician quality.",
    joined: "2025-06-01",
    plan: "pro",
  },
  {
    id: "u6",
    name: "Tanvir Ahmed",
    email: "tanvir@mail.com",
    role: "customer",
    phone: "+880 1555 902211",
    area: "Mirpur, Dhaka",
    bio: "",
    joined: "2026-03-21",
    plan: "free",
  },
  {
    id: "u7",
    name: "Mehedi Hasan",
    email: "mehedi@mail.com",
    role: "customer",
    phone: "+880 1777 334455",
    area: "Bashundhara, Dhaka",
    bio: "",
    joined: "2026-04-07",
    plan: "free",
  },
  {
    id: "u8",
    name: "Nusrat Jahan",
    email: "nusrat@mail.com",
    role: "customer",
    phone: "+880 1888 112233",
    area: "Mohammadpur, Dhaka",
    bio: "",
    joined: "2026-05-30",
    plan: "free",
  },
  {
    id: "u9",
    name: "Farhan Kabir",
    email: "farhan@mail.com",
    role: "customer",
    phone: "+880 1999 556677",
    area: "Uttara, Dhaka",
    bio: "",
    joined: "2026-07-12",
    plan: "free",
  },
  {
    id: "u10",
    name: "Sumaiya Akter",
    email: "sumaiya@mail.com",
    role: "customer",
    phone: "+880 1611 889900",
    area: "Gulshan, Dhaka",
    bio: "",
    joined: "2026-09-09",
    plan: "free",
  },
  {
    id: "u11",
    name: "Imran Sheikh",
    email: "imran@mail.com",
    role: "customer",
    phone: "+880 1512 665544",
    area: "Banani, Dhaka",
    bio: "",
    joined: "2026-10-18",
    plan: "free",
  },
  {
    id: "u12",
    name: "Rifat Chowdhury",
    email: "rifat@mail.com",
    role: "customer",
    phone: "+880 1744 223344",
    area: "Mirpur, Dhaka",
    bio: "",
    joined: "2026-11-02",
    plan: "free",
  },
];

export const ADMIN_SERVICES: AdminService[] = [
  {
    id: "s1",
    title: "iPhone 13 Screen Replacement",
    category: "Smartphone",
    price: 49,
    duration: "1–2 hours",
    technician: "Sadia Islam",
    technicianArea: "Dhanmondi, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-10-20",
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "s2",
    title: "Android Battery Replacement",
    category: "Smartphone",
    price: 29,
    duration: "45 min",
    technician: "Sadia Islam",
    technicianArea: "Dhanmondi, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-09-28",
    rating: 4.8,
    reviews: 94,
  },
  {
    id: "s3",
    title: "MacBook Battery & Service",
    category: "Laptop & PC",
    price: 79,
    duration: "1 day",
    technician: "Sadia Islam",
    technicianArea: "Dhanmondi, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-10-02",
    rating: 4.9,
    reviews: 61,
  },
  {
    id: "s4",
    title: "Laptop Overheating & Fan Cleaning",
    category: "Laptop & PC",
    price: 39,
    duration: "3–4 hours",
    technician: "Sadia Islam",
    technicianArea: "Dhanmondi, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-09-16",
    rating: 4.8,
    reviews: 47,
  },
  {
    id: "s5",
    title: "Gaming PC RAM & SSD Upgrade",
    category: "Laptop & PC",
    price: 25,
    duration: "2 hours",
    technician: "Nayeem Chowdhury",
    technicianArea: "Uttara, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-08-30",
    rating: 4.7,
    reviews: 38,
  },
  {
    id: "s6",
    title: "Split AC Deep Cleaning",
    category: "AC",
    price: 45,
    duration: "2–3 hours",
    technician: "Rakib Hasan",
    technicianArea: "Mirpur, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-11-05",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "s7",
    title: "AC Gas Refill & Leak Test",
    category: "AC",
    price: 65,
    duration: "3–4 hours",
    technician: "Rakib Hasan",
    technicianArea: "Mirpur, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-09-24",
    rating: 4.8,
    reviews: 88,
  },
  {
    id: "s8",
    title: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    price: 55,
    duration: "1 day",
    technician: "Rakib Hasan",
    technicianArea: "Mirpur, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-10-09",
    rating: 4.8,
    reviews: 71,
  },
  {
    id: "s9",
    title: "Refrigerator Door Seal Replacement",
    category: "Refrigerator",
    price: 35,
    duration: "2 hours",
    technician: "Rakib Hasan",
    technicianArea: "Mirpur, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-08-22",
    rating: 4.6,
    reviews: 29,
  },
  {
    id: "s10",
    title: "Smart TV Backlight & Panel Repair",
    category: "TV",
    price: 89,
    duration: "1–2 days",
    technician: "Sadia Islam",
    technicianArea: "Dhanmondi, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-11-02",
    rating: 4.9,
    reviews: 112,
  },
  {
    id: "s11",
    title: "Washing Machine Drum Cleaning",
    category: "Washing Machine",
    price: 32,
    duration: "2 hours",
    technician: "Rakib Hasan",
    technicianArea: "Mirpur, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-11-08",
    rating: 4.7,
    reviews: 54,
  },
  {
    id: "s12",
    title: "Washing Machine Motor Repair",
    category: "Washing Machine",
    price: 58,
    duration: "1 day",
    technician: "Nayeem Chowdhury",
    technicianArea: "Uttara, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-11-11",
    rating: 4.7,
    reviews: 33,
  },
  {
    id: "s13",
    title: "Home Electrical Wiring Inspection",
    category: "Electrical",
    price: 40,
    duration: "2–4 hours",
    technician: "Nayeem Chowdhury",
    technicianArea: "Uttara, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-11-11",
    rating: 4.8,
    reviews: 26,
  },
  {
    id: "s14",
    title: "Ceiling Fan Installation",
    category: "Electrical",
    price: 18,
    duration: "1 hour",
    technician: "Nayeem Chowdhury",
    technicianArea: "Uttara, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-11-14",
    rating: 4.6,
    reviews: 41,
  },
  {
    id: "s15",
    title: "CCTV Camera Setup (4 cameras)",
    category: "Electrical",
    price: 75,
    duration: "1 day",
    technician: "Nayeem Chowdhury",
    technicianArea: "Uttara, Dhaka",
    approval: "approved",
    available: true,
    createdAt: "2026-11-16",
    rating: 4.8,
    reviews: 19,
  },
  {
    id: "s16",
    title: "TV Wall Mount Installation",
    category: "TV",
    price: 30,
    duration: "1 hour",
    technician: "Sadia Islam",
    technicianArea: "Dhanmondi, Dhaka",
    approval: "pending",
    available: true,
    createdAt: "2026-11-17",
    rating: 0,
    reviews: 0,
  },
  {
    id: "s17",
    title: "Inverter AC Installation",
    category: "AC",
    price: 95,
    duration: "4–5 hours",
    technician: "Rakib Hasan",
    technicianArea: "Mirpur, Dhaka",
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
    technician: "Rakib Hasan",
    technicianArea: "Mirpur, Dhaka",
    approval: "rejected",
    available: true,
    createdAt: "2026-10-15",
    rating: 0,
    reviews: 0,
  },
  {
    id: "s19",
    title: "Smart TV Setup & Calibration",
    category: "TV",
    price: 38,
    duration: "1–2 hours",
    technician: "Sadia Islam",
    technicianArea: "Dhanmondi, Dhaka",
    approval: "approved",
    available: false,
    createdAt: "2026-10-28",
    rating: 4.7,
    reviews: 22,
  },
];

export const ADMIN_BOOKINGS: AdminBooking[] = [
  {
    id: "b1",
    serviceId: "s1",
    title: "iPhone 13 Screen Replacement",
    category: "Smartphone",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Sadia Islam",
    preferredDate: "2026-11-10",
    status: "completed",
    paymentStatus: "unpaid",
    basePrice: 49,
    finalAmount: 52,
    createdAt: "2026-11-08",
  },
  {
    id: "b2",
    serviceId: "s6",
    title: "Split AC Deep Cleaning",
    category: "AC",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-20",
    status: "in-progress",
    paymentStatus: "unpaid",
    basePrice: 45,
    finalAmount: 45,
    createdAt: "2026-11-16",
  },
  {
    id: "b3",
    serviceId: "s4",
    title: "Laptop Overheating & Fan Cleaning",
    category: "Laptop & PC",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Sadia Islam",
    preferredDate: "2026-11-22",
    status: "requested",
    paymentStatus: "unpaid",
    basePrice: 39,
    finalAmount: 39,
    createdAt: "2026-11-17",
  },
  {
    id: "b4",
    serviceId: "s10",
    title: "Smart TV Backlight & Panel Repair",
    category: "TV",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Sadia Islam",
    preferredDate: "2026-10-26",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 89,
    finalAmount: 89,
    createdAt: "2026-10-24",
  },
  {
    id: "b5",
    serviceId: "s11",
    title: "Washing Machine Drum Cleaning",
    category: "Washing Machine",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-06",
    status: "cancelled",
    paymentStatus: "unpaid",
    basePrice: 32,
    finalAmount: 32,
    createdAt: "2026-11-01",
  },
  {
    id: "b6",
    serviceId: "s8",
    title: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-02",
    status: "rejected",
    paymentStatus: "unpaid",
    basePrice: 55,
    finalAmount: 55,
    createdAt: "2026-10-30",
  },
  {
    id: "b7",
    serviceId: "s7",
    title: "AC Gas Refill & Leak Test",
    category: "AC",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-24",
    status: "accepted",
    paymentStatus: "unpaid",
    basePrice: 65,
    finalAmount: 65,
    createdAt: "2026-11-17",
  },
  {
    id: "b8",
    serviceId: "s14",
    title: "Ceiling Fan Installation",
    category: "Electrical",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Nayeem Chowdhury",
    preferredDate: "2026-09-10",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 18,
    finalAmount: 25,
    createdAt: "2026-09-08",
  },
  {
    id: "b9",
    serviceId: "s13",
    title: "Home Electrical Wiring Inspection",
    category: "Electrical",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Nayeem Chowdhury",
    preferredDate: "2026-08-17",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 40,
    finalAmount: 45,
    createdAt: "2026-08-15",
  },
  {
    id: "b10",
    serviceId: "s2",
    title: "Android Battery Replacement",
    category: "Smartphone",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Sadia Islam",
    preferredDate: "2026-11-26",
    status: "requested",
    paymentStatus: "unpaid",
    basePrice: 29,
    finalAmount: 29,
    createdAt: "2026-11-18",
  },
  {
    id: "b11",
    serviceId: "s6",
    title: "Split AC Deep Cleaning",
    category: "AC",
    customer: "Tanvir Ahmed",
    customerEmail: "tanvir@mail.com",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-21",
    status: "requested",
    paymentStatus: "unpaid",
    basePrice: 45,
    finalAmount: 45,
    createdAt: "2026-11-18",
  },
  {
    id: "b12",
    serviceId: "s8",
    title: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    customer: "Tanvir Ahmed",
    customerEmail: "tanvir@mail.com",
    technician: "Rakib Hasan",
    preferredDate: "2026-11-15",
    status: "completed",
    paymentStatus: "unpaid",
    basePrice: 55,
    finalAmount: 60,
    createdAt: "2026-11-13",
  },
  {
    id: "b13",
    serviceId: "s3",
    title: "MacBook Battery & Service",
    category: "Laptop & PC",
    customer: "Mehedi Hasan",
    customerEmail: "mehedi@mail.com",
    technician: "Sadia Islam",
    preferredDate: "2026-10-29",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 79,
    finalAmount: 120,
    createdAt: "2026-10-27",
  },
  {
    id: "b14",
    serviceId: "s12",
    title: "Washing Machine Motor Repair",
    category: "Washing Machine",
    customer: "Nusrat Jahan",
    customerEmail: "nusrat@mail.com",
    technician: "Nayeem Chowdhury",
    preferredDate: "2026-11-03",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 58,
    finalAmount: 58,
    createdAt: "2026-11-01",
  },
  {
    id: "b15",
    serviceId: "s5",
    title: "Gaming PC RAM & SSD Upgrade",
    category: "Laptop & PC",
    customer: "Farhan Kabir",
    customerEmail: "farhan@mail.com",
    technician: "Nayeem Chowdhury",
    preferredDate: "2026-07-23",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 25,
    finalAmount: 75,
    createdAt: "2026-07-20",
  },
  {
    id: "b16",
    serviceId: "s15",
    title: "CCTV Camera Setup (4 cameras)",
    category: "Electrical",
    customer: "Tanvir Ahmed",
    customerEmail: "tanvir@mail.com",
    technician: "Nayeem Chowdhury",
    preferredDate: "2026-06-15",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 75,
    finalAmount: 95,
    createdAt: "2026-06-12",
  },
  {
    id: "b17",
    serviceId: "s7",
    title: "AC Gas Refill & Leak Test",
    category: "AC",
    customer: "Farhan Kabir",
    customerEmail: "farhan@mail.com",
    technician: "Rakib Hasan",
    preferredDate: "2026-09-24",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 65,
    finalAmount: 85,
    createdAt: "2026-09-22",
  },
  {
    id: "b18",
    serviceId: "s8",
    title: "Refrigerator Cooling Repair",
    category: "Refrigerator",
    customer: "Nusrat Jahan",
    customerEmail: "nusrat@mail.com",
    technician: "Rakib Hasan",
    preferredDate: "2026-10-14",
    status: "completed",
    paymentStatus: "paid",
    basePrice: 55,
    finalAmount: 55,
    createdAt: "2026-10-12",
  },
];

export const ADMIN_PAYMENTS: AdminPayment[] = [
  {
    id: "p1",
    bookingId: "b4",
    title: "Smart TV Backlight & Panel Repair",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Sadia Islam",
    amount: 89,
    paidAt: "2026-10-28",
    transactionId: "pi_3Qf8kL2eZvKYlo2C0a1b2c3d",
  },
  {
    id: "p2",
    bookingId: "b8",
    title: "Ceiling Fan Installation",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Nayeem Chowdhury",
    amount: 25,
    paidAt: "2026-09-12",
    transactionId: "pi_3Qf7bJ2eZvKYlo2C9x8y7z6w",
  },
  {
    id: "p3",
    bookingId: "b9",
    title: "Home Electrical Wiring Inspection",
    customer: "Ayesha Rahman",
    customerEmail: "customer@fixmate.dev",
    technician: "Nayeem Chowdhury",
    amount: 45,
    paidAt: "2026-08-19",
    transactionId: "pi_3Qf6cK2eZvKYlo2C5v4u3t2s",
  },
  {
    id: "p4",
    bookingId: "b13",
    title: "MacBook Battery & Service",
    customer: "Mehedi Hasan",
    customerEmail: "mehedi@mail.com",
    technician: "Sadia Islam",
    amount: 120,
    paidAt: "2026-10-30",
    transactionId: "pi_3Qf5dL2eZvKYlo2C1r2s3t4u",
  },
  {
    id: "p5",
    bookingId: "b14",
    title: "Washing Machine Motor Repair",
    customer: "Nusrat Jahan",
    customerEmail: "nusrat@mail.com",
    technician: "Nayeem Chowdhury",
    amount: 58,
    paidAt: "2026-11-03",
    transactionId: "pi_3Qf4eM2eZvKYlo2C8p9q0r1s",
  },
  {
    id: "p6",
    bookingId: "b15",
    title: "Gaming PC RAM & SSD Upgrade",
    customer: "Farhan Kabir",
    customerEmail: "farhan@mail.com",
    technician: "Nayeem Chowdhury",
    amount: 75,
    paidAt: "2026-07-24",
    transactionId: "pi_3Qf3fN2eZvKYlo2C4n5o6p7q",
  },
  {
    id: "p7",
    bookingId: "b16",
    title: "CCTV Camera Setup (4 cameras)",
    customer: "Tanvir Ahmed",
    customerEmail: "tanvir@mail.com",
    technician: "Nayeem Chowdhury",
    amount: 95,
    paidAt: "2026-06-14",
    transactionId: "pi_3Qf2gO2eZvKYlo2C0m1n2o3p",
  },
  {
    id: "p8",
    bookingId: "b17",
    title: "AC Gas Refill & Leak Test",
    customer: "Farhan Kabir",
    customerEmail: "farhan@mail.com",
    technician: "Rakib Hasan",
    amount: 85,
    paidAt: "2026-09-25",
    transactionId: "pi_3Qf9hP2eZvKYlo2C7k8l9m0n",
  },
  {
    id: "p9",
    bookingId: "b18",
    title: "Refrigerator Cooling Repair",
    customer: "Nusrat Jahan",
    customerEmail: "nusrat@mail.com",
    technician: "Rakib Hasan",
    amount: 55,
    paidAt: "2026-10-16",
    transactionId: "pi_3Qf0iQ2eZvKYlo2C2j3k4l5m",
  },
];

const MONTHS = [
  { key: "2026-06", label: "Jun" },
  { key: "2026-07", label: "Jul" },
  { key: "2026-08", label: "Aug" },
  { key: "2026-09", label: "Sep" },
  { key: "2026-10", label: "Oct" },
  { key: "2026-11", label: "Nov" },
];

const THIS_MONTH = "2026-11";

export const ADMIN_STATS = (() => {
  const technicians = ADMIN_USERS.filter((user) => user.role === "technician");
  const pending = ADMIN_SERVICES.filter(
    (service) => service.approval === "pending",
  );
  const revenue = ADMIN_PAYMENTS.reduce(
    (total, payment) => total + payment.amount,
    0,
  );
  const thisMonth = ADMIN_PAYMENTS.filter((payment) =>
    payment.paidAt.startsWith(THIS_MONTH),
  );
  const newUsers = ADMIN_USERS.filter((user) =>
    user.joined.startsWith(THIS_MONTH),
  ).length;

  return {
    totalUsers: ADMIN_USERS.length,
    technicians: technicians.length,
    proTechnicians: technicians.filter((user) => user.plan === "pro").length,
    pendingServices: pending.length,
    revenue,
    avgTransaction: ADMIN_PAYMENTS.length
      ? Math.round(revenue / ADMIN_PAYMENTS.length)
      : 0,
    thisMonth: thisMonth.reduce((total, payment) => total + payment.amount, 0),
    thisMonthCount: thisMonth.length,
    payments: ADMIN_PAYMENTS.length,
    techniciansPaid: new Set(
      ADMIN_PAYMENTS.map((payment) => payment.technician),
    ).size,
    newUsers,
    listings: ADMIN_SERVICES.length,
    pipelineValue: ADMIN_BOOKINGS.reduce(
      (total, booking) => total + (booking.finalAmount ?? booking.basePrice),
      0,
    ),
  };
})();

export const REVENUE_SERIES = MONTHS.map((month) => ({
  label: month.label,
  value: ADMIN_PAYMENTS.filter((payment) =>
    payment.paidAt.startsWith(month.key),
  ).reduce((total, payment) => total + payment.amount, 0),
}));

export const ROLE_SUMMARY = [
  {
    label: "Customers",
    value: ADMIN_USERS.filter((user) => user.role === "customer").length,
    color: "#7c8cf8",
  },
  {
    label: "Technicians",
    value: ADMIN_USERS.filter((user) => user.role === "technician").length,
    color: "#3ddc97",
  },
  {
    label: "Admins",
    value: ADMIN_USERS.filter((user) => user.role === "admin").length,
    color: "#f0bb6a",
  },
];

export const CATEGORY_JOBS = Object.entries(
  ADMIN_BOOKINGS.reduce<Record<string, number>>((result, booking) => {
    result[booking.category] = (result[booking.category] ?? 0) + 1;
    return result;
  }, {}),
)
  .map(([label, value]) => ({ label, value }))
  .sort((a, b) => b.value - a.value);

export const BOOKING_STATUS_COUNTS = {
  all: ADMIN_BOOKINGS.length,
  requested: ADMIN_BOOKINGS.filter((booking) => booking.status === "requested")
    .length,
  accepted: ADMIN_BOOKINGS.filter((booking) => booking.status === "accepted")
    .length,
  "in-progress": ADMIN_BOOKINGS.filter(
    (booking) => booking.status === "in-progress",
  ).length,
  completed: ADMIN_BOOKINGS.filter((booking) => booking.status === "completed")
    .length,
  rejected: ADMIN_BOOKINGS.filter((booking) => booking.status === "rejected")
    .length,
  cancelled: ADMIN_BOOKINGS.filter((booking) => booking.status === "cancelled")
    .length,
};

export const PENDING_SERVICES = ADMIN_SERVICES.filter(
  (service) => service.approval === "pending",
);

export const RECENT_PAYMENTS = ADMIN_PAYMENTS.slice()
  .sort((a, b) => b.paidAt.localeCompare(a.paidAt))
  .slice(0, 5);
