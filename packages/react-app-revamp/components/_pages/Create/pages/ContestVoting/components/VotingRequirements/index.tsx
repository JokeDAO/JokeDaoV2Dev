/* eslint-disable react/no-unescaped-entities */
import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDefaultDropdown, { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { addressRegex } from "@helpers/regex";
import useChargeDetails from "@hooks/useChargeDetails";
import { MerkleKey, SubmissionType, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle, VoteType, VotingMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { fetchNftHolders, fetchTokenHolders } from "lib/permissioning";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import CreateVotingRequirementsNftSettings from "./components/NFT";
import CreateVotingRequirementsTokenSettings from "./components/Token";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
  allowList: Record<string, number>;
};

const options: Option[] = [
  { value: "anyone", label: "anyone" },
  { value: "erc20", label: "token holders" },
  { value: "erc721", label: "NFT holders" },
];

const CreateVotingRequirements = () => {
  const [votingDropdownRequirementsOptions, setVotingDropdownRequirementsOptions] = useState<Option[]>(options);
  const {
    step,
    submissionTypeOption,
    setVotingMerkle,
    setSubmissionMerkle,
    setSubmissionRequirements,
    setError,
    setVotingAllowlist,
    setVotingAllowlistFields,
    votingRequirements,
    setVotingRequirements,
    setVotingRequirementsOption,
    votingRequirementsOption,
    setCharge,
    charge,
    minCharge,
    votingTab,
  } = useDeployContestStore(state => state);
  const [inputError, setInputError] = useState<Record<string, string | undefined>>({});
  const onNextStep = useNextStep();
  const submittersAsVoters = submissionTypeOption.value === SubmissionType.SameAsVoters;
  const { isConnected, chain } = useAccount();
  const {
    isError: isChargeDetailsError,
    refetch: refetchChargeDetails,
    isLoading: isChargeDetailsLoading,
  } = useChargeDetails(chain?.name.toLowerCase() ?? "");
  const { minCostToVote, minCostToPropose } = minCharge;

  useEffect(() => {
    if (isChargeDetailsLoading) return;

    const updatedOptions = [...options];
    const anyoneOptionIndex = updatedOptions.findIndex(option => option.value === "anyone");

    if (!isConnected) {
      updatedOptions[anyoneOptionIndex] = { value: "anyone", label: "anyone (must connect wallet)", disabled: true };
    } else if (minCostToPropose === 0 || minCostToVote === 0) {
      updatedOptions[anyoneOptionIndex] = { value: "anyone", label: "anyone (not live on this chain)", disabled: true };
    } else {
      updatedOptions[anyoneOptionIndex] = { value: "anyone", label: "anyone", disabled: false };
    }

    setVotingDropdownRequirementsOptions(updatedOptions);

    if (votingRequirementsOption.value === "anyone" && updatedOptions[anyoneOptionIndex].disabled) {
      const firstEnabledOption = updatedOptions.find(option => !option.disabled);
      if (firstEnabledOption) {
        setVotingRequirementsOption(firstEnabledOption);
      }
    }
  }, [
    minCostToPropose,
    minCostToVote,
    isChargeDetailsLoading,
    setVotingRequirementsOption,
    isConnected,
    votingRequirementsOption,
  ]);

  const onRequirementChange = (option: string) => {
    setInputError({});
    setVotingRequirementsOption({
      value: option,
      label: votingDropdownRequirementsOptions.find(o => o.value === option)?.label ?? "",
    });
    setVotingRequirements({
      ...votingRequirements,
      type: option,
      name: "",
      logo: "",
      tokenAddress: "",
      nftTokenId: "",
      nftType: "",
    });
  };

  const renderLayout = () => {
    switch (votingRequirementsOption.value) {
      case "erc721":
        return <CreateVotingRequirementsNftSettings error={inputError} />;
      case "erc20":
        return <CreateVotingRequirementsTokenSettings error={inputError} />;
      default:
        return (
          <p className="text-[16px] animate-appear">
            <b>note: </b>by letting anyone vote, you’ll need to set a <br />
            charge-per-vote to prevent bots from voting.
          </p>
        );
    }
  };

  const initializeWorkerForVoters = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessageForVoters;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const initializeWorkersForVotersAndSubmitters = () => {
    const worker = new Worker(new URL("/workers/generateBatchRootsAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessageForVotersAndSubmitters;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessageForVotersAndSubmitters = (event: MessageEvent<WorkerMessageData[]>): void => {
    const results = event.data;
    const [votingMerkleData, submissionMerkleData] = results;

    if (votingMerkleData) {
      setVotingMerkle("prefilled", {
        merkleRoot: votingMerkleData.merkleRoot,
        voters: votingMerkleData.recipients,
      });
    }

    if (submissionMerkleData) {
      setSubmissionMerkle("prefilled", {
        merkleRoot: submissionMerkleData.merkleRoot,
        submitters: submissionMerkleData.recipients,
      });
    }

    setVotingAllowlist("prefilled", votingMerkleData.allowList);
    setVotingRequirements({
      ...votingRequirements,
      timestamp: Date.now(),
    });
    setSubmissionRequirements({
      ...votingRequirements,
      timestamp: Date.now(),
    });

    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
    toastSuccess("allowlists processed successfully.");
    resetManualAllowlist();
    setBothSubmissionMerkles(null);
    terminateWorker(event.target as Worker);
  };

  const handleWorkerMessageForVoters = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients, allowList } = event.data;

    setVotingAllowlist("prefilled", allowList);
    setVotingMerkle("prefilled", { merkleRoot, voters: recipients });
    setVotingRequirements({
      ...votingRequirements,
      timestamp: Date.now(),
    });
    setError(step + 1, { step: step + 1, message: "" });
    onNextStep();
    toastSuccess("allowlist processed successfully.");
    resetManualAllowlist();
    terminateWorker(event.target as Worker);
  };

  const handleWorkerError = (error: ErrorEvent): void => {
    console.error("Worker error:", error);
    toastError("something went wrong, please try again.");

    terminateWorker(error.target as Worker);
  };

  const terminateWorker = (worker: Worker): void => {
    if (worker && worker.terminate) {
      worker.terminate();
    }
  };

  const validateInput = () => {
    const errors: Record<string, string | undefined> = {};

    if (votingRequirementsOption.value === "anyone") return true;

    if (votingRequirements.tokenAddress === "" || addressRegex.test(votingRequirements.tokenAddress) === false) {
      errors.tokenAddressError = "Invalid token address";
    }

    if (votingRequirements.minTokensRequired === 0 || isNaN(votingRequirements.minTokensRequired)) {
      errors.minTokensRequiredError = "Minimum tokens required should be greater than 0";
    }

    if (votingRequirements.powerValue === 0 || isNaN(votingRequirements.powerValue)) {
      errors.powerValueError = "Voting power value should be greater than 0";
    }

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchRequirementsMerkleData = async (type: string) => {
    toastLoading("processing your allowlist...", false);
    setCharge({
      ...charge,
      voteType: VoteType.PerTransaction,
    });
    try {
      let votingAllowlist: Record<string, number> | Error;
      if (type === "erc721") {
        votingAllowlist = await fetchNftHolders(
          "voting",
          votingRequirements.tokenAddress,
          votingRequirements.chain,
          votingRequirements.minTokensRequired,
          votingRequirements.nftTokenId,
          votingRequirements.powerValue,
          votingRequirements.powerType,
        );
      } else {
        votingAllowlist = await fetchTokenHolders(
          "voting",
          votingRequirements.tokenAddress,
          votingRequirements.chain,
          votingRequirements.minTokensRequired,
          votingRequirements.powerValue,
          votingRequirements.powerType,
        );
      }

      if (votingAllowlist instanceof Error) {
        setInputError({
          tokenAddressError: votingAllowlist.message,
        });
        toastDismiss();
        return;
      }

      if (submittersAsVoters) {
        const submissionAllowlist: Record<string, number> = Object.keys(votingAllowlist).reduce(
          (acc, address) => {
            acc[address] = 10;
            return acc;
          },
          {} as Record<string, number>,
        );

        const worker = initializeWorkersForVotersAndSubmitters();
        worker.postMessage({
          allowLists: [
            { decimals: 18, allowList: votingAllowlist },
            { decimals: 18, allowList: submissionAllowlist },
          ],
        });
      } else {
        const worker = initializeWorkerForVoters();
        worker.postMessage({
          decimals: 18,
          allowList: votingAllowlist,
        });
      }
    } catch (error: any) {
      setInputError({
        tokenAddressError: error.message,
      });
      toastDismiss();
      return;
    }
  };

  const handleNextStep = async () => {
    const isValid = validateInput();

    if (!isValid) {
      return;
    }

    if (votingRequirementsOption.value === "anyone") {
      if (submittersAsVoters) {
        setAllSubmissionMerkles(null);
      }

      setCharge({
        ...charge,
        voteType: VoteType.PerVote,
      });
      setAllVotingMerkles(null);
      setBothAllowlists({});
      setVotingAllowlistFields([]);
      onNextStep();

      return;
    }
    fetchRequirementsMerkleData(votingRequirementsOption.value);
  };

  const setAllVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "csv", "prefilled"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  const setAllSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "csv", "prefilled"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const setBothSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "csv"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const setBothVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "csv"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  const setBothAllowlists = (value: Record<string, number>) => {
    const keys: MerkleKey[] = ["manual", "csv"];
    keys.forEach(key => setVotingAllowlist(key, value));
  };

  const resetManualAllowlist = () => {
    setBothVotingMerkles(null);
    setBothAllowlists({});
    setVotingAllowlistFields([]);
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">who can vote?</p>
        {isChargeDetailsError ? (
          <p className="text-[20px] text-negative-11 font-bold">
            ruh roh, we couldn't load preset options for this chain!{" "}
            <span className="underline cursor-pointer" onClick={() => refetchChargeDetails()}>
              please try again
            </span>
          </p>
        ) : isChargeDetailsLoading ? (
          <p className="loadingDots font-sabo text-[16px] text-neutral-9">Loading presets</p>
        ) : (
          <>
            <CreateDefaultDropdown
              defaultOption={votingRequirementsOption}
              options={votingDropdownRequirementsOptions}
              className="w-60 md:w-[240px]"
              onChange={onRequirementChange}
            />
            {renderLayout()}
          </>
        )}
      </div>
      <CreateNextButton step={step + 1} onClick={handleNextStep} />
    </div>
  );
};

export default CreateVotingRequirements;
