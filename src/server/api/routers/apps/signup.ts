import { TRPCError } from "@trpc/server";

import * as z from "zod";
import { eq, and } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users, apps } from "@/server/db/schema";

export const signupRouter = createTRPCRouter({
  email_password: publicProcedure
    .input(
      z.object({
        publicKey: z.string(),
        email: z.string(),
        password: z.string(),
        name: z.string().nullable(),
        surname: z.string().nullable(),
      }),
    )
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

      // adding user
      await ctx.db.insert(users).values({ appID: app.ID, ...input });
    }),
});
