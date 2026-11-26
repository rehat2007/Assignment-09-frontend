"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import type { AppRole } from "@/lib/roles";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type NotificationKind = "booking" | "request" | "payment" | "approval" | "status";
type NotificationTone = "blue" | "green" | "amber" | "red" | "gray";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  at: string;
  href: string;
  kind: NotificationKind;
  tone: NotificationTone;
};

const KIND_ICONS: Record<NotificationKind, LucideIcon> = {
  booking: Wrench,
  request: ClipboardList,
  payment: CreditCard,
  approval: ShieldCheck,
  status: CheckCircle2,
};

const TONE_STYLES: Record<NotificationTone, string> = {
  blue: "bg-[#e9f1ff] text-[#2f6bd8] dark:bg-[#132238] dark:text-[#8ab4f8]",
  green: "bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]",
  amber: "bg-[#fcf0d7] text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]",
  red: "bg-[#fcecea] text-[#b42318] dark:bg-[#2e1613] dark:text-[#ff8f82]",
  gray: "bg-[#f2efe7] text-[#5f6f68] dark:bg-white/[0.04] dark:text-[#9dab9f]",
};

const ACTIVITY_HREF: Record<AppRole, string> = {
  customer: "/dashboard/customer/bookings",
  technician: "/dashboard/technician/requests",
  admin: "/dashboard/admin/bookings",
};

function notificationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function NotificationMenu({
  userKey,
  role,
}: {
  userKey: string;
  role: AppRole;
}) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storageKey = `fixmate-notifications-read:${userKey}`;

  const load = useCallback(async () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as unknown;
      if (Array.isArray(saved)) {
        const savedIds = saved.filter(
          (value): value is string => typeof value === "string",
        );
        setReadIds((current) => new Set([...current, ...savedIds]));
      }
    } catch {
      // Read state is best-effort.
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/v1/notifications`, {
        credentials: "include",
        cache: "no-store",
      });
      const body = (await response.json().catch(() => null)) as {
        data?: NotificationItem[];
        error?: { message?: string };
      } | null;

      if (!response.ok) {
        throw new Error(
          body?.error?.message ?? "Could not load your notifications.",
        );
      }

      setItems(Array.isArray(body?.data) ? body.data : []);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not load your notifications.",
      );
    } finally {
      setLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function saveRead(next: Set<string>) {
    setReadIds(next);

    try {
      localStorage.setItem(storageKey, JSON.stringify([...next]));
    } catch {
      // Read state is best-effort.
    }
  }

  function markAllRead() {
    saveRead(new Set([...readIds, ...items.map((item) => item.id)]));
  }

  function openItem(item: NotificationItem) {
    saveRead(new Set([...readIds, item.id]));
    setOpen(false);
    router.push(item.href);
  }

  const unread = items.filter((item) => !readIds.has(item.id)).length;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) void load();
        }}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        title="Notifications"
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative flex size-10 items-center justify-center rounded-[11px] text-[#5f6f68] transition-colors hover:bg-black/[0.04] dark:text-[#9dab9f] dark:hover:bg-white/[0.06]"
      >
        <Bell className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0e6b54] px-1 text-[9px] font-bold leading-none text-white dark:bg-[#43d3ab] dark:text-[#06231b]">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white shadow-[0_22px_60px_-20px_rgba(15,26,21,0.35)] dark:border-white/[0.1] dark:bg-[#101a16] dark:shadow-[0_22px_60px_-20px_rgba(0,0,0,0.75)]"
        >
          <div className="flex items-start justify-between gap-3 border-b border-[#e5e1d6] px-4 py-3.5 dark:border-white/[0.08]">
            <div>
              <p className="font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
                Notifications
              </p>
              <p className="mt-0.5 text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                {unread > 0
                  ? `${unread} unread update${unread === 1 ? "" : "s"}`
                  : "You're all caught up"}
              </p>
            </div>

            <button
              type="button"
              onClick={markAllRead}
              disabled={unread === 0}
              className="shrink-0 text-[11px] font-semibold text-[#0e6b54] transition hover:opacity-75 disabled:cursor-default disabled:opacity-40 dark:text-[#43d3ab]"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-[min(380px,calc(100vh-180px))] overflow-y-auto">
            {loading ? (
              <div className="grid gap-2 p-4">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="flex animate-pulse items-start gap-3 rounded-xl p-1"
                  >
                    <span className="size-9 shrink-0 rounded-[10px] bg-black/[0.06] dark:bg-white/[0.06]" />
                    <span className="mt-1 grid flex-1 gap-2">
                      <span className="h-2.5 w-1/2 rounded bg-black/[0.07] dark:bg-white/[0.07]" />
                      <span className="h-2 w-full rounded bg-black/[0.05] dark:bg-white/[0.05]" />
                    </span>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="px-5 py-8 text-center">
                <p className="text-[12px] font-semibold text-[#0f1a15] dark:text-white">
                  Notifications are unavailable
                </p>
                <p className="mt-1 text-[11px] leading-[1.5] text-[#5f6f68] dark:text-[#9dab9f]">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="mt-3 text-[11px] font-semibold text-[#0e6b54] dark:text-[#43d3ab]"
                >
                  Try again
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="px-5 py-9 text-center">
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                  <Bell className="size-[18px]" />
                </span>
                <p className="mt-3 text-[12px] font-semibold text-[#0f1a15] dark:text-white">
                  No notifications yet
                </p>
                <p className="mt-1 text-[11px] leading-[1.5] text-[#5f6f68] dark:text-[#9dab9f]">
                  Job updates and payment reminders will show up here.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const Icon = KIND_ICONS[item.kind] ?? Bell;
                const isUnread = !readIds.has(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => openItem(item)}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-[#f0ede4] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#fbfaf6] dark:border-white/[0.06] dark:hover:bg-white/[0.04]",
                      isUnread && "bg-[#f7fbf8] dark:bg-[#0d1f18]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px]",
                        TONE_STYLES[item.tone] ?? TONE_STYLES.gray,
                      )}
                    >
                      <Icon className="size-[15px]" strokeWidth={1.9} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "text-[12px] leading-snug",
                            isUnread
                              ? "font-bold text-[#0f1a15] dark:text-white"
                              : "font-semibold text-[#27352f] dark:text-[#cfdbd3]",
                          )}
                        >
                          {item.title}
                        </span>
                        {isUnread && (
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#0e6b54] dark:bg-[#43d3ab]" />
                        )}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-[11.5px] leading-[1.5] text-[#5f6f68] dark:text-[#9dab9f]">
                        {item.message}
                      </span>
                      <span className="mt-1 block text-[10px] text-[#87948d]">
                        {notificationDate(item.at)}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <Link
            href={ACTIVITY_HREF[role]}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-t border-[#e5e1d6] px-4 py-3 text-[11.5px] font-semibold text-[#0f1a15] transition-colors hover:bg-[#fbfaf6] dark:border-white/[0.08] dark:text-white dark:hover:bg-white/[0.04]"
          >
            View all activity
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
