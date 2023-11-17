import isUrlToImage from "@helpers/isUrlToImage";
import { readContract, readContracts } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { shuffle } from "lodash";
import { MappedProposalIds, ProposalCore, SortOptions } from "./store";

interface RankDictionary {
  [key: string]: number;
}

const checkForTiedRanks = (ranks: RankDictionary, currentRank: number): boolean => {
  let count = 0;
  Object.values(ranks).forEach(rank => {
    if (rank === currentRank) {
      count++;
    }
  });
  return count > 1;
};

export function mapResultToStringArray(result: any): string[] {
  if (Array.isArray(result)) {
    return result.map((id: bigint) => id.toString());
  } else {
    return [result.toString()];
  }
}

export function sortProposals(sortBy: SortOptions, listProposalsIds: MappedProposalIds[]): string[] {
  let sortedProposals;

  switch (sortBy) {
    case "mostRecent":
      sortedProposals = [...listProposalsIds].reverse();
      break;
    case "random":
      sortedProposals = shuffle([...listProposalsIds]);
      break;
    case "leastRecent":
      sortedProposals = [...listProposalsIds];
      break;
    case "votes":
      sortedProposals = [...listProposalsIds].sort((a, b) => b.votes - a.votes);
      break;
    default:
      sortedProposals = [...listProposalsIds];
  }

  return sortedProposals.map(proposal => proposal.id);
}

/**
 * Assign ranks to proposals based on their net votes, using a complete list of all proposals.
 * @param currentPageProposals - Proposals on the current page.
 * @param allProposalsIdsAndVotes - Array of all proposals with their IDs and votes.
 */
export function formatProposalData(
  currentPageProposals: ProposalCore[],
  allProposalsIdsAndVotes: MappedProposalIds[],
): ProposalCore[] {
  const sortedAllProposals = [...allProposalsIdsAndVotes].sort((a, b) => b.votes - a.votes);

  const ranks: RankDictionary = {};
  let currentRank = 0;
  let lastVotes: number | null = null;

  sortedAllProposals.forEach(proposal => {
    const votes = proposal.votes;
    if (votes !== lastVotes) {
      lastVotes = votes;
      if (votes > 0) {
        currentRank++;
      }
    }
    ranks[proposal.id] = votes > 0 ? currentRank : 0;
  });

  return currentPageProposals.map(proposal => {
    const proposalRank = ranks[proposal.id];
    const isTied = proposal.netVotes > 0 && checkForTiedRanks(ranks, proposalRank);

    return {
      ...proposal,
      rank: proposalRank,
      isTied: isTied,
    };
  });
}

/**
 * Transforms a single proposal's data based on its ID and result data.
 * @param id - The ID of the proposal.
 * @param voteData - The voting data of the proposal.
 * @param proposalData - The detailed data of the proposal.
 * @returns An object representing the transformed proposal data.
 */
export function transformProposalData(id: any, voteData: any, proposalData: any) {
  const voteForBigInt = voteData.result[0];
  const voteAgainstBigInt = voteData.result[1];
  const netVotesBigNumber = BigNumber.from(voteForBigInt).sub(voteAgainstBigInt);
  const netVotes = Number(utils.formatEther(netVotesBigNumber));
  const isContentImage = isUrlToImage(proposalData.description);

  return {
    id: id,
    ...proposalData,
    isContentImage: isContentImage,
    netVotes: netVotes,
  };
}

/**
 * Gets the proposal ids from the contract.
 * @param contractConfig
 * @param isLegacy
 */
export async function getProposalIdsRaw(contractConfig: any, isLegacy: boolean) {
  if (isLegacy) {
    return (await readContract({
      ...contractConfig,
      functionName: "getAllProposalIds",
      args: [],
    })) as any;
  } else {
    const contracts = [
      {
        ...contractConfig,
        functionName: "allProposalTotalVotes",
        args: [],
      },
      {
        ...contractConfig,
        functionName: "getAllDeletedProposalIds",
        args: [],
      },
    ];

    const results: any[] = await readContracts({ contracts });

    const allProposals = results[0].result[0];
    const deletedIdsArray = results[1]?.result;

    if (!deletedIdsArray) {
      return [allProposals, results[0].result[1]];
    }

    const deletedProposalSet = new Set(mapResultToStringArray(deletedIdsArray));

    const validData = allProposals.reduce(
      (
        accumulator: { validProposalIds: any[]; correspondingVotes: any[] },
        proposalId: { toString: () => string },
        index: string | number,
      ) => {
        if (!deletedProposalSet.has(proposalId.toString())) {
          accumulator.validProposalIds.push(proposalId);
          accumulator.correspondingVotes.push(results[0].result[1][index]);
        }
        return accumulator;
      },
      { validProposalIds: [], correspondingVotes: [] },
    );

    return [validData.validProposalIds, validData.correspondingVotes];
  }
}
