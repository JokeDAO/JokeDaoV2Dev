import { config } from "@config/wagmi";
import { getEthersProvider } from "./ethers";
import { Block } from "ethers";

export async function getBlockDetails(blockHash: string, chainId: number): Promise<Block | null> {
  try {
    const provider = getEthersProvider(config, { chainId });
    if (!provider) {
      console.error("Provider is undefined");
      return null;
    }
    const blockInfo = await provider.getBlock(blockHash);
    return blockInfo ?? null;
  } catch (error) {
    console.error("Error fetching block details:", error);
    return null;
  }
}
