import {
  AdminDashboardItems,
  DashboardPanel,
} from "@/components/dashboard/dashboard-panel";
import { requireRole } from "@/lib/authz";

export default async function AdminDashboardPage() {
  const { session, role } = await requireRole(["admin"]);

  return (
    <DashboardPanel
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      role={role}
      eyebrow="Admin dashboard"
      heading="Keep the marketplace healthy."
      intro="Review accounts, approve listings and monitor the jobs moving through FixMate."
      items={AdminDashboardItems()}
    />
  );
}
