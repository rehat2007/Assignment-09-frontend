import type { NextConfig } from "next";

const API_URL = (process.env.API_URL ?? "http://localhost:4000").replace(
  /\/+$/,
  "",
);

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/how-it-works",
        destination: "/about",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Proxy the API through the frontend origin so browser auth cookies are
    // readable by server components. Cross-domain Vercel deployments otherwise
    // keep the session cookie on the backend host only.
    return [
      {
        // Also carries the Google OAuth callback, so Better Auth sets the
        // session cookie on the frontend host instead of the backend host.
        source: "/api/auth/:path*",
        destination: `${API_URL}/api/auth/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${API_URL}/api/v1/:path*`,
      },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
