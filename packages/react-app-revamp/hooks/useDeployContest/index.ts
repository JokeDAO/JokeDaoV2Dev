import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import { isSupabaseConfigured } from "@helpers/database";
import useV3ContestsIndex, { ContestValues } from "@hooks/useContestsIndexV3";
import { useContestParticipantsIndexV3 } from "@hooks/useContestsParticipantsIndexV3";
import { useContractFactoryStore } from "@hooks/useContractFactory";
import { waitForTransaction } from "@wagmi/core";
import { differenceInSeconds, getUnixTime } from "date-fns";
import { ContractFactory, ethers } from "ethers";
import { CustomError, ErrorCodes } from "types/error";
import { useNetwork, useSigner } from "wagmi";
import { SubmissionMerkle, useDeployContestStore, VotingMerkle } from "./store";

export function useDeployContest() {
  const { indexContestV3 } = useV3ContestsIndex();
  const { indexContestParticipantsV3 } = useContestParticipantsIndexV3();
  const stateContestDeployment = useContractFactoryStore(state => state);
  const {
    type,
    title,
    summary,
    prompt,
    submissionOpen,
    votingOpen,
    votingClose,
    votingMerkle,
    submissionMerkle,
    allowedSubmissionsPerUser,
    maxSubmissions,
    downvote,
    setDeployContestData,
    setIsLoading,
    setIsSuccess,
  } = useDeployContestStore(state => state);
  const { chain } = useNetwork();
  const { refetch } = useSigner();

  async function deployContest() {
    stateContestDeployment.setIsLoading(true);
    stateContestDeployment.setIsSuccess(false);
    stateContestDeployment.setError(null);

    toastLoading("contest is deploying...");
    try {
      const signer = await refetch();

      const factoryCreateContest = new ContractFactory(
        DeployedContestContract.abi,
        DeployedContestContract.bytecode,
        //@ts-ignore
        signer.data,
      );

      const contestInfo = type + "|" + summary + "|" + prompt;

      // Handle allowedSubmissionsPerUser and maxSubmissions in case they are not set, they are zero, or we pass "infinity" to the contract
      const finalAllowedSubmissionsPerUser =
        !isNaN(allowedSubmissionsPerUser) && allowedSubmissionsPerUser > 0 ? allowedSubmissionsPerUser : 1000000;
      const finalMaxSubmissions = !isNaN(maxSubmissions) && maxSubmissions > 0 ? maxSubmissions : 1000000;

      const contestParameters = [
        getUnixTime(submissionOpen),
        // how many seconds will submissions be open
        differenceInSeconds(votingOpen, submissionOpen),
        // how many seconds will voting be open
        differenceInSeconds(votingClose, votingOpen),
        finalAllowedSubmissionsPerUser,
        finalMaxSubmissions,
        downvote ? 1 : 0,
      ];

      const contractContest = await factoryCreateContest.deploy(
        title,
        contestInfo,
        submissionMerkle
          ? submissionMerkle.merkleRoot
          : "0x0000000000000000000000000000000000000000000000000000000000000000",
        votingMerkle?.merkleRoot,
        contestParameters,
      );

      setIsLoading(true);

      const transactionPromise = contractContest.deployTransaction.wait();

      // Wait for transaction to be executed
      await transactionPromise;

      const receiptDeployContest = await waitForTransaction({
        chainId: chain?.id,
        hash: contractContest.deployTransaction.hash,
      });

      setDeployContestData(
        chain?.name ?? "",
        chain?.id ?? 0,
        receiptDeployContest.transactionHash,
        contractContest.address,
      );

      const contestData = {
        title: title,
        type: type,
        summary: summary,
        prompt: prompt,
        datetimeOpeningSubmissions: submissionOpen,
        datetimeOpeningVoting: votingOpen,
        datetimeClosingVoting: votingClose,
        votingMerkleTree: votingMerkle
          ? {
              ...votingMerkle,
              voters: votingMerkle.voters.map(voter => ({
                ...voter,
                numVotes: ethers.utils.formatUnits(voter.numVotes, 18),
              })),
            }
          : null,
        submissionMerkleTree: submissionMerkle
          ? {
              ...submissionMerkle,
              submitters:
                submissionMerkle.merkleRoot !== "0x0000000000000000000000000000000000000000000000000000000000000000"
                  ? submissionMerkle.submitters.map(submitter => ({
                      ...submitter,
                      numVotes: ethers.utils.formatUnits(submitter.numVotes, 18),
                    }))
                  : [],
            }
          : null,
        contractAddress: contractContest.address,
        authorAddress: (await signer.data?.getAddress()) ?? "",
        networkName: chain?.name.toLowerCase().replace(" ", "") ?? "",
      };

      await indexContest(contestData, votingMerkle, submissionMerkle);

      toastSuccess("contest has been deployed!");
      setIsSuccess(true);
      setIsLoading(false);
      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setIsSuccess(true);
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        setIsLoading(false);
        stateContestDeployment.setIsLoading(false);
        return;
      }

      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setError(customError);
      setIsLoading(false);
      toastError(customError.message ?? "contest deployment failed");
    }
  }

  async function indexContest(
    contestData: ContestValues,
    votingMerkle: VotingMerkle | null,
    submissionMerkle: SubmissionMerkle | null,
  ) {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase is not configured");
      }

      const tasks = [];

      tasks.push(indexContestV3(contestData));

      if (votingMerkle && votingMerkle.voters.length > 0) {
        const submitters = submissionMerkle ? submissionMerkle.submitters : [];
        tasks.push(
          indexContestParticipantsV3(
            contestData.contractAddress,
            votingMerkle.voters,
            submitters,
            contestData.networkName,
          ),
        );
      }

      await Promise.all(tasks);
    } catch (error) {
      stateContestDeployment.setIsLoading(false);
      stateContestDeployment.setError(error as CustomError);
      setIsLoading(false);
      toastError("contest deployment failed");
    }
  }

  return {
    deployContest,
  };
}
