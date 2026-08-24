import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { SignUpSchema } from "@/schemas/auth";
import { schema } from "@/db/schema/auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const result = SignUpSchema.safeParse(ctx.body);

        if (!result.success) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid sign-up details",
          });
        }
      }
    }),
  },
  plugins: [nextCookies()],
});
