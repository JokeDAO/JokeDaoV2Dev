import { chains } from "@config/wagmi";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { FilteredToken, TOKENLISTOOOR_SUPPORTED_CHAIN_IDS } from "@hooks/useTokenList";
import { FC, useState } from "react";
import TokenSearchModalChainDropdown, { Option } from "../components/ChainDropdown";
import TokenSearchModalSearchInput from "../components/SearchInput";
import TokenSearchList from "../components/TokenList";
import TokenSearchModalUserTokens from "../components/UserTokens";

interface TokenSearchModalERC20Props {
  chains: Option[];
  hideChains?: boolean;
  onSelectToken?: (token: FilteredToken) => void;
  onSelectChain?: (chain: string) => void;
}
const TokenSearchModalERC20: FC<TokenSearchModalERC20Props> = ({
  chains: erc20Chains,
  hideChains,
  onSelectToken,
  onSelectChain,
}) => {
  const [erc20SelectedChain, setErc20SelectedChain] = useState<string>(erc20Chains[0].value);
  const [searchValue, setSearchValue] = useState<string>("");
  const chainId = chains.find(chain => chain.name === erc20SelectedChain)?.id || 1;
  const isChainSupportedBySearch = TOKENLISTOOOR_SUPPORTED_CHAIN_IDS.includes(chainId);

  return (
    <div className="flex flex-col gap-8">
      {!hideChains ? (
        <div className="flex flex-col gap-4">
          <p className="text-[24px] font-bold text-true-white">chain:</p>
          <TokenSearchModalChainDropdown
            defaultOption={erc20Chains[0]}
            options={erc20Chains}
            onChange={option => {
              setErc20SelectedChain(option);
              onSelectChain?.(option);
            }}
          />
        </div>
      ) : null}
      {!hideChains ? <div className="bg-primary-5 h-[2px]" /> : null}
      <TokenSearchModalSearchInput onSearchChange={value => setSearchValue(value)} chainId={chainId} />
      {searchValue ? (
        <TokenSearchList searchValue={searchValue} chainId={chainId} onSelectToken={onSelectToken} />
      ) : isChainSupportedBySearch ? (
        <TokenSearchModalUserTokens chainName={erc20SelectedChain} onSelectToken={onSelectToken} />
      ) : (
        <div className="flex gap-2">
          <InformationCircleIcon className="w-12 text-neutral-11" />
          <p className="text-[14px] text-neutral-11">
            we do not support searching by token name or retrieving tokens from your wallet on{" "}
            <span className="normal-case">{erc20SelectedChain}</span> chain. Please paste the token address to search.
          </p>
        </div>
      )}
    </div>
  );
};

export default TokenSearchModalERC20;
