import type { NextApiRequest, NextApiResponse } from "next";
import Fuse from "fuse.js";

interface Token {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
  chainId: number;
  decimals: number;
}

interface TokenList {
  name: string;
  description: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  logoURI: string;
  keywords: string[];
  tokens: Token[];
}

interface TokenResult {
  tokens: FilteredToken[];
  pagination: {
    totalLength: number;
    hasMore: boolean;
    pageParam: number;
  };
}

interface FilteredToken {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
}

const DEFILLAMA_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Migratooor/tokenLists/main/lists/defillama.json";

const fetchTokenList = async (): Promise<TokenList | null> => {
  const response = await fetch(DEFILLAMA_TOKEN_LIST_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export async function fetchAndFilterToken(
  chainId: number,
  tokenIdentifier: string,
  page: number = 0,
  limit: number = 20,
): Promise<{
  tokens: FilteredToken[];
  pagination: {
    totalLength: number;
    hasMore: boolean;
    pageParam: number;
  };
}> {
  try {
    const data = await fetchTokenList();
    if (!data) return { tokens: [], pagination: { totalLength: 0, hasMore: false, pageParam: 0 } };

    const tokensForChain = data.tokens.filter(token => token.chainId === chainId);

    const fuseOptions = { includeScore: true, keys: ["name", "address"], threshold: 0.2 };
    const fuse = new Fuse(tokensForChain, fuseOptions);
    const fuseResults = fuse.search(tokenIdentifier);

    const totalLength = fuseResults.length;
    const tokens = fuseResults.slice(page * limit, (page + 1) * limit).map(result => ({
      address: result.item.address,
      name: result.item.name,
      symbol: result.item.symbol,
      logoURI: result.item.logoURI,
    }));

    return {
      tokens,
      pagination: {
        totalLength,
        hasMore: totalLength > (page + 1) * limit,
        pageParam: page,
      },
    };
  } catch (error) {
    console.error("Error fetching or processing token list:", error);
    return { tokens: [], pagination: { totalLength: 0, hasMore: false, pageParam: 0 } };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<TokenResult | { error: string }>) {
  const { chainId, tokenIdentifier, page, limit } = req.query;

  const parsedChainId = parseInt(chainId as string, 10);
  const parsedPage = parseInt(page as string, 10) || 0;
  const parsedLimit = parseInt(limit as string, 10) || 10;

  if (isNaN(parsedChainId)) {
    res.status(400).json({ error: "Invalid chainId" });
    return;
  }
  if (isNaN(parsedPage) || isNaN(parsedLimit)) {
    res.status(400).json({ error: "Invalid pagination parameters" });
    return;
  }

  try {
    const result = await fetchAndFilterToken(parsedChainId, tokenIdentifier as string, parsedPage, parsedLimit);
    if (result) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result);
    } else {
      res.status(200).json({ tokens: [], pagination: { totalLength: 0, hasMore: false, pageParam: 0 } });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
