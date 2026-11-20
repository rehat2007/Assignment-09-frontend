import { CustomerBookings } from "@/components/customer/customer-bookings";
import { requireRole } from "@/lib/authz";
import { CUSTOMER_BOOKINGS } from "@/lib/customer-data";

export default async function CustomerBookingsPage() {
  await requireRole(["customer", "admin"]);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <CustomerBookings initialBookings={CUSTOMER_BOOKINGS} />
      </div>
    </main>
  );
}
