import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { formatEther, zeroAddress } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { NETWORK_DATA } from "../constants/network-data";
import { CLNY_CONTRACT, GAME_MANAGER_CONTRACT, MC_CONTRACT } from "./contracts";
// ~/lib/web3/hooks/useUpgradeBuilding.ts
import { toast } from "sonner";
import { proxy, useSnapshot } from "valtio";
import { useWriteContract } from "wagmi";
import { BuildingConfig } from "~/lib/utils/buildings";
import { createBatches } from "../utils/batches";

const marsSharedActions = proxy({
  refetchLandsDetails: () => {},
  setRefetchLandsDetails: (refetchLandsDetails: () => void) => {
    marsSharedActions.refetchLandsDetails = refetchLandsDetails;
  },
  resetEarnedLandsDetails: () => {},
  setResetEarnedLandsDetails: (resetEarnedLandsDetails: () => void) => {
    marsSharedActions.resetEarnedLandsDetails = resetEarnedLandsDetails;
  },
});

export const useCLNYBalance = () => {
  const { address } = useAccount();

  const { data: clnyBalanceWei, refetch: refetchCLNYBalance } = useReadContract({
    ...CLNY_CONTRACT,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  const clnyBalance = useMemo(() => {
    if (!clnyBalanceWei) return undefined;
    return Number(formatEther(clnyBalanceWei as bigint)).toFixed(2);
  }, [clnyBalanceWei]);

  return { clnyBalanceWei, clnyBalance, refetchCLNYBalance };
};

export const useEthBalance = () => {
  const { address } = useAccount();
  const {
    data: ethBalanceWei,
    isLoading: isEthBalanceLoading,
    refetch: refetchEthBalance,
  } = useBalance({
    address,
  });

  const ethBalance = useMemo(() => {
    if (!ethBalanceWei) return undefined;
    return Number(formatEther(ethBalanceWei.value)).toFixed(3);
  }, [ethBalanceWei]);

  return {
    ethBalance,
    ethBalanceWei: ethBalanceWei?.value,
    refetchEthBalance,
    isEthBalanceLoading,
  };
};

export const useAllTokens = () => {
  const fetchTokens = async (): Promise<string[]> => {
    if (NETWORK_DATA.SOLDOUT) {
      return new Array(21000).fill("").map((_, index) => index.toString());
    }
    try {
      const response = await fetch(NETWORK_DATA.LAND_META);
      const result = (await response.json()) as string[];
      return result.map((o) => `${o}`);
    } catch {
      return [];
    }
  };

  const {
    data: tokens = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
  });

  return { tokens, isLoading, isError, error, refetch };
};

export const useMyLands = () => {
  const { address } = useAccount();

  const {
    data: myLands,
    refetch: refetchMyLands,
    isLoading: isLoadingMyLands,
  } = useReadContract({
    ...MC_CONTRACT,
    functionName: "allMyTokens",
    account: address as `0x${string}`,
    query: {
      select: (data) => {
        if (!data) return [];
        return data.map((token) => token.toString());
      },
    },
  });

  const hasNoLands = useMemo(() => {
    return myLands?.length === 0 || (!myLands && !isLoadingMyLands);
  }, [myLands, isLoadingMyLands]);

  return {
    myLands: myLands,
    refetchMyLands: refetchMyLands,
    isLoadingMyLands: isLoadingMyLands,
    hasNoLands: hasNoLands,
  };
};

export const useLandsDetails = (tokens: string[]) => {
  const { setRefetchLandsDetails, setResetEarnedLandsDetails } =
    useSnapshot(marsSharedActions);
  const {
    data: landsDetails,
    isLoading: isLoadingLandsDetails,
    refetch: refetchLandsDetails,
    queryKey,
  } = useReadContract({
    ...GAME_MANAGER_CONTRACT,
    functionName: "getAttributesMany",
    args: [tokens.map((token) => BigInt(token))],
  });

  const qc = useQueryClient();

  useEffect(() => {
    const resetEarnedLandsDetails = () => {
      qc.setQueryData(
        queryKey,
        (
          data: readonly {
            speed: bigint;
            earned: bigint;
            baseStation: number;
            transport: number;
            robotAssembly: number;
            powerProduction: number;
          }[],
        ) => {
          if (!data) return data;

          // Reset each land's earned value while preserving other properties
          return data.map((land) => ({
            ...land,
            earned: BigInt(0),
          }));
        },
      );
    };

    setRefetchLandsDetails(refetchLandsDetails);
    setResetEarnedLandsDetails(resetEarnedLandsDetails);
  }, [
    qc,
    queryKey,
    refetchLandsDetails,
    setRefetchLandsDetails,
    setResetEarnedLandsDetails,
  ]);

  return {
    landsDetails: landsDetails,
    isLoadingLandsDetails: isLoadingLandsDetails,
  };
};

export const useUpgradeBuilding = ({
  landId,
  building,
  currentLevel,
}: {
  landId: string;
  building: BuildingConfig;
  currentLevel: number;
}) => {
  const nextLevel = currentLevel + 1;

  const { refetchCLNYBalance } = useCLNYBalance();
  const { refetchLandsDetails } = useSnapshot(marsSharedActions);

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onError(error: Error) {
        toast.error(error.message);
      },
      onSuccess() {
        toast.success(`${building.title} upgraded to level ${nextLevel}!`);
        refetchCLNYBalance();
        refetchLandsDetails();
      },
    },
  });

  async function upgrade() {
    const args = building.contract.getArgs(landId, nextLevel);
    writeContract({
      ...GAME_MANAGER_CONTRACT,
      functionName: building.contract.method,
      args: args as [bigint, number],
    });
  }

  return {
    upgrade,
    isLoading: isPending,
  };
};

