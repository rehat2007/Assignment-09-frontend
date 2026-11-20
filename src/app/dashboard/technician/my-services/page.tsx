import { TechnicianServices } from "@/components/technician/technician-services";
import { requireRole } from "@/lib/authz";
import { TECHNICIAN_SERVICES } from "@/lib/technician-data";

export default async function MyServicesPage() {
  await requireRole(["technician", "admin"]);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <TechnicianServices initialServices={TECHNICIAN_SERVICES} />
      </div>
    </main>
  );
}
