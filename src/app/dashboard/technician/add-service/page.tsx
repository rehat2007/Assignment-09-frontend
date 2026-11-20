import { AddServiceForm } from "@/components/technician/add-service-form";
import { requireRole } from "@/lib/authz";

export default async function AddServicePage() {
  const { session } = await requireRole(["technician"]);
  const user = session.user;

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <AddServiceForm
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
            area: user.area,
          }}
        />
      </div>
    </main>
  );
}
