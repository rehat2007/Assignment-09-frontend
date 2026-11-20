"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutGrid, LogOut, UserRound } from "lucide-react";
import { cn } from "cn";
import type { AppRole } from "@/lib/roles";

const ROLE_LABEL: Record<AppRole, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileMenu({
  user,
  role,
  onSignOut,
}: {
  user: { name: string; email: string; image?: string | null };
  role: AppRole;
  onSignOut: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const avatar = (
    <span
      className="size-9 shrink-0 rounded-full bg-[#f6e7c8] bg-cover bg-center text-[11px] font-bold text-[#a86a12]"
      style={user.image ? { backgroundImage: `url(${user.image})` } : undefined}
    >
      {!user.image && (
        <span className="flex size-full items-center justify-center">
          {initials(user.name)}
        </span>
      )}
    </span>
  );

  const firstName = user.name.split(" ")[0];

  return (
    <div ref={rootRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="flex items-center gap-2.5 rounded-full border border-black/10 bg-black/[0.03] p-1 pr-3 transition-colors hover:bg-black/[0.06] dark:border-white/10 dark:bg-[#101a16] dark:hover:bg-[#16251e]"
      >
        {avatar}
        <span className="hidden max-w-[90px] truncate text-[13.5px] font-semibold text-[#0f1a15] lg:block dark:text-white">
          {firstName}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 text-[#87948d] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[268px] rounded-2xl border border-[#e5e1d6] bg-white p-2 shadow-[0_24px_60px_-24px_rgba(10,30,20,0.35)] dark:border-[#24332c] dark:bg-[#101a16]"
        >
          <div className="flex gap-3 border-b border-[#e5e1d6] p-3 dark:border-white/[0.08]">
            <span
              className="size-10 shrink-0 rounded-full bg-[#f6e7c8] bg-cover bg-center text-[12px] font-bold text-[#a86a12]"
              style={
                user.image
                  ? { backgroundImage: `url(${user.image})` }
                  : undefined
              }
            >
              {!user.image && (
                <span className="flex size-full items-center justify-center">
                  {initials(user.name)}
                </span>
              )}
            </span>

            <div className="min-w-0">
              <p className="truncate font-heading text-[14px] font-bold text-[#0f1a15] dark:text-white">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-[#5f6f68] dark:text-[#9dab9f]">
                {user.email}
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-[6px] bg-[#e4f2ec] px-2 py-1 text-[10.5px] font-semibold text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
                <span className="size-1.5 rounded-full bg-current" />
                {ROLE_LABEL[role]}
              </span>
            </div>
          </div>

          <div className="p-1">
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-[13.5px] font-medium text-[#27352f] transition-colors hover:bg-black/[0.04] dark:text-[#cfdbd3] dark:hover:bg-white/[0.06]"
            >
              <LayoutGrid className="size-4 text-[#87948d]" />
              Dashboard
            </Link>

            <Link
              href="/dashboard/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-[13.5px] font-medium text-[#27352f] transition-colors hover:bg-black/[0.04] dark:text-[#cfdbd3] dark:hover:bg-white/[0.06]"
            >
              <UserRound className="size-4 text-[#87948d]" />
              Update profile
            </Link>
          </div>

          <div className="border-t border-[#e5e1d6] p-1 dark:border-white/[0.08]">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void onSignOut();
              }}
              className="flex w-full items-center gap-3 rounded-[9px] px-3 py-2.5 text-left text-[13.5px] font-semibold text-[#b42318] transition-colors hover:bg-[#fcecea] dark:text-[#ff8f82] dark:hover:bg-[#2e1613]"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