export const useTotalEarning = () => {
  const { myLands: myTokens } = useMyLands();

  const {
    data,
    isLoading: isLoadingEarnedAmount,
    refetch: refetchEarnedAmount,
    error: errorEarnedAmount,
    queryKey,
  } = useReadContract({
    ...GAME_MANAGER_CONTRACT,
    functionName: "getEarningData",
    // @ts-expect-error it's ok bro, everything is a string
    args: [myTokens?.map((token) => token.toString()) ?? []],
    query: {
      enabled: !!myTokens,
    },
  });

  const qc = useQueryClient();

  const resetEarnedAmount = () => {
    qc.setQueryData(queryKey, (data: readonly [bigint, bigint] | undefined) => {
      if (!data) return data;
      // Keep the earning speed (data[1]) but reset the earned amount (data[0]) to 0
      return [BigInt(0), data[1]];
    });
  };

  const earnedAmountWei = useMemo(() => {
    if (!data) return undefined;
    return data[0] ?? 0n;
  }, [data]);

  const earnedAmount = useMemo(() => {
    if (earnedAmountWei === 0n) return (0).toString();
    if (!earnedAmountWei) return undefined;
    return Number(formatEther(earnedAmountWei)).toFixed(2);
  }, [earnedAmountWei]);

  const earnSpeed = useMemo(() => {
    if (!data) return undefined;
    return data[1];
  }, [data]);

  return {
    earnedAmountWei,
    earnedAmount,
    earnSpeed,
    isLoadingEarnedAmount,
    errorEarnedAmount,
    refetchEarnedAmount,
    resetEarnedAmount,
  };
};

export const useCollectAll = () => {
  const { refetchCLNYBalance } = useCLNYBalance();
  const { resetEarnedAmount } = useTotalEarning();
  const { resetEarnedLandsDetails } = useSnapshot(marsSharedActions);

  const { writeContractAsync, isPending: isClaimingEarned } = useWriteContract({
    mutation: {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Earnings claimed successfully");
        resetEarnedAmount();
        refetchCLNYBalance();
        resetEarnedLandsDetails();
      },
    },
  });
  const { myLands: myTokens } = useMyLands();

  const claimEarned = async () => {
    if (!myTokens) return;

    const batches = createBatches(myTokens, 50);

    for (const batch of batches) {
      await writeContractAsync({
        ...GAME_MANAGER_CONTRACT,
        functionName: "claimEarned",
        // @ts-expect-error it's ok bro, everything is a string
        args: [batch.map((token) => token.toString())],
      });
    }
  };

  return { claimEarned, isClaimingEarned };
};

type LeaderboardResponse = {
  top100: {
    address: string;
    amount: number;
    updatedAt: string;
  }[];
  place: number;
};

export const useLeaderboard = () => {
  const { address } = useAccount();

  const { data: leaderboard, isLoading: isLeaderboardLoading } =
    useQuery<LeaderboardResponse>({
      queryKey: ["leaderboard", address],
      queryFn: async () => {
        const requestAddress = (address as string) ?? zeroAddress;

        const rawResponse = await fetch(
          `${NETWORK_DATA.LAND_META_SERVER}leaderboard/${requestAddress}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );

        return rawResponse.json();
      },
    });

  return { leaderboard, isLeaderboardLoading };
};
