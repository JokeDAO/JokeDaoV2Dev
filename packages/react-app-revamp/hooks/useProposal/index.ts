import { toastError } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import arrayToChunks from "@helpers/arrayToChunks";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useError } from "@hooks/useError";
import { readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { COMMENTS_VERSION } from "lib/proposal";
import { shuffle, sortBy as sortUnique } from "lodash";
import { usePathname } from "next/navigation";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { MappedProposalIds, ProposalCore, SortOptions, useProposalStore } from "./store";
import {
  formatProposalData,
  getProposalIdsRaw,
  sortProposals,
  transformProposalData,
  updateAndRankProposals,
} from "./utils";
import { Result } from "ethers";

export const PROPOSALS_PER_PAGE = 12;

interface ContractConfig {
  address: `0x${string}`;
  abi: any;
  chainId: number;
}

export function useProposal() {
  const {
    setCurrentPagePaginationProposals,
    setIsPageProposalsLoading,
    setIsPageProposalsError,
    setHasPaginationProposalsNextPage,
    setProposalData,
    setIsListProposalsLoading,
    setIsListProposalsSuccess,
    listProposalsData,
    setListProposalsIds,
    setSubmissionsCount,
    submissionsCount,
    setTotalPagesPaginationProposals,
    setIndexPaginationProposalPerId,
    setInitialMappedProposalIds,
    initialMappedProposalIds,
    setSortBy,
  } = useProposalStore(state => state);
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const { chain } = useAccount();
  const { error, handleError } = useError();
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;

  async function getContractConfig(): Promise<{ contractConfig: ContractConfig; version: string } | null> {
    const { abi, version } = await getContestContractVersion(address, chainId);

    if (abi === null) {
      const errorMsg = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
      toastError(errorMsg);
      setIsPageProposalsError(errorMsg);
      return null;
    }

    return {
      contractConfig: {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      },
      version,
    };
  }

  /**
   * Fetch the data of each proposals in page X
   * @param pageIndex - index of the page of proposals to fetch
   * @param slice - Array of proposals ids to be fetched
   * @param totalPagesPaginationProposals - total of pages in the pagination
   * @param sorting - boolean to know if we need to sort the proposals
   */
  async function fetchProposalsPage(
    pageIndex: number,
    slice: Array<any>,
    totalPagesPaginationProposals: number,
    pageMappedProposals: MappedProposalIds[],
    sorting?: boolean,
  ) {
    setCurrentPagePaginationProposals(pageIndex);
    setIsPageProposalsLoading(true);
    setIsPageProposalsError("");

    try {
      const contractConfigResult = await getContractConfig();

      if (!contractConfigResult) return;

      const { contractConfig, version } = contractConfigResult;

      const commentsAllowed = compareVersions(version, COMMENTS_VERSION) == -1 ? false : true;

      const contracts: any[] = [];

      for (const id of slice) {
        contracts.push(
          {
            ...contractConfig,
            functionName: "getProposal",
            args: [id],
          },
          {
            ...contractConfig,
            functionName: "proposalVotes",
            args: [id],
          },
        );

        if (commentsAllowed) {
          contracts.push({
            ...contractConfig,
            functionName: "getProposalComments",
            args: [id],
          });
        }
      }

      if (commentsAllowed) {
        contracts.push({
          ...contractConfig,
          functionName: "getAllDeletedCommentIds",
          args: [],
        });
      }

      const results = await readContracts(config, { contracts });

      structureAndRankProposals(results, slice, pageMappedProposals, sorting);

      setIsPageProposalsLoading(false);
      setIsPageProposalsError("");
      setHasPaginationProposalsNextPage(pageIndex + 1 < totalPagesPaginationProposals);
    } catch (e) {
      handleError(e, "Something went wrong while getting proposals.");
      setIsPageProposalsError(error);
      setIsPageProposalsLoading(false);
    }
  }
  /**
   * Fetch the list of proposals ids for this contest, order them by votes and set up pagination
   * @param abi - ABI to use
   */
  async function fetchProposalsIdsList(abi: any, contestDates: { submissionOpen: Date; votesOpen: Date }) {
    setIsListProposalsLoading(true);

    try {
      const useLegacyGetAllProposalsIdFn =
        abi?.filter((el: { name: string }) => el.name === "allProposalTotalVotes")?.length > 0 ? false : true;

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      };

      const proposalsIdsRawData = await getProposalIdsRaw(contractConfig, useLegacyGetAllProposalsIdFn);

      let proposalsIds: string[];
      let mappedProposals: MappedProposalIds[] = [];
      const currentDate = new Date();

      if (!useLegacyGetAllProposalsIdFn) {
        const extractVotes = (index: number) => {
          const forVotesValue = BigInt(proposalsIdsRawData[1][index].forVotes);
          const againstVotesValue = BigInt(proposalsIdsRawData[1][index].againstVotes);

          const netVotes = Number(formatEther(forVotesValue - againstVotesValue));

          return netVotes;
        };

        mappedProposals = proposalsIdsRawData[0].map((data: any, index: number) => {
          const votes = extractVotes(index);
          return {
            votes: votes,
            id: data.toString(),
          };
        }) as MappedProposalIds[];

        setInitialMappedProposalIds(mappedProposals);

        if (currentDate < contestDates.votesOpen) {
          // Shuffle proposals if current date is before votesOpen
          proposalsIds = shuffle([...mappedProposals]).map(proposal => proposal.id);
          setSortBy("random");
        } else {
          proposalsIds = [...mappedProposals]
            .sort((a: { votes: number }, b: { votes: number }) => b.votes - a.votes)
            .map((proposal: { id: any }) => proposal.id);
          setSortBy("votes");
        }

        setListProposalsIds(proposalsIds as string[]);
        setSubmissionsCount(proposalsIds.length);
      } else {
        if (currentDate < contestDates.votesOpen) {
          // Shuffle proposals if current date is before votesOpen
          proposalsIds = shuffle(proposalsIdsRawData);
          setSortBy("random");
        } else {
          proposalsIds = proposalsIdsRawData;
          setSortBy("votes");
        }
        setListProposalsIds(proposalsIds as string[]);
        setSubmissionsCount(proposalsIds.length);
      }
      setIsListProposalsSuccess(true);
      setIsListProposalsLoading(false);

      // Pagination
      const totalPagesPaginationProposals = Math.ceil(proposalsIdsRawData?.length / PROPOSALS_PER_PAGE);
      setTotalPagesPaginationProposals(totalPagesPaginationProposals);
      setCurrentPagePaginationProposals(0);

      const paginationChunks = arrayToChunks(proposalsIds as string[], PROPOSALS_PER_PAGE);
      setTotalPagesPaginationProposals(paginationChunks.length);
      setIndexPaginationProposalPerId(paginationChunks);

      if (paginationChunks.length) fetchProposalsPage(0, paginationChunks[0], paginationChunks.length, mappedProposals);
    } catch (e) {
      handleError(e, "Something went wrong while getting proposal ids.");
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
    }
  }

  /**
   * Fetch a single proposal based on its ID.
   * @param proposalId - the ID of the proposal to fetch
   */
  async function fetchSingleProposal(proposalId: any) {
    try {
      const contractConfigResult = await getContractConfig();

      if (!contractConfigResult) return;

      const { contractConfig } = contractConfigResult;

      const contracts = [
        {
          ...contractConfig,
          functionName: "getProposal",
          args: [proposalId],
        },
        {
          ...contractConfig,
          functionName: "proposalVotes",
          args: [proposalId],
        },
      ];

      //@ts-ignore
      const results = await readContracts(config, { contracts });

      structureAndRankProposals(results, [proposalId], initialMappedProposalIds);
    } catch (e) {
      handleError(e, "Something went wrong while getting the proposal.");
      setIsPageProposalsError(error);
    }
  }

  /**
   * @param proposalsResults (array of proposals data)
   * @param proposalIds (array of proposals ids)
   * @param sorting (optional boolean to skip concatenation if true)
   */
  function structureAndRankProposals(
    proposalsResults: Array<any>,
    proposalIds: Array<any>,
    pageMappedProposals: MappedProposalIds[],
    sorting?: boolean,
  ) {
    const hasCommentsData = proposalsResults.length > proposalIds.length * 2;
    let deletedCommentIds: bigint[] = [];

    if (hasCommentsData) {
      deletedCommentIds = proposalsResults[proposalsResults.length - 1].result;
    }

    const transformedProposals = proposalIds.map((id, index) => {
      // indexing depends whether or not we have comments data
      const baseIndex = hasCommentsData ? index * 3 : index * 2;

      const proposalData = proposalsResults[baseIndex].result;
      const proposalVotes = proposalsResults[baseIndex + 1];
      let proposalComments: bigint[] = [];

      if (hasCommentsData) {
        proposalComments = proposalsResults[baseIndex + 2].result;
      }

      return transformProposalData(id, proposalVotes, proposalData, proposalComments, deletedCommentIds);
    });

    let combinedProposals;

    // Concatenate only if sorting is false
    if (!sorting) {
      combinedProposals = listProposalsData.concat(transformedProposals);
    } else {
      combinedProposals = transformedProposals;
    }

    const rankedProposals = formatProposalData(combinedProposals, pageMappedProposals);

    setProposalData(rankedProposals);
  }

  function updateProposal(updatedProposal: ProposalCore, existingProposalsData: ProposalCore[]) {
    const updatedProposals = existingProposalsData.map(proposal =>
      proposal.id === updatedProposal.id ? updatedProposal : proposal,
    );

    const [updatedProposalData, updatedIds] = updateAndRankProposals(updatedProposals, initialMappedProposalIds);

    setProposalData(updatedProposalData);
    setInitialMappedProposalIds(updatedIds);
  }

  function removeProposal(idsToDelete: string[]) {
    const remainingProposals = listProposalsData.filter(proposal => !idsToDelete.includes(proposal.id));

    const [updatedProposalData, updatedIds] = updateAndRankProposals(remainingProposals, initialMappedProposalIds);

    setProposalData(updatedProposalData);
    setInitialMappedProposalIds(updatedIds);
    setSubmissionsCount(submissionsCount - idsToDelete.length);
  }

  /**
   * Sort proposals by a given sorting option
   * @param sortBy - the sorting option to use
   */
  function sortProposalData(sortBy: SortOptions) {
    const sortedIds = sortProposals(sortBy, initialMappedProposalIds);

    if (listProposalsData.length === sortedIds.length) {
      const sortedProposals = sortUnique(listProposalsData, v => sortedIds.indexOf(v.id));

      setListProposalsIds(sortedIds);
      setProposalData(sortedProposals);
    } else {
      const paginationChunks = arrayToChunks(sortedIds, PROPOSALS_PER_PAGE);
      setIndexPaginationProposalPerId(paginationChunks);
      setProposalData([]);

      setListProposalsIds(sortedIds);
      fetchProposalsPage(0, paginationChunks[0], paginationChunks.length, initialMappedProposalIds, true);
    }
  }

  return {
    fetchProposalsPage,
    fetchSingleProposal,
    fetchProposalsIdsList,
    updateProposal,
    removeProposal,
    sortProposalData,
  };
}

export default useProposal;
