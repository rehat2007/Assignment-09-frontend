import { CustomerBookings } from "@/components/customer/customer-bookings";
import { CustomerPageError } from "@/components/customer/customer-page-error";
import { requireRole } from "@/lib/authz";
import { getCustomerBookings } from "@/lib/customer-api";

export default async function CustomerBookingsPage() {
  await requireRole(["customer"]);

  const bookings = await getCustomerBookings().catch(() => null);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        {bookings ? (
          <CustomerBookings initialBookings={bookings} />
        ) : (
          <CustomerPageError
            title="We could not load your bookings"
            description="Your booking list could not be loaded. Please try again."
            retryHref="/dashboard/customer/bookings"
          />
        )}
      </div>
    </main>
  );
}
