"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ImagePlus,
  Lock,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import type { AppRole } from "@/lib/roles";

const ROLE_LABEL: Record<AppRole, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

const PERMISSIONS: Record<AppRole, string> = {
  customer: "Can request repairs",
  technician: "Can manage own services",
  admin: "Full platform access",
};

const TABS = ["Personal details", "Security", "Notifications"] as const;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function ProfileForm({
  user,
  role,
}: {
  user: {
    name: string;
    email: string;
    image?: string | null;
    phone?: string | null;
    area?: string | null;
    bio?: string | null;
  };
  role: AppRole;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Personal details");
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [area, setArea] = useState(user.area ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [preview, setPreview] = useState(user.image ?? null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileToUpload = useRef<File | null>(null);
  const blobUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    };
  }, []);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB.");
      event.target.value = "";
      return;
    }

    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    const url = URL.createObjectURL(file);
    blobUrl.current = url;
    fileToUpload.current = file;
    setError("");
    setSuccess("");
    setPreview(url);
  }

  function resetForm() {
    setName(user.name);
    setPhone(user.phone ?? "");
    setArea(user.area ?? "");
    setBio(user.bio ?? "");
    setError("");
    setSuccess("");
    fileToUpload.current = null;

    if (blobUrl.current) {
      URL.revokeObjectURL(blobUrl.current);
      blobUrl.current = null;
    }

    setPreview(user.image ?? null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError("");
    setSuccess("");

    let imageUrl: string | undefined;

    if (fileToUpload.current) {
      const body = new FormData();
      body.append("file", fileToUpload.current);
      const response = await fetch(`${API_URL}/api/v1/uploads/avatar`, {
        method: "POST",
        body,
        credentials: "include",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: { message?: string } | string;
        };
        const message =
          typeof data.error === "string" ? data.error : data.error?.message;
        setError(message ?? "Could not upload the photo.");
        setPending(false);
        return;
      }

      const data = (await response.json()) as {
        data?: { url?: string };
      };
      const url = data.data?.url;

      if (!url) {
        setError("Could not upload the photo.");
        setPending(false);
        return;
      }

      imageUrl = url;
    }

    const { error: authError } = await authClient.updateUser({
      name,
      phone,
      area,
      bio,
      ...(imageUrl ? { image: imageUrl } : {}),
    });

    if (authError) {
      setError(authError.message || "Could not update your profile.");
      setPending(false);
      return;
    }

    if (imageUrl) {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      blobUrl.current = null;
      setPreview(imageUrl);
    }

    fileToUpload.current = null;
    if (fileRef.current) fileRef.current.value = "";
    setPending(false);
    setSuccess("Profile updated.");
    await authClient.getSession();
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]">
      <div className="flex gap-1 overflow-x-auto border-b border-[#e5e1d6] px-3 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-white/[0.08]">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "relative shrink-0 px-3 pb-3 text-[12.5px] transition-colors",
              tab === item
                ? "font-semibold text-[#0e6b54] dark:text-[#63e6b6]"
                : "text-[#5f6f68] hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:text-white",
            )}
          >
            {item}
            {tab === item && (
              <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-t bg-[#0e6b54] dark:bg-[#63e6b6]" />
            )}
          </button>
        ))}
      </div>

      {tab === "Personal details" && (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            {error && (
              <p
                role="alert"
                className="rounded-[9px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[11.5px] text-[#b42318] sm:col-span-2 dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
              >
                {error}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="rounded-[9px] border border-[#0e6b54]/20 bg-[#e4f2ec] px-3 py-2.5 text-[11.5px] text-[#0e6b54] sm:col-span-2 dark:border-[#43d3ab]/20 dark:bg-[#112c25] dark:text-[#43d3ab]"
              >
                {success}
              </p>
            )}

            <Field label="Full name" htmlFor="profile-name">
              <input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                disabled={pending}
                className={INPUT}
              />
            </Field>

            <Field label="Email address" hint="Linked to your auth account — contact support to change.">
              <input
                id="profile-email"
                value={user.email}
                readOnly
                disabled
                className={`${INPUT} bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]`}
              />
            </Field>

            <Field label="Phone">
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+880 1712 345678"
                disabled={pending}
                className={INPUT}
              />
            </Field>

            <Field label="Area">
              <input
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="Dhanmondi, Dhaka"
                disabled={pending}
                className={INPUT}
              />
            </Field>

            <div className="sm:col-span-2">
              <label className="flex items-center justify-between gap-3 text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                Bio
                <span className="text-[10px] font-normal text-[#87948d]">
                  optional
                </span>
              </label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value.slice(0, 240))}
                rows={3}
                disabled={pending}
                placeholder={
                  role === "technician"
                    ? "Tell customers about your experience and specialties."
                    : "Tell technicians a little about your devices."
                }
                className="mt-1.5 w-full resize-none rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 py-2.5 text-[12.5px] leading-[1.6] text-[#0f1a15] outline-none transition focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:focus:border-[#43d3ab]"
              />
              <p className="mt-1 text-[10px] text-[#87948d]">
                {role === "technician"
                  ? "This bio appears on every service detail page you own. Up to 240 characters."
                  : "Helps technicians know who they are visiting. Up to 240 characters."}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                Role &amp; permissions
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-[#fbfaf6] px-2.5 py-1 text-[10.5px] text-[#5f6f68] dark:border-white/10 dark:bg-white/[0.03] dark:text-[#9dab9f]">
                  <UserRound className="size-3" />
                  {ROLE_LABEL[role]}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e1d6] bg-[#fbfaf6] px-2.5 py-1 text-[10.5px] text-[#5f6f68] dark:border-white/10 dark:bg-white/[0.03] dark:text-[#9dab9f]">
                  <ShieldCheck className="size-3" />
                  {PERMISSIONS[role]}
                </span>
              </div>
              <p className="mt-2 text-[10px] text-[#87948d]">
                Roles are assigned by an admin and cannot be changed here.
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                Profile photo
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 rounded-[10px] border border-[#e5e1d6] bg-[#fbfaf6] p-3 dark:border-white/[0.08] dark:bg-[#0b1510]">
                <span
                  className="size-11 shrink-0 rounded-full bg-[#f6e7c8] bg-cover bg-center text-[12px] font-bold text-[#a86a12]"
                  style={
                    preview ? { backgroundImage: `url(${preview})` } : undefined
                  }
                >
                  {!preview && (
                    <span className="flex size-full items-center justify-center">
                      {initials}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold text-[#0f1a15] dark:text-white">
                    Current photo
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#87948d]">
                    JPG, PNG or WEBP · max 2 MB · synced with the navbar
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={pending}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d2ccbc] bg-white px-3 text-[11.5px] font-semibold text-[#27352f] transition hover:bg-[#f6f4ee] disabled:opacity-60 dark:border-white/15 dark:bg-transparent dark:text-white"
                >
                  <ImagePlus className="size-3.5" />
                  Replace
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImage}
                  aria-label="Profile photo"
                  className="sr-only"
                />
              </div>
            </div>

            <p className="flex items-center gap-2 rounded-[9px] bg-[#eef1ff] px-3 py-2.5 text-[11px] text-[#3730a3] sm:col-span-2 dark:bg-[#151a3a] dark:text-[#a9a4ff]">
              <Lock className="size-3.5 shrink-0" />
              Email and role are read-only. Everything else is yours to edit.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#e5e1d6] bg-[#fbfaf6] px-5 py-3.5 sm:px-6 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <button
              type="button"
              onClick={resetForm}
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d2ccbc] px-3.5 text-[11.5px] font-semibold text-[#27352f] transition hover:bg-white disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/[0.04]"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-9 items-center rounded-[8px] bg-[#0e6b54] px-4 text-[11.5px] font-semibold text-white transition hover:bg-[#0a5342] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}

      {tab === "Security" && (
        <div className="grid gap-4 p-5 sm:p-6">
          <div className="rounded-xl border border-[#e5e1d6] p-4 dark:border-white/[0.08]">
            <h2 className="flex items-center gap-2 font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
              <Lock className="size-4 text-[#87948d]" />
              Password and sessions
            </h2>
            <p className="mt-2 text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
              Password changes, session revocation and account recovery are
              handled by Better Auth. Email-based password reset is not wired
              up yet.
            </p>
          </div>
        </div>
      )}

      {tab === "Notifications" && (
        <div className="grid gap-4 p-5 sm:p-6">
          <div className="rounded-xl border border-[#e5e1d6] p-4 dark:border-white/[0.08]">
            <h2 className="flex items-center gap-2 font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
              <Bell className="size-4 text-[#87948d]" />
              Notification preferences
            </h2>
            <p className="mt-2 text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
              Email and SMS notification preferences are not connected yet.
              Booking updates currently appear in your dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT =
  "mt-1.5 h-11 w-full rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 text-[12.5px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:focus:border-[#43d3ab]";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[10px] text-[#87948d]">{hint}</p>}
    </div>
  );
}
