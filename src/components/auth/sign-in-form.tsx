"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { GoogleIcon } from "@/components/auth/google-icon";
import { authClient } from "@/lib/auth-client";

const LABEL = "block text-[12.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]";
const INPUT =
  "mt-2 h-11 w-full rounded-[10px] border border-[#e5e1d6] bg-white px-3.5 text-[13.5px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:placeholder:text-[#6f8579] dark:focus:border-[#43d3ab]";

export function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const { error: authError } = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      rememberMe: form.get("rememberMe") === "on",
      callbackURL: "/dashboard",
    });

    if (authError) {
      setError(authError.message || "Unable to sign in. Please try again.");
      setPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogle() {
    if (pending) return;

    setPending(true);
    setError("");

    const { error: authError } = await authClient.signIn.social({
      provider: "google",
      // The OAuth callback runs on Express, so return to the frontend origin.
      callbackURL: `${window.location.origin}/dashboard`,
    });

    if (authError) {
      setError(authError.message || "Google sign-in is unavailable.");
      setPending(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-[28px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#0f1a15] dark:text-white">
        Welcome back
      </h1>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
        Sign in to track repairs, manage requests or approve listings.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-[10px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[12px] leading-snug text-[#b42318] dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div>
          <label htmlFor="email" className={LABEL}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="customer@fixmate.dev"
            required
            disabled={pending}
            className={INPUT}
          />
        </div>

        <div>
          <label htmlFor="password" className={LABEL}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            required
            disabled={pending}
            className={INPUT}
          />
          <div className="mt-1.5 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[12px] font-semibold text-[#0e6b54] transition hover:underline dark:text-[#43d3ab]"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-[#27352f] dark:text-[#cfdbd3]">
          <input
            type="checkbox"
            name="rememberMe"
            defaultChecked
            disabled={pending}
            className="size-4 rounded border-[#d2ccbc] accent-[#0e6b54] dark:accent-[#43d3ab]"
          />
          Keep me signed in on this device
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#0e6b54] text-[14px] font-semibold text-white transition hover:bg-[#0a5342] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
        >
          <ArrowRight className="size-4" />
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {googleEnabled && (
        <>
          <div className="my-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#87948d]">
            <span className="h-px flex-1 bg-[#e5e1d6] dark:bg-white/10" />
            or
            <span className="h-px flex-1 bg-[#e5e1d6] dark:bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={pending}
            className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-[10px] border border-[#e5e1d6] bg-white text-[13.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-[#edf4ef] dark:hover:bg-[#101a16]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </>
      )}

      <p className="mt-6 text-center text-[12.5px] text-[#5f6f68] dark:text-[#9dab9f]">
        New to FixMate?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-[#0e6b54] hover:underline dark:text-[#43d3ab]"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
