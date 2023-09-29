import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export enum ButtonType {
  DEFAULT = "default",
  TX_ACTION = "txAction",
}

export enum ButtonSize {
  EXTRA_SMALL = "extraSmall",
  SMALL = "small",
  DEFAULT = "default",
  LARGE = "large",
  EXTRA_LARGE = "extraLarge",
  EXTRA_LARGE_LONG = "extraLargeLong",
  FULL = "full",
}

interface ButtonProps {
  type?: ButtonType;
  colorClass?: string;
  size?: ButtonSize;
  textColorClass?: string;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

const sizeClasses = {
  [ButtonSize.EXTRA_SMALL]: "w-20 h-6",
  [ButtonSize.SMALL]: "w-24",
  [ButtonSize.DEFAULT]: "w-[120px] h-[32px]",
  [ButtonSize.LARGE]: "w-40 h-[40px]",
  [ButtonSize.EXTRA_LARGE]: "w-[200px] h-12",
  [ButtonSize.EXTRA_LARGE_LONG]: "w-[240px] h-[40px]",
  [ButtonSize.FULL]: "w-full h-[40px]",
};

const Button: React.FC<ButtonProps> = ({
  type = ButtonType.DEFAULT,
  colorClass = "yellow",
  size = ButtonSize.DEFAULT,
  textColorClass = "text-true-black",
  isDisabled,
  onClick,
  children,
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type === ButtonType.TX_ACTION && !isConnected) {
      openConnectModal?.();
    } else {
      onClick?.(e);
    }
  };

  const disabledClasses = useMemo(() => (isDisabled ? "opacity-50 pointer-events-none" : ""), [isDisabled]);

  return (
    <button
      className={`text-[16px] tracking-tighter rounded-[10px] font-bold ${textColorClass} ${colorClass} ${sizeClasses[size]} ${disabledClasses}`}
      onClick={handleOnClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;
