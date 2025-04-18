import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import React, { useState } from "react";
import useMeasure from "react-use-measure";
import { formatEther } from "viem";
import { cn } from "~/lib/utils";
import { BUILDINGS } from "~/lib/utils/buildings";
import Building from "./Building";
import ArrowDown from "./svg/ArrowDown";

interface LandDetails {
  speed: bigint;
  earned: bigint;
  baseStation: number;
  transport: number;
  robotAssembly: number;
  powerProduction: number;
}

interface LandProps {
  landId: string;
  landDetails: LandDetails;
}

const Land: React.FC<LandProps> = ({ landId, landDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formattedDailyOutput = landDetails?.speed
    ? `${landDetails.speed} CLNY/day`
    : "0 CLNY/day";

  const formattedEarnedAmount = landDetails?.earned
    ? `${Number(formatEther(landDetails.earned)).toFixed(2)} CLNY`
    : "0 CLNY";

  const [ref, bounds] = useMeasure();

  return (
    <m.div animate={{ height: bounds.height || "auto" }}>
      <div
        ref={ref}
        className="w-full flex-col rounded-lg border border-white/5 bg-white/5"
      >
        <div className="flex w-full flex-row items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-row items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-lg">
              <img
                src="/images/land-image.png"
                alt="Land"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-1">
              <span className="text-sm font-semibold text-white uppercase">
                Land #{landId}
              </span>

              <div className="flex flex-row items-center gap-2">
                <div className="rounded bg-white/10 px-2 py-1 text-[10px] text-white">
                  {formattedDailyOutput}
                </div>
                <span className="text-[11px] text-[#ADADAD]">
                  Earned: {formattedEarnedAmount}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center">
            <button
              className={cn(
                "flex h-[40px] w-[100px] cursor-pointer flex-row items-center justify-center gap-1.5 rounded-lg px-2.5 py-2.5",
                isExpanded
                  ? "text-primary border-primary border bg-transparent"
                  : "bg-[#FF2E58] text-white",
              )}
              onClick={toggleExpand}
            >
              <span className="text-xs font-bold">BUILD</span>
              <ArrowDown className={cn("size-2.5", isExpanded && "mb-px rotate-180")} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {isExpanded && (
            <m.div
              className="rounded-b-lg px-2 py-2 pt-0"
              initial={{
                opacity: 0,
                scale: 0.99,
                y: -15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.99,
                y: -10,
                transition: {
                  opacity: { duration: 0.15 },
                  y: { duration: 0.15 },
                  scale: { duration: 0.15 },
                },
              }}
              transition={{
                opacity: { duration: 0.2 },
                y: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
            >
              <div className="flex flex-row gap-px">
                {BUILDINGS.map((building, index) => (
                  <React.Fragment key={building.key}>
                    <Building
                      {...building}
                      currentLevel={landDetails[building.key]}
                      landId={landId}
                    />
                    {index < BUILDINGS.length - 1 && (
                      <div className="h-auto w-px bg-white/5"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
};

export default Land;
