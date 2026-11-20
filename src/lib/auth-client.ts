import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

// Auth now runs on the Express API, so the browser talks to that origin
// directly. Cookies are shared across ports on the same host in local dev.
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    // Keep the additional-field types in sync with fix_mate_back_end/src/auth.ts.
    // Do not import the Express server module into the browser bundle.
    inferAdditionalFields({
      user: {
        accountType: {
          type: "string",
          required: false,
          defaultValue: "customer",
          input: true,
        },
        phone: { type: "string", required: false, input: true },
        area: { type: "string", required: false, input: true },
        bio: { type: "string", required: false, input: true },
      },
    }),
    adminClient(),
  ],
});
