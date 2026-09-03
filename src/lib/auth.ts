import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { SignUpSchema } from "@/schemas/auth";
import { schema } from "@/db/schema/auth";
import { Resend } from "resend";
import { after } from "next/server";

const RESET_TOKEN_EXPIRATION = 3600;

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      after(async () => {
        const { error } = await resend.emails.send({
          from: process.env.AUTH_EMAIL_FROM!,
          to: user.email,
          template: {
            id: "password-reset",
            variables: {
              expiration_time: `${RESET_TOKEN_EXPIRATION / 60} minutes`,
              user_name: user.name,
              reset_password_url: url,
            },
          },
        });

        if (error) {
          console.error("Password reset email failed", error);
        }
      });
    },
    resetPasswordTokenExpiresIn: RESET_TOKEN_EXPIRATION,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      after(async () => {
        const { error } = await resend.emails.send({
          from: process.env.AUTH_EMAIL_FROM!,
          to: user.email,
          template: {
            id: "verify-email",
            variables: {
              user_name: user.name,
              verification_url: url,
            },
          },
        });

        if (error) {
          console.error("Verification email failed", error);
        }
      });
    },
  },
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
