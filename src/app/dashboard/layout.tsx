import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getAppRole, requireUser } from "@/lib/authz";
import { getAdminOverview } from "@/lib/admin-api";
import { getTechnicianOverview } from "@/lib/technician-api";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser();
  const role = getAppRole(session.user);

  let counts:
    | {
        pendingRequests?: number;
        pendingServices?: number;
        activeListings?: number;
      }
    | undefined;

  try {
    if (role === "admin") {
      const overview = await getAdminOverview();
      counts = { pendingServices: overview.stats.pendingServices };
    } else if (role === "technician") {
      const overview = await getTechnicianOverview();
      counts = {
        pendingRequests: overview.stats.pendingRequests,
        activeListings: overview.stats.availableServices,
      };
    }
  } catch {
    counts = undefined;
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        area: session.user.area,
      }}
      role={role}
      counts={counts}
    >
      {children}
    </DashboardShell>
  );
}
