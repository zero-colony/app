import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useCLNYBalance, useEthBalance } from "../lib/web3/hooks";
import { ConnectButton } from "./ConnectButton";
import { WalletIcon } from "./svg/Wallet";

export const Wallet = () => {
  const { isConnected, address, isReconnecting, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const [isHovering, setIsHovering] = useState(false);

  const { clnyBalance } = useCLNYBalance();
  const { ethBalance } = useEthBalance();

  if (!isConnected && !isReconnecting && !isConnecting) {
    return (
      <div className="absolute top-14 flex w-full items-center justify-center px-4 sm:top-3.5 sm:right-3.5 sm:w-auto sm:translate-x-0 sm:items-end sm:!justify-end sm:px-0">
        <ConnectButton className="w-full" />
      </div>
    );
  }

  const balances = {
    CLNY: clnyBalance || "0.00",
    ETH: ethBalance || "0.000",
  };

  const logos = {
    CLNY: <img src="/images/clny.png" className="h-4 w-4" alt="CLNY" />,
    ETH: <img src="/images/eth.svg" className="h-4 w-4" alt="ETH" />,
  };

  const formattedWallet = address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "";
  const mobileFormattedWallet = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div className="absolute top-14 flex w-full items-center justify-center sm:top-3.5 sm:right-3.5 sm:translate-x-0 sm:items-end sm:!justify-end">
      <div className="rounded-lg border border-white/10 bg-black/20 text-white backdrop-blur-[30px]">
        <div className="flex divide-x divide-white/10 text-sm font-medium">
          {Object.entries(balances).map(([token, balance]) => (
            <div className="flex items-center gap-2 px-4 py-3.5" key={token}>
              {logos[token as keyof typeof logos]}
              <div className="whitespace-nowrap">
                <span>{balance}</span> <span>{token}</span>
              </div>
            </div>
          ))}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex cursor-pointer items-center gap-2 rounded-r-[7px] px-4 py-3.5 hover:bg-white/10"
                onClick={() => disconnect()}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <WalletIcon className="text-primary h-4 w-4" />
                {isHovering ? (
                  <span>Disconnect</span>
                ) : (
                  <>
                    <span className="hidden sm:block">{formattedWallet}</span>
                    <span className="block sm:hidden">{mobileFormattedWallet}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
