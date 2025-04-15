import React from "react";

interface BuildingProps {
  title?: string;
  dailyOutput?: string;
  reward?: string;
  cost?: string;
  isBuilt?: boolean;
  level?: number;
}

const Building: React.FC<BuildingProps> = ({
  title = "Electricity",
  dailyOutput = "0 CLNY/day",
  reward = "+2 CLNY/Day",
  cost = "30 CLNY",
  isBuilt = false,
  level,
}) => {
  return (
    <div className="flex w-full flex-col justify-center gap-2 rounded-xl p-3">
      {/* Building Title and Output Section */}
      <div className="flex w-full flex-col items-center justify-center gap-1.5">
        <div className="flex w-full flex-col items-center justify-center gap-1">
          <span className="text-xs font-semibold text-white uppercase">{title}</span>
          <div className="flex items-center justify-center rounded bg-white/10 px-2 py-1">
            <span className="text-[10px] leading-tight text-white">{dailyOutput}</span>
          </div>
        </div>
      </div>

      {/* Purchase Section */}
      <div className="flex w-full flex-col items-center justify-center gap-1">
        {isBuilt ? (
          <div className="flex h-9 w-full flex-row items-center justify-center gap-1.5 rounded-lg border border-[#959595] bg-[#959595]/10 py-2.5">
            <span className="text-[10px] leading-tight font-bold text-[#959595] uppercase">
              Fully Built
            </span>
          </div>
        ) : level ? (
          <div className="flex h-9 w-full flex-col items-center justify-center gap-0.5 rounded-lg border border-[#959595] bg-[#959595]/10 py-2.5">
            <span className="text-[10px] leading-tight font-bold text-[#959595] uppercase">
              Get LVL {level}
            </span>
            <span className="text-[10px] leading-tight text-[#959595]">For {cost}</span>
          </div>
        ) : (
          <div className="flex h-9 w-full flex-col items-center justify-center gap-0.5 rounded-lg border border-[#FF2E58] bg-[#FF2E58]/10 py-2.5">
            <span className="text-[10px] leading-tight font-bold text-[#FF2E58] uppercase">
              Get
            </span>
            <span className="text-[10px] leading-tight text-[#FF2E58]">For {cost}</span>
          </div>
        )}
        <span className="text-[10px] leading-tight text-[#2EFF70]">{reward}</span>
      </div>
    </div>
  );
};

export default Building;
