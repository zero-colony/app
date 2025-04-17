import React from "react";
import { BuildingConfig } from "~/lib/utils/buildings";
import { useCLNYBalance, useUpgradeBuilding } from "~/lib/web3/hooks";

interface BuildingProps extends BuildingConfig {
  currentLevel?: number;
  landId: string;
}

const Building: React.FC<BuildingProps> = (props: BuildingProps) => {
  const {
    title,
    maxLevel,
    getPrice,
    getReward,
    getIsFullyUpgraded,
    getRewardIncrease,
    currentLevel = 0,
    key,
    landId,
  } = props;

  const { upgrade, isLoading } = useUpgradeBuilding(landId, props, currentLevel);

  const { clnyBalance } = useCLNYBalance();
  const isFullyBuilt = getIsFullyUpgraded(currentLevel);
  const nextLevel = currentLevel + 1;
  const dailyOutput =
    currentLevel > 0 ? `${getReward(currentLevel)} CLNY/day` : "0 CLNY/day";
  const reward =
    nextLevel <= maxLevel ? `+${getRewardIncrease(currentLevel)} CLNY/day` : "";
  const cost = nextLevel <= maxLevel ? `${getPrice(nextLevel)} CLNY` : "";
  const isAffordable = Number(clnyBalance) >= getPrice(nextLevel);

  return (
    <div className="flex w-full flex-col justify-center gap-2 rounded-xl p-3">
      <div className="flex w-full flex-col items-center justify-center gap-1.5">
        <div className="flex w-full flex-col items-center justify-center gap-1">
          <span className="text-xs font-semibold text-white uppercase">{title}</span>
          <div className="flex items-center justify-center rounded bg-white/10 px-2 py-1">
            <span className="text-[10px] leading-tight text-white">{dailyOutput}</span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-1">
        {isLoading ? (
          <div className="flex h-9 w-full flex-row items-center justify-center gap-1.5 rounded-lg border border-[#959595] bg-[#959595]/10 py-2.5">
            <span className="text-[10px] leading-tight font-bold text-[#959595] uppercase">
              Upgrading...
            </span>
          </div>
        ) : isFullyBuilt ? (
          <div className="flex h-9 w-full flex-row items-center justify-center gap-1.5 rounded-lg border border-[#959595] bg-[#959595]/10 py-2.5">
            <span className="text-[10px] leading-tight font-bold text-[#959595] uppercase">
              Fully Built
            </span>
          </div>
        ) : !isAffordable ? (
          <div className="flex h-9 w-full flex-col items-center justify-center gap-0.5 rounded-lg border border-[#959595] bg-[#959595]/10 py-2.5">
            <span className="text-[10px] leading-tight font-bold text-[#959595] uppercase">
              Get LVL {nextLevel}
            </span>
            <span className="text-[10px] leading-tight text-[#959595]">For {cost}</span>
          </div>
        ) : (
          <button
            onClick={upgrade}
            className="flex h-9 w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-[#FF2E58] bg-[#FF2E58]/10 py-2.5"
          >
            <span className="text-[10px] leading-tight font-bold text-[#FF2E58] uppercase">
              {key === "baseStation" ? "Get" : `Get LVL ${nextLevel}`}
            </span>
            <span className="text-[10px] leading-tight text-[#FF2E58]">
              For <span>{cost}</span>
            </span>
          </button>
        )}

        <span className="mt-0.5 h-[12.5px] text-[10px] leading-tight text-white/50">
          {reward}
        </span>
      </div>
    </div>
  );
};

export default Building;
