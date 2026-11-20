import { AdminUsers } from "@/components/admin/admin-users";
import { ADMIN_USERS } from "@/lib/admin-data";
import { requireRole } from "@/lib/authz";

export default async function AdminUsersPage() {
  const { session } = await requireRole(["admin"]);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <AdminUsers
          initialUsers={ADMIN_USERS}
          currentEmail={session.user.email}
        />
      </div>
    </main>
  );
}
