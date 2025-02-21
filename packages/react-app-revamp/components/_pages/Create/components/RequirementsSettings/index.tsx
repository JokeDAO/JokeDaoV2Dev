/* eslint-disable @next/next/no-img-element */
import TokenSearchModal, { TokenSearchModalType } from "@components/TokenSearchModal";
import { chains, chainsImages } from "@config/wagmi";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NFTMetadata } from "@hooks/useSearchNfts";
import { FilteredToken } from "@hooks/useTokenList";
import { FC, useState } from "react";
import { Tooltip } from "react-tooltip";
import CreateDefaultDropdown, { Option } from "../DefaultDropdown";
import CreateNumberInput from "../NumberInput";
import CreateTextInput from "../TextInput";
import { erc20ChainDropdownOptions, nftChainDropdownOptions, votingPowerOptions } from "./config";

interface CreateRequirementsSettingsProps {
  settingType: string;
  chain: string;
  token: TokenDetails;
  minTokensRequired: number;
  powerType?: string;
  powerValue?: number;
  error?: Record<string, string | undefined>;
  tokenId?: string;
  onChainChange?: (chain: string) => void;
  onTokenChange?: (token: TokenDetails) => void;
  onMinTokensRequiredChange?: (minTokens: number | null) => void;
  onPowerTypeChange?: (votingPowerType: string) => void;
  onPowerValueChange?: (votingPower: number | null) => void;
  onTokenIdChange?: (tokenId?: string) => void;
}

export interface TokenDetails {
  address: string;
  symbol: string;
  name: string;
  logo: string;
  nftTokenType?: string;
}

const defaultTokenDetails = {
  name: "",
  symbol: "",
  logo: "",
  address: "",
  nftTokenType: "",
};

