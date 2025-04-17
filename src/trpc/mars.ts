import { TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { publicProcedure } from "./init/init";

export const marsRouter = {
  getMyRaids: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
      }),
    )
    .query(({ input }) => {
      // {}

      return {
        attacker: "0x",
        defender: "0x",
        landId: 1,
        CLNYDelta: 2,
      };
    }),
} satisfies TRPCRouterRecord;
