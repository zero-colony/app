import { createFileRoute } from "@tanstack/react-router";
import { MarsGlobe } from "~/components/Mars";
import Sidebar from "~/components/Sidebar";
import { Wallet } from "~/components/Wallet";
import { useAllTokens } from "~/lib/web3/hooks";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { tokens } = useAllTokens();

  return (
    <div>
      <Sidebar />

      <MarsGlobe
        allTokens={tokens}
        myTokens={["5"]}
        balanceInWei={0}
        handleClaim={() => Promise.resolve()}
        currency="ETH"
      />

      {/* <div className="mx-auto aspect-square h-[100vh] w-[100vh] translate-y-[30vh] rounded-full bg-neutral-100/20"></div> */}

      <Wallet />
    </div>
  );
}
