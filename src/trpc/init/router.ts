import { marsRouter } from "../mars";
import { createTRPCRouter } from "./init";

export const trpcRouter = createTRPCRouter({
  post: marsRouter,
});
export type TRPCRouter = typeof trpcRouter;
