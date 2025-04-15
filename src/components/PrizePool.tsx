import React from "react";

const PrizePool: React.FC = () => {
  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 rounded-xl bg-black"></div>

        <div className="absolute inset-0">
          <img
            src="/images/prize-pool-bg.png"
            alt="Prize pool background"
            className="h-full w-full rounded-xl object-cover"
          />
        </div>

        <div className="absolute inset-0 rounded-xl bg-[#FF2E58] opacity-60 mix-blend-overlay"></div>

        <div className="absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-r from-black to-transparent"></div>

        <div className="relative z-10 flex items-center justify-between px-6 py-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-['Montserrat'] text-2xl font-semibold text-white uppercase">
              Prize pool
            </h2>
            <p className="font-['Montserrat'] text-2xl text-[#FF2E58]">0.24 ETH ($344)</p>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex h-[40px] w-[134px] items-center justify-center rounded-lg border border-white/10 bg-white/5 px-[10px] py-[10px] backdrop-blur-[44px]">
              <span className="font-['Montserrat'] text-xs font-semibold text-white">
                Seasons Finalists
              </span>
            </button>

            <button className="flex h-[40px] w-[134px] items-center justify-center rounded-lg border border-white/10 bg-white/5 px-[10px] py-[10px] backdrop-blur-[44px]">
              <span className="font-['Montserrat'] text-xs font-semibold text-white">
                Learn more
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizePool;
