import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import { isAlchemyConfigured } from "@helpers/alchemy";
import { isSupabaseConfigured } from "@helpers/database";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useError } from "@hooks/useError";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser, { EMPTY_ROOT } from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { FetchBalanceResult, readContract, readContracts } from "@wagmi/core";
import { differenceInMilliseconds, differenceInMinutes, isBefore, minutesToMilliseconds } from "date-fns";
import { BigNumber, utils } from "ethers";
import { loadFileFromBucket } from "lib/buckets";
import { fetchFirstToken, fetchNativeBalance, fetchTokenBalances } from "lib/contests";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { useRouter } from "next/router";
import { useState } from "react";
import { useContestStore } from "./store";
import { getV1Contracts } from "./v1/contracts";
import { getContracts } from "./v3v4/contracts";
import moment from "moment";

interface ContractConfigResult {
  contractConfig: {
    address: `0x${string}`;
    abi: any;
    chainId: number;
  };
  version: string;
}

interface ContractConfig {
  address: `0x${string}`;
  abi: any;
  chainId: number;
}

export function useContest() {
  const router = useRouter();
  const { asPath } = router;
  const { chainName: chainFromUrl, address: addressFromUrl } = extractPathSegments(asPath);
  const [chainName, setChainName] = useState(chainFromUrl);
  const [address, setAddress] = useState(addressFromUrl);
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainFromUrl)?.[0]?.id,
  );

  const {
    setError,
    isLoading,
    error,
    isSuccess,
    setIsSuccess,
    setIsLoading,
    setSupportsRewardsModule,
    setContestPrompt,
    setDownvotingAllowed,
    setContestName,
    setContestAuthor,
    setContestMaxProposalCount,
    setIsV3,
    setVoters,
    setSubmitters,
    setSubmissionsMerkleRoot,
    setVotingMerkleRoot,
    setTotalVotesCast,
    setTotalVotes,
    setVotesClose,
    setVotesOpen,
    setRewards,
    setSubmissionsOpen,
    setCanUpdateVotesInRealTime,
    setEntryCharge,
    setVotingRequirements,
    setSubmissionRequirements,
    setIsReadOnly,
    setIsRewardsLoading,
  } = useContestStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading, setListProposalsIds } = useProposalStore(
    state => state,
  );
  const { setContestMaxNumberSubmissionsPerUser, setIsLoading: setIsUserStoreLoading } = useUserStore(state => state);
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { fetchProposalsIdsList } = useProposal();
  const { contestStatus } = useContestStatusStore(state => state);
  const { error: errorMessage, handleError } = useError();
  const alchemyRpc = chains
    .filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.[0]
    ?.rpcUrls.default.http[0].includes("alchemy");

  // Generate config for the contract
  async function getContractConfig(): Promise<ContractConfigResult | undefined> {
    try {
      const { abi, version } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMessage = `RPC call failed`;
        setError(errorMessage);
        setIsSuccess(false);
        setIsListProposalsSuccess(false);
        setIsListProposalsLoading(false);
        setIsLoading(false);
        return;
      }

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      };

      return { contractConfig, version };
    } catch (e) {
      setError(errorMessage);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  async function fetchContestContractData(contractConfig: ContractConfig, version: number) {
    const contracts = getContracts(contractConfig, version);
    const results = await readContracts({ contracts });
    setIsV3(true);

    const closingVoteDate = new Date(Number(results[5].result) * 1000 + 1000);
    const submissionsOpenDate = new Date(Number(results[4].result) * 1000 + 1000);
    const votesOpenDate = new Date(Number(results[6].result) * 1000 + 1000);
    const isDownvotingAllowed = Number(results[9].result) === 1;
    const contestMaxNumberSubmissionsPerUser = Number(results[2].result);
    const contestMaxProposalCount = Number(results[3].result);

    if (version >= 4 && moment().isBefore(votesOpenDate)) {
      const entryChargeValue = Number(results[10].result);
      const entryChargePercentage = Number(results[11].result);

      setEntryCharge({
        costToPropose: entryChargeValue,
        percentageToCreator: entryChargePercentage,
      });
    } else {
      setEntryCharge(null);
    }

    setContestName(results[0].result as string);
    setContestAuthor(results[1].result as string, results[1].result as string);
    setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
    setContestMaxProposalCount(contestMaxProposalCount);
    setSubmissionsOpen(submissionsOpenDate);
    setVotesClose(closingVoteDate);
    setVotesOpen(votesOpenDate);
    setContestPrompt(results[8].result as string);
    setDownvotingAllowed(isDownvotingAllowed);

    // We want to track VoteCast event only 2H before the end of the contest, and only if alchemy support is enabled and if alchemy is configured
    if (isBefore(new Date(), closingVoteDate) && alchemyRpc && isAlchemyConfigured) {
      if (differenceInMinutes(closingVoteDate, new Date()) <= 120) {
        // If the difference between the closing date (end of votes) and now is <= to 2h
        // reflect this in the state
        setCanUpdateVotesInRealTime(true);
      } else {
        setCanUpdateVotesInRealTime(false);
        // Otherwise, update the state 2h before the closing date (end of votes)
        const delayBeforeVotesCanBeUpdated =
          differenceInMilliseconds(closingVoteDate, new Date()) - minutesToMilliseconds(120);
        setTimeout(() => {
          setCanUpdateVotesInRealTime(true);
        }, delayBeforeVotesCanBeUpdated);
      }
    } else {
      setCanUpdateVotesInRealTime(false);
    }

    setError("");
    setIsSuccess(true);
    setIsLoading(false);

    await fetchProposalsIdsList(contractConfig.abi, {
      submissionOpen: submissionsOpenDate,
      votesOpen: votesOpenDate,
    });
  }

  async function fetchV3ContestInfo(
    contractConfig: ContractConfig,
    contestRewardModuleAddress: string | undefined,
    version: string,
  ) {
    try {
      setIsListProposalsLoading(false);

      await Promise.all([
        fetchContestContractData(contractConfig, parseFloat(version)),
        processContestData(contractConfig),
        processRewardData(contestRewardModuleAddress),
        fetchTotalVotesCast(),
        processRequirementsData(),
      ]);
    } catch (e) {
      handleError(e, "Something went wrong while fetching the contest data.");
      setError(errorMessage);
      setIsLoading(false);
      setIsUserStoreLoading(false);
      setIsListProposalsLoading(false);
      setIsRewardsLoading(false);
    }
  }

  async function fetchV1ContestInfo(contractConfig: ContractConfig, version: string) {
    try {
      const contracts = getV1Contracts(contractConfig);
      const results = await readContracts({ contracts });

      setIsV3(false);

      const closingVoteDate = new Date(Number(results[6].result) * 1000 + 1000);
      const submissionsOpenDate = new Date(Number(results[5].result) * 1000 + 1000);
      const votesOpenDate = new Date(Number(results[7].result) * 1000 + 1000);
      const contestMaxNumberSubmissionsPerUser = Number(results[2].result);
      const contestMaxProposalCount = Number(results[3].result);

      setContestName(results[0].result as string);
      setContestAuthor(results[1].result as string, results[1].result as string);
      setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
      setContestMaxProposalCount(contestMaxProposalCount);
      setSubmissionsOpen(submissionsOpenDate);
      setVotesClose(closingVoteDate);
      setVotesOpen(votesOpenDate);

      const promptFilter = contractConfig.abi?.filter((el: { name: string }) => el.name === "prompt");
      const submissionGatingFilter = contractConfig.abi?.filter(
        (el: { name: string }) => el.name === "submissionGatingByVotingToken",
      );
      const downvotingFilter = contractConfig.abi?.filter((el: { name: string }) => el.name === "downvotingAllowed");

      if (promptFilter.length > 0) {
        const indexToCheck = submissionGatingFilter.length > 0 ? 4 : downvotingFilter.length > 0 ? 2 : 1;
        setContestPrompt(results[contracts.length - indexToCheck].result as string);
      }

      setError("");
      setIsSuccess(true);
      setIsLoading(false);

      // List of proposals for this contest
      await fetchProposalsIdsList(contractConfig.abi, {
        submissionOpen: submissionsOpenDate,
        votesOpen: votesOpenDate,
      });

      setIsListProposalsLoading(false);
    } catch (e) {
      handleError(e, "Something went wrong while fetching the contest data.");
      setError(errorMessage);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsUserStoreLoading(false);
      setIsLoading(false);
    }
  }

  /**
   * Fetch contest data from the contract, depending on the version of the contract
   */
  async function fetchContestInfo() {
    setIsLoading(true);
    setIsUserStoreLoading(true);
    const result = await getContractConfig();

    if (!result) {
      setIsLoading(false);
      setIsUserStoreLoading(false);
      return;
    }

    const { contractConfig, version } = result;

    let contestRewardModuleAddress: string | undefined;

    if (contractConfig.abi?.filter((el: { name: string }) => el.name === "officialRewardsModule").length > 0) {
      contestRewardModuleAddress = (await readContract({
        ...contractConfig,
        functionName: "officialRewardsModule",
        args: [],
      })) as any;
      if (contestRewardModuleAddress?.toString() == "0x0000000000000000000000000000000000000000") {
        setSupportsRewardsModule(false);
        contestRewardModuleAddress = undefined;
      } else {
        setSupportsRewardsModule(true);
        contestRewardModuleAddress = contestRewardModuleAddress?.toString();
      }
    } else {
      setSupportsRewardsModule(false);
      contestRewardModuleAddress = undefined;
    }

    if (contestRewardModuleAddress) {
      setIsRewardsLoading(true);
    }

    if (parseFloat(version) >= 3) {
      await fetchV3ContestInfo(contractConfig, contestRewardModuleAddress, version);
    } else {
      await fetchV1ContestInfo(contractConfig, version);
    }
  }

  /**
   * Fetch merkle tree data from DB and re-create the tree
   */
  async function processContestData(contractConfig: ContractConfig) {
    // Do not fetch merkle tree data if the contest is not using it
    if (contestStatus === ContestStatus.VotingClosed) {
      setIsUserStoreLoading(false);
      return;
    }

    const results = await readContracts({
      contracts: [
        {
          ...contractConfig,
          functionName: "submissionMerkleRoot",
          args: [],
        },
        {
          ...contractConfig,
          functionName: "votingMerkleRoot",
          args: [],
        },
        {
          ...contractConfig,
          functionName: "numAllowedProposalSubmissions",
          args: [],
        },
      ],
    });

    if (!results) {
      setIsUserStoreLoading(false);
      return;
    }

    const submissionMerkleRoot = results[0].result as unknown as string;
    const votingMerkleRoot = results[1].result as unknown as string;
    const contestMaxNumberSubmissionsPerUser = Number(results[2].result);

    setSubmissionsMerkleRoot(submissionMerkleRoot);
    setVotingMerkleRoot(votingMerkleRoot);

    if (!isSupabaseConfigured) {
      setIsReadOnly(true);
      if (submissionMerkleRoot === EMPTY_ROOT) {
        await checkIfCurrentUserQualifyToSubmit(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser);
        setIsUserStoreLoading(false);
        return;
      } else {
        setIsUserStoreLoading(false);
        return;
      }
    }

    await Promise.all([
      checkIfCurrentUserQualifyToSubmit(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser),
      checkIfCurrentUserQualifyToVote(),
    ]);

    setIsUserStoreLoading(false);

    try {
      const [votingMerkleTreeData, submissionMerkleTreeData] = await Promise.all([
        fetchDataFromBucket(votingMerkleRoot),
        submissionMerkleRoot !== EMPTY_ROOT ? fetchDataFromBucket(submissionMerkleRoot) : Promise.resolve(null),
      ]);

      const totalVotes = votingMerkleTreeData ? calculateTotalVotes(votingMerkleTreeData) : 0;

      setTotalVotes(totalVotes);
      setVoters(votingMerkleTreeData || []);
      setSubmitters(submissionMerkleTreeData || []);
    } catch (e) {
      toastError("error while fetching data from db", errorMessage);
      setIsUserStoreLoading(false);
    }
  }

  async function processRequirementsData() {
    if (!isSupabaseConfigured) return;

    const config = await import("@config/supabase");
    const supabase = config.supabase;

    try {
      const result = await supabase
        .from("contests_v3")
        .select("voting_requirements, submission_requirements")
        .eq("address", address)
        .eq("network_name", chainName);

      if (result.data) {
        const { voting_requirements, submission_requirements } = result.data[0];
        setVotingRequirements(voting_requirements || null);
        setSubmissionRequirements(submission_requirements || null);
      }
    } catch (error) {
      setVotingRequirements(null);
      setSubmissionRequirements(null);
    }
  }

  const fetchDataFromBucket = async (fileId: string): Promise<Recipient[] | null> => {
    try {
      const data = await loadFileFromBucket({ fileId });
      return data || null;
    } catch (error) {
      throw error;
    }
  };

  const calculateTotalVotes = (data: Recipient[]): number => {
    return data.reduce((sum, vote) => sum + Number(vote.numVotes), 0);
  };

  /**
   * Fetch reward data from the rewards module contract
   * @param contestRewardModuleAddress
   * @returns
   */
  async function processRewardData(contestRewardModuleAddress: string | undefined) {
    if (!contestRewardModuleAddress) return;

    const abiRewardsModule = await getRewardsModuleContractVersion(contestRewardModuleAddress, chainId);

    if (!abiRewardsModule) {
      setRewards(null);
    } else {
      const winners = (await readContract({
        address: contestRewardModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        chainId: chainId,
        functionName: "getPayees",
      })) as any[];

      let rewardToken: FetchBalanceResult | null = null;
      let erc20Tokens: any = null;

      rewardToken = await fetchNativeBalance(contestRewardModuleAddress, chainId);

      if (!rewardToken || rewardToken.value.toString() == "0") {
        try {
          erc20Tokens = await fetchTokenBalances(chainName, contestRewardModuleAddress);

          if (erc20Tokens && erc20Tokens.length > 0) {
            rewardToken = await fetchFirstToken(contestRewardModuleAddress, chainId, erc20Tokens[0].contractAddress);
          }
        } catch (e) {
          console.error("Error fetching token balances:", e);
          return;
        }
      }

      if (rewardToken) {
        setRewards({
          token: {
            symbol: rewardToken.symbol,
            value: parseFloat(utils.formatUnits(rewardToken.value, rewardToken.decimals)),
          },
          winners: winners.length,
          numberOfTokens: erc20Tokens?.length ?? 1,
        });
      } else {
        setRewards(null);
      }

      setIsRewardsLoading(false);
    }
  }

  async function fetchTotalVotesCast() {
    try {
      const result = await getContractConfig();
      if (!result) return;

      const { contractConfig } = result;

      if (!(contractConfig.abi?.filter((el: { name: string }) => el.name === "totalVotesCast").length > 0)) {
        setTotalVotesCast(-1);
        return;
      }

      const totalVotesCast = await readContract({
        ...contractConfig,
        functionName: "totalVotesCast",
        args: [],
      });

      //@ts-ignore
      setTotalVotesCast(totalVotesCast ? BigNumber.from(totalVotesCast) / 1e18 : 0);
    } catch {
      setTotalVotesCast(0);
    }
  }

  return {
    getContractConfig,
    address,
    fetchContestInfo,
    fetchTotalVotesCast,
    setIsLoading,
    chainId,
    chainName,
    setChainId,
    isLoading,
    error,
    isSuccess,
    setChainName,
    retry: fetchContestInfo,
    onSearch: (addr: string, chainName: string) => {
      setChainName(chainName);
      setChainId(chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id);
      setIsLoading(true);
      setIsListProposalsLoading(true);
      setListProposalsIds([]);
      setAddress(addr);
    },
  };
}

export default useContest;
