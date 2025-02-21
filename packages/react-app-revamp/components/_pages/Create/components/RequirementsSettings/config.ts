import { Option } from "@components/_pages/Create/components/DefaultDropdown";

export const requirementsDropdownOptions: Option[] = [
  { value: "erc20", label: "token holders" },
  { value: "erc721", label: "NFT holders" },
];

export const nftChainDropdownOptions: Option[] = [
  {
    value: "mainnet",
    label: "ethereum",
  },
  {
    value: "polygon",
    label: "polygon",
  },
  {
    value: "arbitrumone",
    label: "arbitrum",
  },
  {
    value: "optimism",
    label: "optimism",
  },
  {
    value: "base",
    label: "base",
  },
];

export const erc20ChainDropdownOptions: Option[] = [
  {
    value: "mainnet",
    label: "ethereum",
  },
  {
    value: "arbitrumone",
    label: "arbitrum",
  },
  {
    value: "avalanche",
    label: "avalanche",
  },
  {
    value: "base",
    label: "base",
  },
  {
    value: "celo",
    label: "celo",
  },
  {
    value: "mantle",
    label: "mantle",
  },
  {
    value: "optimism",
    label: "optimism",
  },
  {
    value: "polygon",
    label: "polygon",
  },
];

export const votingPowerOptions: Option[] = [
  {
    value: "token",
    label: "token",
  },
  {
    value: "token holder",
    label: "token holder",
  },
];
