import { AdminTransactions } from "@/components/admin/admin-transactions";
import { ADMIN_PAYMENTS } from "@/lib/admin-data";
import { requireRole } from "@/lib/authz";

export default async function AdminTransactionsPage() {
  await requireRole(["admin"]);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <AdminTransactions
          payments={ADMIN_PAYMENTS.slice().sort((a, b) =>
            b.paidAt.localeCompare(a.paidAt),
          )}
        />
      </div>
    </main>
  );
}
