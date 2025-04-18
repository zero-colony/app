interface LeaderboardItemProps {
  position: number;
  username?: string;
  address: string;
  amount: string;
  isCurrentUser?: boolean;
}

export default function LeaderboardItem({
  position,
  username,
  address,
  amount,
  isCurrentUser = false,
}: LeaderboardItemProps) {
  return (
    <div
      className={`flex w-full items-center justify-between border-b border-white/5 py-4 ${isCurrentUser ? "border-[#FF2E58]/20 bg-[#FF2E58]/5" : ""}`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`text-sm ${isCurrentUser ? "text-[#FF2E58]" : "text-[#838383]"}`}
        >
          {isCurrentUser ? `#${position} (You)` : `#${position}`}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">{username || address}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#FF2E58] uppercase">{amount} CLNY</span>
        <div className="h-5 w-5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667"
              stroke="#838383"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.5 2.5H17.5V7.5"
              stroke="#838383"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.33334 11.6667L17.5 2.5"
              stroke="#838383"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
