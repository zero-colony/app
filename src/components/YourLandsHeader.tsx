import React from "react";

const YourLandsHeader: React.FC = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="font-['Montserrat'] text-[21px] font-semibold text-white uppercase">
          Your Lands: 231
        </h2>
        <p className="bg-gradient-to-r from-[#C7C7C7] to-[#616161] bg-clip-text font-['Montserrat'] text-sm font-medium text-transparent">
          0.78 CLNY earned | 1 CLNY/day
        </p>
      </div>

      <button className="flex h-[44px] w-[143px] items-center justify-center rounded-lg bg-[#FF2E58] px-4 py-3.5 backdrop-blur-[34px]">
        <span className="font-['Montserrat'] text-xs font-bold text-white">
          COLLECT ALL
        </span>
      </button>
    </div>
  );
};

export default YourLandsHeader;
