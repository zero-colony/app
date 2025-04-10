import { createFileRoute } from "@tanstack/react-router";
import { MarsGlobe } from "~/components/Mars";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <MarsGlobe
        allTokens={["5", "10"]}
        myTokens={["5"]}
        balanceInWei={0}
        handleClaim={() => Promise.resolve()}
        currency="ETH"
      />
    </div>
  );
}
