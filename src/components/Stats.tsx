export const Stats = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <StatCard icon="/images/layers.svg" value="12104" label="plots claimed" />
        <StatCard icon="/images/money-bag.svg" value="222567" label="CLNY minted" />
        <StatCard icon="/images/dollar.svg" value="$0.401" label="CLNY price" />
      </div>

      <div className="flex items-center justify-between">
        <StatCard icon="/images/add-circle.svg" value="8894" label="plots available" />
        <StatCard icon="/images/fire.svg" value="203760" label="CLNY burned" />
        <StatCard icon="/images/chat.svg" value="$87320" label="Market Cap" />
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) => {
  return (
    <div className="flex min-w-[135px] items-center gap-3">
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b from-white/15 to-white/5 p-2.5">
        <div className="absolute inset-px -z-10 rounded-[7px] bg-[#0D0D0D]"></div>
        <img src={icon} alt={label} className="h-5 w-5" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-white">{value}</span>
        <span className="text-xs text-[#616161]">{label}</span>
      </div>
    </div>
  );
};
