import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import { chains, serverConfig } from "@config/wagmi/server";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContracts } from "@wagmi/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parse } from "node-html-parser";
import { Abi } from "viem";

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

type Props = {
  params: { chain: string; address: string };
};

async function getContestDetails(address: string, chainName: string) {
  try {
    const chainId = chains.filter(
      (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
    )?.[0]?.id;

    const { abi } = await getContestContractVersion(address, chainId);

    const contracts = [
      {
        address: address as `0x${string}`,
        abi: abi as Abi,
        chainId,
        functionName: "name",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: abi as Abi,
        chainId,
        functionName: "prompt",
        args: [],
      },
    ];

    const results = (await readContracts(serverConfig, { contracts })) as any;
    return results;
  } catch (error) {
    console.error("failed to fetch contest details:", error);
    return [
      { result: "" }, // empty name
      { result: "||" }, // empty prompt with minimum required delimiters
    ];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chain, address } = params;
  const defaultMetadata = {
    title: "Contest",
    description: "",
    openGraph: {
      title: "Contest",
      description: "",
    },
    twitter: {
      title: "Contest",
      description: "",
    },
  };

  try {
    const contestDetails = await getContestDetails(address, chain);
    const contestTitle = contestDetails[0].result as string;
    const prompt = contestDetails[1].result as string;
    const contestPrompt = parsePrompt(prompt);

    const contestDescriptionRaw =
      contestPrompt.contestSummary + contestPrompt.contestEvaluate + contestPrompt.contestContactDetails;

    const contestDescription = parse(contestDescriptionRaw).textContent;

    return {
      title: contestTitle || defaultMetadata.title,
      description: contestDescription,
      openGraph: {
        title: contestTitle || defaultMetadata.title,
        description: contestDescription,
      },
      twitter: {
        title: contestTitle || defaultMetadata.title,
        description: contestDescription,
      },
    };
  } catch (error) {
    console.error("failed to generate metadata:", error);
    return defaultMetadata;
  }
}

const Page = ({ params }: Props) => {
  const { chain, address } = params;

  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return notFound();
  }
};

export default Page;
