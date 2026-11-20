import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getAppRole, requireUser } from "@/lib/authz";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser();
  const role = getAppRole(session.user);

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        area: session.user.area,
      }}
      role={role}
    >
      {children}
    </DashboardShell>
  );
}
