interface TokenHolder {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
}

interface TokenHolderResponse {
  status: string;
  message: string;
  result: TokenHolder[];
}

interface TokenHolderCountResponse {
  status: string;
  message: string;
  result: string;
}

const ETHERSCAN_BASE_URL = "https://api.etherscan.io/v2";

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;

export const isEtherscanConfigured = !!ETHERSCAN_API_KEY;

export async function getTokenHolderList({
  chainId,
  contractAddress,
  page = 1,
  offset = 10,
}: {
  chainId: number;
  contractAddress: string;
  page?: number;
  offset?: number;
}): Promise<TokenHolder[]> {
  if (!isEtherscanConfigured) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      chainid: chainId.toString(),
      module: "token",
      action: "tokenholderlist",
      contractaddress: contractAddress,
      page: page.toString(),
      offset: offset.toString(),
      apikey: ETHERSCAN_API_KEY ?? "",
    });

    const response = await fetch(`${ETHERSCAN_BASE_URL}/api?${params.toString()}`);
    const data: TokenHolderResponse = await response.json();

    if (data.status === "1" && Array.isArray(data.result)) {
      return data.result;
    }

    console.error("failed to fetch token holders", data);
    return [];
  } catch (error) {
    console.error("failed to fetch token holders", error);
    return [];
  }
}

export async function getTokenHolderCount({
  chainId,
  contractAddress,
}: {
  chainId: number;
  contractAddress: string;
}): Promise<number> {
  if (!isEtherscanConfigured) {
    return 0;
  }

  try {
    const params = new URLSearchParams({
      chainid: chainId.toString(),
      module: "token",
      action: "tokenholdercount",
      contractaddress: contractAddress,
      apikey: ETHERSCAN_API_KEY ?? "",
    });

    const response = await fetch(`${ETHERSCAN_BASE_URL}/api?${params.toString()}`);
    const data: TokenHolderCountResponse = await response.json();

    if (data.status === "1" && data.result) {
      return parseInt(data.result, 10);
    }

    console.error("failed to fetch token holder count", data);
    return 0;
  } catch (error) {
    console.error("failed to fetch token holder count", error);
    return 0;
  }
}
