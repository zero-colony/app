import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt } from "viem/actions";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { GAME_MANAGER_CONTRACT, ZERO_COLONISTS_CONTRACT } from "~/lib/web3/contracts";
import { publicViemClient } from "~/lib/web3/viem";

const getAvatarRarity = async (avatarId: bigint) => {
  if (import.meta.env.VITE_NETWORK === "zero-testnet") {
    return 1;
  }

  console.log("🔍 Fetching avatar rarity...");
  let rarity = await publicViemClient.readContract({
    ...ZERO_COLONISTS_CONTRACT,
    functionName: "rarities",
    args: [avatarId],
  });
  console.log("💎 Initial rarity:", rarity);

  if (rarity === 0) {
    const start = Date.now();
    const TIMEOUT_MS = 30000;
    const INTERVAL_MS = 5000;

    while (Date.now() - start < TIMEOUT_MS) {
      console.log(`⌛ rarity still 0, retrying in ${INTERVAL_MS}ms…`);
      await new Promise((r) => setTimeout(r, INTERVAL_MS));

      rarity = await publicViemClient.readContract({
        ...ZERO_COLONISTS_CONTRACT,
        functionName: "rarities",
        args: [avatarId],
      });
      console.log("💎 Polled rarity:", rarity);

      if (rarity > 0) {
        console.log("✅ Rarity updated to", rarity);
        break;
      }
    }

    if (rarity === 0) {
      throw new Error("Cound't get rarity of new avatar, please reload the page");
    }
  }

  return rarity;
};

const useBuyAvatar = () => {
  const { address } = useAccount();

  const {
    data: avatarsCount,
    refetch: refetchAvatarsCount,
    isLoading: isLoadingAvatarsCount,
  } = useReadContract({
    ...ZERO_COLONISTS_CONTRACT,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  const { writeContractAsync } = useWriteContract();

  const { mutateAsync: buyAvatar, isPending: isPendingBuyAvatar } = useMutation({
    mutationFn: async () => {
      console.log("🚀 Starting buyColonist transaction...");
      const tx = await writeContractAsync({
        ...GAME_MANAGER_CONTRACT,
        functionName: "buyColonist",
      });
      console.log("✅ Buy colonist executed successfully!");

      console.log("🔍 Waiting for transaction receipt...");
      const receipt = await waitForTransactionReceipt(publicViemClient, {
        hash: tx,
      });
      console.log("✅ Transaction receipt:", receipt);

      console.log("🔍 Refreshing avatars count...");
      const { data: avatarsCount } = await refetchAvatarsCount();
      if (!avatarsCount) {
        console.error("❌ No avatars count returned!");
        return;
      }
      console.log("🧮 Got total avatars count:", avatarsCount);

      const lastIndex = avatarsCount - 1n;
      console.log("📊 Calculated last index:", lastIndex);

      console.log("🔍 Fetching avatar ID...");
      const avatarId = await publicViemClient.readContract({
        ...ZERO_COLONISTS_CONTRACT,
        functionName: "tokenOfOwnerByIndex",
        args: [address as `0x${string}`, lastIndex],
      });
      console.log("🆔 Got new avatar id:", avatarId);

      const rarity = await getAvatarRarity(avatarId);

      console.log("🔍 Fetching complete avatar data...");
      const [newAvatarsIds, newAvatarsProperties] = await publicViemClient.readContract({
        ...ZERO_COLONISTS_CONTRACT,
        functionName: "allTokensPaginate",
        args: [lastIndex, lastIndex],
      });

      const newAvatar = {
        id: newAvatarsIds[0],
        properties: {
          ...newAvatarsProperties[0],
          rarity,
        },
      };
      console.log("🎭 Fetched new avatar data:", newAvatar);

      return { avatarId, rarity, newAvatar };
    },
  });

  return {
    buyAvatar,
    isPendingBuyAvatar,
    avatarsCount,
    isLoading: isLoadingAvatarsCount,
  };
};

export default function Avatar() {
  const {
    buyAvatar,
    isPendingBuyAvatar,
    avatarsCount,
    isLoading: isLoadingAvatarsCount,
  } = useBuyAvatar();

  const handleBuyAvatar = async () => {
    try {
      const result = await buyAvatar();
      console.log("🎉 Avatar purchased successfully:", result);
    } catch (error) {
      console.error("❌ Error purchasing avatar:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={handleBuyAvatar}
        className="bg-primary rounded-xl p-5 font-bold text-black uppercase"
      >
        buy avatar
      </button>

      <div className="space-y-2">
        <pre>avatars count: {JSON.stringify(avatarsCount?.toString(), null, 2)}</pre>
        <pre>is loading avatars: {JSON.stringify(isLoadingAvatarsCount, null, 2)}</pre>
        <pre>is pending buy avatar: {JSON.stringify(isPendingBuyAvatar, null, 2)}</pre>
      </div>
    </div>
  );
}
