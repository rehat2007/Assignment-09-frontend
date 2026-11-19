import { redirect } from "next/navigation";
import { getAppRole, requireUser } from "@/lib/authz";

export default async function DashboardPage() {
  const session = await requireUser();
  redirect(`/dashboard/${getAppRole(session.user)}`);
}
