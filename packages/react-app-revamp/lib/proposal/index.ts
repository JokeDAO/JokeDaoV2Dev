import { Proposal } from "@components/_pages/ProposalContent";
import getContestContractVersion from "@helpers/getContestContractVersion";
import isUrlToImage from "@helpers/isUrlToImage";
import { MappedProposalIds } from "@hooks/useProposal/store";
import { getProposalIdsRaw } from "@hooks/useProposal/utils";
import { BigNumber, utils } from "ethers";
import { readContracts } from "wagmi";

interface RankDictionary {
  [key: string]: number;
}

const extractVotes = (forVotesValue: string, againstVotesValue: string) => {
  const netVotesBigNumber = BigNumber.from(forVotesValue).sub(againstVotesValue);
  const netVotes = Number(utils.formatEther(netVotesBigNumber));

  return netVotes;
};

const assignRankAndCheckTies = (mappedProposals: MappedProposalIds[], targetId: string) => {
  const sortedProposals = [...mappedProposals].sort((a, b) => b.votes - a.votes);

  let currentRank = 0;
  let lastVotes: number | null = null;
  const ranks: RankDictionary = {};

  sortedProposals.forEach(proposal => {
    if (proposal.votes !== lastVotes) {
      currentRank++;
      lastVotes = proposal.votes;
    }
    ranks[proposal.id] = proposal.votes > 0 ? currentRank : 0;
  });

  const targetRank = ranks[targetId];
  const isTied = Object.values(ranks).filter(rank => rank === targetRank).length > 1;

  return { targetRank, isTied };
};

export const fetchProposalData = async (
  address: string,
  chainId: number,
  submission: string,
): Promise<Proposal | null> => {
  try {
    const { abi } = await getContestContractVersion(address, chainId);

    if (!abi) return null;

    const contracts = [
      {
        address,
        abi,
        chainId,
        functionName: "getProposal",
        args: [submission],
      },
      {
        address,
        abi,
        chainId,
        functionName: "proposalVotes",
        args: [submission],
      },
      {
        address,
        abi,
        chainId,
        functionName: "proposalIsDeleted",
        args: [submission],
      },
    ];

    //@ts-ignore
    const results = (await readContracts({ contracts })) as any;
    const data = results[0].result;
    const forVotesBigInt = results[1].result[0] as bigint;
    const againstVotesBigInt = results[1].result[1] as bigint;
    const votes = extractVotes(forVotesBigInt.toString(), againstVotesBigInt.toString());

    if (votes === 0) {
      return {
        id: submission,
        authorEthereumAddress: data.author,
        content: data.description,
        isContentImage: isUrlToImage(data.description),
        exists: data.exists,
        votes,
        rank: 0,
        isTied: false,
      };
    }

    const proposalsIdsRawData = await getProposalIdsRaw(
      {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      },
      false,
    );

    const mappedProposals = proposalsIdsRawData[0].map((idData: any, index: number) => ({
      votes: extractVotes(proposalsIdsRawData[1][index].forVotes, proposalsIdsRawData[1][index].againstVotes),
      id: idData.toString(),
    })) as MappedProposalIds[];

    const { targetRank, isTied } = assignRankAndCheckTies(mappedProposals, submission);

    return {
      id: submission,
      authorEthereumAddress: data.author,
      content: data.description,
      isContentImage: isUrlToImage(data.description),
      exists: data.exists,
      votes,
      rank: targetRank,
      isTied: isTied,
    };
  } catch (error) {
    return null;
  }
};
