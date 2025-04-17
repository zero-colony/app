import { useMemo } from "react";
import { formatEther } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { NETWORK_DATA } from "../constants/network-data";

const CLNY_CONTRACT = {
  address: NETWORK_DATA.CLNY as `0x${string}`,
  abi: [
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "balance", type: "uint256" }],
    },
  ],
};

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
