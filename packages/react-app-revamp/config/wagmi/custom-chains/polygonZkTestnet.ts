export const polygonZkTestnet = {
  id: 1422,
  name: 'PolygonZkTestnet',
  network: 'polygonZkTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: 'https://rpc.public.zkevm-test.net',
    default: `https://polygonzkevm-testnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  },
  blockExplorers: {
    etherscan: { name: 'Polygon zkEvm Testnet Scan', url: 'https://explorer.public.zkevm-test.net' },
    default: { name: 'Polygon zkEvm Testnet Scan', url: 'https://explorer.public.zkevm-test.net' },
  },
}