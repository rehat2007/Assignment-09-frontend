"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Check,
  House,
  Info,
  Plus,
  Sparkles,
  Star,
  Upload,
  UserRound,
} from "lucide-react";
import { CATEGORIES } from "@/lib/services";
import { TECHNICIAN_PREVIEW } from "@/lib/technician-data";

const INPUT =
  "mt-1.5 h-11 w-full rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 text-[12.5px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:placeholder:text-[#6f8579] dark:focus:border-[#43d3ab]";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const TIPS = [
  ["Use a real cover photo", "Show the device or your workspace, not a stock logo."],
  ["Price honestly", "The base price appears as “from”. You set the final amount later."],
  ["Be specific about scope", "List what is included so customers know what they pay for."],
  ["Pick a tight area", "Smaller coverage areas get better response rates."],
];

export function AddServiceForm({
  user,
}: {
  user: { name: string; email: string; image?: string | null; area?: string | null };
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [area, setArea] = useState(user.area ?? "");
  const [mode, setMode] = useState<"Home Visit" | "Shop Drop-off">("Home Visit");
  const [cover, setCover] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const blobUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    };
  }, []);

  function handleCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    const url = URL.createObjectURL(file);
    blobUrl.current = url;
    setCover(url);
    setError("");
  }

  function sampleCover() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e6b54"/><stop offset="1" stop-color="#0b1713"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><g fill="none" stroke="#5ad19a" stroke-width="10" stroke-linecap="round"><rect x="250" y="90" width="140" height="220" rx="26"/><path d="M290 120h60"/><circle cx="320" cy="210" r="44"/><path d="m300 212 16 16 28-32"/></g><text x="320" y="360" fill="#cfeee2" font-family="sans-serif" font-size="22" text-anchor="middle" letter-spacing="2">FIXMATE ${category ? category.toUpperCase() : "SERVICE"}</text></svg>`;
    setCover(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError("");

    if (title.trim().length < 6) {
      setError("Give the service a clear title of at least 6 characters.");
      return;
    }
    if (!category) {
      setError("Choose a category.");
      return;
    }
    if (Number(price) <= 0) {
      setError("Enter a price greater than 0.");
      return;
    }
    if (description.trim().length < 40) {
      setError("Describe the service in at least 40 characters.");
      return;
    }
    if (!duration.trim()) {
      setError("Add an estimated duration.");
      return;
    }
    if (area.trim().length < 2) {
      setError("Enter the area you cover.");
      return;
    }

    setPending(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/technician/services`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          location: area.trim(),
          duration: duration.trim(),
          price: Number(price),
          mode,
          includes: [],
        }),
      });

      const body = (await response.json().catch(() => null)) as
        | {
            data?: { id?: string };
            error?: { message?: string };
          }
        | null;

      if (!response.ok) {
        throw new Error(
          body?.error?.message ?? "Could not submit this listing.",
        );
      }

      setPending(false);
      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not submit this listing.",
      );
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
            Add a service
          </h1>
          <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
            List a repair you offer. An admin reviews it before it appears
            publicly.
          </p>
        </div>

        <Link
          href="/dashboard/technician/my-services"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]"
        >
          <ArrowLeft className="size-4" />
          My services
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]"
        >
          <div className="flex items-start justify-between gap-3 border-b border-[#e5e1d6] p-5 dark:border-white/[0.08]">
            <div>
              <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
                <Plus className="size-4 text-[#87948d]" />
                Service details
              </h2>
              <p className="mt-1 text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                All fields are required unless marked optional
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#f2efe7] px-2 py-1 text-[10px] font-semibold text-[#5f6f68] dark:bg-white/[0.05] dark:text-[#9dab9f]">
              <span className="size-1.5 rounded-full bg-current" />
              Draft
            </span>
          </div>

          <div className="grid gap-4 p-5 sm:p-6">
            {error && (
              <p
                role="alert"
                className="rounded-[9px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[11.5px] text-[#b42318] dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
              >
                {error}
              </p>
            )}

            <div>
              <label htmlFor="service-title" className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                Service title
              </label>
              <input
                id="service-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. iPhone 13 Screen Replacement"
                className={INPUT}
              />
              <p className="mt-1 text-[10px] text-[#87948d]">
                Be specific about the device and repair — this is what customers
                search.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="service-category" className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Category
                </label>
                <select
                  id="service-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={INPUT}
                >
                  <option value="">Choose a category</option>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="service-price" className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Base price (USD)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-[25px] text-[12px] text-[#87948d]">
                    $
                  </span>
                  <input
                    id="service-price"
                    type="number"
                    min="1"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="49"
                    className={`${INPUT} pl-7`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="service-description" className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                Description
              </label>
              <textarea
                id="service-description"
                rows={4}
                maxLength={400}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What does the customer get? Mention the parts, the process and anything they should know."
                className="mt-1.5 w-full resize-none rounded-[9px] border border-[#e5e1d6] bg-white px-3.5 py-2.5 text-[12.5px] leading-[1.6] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 dark:border-[#263a30] dark:bg-[#0b1510] dark:text-white dark:placeholder:text-[#6f8579] dark:focus:border-[#43d3ab]"
              />
              <p className="mt-1 text-[10px] text-[#87948d]">
                {description.length}/400 characters · minimum 40
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="service-duration" className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Estimated duration
                </label>
                <input
                  id="service-duration"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="e.g. 2–3 hours"
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="service-area" className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                  Service area
                </label>
                <input
                  id="service-area"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  placeholder="e.g. Mirpur, Dhaka"
                  className={INPUT}
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                Service mode
              </legend>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                {[
                  {
                    value: "Home Visit" as const,
                    title: "Home visit",
                    text: "You travel to the customer",
                    icon: <House className="size-4" />,
                  },
                  {
                    value: "Shop Drop-off" as const,
                    title: "Shop drop-off",
                    text: "Customer brings it to you",
                    icon: <Briefcase className="size-4" />,
                  },
                ].map((item) => (
                  <label key={item.value}>
                    <input
                      type="radio"
                      name="mode"
                      value={item.value}
                      checked={mode === item.value}
                      onChange={() => setMode(item.value)}
                      className="peer sr-only"
                    />
                    <span className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-[#e5e1d6] bg-white p-3 transition peer-checked:border-[#0e6b54] peer-checked:bg-[#e4f2ec] peer-checked:ring-2 peer-checked:ring-[#0e6b54]/10 dark:border-[#263a30] dark:bg-[#0b1510] dark:peer-checked:border-[#43d3ab] dark:peer-checked:bg-[#0c2a20]">
                      <span className="flex size-9 items-center justify-center rounded-[9px] bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                        {item.icon}
                      </span>
                      <span>
                        <span className="block text-[12px] font-semibold text-[#0f1a15] dark:text-white">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-[#5f6f68] dark:text-[#9dab9f]">
                          {item.text}
                        </span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <p className="text-[11.5px] font-semibold text-[#27352f] dark:text-[#cfdbd3]">
                Service banner
              </p>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#d2ccbc] bg-[#fbfaf6] px-4 py-7 text-center dark:border-white/15 dark:bg-white/[0.02]">
                {cover ? (
                  <span
                    className="h-24 w-full max-w-[260px] rounded-[7px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${cover})` }}
                    role="img"
                    aria-label="Service banner preview"
                  />
                ) : (
                  <span className="flex size-10 items-center justify-center rounded-full border border-[#d2ccbc] bg-white text-[#5f6f68] dark:border-white/15 dark:bg-[#101a16] dark:text-[#9dab9f]">
                    <Upload className="size-4" />
                  </span>
                )}
                <span className="text-[11.5px] font-semibold text-[#27352f] dark:text-white">
                  {cover ? "Replace the cover image" : "Click to upload or drag an image here"}
                </span>
                <span className="text-[10px] text-[#87948d]">
                  JPG or PNG · up to 5 MB
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleCover}
                  className="sr-only"
                />
              </label>
              <button
                type="button"
                onClick={sampleCover}
                className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0e6b54] hover:underline dark:text-[#63e6b6]"
              >
                <Sparkles className="size-3.5" />
                Use a sample cover
              </button>
              <p className="mt-2 text-[10px] text-[#87948d]">
                Cover uploads are not saved yet; your listing will use FixMate
                category art for now.
              </p>
            </div>

            <p className="flex items-start gap-2 rounded-[9px] bg-[#eef1ff] px-3 py-2.5 text-[11px] leading-[1.55] text-[#3730a3] dark:bg-[#151a3a] dark:text-[#a9a4ff]">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Your service is saved as <b>pending</b> and will not appear on
                the public site until an admin approves it. Editing it later
                sends it back for review.
              </span>
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#e5e1d6] bg-[#fbfaf6] px-5 py-4 sm:px-6 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex h-9 items-center rounded-[8px] border border-[#d2ccbc] px-3.5 text-[11.5px] font-semibold text-[#27352f] dark:border-white/15 dark:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-[#0e6b54] px-4 text-[11.5px] font-semibold text-white transition hover:bg-[#0a5342] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
            >
              <Check className="size-3.5" />
              {pending ? "Submitting…" : "Submit for approval"}
            </button>
          </div>
        </form>

        <aside className="grid gap-4">
          <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
            <h2 className="flex items-center gap-2 font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
              <UserRound className="size-4 text-[#87948d]" />
              Listing owner
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f6e7c8] bg-cover bg-center text-[12px] font-bold text-[#a86a12]"
                style={
                  user.image
                    ? { backgroundImage: `url(${user.image})` }
                    : undefined
                }
              >
                {!user.image &&
                  user.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold text-[#0f1a15] dark:text-white">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                  {user.email}
                </p>
              </div>
            </div>

            <dl className="mt-4 grid gap-2.5 border-t border-[#e5e1d6] pt-4 text-[11px] dark:border-white/[0.08]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#5f6f68] dark:text-[#9dab9f]">Base area</dt>
                <dd className="font-medium text-[#27352f] dark:text-[#cfdbd3]">
                  {area || "Mirpur, Dhaka"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#5f6f68] dark:text-[#9dab9f]">Plan</dt>
                <dd className="font-medium text-[#27352f] dark:text-[#cfdbd3]">
                  {TECHNICIAN_PREVIEW.plan} · unlimited
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#5f6f68] dark:text-[#9dab9f]">Rating</dt>
                <dd className="flex items-center gap-1 font-medium text-[#27352f] dark:text-[#cfdbd3]">
                  {TECHNICIAN_PREVIEW.rating.toFixed(1)} / 5
                  <Star className="size-3 fill-[#eb9f34] text-[#eb9f34]" />
                </dd>
              </div>
            </dl>

            <p className="mt-4 flex items-start gap-2 rounded-[8px] bg-[#e4f2ec] p-2.5 text-[10.5px] leading-[1.5] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              Name and email are copied from your session and stay read-only.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/[0.08] dark:bg-[#101a16]">
            <h2 className="flex items-center gap-2 font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
              <Sparkles className="size-4 text-[#87948d]" />
              Tips for approval
            </h2>
            <ul className="mt-4 grid gap-3">
              {TIPS.map(([title, text]) => (
                <li key={title} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#63e6b6]">
                    <Check className="size-3" />
                  </span>
                  <div>
                    <p className="text-[11.5px] font-semibold text-[#0f1a15] dark:text-white">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[10.5px] leading-[1.5] text-[#5f6f68] dark:text-[#9dab9f]">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}


