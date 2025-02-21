import { chains } from "@config/wagmi";
import { formatNumber } from "@helpers/formatNumber";
import { getTokenDecimals } from "@helpers/getTokenDecimals";
import { getTokenHolderList, getTokenHolderCount } from "../etherscan";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export type VoteCalculationMethod = "token" | "token holder";

interface TokenHolder {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
}

const NFTS_HARD_LIMIT = 400000;
const ERC20_HARD_LIMIT = 1000000;

const chainToAlchemySubdomain = {
  mainnet: "eth-mainnet",
  polygon: "polygon-mainnet",
  arbitrumone: "arb-mainnet",
  optimism: "opt-mainnet",
  base: "base-mainnet",
};

const getAlchemyBaseUrl = (chain: string) => {
  const subdomain = chainToAlchemySubdomain[chain as keyof typeof chainToAlchemySubdomain] || "eth-mainnet";
  return `https://${subdomain}.g.alchemy.com/v2/${alchemyApiKey}`;
};

export async function fetchNftHolders(
  type: "voting" | "submission",
  contractAddress: string,
  chainName: string,
  minTokensRequired: number = 1,
  tokenId?: string,
  votesPerUnit: number = 100,
  voteCalculationMethod: string = "token",
): Promise<Record<string, number> | Error> {
  const alchemyAppUrl = `${getAlchemyBaseUrl(chainName.toLowerCase())}/getOwnersForCollection`;

  let allOwnersData: any[] = [];
  let nextPageKey: string | undefined;

  do {
    const queryParams = new URLSearchParams({
      contractAddress,
      // TODO: make this configurable so we do not fetch token balances in case of per holder calculation method
      withTokenBalances: "true",
    });

    if (nextPageKey) {
      queryParams.append("pageKey", nextPageKey);
    }

    try {
      const response = await fetch(`${alchemyAppUrl}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }

      const data = await response.json();
      const ownersData = data.ownerAddresses || [];

      if (ownersData.length === 0) {
        return new Error("according to alchemy, this collection has 0 holders.");
      }

      allOwnersData.push(...ownersData);

      if (allOwnersData.length > NFTS_HARD_LIMIT) {
        return new Error(
          `collections of more than ${formatNumber(NFTS_HARD_LIMIT)} holders aren't currently supported`,
        );
      }

      nextPageKey = data.pageKey;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      return {};
    }
  } while (nextPageKey);

  const worker = new Worker(new URL("/workers/nftOwnersProcessing", import.meta.url));

  return new Promise((resolve, reject) => {
    worker.onmessage = event => {
      if (event.data.error) {
        reject(new Error(event.data.error));
        worker.terminate();
      } else {
        resolve(event.data);
      }
      worker.terminate();
    };
    worker.onerror = error => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage({
      ownersData: allOwnersData,
      votesPerUnit,
      voteCalculationMethod,
      minTokensRequired,
      eventType: type,
      tokenId,
    });
  });
}

export async function fetchTokenHolders(
  type: "voting" | "submission",
  tokenSymbol: string,
  contractAddress: string,
  chainName: string,
  minTokensRequired: number = 1,
  votesPerUnit: number = 100,
  voteCalculationMethod: string = "token",
): Promise<Record<string, number> | Error> {
  let allTokenHoldersData: TokenHolder[] = [];
  let decimals: number;

  const chain = chains.find(c => c.name.toLowerCase() === chainName.toLowerCase());
  if (!chain) {
    return new Error("invalid chain name provided");
  }

  if (chain.nativeCurrency.symbol === tokenSymbol) {
    return new Error(
      `contest is already allowlisted to ${chain.nativeCurrency.symbol} holders as they'll need it to pay charges.`,
    );
  }

  // check total holder count first
  try {
    const holderCount = await getTokenHolderCount({
      chainId: chain.id,
      contractAddress,
    });

    if (holderCount === 0) {
      return new Error("according to etherscan, this token has 0 holders.");
    }

    if (holderCount > ERC20_HARD_LIMIT) {
      return new Error(`tokens of more than ${formatNumber(ERC20_HARD_LIMIT)} holders aren't currently supported`);
    }
  } catch (error: any) {
    console.error("error fetching token holder count:", error);
    return new Error(error.message);
  }

  try {
    const fetchedDecimals = await getTokenDecimals(contractAddress, chain.id);
    if (fetchedDecimals === null) {
      throw new Error("failed to fetch token decimals");
    }
    decimals = fetchedDecimals;
  } catch (error: any) {
    console.error("error fetching token decimals:", error);
    return new Error(error.message);
  }

  try {
    let page = 1;
    const offset = 10000;

    while (true) {
      const holders = await getTokenHolderList({
        chainId: chain.id,
        contractAddress,
        page,
        offset,
      });

      if (holders.length === 0) {
        // if we've fetched at least one page with results, break the loop
        if (allTokenHoldersData.length > 0) {
          break;
        } else {
          // if the first page is empty, return an error
          return new Error("according to etherscan, this token has 0 holders.");
        }
      }

      allTokenHoldersData.push(...holders);
      page++;
    }
  } catch (error: any) {
    console.error("There was a problem with the ERC20 fetch operation:", error);
    return new Error(error.message);
  }

  const worker = new Worker(new URL("/workers/tokenHoldersProcessing", import.meta.url));

  return new Promise((resolve, reject) => {
    worker.onmessage = event => {
      if (event.data.error) {
        reject(new Error(event.data.error));
        worker.terminate();
      } else {
        resolve(event.data);
      }
      worker.terminate();
    };
    worker.onerror = error => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage({
      tokenHolders: allTokenHoldersData,
      votesPerUnit,
      voteCalculationMethod,
      minTokensRequired,
      eventType: type,
      decimals,
    });
  });
}
