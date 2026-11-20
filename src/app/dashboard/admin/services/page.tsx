import { AdminServiceApproval } from "@/components/admin/admin-service-approval";
import { ADMIN_SERVICES } from "@/lib/admin-data";
import { requireRole } from "@/lib/authz";

export default async function AdminServicesPage() {
  await requireRole(["admin"]);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <AdminServiceApproval initialServices={ADMIN_SERVICES} />
      </div>
    </main>
  );
}
