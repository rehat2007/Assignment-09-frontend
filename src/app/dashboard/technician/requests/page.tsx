import { TechnicianRequests } from "@/components/technician/technician-requests";
import { requireRole } from "@/lib/authz";
import { TECHNICIAN_REQUESTS } from "@/lib/technician-data";

export default async function TechnicianRequestsPage() {
  await requireRole(["technician", "admin"]);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <TechnicianRequests initialRequests={TECHNICIAN_REQUESTS} />
      </div>
    </main>
  );
}