const CreateRequirementsSettings: FC<CreateRequirementsSettingsProps> = ({
  settingType,
  chain,
  token,
  minTokensRequired,
  tokenId,
  error,
  powerType,
  powerValue,
  onChainChange,
  onTokenChange,
  onMinTokensRequiredChange,
  onPowerTypeChange,
  onPowerValueChange,
  onTokenIdChange,
}) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const chainDropdownOptions = settingType === "erc20" ? erc20ChainDropdownOptions : nftChainDropdownOptions;
  const tokenModalType = settingType === "erc20" ? TokenSearchModalType.ERC20 : TokenSearchModalType.ERC721;
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>(token);
  const tokenDetailsExist = tokenDetails.name && tokenDetails.logo && tokenDetails.address && tokenDetails.symbol;
  const [chainLogo, setChainLogo] = useState<string>(chainsImages[chain]);
  const chainExplorer = chains.find(c => c.name === chain)?.blockExplorers?.default.url;
  const chainExplorerTokenUrl = chainExplorer ? `${chainExplorer}/token/${token.address}` : "";

  const powerTypeOption = (powerType: string): Option => {
    return {
      value: powerType,
      label: powerType,
    };
  };

  const updateTokenDetails = (details: TokenDetails) => {
    setTokenDetails(details);
    onTokenChange?.(details);
    setIsTokenModalOpen(false);
  };

  const onTokenSelectHandler = (token: FilteredToken) => {
    const { name, logoURI, address, symbol } = token;
    updateTokenDetails({
      name,
      address,
      symbol,
      logo: logoURI,
    });
  };

  const onNftSelectHandler = (nft: NFTMetadata) => {
    const { name, imageUrl, address, symbol, tokenType } = nft;

    updateTokenDetails({
      name,
      symbol,
      address,
      nftTokenType: tokenType,
      logo: imageUrl,
    });
  };

  const onRemoveToken = () => {
    setTokenDetails(defaultTokenDetails);
    setChainLogo(chainsImages["mainnet"]);
    onTokenChange?.(defaultTokenDetails);
    onTokenIdChange?.("");
    onChainChange?.("mainnet");
  };

  const onTokenModalHandler = () => {
    if (!tokenDetails.name && !tokenDetails.logo) {
      setIsTokenModalOpen(!isTokenModalOpen);
    }
  };

  const onChainChangeHandler = (chain: string) => {
    const chainLogo = chainsImages[chain];
    setChainLogo(chainLogo);
    onChainChange?.(chain);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/contest/mona-lisa-moustache.png";
  };

  return (
    <div className="animate-reveal md:ml-4 md:pl-4 md:border-l border-true-white mt-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <img src={chainLogo} alt="ethereum" width={20} height={20} />
            <p className="text-[16px] text-neutral-11 font-bold uppercase">
              {settingType === "erc20" ? "token" : "nft"}
            </p>
          </div>
          <div className="flex flex-col gap-2 ">
            <div
              onClick={onTokenModalHandler}
              data-tooltip-id="tooltip-clickable"
              className={`flex rounded-[15px] border border-neutral-10 bg-transparent justify-between w-[216px] h-10 px-4 py-1 hover:border-neutral-11
                transition-colors duration-300 cursor-pointer`}
            >
              {tokenDetailsExist ? (
                <div className="flex gap-3 items-center ">
                  <div
                    className={`flex items-center bg-neutral-5 rounded-full overflow-hidden w-8 border border-primary-2`}
                  >
                    <img
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      src={tokenDetails.logo}
                      alt="avatar"
                      onError={handleImageError}
                    />
                  </div>
                  <p className="text-[20px] text-neutral-11 uppercase">
                    {tokenDetails.symbol.length > 8 ? `${tokenDetails.symbol.substring(0, 8)}...` : tokenDetails.symbol}
                  </p>
                </div>
              ) : (
                <p className="text-[20px] font-bold text-neutral-10">select...</p>
              )}

              {tokenDetailsExist ? (
                <XMarkIcon
                  className="w-6 cursor-pointer text-negative-11 hover:text-negative-10 transition-all duration-300"
                  onClick={onRemoveToken}
                />
              ) : (
                <ChevronDownIcon className="w-6 cursor-pointer text-neutral-11" />
              )}
              <Tooltip
                clickable
                hidden={!tokenDetailsExist}
                id="tooltip-clickable"
                border="1px solid #e2e2e2"
                place="right"
                className="cursor-default custom-tooltip z-50"
              >
                <div className="flex flex-col gap-2 text-neutral-11 text-[16px]">
                  <p className="font-bold">
                    name: <span className="font-normal">{token.name}</span>
                  </p>
                  <p className="font-bold">
                    symbol: <span className="font-normal normal-case">${token.symbol}</span>
                  </p>
                  <p className="font-bold">
                    address:{" "}
                    <a
                      href={chainExplorerTokenUrl}
                      target="_blank"
                      className="hover:text-positive-11 transition-colors duration-300 underline cursor-pointer font-normal"
                    >
                      {shortenEthereumAddress(token.address)}
                    </a>
                  </p>
                </div>
              </Tooltip>
            </div>
            {error?.tokenAddressError ? (
              <p className="text-negative-11 text-[14px] font-bold animate-reveal">{error.tokenAddressError}</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {settingType === "erc721" ? (
            <p className="text-[16px] text-neutral-11 font-bold uppercase">
              min <span className="normal-case">NFTs</span> required
            </p>
          ) : (
            <p className="text-[16px] text-neutral-11 font-bold uppercase">min tokens required</p>
          )}

          <CreateNumberInput
            value={minTokensRequired}
            className="md:w-44 text-[16px] md:text-[24px]"
            placeholder={settingType === "erc20" ? "0.01" : "1"}
            onChange={onMinTokensRequiredChange}
            errorMessage={error?.minTokensRequiredError}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[16px] text-neutral-11 font-bold uppercase">voting power</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between md:justify-normal md:gap-3">
              <CreateNumberInput
                className="text-[16px] md:text-[24px]"
                value={powerValue ?? 0}
                placeholder="100"
                onChange={onPowerValueChange}
                disableDecimals
                style={{ width: "100px" }}
              />
              <p className="text-[16px] md:text-[20px]">votes per</p>
              <CreateDefaultDropdown
                defaultOption={powerTypeOption(powerType ?? "")}
                options={votingPowerOptions}
                className="w-48 text-[16px] md:text-[20px] cursor-pointer"
                onChange={onPowerTypeChange}
              />
            </div>
            <p className="text-negative-11 text-[14px] font-bold animate-reveal">{error?.powerValueError}</p>
          </div>
        </div>

        {settingType === "erc721" && tokenDetails.nftTokenType === "ERC1155" ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-neutral-11 font-bold uppercase">token id</p>
              <span className="text-[12px]">(optional)</span>
            </div>

            <CreateTextInput
              value={tokenId}
              onChange={onTokenIdChange}
              className="w-full md:w-52 text-[16px] md:text-[20px]"
              placeholder={`"0x01" or "1"`}
            />
          </div>
        ) : null}
        <TokenSearchModal
          type={tokenModalType}
          chains={chainDropdownOptions}
          isOpen={isTokenModalOpen}
          setIsOpen={value => setIsTokenModalOpen(value)}
          onSelectToken={onTokenSelectHandler}
          onSelectNft={onNftSelectHandler}
          onSelectChain={onChainChangeHandler}
          onClose={() => onChainChangeHandler("mainnet")}
        />
      </div>
    </div>
  );
};

export default CreateRequirementsSettings;
