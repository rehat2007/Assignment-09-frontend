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
    middleware/
      auth.ts                # requireUser / requireRole
      errors.ts              # error handler
    http/
      response.ts            # ok(), fail(), pagination()
    validation/
      auth.ts
      services.ts
      bookings.ts
      users.ts
      reviews.ts
    routes/
      catalog.ts
      bookings.ts
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
      stripe.ts
      storage.ts
  scripts/
    seed.ts
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

- [ ] Create `fix_mate_backend` with TypeScript, Express, MongoDB, Better Auth, Zod.
- [ ] Install backend dependencies.
- [ ] Copy/adapt `mongo.ts`, `auth.ts`, and `roles.ts`.
- [ ] Add `config/env.ts` validation.
- [ ] Mount Better Auth before `express.json()`.
- [ ] Add CORS with credentials and the exact frontend origin.
- [ ] Add `GET /api/v1/health` with a Mongo ping.
- [ ] Move `scripts/create-admin.ts` to the backend and repoint/remove the frontend `auth:admin` script.
- [ ] Move avatar upload to Express or add a temporary proxy.
- [ ] Update the sign-up and profile avatar fetches to the Express upload URL.
- [ ] Update Next `authClient` base URL.
- [ ] Update Next `authz.ts` to fetch the session from Express.
- [ ] Remove or proxy `src/app/api/auth/[...all]/route.ts`.
- [ ] Update Google OAuth callback URL, if Google is enabled.

### Backend dependencies

```bash
npm i express cors helmet zod mongodb better-auth @better-auth/mongo-adapter stripe
npm i -D typescript tsx @types/node @types/express @types/cors
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

- [ ] `GET http://localhost:4000/api/v1/health` returns `200`.
- [ ] `POST http://localhost:4000/api/auth/sign-up/email` creates a user.
- [ ] Next sign-up works.
- [ ] Next sign-in sets a cookie and redirects to `/dashboard`.
- [ ] Express `GET /api/auth/get-session` with that cookie returns the user.
- [ ] Next protected pages still redirect correctly.
- [ ] Sign-out works.
- [ ] Existing avatar upload still works after the auth move.

---

## Phase 1 — Collections, indexes, and seed data

**Goal:** MongoDB contains the real 15 services, technician profiles, and demo users. No endpoints beyond auth/health yet.

### Tasks

- [ ] Create `services`, `bookings`, `payments`, `reviews`, `technicianProfiles` collections.
- [ ] Add TypeScript types/DTOs for each.
- [ ] Add `ensureIndexes()`.
- [ ] Add `scripts/seed.ts`.
- [ ] Add `"seed": "tsx scripts/seed.ts"` to `package.json`.
- [ ] Seed demo users through `auth.api.signUpEmail` so passwords are hashed correctly.
- [ ] Seed technician profiles and admin role.
- [ ] Seed the 15 listings from `src/lib/services.ts`.
- [ ] Seed includes, warranty, and reviews from `src/lib/service-details.ts`.
- [ ] Optionally seed preview bookings/payments for demo dashboards.
- [ ] Run indexes once at seed/deploy time, not on every request.

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

- [ ] MongoDB has 15 services.
- [ ] Three technician users exist.
- [ ] `slug` is unique.
- [ ] Public services have `approval: "approved"` and `available: true`.
- [ ] Indexes exist.
- [ ] A small script can read 15 services from MongoDB with the shape the UI expects.

---

## Phase 2 — Shared API plumbing

**Goal:** Every endpoint has the same auth, validation, error, and pagination behavior.

### Tasks

- [ ] Add `ApiError`.
- [ ] Add response helpers: `ok()`, `fail()`, `paginated()`.
- [ ] Add Zod schemas for every request body and query.
- [ ] Add auth middleware.
- [ ] Add validation middleware.
- [ ] Add centralized error handler.
- [ ] Add request IDs and structured logs.
- [ ] Add pagination defaults:
  - Public catalog: 9
  - Dashboard tables: 20
  - Maximum: 100
- [ ] Add status code conventions.
- [ ] Add `GET /api/v1/me` (optional if the frontend reads `/api/auth/get-session` directly).
- [ ] Decide whether profile updates use Better Auth `/api/auth/update-user` or `PATCH /api/v1/me`. Do not implement both paths.

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

