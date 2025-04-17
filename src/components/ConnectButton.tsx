import { ConnectKitButton } from "connectkit";
import React, { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type ConnectButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <ConnectKitButton.Custom>
      {({ show }) => (
        <button
          className={cn(
            "bg-primary flex items-center justify-center rounded-lg px-6 py-3.5 text-xs font-bold uppercase",
            className,
          )}
          onClick={() => show?.()}
          {...props}
        >
          {children || "Connect wallet"}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
};
