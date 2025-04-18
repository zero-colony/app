import { ConnectKitProvider } from "connectkit";
import { zeroNetwork } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { wagmiConfig, zeroTestnet } from "~/lib/web3/wagmi-config";

// zeroNetwork
const connectKitOptions = {
  initialChainId:
    import.meta.env.VITE_NETWORK === "zero-testnet" ? zeroTestnet.id : zeroNetwork.id,
};

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <ConnectKitProvider options={connectKitOptions} mode="dark">
        {children}
      </ConnectKitProvider>
    </WagmiProvider>
  );
};
