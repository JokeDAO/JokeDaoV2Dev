import { toastDismiss, toastError, toastInfo, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDefaultDropdown from "@components/_pages/Create/components/DefaultDropdown";
import { Option } from "@components/_pages/Create/components/TagDropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { addressRegex } from "@helpers/regex";
import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { fetchNftHolders, fetchTokenHolders } from "lib/permissioning";
import { useState } from "react";
import { useAccount } from "wagmi";
import CreateSubmissionRequirementsNftSettings from "./components/NFT";
import CreateSubmissionRequirementsTokenSettings from "./components/Token";

enum SubmissionRequirementsOption {
  Anyone = "anyone",
  Creator = "creator",
  Erc20 = "erc20",
  Erc721 = "erc721",
}

const options: Option[] = [
  { value: SubmissionRequirementsOption.Anyone, label: "anyone" },
  { value: SubmissionRequirementsOption.Erc20, label: "token holders" },
  { value: SubmissionRequirementsOption.Erc721, label: "NFT holders" },
];

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateSubmissionRequirements = () => {
  const { address } = useAccount();
  const {
    step,
    submissionRequirementsOption,
    setSubmissionRequirementsOption,
    setSubmissionAllowlistFields,
    setSubmissionMerkle,
    setSubmissionRequirements,
    submissionRequirements,
  } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();
  const [inputError, setInputError] = useState<Record<string, string | undefined>>({});

  const renderLayout = () => {
    //TODO: see why content jumps when dropdown changes
    switch (submissionRequirementsOption.value) {
      case SubmissionRequirementsOption.Erc721:
        return <CreateSubmissionRequirementsNftSettings error={inputError} />;
      case SubmissionRequirementsOption.Erc20:
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
      tokenAddress: "",
      name: "",
      logo: "",
      nftTokenId: "",
    });
    setInputError({});
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setSubmissionMerkle("prefilled", { merkleRoot, submitters: recipients });
    setOtherSubmissionMerkles(null);
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

  const setOtherSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "csv"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const setAllSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "prefilled", "csv"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const validateInput = () => {
    const errors: Record<string, string | undefined> = {};

    if (
      submissionRequirements.tokenAddress === "" ||
      addressRegex.test(submissionRequirements.tokenAddress) === false
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

    toastLoading("processing your allowlist...");

    try {
      let result;
      if (type.value === SubmissionRequirementsOption.Erc721) {
        result = await fetchNftHolders(
          "submission",
          submissionRequirements.tokenAddress,
          submissionRequirements.chain,
          submissionRequirements.minTokensRequired,
          submissionRequirements.nftTokenId,
        );
      } else {
        result = await fetchTokenHolders(
          "submission",
          submissionRequirements.tokenAddress,
          submissionRequirements.chain,
          submissionRequirements.minTokensRequired,
        );
      }

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

  const handleCreatorAsSubmitter = () => {
    if (!address) {
      toastInfo("please connect your wallet first.");
      return;
    }
    toastLoading("processing your allowlist...");
    const worker = initializeWorker();
    worker.postMessage({
      decimals: 18,
      allowList: { [address]: 100 },
    });
  };

  const handleNextStep = async () => {
    if (
      submissionRequirementsOption.value === SubmissionRequirementsOption.Erc20 ||
      submissionRequirementsOption.value === SubmissionRequirementsOption.Erc721
    ) {
      fetchRequirementsMerkleData(submissionRequirementsOption);
    } else if (submissionRequirementsOption.value === SubmissionRequirementsOption.Creator) {
      handleCreatorAsSubmitter();
    } else {
      setSubmissionAllowlistFields([]);
      setAllSubmissionMerkles(null);
      onNextStep();
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">who can enter the contest?</p>
        <CreateDefaultDropdown
          defaultOption={submissionRequirementsOption}
          options={options}
          className="w-48 md:w-[240px]"
          onChange={onSubmissionRequirementsOptionChange}
        />
        {renderLayout()}
      </div>
      <CreateNextButton step={step + 1} onClick={handleNextStep} />
    </div>
  );
};

export default CreateSubmissionRequirements;
