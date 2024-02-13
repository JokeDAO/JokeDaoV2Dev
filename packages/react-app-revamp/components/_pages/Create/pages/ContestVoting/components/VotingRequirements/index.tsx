/* eslint-disable react-hooks/exhaustive-deps */
import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDefaultDropdown, { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { tokenAddressRegex } from "@helpers/regex";
import { MerkleKey, SubmissionType, useDeployContestStore } from "@hooks/useDeployContest/store";
import { VotingMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { fetchNftHolders, fetchTokenHolders } from "lib/permissioning";
import { useEffect, useState } from "react";
import CreateVotingRequirementsNftSettings from "./components/NFT";
import CreateVotingRequirementsTokenSettings from "./components/Token";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
  allowList: Record<string, number>;
};

const options: Option[] = [
  { value: "erc20", label: "token holders" },
  { value: "erc721", label: "NFT holders" },
];

const CreateVotingRequirements = () => {
  const {
    step,
    submissionTypeOption,
    setVotingMerkle,
    submissionMerkle,
    setError,
    setVotingAllowlist,
    setVotingAllowlistFields,
    votingRequirements,
    setVotingRequirements,
    setVotingRequirementsOption,
    votingRequirementsOption,
  } = useDeployContestStore(state => state);
  const votingValidation = validationFunctions.get(step);
  const [inputError, setInputError] = useState<Record<string, string | undefined>>({});
  const onNextStep = useNextStep([arg => votingValidation?.[1].validation(arg)]);
  const submittersAsVoters = submissionTypeOption.value === SubmissionType.SameAsVoters;

  const onRequirementChange = (option: string) => {
    setInputError({});
    setVotingRequirementsOption({
      value: option,
      label: options.find(o => o.value === option)?.label ?? "",
    });
    setVotingRequirements({
      ...votingRequirements,
      type: option,
    });
  };

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNextStep();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onNextStep]);

  const renderLayout = () => {
    switch (votingRequirementsOption.value) {
      case "erc721":
        return <CreateVotingRequirementsNftSettings error={inputError} />;
      case "erc20":
        return <CreateVotingRequirementsTokenSettings error={inputError} />;
      default:
        return null;
    }
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients, allowList } = event.data;

    setVotingAllowlist("prefilled", allowList);
    setVotingMerkle("prefilled", { merkleRoot, voters: recipients });
    setVotingRequirements({
      ...votingRequirements,
      timestamp: Date.now(),
    });
    setError(step + 1, { step: step + 1, message: "" });
    onNextStep(allowList);
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

    if (votingRequirements.tokenAddress === "" || tokenAddressRegex.test(votingRequirements.tokenAddress) === false) {
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
    let result: Record<string, number> | Error;

    toastLoading("processing your allowlist...", false);
    try {
      const fetchMerkleData = type === "erc721" ? fetchNftHolders : fetchTokenHolders;

      result = await fetchMerkleData(
        "voting",
        votingRequirements.tokenAddress,
        votingRequirements.chain,
        votingRequirements.minTokensRequired,
        votingRequirements.powerValue,
        votingRequirements.powerType,
      );

      if (result instanceof Error) {
        setInputError({
          tokenAddressError: result.message,
        });
        toastDismiss();
        return;
      }

      const worker = initializeWorker();
      worker.postMessage({
        decimals: 18,
        allowList: result,
      });
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
    fetchRequirementsMerkleData(votingRequirementsOption.value);
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
        <CreateDefaultDropdown
          defaultOption={votingRequirementsOption}
          options={options}
          className="w-full md:w-[240px]"
          onChange={onRequirementChange}
        />
        {renderLayout()}
      </div>
      <CreateNextButton step={step + 1} onClick={handleNextStep} />
    </div>
  );
};

export default CreateVotingRequirements;
