"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { AppRole } from "@/lib/roles";

const ROLE_LABEL: Record<AppRole, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export function ProfileForm({
  user,
  role,
}: {
  user: { name: string; email: string; image?: string | null };
  role: AppRole;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
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
      const response = await fetch("/api/avatar", { method: "POST", body });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error ?? "Could not upload the photo.");
        setPending(false);
        return;
      }

      const data = (await response.json()) as { url?: string };
      imageUrl = data.url;
    }

    const { error: authError } = await authClient.updateUser({
      name,
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

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {error && (
        <p
          role="alert"
          className="rounded-[10px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[12px] text-[#b42318] dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
        >
          {error}
        </p>
      )}
      {success && (
        <p
          role="status"
          className="rounded-[10px] border border-[#0e6b54]/20 bg-[#e4f2ec] px-3 py-2.5 text-[12px] text-[#0e6b54] dark:border-[#43d3ab]/20 dark:bg-[#112c25] dark:text-[#43d3ab]"
        >
          {success}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <span
          className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e5e1d6] bg-[#f6e7c8] bg-cover bg-center text-[16px] font-bold text-[#a86a12] dark:border-[#263a30] dark:bg-[#2a2114]"
          style={preview ? { backgroundImage: `url(${preview})` } : undefined}
        >
          {!preview && initials}
        </span>

        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-3 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-[#edf4ef] dark:hover:bg-[#101a16]"
          >
            <ImagePlus className="size-4" />
            Change photo
          </button>
          <p className="mt-1.5 text-[10.5px] text-[#87948d]">
            JPG, PNG or WEBP · max 2 MB
          </p>
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

      <div>
        <label
          htmlFor="profile-name"
          className="block text-[12.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]"
        >
          Full name
        </label>
        <input
          id="profile-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          disabled={pending}
          className="mt-2 h-11 w-full rounded-[10px] border border-[#e5e1d6] bg-white px-3.5 text-[13.5px] text-[#0f1a15] outline-none transition focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 disabled:opacity-60 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:focus:border-[#43d3ab]"
        />
      </div>

      <div>
        <label className="block text-[12.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
          Email address
        </label>
        <input
          value={user.email}
          readOnly
          disabled
          className="mt-2 h-11 w-full rounded-[10px] border border-[#e5e1d6] bg-[#f2efe7] px-3.5 text-[13.5px] text-[#5f6f68] dark:border-[#263a30] dark:bg-white/[0.04] dark:text-[#9dab9f]"
        />
      </div>

      <div>
        <p className="block text-[12.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
          Account type
        </p>
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-[6px] bg-[#e4f2ec] px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
          <span className="size-1.5 rounded-full bg-current" />
          {ROLE_LABEL[role]}
        </span>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-12 w-full items-center justify-center rounded-[10px] bg-[#0e6b54] px-5 text-[14px] font-semibold text-white transition hover:bg-[#0a5342] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:bg-[#43d3ab] dark:text-[#06231b] dark:hover:bg-[#6ee7c3]"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
