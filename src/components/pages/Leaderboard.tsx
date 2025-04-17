import LeaderboardItem from "../LeaderboardItem";

const mockLeaderboardData = Array.from({ length: 13 }, (_, i) => ({
  position: i + 1,
  username: i % 3 === 0 ? undefined : "ket-near.eth",
  address: "0x23cfb...4ae7",
  amount: "10559.92",
}));

export default function Leaderboard() {
  // Add current user to positions (in this case position 433)
  const currentUserPosition = 433;
  const currentUser = {
    position: currentUserPosition,
    username: "ket-near.eth",
    address: "0x23cfb...4ae7",
    amount: "10559.92",
    isCurrentUser: true,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col rounded-lg border border-[#FF2E58]/20 bg-[#FF2E58]/5 px-4">
        <LeaderboardItem
          position={currentUser.position}
          username={currentUser.username}
          address={currentUser.address}
          amount={currentUser.amount}
          isCurrentUser={true}
        />
      </div>

      <div className="overflow-y-auto">
        <div className="flex flex-col rounded-lg border border-white/10 bg-white/5 px-3 pt-1">
          {mockLeaderboardData.map((item) => (
            <LeaderboardItem
              key={item.position}
              position={item.position}
              username={item.username}
              address={item.address}
              amount={item.amount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
