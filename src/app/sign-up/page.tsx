import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getSession } from "@/lib/authz";

export const metadata: Metadata = {
  title: "Create your account — FixMate",
  description:
    "Create a FixMate account as a customer or technician. Admin accounts are invite-only.",
};

export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <AuthShell>
      <SignUpForm googleEnabled={googleEnabled} />
    </AuthShell>
  );
}
