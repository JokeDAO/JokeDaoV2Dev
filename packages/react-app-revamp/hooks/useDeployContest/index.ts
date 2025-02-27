import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import { MAX_ROWS } from "@helpers/csvConstants";
import { isSupabaseConfigured } from "@helpers/database";
import { getEthersSigner } from "@helpers/ethers";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { isR2Configured } from "@helpers/r2";
import useV3ContestsIndex, { ContestValues } from "@hooks/useContestsIndexV3";
import { useContractFactoryStore } from "@hooks/useContractFactory";
import useEmailSignup from "@hooks/useEmailSignup";
import { useError } from "@hooks/useError";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { differenceInSeconds, getUnixTime } from "date-fns";
import { ContractFactory } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { loadFileFromBucket, saveFileToBucket } from "lib/buckets";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { checkIfChainIsTestnet } from "lib/monetization";
import { canUploadLargeAllowlist } from "lib/vip";
import { Abi, parseEther } from "viem";
import { useAccount } from "wagmi";
import { EntryPreviewConfig, MetadataField, useDeployContestStore } from "./store";
import { SplitFeeDestinationType, SubmissionMerkle, VoteType, VotingMerkle } from "./types";

export const MAX_SUBMISSIONS_LIMIT = 1000;
export const JK_LABS_SPLIT_DESTINATION_DEFAULT = "0xDc652C746A8F85e18Ce632d97c6118e8a52fa738";

