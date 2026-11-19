import type { ReactNode } from "react";
import { requireUser } from "@/lib/authz";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();
  return <>{children}</>;
}
