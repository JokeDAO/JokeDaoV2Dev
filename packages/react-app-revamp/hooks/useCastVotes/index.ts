import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { Charge, VoteType } from "@hooks/useDeployContest/types";
import { useError } from "@hooks/useError";
import { useFetchUserVotesOnProposal } from "@hooks/useFetchUserVotesOnProposal";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { useReleasableRewards } from "@hooks/useReleasableRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { readContract, simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { parseUnits } from "ethers/lib/utils";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useCastVotesStore } from "./store";
import { useEmailSend } from "@hooks/useEmailSend";
import { EmailType, VotingEmailParams } from "lib/email/types";
import { FOOTER_LINKS } from "@config/links";
import moment from "moment";

interface UserAnalyticsParams {
  contestAddress: string;
  userAddress: `0x${string}` | undefined;
  chainName: string;
  pickedProposal: string | null;
  amountOfVotes: number;
  costToVote: bigint | undefined;
  charge: Charge | null;
}

interface RewardsAnalyticsParams {
  isEarningsTowardsRewards: boolean;
  address: string;
  rewardsModuleAddress: string;
  charge: Charge | null;
  chainName: string;
  costToVote: bigint | undefined;
  operation: "deposit" | "withdraw";
  token_address: string | null;
}

interface CombinedAnalyticsParams extends UserAnalyticsParams, RewardsAnalyticsParams {}

