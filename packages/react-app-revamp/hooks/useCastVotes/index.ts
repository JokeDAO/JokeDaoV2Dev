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
import useRewardsModule from "@hooks/useRewards";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { parseUnits } from "ethers";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useCastVotesStore } from "./store";

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
    canUpdateVotesInRealTime,
    charge,
    contestAbi: abi,
    anyoneCanVote,
    rewardsModuleAddress,
  } = useContestStore(state => state);
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
  const { handleRefetchBalanceRewardsModule } = useRewardsModule();

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

      if (!isVerified) {
        hash = await writeContract(config, {
          address: contestAddress as `0x${string}`,
          abi: abi ? abi : DeployedContestContract.abi,
          functionName: "castVote",
          args: [pickedProposal, isPositive ? 0 : 1, totalVoteAmount, parseUnits(amountOfVotes.toString()), proofs],
          //@ts-ignore
          value: costToVote,
        });
      } else {
        hash = await writeContract(config, {
          address: contestAddress as `0x${string}`,
          abi: abi ? abi : DeployedContestContract.abi,
          functionName: "castVoteWithoutProof",
          args: [pickedProposal, isPositive ? 0 : 1, parseUnits(`${amountOfVotes}`)],
          //@ts-ignore
          value: costToVote,
        });
      }

      const receipt = await waitForTransactionReceipt(config, {
        chainId: chain?.id,
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

      // We need this to update the votes either if there is more than 2 hours
      if (!canUpdateVotesInRealTime) {
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
      }

      await updateCurrentUserVotes(anyoneCanVote);
      refetchTotalVotesCastOnContest();
      refetchCurrentUserVotesOnProposal();
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess("your votes have been deployed successfully");
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
    if (params.isEarningsTowardsRewards && params.costToVote) {
      try {
        await updateRewardAnalytics({
          contest_address: params.address,
          rewards_module_address: params.rewardsModuleAddress,
          network_name: params.chainName,
          amount: formatChargeAmount(parseFloat(params.costToVote.toString())) / 2,
          operation: "deposit",
          token_address: null,
          created_at: Math.floor(Date.now() / 1000),
        });

        handleRefetchBalanceRewardsModule();
      } catch (error) {
        console.error("Error while updating reward analytics", error);
      }
    }
  }

  async function performAnalytics(params: CombinedAnalyticsParams) {
    await Promise.all([addUserActionAnalytics(params), updateRewardAnalyticsIfNeeded(params)]);
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
