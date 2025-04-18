import React from "react";
import { useCollectAll, useMyLands, useTotalEarning } from "~/lib/web3/hooks";

const YourLandsHeader: React.FC = () => {
  const { myLands } = useMyLands();
  const { earnSpeed, earnedAmount, isLoadingEarnedAmount } = useTotalEarning();
  const { claimEarned, isClaimingEarned } = useCollectAll();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="font-['Montserrat'] text-[21px] font-semibold text-white uppercase">
          Your Lands: {myLands?.length}
        </h2>
        <p className="bg-gradient-to-r from-[#C7C7C7] to-[#616161] bg-clip-text font-['Montserrat'] text-sm font-medium text-transparent">
          {isLoadingEarnedAmount || !earnedAmount || !earnSpeed
            ? "Loading..."
            : `${earnedAmount} CLNY earned | ${earnSpeed} CLNY/day`}
        </p>
      </div>

      <button
        className="flex h-[44px] w-[143px] cursor-pointer items-center justify-center rounded-lg bg-[#FF2E58] px-4 py-3.5 backdrop-blur-[34px] disabled:opacity-50"
        onClick={claimEarned}
        disabled={isClaimingEarned}
      >
        <span className="text-xs font-bold text-white uppercase">
          {isClaimingEarned ? "Collecting..." : "Collect All"}
        </span>
      </button>
    </div>
  );
};

export default YourLandsHeader;
