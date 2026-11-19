import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getSession } from "@/lib/authz";

export const metadata: Metadata = {
  title: "Sign in — FixMate",
  description:
    "Sign in to track repairs, manage requests or approve listings on FixMate.",
};

export default async function SignInPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <AuthShell>
      <SignInForm googleEnabled={googleEnabled} />
    </AuthShell>
  );
}
