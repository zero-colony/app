/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        throw new Error("No avatars count returned!");
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
const useAvatarsCount = () => {
  const { address } = useAccount();

  const { data: avatarsCount, isLoading: isLoadingAvatarsCount } = useReadContract({
    ...ZERO_COLONISTS_CONTRACT,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      staleTime: Infinity,
    },
  });

  return { avatarsCount, isLoadingAvatarsCount };
};

const useAvatarsPaginate = (fromIndex?: bigint, toIndex?: bigint) => {
  const {
    data: avatars,
    isLoading: isInitialLoading,
    isFetching: isBackgroundFetching,
    queryKey,
  } = useReadContract({
    ...ZERO_COLONISTS_CONTRACT,
    functionName: "allTokensPaginate",
    args: [fromIndex ?? 0n, toIndex ?? 0n],
    query: {
      enabled: fromIndex !== undefined && toIndex !== undefined,
      staleTime: Infinity,
    },
  });

  // We only want to show "Loading…" if we have no data at all yet
  const isLoadingAvatars = isInitialLoading && !avatars;

  if (isLoadingAvatars) {
    console.log("🔄 Initial load avatars from", fromIndex, "to", toIndex);
  } else {
    console.log("🎭 Got avatars:", avatars?.[0]?.length ?? 0);
  }

  return { avatars, isLoadingAvatars, isBackgroundFetching, queryKey };
};

import { useEffect, useMemo, useState } from "react";
import { Pagination } from "../Pagination";

export function useAvatarsPagination(itemsPerPage = 9) {
  const { avatarsCount, isLoadingAvatarsCount } = useAvatarsCount();
  const count = avatarsCount ?? 0n;

  // compute total pages
  const totalPages = useMemo(() => {
    if (count === 0n) return 0;
    return Math.ceil(Number(count) / itemsPerPage);
  }, [count, itemsPerPage]);

  const [currentPage, setCurrentPage] = useState(0);
  const isEmpty = !isLoadingAvatarsCount && count === 0n;

  // NEW: for reversed pagination we compute
  // endIndex = (count - 1) - currentPage*itemsPerPage
  // startIndex = max(0, endIndex - itemsPerPage + 1)
  const endIndex = useMemo(() => {
    if (count === 0n) return 0n;
    const idx = count - 1n - BigInt(currentPage) * BigInt(itemsPerPage);
    return idx >= 0n ? idx : 0n;
  }, [count, currentPage, itemsPerPage]);

  const startIndex = useMemo(() => {
    const candidate = endIndex - BigInt(itemsPerPage) + 1n;
    return candidate >= 0n ? candidate : 0n;
  }, [endIndex, itemsPerPage]);

  // fetch ascending between startIndex … endIndex, then reverse locally
  const {
    avatars: rawAvatars,
    isLoadingAvatars,
    isBackgroundFetching,
    queryKey,
  } = useAvatarsPaginate(
    isEmpty ? undefined : startIndex,
    isEmpty ? undefined : endIndex,
  );

  // once fetched, flip them so highest-ID is first in the page
  const avatars = useMemo(() => {
    if (!rawAvatars) return rawAvatars;
    // rawAvatars is [ids[], data[]]
    const [ids, metas] = rawAvatars;
    return [ids.slice().reverse(), metas.slice().reverse()] as const;
  }, [rawAvatars]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    // reset to "newest" page on total-count change
    setCurrentPage(0);
  }, [count]);

  return {
    currentPage,
    totalPages,
    avatars,
    avatarsCount,
    isLoadingAvatarsCount,
    isLoadingAvatars,
    isEmpty,
    isBackgroundFetching,
    handlePageChange,
    queryKey,
  };
}

export default function Avatar() {
  const { buyAvatar, isPendingBuyAvatar } = useBuyAvatar();
  const {
    currentPage,
    totalPages,
    avatars,
    avatarsCount,
    isLoadingAvatarsCount,
    isLoadingAvatars, // our “initial only” loading flag
    isEmpty,
    handlePageChange,
    queryKey,
  } = useAvatarsPagination();

  const qc = useQueryClient();

  const handleBuyAvatar = async () => {
    try {
      const result = await buyAvatar();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      qc.setQueryData(queryKey, (old: any) => {
        if (!old) return [[result.newAvatar.id], [result.newAvatar.properties]];
        return [
          [...old[0], result.newAvatar.id],
          [...old[1], result.newAvatar.properties],
        ];
      });
    } catch (error) {
      console.error("❌ Error purchasing avatar:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={handleBuyAvatar}
        disabled={isPendingBuyAvatar}
        className="bg-primary rounded-xl p-5 font-bold text-black uppercase"
      >
        {isPendingBuyAvatar ? "Buying…" : "Buy Avatar"}
      </button>

      <div className="space-y-2">
        <pre>avatars count: {avatarsCount?.toString() ?? "–"}</pre>
        <pre>loading count: {JSON.stringify(isLoadingAvatarsCount)}</pre>
        <pre>pending buy: {JSON.stringify(isPendingBuyAvatar)}</pre>
      </div>

      <div className="space-y-8">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-white/70">No avatars yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(isLoadingAvatarsCount || isLoadingAvatars) && (
                <p className="col-span-full text-center text-white/70">
                  Loading avatars…
                </p>
              )}
              {!isLoadingAvatarsCount &&
                !isLoadingAvatars &&
                avatars &&
                avatars[0].map((id, idx) => (
                  <AvatarCard
                    key={id.toString()}
                    avatarId={id}
                    properties={avatars[1][idx]}
                  />
                ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

function AvatarCard({
  avatarId,
  properties,
}: {
  avatarId: bigint;
  properties: {
    rarity: number;
    profession: number;
    lastAttackTime: bigint;
    owner: string;
  };
}) {
  const getProfessionName = (profession: number) => {
    const professions = ["Miner", "Farmer", "Builder", "Hunter", "Scientist"];
    return professions[profession] || "Unknown";
  };

  const getRarityName = (rarity: number) => {
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
    return rarities[rarity] || "Unknown";
  };

  const getRarityColor = (rarity: number) => {
    const colors = {
      0: "text-gray-200", // Common
      1: "text-green-400", // Uncommon
      2: "text-blue-400", // Rare
      3: "text-purple-400", // Epic
      4: "text-yellow-400", // Legendary
    };
    return colors[rarity as keyof typeof colors] || "text-gray-200";
  };

  return (
    <div className="flex flex-col rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold">#{avatarId.toString()}</span>
        <span className={`${getRarityColor(properties.rarity)} font-medium`}>
          {getRarityName(properties.rarity)}
        </span>
      </div>

      <div className="flex h-32 w-full items-center justify-center rounded bg-white/5">
        <span className="text-5xl">👤</span>
      </div>

      <div className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-white/70">Class:</span>
          <span className="font-medium">{getProfessionName(properties.profession)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/70">Last Active:</span>
          <span className="font-medium">
            {properties.lastAttackTime > 0
              ? new Date(Number(properties.lastAttackTime) * 1000).toLocaleDateString()
              : "Never"}
          </span>
        </div>
      </div>
    </div>
  );
}
