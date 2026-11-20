import { AdminUsers } from "@/components/admin/admin-users";
import { DashboardPageError } from "@/components/dashboard/dashboard-page-error";
import { getAdminUsers } from "@/lib/admin-api";
import { requireRole } from "@/lib/authz";

export default async function AdminUsersPage() {
  const { session } = await requireRole(["admin"]);

  const users = await getAdminUsers().catch(() => null);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        {users ? (
          <AdminUsers
            initialUsers={users}
            currentEmail={session.user.email}
          />
        ) : (
          <DashboardPageError
            title="We could not load users"
            description="The user directory could not be loaded. Please try again."
            retryHref="/dashboard/admin/users"
          />
        )}
      </div>
    </main>
  );
}
