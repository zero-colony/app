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

  return (
    <div className="absolute top-3.5 right-3.5 rounded-lg border border-white/10 bg-black/20 text-white backdrop-blur-[30px]">
      <div className="flex divide-x divide-white/10 text-sm font-medium">
        {Object.entries(balances).map(([token, balance]) => (
          <div className="flex items-center gap-2 px-4 py-3.5" key={token}>
            {logos[token as keyof typeof logos]}
            <div>
              <span>{balance}</span> <span>{token}</span>
            </div>
          </div>
        ))}
        <button className="flex cursor-pointer items-center gap-2 rounded-r-[7px] px-4 py-3.5 hover:bg-white/10">
          <WalletIcon className="text-primary h-4 w-4" /> <span>{formattedWallet}</span>
        </button>
      </div>
    </div>
  );
};
