import { ProfileForm } from "@/components/dashboard/profile-form";
import { getAppRole, requireUser } from "@/lib/authz";

export default async function ProfilePage() {
  const session = await requireUser();
  const role = getAppRole(session.user);

  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] px-6 py-8">
        <div className="max-w-[640px]">
          <p className="text-[13px] leading-[1.65] text-[#5f6f68] dark:text-[#9dab9f]">
            Keep your name and photo up to date. Your email and account type are
            managed by FixMate.
          </p>

          <div className="mt-5 rounded-2xl border border-[#e5e1d6] bg-white p-5 sm:p-6 dark:border-white/[0.08] dark:bg-[#101a16]">
            <ProfileForm
              user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
              }}
              role={role}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
