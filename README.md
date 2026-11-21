# FixMate Fullstack Backend Plan

This document is the implementation contract for moving FixMate from a Next.js frontend with static preview data to a fullstack app with a **separate Express API server**.

Use it as the source of truth. Work one phase at a time. Do not start a later phase until the current phase's acceptance checks pass.

> **Start here:** implement Phase 0 first. Do not write marketplace endpoints until Express auth, cookies, and Next session reads work end to end.

---

## How to use this file

Give the implementation agent prompts like:

- `Implement Phase 0 only from README.md. Stop after the acceptance checks.`
- `Implement Phase 1 only from README.md. Do not build endpoints yet.`
- `Implement Phase 3 from README.md. Keep the existing UI design unchanged.`
- `Implement Phase 4 from README.md. Add the missing booking form.`
- `Implement Phase 7 from README.md. Use Stripe test mode.`

Rules for every phase:

- Keep the existing visual design and Tailwind styles.
- Keep public pages server-rendered where they are today.
- Never trust client-provided roles, prices, statuses, approval values, or payment status.
- Update this README's checkboxes as work is completed.
- Do not commit `.env` files or secrets.

---

## 1. Current state

The frontend is a Next.js 16 App Router app with Better Auth and MongoDB.

| Area | Current source | Persisted? | Backend work needed |
|---|---|---:|---|
| Auth | Better Auth + MongoDB | Yes | Move to Express |
| Avatar | `src/app/api/avatar` → `data/avatars` | Yes, local disk | Move to Express + object storage |
| Services | `src/lib/services.ts` — 15 hardcoded | No | Catalog API + MongoDB |
| Service detail/reviews | `src/lib/service-details.ts` | No | Detail + reviews API |
| Customer bookings | `src/lib/customer-data.ts` | No | Bookings API |
| Customer payments | `src/lib/customer-data.ts` | No | Payments + Stripe |
| Technician services | `src/lib/technician-data.ts` | No | Listing CRUD API |
| Technician requests | `src/lib/technician-data.ts` | No | Booking workflow API |
| Admin users/services/bookings/payments | `src/lib/admin-data.ts` | No | Admin APIs |
| Dashboard stats/charts | Computed from preview arrays | No | Aggregation endpoints |
| Role change / suspend | Local state in `admin-users.tsx` | No | Admin user APIs |
| Service approve/reject | Local state in `admin-service-approval.tsx` | No | Admin service APIs |
| Add service | Local `submitted` state | No | Create listing API |
| Edit service | Placeholder button | No | Update listing API |
| Pay now | Local state in `customer-bookings.tsx` | No | Stripe Checkout + webhook |
| Customer cancel | Local state | No | Cancel endpoint |
| Technician accept/reject/start/complete | Local state | No | Booking transition APIs |
| Reviews | Hardcoded in `service-details.ts` | No | Reviews collection |
| CSV exports | Built client-side from props | Works once data is real | Optional server export |

### Critical UX gaps

1. **There is no booking request form yet.**
   On `/services/[id]`, “Request this repair” only links to `/dashboard/customer/bookings`. A real backend needs a form/modal collecting preferred date, phone, address, and problem description.

2. **Every dashboard action is local-only.**
   Cancel, pay, accept, reject, start, complete, approve, reject, role change, suspend, delete, and availability toggle do not persist.

3. **`getAppRole()` has a role-change trap.**
   It returns `admin` from `role`, otherwise uses `accountType`. If an admin changes a customer to `technician` by setting only `role`, `getAppRole` still returns `customer`. The backend must update **both** `role` and `accountType`, or `getAppRole` must treat `role === "technician"` as technician.

4. **Editing an approved service must reset it to pending.**
   The UI already says this. The backend must enforce it.

5. **Payment status must never be client-controlled.**
   `paymentStatus: "paid"` must only be set by a verified Stripe webhook.

6. **Public service visibility needs one rule.**
   Public listings = `approval === "approved" && available === true && !deletedAt`.

7. **The dashboard shell imports preview data directly.**
   `dashboard-shell.tsx` imports `PENDING_SERVICES`, `TECHNICIAN_SERVICES`, and `TECHNICIAN_REQUESTS` for sidebar counts. Once real data exists, those counts must come from the server/layout.

---

## 2. Chosen architecture

Use a separate Express API server. Next.js becomes the frontend and does not own business data.

```text
Browser
  │
  ├── Next.js pages / server components
  │       └── fetch Express /api/v1/* with forwarded cookies
  │
  └── Next.js client components
          └── fetch Express /api/v1/* with credentials

Express API
  ├── Better Auth          /api/auth/*
  ├── Marketplace routes   /api/v1/*
  ├── MongoDB
  ├── Stripe
  └── Object storage
```

### Decision

**Move Better Auth to Express.**
Do not keep one auth instance in Next and one in Express. Two auth instances create cookie, session, and type duplication problems.

### Repository layout

Recommended:

```text
C:\web_dev\fix_mate\
  fix_mate_front_end\      # existing Next app
  fix_mate_backend\        # new Express app
```

A sibling folder is cleaner. If the backend is placed inside the frontend repo:

- Add `"backend"` to `exclude` in `tsconfig.json`.
- Add `backend/**` to `globalIgnores` in `eslint.config.mjs`.

Otherwise `npx tsc --noEmit` and `npm run lint` will try to process Express files with the Next config.

### Backend file tree

