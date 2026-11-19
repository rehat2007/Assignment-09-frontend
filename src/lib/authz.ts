import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAppRole, type AppRole } from "@/lib/roles";

export { getAppRole };
export type { AppRole };

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

export async function requireRole(allowed: AppRole[]) {
  const session = await requireUser();
  const role = getAppRole(session.user);

  if (!allowed.includes(role)) {
    redirect("/dashboard");
  }

  return { session, role };
}
