import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users, apps } from "@/server/db/schema";
import { PasswordEmailSignUpSchema } from "@/schemas";

import bcrypt from "bcrypt";
import { env } from "@/env";

export const signupRouter = createTRPCRouter({
  email_password: publicProcedure
    .input(PasswordEmailSignUpSchema)
    .mutation(async ({ ctx, input }) => {
      // querying app
      const app = await ctx.db.query.apps.findFirst({
        where: eq(apps.publicKey, input.publicKey),
      });

      if (app === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Could not find application with public key ${input.publicKey}`,
        });
      }

      // querying existing emails in app
      const existing = await ctx.db.query.users.findFirst({
        where: and(eq(users.appID, app.ID), eq(users.email, input.email)),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "email already in use",
        });
      }

      // encrypting password
      input.password = await bcrypt.hash(input.password, env.SALT_ROUNDS);

      // adding user
      await ctx.db.insert(users).values({ appID: app.ID, ...input });
    }),
});
