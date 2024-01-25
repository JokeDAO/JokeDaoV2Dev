import { Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  bitgetWallet,
  coinbaseWallet,
  imTokenWallet,
  metaMaskWallet,
  okxWallet,
  omniWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  tahoWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { injected } from "@wagmi/connectors";
import { createConfig, http } from "wagmi";
import { arbitrumOne } from "./custom-chains/arbitrumOne";
import { arthera } from "./custom-chains/arthera";
import { artheraTestnet } from "./custom-chains/artheraTestnet";
import { astriaDusk2 } from "./custom-chains/astriaDusk2";
import { avaxCChain } from "./custom-chains/avaxCChain";
import { base } from "./custom-chains/base";
import { baseTestnet } from "./custom-chains/baseTestnet";
import { berachainTestnet } from "./custom-chains/berachainTestnet";
import { bnb } from "./custom-chains/bnb";
import { celo } from "./custom-chains/celo";
import { celoTestnet } from "./custom-chains/celoTestnet";
import { degenChain } from "./custom-chains/degenChain";
import { eos } from "./custom-chains/eos";
import { eosTestnet } from "./custom-chains/eosTestnet";
import { evmos } from "./custom-chains/evmos";
import { evmosTestnet } from "./custom-chains/evmosTestnet";
import { fantom } from "./custom-chains/fantom";
import { fantomTestnet } from "./custom-chains/fantomTestnet";
import { frameTestnet } from "./custom-chains/frameTestnet";
import { fuse } from "./custom-chains/fuse";
import { gnosis } from "./custom-chains/gnosis";
import { gnosisTestnet } from "./custom-chains/gnosisTestnet";
import { goerli } from "./custom-chains/goerli";
import { holesky } from "./custom-chains/holesky";
import { kroma } from "./custom-chains/kroma";
import { linea } from "./custom-chains/linea";
import { lineaTestnet } from "./custom-chains/lineaTestnet";
import { litTestnet } from "./custom-chains/litTestnet";
import { lootChain } from "./custom-chains/lootChain";
import { lootChainTestnet } from "./custom-chains/lootChainTestnet";
import { lukso } from "./custom-chains/lukso";
import { luksoTestnet } from "./custom-chains/luksoTestnet";
import { mainnet } from "./custom-chains/mainnet";
import { mantaPacific } from "./custom-chains/mantaPacific";
import { mantle } from "./custom-chains/mantle";
import { mantleTestnet } from "./custom-chains/mantleTestnet";
import { mode } from "./custom-chains/mode";
import { modeTestnet } from "./custom-chains/modeTestnet";
import { nautilusChain } from "./custom-chains/nautilusChain";
import { near } from "./custom-chains/near";
import { nearTestnet } from "./custom-chains/nearTestnet";
import { neonDevnet } from "./custom-chains/neonDevnet";
import { optimism } from "./custom-chains/optimism";
import { optimismTestnet } from "./custom-chains/optimismTestnet";
import { polygon } from "./custom-chains/polygon";
import { polygonTestnet } from "./custom-chains/polygonTestnet";
import { polygonZk } from "./custom-chains/polygonZk";
import { polygonZkTestnet } from "./custom-chains/polygonZkTestnet";
import { proteus } from "./custom-chains/proteus";
import { publicGoodsNetwork } from "./custom-chains/publicGoodsNetwork";
import { publicGoodsNetworkTestnet } from "./custom-chains/publicGoodsNetworkTestnet";
import { qChain } from "./custom-chains/qChain";
import { qChainTestnet } from "./custom-chains/qChainTestnet";
import { quartz } from "./custom-chains/quartz";
import { redstoneHolesky } from "./custom-chains/redstoneHolesky";
import { ronin } from "./custom-chains/ronin";
import { roninTestnet } from "./custom-chains/roninTestnet";
import { scroll } from "./custom-chains/scroll";
import { scrollSepoliaTestnet } from "./custom-chains/scrollSepoliaTestnet";
import { scrollTestnet } from "./custom-chains/scrollTestnet";
import { sepolia } from "./custom-chains/sepolia";
import { taikoTestnet } from "./custom-chains/taikoTestnet";
import { unique } from "./custom-chains/unique";
import { vitruveo } from "./custom-chains/vitruveo";
import { x1Testnet } from "./custom-chains/x1Testnet";
import { zetaTestnet } from "./custom-chains/zetaTestnet";
import { zora } from "./custom-chains/zora";

type ChainImages = {
  [key: string]: string;
};

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const chains: Chain[] = [
  polygon,
  arbitrumOne,
  optimism,
  polygonZk,
  base,
  evmos,
  avaxCChain,
  zora,
  bnb,
  linea,
  celo,
  publicGoodsNetwork,
  lootChain,
  near,
  gnosis,
  mantle,
  lukso,
  qChain,
  eos,
  proteus,
  nautilusChain,
  ronin,
  degenChain,
  fuse,
  kroma,
  scroll,
  quartz,
  unique,
  vitruveo,
  mantaPacific,
  holesky,
  redstoneHolesky,
  mode,
  astriaDusk2,
  fantom,
  arthera,
  polygonTestnet,
  sepolia,
  goerli,
  polygonZkTestnet,
  baseTestnet,
  scrollTestnet,
  evmosTestnet,
  lineaTestnet,
  litTestnet,
  zetaTestnet,
  celoTestnet,
  optimismTestnet,
  publicGoodsNetworkTestnet,
  lootChainTestnet,
  nearTestnet,
  gnosisTestnet,
  mantleTestnet,
  luksoTestnet,
  modeTestnet,
  qChainTestnet,
  eosTestnet,
  roninTestnet,
  scrollSepoliaTestnet,
  artheraTestnet,
  x1Testnet,
  neonDevnet,
  frameTestnet,
  fantomTestnet,
  berachainTestnet,
  taikoTestnet,
  mainnet,
];

const WALLETCONECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

// TODO: we need rainbowkit upgrade in order to use this setting in createConfig
const connectors = connectorsForWallets([
  {
    groupName: "Wallets",
    wallets: [
      metaMaskWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      walletConnectWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      rainbowWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      okxWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      tahoWallet({ chains }),
      coinbaseWallet({ chains, appName: "jokerace" }),
      argentWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      trustWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      imTokenWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      omniWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      bitgetWallet({ chains, projectId: WALLETCONECT_PROJECT_ID }),
      rabbyWallet({ chains }),
      phantomWallet({ chains }),
    ],
  },
]);

// TODO: add connectors and transports for each chain
export const config = createConfig({
  chains: chains as any,
  transports: {
    [mainnet.id]: http("https://mainnet.example.com"),
    [sepolia.id]: http("https://sepolia.example.com"),
  },
  connectors: [injected()],
});

export const chainsImages: ChainImages = chains.reduce((acc, chain) => {
  if (chain.name && chain.iconUrl) {
    acc[chain.name.toLowerCase()] = chain.iconUrl as string;
  }
  return acc;
}, {} as ChainImages);
