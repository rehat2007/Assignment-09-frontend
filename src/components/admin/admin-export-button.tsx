"use client";

import { Download } from "lucide-react";
import { cn } from "cn";

export function AdminExportButton({
  filename,
  rows,
  label = "Export report",
  variant = "primary",
  className,
}: {
  filename: string;
  rows: string[][];
  label?: string;
  variant?: "primary" | "outline";
  className?: string;
}) {
  function download() {
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      className={cn(
        "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[9px] px-4 text-[12.5px] font-semibold transition",
        variant === "primary"
          ? "bg-[#0e6b54] text-white hover:bg-[#0a5342] dark:bg-[#63e6b6] dark:text-[#06231b] dark:hover:bg-[#7cf0c6]"
          : "border border-[#d2ccbc] bg-white text-[#27352f] hover:bg-[#fbfaf6] dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]",
        className,
      )}
    >
      <Download className="size-4" />
      {label}
    </button>
  );
}
