"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ImagePlus,
  Lock,
  Shield,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { GoogleIcon } from "@/components/auth/google-icon";
import { authClient } from "@/lib/auth-client";

const LABEL = "block text-[12.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]";
const INPUT =
  "mt-2 h-11 w-full rounded-[10px] border border-[#e5e1d6] bg-white px-3.5 text-[13.5px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:placeholder:text-[#6f8579] dark:focus:border-[#43d3ab]";
const ROLE_CARD =
  "flex cursor-pointer items-center gap-3 rounded-[10px] border border-[#e5e1d6] bg-white p-3 transition hover:border-[#d2ccbc] peer-checked:border-[#0e6b54] peer-checked:bg-[#e4f2ec] peer-checked:ring-2 peer-checked:ring-[#0e6b54]/15 dark:border-[#263a30] dark:bg-[#0b1510] dark:peer-checked:border-[#43d3ab] dark:peer-checked:bg-[#0c2a20] dark:peer-checked:ring-[#43d3ab]/15";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function SignUpForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageError, setImageError] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<File | null>(null);

  // Release the previous preview URL when it changes or the form unmounts.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image must be under 2 MB.");
      event.target.value = "";
      return;
    }

    setImageError("");
    setImageName(file.name);
    imageFileRef.current = file;
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImagePreview(null);
    setImageName("");
    setImageError("");
    imageFileRef.current = null;

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const passwordHints = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const accountType =
      form.get("role") === "technician" ? "technician" : "customer";

    const { error: authError } = await authClient.signUp.email({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      accountType,
      callbackURL: "/dashboard",
    });

    if (authError) {
      setError(
        authError.message || "Unable to create your account. Please try again.",
      );
      setPending(false);
      return;
    }

    // The account exists at this point. Avatar upload is best-effort so a
    // storage problem never leaves the user without an account.
    const imageFile = imageFileRef.current;
    if (imageFile) {
      try {
        const body = new FormData();
        body.append("file", imageFile);
        const response = await fetch(`${API_URL}/api/v1/uploads/avatar`, {
          method: "POST",
          body,
          credentials: "include",
        });

        if (response.ok) {
          const data = (await response.json()) as { url?: string };
          if (data.url) {
            await authClient.updateUser({ image: data.url });
          }
        }
      } catch {
        // Ignore avatar failures; the user can upload a photo later.
      }
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
      setError(authError.message || "Google sign-up is unavailable.");
      setPending(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-[28px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#0f1a15] dark:text-white">
        Create your account
      </h1>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
        Book repairs as a customer, or find work as a verified technician.
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
        <div className="flex items-center gap-4">
          <span className="relative flex size-[74px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e5e1d6] bg-[#f2efe7] dark:border-[#263a30] dark:bg-white/[0.04]">
            {imagePreview ? (
              <span
                role="img"
                aria-label="Profile photo preview"
                className="size-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imagePreview})` }}
              />
            ) : (
              <UserRound className="size-7 text-[#87948d]" />
            )}
          </span>

          <div className="min-w-0">
            <p className={LABEL}>
              Profile photo{" "}
              <span className="font-normal text-[#87948d]">(optional)</span>
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={pending}
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d2ccbc] bg-white px-3 text-[12px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-[#edf4ef] dark:hover:bg-[#101a16]"
              >
                <ImagePlus className="size-4" />
                Upload photo
              </button>

              {imagePreview && (
                <button
                  type="button"
                  onClick={clearImage}
                  disabled={pending}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[8px] px-2 text-[12px] font-semibold text-[#5f6f68] transition hover:text-[#0f1a15] disabled:opacity-60 dark:text-[#9dab9f] dark:hover:text-white"
                >
                  <X className="size-3.5" />
                  Remove
                </button>
              )}
            </div>

            <p className="mt-1 max-w-[240px] truncate text-[10.5px] text-[#87948d]">
              {imageName || "JPG, PNG or WEBP · max 2 MB"}
            </p>
            {imageError && (
              <p className="mt-1 text-[10.5px] text-[#b42318]">{imageError}</p>
            )}

            <input
              ref={fileInputRef}
              id="avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              aria-label="Profile photo"
              className="sr-only"
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className={LABEL}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Ayesha Rahman"
            required
            disabled={pending}
            className={INPUT}
          />
        </div>

        <div>
          <label htmlFor="email" className={LABEL}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            disabled={pending}
            className={INPUT}
          />
        </div>

        <fieldset disabled={pending}>
          <legend className={LABEL}>I am joining as</legend>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            <label>
              <input
                type="radio"
                name="role"
                value="customer"
                defaultChecked
                className="peer sr-only"
              />
              <span className={ROLE_CARD}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                  <UserRound className="size-[17px]" />
                </span>
                <span>
                  <span className="block text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                    Customer
                  </span>
                  <span className="mt-0.5 block whitespace-nowrap text-[10px] text-[#5f6f68] dark:text-[#9dab9f]">
                    Book repairs and track jobs
                  </span>
                </span>
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="role"
                value="technician"
                className="peer sr-only"
              />
              <span className={ROLE_CARD}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                  <Wrench className="size-[17px]" />
                </span>
                <span>
                  <span className="block text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                    Technician
                  </span>
                  <span className="mt-0.5 block whitespace-nowrap text-[10px] text-[#5f6f68] dark:text-[#9dab9f]">
                    List services, take jobs
                  </span>
                </span>
              </span>
            </label>

            <div className="flex items-center gap-3 rounded-[10px] border border-dashed border-[#e5e1d6] bg-[#fbfaf6] p-3 opacity-60 sm:col-span-2 dark:border-[#263a30] dark:bg-[#0b1510]">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-[#f2efe7] text-[#87948d] dark:bg-white/[0.04]">
                <Shield className="size-[17px]" />
              </span>
              <span>
                <span className="block text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                  Admin
                </span>
                <span className="mt-0.5 block text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  Invite only — admin accounts are created by FixMate, not
                  self sign-up.
                </span>
              </span>
            </div>
          </div>
        </fieldset>

        <div>
          <label htmlFor="password" className={LABEL}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            required
            disabled={pending}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={INPUT}
          />

          {/* Better Auth's default minimum is 8; the case checks are hints only. */}
          <ul className="mt-2 grid gap-1">
            {passwordHints.map((hint) => (
              <li
                key={hint.label}
                className={`flex items-center gap-1.5 text-[10.5px] ${
                  hint.ok
                    ? "text-[#0e6b54] dark:text-[#43d3ab]"
                    : "text-[#87948d]"
                }`}
              >
                <Check className="size-3.5" />
                {hint.label}
              </li>
            ))}
          </ul>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            disabled={pending}
            className="mt-0.5 size-4 shrink-0 rounded border-[#d2ccbc] accent-[#0e6b54] dark:accent-[#43d3ab]"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              onClick={(event) => event.stopPropagation()}
              className="font-semibold underline-offset-2 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and the{" "}
            <Link
              href="/privacy"
              onClick={(event) => event.stopPropagation()}
              className="font-semibold underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            , and I understand payment happens only after the repair is
            completed.
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#0e6b54] text-[14px] font-semibold text-white transition hover:bg-[#0a5342] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
        >
          <ArrowRight className="size-4" />
          {pending ? "Creating account…" : "Create account"}
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
            Sign up with Google
          </button>
        </>
      )}

      <p className="mt-6 text-center text-[12.5px] text-[#5f6f68] dark:text-[#9dab9f]">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-[#0e6b54] hover:underline dark:text-[#43d3ab]"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#87948d]">
        <Lock className="size-3.5" />
        Passwords are hashed. We never store card details.
      </p>
    </div>
  );
}
