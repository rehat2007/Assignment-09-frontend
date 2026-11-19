<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Fix Mate frontend

Early-stage Next.js 16 App Router UI scaffold (React 19.3, TypeScript, Tailwind CSS v4, shadcn `base-nova`). The only route is `src/app/page.tsx`; there is no backend, auth, database, test suite, or CI in this repo.

## Commands

- `npm run dev` — Turbopack dev server. If one is already running, reuse it; `.next/dev/lock` contains its PID/port/URL and starting a second server just reports the existing one.
- `npm run build` — production build. Turbopack is the default bundler and the build also runs TypeScript checking.
- `npm run lint` — ESLint flat config (`eslint.config.mjs`); no arguments needed.
- `npx tsc --noEmit` — quick standalone typecheck (there is no `typecheck` script).
- After adding/moving routes, run `npx next typegen` to refresh generated route types.
- Use npm (`package-lock.json` is the only lockfile). No tests are configured — don't invent a test command or add a runner unless asked.

## Conventions that differ from framework defaults

- Import the class-name helper as `import { cn } from "cn"`. It comes from the `cn` package; do not add `clsx`/`tailwind-merge`, and don't assume `@/lib/utils` is the source (`src/lib/utils.ts` only re-exports `cn`).
- UI primitives are Base UI (`@base-ui/react/...`), not Radix. Match the existing patterns in `src/components/ui/` and keep new shadcn components there; aliases are defined in `components.json`.
- Tailwind v4 is CSS-first: there is no `tailwind.config.*`. Theme tokens and dark mode live in `src/app/globals.css` (`@theme inline`, oklch variables). CSS is compiled by the `@tailwindcss/turbopack` loader rule in `next.config.ts`, not by PostCSS — do not add a PostCSS config for it.
- Use the `@/*` alias for `src/*`.
- `PageProps<"/route">`, `LayoutProps<"/">`, and `RouteContext` are global types generated into `.next/types`; use them without importing. Never hand-edit `next-env.d.ts` (generated, gitignored).

## Generated files and agent hooks

- Keep the `nextjs-agent-rules` block above; `next dev` rewrites it. `experimental.agentFeedback` is enabled in `next.config.ts`, so `next dev` may also append a `nextjs-agent-feedback` block to this file. Commit these managed changes rather than reverting them.
- `next dev`/`next build` write `.next/`; it is gitignored. `README.md` is currently empty, so this file is the main project guidance.
- No environment variables are used yet; `.env*` is gitignored.
