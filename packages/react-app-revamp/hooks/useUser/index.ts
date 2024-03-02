import { supabase } from "@config/supabase";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useUserStore } from "./store";

export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useUser() {
  const { address: userAddress } = useAccount();
  const {
    setCurrentUserQualifiedToSubmit,
    setCurrentUserAvailableVotesAmount,
    setCurrentUserTotalVotesAmount,
    setCurrentUserProposalCount,
    setCurrentuserTotalVotesCast,
    currentUserTotalVotesAmount,
    setIsCurrentUserSubmitQualificationLoading,
    setIsCurrentUserSubmitQualificationSuccess,
    setIsCurrentUserSubmitQualificationError,
    setIsCurrentUserVoteQualificationLoading,
    setIsCurrentUserVoteQualificationSuccess,
    setIsCurrentUserVoteQualificationError,
    setIsCurrentUserVotesOnProposalLoading,
    setIsCurrentUserVotesOnProposalSuccess,
    setIsCurrentUserVotesOnProposalError,
  } = useUserStore(state => state);
  const { asPath } = useRouter();
  const { chainName, address } = extractPathSegments(asPath);
  const lowerCaseChainName = chainName.replace(/\s+/g, "").toLowerCase();
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === lowerCaseChainName,
  )?.[0]?.id;

  const checkIfCurrentUserQualifyToSubmit = async (
    submissionMerkleRoot: string,
    contestMaxNumberSubmissionsPerUser: number,
  ) => {
    if (!userAddress) return;
    setIsCurrentUserSubmitQualificationLoading(true);

    const abi = await getContestContractVersion(address, chainId);
    const anyoneCanSubmit = submissionMerkleRoot === EMPTY_ROOT;

    if (!abi) {
      setIsCurrentUserSubmitQualificationError(true);
      setIsCurrentUserSubmitQualificationLoading(false);
      return;
    }

    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi.abi as any,
      chainId: chainId,
    };

    if (anyoneCanSubmit) {
      try {
        const numOfSubmittedProposalsRaw = await readContract(config, {
          ...contractConfig,
          functionName: "numSubmissions",
          args: [userAddress],
        });

        const numOfSubmittedProposals = BigNumber.from(numOfSubmittedProposalsRaw);

        if (numOfSubmittedProposals.gt(0) && numOfSubmittedProposals.gte(contestMaxNumberSubmissionsPerUser)) {
          setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
          return;
        }

        setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
        setCurrentUserQualifiedToSubmit(true);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(true);
      } catch (error) {
        setIsCurrentUserSubmitQualificationError(true);
        setCurrentUserQualifiedToSubmit(false);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(false);
      }
    } else {
      const supabaseConfig = await import("@config/supabase");
      const supabase = supabaseConfig.supabase;
      try {
        const { data } = await supabase
          .from("contest_participants_v3")
          .select("can_submit")
          .eq("user_address", userAddress)
          .eq("contest_address", address)
          .eq("network_name", lowerCaseChainName);

        if (data && data.length > 0 && data[0].can_submit) {
          const numOfSubmittedProposalsRaw = await readContract(config, {
            ...contractConfig,
            functionName: "numSubmissions",
            args: [userAddress],
          });

          const numOfSubmittedProposals = BigNumber.from(numOfSubmittedProposalsRaw);

          if (numOfSubmittedProposals.gt(0) && numOfSubmittedProposals.gte(contestMaxNumberSubmissionsPerUser)) {
            setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
            setIsCurrentUserSubmitQualificationLoading(false);
            setIsCurrentUserSubmitQualificationSuccess(true);
            return;
          }

          setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
          setCurrentUserQualifiedToSubmit(true);
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
        } else {
          setCurrentUserQualifiedToSubmit(false);
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
        }
      } catch (error) {
        console.error("Error performing lookup in 'contest_participants_v3':", error);
        setIsCurrentUserSubmitQualificationError(true);
        setCurrentUserQualifiedToSubmit(false);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(false);
      }
    }
  };

  /**
   * Check if the current user qualify to vote for this contest
   */
  async function checkIfCurrentUserQualifyToVote() {
    if (!userAddress) return;

    setIsCurrentUserVoteQualificationLoading(true);

    try {
      // Perform a lookup in the 'contest_participants_v3' table.
      const { data } = await supabase
        .from("contest_participants_v3")
        .select("num_votes")
        .eq("user_address", userAddress)
        .eq("contest_address", address)
        .eq("network_name", lowerCaseChainName);

      if (data && data.length > 0 && data[0].num_votes > 0) {
        const abi = await getContestContractVersion(address, chainId);
        if (!abi) return;

        const contractConfig = {
          address: address as `0x${string}`,
          abi: abi.abi as Abi,
          chainId: chainId,
        };

        const currentUserTotalVotesCast = await readContract(config, {
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          args: [userAddress],
        });

        const userVotes = data[0].num_votes;

        //@ts-ignore
        const castVotes = BigNumber.from(currentUserTotalVotesCast) / 1e18;

        if (castVotes > 0) {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes - castVotes);
          setCurrentuserTotalVotesCast(castVotes);
          setIsCurrentUserVoteQualificationSuccess(true);
          setIsCurrentUserVoteQualificationLoading(false);
        } else {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes);
          setCurrentuserTotalVotesCast(castVotes);
          setIsCurrentUserVoteQualificationSuccess(true);
          setIsCurrentUserVoteQualificationLoading(false);
        }
      } else {
        setCurrentUserTotalVotesAmount(0);
        setCurrentUserAvailableVotesAmount(0);
        setCurrentuserTotalVotesCast(0);
        setIsCurrentUserVoteQualificationSuccess(true);
        setIsCurrentUserVoteQualificationLoading(false);
      }
    } catch (error) {
      console.error("Error performing lookup in 'contest_participants_v3':", error);
      setCurrentUserTotalVotesAmount(0);
      setCurrentUserAvailableVotesAmount(0);
      setCurrentuserTotalVotesCast(0);
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationLoading(false);
      setIsCurrentUserVoteQualificationSuccess(false);
    }
  }

  /**
   * Update the amount of votes casted in this contest by the current user
   */
  async function updateCurrentUserVotes() {
    const abi = await getContestContractVersion(address, chainId);
    setIsCurrentUserVoteQualificationLoading(true);

    if (!abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    try {
      const currentUserTotalVotesCastRaw = await readContract(config, {
        address: address as `0x${string}`,
        abi: abi.abi as Abi,
        functionName: "contestAddressTotalVotesCast",
        args: [userAddress],
      });

      const currentUserTotalVotesCast = BigNumber.from(currentUserTotalVotesCastRaw);

      //@ts-ignore
      setCurrentUserAvailableVotesAmount(currentUserTotalVotesAmount - currentUserTotalVotesCast / 1e18);
      //@ts-ignore
      setCurrentuserTotalVotesCast(currentUserTotalVotesCast / 1e18);
      setIsCurrentUserVoteQualificationSuccess(true);
      setIsCurrentUserVoteQualificationLoading(false);
    } catch (e) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
    }
  }

  /**
   * Update the amount of votes casted in proposal by the current user
   */
  async function updateCurrentUserVotesOnProposal(proposalId: string) {
    if (!userAddress) return;
    setIsCurrentUserVotesOnProposalLoading(true);

    const abi = await getContestContractVersion(address, chainId);

    if (!abi) {
      setIsCurrentUserVotesOnProposalError(true);
      setIsCurrentUserVotesOnProposalSuccess(false);
      setIsCurrentUserVotesOnProposalLoading(false);
      return;
    }

    try {
      const currentUserVotesOnProposalRaw = (await readContract(config, {
        address: address as `0x${string}`,
        abi: abi.abi as Abi,
        functionName: "proposalAddressVotes",
        args: [proposalId, userAddress],
      })) as [bigint, bigint];

      const currentUserPositiveVotesOnProposal = BigNumber.from(currentUserVotesOnProposalRaw[0]);
      const currentUserNegativeVotesOnProposal = BigNumber.from(currentUserVotesOnProposalRaw[1]);

      const currentUserVotesOnProposal = currentUserPositiveVotesOnProposal.sub(currentUserNegativeVotesOnProposal);

      //@ts-ignore
      setCurrentUserVotesOnProposal(currentUserVotesOnProposal / 1e18);

      setIsCurrentUserVotesOnProposalSuccess(true);
      setIsCurrentUserVotesOnProposalLoading(false);
    } catch (error) {
      setIsCurrentUserVotesOnProposalError(true);
      setIsCurrentUserVotesOnProposalSuccess(false);
      setIsCurrentUserVotesOnProposalLoading(false);
    }
  }

  return {
    checkIfCurrentUserQualifyToVote,
    checkIfCurrentUserQualifyToSubmit,
    updateCurrentUserVotes,
    updateCurrentUserVotesOnProposal,
  };
}

export default useUser;
