import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoDb } from "./mongo";

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const trustedOrigins = Array.from(
  new Set([baseURL, "http://localhost:3000", "http://127.0.0.1:3000"]),
);

export const auth = betterAuth({
  appName: "FixMate",
  baseURL,
  trustedOrigins,
  // No `client` option: works with standalone MongoDB and Atlas alike.
  database: mongodbAdapter(mongoDb),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: googleProvider,
  user: {
    additionalFields: {
      // Customer vs technician. Admin access comes from Better Auth's admin
      // plugin `role`, which clients cannot set during public sign-up.
      accountType: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requested = (user as { accountType?: unknown }).accountType;

          return {
            data: {
              ...user,
              // Never trust the submitted value beyond these two account types.
              accountType: requested === "technician" ? "technician" : "customer",
            },
          };
        },
      },
    },
  },
  plugins: [admin()],
});
