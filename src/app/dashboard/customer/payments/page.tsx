import { CustomerPayments } from "@/components/customer/customer-payments";
import { requireRole } from "@/lib/authz";
import { CUSTOMER_PAYMENTS } from "@/lib/customer-data";

export default async function CustomerPaymentsPage() {
  await requireRole(["customer", "admin"]);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <CustomerPayments payments={CUSTOMER_PAYMENTS} />
      </div>
    </main>
  );
}
