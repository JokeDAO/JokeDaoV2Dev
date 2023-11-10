import { Chain } from "@rainbow-me/rainbowkit";

export const nearTestnet: Chain = {
  id: 1313161555,
  name: "nearTestnet",
  network: "nearTestnet",
  iconUrl: "/aurora.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet.aurora.dev"],
    },
    default: {
      http: ["https://testnet.aurora.dev"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Near Aurora Testnet Block Explorer", url: "https://testnet.aurorascan.dev/" },
    default: { name: "Near Aurora Testnet Block Explorer", url: "https://testnet.aurorascan.dev/" },
  },
  testnet: true,
};
