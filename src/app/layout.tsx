import type { Metadata } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { TokenBootstrap } from "@/components/auth/token-bootstrap";
import { SiteNavbar } from "@/components/site-navbar";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FixMate — Repair, Tracked",
  description: "Book trusted repair technicians and pay after the job is done.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Apply the saved theme before the page paints to avoid a light/dark flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem("fixmate-theme");
                var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add("dark");
                }
              } catch (error) {
                // If localStorage is unavailable, fall back to the light theme.
              }
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <TokenBootstrap />
        <SiteNavbar />
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
