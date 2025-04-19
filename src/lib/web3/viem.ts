import { createPublicClient, http } from "viem";
import { zeroNetwork } from "viem/chains";
import { zeroTestnet } from "./wagmi-config";

export const publicViemClient = createPublicClient({
  chain: import.meta.env.VITE_NETWORK === "zero" ? zeroNetwork : zeroTestnet,
  transport: http(),
});
