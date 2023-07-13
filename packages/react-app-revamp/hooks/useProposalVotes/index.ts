import { toastError } from "@components/UI/Toast";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import arrayToChunks from "@helpers/arrayToChunks";
import getContestContractVersion from "@helpers/getContestContractVersion";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { fetchEnsName, getAccount, getContract, readContract, watchContractEvent } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { chain as wagmiChain, useAccount, useProvider } from "wagmi";
import { useProposalVotesStore } from "./store";

const VOTES_PER_PAGE = 5;

export function useProposalVotes(id: number | string) {
  const { asPath } = useRouter();
  const account = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const provider = useProvider();
  const [url] = useState(asPath.split("/"));
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id,
  );
  const [address] = useState(url[3]);

  const { contestStatus } = useContestStatusStore(state => state);

  const {
    isListVotersSuccess,
    isListVotersError,
    isListVotersLoading,
    setIsListVotersLoading,
    setIsListVotersError,
    setVotesPerAddress,
    setIsListVotersSuccess,
    setIsPageVotesLoading,
    setIsPageVotesError,
    setCurrentPagePaginationVotes,
    setIndexPaginationVotesPerId,
    setTotalPagesPaginationVotes,
    setHasPaginationVotesNextPage,
  } = useProposalVotesStore(state => state);

  /**
   * Fetch all votes of a given proposals (amount of votes, + detailed list of voters and the amount of votes they casted)
   */
  async function fetchProposalVotes() {
    setIsListVotersLoading(true);
    const chainName = url[2];

    const { abi, version } = await getContestContractVersion(address, chainName);

    if (abi === null) {
      const errorMessage = "This contract doesn't exist on this chain.";
      setIsListVotersLoading(false);
      setIsListVotersError(errorMessage);
      setIsListVotersSuccess(false);
      setIsListVotersLoading(false);
      toastError(errorMessage);
      return;
    }
    try {
      const accountData = getAccount();
      const contractConfig = {
        addressOrName: address,
        contractInterface: abi,
        chainId: chainId,
      };

      const list = await readContract({
        ...contractConfig,
        chainId,
        functionName: "proposalAddressesHaveVoted",
        args: id,
      });

      const usersListWithCurrentUserFirst = Array.from(list);
      // Make sure that current user address appears first in the list
      if (accountData?.address && list.includes(accountData?.address)) {
        const indexToSwitch = list.indexOf(accountData?.address);
        const addressToBeSwitchedPositionWith = usersListWithCurrentUserFirst[0];
        usersListWithCurrentUserFirst[0] = accountData?.address;
        usersListWithCurrentUserFirst[indexToSwitch] = addressToBeSwitchedPositionWith;
      }
      // Pagination
      const totalPagesPaginationVotes = Math.ceil(list?.length / VOTES_PER_PAGE);
      setTotalPagesPaginationVotes(totalPagesPaginationVotes);
      setCurrentPagePaginationVotes(0);
      //@ts-ignore
      const paginationChunks = arrayToChunks(usersListWithCurrentUserFirst, VOTES_PER_PAGE);
      setTotalPagesPaginationVotes(paginationChunks.length);
      setIndexPaginationVotesPerId(paginationChunks);
      if (list.length > 0) await fetchVotesPage(0, paginationChunks[0], paginationChunks.length);
      setIsListVotersSuccess(true);
      setIsListVotersError(null);
      setIsListVotersLoading(false);
    } catch (e) {
      const customError = e as CustomError;

      setIsListVotersError(customError.code ?? "");
      setIsListVotersSuccess(false);
      setIsListVotersLoading(false);

      toastError("There was an error while fetching the votes", customError.message);
    }
  }

  /**
   * Fetch the data of each vote in page X
   * @param pageIndex - index of the page of votes to fetch
   * @param slice - Array of the addresses that have cast a vote for a given proposal
   * @param totalPagesPaginationVotes - total of pages in the pagination
   */
  async function fetchVotesPage(pageIndex: number, slice: Array<any>, totalPagesPaginationVotes: number) {
    setCurrentPagePaginationVotes(pageIndex);
    setIsPageVotesLoading(true);
    setIsPageVotesError(null);
    try {
      await Promise.all(
        slice.map(async (userAddress: string) => {
          await fetchVotesOfAddress(userAddress);
        }),
      );
      setIsPageVotesLoading(false);
      setIsPageVotesError(null);
      setHasPaginationVotesNextPage(pageIndex + 1 < totalPagesPaginationVotes);
    } catch (e) {
      const customError = e as CustomError;

      setIsPageVotesLoading(false);
      setIsPageVotesError(customError);
      toastError("There was an error while fetching the votes", customError.message);
    }
  }

  /**
   * Fetch the data of a votes for a given wallet
   * @param userAddress - wallet address
   */
  async function fetchVotesOfAddress(userAddress: string) {
    const chainName = asPath.split("/")[2];

    try {
      const { abi, version } = await getContestContractVersion(address, chainName);

      if (abi === null) {
        const errorMessage = "This contract doesn't exist on this chain.";
        toastError(errorMessage);
        setIsPageVotesError({ message: errorMessage });
        setIsPageVotesLoading(false);
        return;
      }

      const contractConfig = {
        addressOrName: address,
        contractInterface: abi,
        chainId,
      };

      const data = await readContract({
        ...contractConfig,
        functionName: "proposalAddressVotes",
        args: [id, userAddress],
        chainId,
      });

      const { forVotes, againstVotes } = data ?? {};

      let author;
      try {
        author = await fetchEnsName({
          address: userAddress,
          chainId: wagmiChain.mainnet.id,
        });
      } catch (error: any) {
        author = userAddress;
      }

      const displayAddress = author ?? shortenEthereumAddress(userAddress);
      // @ts-ignore
      const votes = (forVotes ? forVotes / 1e18 - againstVotes / 1e18 : data / 1e18) ?? 0;

      setVotesPerAddress({
        address: userAddress,
        value: { displayAddress, votes },
      });
    } catch (e) {
      const customError = e as CustomError;

      toastError("There was an error while fetching the votes", customError.message);
    }
  }

  useEffect(() => {
    if (account?.connector) {
      account?.connector.on("change", data => {
        //@ts-ignore
        setChainId(data.chain.id);
      });
    }
  }, [account?.connector]);

  // useEffect(() => {
  //   if (contestStatus === ContestStatus.VotingClosed) {
  //     const contract = getContract({
  //       addressOrName: asPath.split("/")[3],
  //       contractInterface: DeployedContestContract.abi,
  //     });
  //     contract.removeAllListeners();
  //   } else if (contestStatus === ContestStatus.VotingOpen) {
  //     // Only watch VoteCast events when voting is open and we are <=1h before end of voting
  //     watchContractEvent(
  //       {
  //         addressOrName: asPath.split("/")[3],
  //         contractInterface: DeployedContestContract.abi,
  //       },
  //       "VoteCast",
  //       args => {
  //         fetchVotesOfAddress(args[0]);
  //       },
  //     );
  //   }
  // }, [contestStatus]);

  useEffect(() => {
    const fetchProposalVotesAndListenForEvents = async () => {
      await fetchProposalVotes();

      const onVisibilityChangeHandler = () => {
        if (document.visibilityState === "hidden") {
          provider.removeAllListeners();
        }
      };

      document.addEventListener("visibilitychange", onVisibilityChangeHandler);

      return () => {
        document.removeEventListener("visibilitychange", onVisibilityChangeHandler);
      };
    };

    fetchProposalVotesAndListenForEvents();
  }, []);

  return {
    isLoading: isListVotersLoading,
    retry: fetchProposalVotes,
    isSuccess: isListVotersSuccess,
    isError: isListVotersError,
    fetchVotesPage: fetchVotesPage,
  };
}

export default useProposalVotes;
