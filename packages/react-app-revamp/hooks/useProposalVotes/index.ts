/* eslint-disable react-hooks/exhaustive-deps */
import { config } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { readContract } from "@wagmi/core";
import { formatEther } from "ethers";
import { useEffect, useState } from "react";

export const VOTES_PER_PAGE = 5;

interface VoteEntry {
  address: string;
  votes: [bigint, bigint];
}

type VotesArray = VoteEntry[];

export function useProposalVotes(contractAddress: string, proposalId: string, chainId: number, addressPerPage = 5) {
  const { contestAbi: abi } = useContestStore(state => state);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [addressesVoted, setAddressesVoted] = useState<string[]>([]);
  const [accumulatedVotesData, setAccumulatedVotesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddressesVoted = async () => {
    try {
      const addresses = (await readContract(config, {
        address: contractAddress as `0x${string}`,
        abi: abi,
        chainId,
        functionName: "proposalAddressesHaveVoted",
        args: [proposalId],
      })) as string[];

      setTotalPages(Math.ceil(addresses.length / VOTES_PER_PAGE));
      return addresses;
    } catch (error: any) {
      setError(error.message);
    }
  };

  const fetchVotesForAddress = async (address: string): Promise<VoteEntry> => {
    try {
      const votes = (await readContract(config, {
        address: contractAddress as `0x${string}`,
        abi: abi,
        chainId,
        functionName: "proposalAddressVotes",
        args: [proposalId, address],
      })) as [bigint, bigint];

      return { address, votes };
    } catch (error: any) {
      setError(error.message);

      return { address: "", votes: [BigInt(0), BigInt(0)] };
    }
  };

  const fetchVotesPerProposal = async () => {
    setIsLoading(true);

    try {
      const adresses = await fetchAddressesVoted();
      if (!adresses) return;

      const addressesPage = adresses.slice(0, addressPerPage);
      const votesPromises = addressesPage.map((address: string) => fetchVotesForAddress(address));
      const votesArray: VotesArray = await Promise.all(votesPromises);
      const votesObj = votesArray.reduce((acc: Record<string, number>, { address, votes }: VoteEntry) => {
        const netVotes = votes[0] - votes[1];
        acc[address] = Number(formatEther(netVotes.toString()));
        return acc;
      }, {});

      setAddressesVoted(adresses);
      setAccumulatedVotesData(votesObj);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const fetchVotesPerPage = async (page: number) => {
    setIsLoading(true);

    try {
      const start = page * VOTES_PER_PAGE;
      const end = start + VOTES_PER_PAGE;
      const addressesPage = addressesVoted.slice(start, end);

      const votesPromises = addressesPage.map((address: string) => fetchVotesForAddress(address));
      const votesArray: VotesArray = await Promise.all(votesPromises);
      const votesObj = votesArray.reduce((acc: Record<string, number>, { address, votes }: VoteEntry) => {
        const netVotes = votes[0] - votes[1];
        acc[address] = Number(formatEther(netVotes.toString()));
        return acc;
      }, {});

      setAccumulatedVotesData(prev => ({ ...prev, ...votesObj }));
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchVotesPerProposal();
  };

  useEffect(() => {
    setCurrentPage(0);
    fetchVotesPerProposal();
  }, [proposalId]);

  return {
    isLoading,
    error,
    accumulatedVotesData,
    addressesVoted,
    currentPage,
    totalPages,
    setCurrentPage,
    refreshData,
    fetchVotesPerProposal,
    fetchVotesPerPage,
  };
}
