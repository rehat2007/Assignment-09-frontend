import {
  CustomerDashboardItems,
  DashboardPanel,
} from "@/components/dashboard/dashboard-panel";
import { requireRole } from "@/lib/authz";

export default async function CustomerDashboardPage() {
  const { session, role } = await requireRole(["customer", "admin"]);

  return (
    <DashboardPanel
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      role={role}
      eyebrow="Customer dashboard"
      heading="Your repairs, tracked."
      intro="Follow every job from request to payment, and keep the services you use most close at hand."
      items={CustomerDashboardItems()}
    />
  );
}