const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useDeployContest() {
  const { indexContestV3 } = useV3ContestsIndex();
  const { subscribeUser, checkIfEmailExists } = useEmailSignup();
  const stateContestDeployment = useContractFactoryStore(state => state);
  const {
    title,
    prompt,
    contestType,
    submissionOpen,
    votingOpen,
    votingClose,
    votingMerkle: votingMerkleData,
    submissionMerkle: submissionMerkleData,
    customization,
    advancedOptions,
    setDeployContestData,
    votingRequirements,
    metadataFields,
    entryPreviewConfig,
    emailSubscriptionAddress,
    charge,
    setIsLoading,
    setIsSuccess,
  } = useDeployContestStore(state => state);
  const { error, handleError } = useError();
  const { address, chain } = useAccount();

  async function deployContest() {
    const signer = await getEthersSigner(config, { chainId: chain?.id });
    const isSpoofingDetected = await checkForSpoofing(signer?._address);

    if (isSpoofingDetected) {
      stateContestDeployment.setIsLoading(false);
      toastError("Spoofing detected! None shall pass.");
      setIsLoading(false);
      return;
    }

    stateContestDeployment.setIsLoading(true);
    stateContestDeployment.setIsSuccess(false);
    stateContestDeployment.setError("");
    setIsLoading(true);

    toastLoading("contest is deploying...");
    try {
      const factoryCreateContest = new ContractFactory(
        DeployedContestContract.abi,
        DeployedContestContract.bytecode,
        signer,
      );
      const combinedPrompt = new URLSearchParams({
        type: contestType,
        summarize: prompt.summarize,
        evaluateVoters: prompt.evaluateVoters,
        contactDetails: prompt.contactDetails ?? "",
        imageUrl: prompt.imageUrl ?? "",
      }).toString();

      const votingMerkle = votingMerkleData.prefilled || votingMerkleData.csv;
      const submissionMerkle = submissionMerkleData;
      const { type: chargeType, percentageToCreator } = charge;
      const { merkleRoot: submissionMerkleRoot = EMPTY_ROOT } = submissionMerkle || {};

      const { merkleRoot: votingMerkleRoot = EMPTY_ROOT } = votingMerkle || {};
      const { allowedSubmissionsPerUser, maxSubmissions } = customization;
      let jkLabsSplitDestination = "";

      // Handle allowedSubmissionsPerUser and maxSubmissions in case they are not set, they are zero, or we pass "infinity" to the contract
      const finalAllowedSubmissionsPerUser =
        !isNaN(allowedSubmissionsPerUser) && allowedSubmissionsPerUser > 0
          ? allowedSubmissionsPerUser
          : MAX_SUBMISSIONS_LIMIT;
      const finalMaxSubmissions = !isNaN(maxSubmissions) && maxSubmissions > 0 ? maxSubmissions : MAX_SUBMISSIONS_LIMIT;

      try {
        jkLabsSplitDestination = await getJkLabsSplitDestinationAddress(chain?.id ?? 0, {
          costToPropose: chargeType.costToPropose,
          costToVote: chargeType.costToVote,
        });
      } catch (error) {
        toastError("Failed to fetch JK Labs split destination. Please try again later.");
        stateContestDeployment.setIsLoading(false);
        setIsLoading(false);
        return;
      }

      const intConstructorArgs = {
        contestStart: getUnixTime(submissionOpen),
        votingDelay: differenceInSeconds(votingOpen, submissionOpen),
        votingPeriod: differenceInSeconds(votingClose, votingOpen),
        numAllowedProposalSubmissions: finalAllowedSubmissionsPerUser,
        maxProposalCount: finalMaxSubmissions,
        downvotingAllowed: 0,
        sortingEnabled: 1,
        rankLimit: advancedOptions.rankLimit,
        percentageToCreator: percentageToCreator,
        costToPropose: parseEther(chargeType.costToPropose.toString()),
        costToVote: parseEther(chargeType.costToVote.toString()),
        payPerVote: charge.voteType === VoteType.PerVote ? 1 : 0,
      };

      const constructorArgs = {
        intConstructorArgs,
        creatorSplitDestination:
          charge.splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet
            ? signer._address
            : charge.splitFeeDestination.type === SplitFeeDestinationType.NoSplit
              ? jkLabsSplitDestination || JK_LABS_SPLIT_DESTINATION_DEFAULT
              : charge.splitFeeDestination.address,
        jkLabsSplitDestination: jkLabsSplitDestination || JK_LABS_SPLIT_DESTINATION_DEFAULT,
        metadataFieldsSchema: createMetadataFieldsSchema(metadataFields),
      };

      const contractContest = await factoryCreateContest.deploy(
        title,
        combinedPrompt,
        submissionMerkleRoot,
        votingMerkleRoot,
        constructorArgs,
      );

      const transactionPromise = contractContest.deployTransaction.wait();

      // Wait for transaction to be executed
      await transactionPromise;

      const receiptDeployContest = await waitForTransactionReceipt(config, {
        chainId: chain?.id,
        hash: contractContest.deployTransaction.hash as `0x${string}`,
      });

      const sortingEnabled = await isSortingEnabled(contractContest.address, chain?.id ?? 0);

      setDeployContestData(
        chain?.name ?? "",
        chain?.id ?? 0,
        receiptDeployContest.transactionHash,
        contractContest.address.toLowerCase(),
        sortingEnabled,
      );

      let votingReqDatabaseEntry = null;
      let submissionReqDatabaseEntry = null;

      if (votingMerkleData.prefilled) {
        votingReqDatabaseEntry = {
          type: votingRequirements.type,
          tokenAddress: votingRequirements.tokenAddress,
          chain: votingRequirements.chain,
          description: `${votingRequirements.powerValue} per ${votingRequirements.powerType}`,
          minTokensRequired: votingRequirements.minTokensRequired,
          timestamp: votingRequirements.timestamp,
        };
      }

      const contestData = {
        title: title,
        type: contestType,
        prompt: combinedPrompt,
        datetimeOpeningSubmissions: submissionOpen,
        datetimeOpeningVoting: votingOpen,
        datetimeClosingVoting: votingClose,
        contractAddress: contractContest.address.toLowerCase(),
        votingMerkleRoot: votingMerkle?.merkleRoot ?? EMPTY_ROOT,
        submissionMerkleRoot: submissionMerkle?.merkleRoot ?? EMPTY_ROOT,
        authorAddress: address,
        networkName: chain?.name.toLowerCase().replace(" ", "") ?? "",
        voting_requirements: votingReqDatabaseEntry,
        cost_to_propose: chargeType.costToPropose,
        cost_to_vote: chargeType.costToVote,
        percentage_to_creator: percentageToCreator,
      };

      await subscribeToEmail(emailSubscriptionAddress);
      await saveFilesToBucket(votingMerkle, submissionMerkle);
      await indexContest(contestData, votingMerkle, submissionMerkle);

      toastSuccess("contest has been deployed!");
      setIsSuccess(true);
      setIsLoading(false);
      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setIsSuccess(true);
    } catch (e) {
      handleError(e, "Something went wrong and the contest couldn't be deployed.");
      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setError(error);
      setIsLoading(false);
    }
  }

  async function saveFilesToBucket(votingMerkle: VotingMerkle | null, submissionMerkle: SubmissionMerkle | null) {
    if (!isR2Configured) {
      throw new Error("R2 is not configured");
    }

    const tasks: Promise<void>[] = [];

    if (votingMerkle && !(await checkExistingFileInBucket(votingMerkle.merkleRoot))) {
      tasks.push(
        saveFileToBucket({
          fileId: votingMerkle.merkleRoot,
          content: formatRecipients(votingMerkle.voters),
        }),
      );
    }

    if (submissionMerkle && !(await checkExistingFileInBucket(submissionMerkle.merkleRoot))) {
      tasks.push(
        saveFileToBucket({
          fileId: submissionMerkle.merkleRoot,
          content: formatRecipients(submissionMerkle.submitters),
        }),
      );
    }

    try {
      await Promise.all(tasks);
    } catch (e) {
      handleError(e, "Something went wrong while saving files to bucket.");
      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setError(error);
      setIsLoading(false);
      throw e;
    }
  }

  async function subscribeToEmail(emailAddress: string) {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured");
    }

    if (!emailAddress) {
      return;
    }

    const emailExists = await checkIfEmailExists(emailAddress, false);

    if (emailExists) {
      return;
    }

    await subscribeUser(emailAddress, address, false);
  }

  async function checkExistingFileInBucket(fileId: string): Promise<boolean> {
    try {
      const existingData = await loadFileFromBucket({ fileId });
      return !!(existingData && existingData.length > 0);
    } catch (e) {
      return false;
    }
  }

  async function indexContest(
    contestData: ContestValues,
    votingMerkle: VotingMerkle | null,
    submissionMerkle: SubmissionMerkle | null,
  ) {
    const participantsWorker = new Worker(new URL("/workers/indexContestParticipants", import.meta.url));

    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase is not configured");
      }

      const tasks = [];

      tasks.push(indexContestV3(contestData));

      const workerData = {
        contestData,
        votingMerkle,
        submissionMerkle,
      };

      const workerTask = new Promise<void>((resolve, reject) => {
        participantsWorker.onmessage = event => {
          if (event.data.success) {
            resolve();
          } else {
            reject(new Error(event.data.error));
          }
        };

        participantsWorker.onerror = error => {
          stateContestDeployment.setIsLoading(false);
          stateContestDeployment.setError(error.message);
          setIsLoading(false);
          toastError(`contest deployment failed to index in db`, error.message);
          reject(error);
        };

        participantsWorker.postMessage(workerData);
      });

      tasks.push(workerTask);

      await Promise.all(tasks);
    } catch (e: any) {
      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setError(e.message);
      setIsLoading(false);
      toastError(`contest deployment failed to index in db`, e.message);
      throw e;
    } finally {
      participantsWorker.terminate();
    }
  }

  async function checkForSpoofing(address: string) {
    const votingMerkle = votingMerkleData.prefilled || votingMerkleData.csv;
    const submissionMerkle = submissionMerkleData;

    const exceedsVotingMaxRows = votingMerkle && votingMerkle.voters.length > MAX_ROWS;
    const exceedsSubmissionMaxRows = submissionMerkle && submissionMerkle.submitters.length > MAX_ROWS;

    let isVotingAllowListed = false;
    let isSubmissionAllowListed = false;

    if (exceedsVotingMaxRows) {
      isVotingAllowListed = await canUploadLargeAllowlist(address, votingMerkle.voters.length);
      if (!isVotingAllowListed) {
        return true;
      }
    }

    if (exceedsSubmissionMaxRows) {
      isSubmissionAllowListed = await canUploadLargeAllowlist(address, submissionMerkle.submitters.length);
      if (!isSubmissionAllowListed) {
        return true;
      }
    }

    return false;
  }

  async function isSortingEnabled(address: string, chainId: number) {
    try {
      const { abi } = await getContestContractVersion(address as `0x${string}`, chainId);

      if (!abi) {
        console.error("ABI not found");
        return false;
      }

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi as Abi,
        chainId: chainId,
      };

      const result = (await readContract(config, {
        ...contractConfig,
        functionName: "sortingEnabled",
      })) as number;

      return Number(result) === 1;
    } catch (error) {
      console.error("error in isSortingEnabled:", error);
      return false;
    }
  }

  async function getJkLabsSplitDestinationAddress(
    chainId: number,
    chargeType: { costToPropose: number; costToVote: number },
  ): Promise<string> {
    const chain = chains.find(c => c.id === chainId);
    // check if either costToPropose or costToVote is 0 ( this means no monetization )
    if (chargeType.costToPropose === 0 || chargeType.costToVote === 0) {
      return "";
    }

    if (!chain) {
      throw new Error(`Chain with id ${chainId} not found`);
    }

    if (checkIfChainIsTestnet(chain.name)) {
      return JK_LABS_SPLIT_DESTINATION_DEFAULT;
    }

    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured");
    }

    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const chainName = chain.name;

    const { data, error } = await supabase
      .from("chain_params")
      .select("jk_labs_split_destination")
      .eq("network_name", chainName.toLowerCase())
      .single();

    if (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }

    if (!data) {
      throw new Error(`No data found for chain ${chainName}`);
    }

    return data.jk_labs_split_destination;
  }

  function createMetadataFieldsSchema(metadataFields: MetadataField[]): string {
    // start with an object that has a 'string' property initialized with the entry preview prompt
    const initialSchema: Record<string, string | string[]> = {
      string: getEntryPreviewPrompt(entryPreviewConfig),
    };

    const schema = metadataFields
      .filter(field => field.prompt.trim() !== "")
      .reduce<Record<string, string | string[]>>((acc, field) => {
        const metadataType = field.metadataType;
        const prompt = field.prompt.trim();

        if (acc[metadataType]) {
          if (Array.isArray(acc[metadataType])) {
            (acc[metadataType] as string[]).push(prompt);
          } else {
            acc[metadataType] = [acc[metadataType] as string, prompt];
          }
        } else {
          acc[metadataType] = prompt;
        }

        return acc;
      }, initialSchema);

    // ensure 'string' is always an array
    if (!Array.isArray(schema.string)) {
      schema.string = [schema.string];
    }

    return JSON.stringify(schema);
  }

  function getEntryPreviewPrompt(config: EntryPreviewConfig): string {
    const { preview, isAdditionalDescriptionEnabled } = config;
    const descriptionSuffix = isAdditionalDescriptionEnabled ? "_DESCRIPTION_ENABLED" : "_DESCRIPTION_NOT_ENABLED";
    return `${preview}${descriptionSuffix}`;
  }

  // Helper function to format recipients (either voters or submitters)
  function formatRecipients(recipients: Recipient[]): Recipient[] {
    return recipients.map(recipient => ({
      ...recipient,
      numVotes: formatUnits(recipient.numVotes, 18),
    }));
  }

  return {
    deployContest,
  };
}
