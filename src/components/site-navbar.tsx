"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { cn } from "cn";
import { Brand } from "@/components/brand";

// Keeping the links in one place makes the desktop and mobile menus easy to update.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/#how-it-works" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");

    try {
      localStorage.setItem("fixmate-theme", isDark ? "dark" : "light");
    } catch {
      // The page still changes theme even if the browser blocks localStorage.
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.07] bg-[#f6f4ee]/95 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#080f0c]/95">
      <div className="mx-auto flex h-[74px] max-w-[1264px] items-center gap-7 px-6">
        <Brand />

        {/* Desktop navigation */}
        <nav className="ml-1.5 hidden h-[74px] items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-full items-center rounded-[9px] px-[13px] text-[14px] transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                  isActive
                    ? "font-bold text-[#0f1a15] dark:text-white"
                    : "font-medium text-[#5f6f68] hover:text-[#0f1a15] dark:text-[#9dab9f] dark:hover:text-white",
                )}
              >
                {link.label}

                {isActive && (
                  <span className="absolute inset-x-[13px] bottom-0 h-[2px] rounded-t-[3px] bg-[#0e6b54] dark:bg-[#43d3ab]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* The sun is visible in dark mode; the moon is visible in light mode. */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="flex size-10 items-center justify-center rounded-[11px] text-[#27352f] transition-colors hover:bg-black/[0.04] hover:text-black dark:text-[#cfdbd3] dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <Sun className="hidden size-[19px] dark:block" aria-hidden="true" />
            <Moon className="size-[19px] dark:hidden" aria-hidden="true" />
          </button>

          <span
            className="mx-1 hidden h-6 w-px bg-black/10 sm:block dark:bg-white/15"
            aria-hidden="true"
          />

          <Link
            href="/sign-in"
            className="hidden h-10 items-center rounded-[11px] px-[18px] text-[14px] font-semibold text-[#27352f] transition-colors hover:bg-black/[0.04] sm:inline-flex dark:text-[#cfdbd3] dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="hidden h-10 items-center rounded-[11px] bg-[#0e6b54] px-[18px] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(11,107,71,0.2)] transition-colors hover:bg-[#0a5342] sm:inline-flex dark:bg-[#43d3ab] dark:text-[#06231b] dark:shadow-[0_0_18px_rgba(99,230,182,0.18)] dark:hover:bg-[#6ee7c3]"
          >
            Sign up
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="flex size-10 items-center justify-center rounded-[11px] text-[#27352f] hover:bg-black/[0.04] md:hidden dark:text-white dark:hover:bg-white/[0.06]"
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
          className="border-t border-black/[0.07] bg-[#f6f4ee] px-6 pb-5 pt-2 md:hidden dark:border-white/[0.08] dark:bg-[#080f0c]"
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
            className="mx-3 mb-1 block rounded-[11px] bg-[#0e6b54] px-4 py-2.5 text-center text-[14px] font-semibold text-white sm:hidden dark:bg-[#43d3ab] dark:text-[#06231b]"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
