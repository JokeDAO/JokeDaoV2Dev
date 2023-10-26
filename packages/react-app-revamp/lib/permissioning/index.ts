import { chains } from "@config/wagmi";

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export type VoteCalculationMethod = "token" | "token holder";

const HARD_LIMIT = 400000;

export async function fetchNftHolders(
  type: "voting" | "submission",
  contractAddress: string,
  chainName: string,
  minTokensRequired: number = 1,
  votesPerUnit: number = 100,
  voteCalculationMethod: string = "token",
): Promise<Record<string, number> | Error> {
  let baseAlchemyAppUrl = chains.filter(chain => chain.name === chainName.toLowerCase())[0].rpcUrls.default.http[0];

  baseAlchemyAppUrl = baseAlchemyAppUrl.replace(/(v2\/).*/, "$1");

  const alchemyAppUrl = `${baseAlchemyAppUrl}${apiKey}/getOwnersForCollection`;

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
        return new Error("No owners found for the specified collection.");
      }

      allOwnersData.push(...ownersData);

      if (allOwnersData.length > HARD_LIMIT) {
        return new Error(`NFT collection has  more than 400k holders, which is not supported.`);
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
    });
  });
}