```text
fix_mate_backend/
  src/
    index.ts                 # Express entrypoint, middleware order
    config/env.ts            # env validation
    db/
      mongo.ts               # MongoClient + database
      collections.ts         # typed collections
      indexes.ts             # ensureIndexes()
    auth.ts                  # Better Auth instance
    roles.ts                 # getAppRole()
    types/
      models.ts              # collection documents/DTOs
    middleware/
      auth.ts                # requireUser / requireRole
      validate.ts            # body/query/params validation
      request-context.ts     # request IDs + access logs
      errors.ts              # centralized error handler
    http/
      api-error.ts           # ApiError + factories
      status.ts              # status code conventions
      response.ts            # ok(), fail(), paginated()
    validation/
      auth.ts
      common.ts
      format.ts
      services.ts
      bookings.ts
      users.ts
      reviews.ts
      payments.ts
    routes/
      me.ts
      catalog.ts
      bookings.ts
      customer.ts
      technician.ts
      admin.ts
      payments.ts
      reviews.ts
      uploads.ts
      webhooks.ts
    services/                # business logic
      catalog.ts
      bookings.ts
      technician.ts
      admin.ts
      payments.ts
      reviews.ts
    lib/
      logger.ts              # structured JSON logs
      stripe.ts
      storage.ts
  scripts/
    seed.ts
    seed-data.ts             # demo service/user fixture
    create-admin.ts
  .env
  package.json
  tsconfig.json
```

---

## 3. Non-negotiable backend rules

### Authentication and authorization

- Express owns Better Auth.
- Next server components read the session from Express by forwarding the browser cookie.
- Express endpoints must authenticate every request themselves.
- Next page guards are not enough; APIs must also enforce access.
- Object-level ownership is required:
  - Customer can read only their bookings/payments.
  - Technician can read only assigned bookings and own services.
  - Admin can read all.
- Admin cannot demote themselves.
- Suspended users cannot sign in.
- Role changes must sync `role` and `accountType`.

### Public visibility

- Public service list/detail only returns `approval === "approved" && available === true && !deletedAt`.
- Pending/rejected/paused/deleted services never appear publicly.
- Unknown slug returns `404`.

### Booking rules

```text
requested
  ├── accepted     (technician)
  ├── rejected     (technician)
  └── cancelled    (customer)
accepted
  └── in-progress  (technician)
in-progress
  └── completed    (technician, sets finalAmount)
completed
  └── paymentStatus paid  (Stripe webhook only)
```

Allowed transitions:

```ts
const ALLOWED = {
  requested: ["accepted", "rejected", "cancelled"],
  accepted: ["in-progress"],
  "in-progress": ["completed"],
  completed: [],
  cancelled: [],
  rejected: [],
};
```

Use conditional updates so two devices cannot perform the same transition twice:

```ts
await bookings.findOneAndUpdate(
  { _id: id, technicianId: session.user.id, status: "requested" },
  { $set: { status: "accepted", acceptedAt: new Date() } },
);
```

If no document matches, return `409 INVALID_STATE` or `403`.

### Service approval rules

```text
pending -> approved | rejected
approved -> pending  (on edit)
rejected -> pending  (on edit or re-review)
```

- Only admin can approve/reject.
- Approving sets `available = true`.
- Editing an approved listing resets `approval = "pending"`.
- Use soft delete (`deletedAt`) so historical bookings still reference the service.

### Payment rules

- Checkout is allowed only for the owning customer.
- Checkout is allowed only for `completed` + `unpaid`.
- Amount comes from the server-side `finalAmount`.
- Stripe webhook verifies the raw body signature.
- Webhook is idempotent.
- `paymentStatus` is changed only by the webhook.
- Refunds are admin-only.

### Data rules

- Never accept `customerId`, `technicianId`, `basePrice`, `finalAmount`, `status`, `paymentStatus`, `approval`, `role`, or `plan` from a public client.
- Snapshot service title/category/mode/base price into the booking at creation time.
- Keep `serviceId` and `serviceSlug` on the booking.
- Store whole USD for now; convert to cents at the Stripe boundary.
- Prefer string UUIDs for business `_id`s. Use human-readable `slug` and `bookingNumber` in the UI.

### Mongo transactions

MongoDB transactions require a replica set. Atlas supports them. A local standalone `mongod` usually does not.

If local Mongo is standalone:

- Use unique indexes.
- Use conditional `findOneAndUpdate`.
- Make payment/booking changes idempotent instead of multi-document transactions.

---

## 4. Phase plan

## Phase 0 — Express skeleton and auth migration

**Goal:** Express runs, Better Auth works, Next can sign in/out, and protected pages still work.

### Tasks

- [x] Create `fix_mate_backend` with TypeScript, Express, MongoDB, Better Auth, Zod.
- [x] Install backend dependencies.
- [x] Copy/adapt `mongo.ts`, `auth.ts`, and `roles.ts`.
- [x] Add `config/env.ts` validation.
- [x] Mount Better Auth before `express.json()`.
- [x] Add CORS with credentials and the exact frontend origin.
- [x] Add `GET /api/v1/health` with a Mongo ping.
- [x] Move `scripts/create-admin.ts` to the backend and repoint/remove the frontend `auth:admin` script.
- [x] Move avatar upload to Express or add a temporary proxy.
- [x] Update the sign-up and profile avatar fetches to the Express upload URL.
- [x] Update Next `authClient` base URL.
- [x] Update Next `authz.ts` to fetch the session from Express.
- [x] Remove or proxy `src/app/api/auth/[...all]/route.ts`.
- [x] Update Google OAuth callback URL, if Google is enabled.

### Backend dependencies

```bash
npm i express cors helmet zod mongodb better-auth @better-auth/mongo-adapter multer dotenv
npm i -D typescript tsx @types/node @types/express @types/cors @types/multer
# Phase 7 adds: stripe
```

### Express entrypoint order

```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL ?? "http://localhost:3000"],
    credentials: true,
  }),
);

// Better Auth MUST be mounted before express.json().
// Express 5 uses *splat; Express 4 uses *.
app.all("/api/auth/*splat", toNodeHandler(auth));

// Stripe webhook must receive the raw body.
// Mount it before express.json() when Phase 7 is implemented.
// app.post("/api/v1/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json({ limit: "1mb" }));

app.get("/api/v1/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(Number(process.env.PORT ?? 4000));
```

### Auth config changes

