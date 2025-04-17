import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatEther } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { NETWORK_DATA } from "../constants/network-data";
import { CLNY_CONTRACT, GAME_MANAGER_CONTRACT, MC_CONTRACT } from "./contracts";

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

export const useLandsDetailsPaginate = (tokens: string[]) => {
  const { data: landsDetails, isLoading: isLoadingLandsDetails } = useReadContract({
    ...GAME_MANAGER_CONTRACT,
    functionName: "getAttributesMany",
    args: [tokens.map((token) => BigInt(token))],
  });

  return {
    landsDetails: landsDetails,
    isLoadingLandsDetails: isLoadingLandsDetails,
  };
};
