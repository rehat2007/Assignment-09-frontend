import { AdminServiceApproval } from "@/components/admin/admin-service-approval";
import { DashboardPageError } from "@/components/dashboard/dashboard-page-error";
import { getAdminServices } from "@/lib/admin-api";
import { requireRole } from "@/lib/authz";

export default async function AdminServicesPage() {
  await requireRole(["admin"]);

  const services = await getAdminServices().catch(() => null);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        {services ? (
          <AdminServiceApproval initialServices={services} />
        ) : (
          <DashboardPageError
            title="We could not load listings"
            description="The service approval queue could not be loaded. Please try again."
            retryHref="/dashboard/admin/services"
          />
        )}
      </div>
    </main>
  );
}
