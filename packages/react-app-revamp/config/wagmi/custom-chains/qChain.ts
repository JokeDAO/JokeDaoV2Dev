import { Chain } from "@rainbow-me/rainbowkit";

export const qChain: Chain = {
  id: 35441,
  name: "qChain",
  network: "qChain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.q.org"],
    },
    default: {
      http: ["https://rpc.q.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Q Mainnet Scan", url: "https://explorer.q.org" },
    default: { name: "Q Mainnet Scan", url: "https://explorer.q.org" },
  },
};
