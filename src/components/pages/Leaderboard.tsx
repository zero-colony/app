import { useAccount } from "wagmi";
import { useLeaderboard } from "~/lib/web3/hooks";
import LeaderboardItem from "../LeaderboardItem";

export default function Leaderboard() {
  const { address } = useAccount();
  const { leaderboard, isLeaderboardLoading } = useLeaderboard();

  const userPosition = leaderboard?.place || 0;
  const currentUser = address
    ? {
        position: userPosition,
        username: undefined,
        address: address.slice(0, 6) + "..." + address.slice(-4),
        amount: "0",
        isCurrentUser: true,
      }
    : null;

  return (
    <div className="flex flex-col gap-4">
      {currentUser && (
        <div className="flex flex-col rounded-lg border border-[#FF2E58]/20 bg-[#FF2E58]/5 px-4">
          <LeaderboardItem
            position={currentUser.position}
            username={currentUser.username}
            address={currentUser.address}
            amount={currentUser.amount}
            isCurrentUser={true}
          />
        </div>
      )}

      <div className="overflow-y-auto">
        <div className="flex flex-col rounded-lg border border-white/10 bg-white/5 px-3 pt-1">
          {isLeaderboardLoading ? (
            <div className="py-4 text-center text-white/60">Loading leaderboard...</div>
          ) : (
            leaderboard?.top100.map((item, index) => (
              <LeaderboardItem
                key={index}
                position={index + 1}
                address={item.address.slice(0, 6) + "..." + item.address.slice(-4)}
                amount={item.amount.toFixed(2)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
