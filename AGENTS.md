<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Fix Mate frontend

FixMate repair marketplace: Next.js 16 App Router (React 19.3, TypeScript, Tailwind v4) for rendering only, with accounts, catalog, bookings, reviews, uploads, admin actions, and payments in a separate Express + Better Auth + MongoDB API at `C:\web_dev\fix_mate\fix_mate_back_end`. The backend is the source of truth; the frontend reads it through `/api/v1/*`. `README.md` is the assignment/backend contract, but its setup snippets drift (it says `.env.local`; the app uses `.env`, and no `.env.example` exists).

## Commands

- `npm run dev` — Turbopack. Only one dev server per project: a second run exits with the running server's URL, PID, directory, log path, and a `taskkill /PID <pid> /F` hint from `.next/dev/lock`. Reuse or stop it; don't assume port 3000.
- `npm run build` — Turbopack production build; runs TypeScript but no longer runs lint.
- `npm run lint` — ESLint flat config (`eslint.config.mjs`). `next lint` was removed in Next 16.
- `npx next typegen` then `npx tsc --noEmit` — typecheck. Run typegen after adding/moving routes or when `.next/types` is missing; it also regenerates `next-env.d.ts`.
- No tests or CI. Don't invent a test command or add a runner unless asked.
- Use npm (`package-lock.json` is the only lockfile).
- Backend-only scripts (run in `fix_mate_back_end`): `npm run seed` (idempotent demo data) and `npm run auth:admin` (needs `ADMIN_PASSWORD` ≥8 chars).

## Architecture and data flow

- Public pages: `/`, `/services`, `/services/[id]`, `/about`, `/sign-in`, `/sign-up`, `/payment/success`, `/payment/cancel`. `/how-it-works` is a permanent redirect to `/about` in `next.config.ts`; don't recreate that page.
- Authenticated areas: `/dashboard` plus the `customer`, `technician`, and `admin` workspaces and `/dashboard/profile`.
- Server components fetch through `src/lib/api.ts` (`apiFetch`). It unwraps `{ data, meta }`, throws `ApiRequestError`, defaults to `revalidate: 60`, and forwards the browser cookie only with `withCookies: true` (which also forces `no-store`). It calls `headers()`, so never use it in a client component.
- Public catalog fetchers in `src/lib/catalog.ts` tag responses with `catalog`. After listing or review mutations, call the server action `revalidateCatalog()` (`src/app/actions.ts`, wraps `updateTag("catalog")`).
- Client mutations call `${NEXT_PUBLIC_API_URL}` directly with `credentials: "include"` and handle their own JSON/errors. Keep the split: `API_URL` on the server, `NEXT_PUBLIC_API_URL` in the browser.
- Express `/api/v1` responses are `{ data, meta }` or `{ error: { code, message, details } }`; pagination defaults are 9 (public), 20 (dashboards), max 100. `GET /api/v1/me` is read-only; profile writes stay on Better Auth `POST /api/auth/update-user`.
- `src/lib/{customer,technician,admin}-api.ts` own authenticated dashboard fetchers. `src/lib/{customer,technician,admin}-data.ts` hold shared DTO types/labels/formatters plus preview arrays; `src/lib/services.ts` and `src/lib/service-details.ts` are seed/type sources mirrored into the backend seed. Do not import the `SERVICES`, `SERVICE_DETAILS`, or preview arrays into pages.
- Preview data still drives `/dashboard/profile` statistics (`ADMIN_STATS`, `CUSTOMER_PAYMENTS`, `getCustomerStats`, `getTechnicianStats`) and the plan/rating copy in `add-service-form.tsx`. Dashboard sidebar counts are live, passed from `src/app/dashboard/layout.tsx`.
- `src/lib/home-data.ts` is home-only copy; featured services and category counts come from `/api/v1/meta` + `/api/v1/services`. `popular-categories.tsx` renders `WhyFixmate` inline. `popular-strip.tsx` is an unused draft; the live strip is `category-strip.tsx`.

