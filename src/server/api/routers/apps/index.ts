import { createTRPCRouter } from "@/server/api/trpc";

import { signupRouter } from "./signup";

export const appsRouter = createTRPCRouter({
  signup: signupRouter,
});
