"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GoogleIcon } from "@/components/auth/google-icon";

const LABEL = "block text-[12.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]";
const INPUT =
  "mt-2 h-11 w-full rounded-[10px] border border-[#e5e1d6] bg-white px-3.5 text-[13.5px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:placeholder:text-[#6f8579] dark:focus:border-[#43d3ab]";

export function SignInForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO(Better Auth): replace with the real client call, e.g.
    // await authClient.signIn.email({ email, password, rememberMe, callbackURL: "/" });
  }

  return (
    <div>
      <h1 className="font-heading text-[28px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#0f1a15] dark:text-white">
        Welcome back
      </h1>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
        Sign in to track repairs, manage requests or approve listings.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
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
            className="size-4 rounded border-[#d2ccbc] accent-[#0e6b54] dark:accent-[#43d3ab]"
          />
          Keep me signed in on this device
        </label>

        <button
          type="submit"
          className="mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#0e6b54] text-[14px] font-semibold text-white transition hover:bg-[#0a5342] dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
        >
          <ArrowRight className="size-4" />
          Sign in
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#87948d]">
        <span className="h-px flex-1 bg-[#e5e1d6] dark:bg-white/10" />
        or
        <span className="h-px flex-1 bg-[#e5e1d6] dark:bg-white/10" />
      </div>

      {/* TODO(Better Auth): wire this to authClient.signIn.social({ provider: "google" }). */}
      <button
        type="button"
        className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-[10px] border border-[#e5e1d6] bg-white text-[13.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-[#263a30] dark:bg-[#0b1510] dark:text-[#edf4ef] dark:hover:bg-[#101a16]"
      >
        <GoogleIcon />
        Continue with Google
      </button>

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