## Auth and roles

- Better Auth runs on Express under `/api/auth/*`; the frontend never imports the server auth module.
- `src/lib/auth-client.ts` uses `NEXT_PUBLIC_API_URL`, `credentials: "include"`, `inferAdditionalFields` (accountType/phone/area/bio), and `adminClient`.
- Public sign-up can only create `customer` or `technician`; `accountType` is sanitized server-side, and admin comes from `npm run auth:admin`/seed. The optional sign-up photo uploads to `POST /api/v1/uploads/avatar` after the account exists, then saves the URL with `authClient.updateUser({ image })`.
- `src/lib/authz.ts` reads `${API_URL}/api/auth/get-session` with the forwarded cookie, wrapped in React `cache`. `requireUser` redirects to `/sign-in`; `requireRole` redirects to `/dashboard`. There is no proxy/middleware authorization layer — keep guards in server components/route handlers.
- JWT fallback: after sign-in/sign-up, and on each signed-in mount (`TokenBootstrap`), the browser POSTs `/api/v1/auth/token` so Express sets the `fixmate_token` cookie. Sign-out POSTs `/api/v1/auth/logout` before `authClient.signOut`. New auth entry points must do the same.
- `src/lib/roles.ts` owns `getAppRole`: `admin` if the comma-separated admin-plugin `role` contains `admin`, else `technician` when `accountType === "technician"`, else `customer`. Use it instead of raw `user.role`.
- `/dashboard` redirects to `/dashboard/<role>`. Role pages call `requireRole`; the catch-all `[...section]` guard accepts admin for customer/technician paths and otherwise 404s. Add a static page for every new section.
- Backend role checks are separate: `verifyCustomer`/`verifyTechnician`/`verifyAdmin` use the recomputed role, so an admin cannot call customer endpoints.

## Behavior worth preserving

- `/` order: hero, category strip, latest services, how it works, trust band, popular categories (+ WhyFixmate inline), testimonials, CTA; footer outside `<main>`.
- `/services` keeps filters entirely in the URL (`q`, `category`, `mode`, `sort`, `page`): chips/pagination are links, search/sort are a plain GET form. Counts/page size come from `/api/v1/meta`; no client filter state or hardcoded totals. `service-card.tsx` is shared by the homepage and this page — edit it once, and link new listings as `/services/<slug>`.
- `/services/[id]` loads `/api/v1/services/:slug` and its reviews; unknown or hidden slugs 404. Review bars use `meta.distribution` (5★→1★). Signed-in customers get `booking-request-dialog.tsx`, which posts only `serviceSlug`, `preferredDate`, `phone`, `address`, and `problem`; never send price, technician, status, or payment fields.
- Customer bookings: cancel calls `POST /api/v1/bookings/:id/cancel`; Pay now calls `POST .../checkout` and redirects to Stripe. Checkout returns to `/payment/success?session_id=` (server-verified through `GET /api/v1/payments/verify`) or `/payment/cancel`. Reviews post only `{ rating, text }` for completed+paid bookings, then call `revalidateCatalog()`.
- Technician listings support create, edit, availability toggle, and soft delete. Editing an approved/rejected listing returns it to `pending`. Cover upload goes to `POST /api/v1/uploads/service-cover` (JPG/PNG/WEBP, 5 MB) and the returned URL is submitted as `coverImage`; the generated sample cover is preview-only.
- Admin role changes may target customer, technician, or admin; self-change is blocked by the backend. Suspend/restore uses Better Auth bans. Approve/reject work on any non-deleted listing (no pending-only guard); approve clears the rejection reason, reject stores it. Admin actions write `auditLogs`, but there is no audit-log read UI.
- Profile edits go through `authClient.updateUser` (`name`, `phone`, `area`, `bio`, `image`); email/role/accountType are read-only. Avatar uploads use `POST /api/v1/uploads/avatar` (2 MB).
- Footer legal links (`/privacy`, `/terms`, `/support`) and `/forgot-password` are placeholders with no routes; don't treat those 404s as regressions.
- Visual reference: `C:\web_dev\assignment_09-demo` (vanilla-JS SPA).

