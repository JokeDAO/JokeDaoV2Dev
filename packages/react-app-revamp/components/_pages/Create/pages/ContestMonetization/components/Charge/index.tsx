import { chains } from "@config/wagmi";
import useChargeDetails from "@hooks/useChargeDetails";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { SplitFeeDestinationType, VoteType } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
import ContestParamsSplitFeeDestination from "./components/SplitFeeDestination";
import ContestParamsChargeSubmission from "./components/Submission";
import ContestParamsChargeVote from "./components/Vote";
import {
  validateCostToPropose,
  validateCostToVote,
  validateSplitFeeDestination,
  validateSplitFeeDestinationAddress,
} from "./validation";
import { ContestType } from "@components/_pages/Create/types";

interface CreateContestChargeProps {
  chain: string;
  onError?: (value: boolean) => void;
}

const CreateContestCharge: FC<CreateContestChargeProps> = ({ chain, onError }) => {
  const chainUnitLabel = chains.find(c => c.name.toLowerCase() === chain.toLowerCase())?.nativeCurrency.symbol;
  const { isError, refetch: refetchChargeDetails, isLoading } = useChargeDetails(chain);
  const { charge, minCharge, setCharge, contestType } = useDeployContestStore(state => state);
  const { minCostToPropose, minCostToVote } = minCharge;
  const [costToProposeError, setCostToProposeError] = useState("");
  const [costToVoteError, setCostToVoteError] = useState("");
  const [splitFeeDestinationError, setSplitFeeDestinationError] = useState("");
  const isAnyoneCanVote = contestType === ContestType.AnyoneCanPlay || contestType === ContestType.VotingContest;

  if (isError) {
    onError?.(true);
    return (
      <p className="text-[20px] text-negative-11 font-bold">
        ruh roh, we couldn't load charge details for this chain!{" "}
        <span className="underline cursor-pointer" onClick={refetchChargeDetails}>
          please try again
        </span>
      </p>
    );
  }

  if (isLoading) {
    return <p className="loadingDots font-sabo text-[20px] text-neutral-9">Loading charge fees</p>;
  }

  const handleCostToProposeChange = (value: number | null) => {
    const error = validateCostToPropose(value, minCostToPropose);
    if (error) {
      setCostToProposeError(error);
      onError?.(true);
      setCharge({
        ...charge,
        error: true,
      });

      return;
    } else {
      setCostToProposeError("");
      onError?.(false);
    }

    setCharge({
      ...charge,
      type: {
        ...charge.type,
        costToPropose: value ?? 0,
      },
      error: false,
    });
  };

  const handleCostToVoteChange = (value: number | null) => {
    const error = validateCostToVote(value, minCostToVote);
    if (error) {
      setCostToVoteError(error);

      onError?.(true);
      setCharge({
        ...charge,

        error: true,
      });
      return;
    } else {
      setCostToVoteError("");
      onError?.(false);
    }

    setCharge({
      ...charge,

      type: {
        ...charge.type,
        costToVote: value ?? 0,
      },
      error: false,
    });
  };

  const handleSplitFeeDestinationTypeChange = (type: SplitFeeDestinationType) => {
    const newSplitFeeDestination = { ...charge.splitFeeDestination, type };
    const validationError = validateSplitFeeDestination(newSplitFeeDestination);

    setSplitFeeDestinationError(validationError ?? "");
    onError?.(!!validationError);

    setCharge({
      ...charge,
      splitFeeDestination: newSplitFeeDestination,
      error: !!validationError,
    });
  };

  const handleSplitFeeDestinationAddressChange = (address: string) => {
    const newSplitFeeDestination = { ...charge.splitFeeDestination, address };
    const validationError = validateSplitFeeDestinationAddress(newSplitFeeDestination);

    setSplitFeeDestinationError(validationError ?? "");
    onError?.(!!validationError);

    setCharge({
      ...charge,
      splitFeeDestination: newSplitFeeDestination,
      error: !!validationError,
    });
  };

  const handleVoteTypeChange = (value: VoteType) => {
    setCharge({
      ...charge,
      voteType: value,
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <ContestParamsSplitFeeDestination
        splitFeeDestination={charge.splitFeeDestination}
        splitFeeDestinationError={splitFeeDestinationError}
        onSplitFeeDestinationTypeChange={handleSplitFeeDestinationTypeChange}
        onSplitFeeDestinationAddressChange={handleSplitFeeDestinationAddressChange}
        includeRewardsInfo
      />
      <div className="flex flex-col gap-8">
        <ContestParamsChargeSubmission
          costToPropose={charge.type.costToPropose}
          chainUnitLabel={chainUnitLabel ?? ""}
          costToProposeError={costToProposeError}
          onCostToProposeChange={handleCostToProposeChange}
        />
        <ContestParamsChargeVote
          costToVote={charge.type.costToVote}
          type={charge.voteType}
          chainUnitLabel={chainUnitLabel ?? ""}
          costToVoteError={costToVoteError}
          onCostToVoteChange={handleCostToVoteChange}
          onVoteTypeChange={handleVoteTypeChange}
          isAnyoneCanVote={isAnyoneCanVote}
        />
      </div>
    </div>
  );
};

export default CreateContestCharge;
