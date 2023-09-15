import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import arrayToChunks from "@helpers/arrayToChunks";
import getContestContractVersion from "@helpers/getContestContractVersion";
import isUrlToImage from "@helpers/isUrlToImage";
import { useContestStore } from "@hooks/useContest/store";
import { readContract, readContracts } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { Result } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { CustomError } from "types/error";
import { useNetwork } from "wagmi";
import { useProposalStore } from "./store";

const PROPOSALS_PER_PAGE = 12;

export function useProposal() {
  const {
    setCurrentPagePaginationProposals,
    setIsPageProposalsLoading,
    setIsPageProposalsError,
    setHasPaginationProposalsNextPage,
    setProposalData,
    setIsListProposalsLoading,
    setIsListProposalsSuccess,
    setListProposalsIds,
    setTotalPagesPaginationProposals,
    setIndexPaginationProposalPerId,
  } = useProposalStore(state => state);
  const { asPath } = useRouter();
  const [chainName, address] = asPath.split("/").slice(2, 4);
  const { setIsLoading, setIsSuccess, setError } = useContestStore(state => state);
  const { chain } = useNetwork();
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id;

  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
    toastError(toastMessage);
  }

  /**
   * Fetch the data of each proposals in page X
   * @param pageIndex - index of the page of proposals to fetch
   * @param slice - Array of proposals ids to be fetched
   * @param totalPagesPaginationProposals - total of pages in the pagination
   */
  async function fetchProposalsPage(pageIndex: number, slice: Array<any>, totalPagesPaginationProposals: number) {
    setCurrentPagePaginationProposals(pageIndex);
    setIsPageProposalsLoading(true);
    setIsPageProposalsError(null);

    try {
      const { abi } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMsg = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
        toastError(errorMsg);
        setIsPageProposalsError({ message: errorMsg });
        setIsPageProposalsLoading(false);
        return;
      }

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chains.find(
          c => c.name.replace(/\s+/g, "").toLowerCase() === chainName.replace(/\s+/g, "").toLowerCase(),
        )?.id,
      };

      const contracts: any[] = [];

      for (const id of slice) {
        contracts.push(
          // Proposal content
          {
            ...contractConfig,
            functionName: "getProposal",
            args: [id],
          },
          // Votes received
          {
            ...contractConfig,
            functionName: "proposalVotes",
            args: [id],
          },
        );
      }

      const results = await readContracts({ contracts });

      for (let i = 0; i < slice.length; i++) {
        await fetchProposal(i, results, slice);
      }

      setIsPageProposalsLoading(false);
      setIsPageProposalsError(null);
      setHasPaginationProposalsNextPage(pageIndex + 1 < totalPagesPaginationProposals);
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      toastError("Something went wrong while getting proposals.", customError.message);
      setIsPageProposalsError({
        code: customError.code,
        message: customError.message,
      });
      setIsPageProposalsLoading(false);
      setIsPageProposalsError(null);
    }
  }

  /**
   * Set proposal data in zustand store
   * @param i - index of the proposal id to be fetched
   * @param results - array of smart contracts calls results (returned by `readContracts`)
   * @param listIdsProposalsToBeFetched - array of proposals ids to be fetched
   */
  async function fetchProposal(i: number, results: Array<any>, listIdsProposalsToBeFetched: Array<any>) {
    // Create an array of proposals
    // A proposal is a pair of data
    // A pair of a proposal data is [content, votes]
    const proposalDataPerId = results.reduce((result, value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);

    const data = proposalDataPerId[i][0].result;

    const isContentImage = isUrlToImage(data.description) ? true : false;

    const forVotesBigInt = proposalDataPerId[i][1].result[0] as bigint;
    const againstVotesBigInt = proposalDataPerId[i][1].result[1] as bigint;
    const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
    const votes = Number(utils.formatEther(votesBigNumber));

    const proposalData = {
      authorEthereumAddress: data.author,
      content: data.description,
      isContentImage,
      exists: data.exists,
      votes,
    };

    setProposalData({ id: listIdsProposalsToBeFetched[i], data: proposalData });
  }

  /**
   * Fetch the list of proposals ids for this contest, order them by votes and set up pagination
   * @param abi - ABI to use
   */
  async function fetchProposalsIdsList(abi: any, version: string) {
    setIsListProposalsLoading(true);

    try {
      const useLegacyGetAllProposalsIdFn =
        abi?.filter((el: { name: string }) => el.name === "allProposalTotalVotes")?.length > 0 ? false : true;

      if (!chains) return;

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chains.find(
          c => c.name.replace(/\s+/g, "").toLowerCase() === chainName.replace(/\s+/g, "").toLowerCase(),
        )?.id,
      };

      const proposalsIds = await getProposalIdsRaw(contractConfig, useLegacyGetAllProposalsIdFn, version);

      setListProposalsIds(proposalsIds as string[]);
      setIsListProposalsSuccess(true);
      setIsListProposalsLoading(false);

      // Pagination
      const totalPagesPaginationProposals = Math.ceil(proposalsIds?.length / PROPOSALS_PER_PAGE);
      setTotalPagesPaginationProposals(totalPagesPaginationProposals);
      setCurrentPagePaginationProposals(0);
      //@ts-ignore
      const paginationChunks = arrayToChunks(proposalsIds, PROPOSALS_PER_PAGE);
      setTotalPagesPaginationProposals(paginationChunks.length);
      setIndexPaginationProposalPerId(paginationChunks);
      if (proposalsIds.length > 0) await fetchProposalsPage(0, paginationChunks[0], paginationChunks.length);
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      onContractError(e);
      setError(customError);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  async function getProposalIdsRaw(contractConfig: any, isLegacy: boolean, version: string) {
    if (isLegacy) {
      return (await readContract({
        ...contractConfig,
        functionName: "getAllProposalIds",
        args: [],
      })) as any;
    } else {
      const args: (boolean | number)[] =
        version.localeCompare("3.11", undefined, { numeric: true }) >= 0 ? [true, 0, 100] : [true];

      const results: any = await readContract({
        ...contractConfig,
        functionName: "sortedProposals",
        args: args,
      });

      return results.filter((value: any) => value.toString() !== "0");
    }
  }

  /**
   * Fetch a single proposal based on its ID.
   * @param proposalId - the ID of the proposal to fetch
   */
  async function fetchSingleProposal(proposalId: any) {
    try {
      const { abi } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMsg = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
        toastError(errorMsg);
        setIsPageProposalsError({ message: errorMsg });
        return;
      }

      const contractConfig: any = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chains.find(
          c => c.name.replace(/\s+/g, "").toLowerCase() === chainName.replace(/\s+/g, "").toLowerCase(),
        )?.id,
      };

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

      const results: any = await readContracts({ contracts });

      const data = results[0].result;

      const isContentImage = isUrlToImage(data.description) ? true : false;

      const forVotesBigInt = results[1].result[0] as bigint;
      const againstVotesBigInt = results[1].result[1] as bigint;
      const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
      const votes = Number(utils.formatEther(votesBigNumber));

      const proposalData = {
        authorEthereumAddress: data.author,
        content: data.description,
        isContentImage,
        exists: data.exists,
        votes,
      };

      setProposalData({ id: proposalId, data: proposalData });
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      toastError("Something went wrong while getting the proposal.", customError.message);
      setIsPageProposalsError({
        code: customError.code,
        message: customError.message,
      });
    }
  }

  return {
    fetchProposal,
    fetchProposalsPage,
    fetchProposalsIdsList,
    fetchSingleProposal,
  };
}

export default useProposal;
