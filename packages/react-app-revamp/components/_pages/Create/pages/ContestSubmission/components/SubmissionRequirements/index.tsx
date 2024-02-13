/* eslint-disable react-hooks/exhaustive-deps */
import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDefaultDropdown from "@components/_pages/Create/components/DefaultDropdown";
import { Option } from "@components/_pages/Create/components/TagDropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { tokenAddressRegex } from "@helpers/regex";
import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { fetchNftHolders, fetchTokenHolders } from "lib/permissioning";
import { useEffect, useState } from "react";
import CreateSubmissionRequirementsNftSettings from "./components/NFT";
import CreateSubmissionRequirementsTokenSettings from "./components/Token";

const options: Option[] = [
  { value: "anyone", label: "anyone" },
  { value: "erc20", label: "token holders" },
  { value: "erc721", label: "NFT holders" },
];

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateSubmissionRequirements = () => {
  const {
    step,
    submissionRequirementsOption,
    setSubmissionRequirementsOption,
    setSubmissionAllowlistFields,
    setSubmissionMerkle,
    setSubmissionRequirements,
    submissionRequirements,
  } = useDeployContestStore(state => state);
  const submissionRequirementsValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([
    () => submissionRequirementsValidation?.[1].validation(submissionRequirementsOption, "submissionRequirements"),
  ]);
  const [inputError, setInputError] = useState<Record<string, string | undefined>>({});

  const renderLayout = () => {
    switch (submissionRequirementsOption.value) {
      case "erc721":
        return <CreateSubmissionRequirementsNftSettings error={inputError} />;
      case "erc20":
        return <CreateSubmissionRequirementsTokenSettings error={inputError} />;
      default:
        return null;
    }
  };

  const onSubmissionRequirementsOptionChange = (value: string) => {
    setSubmissionRequirementsOption({
      value,
      label: options.find(option => option.value === value)?.label ?? "",
    });
    setSubmissionRequirements({
      ...submissionRequirements,
      type: value,
    });
    setInputError({});
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

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setSubmissionMerkle("prefilled", { merkleRoot, submitters: recipients });
    setSubmissionAllowlistFields([]);
    onNextStep();
    toastSuccess("allowlist processed successfully.");
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

  const setAllSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "prefilled", "csv"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const validateInput = () => {
    const errors: Record<string, string | undefined> = {};

    if (
      submissionRequirements.tokenAddress === "" ||
      tokenAddressRegex.test(submissionRequirements.tokenAddress) === false
    ) {
      errors.tokenAddressError = "Invalid token address";
    }

    if (submissionRequirements.minTokensRequired === 0 || isNaN(submissionRequirements.minTokensRequired)) {
      errors.minTokensRequiredError = "Minimum tokens required should be greater than 0";
    }

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchRequirementsMerkleData = async (type: Option) => {
    const isValid = validateInput();

    if (!isValid) {
      return;
    }

    let result: Record<string, number> | Error;
    toastLoading("processing your allowlist...", false);

    try {
      const fetchMerkleData = type.value === "erc721" ? fetchNftHolders : fetchTokenHolders;

      result = await fetchMerkleData(
        "submission",
        submissionRequirements.tokenAddress,
        submissionRequirements.chain,
        submissionRequirements.minTokensRequired,
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
    if (submissionRequirementsOption.value === "erc20" || submissionRequirementsOption.value === "erc721") {
      fetchRequirementsMerkleData(submissionRequirementsOption);
    } else {
      setSubmissionAllowlistFields([]);
      setAllSubmissionMerkles(null);
      onNextStep();
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">who can submit?</p>
        <CreateDefaultDropdown
          defaultOption={submissionRequirementsOption}
          options={options}
          className="w-full md:w-[240px]"
          onChange={onSubmissionRequirementsOptionChange}
        />
        {renderLayout()}
      </div>
      <CreateNextButton step={step + 1} onClick={handleNextStep} />
    </div>
  );
};

export default CreateSubmissionRequirements;
