import { AdminTransactions } from "@/components/admin/admin-transactions";
import { DashboardPageError } from "@/components/dashboard/dashboard-page-error";
import { getAdminPayments } from "@/lib/admin-api";
import { requireRole } from "@/lib/authz";

export default async function AdminTransactionsPage() {
  await requireRole(["admin"]);

  const payments = await getAdminPayments().catch(() => null);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        {payments ? (
          <AdminTransactions payments={payments} />
        ) : (
          <DashboardPageError
            title="We could not load transactions"
            description="The payment records could not be loaded. Please try again."
            retryHref="/dashboard/admin/transactions"
          />
        )}
      </div>
    </main>
  );
}
