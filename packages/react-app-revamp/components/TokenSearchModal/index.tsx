import DialogModalV4 from "@components/UI/DialogModalV4";
import { NFTMetadata } from "@hooks/useSearchNfts";
import { FilteredToken } from "@hooks/useTokenList";
import { FC, useCallback } from "react";
import { Option } from "./components/ChainDropdown";
import TokenSearchModalERC20 from "./ERC20";
import TokenSearchModalNft from "./NFT";

export enum TokenSearchModalType {
  ERC20 = "erc20",
  NFT = "nft",
  ERC721 = "ERC721",
}

interface TokenSearchModalProps {
  type: TokenSearchModalType;
  chains: Option[];
  isOpen: boolean;
  hideChains?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  onSelectToken?: (token: FilteredToken) => void;
  onSelectNft?: (nft: NFTMetadata) => void;
  onSelectChain?: (chain: string) => void;
}

const TokenSearchModal: FC<TokenSearchModalProps> = ({
  type,
  hideChains = false,
  isOpen,
  setIsOpen,
  chains,
  onSelectToken,
  onClose,
  onSelectNft,
  onSelectChain,
}) => {
  const tokenSearchModalTitle = type === TokenSearchModalType.ERC20 ? "select a token" : "select an NFT";

  const handleClose = useCallback(() => {
    setIsOpen?.(false);
    onClose?.();
  }, [onClose, setIsOpen]);

  return (
    <DialogModalV4 isOpen={isOpen} onClose={handleClose} width="w-full" lgWidth="lg:max-w-[552px]">
      <div className="flex flex-col gap-8 py-6 px-4">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">{tokenSearchModalTitle}</p>
          <img
            src="/modal/modal_close.svg"
            alt="close"
            width={39}
            height={33}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <div className="bg-primary-5 h-[2px]" />
        {type === TokenSearchModalType.ERC20 ? (
          <TokenSearchModalERC20
            chains={chains}
            onSelectToken={onSelectToken}
            onSelectChain={onSelectChain}
            hideChains={hideChains}
          />
        ) : (
          <TokenSearchModalNft chains={chains} onSelectNft={onSelectNft} onSelectChain={onSelectChain} />
        )}
      </div>
    </DialogModalV4>
  );
};

export default TokenSearchModal;
