import { createFileRoute } from "@tanstack/react-router";
import { MarsGlobe } from "~/components/Mars";
import Sidebar from "~/components/Sidebar";
import { Wallet } from "~/components/Wallet";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <Sidebar />

      <MarsGlobe
        allTokens={["5", "10"]}
        myTokens={["5"]}
        balanceInWei={0}
        handleClaim={() => Promise.resolve()}
        currency="ETH"
      />

      <Wallet />
    </div>
  );
}
