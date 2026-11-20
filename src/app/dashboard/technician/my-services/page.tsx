import { DashboardPageError } from "@/components/dashboard/dashboard-page-error";
import { TechnicianServices } from "@/components/technician/technician-services";
import { requireRole } from "@/lib/authz";
import { getTechnicianServices } from "@/lib/technician-api";

export default async function MyServicesPage() {
  await requireRole(["technician"]);

  const services = await getTechnicianServices().catch(() => null);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        {services ? (
          <TechnicianServices initialServices={services} />
        ) : (
          <DashboardPageError
            title="We could not load your listings"
            description="Your service listings could not be loaded. Please try again."
            retryHref="/dashboard/technician/my-services"
          />
        )}
      </div>
    </main>
  );
}
