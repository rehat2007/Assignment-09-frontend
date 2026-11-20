import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Construction } from "lucide-react";
import { requireRole } from "@/lib/authz";

const SECTIONS: Record<string, { title: string; workspace: string }> = {
  "customer/bookings": { title: "My Bookings", workspace: "Customer" },
  "customer/payments": { title: "Payment History", workspace: "Customer" },
  "technician/services": { title: "My Services", workspace: "Technician" },
  "technician/services/new": { title: "Add a Service", workspace: "Technician" },
  "technician/requests": { title: "Manage Requests", workspace: "Technician" },
  "admin/users": { title: "Users", workspace: "Admin" },
  "admin/services": { title: "Service Approval", workspace: "Admin" },
  "admin/bookings": { title: "All Bookings", workspace: "Admin" },
  "admin/transactions": { title: "Transactions", workspace: "Admin" },
};

type Props = {
  params: Promise<{ section: string[] }>;
};

export default async function DashboardSectionPage({ params }: Props) {
  const { section } = await params;
  const [workspace, ...rest] = section;

  if (workspace === "customer") {
    await requireRole(["customer", "admin"]);
  } else if (workspace === "technician") {
    await requireRole(["technician", "admin"]);
  } else if (workspace === "admin") {
    await requireRole(["admin"]);
  } else {
    notFound();
  }

  const entry = SECTIONS[`${workspace}/${rest.join("/")}`];
  if (!entry) notFound();

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-10">
        <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#0e6b54] dark:text-[#43d3ab]">
          <span className="h-px w-[18px] bg-current opacity-60" />
          {entry.workspace} workspace
        </p>

        <h1 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.05] tracking-[-0.038em] text-[#0f1a15] sm:text-[2.4rem] dark:text-white">
          {entry.title}
        </h1>

        <div className="mt-7 flex max-w-[640px] flex-col items-start rounded-2xl border border-dashed border-[#d2ccbc] bg-white p-6 dark:border-white/15 dark:bg-[#101a16]">
          <span className="flex size-10 items-center justify-center rounded-[11px] bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
            <Construction className="size-5" />
          </span>
          <h2 className="mt-4 font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
            This section is ready for content
          </h2>
          <p className="mt-2 max-w-[48ch] text-[13px] leading-[1.65] text-[#5f6f68] dark:text-[#9dab9f]">
            The dashboard layout, navigation and permissions are in place. Add
            the table, forms or cards for this section here.
          </p>
          <Link
            href={`/dashboard/${workspace}`}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/[0.06]"
          >
            <ArrowLeft className="size-3.5" />
            Back to overview
          </Link>
        </div>
      </div>
    </main>
  );
}
