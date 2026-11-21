"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "cn";
import { Brand } from "@/components/brand";
import { ProfileMenu } from "@/components/profile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { getAppRole } from "@/lib/roles";

// Keeping the links in one place makes the desktop and mobile menus easy to update.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user ? getAppRole(user) : null;

  async function handleSignOut() {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setMobileMenuOpen(false);
          toast.success("Signed out.");
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  // Auth and dashboard pages render their own full-screen shells.
  if (
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname.startsWith("/dashboard")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.07] bg-[#f6f4ee]/80 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#080f0c]/80">
      <div className="site-container flex h-[64px] items-center gap-4 min-[761px]:h-[74px] min-[861px]:gap-7">
        <Brand />

        {/* Desktop navigation */}
        <nav className="ml-1.5 hidden h-[64px] items-center gap-1 min-[761px]:h-[74px] min-[861px]:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-10 items-center rounded-[9px] px-3 text-[14px] transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                  isActive
                    ? "font-bold text-[#0f1a15] dark:text-white"
                    : "font-medium text-[#5f6f68] hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:text-white",
                )}
              >
                {link.label}

                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#0e6b54] dark:bg-[#43d3ab]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <span
            className="mx-1 hidden h-6 w-px bg-black/10 min-[861px]:block dark:bg-white/15"
            aria-hidden="true"
          />

          {isPending ? (
            <span
              aria-hidden="true"
              className="hidden size-8 animate-pulse rounded-full bg-black/10 sm:block dark:bg-white/10"
            />
          ) : user ? (
            <ProfileMenu
              key={pathname}
              user={{
                name: user.name,
                email: user.email,
                image: user.image,
              }}
              role={role ?? "customer"}
              onSignOut={handleSignOut}
            />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden h-10 items-center rounded-[11px] px-[18px] text-[14px] font-semibold text-[#27352f] transition-colors hover:bg-black/[0.04] min-[861px]:inline-flex dark:text-[#cfdbd3] dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="hidden h-10 items-center rounded-[11px] bg-[#0e6b54] px-[18px] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(11,107,71,0.2)] transition-colors hover:bg-[#0a5342] min-[861px]:inline-flex dark:bg-[#43d3ab] dark:text-[#06231b] dark:shadow-[0_0_18px_rgba(99,230,182,0.18)] dark:hover:bg-[#6ee7c3]"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="flex size-10 items-center justify-center rounded-[11px] text-[#27352f] hover:bg-black/[0.04] min-[861px]:hidden dark:text-white dark:hover:bg-white/[0.06]"
          >
            {mobileMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="site-container border-t border-black/[0.07] bg-[#f6f4ee] pb-5 pt-2 min-[861px]:hidden dark:border-white/[0.08] dark:bg-[#080f0c]"
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const isActive = isActivePath(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-[10px] px-3 py-3 text-[15px] transition-colors",
                    isActive
                      ? "bg-[#e4f2ec] font-bold text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]"
                      : "font-medium text-[#5f6f68] hover:bg-black/[0.04] hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:bg-white/[0.06] dark:hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {user ? (
            <div className="mt-2 border-t border-black/[0.07] pt-3 dark:border-white/[0.08]">
              <div className="flex items-center gap-3 rounded-xl border border-black/[0.07] p-3 dark:border-white/[0.08]">
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
                  <p className="truncate text-[13px] font-semibold text-[#27352f] dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-[11px] capitalize text-[#5f6f68] dark:text-[#9dab9f]">
                    {role}
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-[10px] px-3 py-3 text-[14px] font-semibold text-[#27352f] hover:bg-black/[0.04] dark:text-[#cfdbd3] dark:hover:bg-white/[0.06]"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>

              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-[10px] px-3 py-3 text-[14px] font-semibold text-[#27352f] hover:bg-black/[0.04] dark:text-[#cfdbd3] dark:hover:bg-white/[0.06]"
              >
                <UserRound className="size-4" />
                Update profile
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-[10px] px-3 py-3 text-left text-[14px] font-semibold text-[#5f6f68] hover:bg-black/[0.04] dark:text-[#9dab9f] dark:hover:bg-white/[0.06]"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 block border-t border-black/[0.07] px-3 py-3 text-[14px] font-semibold text-[#27352f] dark:border-white/[0.08] dark:text-[#cfdbd3]"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-3 mb-1 block rounded-[11px] bg-[#0e6b54] px-4 py-2.5 text-center text-[14px] font-semibold text-white dark:bg-[#43d3ab] dark:text-[#06231b]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
