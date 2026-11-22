"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "cn";

export function ThemeToggle({ className }: { className?: string }) {
  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className={cn(
        "flex size-10 items-center justify-center rounded-[11px] text-[#27352f] transition-colors hover:bg-black/[0.04] hover:text-black dark:text-[#cfdbd3] dark:hover:bg-white/[0.06] dark:hover:text-white",
        className,
      )}
    >
      <Sun className="hidden size-[19px] dark:block" aria-hidden="true" />
      <Moon className="size-[19px] dark:hidden" aria-hidden="true" />
    </button>
  );
}