export function useCastVotes() {
  const {
    charge,
    contestAbi: abi,
    version,
    votesClose,
    anyoneCanVote,
    rewardsModuleAddress,
    rewardsAbi,
  } = useContestStore(state => state);
  const rewardsStore = useRewardsStore(state => state);
  const { updateProposal } = useProposal();
  const { listProposalsData } = useProposalStore(state => state);
  const {
    castPositiveAmountOfVotes,
    pickedProposal,
    isLoading,
    isSuccess,
    error,
    setIsLoading,
    setIsSuccess,
    setError,
    setTransactionData,
  } = useCastVotesStore(state => state);
  const { address: userAddress, chain } = useAccount();
  const asPath = usePathname();
  const { updateCurrentUserVotes } = useUser();
  const { currentUserTotalVotesAmount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const { error: errorMessage, handleError } = useError();
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const { retry: refetchTotalVotesCastOnContest } = useTotalVotesCastOnContest(contestAddress, chainId);
  const { refetch: refetchCurrentUserVotesOnProposal } = useFetchUserVotesOnProposal(
    contestAddress,
    pickedProposal ?? "",
  );
  const isEarningsTowardsRewards = rewardsModuleAddress === charge?.splitFeeDestination.address;
  const { refetch: refetchReleasableRewards } = useReleasableRewards({
    contractAddress: rewardsModuleAddress,
    chainId,
    abi: rewardsAbi ?? [],
    rankings: rewardsStore.rewards.payees,
  });
  const { sendEmail } = useEmailSend();
  const formattedVotesClose = moment(votesClose).format("MMMM Do, h:mm a");
  const contestLink = `${window.location.origin}/contest/${contestAddress}`;

  const calculateChargeAmount = (amountOfVotes: number) => {
    if (!charge) return undefined;

    if (charge.voteType === VoteType.PerTransaction) {
      return BigInt(charge.type.costToVote);
    }

    const totalCost = BigInt(amountOfVotes) * BigInt(charge.type.costToVote);

    return totalCost;
  };

  const formatChargeAmount = (amount: number) => {
    return Number(formatEther(BigInt(amount)));
  };

  async function castVotes(amountOfVotes: number, isPositive: boolean) {
    toastLoading("votes are deploying...");
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);

    try {
      const { proofs, isVerified } = await getProofs(userAddress ?? "", "vote", currentUserTotalVotesAmount.toString());
      const costToVote = calculateChargeAmount(amountOfVotes);
      const totalVoteAmount = anyoneCanVote ? 0 : parseUnits(currentUserTotalVotesAmount.toString());

      let hash: `0x${string}`;
      let request;

      if (!isVerified) {
        const { request: simulatedRequest } = await simulateContract(config, {
          address: contestAddress as `0x${string}`,
          abi: abi ? abi : DeployedContestContract.abi,
          chainId,
          functionName: "castVote",
          args: [pickedProposal, isPositive ? 0 : 1, totalVoteAmount, parseUnits(amountOfVotes.toString()), proofs],
          //@ts-ignore
          value: costToVote,
        });
        request = simulatedRequest;
      } else {
        const { request: simulatedRequest } = await simulateContract(config, {
          address: contestAddress as `0x${string}`,
          abi: abi ? abi : DeployedContestContract.abi,
          chainId,
          functionName: "castVoteWithoutProof",
          args: [pickedProposal, isPositive ? 0 : 1, parseUnits(`${amountOfVotes}`)],
          //@ts-ignore
          value: costToVote,
        });
        request = simulatedRequest;
      }

      hash = await writeContract(config, request);

      const receipt = await waitForTransactionReceipt(config, {
        chainId,
        hash: hash,
      });

      await performAnalytics({
        contestAddress,
        userAddress,
        chainName,
        pickedProposal,
        amountOfVotes,
        costToVote,
        charge,
        isEarningsTowardsRewards,
        address: contestAddress,
        rewardsModuleAddress,
        operation: "deposit",
        token_address: null,
      });

      setTransactionData({
        hash: receipt.transactionHash,
      });

      const voteResponse = (await readContract(config, {
        address: contestAddress as `0x${string}`,
        abi: DeployedContestContract.abi,
        functionName: "proposalVotes",
        args: [pickedProposal],
      })) as bigint[];

      const forVotes = voteResponse[0] as bigint;
      const againstVotes = voteResponse[1] as bigint;
      const finalVotes = forVotes - againstVotes;
      const votes = Number(formatEther(finalVotes));
      const existingProposal = listProposalsData.find(proposal => proposal.id === pickedProposal);

      if (existingProposal) {
        updateProposal(
          {
            ...existingProposal,
            netVotes: votes,
          },
          listProposalsData,
        );
      }

      await updateCurrentUserVotes(abi, version, anyoneCanVote);
      refetchTotalVotesCastOnContest();
      refetchCurrentUserVotesOnProposal();
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess("your votes have been deployed successfully");

      await sendVotingEmail({
        contest_link: contestLink,
        contest_end_date: formattedVotesClose,
      });
    } catch (e) {
      handleError(e, "something went wrong while casting your votes");
      setError(errorMessage);
      setIsLoading(false);
      throw e;
    }
  }

  async function addUserActionAnalytics(params: UserAnalyticsParams) {
    try {
      await addUserActionForAnalytics({
        contest_address: params.contestAddress,
        user_address: params.userAddress,
        network_name: params.chainName,
        proposal_id: params.pickedProposal !== null ? params.pickedProposal : undefined,
        vote_amount: params.amountOfVotes,
        created_at: Math.floor(Date.now() / 1000),
        amount_sent: params.costToVote ? formatChargeAmount(parseFloat(params.costToVote.toString())) : null,
        percentage_to_creator: params.charge ? params.charge.percentageToCreator : null,
      });
    } catch (error) {
      console.error("Error in addUserActionForAnalytics:", error);
    }
  }

  async function updateRewardAnalyticsIfNeeded(params: RewardsAnalyticsParams) {
    if (params.isEarningsTowardsRewards && params.costToVote && params.charge) {
      try {
        await updateRewardAnalytics({
          contest_address: params.address,
          rewards_module_address: params.rewardsModuleAddress,
          network_name: params.chainName,
          amount:
            formatChargeAmount(parseFloat(params.costToVote.toString())) * (params.charge.percentageToCreator / 100),
          operation: "deposit",
          token_address: null,
          created_at: Math.floor(Date.now() / 1000),
        });
      } catch (error) {
        console.error("Error while updating reward analytics", error);
      }
      refetchReleasableRewards();
    }
  }

  async function performAnalytics(params: CombinedAnalyticsParams) {
    try {
      await addUserActionAnalytics(params);
      await updateRewardAnalyticsIfNeeded(params);
    } catch (error) {
      console.error("Error in performAnalytics:", error);
    }
  }

  async function sendVotingEmail(params: VotingEmailParams) {
    await sendEmail(userAddress ?? "", EmailType.VotingEmail, params);
  }

  return {
    setTransactionData,
    castVotes,
    isLoading,
    isSuccess,
    error,
    castPositiveAmountOfVotes,
  };
}

export default useCastVotes;
