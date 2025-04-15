import { WalletIcon } from "./svg/Wallet";

export const Wallet = () => {
  const balances = {
    CLNY: 0,
    ETH: 0,
  };

  const logos = {
    CLNY: <img src="/images/clny.png" className="h-4 w-4" alt="CLNY" />,
    ETH: <img src="/images/eth.svg" className="h-4 w-4" alt="ETH" />,
  };

  const formattedWallet = "0x53fe...332bed";
  const mobileFormattedWallet =
    formattedWallet.slice(0, 6) + "..." + formattedWallet.slice(-4);

  return (
    <div className="absolute top-14 flex w-full items-center justify-center sm:top-3.5 sm:right-3.5 sm:translate-x-0 sm:items-end sm:!justify-end">
      <div className="rounded-lg border border-white/10 bg-black/20 text-white backdrop-blur-[30px]">
        <div className="flex divide-x divide-white/10 text-sm font-medium">
          {Object.entries(balances).map(([token, balance]) => (
            <div className="flex items-center gap-2 px-4 py-3.5" key={token}>
              {logos[token as keyof typeof logos]}
              <div className="whitespace-nowrap">
                <span>{balance}</span> <span>{token}</span>
              </div>
            </div>
          ))}
          <button className="flex cursor-pointer items-center gap-2 rounded-r-[7px] px-4 py-3.5 hover:bg-white/10">
            <WalletIcon className="text-primary h-4 w-4" />{" "}
            <span className="hidden sm:block">{formattedWallet}</span>
            <span className="block sm:hidden">{mobileFormattedWallet}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
