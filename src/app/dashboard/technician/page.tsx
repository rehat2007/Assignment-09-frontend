import {
  DashboardPanel,
  TechnicianDashboardItems,
} from "@/components/dashboard/dashboard-panel";
import { requireRole } from "@/lib/authz";

export default async function TechnicianDashboardPage() {
  const { session, role } = await requireRole(["technician", "admin"]);

  return (
    <DashboardPanel
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      role={role}
      eyebrow="Technician dashboard"
      heading="Jobs, listings and payouts."
      intro="Manage the work assigned to you, keep your services current and see what has been paid out."
      items={TechnicianDashboardItems()}
    />
  );
}
