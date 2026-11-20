import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAppRole, type AppRole } from "@/lib/roles";

export { getAppRole };
export type { AppRole };

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  role?: string | null;
  accountType?: string | null;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | Date | null;
};

export type AppSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: string | Date;
    token?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: SessionUser;
};

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export const getSession = cache(async (): Promise<AppSession | null> => {
  const cookie = (await headers()).get("cookie") ?? "";

  // Every protected page is cookie-based; skip the round trip when signed out.
  if (!cookie) return null;

  const response = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as AppSession | null;

  // Better Auth returns `null` (HTTP 200) when the cookie is missing/invalid.
  return data?.session && data?.user ? data : null;
});

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
