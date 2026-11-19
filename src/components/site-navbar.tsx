"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Sun, Wrench, X } from "lucide-react";
import { cn } from "cn";

// Keeping the links in one place makes the desktop and mobile menus easy to update.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "How it works", href: "/#how-it-works" },
];

function Brand() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="FixMate home">
      <span className="flex size-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#43b986] via-[#178257] to-[#075136] shadow-[0_4px_14px_rgba(11,107,69,0.25)] dark:from-[#bdf9df] dark:via-[#79ebc2] dark:to-[#3dd3a1] dark:shadow-[0_0_22px_rgba(95,227,176,0.22)]">
        <Wrench
          className="size-5 text-white dark:text-[#052e21]"
          strokeWidth={2.6}
          aria-hidden="true"
        />
      </span>

      <span className="flex flex-col">
        <span className="text-[22px] font-bold leading-none tracking-[-0.03em] text-[#101613] dark:text-white">
          FixMate
        </span>
        <span className="mt-1 block text-[8px] font-semibold uppercase leading-none tracking-[0.24em] text-[#6c7570] dark:text-[#8ba399]">
          Repair, Tracked
        </span>
      </span>
    </Link>
  );
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
    <header className="sticky top-0 z-50 border-b border-black/[0.07] bg-[#f6f5f0]/95 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#050d09]/95">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center px-5 sm:px-8">
        <Brand />

        {/* Desktop navigation */}
        <nav className="ml-8 hidden h-[68px] items-center gap-7 md:flex lg:ml-10 lg:gap-9">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-full items-center text-[15px] font-medium transition-colors",
                  isActive
                    ? "text-[#111814] dark:text-white"
                    : "text-[#5f6b65] hover:text-[#111814] dark:text-[#a2aea7] dark:hover:text-white",
                )}
              >
                {link.label}

                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-[#0c7b52] dark:bg-[#63e6b6]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-6">
          {/* The sun is visible in dark mode; the moon is visible in light mode. */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="flex size-9 items-center justify-center rounded-full text-[#37423d] transition-colors hover:bg-black/5 hover:text-black dark:text-[#c8d4cd] dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Sun className="hidden size-5 dark:block" aria-hidden="true" />
            <Moon className="size-5 dark:hidden" aria-hidden="true" />
          </button>

          <span
            className="hidden h-6 w-px bg-black/10 sm:block dark:bg-white/15"
            aria-hidden="true"
          />

          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-[#28332d] transition-colors hover:text-[#0c7b52] sm:block dark:text-[#d6e2db] dark:hover:text-[#63e6b6]"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="hidden rounded-[10px] bg-[#0b6b47] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(11,107,71,0.2)] transition-colors hover:bg-[#09593c] sm:inline-flex dark:bg-[#63e6b6] dark:text-[#04251a] dark:shadow-[0_0_18px_rgba(99,230,182,0.18)] dark:hover:bg-[#7cf0c6]"
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
            className="flex size-9 items-center justify-center rounded-full text-[#28332d] hover:bg-black/5 md:hidden dark:text-white dark:hover:bg-white/10"
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
          className="border-t border-black/[0.07] bg-[#f6f5f0] px-5 pb-5 pt-2 md:hidden dark:border-white/[0.08] dark:bg-[#050d09]"
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 text-[15px] font-medium transition-colors",
                    isActive
                      ? "bg-black/5 text-[#111814] dark:bg-white/10 dark:text-white"
                      : "text-[#5f6b65] hover:bg-black/5 hover:text-[#111814] dark:text-[#a2aea7] dark:hover:bg-white/10 dark:hover:text-white",
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
            className="mt-2 block border-t border-black/[0.07] px-3 py-3 text-sm font-medium text-[#28332d] dark:border-white/[0.08] dark:text-[#d6e2db]"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            onClick={() => setMobileMenuOpen(false)}
            className="mx-3 mb-1 block rounded-[10px] bg-[#0b6b47] px-4 py-2.5 text-center text-sm font-semibold text-white sm:hidden dark:bg-[#63e6b6] dark:text-[#04251a]"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