- [ ] No session → `401`.
- [ ] Wrong role → `403`.
- [ ] Invalid input → `400`/`422`.
- [ ] Not found → `404`.
- [ ] Invalid transition → `409`.
- [ ] Errors always use the same envelope.

---

## Phase 3 — Public catalog API and frontend switch

**Goal:** Public pages read from MongoDB through Express instead of static arrays.

### Endpoints

- [ ] `GET /api/v1/meta`
- [ ] `GET /api/v1/services`
- [ ] `GET /api/v1/services/:slug`
- [ ] `GET /api/v1/services/:slug/reviews`
- [ ] `GET /api/v1/home` (P1)
- [ ] `GET /api/v1/technicians/:id` (P1)

### Query parameters

```text
q, category, mode, sort=newest|price-asc|price-desc|rating, page, pageSize
```

### Frontend files

- `src/app/page.tsx` and home sections
- `src/app/services/page.tsx`
- `src/app/services/[id]/page.tsx`
- `src/lib/home-data.ts`
- `src/components/service-card.tsx` should keep its current shape

Keep `src/lib/service-styles.ts`; it is pure frontend styling.

### Caching

- Public catalog: revalidate/cache where appropriate.
- Dashboard data: `no-store`.

### Acceptance checks

- [ ] Search, category, mode, sort, and pagination still work through the URL.
- [ ] Unknown slug returns `404`.
- [ ] Only approved + available services appear.
- [ ] `/services/[id]` no longer imports `SERVICES` or `SERVICE_DETAILS`.
- [ ] The visual design is unchanged.

---

## Phase 4 — Booking creation and customer flows

**Goal:** A customer can request a repair, see it after refresh, and cancel it while `requested`.

### Endpoints

- [ ] `POST /api/v1/bookings`
- [ ] `GET /api/v1/bookings`
- [ ] `GET /api/v1/bookings/:id`
- [ ] `POST /api/v1/bookings/:id/cancel`
- [ ] `GET /api/v1/customer/overview`
- [ ] `GET /api/v1/customer/payments`
- [ ] `GET /api/v1/payments/:id`

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

- [ ] Add the missing booking form/modal on `/services/[id]`.
- [ ] Replace `CustomerBookings` local cancel state with the cancel endpoint.
- [ ] Replace `CustomerPayments` props with API data.
- [ ] Replace customer overview static imports with the overview endpoint.
- [ ] Add loading, empty, and error states.

### Acceptance checks

- [ ] New request appears for the correct customer, technician, and admin.
- [ ] Cancel only works while `requested`.
- [ ] Refresh preserves the booking.
- [ ] No price is accepted from the browser.
- [ ] Another customer cannot read the booking.

---

## Phase 5 — Technician listing and request flows

**Goal:** Technicians can manage their own listings and move assigned jobs through the workflow.

### Endpoints

- [ ] `GET /api/v1/technician/overview`
- [ ] `GET /api/v1/technician/services`
- [ ] `POST /api/v1/technician/services`
- [ ] `GET /api/v1/technician/services/:id`
- [ ] `PATCH /api/v1/technician/services/:id`
- [ ] `DELETE /api/v1/technician/services/:id`
- [ ] `PATCH /api/v1/technician/services/:id/availability`
- [ ] `GET /api/v1/technician/requests`
- [ ] `GET /api/v1/technician/requests/:id`
- [ ] `POST /api/v1/technician/requests/:id/accept`
- [ ] `POST /api/v1/technician/requests/:id/reject`
- [ ] `POST /api/v1/technician/requests/:id/start`
- [ ] `POST /api/v1/technician/requests/:id/complete`
- [ ] `GET /api/v1/technician/earnings` (P1)

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

- [ ] Wire `AddServiceForm` submit to `POST`.
- [ ] Add the missing edit-service form and wire `PATCH`.
- [ ] Wire availability toggle.
- [ ] Wire delete.
- [ ] Replace `TechnicianRequests` local status changes with API calls.
- [ ] Replace the completion `window.prompt` with a proper modal if possible.

### Acceptance checks