## Styling and UI conventions

- Import `cn` as `import { cn } from "cn"`; do not add `clsx`/`tailwind-merge`. `src/lib/utils.ts` only re-exports it.
- UI primitives are Base UI (`@base-ui/react/*`), not Radix; keep shadcn `base-nova` components in `src/components/ui/`.
- Tailwind v4 is CSS-first: no `tailwind.config.*`; tokens and dark mode live in `src/app/globals.css` (`@theme inline`, oklch, `@custom-variant dark`). CSS is compiled by the `@tailwindcss/turbopack` rule in `next.config.ts`, not PostCSS.
- Public sections use hardcoded hex/arbitrary colors with explicit `dark:` classes, not shadcn tokens. `.site-container` is max 1264px with 14/16/24px gutters; public pages mostly use `mx-auto max-w-[1264px] px-6`, dashboards the same. The navbar is 74px desktop / 64px at ≤760px; anchor sections use `scroll-mt-[74px]`.
- Section rhythm follows the demo: standard `py-[clamp(52px,6.5vw,92px)]`, tight `py-[clamp(38px,4.5vw,60px)]`, and breakpoints at 381/561/761/861/981/1101px. Category icons/tones come from `src/lib/service-styles.ts`.
- Theme is `.dark` on `<html>`, persisted in `localStorage` under `fixmate-theme`; `layout.tsx` replays it pre-paint and uses `suppressHydrationWarning`. Keep the key in sync.
- Client components: navbar, profile menu, theme toggle, `HomeMotion`, auth forms, `TokenBootstrap`, dashboard shell/profile form, and the customer/technician/admin action components. Keep new sections server-side unless they need state/effects.
- `HomeMotion` is the only animation code (GSAP + ScrollTrigger, respects reduced motion). Add `data-hero`, `data-hero-art`, `data-reveal`, `data-reveal-group`, `data-float`/`data-float-delay`, or `data-scan` and mount `<HomeMotion />`; don't write per-section animation code.

## Next.js specifics

- `params` and `searchParams` are Promises; await them. `PageProps<"/route">`, `LayoutProps<"/">`, and `RouteContext` are generated globals — use them without importing.
- Never hand-edit `next-env.d.ts` (generated, gitignored).
- Next 16 uses `proxy.ts` (not `middleware.ts`) if a proxy is ever required.

## Env and generated files

- Frontend `.env` (gitignored; no `.env.example`): `API_URL`, `NEXT_PUBLIC_API_URL`, and optional `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (only toggle the Google buttons; OAuth runs on Express with callback `http://localhost:4000/api/auth/callback/google`). Restart `next dev` after changing either API URL.
- Backend `.env` owns every secret plus `MONGODB_*`, `BETTER_AUTH_*`, `FRONTEND_URL`, `JWT_*`, `ADMIN_*`, `SEED_PASSWORD`, `STRIPE_*`, and upload settings. Keep them out of client code.
- Uploads support `UPLOAD_DRIVER=local` (default; `data/uploads` served by the API), `s3` (S3/R2/MinIO via `S3_*`), or `imgbb` (`IMGBB_API_KEY`). The server sniffs MIME from bytes and ignores filenames. The legacy `/api/avatar/[file]` route only serves old frontend `data/avatars` files.
- Stripe checkout requires a completed+unpaid booking and a positive server-side `finalAmount`; `paymentStatus` is set only after Stripe confirms (verified webhook or server-side checkout-session verification), never from client input. Local webhook: `stripe listen --forward-to localhost:4000/api/v1/webhooks/stripe`.
- `next dev` writes `.next/dev`; `next build` writes `.next`; both are gitignored. `experimental.agentFeedback` is enabled, so `next dev` may rewrite the managed blocks here — commit those changes instead of reverting them.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
