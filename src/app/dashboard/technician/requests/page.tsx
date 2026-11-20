import { DashboardPageError } from "@/components/dashboard/dashboard-page-error";
import { TechnicianRequests } from "@/components/technician/technician-requests";
import { requireRole } from "@/lib/authz";
import { getTechnicianRequests } from "@/lib/technician-api";

export default async function TechnicianRequestsPage() {
  await requireRole(["technician"]);

  const requests = await getTechnicianRequests().catch(() => null);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        {requests ? (
          <TechnicianRequests initialRequests={requests} />
        ) : (
          <DashboardPageError
            title="We could not load your requests"
            description="Your assigned repair requests could not be loaded. Please try again."
            retryHref="/dashboard/technician/requests"
          />
        )}
      </div>
    </main>
  );
}
