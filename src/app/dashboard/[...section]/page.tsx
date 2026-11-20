import { notFound } from "next/navigation";
import { requireRole } from "@/lib/authz";

type Props = {
  params: Promise<{ section: string[] }>;
};

/* Unknown dashboard sections still pass through the matching role guard
   before returning 404, so unauthorised users cannot probe them. */
export default async function DashboardSectionPage({ params }: Props) {
  const { section } = await params;
  const [workspace] = section;

  if (workspace === "customer") {
    await requireRole(["customer", "admin"]);
  } else if (workspace === "technician") {
    await requireRole(["technician", "admin"]);
  } else if (workspace === "admin") {
    await requireRole(["admin"]);
  } else {
    notFound();
  }

  notFound();
}
