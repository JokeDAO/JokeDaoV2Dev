import { Chain } from "@rainbow-me/rainbowkit";

export const formaTestnet: Chain = {
  id: 984123,
  name: "formaTestnet",
  iconUrl: "/forma-sketchpad.svg",
  nativeCurrency: {
    decimals: 18,
    name: "TIA",
    symbol: "TIA",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.sketchpad-1.forma.art"],
    },
    default: {
      http: ["https://rpc.sketchpad-1.forma.art"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Forma Sketchpad Block Explorer", url: "https://explorer.sketchpad-1.forma.art" },
    default: { name: "Forma Sketchpad Block Explorer", url: "https://explorer.sketchpad-1.forma.art" },
  },
  testnet: true,
};