- [ ] A technician cannot modify another technician's listing or booking.
- [ ] Approved service edit removes it from public view until re-approved.
- [ ] Booking state transitions are enforced server-side.
- [ ] Completion stores the final amount exactly once.

---

## Phase 6 — Admin flows

**Goal:** Admin actions persist, are authorized, and are audited.

### Endpoints

- [ ] `GET /api/v1/admin/overview`
- [ ] `GET /api/v1/admin/users`
- [ ] `GET /api/v1/admin/users/:id`
- [ ] `PATCH /api/v1/admin/users/:id/role`
- [ ] `POST /api/v1/admin/users/:id/suspend`
- [ ] `POST /api/v1/admin/users/:id/restore`
- [ ] `GET /api/v1/admin/services`
- [ ] `GET /api/v1/admin/services/:id`
- [ ] `POST /api/v1/admin/services/:id/approve`
- [ ] `POST /api/v1/admin/services/:id/reject`
- [ ] `GET /api/v1/admin/bookings`
- [ ] `GET /api/v1/admin/bookings/:id`
- [ ] `GET /api/v1/admin/payments`
- [ ] `GET /api/v1/admin/payments/:id`
- [ ] `POST /api/v1/admin/users/:id/verify-technician` (P1)
- [ ] `GET /api/v1/admin/exports/:dataset` (P1)
- [ ] `GET /api/v1/admin/audit-logs` (P2)

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

- [ ] Replace `admin-users.tsx` local role/suspend state.
- [ ] Replace `admin-service-approval.tsx` local approval state.
- [ ] Replace `admin-transactions.tsx` props with API data.
- [ ] Pass real sidebar counts from the dashboard layout instead of importing preview arrays in `dashboard-shell.tsx`.

### Acceptance checks

- [ ] Admin changes persist after refresh.
- [ ] Admin cannot demote themselves.
- [ ] Suspended users cannot sign in.
- [ ] Non-admin requests to admin endpoints return `403`.
- [ ] Approve/reject cannot be applied twice to the same pending item.

---

## Phase 7 — Stripe payments

**Goal:** Customers pay completed jobs through Stripe; payments are recorded exactly once.

### Endpoints

- [ ] `POST /api/v1/bookings/:id/checkout`
- [ ] `POST /api/v1/webhooks/stripe`
- [ ] `GET /api/v1/payments/:id/invoice` (P1)

### Tasks

- [ ] Install `stripe` in the backend.
- [ ] Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
- [ ] Create Checkout Session from server-side `finalAmount`.
- [ ] Store `providerSessionId`.
- [ ] Verify webhook signature using the raw body.
- [ ] Handle `checkout.session.completed` and `payment_intent.succeeded`.
- [ ] Insert exactly one payment per booking.
- [ ] Mark booking paid only after webhook verification.
- [ ] Add idempotency unique indexes.

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

- [ ] Test card `4242 4242 4242 4242` creates one payment.
- [ ] Replaying the webhook does not create a duplicate.
- [ ] Refreshing the customer dashboard shows paid.
- [ ] Technician earnings include the paid amount.
- [ ] No client call can mark a booking paid.

---

## Phase 8 — Reviews and uploads

**Goal:** Customers can review paid jobs; images live in object storage.

### Endpoints

- [ ] `POST /api/v1/bookings/:id/review`
- [ ] `GET /api/v1/services/:slug/reviews`
- [ ] `GET /api/v1/me/reviews` (P2)
- [ ] `POST /api/v1/uploads/avatar`
- [ ] `POST /api/v1/uploads/service-cover`

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

- [ ] One review per paid booking.
- [ ] Service rating updates.
- [ ] Invalid rating/text rejected.
- [ ] Avatar and cover uploads work in production storage.
- [ ] Old local-disk route is no longer required.

---

## Phase 9 — Hardening and tests

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
  { key: { paidAt: -1 } },
  { key: { customerId: 1, paidAt: -1 } },
  { key: { technicianId: 1, paidAt: -1 } },
]);

reviews.createIndexes([
  { key: { bookingId: 1 }, unique: true },
  { key: { serviceId: 1, createdAt: -1 } },
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
| P0 | GET | `/api/v1/services/:slug/reviews` | public | Paginated reviews |
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