```ts
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:4000";

const trustedOrigins = [
  process.env.FRONTEND_URL ?? "http://localhost:3000",
  baseURL,
];
```

### Express API auth middleware

Use `fromNodeHeaders`:

```ts
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";
import { getAppRole } from "../roles";

export async function requireRole(request, response, next, roles) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    return response.status(401).json({
      error: { code: "UNAUTHENTICATED", message: "Sign in required." },
    });
  }

  const role = getAppRole(session.user);

  if (!roles.includes(role)) {
    return response.status(403).json({
      error: { code: "FORBIDDEN", message: "You do not have access." },
    });
  }

  request.session = session;
  request.appRole = role;
  next();
}
```

Wrap this in a small factory such as `requireRole(["admin"])` rather than passing roles on every call.

### Next changes

`src/lib/auth-client.ts`:

```ts
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [/* additional fields + adminClient */],
});
```

`src/lib/authz.ts`:

```ts
import { cache } from "react";
import { headers } from "next/headers";

export const getSession = cache(async () => {
  const cookie = (await headers()).get("cookie") ?? "";

  const response = await fetch(`${process.env.API_URL}/api/auth/get-session`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = await response.json();

  return data?.session ? data : null;
});
```

### Auth type problem

`src/lib/auth-client.ts` currently imports `type { auth } from "@/lib/auth"` for `inferAdditionalFields`. Once auth moves to Express:

- Do not import the Express server module into the browser bundle.
- Move the user additional-field types into a shared type file, or define them manually in the frontend.

### Acceptance checks

- [x] `GET http://localhost:4000/api/v1/health` returns `200`.
- [x] `POST http://localhost:4000/api/auth/sign-up/email` creates a user.
- [x] Next sign-up works.
- [x] Next sign-in sets a cookie and redirects to `/dashboard`.
- [x] Express `GET /api/auth/get-session` with that cookie returns the user.
- [x] Next protected pages still redirect correctly.
- [x] Sign-out works.
- [x] Existing avatar upload still works after the auth move.

---

## Phase 1 — Collections, indexes, and seed data

**Goal:** MongoDB contains the real 15 services, technician profiles, and demo users. No endpoints beyond auth/health yet.

### Tasks

- [x] Create `services`, `bookings`, `payments`, `reviews`, `technicianProfiles` collections.
- [x] Add TypeScript types/DTOs for each.
- [x] Add `ensureIndexes()`.
- [x] Add `scripts/seed.ts`.
- [x] Add `"seed": "tsx scripts/seed.ts"` to `package.json`.
- [x] Seed demo users through `auth.api.signUpEmail` so passwords are hashed correctly.
- [x] Seed technician profiles and admin role.
- [x] Seed the 15 listings from `src/lib/services.ts`.
- [x] Seed includes, warranty, and reviews from `src/lib/service-details.ts`.
- [x] Optionally seed preview bookings/payments for demo dashboards. *(Implemented in Step 10 as eight idempotent demo bookings across all statuses and two paid demo payments.)*
- [x] Run indexes once at seed/deploy time, not on every request.

### Seed data mapping

The current data uses inconsistent IDs:

- Public listings use slugs like `iphone-13-screen-replacement`.
- Admin services use IDs like `s1`.
- Customer bookings use IDs like `b10`.
- Technician services use IDs like `s6`.

The seed script must settle on:

- `services.slug` — stable public identifier.
- `services._id` — UUID.
- `bookings.bookingNumber` — display identifier.
- `bookings.serviceSlug` — public link.
- Legacy IDs — store as `legacyId` if needed for migration.

### Acceptance checks

- [x] MongoDB has 15 services.
- [x] Three technician users exist.
- [x] `slug` is unique.
- [x] Public services have `approval: "approved"` and `available: true`.
- [x] Indexes exist.
- [x] A small script can read 15 services from MongoDB with the shape the UI expects.

---

## Phase 2 — Shared API plumbing

**Goal:** Every endpoint has the same auth, validation, error, and pagination behavior.

### Tasks

- [x] Add `ApiError`.
- [x] Add response helpers: `ok()`, `fail()`, `paginated()`.
- [x] Add Zod schemas for every request body and query.
- [x] Add auth middleware.
- [x] Add validation middleware.
- [x] Add centralized error handler.
- [x] Add request IDs and structured logs.
- [x] Add pagination defaults:
  - Public catalog: 9
  - Dashboard tables: 20
  - Maximum: 100
- [x] Add status code conventions.
- [x] Add `GET /api/v1/me` (optional if the frontend reads `/api/auth/get-session` directly). *(Implemented as a read-only user/role endpoint.)*
- [x] Decide whether profile updates use Better Auth `/api/auth/update-user` or `PATCH /api/v1/me`. Do not implement both paths. *(Chosen: profile updates stay on `/api/auth/update-user`.)*

### Response envelope

Success:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "INVALID_STATE",
    "message": "This booking can no longer be cancelled.",
    "details": []
  }
}
```

### Status codes

- `200` — read/update success
- `201` — created
- `204` — deleted/no content
- `400` — malformed request
- `401` — not signed in
- `403` — wrong role/ownership
- `404` — not found
- `409` — invalid state/conflict
- `422` — validation failure
- `429` — rate limited
- `500` — unexpected error

### Acceptance checks

- [x] No session → `401`.
- [x] Wrong role → `403`.
- [x] Invalid input → `400`/`422`.
- [x] Not found → `404`.
- [x] Invalid transition → `409`.
- [x] Errors always use the same envelope.

---

## Phase 3 — Public catalog API and frontend switch

**Goal:** Public pages read from MongoDB through Express instead of static arrays.

### Endpoints

- [x] `GET /api/v1/meta`
- [x] `GET /api/v1/services`
- [x] `GET /api/v1/services/:slug`
- [x] `GET /api/v1/services/:slug/reviews`
- [ ] `GET /api/v1/home` (P1) *(Deferred; the homepage uses `/meta` + `/services`.)*
- [ ] `GET /api/v1/technicians/:id` (P1) *(Deferred; service detail includes `technicianProfile`.)*

### Query parameters

```text
q, category, mode, sort=newest|price-asc|price-desc|rating, page, pageSize
```

### Frontend files

- `src/app/page.tsx` and home sections (fetch meta + featured services, pass props down)
- `src/app/services/page.tsx`
- `src/app/services/[id]/page.tsx`
- `src/lib/home-data.ts` (static copy only)
- `src/lib/api.ts` (server-side API fetch helper)
- `src/lib/catalog.ts` (catalog DTOs + fetchers)
- `src/components/service-card.tsx` should keep its current shape

Keep `src/lib/service-styles.ts`; it is pure frontend styling.

### Caching

- Public catalog: `fetch` revalidate is 60 seconds; Express also sends `Cache-Control: public, max-age=60, stale-while-revalidate=300`.
- Dashboard data: `no-store`.

The review distribution bars remain a UI placeholder until Phase 8 replaces them with an aggregation.

### Acceptance checks

- [x] Search, category, mode, sort, and pagination still work through the URL.
- [x] Unknown slug returns `404`.
- [x] Only approved + available services appear.
- [x] `/services/[id]` no longer imports `SERVICES` or `SERVICE_DETAILS`.
- [x] The visual design is unchanged.

---

## Phase 4 — Booking creation and customer flows

**Goal:** A customer can request a repair, see it after refresh, and cancel it while `requested`.

### Endpoints

- [x] `POST /api/v1/bookings`
- [x] `GET /api/v1/bookings`
- [x] `GET /api/v1/bookings/:id`
- [x] `POST /api/v1/bookings/:id/cancel`
- [x] `GET /api/v1/customer/overview`
- [x] `GET /api/v1/customer/payments`
- [x] `GET /api/v1/payments/:id`

### Booking creation body

```json
{
  "serviceSlug": "split-ac-deep-cleaning",
  "preferredDate": "2026-11-26",
  "phone": "+880 1712 345678",
  "address": "Flat 5B, House 27, Road 9, Dhanmondi, Dhaka",
  "problem": "The bedroom AC smells damp and cooling is weak."
}
```

Server must:

1. Require role `customer`.
2. Load the service and reject unless approved + available.
3. Copy `basePrice`, `serviceTitle`, `category`, `mode`, `technicianId`.
4. Create `status: "requested"`, `paymentStatus: "unpaid"`.
5. Add the first `statusHistory` entry.
6. Ignore any client-sent price, technician, status, or payment status.

### Frontend changes

- [x] Add the missing booking form/modal on `/services/[id]`.
- [x] Replace `CustomerBookings` local cancel state with the cancel endpoint.
- [x] Replace `CustomerPayments` props with API data.
- [x] Replace customer overview static imports with the overview endpoint.
- [x] Add loading, empty, and error states.

### Acceptance checks

- [x] New request appears for the correct customer, technician, and admin. *(Verified in MongoDB and APIs; technician/admin dashboards switch to live data in Phases 5/6.)*
- [x] Cancel only works while `requested`.
- [x] Refresh preserves the booking.
- [x] No price is accepted from the browser.
- [x] Another customer cannot read the booking.

The customer “Pay now” button no longer writes `paymentStatus` locally; it shows a notice until Stripe checkout is added in Phase 7.

---

## Phase 5 — Technician listing and request flows

**Goal:** Technicians can manage their own listings and move assigned jobs through the workflow.

### Endpoints

- [x] `GET /api/v1/technician/overview`
- [x] `GET /api/v1/technician/services`
- [x] `POST /api/v1/technician/services`
- [x] `GET /api/v1/technician/services/:id`
- [x] `PATCH /api/v1/technician/services/:id`
- [x] `DELETE /api/v1/technician/services/:id`
- [x] `PATCH /api/v1/technician/services/:id/availability`
- [x] `GET /api/v1/technician/requests`
- [x] `GET /api/v1/technician/requests/:id`
- [x] `POST /api/v1/technician/requests/:id/accept`
- [x] `POST /api/v1/technician/requests/:id/reject`
- [x] `POST /api/v1/technician/requests/:id/start`
- [x] `POST /api/v1/technician/requests/:id/complete`
- [ ] `GET /api/v1/technician/earnings` (P1) *(Deferred; the overview already shows paid earnings.)*

### Rules

- Technician can only see/edit own services.
- Technician can only see bookings where `technicianId` matches.
- Accept/reject only from `requested`.
- Start only from `accepted`.
- Complete only from `in-progress`, with `finalAmount > 0`.
- Editing an approved service resets it to `pending`.
- Delete is a soft delete.
- Customer phone/address should only be visible to the assigned technician. Prefer hiding it until the request is accepted.

### Frontend changes

- [x] Wire `AddServiceForm` submit to `POST`.
- [x] Add the missing edit-service form and wire `PATCH`.
- [x] Wire availability toggle.
- [x] Wire delete.
- [x] Replace `TechnicianRequests` local status changes with API calls.
- [x] Replace the completion `window.prompt` with a proper modal if possible.

Cover uploads are wired in Phase 8; new listings store the uploaded `coverImage` URL. Listings without a cover keep the category art. The technician sidebar counts in `dashboard-shell.tsx` still come from preview arrays until Phase 6. Requested bookings hide customer phone/address until the technician accepts.

### Acceptance checks

- [x] A technician cannot modify another technician's listing or booking.
- [x] Approved service edit removes it from public view until re-approved.
- [x] Booking state transitions are enforced server-side.
- [x] Completion stores the final amount exactly once.

---

## Phase 6 — Admin flows

**Goal:** Admin actions persist, are authorized, and are audited.

### Endpoints

- [x] `GET /api/v1/admin/overview`
- [x] `GET /api/v1/admin/users`
- [x] `GET /api/v1/admin/users/:id`
- [x] `PATCH /api/v1/admin/users/:id/role`
- [x] `POST /api/v1/admin/users/:id/suspend`
- [x] `POST /api/v1/admin/users/:id/restore`
- [x] `GET /api/v1/admin/services`
- [x] `GET /api/v1/admin/services/:id`
- [x] `POST /api/v1/admin/services/:id/approve`
- [x] `POST /api/v1/admin/services/:id/reject`
- [x] `GET /api/v1/admin/bookings`
- [x] `GET /api/v1/admin/bookings/:id`
- [x] `GET /api/v1/admin/payments`
- [x] `GET /api/v1/admin/payments/:id`
- [ ] `POST /api/v1/admin/users/:id/verify-technician` (P1) *(Deferred.)*
- [ ] `GET /api/v1/admin/exports/:dataset` (P1) *(Deferred; client-side CSV export still works for loaded data.)*
- [ ] `GET /api/v1/admin/audit-logs` (P2) *(Audit entries are written to the `auditLogs` collection; the read endpoint is deferred.)*

### Rules

- Admin cannot demote themselves.
- Customer ↔ technician changes must sync `role` and `accountType`.
- Suspension uses Better Auth's admin ban mechanism.
- Approve/reject only from `pending`, using a conditional update.
- Rejection stores a reason.
- Write an audit log for every role, suspend, approve, and reject action.
- Never return password hashes or session tokens.
- Only admins can hit admin endpoints.

### Frontend changes

- [x] Replace `admin-users.tsx` local role/suspend state.
- [x] Replace `admin-service-approval.tsx` local approval state.
- [x] Replace `admin-transactions.tsx` props with API data.
- [x] Pass real sidebar counts from the dashboard layout instead of importing preview arrays in `dashboard-shell.tsx`.

Role changes are limited to customer ↔ technician; the admin option is disabled and admin promotion stays in the seed/admin tooling. Approve/reject only applies to `pending` listings, so a rejected listing returns to review only when the technician edits it. Admin payments are empty until Phase 7. The admin user table requests up to 100 rows and has no pagination controls yet.

### Acceptance checks

- [x] Admin changes persist after refresh.
- [x] Admin cannot demote themselves.
- [x] Suspended users cannot sign in.
- [x] Non-admin requests to admin endpoints return `403`.
- [x] Approve/reject cannot be applied twice to the same pending item.

---

## Phase 7 — Stripe payments

**Goal:** Customers pay completed jobs through Stripe; payments are recorded exactly once.

### Endpoints

- [x] `POST /api/v1/bookings/:id/checkout`
- [x] `POST /api/v1/webhooks/stripe`
- [ ] `GET /api/v1/payments/:id/invoice` (P1) *(Deferred; the in-page invoice modal still uses payment data.)*

### Tasks

- [x] Install `stripe` in the backend.
- [x] Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
- [x] Create Checkout Session from server-side `finalAmount`.
- [x] Store `providerSessionId`.
- [x] Verify webhook signature using the raw body.
- [x] Handle `checkout.session.completed` and `payment_intent.succeeded`.
- [x] Insert exactly one payment per booking.
- [x] Mark booking paid only after webhook verification.
- [x] Add idempotency unique indexes.

### Critical middleware order

The Stripe webhook route must receive the raw request body. Mount it before `express.json()`:

```ts
app.post(
  "/api/v1/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

app.use(express.json());
```

### Local testing

```bash
stripe listen --forward-to localhost:4000/api/v1/webhooks/stripe
```

### Acceptance checks

- [x] Test card `4242 4242 4242 4242` creates one payment. *(Verified live on 2026-11-21: one payment, booking marked paid, test data deleted afterwards.)*
- [x] Replaying the webhook does not create a duplicate.
- [x] Refreshing the customer dashboard shows paid.
- [x] Technician earnings include the paid amount.
- [x] No client call can mark a booking paid.

`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are set in the backend `.env`. The webhook secret is now a valid `whsec_...` value. Checkout reuses an open session for the same booking; a completed session returns `409 PAYMENT_PROCESSING`. The success and cancel URLs both return to `/dashboard/customer/bookings`.

The live card test used the temporary Stripe endpoint `we_1UeG3lDbTSRRDIHKe7exnR40` and a Cloudflare quick tunnel. That tunnel URL is ephemeral: stop `cloudflared` when done, and either delete the temporary endpoint in the Stripe Dashboard or update it with a permanent URL. The signing secret is tied to the endpoint.

---

## Phase 8 — Reviews and uploads

**Goal:** Customers can review paid jobs; images live in object storage.

### Endpoints

- [x] `POST /api/v1/bookings/:id/review`
- [x] `GET /api/v1/services/:slug/reviews`
- [ ] `GET /api/v1/me/reviews` (P2)
- [x] `POST /api/v1/uploads/avatar`
- [x] `POST /api/v1/uploads/service-cover`

### Review rules

- Only the owning customer can review.
- Only `completed` + `paid` bookings.
- One review per booking.
- `rating` 1–5; `text` length-limited.
- Recompute `ratingAvg` and `reviewCount` on the service.
- Replace `REVIEW_DISTRIBUTION` hardcoding with an aggregation.

### Upload rules

- Replace local `data/avatars` with S3/R2/Cloudinary.
- Validate MIME type and size server-side.
- Do not trust the browser-provided filename.
- Store only the public URL in MongoDB.
- Avatar max: 2 MB. Service cover max: 5 MB.

### Acceptance checks

- [x] One review per paid booking.
- [x] Service rating updates.
- [x] Invalid rating/text rejected.
- [ ] Avatar and cover uploads work in production storage. *(Code complete and verified with `UPLOAD_DRIVER=local`. Set `UPLOAD_DRIVER=s3` plus the `S3_*` keys to verify a real bucket.)*
- [x] Old local-disk route is no longer required.

Reviews are created only for the owning customer on a `completed` + `paid` booking. The unique `reviews.bookingId` index enforces one review per booking. Creating a review recomputes `services.ratingAvg` and `services.reviewCount` from visible review documents, and `GET /api/v1/services/:slug/reviews` returns the 5★→1★ percentage breakdown in `meta.distribution` (no frontend hardcoding). Customer booking DTOs now include `reviewed`, which drives the “Leave a review” / “Reviewed” action.

Uploads go through `src/lib/storage.ts`. `UPLOAD_DRIVER=local` (development default) writes to `data/uploads` and serves files from `/api/v1/uploads/files`; `UPLOAD_DRIVER=s3` writes to AWS S3, Cloudflare R2, MinIO, or any S3-compatible bucket. The MIME type is detected from the file bytes (not the browser header or filename), extensions come from that detection, and object keys are server-generated UUIDs. The legacy `/api/v1/uploads/avatars` static mount remains only for files uploaded before Phase 8.

---

## Phase 9 - Hardening and tests

### Tasks

- [ ] Validate every body/query with Zod.
- [ ] Enforce object-level ownership on every read.
- [ ] Add pagination everywhere.
- [ ] Escape regex search input.
- [ ] Add rate limiting for auth, booking creation, and uploads.
- [ ] Add request IDs and structured logs.
- [ ] Add audit logs for admin actions.
- [ ] Use conditional updates for all state transitions.
- [ ] Use unique indexes for idempotency.
- [ ] Add tests for:
  - [ ] `401`/`403`
  - [ ] IDOR (another user's booking/service/payment)
  - [ ] Booking state transitions
  - [ ] Payment idempotency
  - [ ] Role changes
  - [ ] Approval reset on edit

Suggested test stack if adding tooling:

```bash
npm i -D vitest @vitest/coverage-v8 supertest @types/supertest mongodb-memory-server
```

If you do not want a test runner yet, use a manual smoke-test script and keep the checks above.

---

## Phase 10 — Deployment

### Environment

Backend `.env`:

```env
PORT=4000
MONGODB_URI=
MONGODB_DB=fixmate
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://api.your-domain.com
FRONTEND_URL=https://your-domain.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
UPLOAD_DRIVER=s3
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
# Optional for R2/MinIO and custom/CDN public URLs:
S3_ENDPOINT=
S3_PUBLIC_URL=
S3_FORCE_PATH_STYLE=false
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Frontend `.env`:

```env
API_URL=https://api.your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Deployment order

- [ ] Create MongoDB Atlas cluster.
- [ ] Run indexes and seed script.
- [ ] Deploy Express.
- [ ] Configure Stripe webhook URL.
- [ ] Configure object storage.
- [ ] Deploy Next.
- [ ] Run the end-to-end acceptance scenario.

### Cookies and CORS in production

- Use an exact frontend origin, never `*` with credentials.
- Same-site subdomains: `SameSite=Lax` can work.
- Different registrable domains: use `SameSite=None; Secure` and HTTPS.
- Update Google OAuth callback to the backend URL.
- `BETTER_AUTH_URL` must be the backend origin.

---

## 5. Database model

### `user` — managed by Better Auth

Keep Better Auth fields. Add:

- `accountType`: `"customer" | "technician"`
- `phone`
- `area`
- `bio`
- `role`: admin plugin role
- `banned`, `banReason`, `banExpires`
- `image`

### `technicianProfiles`

```ts
{
  userId: string;
  verificationStatus: "pending" | "verified" | "rejected";
  plan: "free" | "pro";
  ratingAvg: number;
  jobsCompleted: number;
  repliesIn: string;
  specialties: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### `services`

```ts
{
  _id: string;
  slug: string;
  technicianId: string;
  technicianName: string;
  title: string;
  category:
    | "Smartphone"
    | "Laptop & PC"
    | "AC"
    | "Refrigerator"
    | "TV"
    | "Washing Machine"
    | "Electrical";
  description: string;
  location: string;
  duration: string;
  price: number;
  mode: "Home Visit" | "Shop Drop-off";
  coverImage: string | null;
  includes: string[];
  warranty: string;
  availabilityNote: string;
  approval: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  available: boolean;
  ratingAvg: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  deletedAt?: Date | null;
}
```

### `bookings`

```ts
{
  _id: string;
  bookingNumber: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  serviceSlug: string;
  serviceTitle: string;
  category: string;
  mode: string;
  basePrice: number;
  finalAmount: number | null;
  preferredDate: string;
  phone: string;
  address: string;
  problem: string;
  status:
    | "requested"
    | "accepted"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "rejected";
  paymentStatus: "unpaid" | "paid";
  statusHistory: Array<{
    status: string;
    at: Date;
    by: string;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  rejectedAt?: Date;
  checkoutSessionId?: string;
}
```

### `payments`

```ts
{
  _id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  amount: number;
  currency: "usd";
  provider: "stripe";
  providerSessionId: string;
  providerPaymentIntentId?: string;
  transactionId: string;
  status: "paid" | "refunded";
  paidAt: Date;
  invoiceNumber: string;
  createdAt: Date;
}
```

### `reviews`

```ts
{
  _id: string;
  bookingId: string;
  serviceId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  text: string;
  visible: boolean;
  createdAt: Date;
}
```

`bookingId` has a unique index, so a booking can be reviewed only once.

### `auditLogs`

```ts
{
  _id: string;
  action: string;
  actorId: string;
  actorEmail: string;
  targetType: "user" | "service" | "booking" | "payment";
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}
```

### Indexes

```ts
services.createIndexes([
  { key: { slug: 1 }, unique: true },
  { key: { approval: 1, available: 1, createdAt: -1 } },
  { key: { category: 1, price: 1 } },
  { key: { technicianId: 1, approval: 1 } },
  { key: { deletedAt: 1 } },
]);

bookings.createIndexes([
  { key: { bookingNumber: 1 }, unique: true },
  { key: { customerId: 1, status: 1, createdAt: -1 } },
  { key: { technicianId: 1, status: 1, createdAt: -1 } },
  { key: { status: 1, createdAt: -1 } },
]);

payments.createIndexes([
  { key: { bookingId: 1 }, unique: true },
  { key: { providerSessionId: 1 }, unique: true },
  { key: { providerPaymentIntentId: 1 }, unique: true, sparse: true },
  { key: { paidAt: -1 } },
  { key: { customerId: 1, paidAt: -1 } },
  { key: { technicianId: 1, paidAt: -1 } },
]);

reviews.createIndexes([
  { key: { bookingId: 1 }, unique: true },
  { key: { serviceId: 1, createdAt: -1 } },
]);

auditLogs.createIndexes([
  { key: { createdAt: -1 } },
  { key: { actorId: 1, createdAt: -1 } },
  { key: { targetType: 1, targetId: 1, createdAt: -1 } },
]);
```

---

## 6. Complete endpoint catalog

`P0` = first usable version. `P1` = next. `P2` = later.

### Auth and account

Better Auth provides these. Do not hand-roll them.

| P | Method | Path | Access | Purpose |
|---|---|---|---|---|
| P0 | POST | `/api/auth/sign-up/email` | public | Email/password sign-up with `accountType` |
| P0 | POST | `/api/auth/sign-in/email` | public | Email/password sign-in |
| P0 | POST | `/api/auth/sign-out` | user | End session |
| P0 | GET | `/api/auth/get-session` | user | Current session/user |
| P0 | POST | `/api/auth/update-user` | user | Name, phone, area, bio, image |
| P1 | POST | `/api/auth/sign-in/social` | public | Google sign-in |
| P1 | GET | `/api/auth/callback/google` | public | Google callback |
| P2 | POST | `/api/auth/request-password-reset` | public | Forgot password |
| P2 | POST | `/api/auth/reset-password` | public | Reset password |
| P2 | POST | `/api/auth/change-password` | user | Change password |
| P2 | GET | `/api/auth/list-sessions` | user | List sessions |
| P2 | POST | `/api/auth/revoke-session` | user | Revoke a session |
| P2 | POST | `/api/auth/delete-user` | user | Delete account |

### Public catalog

| P | Method | Path | Access | Purpose |
|---|---|---|---|---|
| P0 | GET | `/api/v1/health` | public | Liveness + Mongo ping |
| P0 | GET | `/api/v1/meta` | public | Categories, modes, page size, flags |
| P0 | GET | `/api/v1/services` | public | Search/filter/sort/paginate |
| P0 | GET | `/api/v1/services/:slug` | public | Service detail |
| P0 | GET | `/api/v1/services/:slug/reviews` | public | Paginated reviews + rating distribution |
| P1 | GET | `/api/v1/home` | public | Homepage aggregates |
| P1 | GET | `/api/v1/technicians/:id` | public | Public technician profile |

### Current user / uploads

| P | Method | Path | Access | Purpose |
|---|---|---|---|---|
| P0 | GET | `/api/v1/me` | user | Current user + role + stats |
| P0 | PATCH | `/api/v1/me` | user | Update profile |
| P0 | POST | `/api/v1/uploads/avatar` | user | Avatar upload |
| P1 | POST | `/api/v1/uploads/service-cover` | technician | Listing cover upload |

### Customer

| P | Method | Path | Access | Purpose |
|---|---|---|---|---|
| P0 | GET | `/api/v1/customer/overview` | customer | Stats, active job, recent, spend |
| P0 | POST | `/api/v1/bookings` | customer | Create repair request |
| P0 | GET | `/api/v1/bookings` | customer | Own bookings |
| P0 | GET | `/api/v1/bookings/:id` | owner/admin | Booking detail + timeline |
| P0 | POST | `/api/v1/bookings/:id/cancel` | owner customer | Cancel while `requested` |
| P0 | POST | `/api/v1/bookings/:id/checkout` | owner customer | Stripe Checkout |
| P0 | GET | `/api/v1/customer/payments` | customer | Own payments |
| P0 | GET | `/api/v1/payments/:id` | owner/admin | Payment detail |
| P1 | GET | `/api/v1/payments/:id/invoice` | owner/admin | Invoice |
| P1 | POST | `/api/v1/bookings/:id/review` | owner customer | Review paid booking |
| P2 | GET | `/api/v1/me/reviews` | customer | Own reviews |

### Technician

| P | Method | Path | Access | Purpose |
|---|---|---|---|---|
| P0 | GET | `/api/v1/technician/overview` | technician | Overview stats |
| P0 | GET | `/api/v1/technician/services` | technician | Own listings |
| P0 | POST | `/api/v1/technician/services` | technician | Create pending listing |
| P0 | GET | `/api/v1/technician/services/:id` | owner | Listing detail |
| P0 | PATCH | `/api/v1/technician/services/:id` | owner | Edit; reset approval |
| P0 | DELETE | `/api/v1/technician/services/:id` | owner | Soft delete |
| P0 | PATCH | `/api/v1/technician/services/:id/availability` | owner | Pause/resume |
| P0 | GET | `/api/v1/technician/requests` | technician | Assigned bookings |
| P0 | GET | `/api/v1/technician/requests/:id` | assigned technician | Request detail |
| P0 | POST | `/api/v1/technician/requests/:id/accept` | assigned technician | `requested → accepted` |
| P0 | POST | `/api/v1/technician/requests/:id/reject` | assigned technician | `requested → rejected` |
| P0 | POST | `/api/v1/technician/requests/:id/start` | assigned technician | `accepted → in-progress` |
| P0 | POST | `/api/v1/technician/requests/:id/complete` | assigned technician | Complete + final amount |
| P1 | GET | `/api/v1/technician/earnings` | technician | Monthly earnings |
| P2 | PATCH | `/api/v1/technician/profile` | technician | Extra profile fields |

### Admin

| P | Method | Path | Access | Purpose |
|---|---|---|---|---|
| P0 | GET | `/api/v1/admin/overview` | admin | Stats/charts |
| P0 | GET | `/api/v1/admin/users` | admin | Users list |
| P0 | GET | `/api/v1/admin/users/:id` | admin | User detail |
| P0 | PATCH | `/api/v1/admin/users/:id/role` | admin | Change role |
| P0 | POST | `/api/v1/admin/users/:id/suspend` | admin | Ban user |
| P0 | POST | `/api/v1/admin/users/:id/restore` | admin | Unban user |
| P1 | POST | `/api/v1/admin/users/:id/verify-technician` | admin | Verify technician |
| P2 | PATCH | `/api/v1/admin/technicians/:id/plan` | admin | Free/Pro |
| P2 | DELETE | `/api/v1/admin/users/:id` | admin | Soft delete |
| P0 | GET | `/api/v1/admin/services` | admin | All listings |
| P0 | GET | `/api/v1/admin/services/:id` | admin | Listing detail |
| P0 | POST | `/api/v1/admin/services/:id/approve` | admin | Approve |
| P0 | POST | `/api/v1/admin/services/:id/reject` | admin | Reject with reason |
| P1 | PATCH | `/api/v1/admin/services/:id/availability` | admin | Pause/resume |
| P2 | DELETE | `/api/v1/admin/services/:id` | admin | Soft delete |
| P0 | GET | `/api/v1/admin/bookings` | admin | All bookings |
| P0 | GET | `/api/v1/admin/bookings/:id` | admin | Booking detail |
| P2 | PATCH | `/api/v1/admin/bookings/:id/status` | admin | Manual override |
| P0 | GET | `/api/v1/admin/payments` | admin | All payments |
| P0 | GET | `/api/v1/admin/payments/:id` | admin | Payment detail |
| P1 | GET | `/api/v1/admin/exports/:dataset` | admin | CSV export |
| P2 | GET | `/api/v1/admin/audit-logs` | admin | Admin action history |

### Payments / webhooks

| P | Method | Path | Access | Purpose |
|---|---|---|---|---|
| P0 | POST | `/api/v1/webhooks/stripe` | Stripe signature | Verify and record payment |
| P2 | POST | `/api/v1/payments/:id/refund` | admin | Refund |

### Notifications — optional

| P | Method | Path | Access | Purpose |
|---|---|---|---|---|
| P2 | GET | `/api/v1/notifications` | user | List |
| P2 | PATCH | `/api/v1/notifications/:id/read` | owner | Mark read |
| P2 | PATCH | `/api/v1/notifications/read-all` | user | Mark all read |

---

## 7. Frontend integration checklist

| File/component | Change |
|---|---|
| `src/lib/auth-client.ts` | Point to Express base URL; fix additional-field types |
| `src/lib/authz.ts` | Fetch session from Express with forwarded cookie |
| `src/app/api/auth/[...all]/route.ts` | Delete or proxy to Express |
| `src/app/api/avatar/*` | Move to Express or proxy |
| `src/app/services/page.tsx` | Query Express instead of `SERVICES` |
| `src/app/services/[id]/page.tsx` | Query Express; add booking form |
| `src/app/page.tsx` + home sections | Use DB-backed data |
| `src/components/customer/customer-bookings.tsx` | Call cancel API |
| `src/components/customer/customer-payments.tsx` | Use API data |
| `src/components/technician/add-service-form.tsx` | POST listing + upload cover |
| `src/components/technician/technician-services.tsx` | Availability/delete/edit APIs |
| `src/components/technician/technician-requests.tsx` | Transition APIs |
| `src/components/admin/admin-users.tsx` | Role/suspend/restore APIs |
| `src/components/admin/admin-service-approval.tsx` | Approve/reject APIs |
| `src/components/admin/admin-transactions.tsx` | API data |
| `src/components/dashboard/dashboard-shell.tsx` | Real counts from server, not static imports |
| `src/components/dashboard/profile-form.tsx` | Use Express auth update or `PATCH /me` |
| `src/app/dashboard/**/page.tsx` | Fetch real data; keep page guards |
| `src/lib/*-data.ts` | Keep as seed sources, then stop importing from pages |

### Suggested client mutation pattern

```ts
async function cancelBooking(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bookings/${id}/cancel`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.error?.message ?? "Could not cancel booking.");
  }

  router.refresh();
}
```

Keep the existing `initialBookings` / `initialServices` prop pattern so server components can provide the first render.

### Suggested server-side fetch helper

```ts
import { headers } from "next/headers";

export async function apiFetch<T>(path: string): Promise<T> {
  const cookie = (await headers()).get("cookie") ?? "";

  const response = await fetch(`${process.env.API_URL}${path}`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}
```

---

## 8. Acceptance scenario

The fullstack app is done when this works end to end:

1. Customer signs up.
2. Technician signs up.
3. Technician creates a service, saved as `pending`.
4. Admin approves it, and it appears on `/services`.
5. Customer opens the service and submits a booking request.
6. Technician sees the request, accepts, starts, and completes it with a final amount.
7. Customer sees `completed` + `unpaid` and pays through Stripe Checkout.
8. Stripe webhook marks the booking paid and creates exactly one payment.
9. Customer sees payment history and leaves a review.
10. Technician sees earnings.
11. Admin sees the booking, payment, and updated stats.
12. Refresh every page; all state is still there.
13. Try every action as the wrong role; all return `401`/`403`.
14. Try another user's booking ID; it returns `404`/`403`.
15. Replay the Stripe webhook; no duplicate payment is created.

---

## 9. Deferred decisions

- Object storage provider: S3 vs Cloudinary vs R2.
- Email notifications: provider and queue.
- Shared types: duplicate DTOs first, or create a shared package later.
- OpenAPI/Swagger generation.
- Test runner: the repo currently has none; add Vitest + Supertest in Phase 9 if desired.
- Analytics: database aggregations first; add a warehouse only if needed.
