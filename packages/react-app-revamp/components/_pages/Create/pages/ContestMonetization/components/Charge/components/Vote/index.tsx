import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { VoteType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import CreateRadioButtonsGroup, { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";

interface ContestParamsChargeVoteProps {
  costToVote: number;
  type: VoteType;
  chainUnitLabel: string;
  costToVoteError: string;
  isAnyoneCanVote: boolean;
  onCostToVoteChange?: (value: number | null) => void;
  onVoteTypeChange?: (value: VoteType) => void;
}

const ContestParamsChargeVote: FC<ContestParamsChargeVoteProps> = ({
  costToVote,
  type,
  chainUnitLabel,
  costToVoteError,
  isAnyoneCanVote,
  onCostToVoteChange,
  onVoteTypeChange,
}) => {
  const [selected, setSelected] = useState<VoteType>(type);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    if (isAnyoneCanVote) {
      setSelected(VoteType.PerVote);
    } else {
      setSelected(VoteType.PerTransaction);
    }
  }, [isAnyoneCanVote]);

  const handleVoteTypeChange = (value: VoteType) => {
    setSelected(value);
    onVoteTypeChange?.(value);
  };

  const getOptions = (): RadioOption[] => {
    return [
      {
        label: "a charge each time they vote (recommended)",
        value: VoteType.PerTransaction,
        content:
          selected === VoteType.PerTransaction ? (
            <CreateNumberInput
              value={costToVote}
              onChange={onCostToVoteChange}
              unitLabel={chainUnitLabel}
              errorMessage={costToVoteError}
              textClassName="font-bold text-center pl-0 pr-4 -ml-4"
            />
          ) : null,
      },
      {
        label: "a charge per vote",
        value: VoteType.PerVote,
        content:
          selected === VoteType.PerVote ? (
            <CreateNumberInput
              value={costToVote}
              onChange={onCostToVoteChange}
              unitLabel={chainUnitLabel}
              errorMessage={costToVoteError}
              textClassName="font-bold text-center pl-0 pr-4 -ml-4"
            />
          ) : null,
      },
    ];
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        {isAnyoneCanVote ? (
          <>
            what is the charge players <b>pay per vote</b>?
          </>
        ) : isMobile ? (
          <>
            what is the charge to <b>vote</b>?
          </>
        ) : (
          <>
            what is the charge for players to <b>vote</b> in the contest?
          </>
        )}
      </p>
      {isAnyoneCanVote ? (
        <div className="flex flex-col gap-4">
          <CreateNumberInput
            value={costToVote}
            onChange={onCostToVoteChange}
            unitLabel={chainUnitLabel}
            errorMessage={costToVoteError}
            textClassName="font-bold text-center pl-0 pr-4 -ml-4"
          />
        </div>
      ) : (
        <CreateRadioButtonsGroup options={getOptions()} value={selected} onChange={handleVoteTypeChange} />
      )}
    </div>
  );
};

export default ContestParamsChargeVote;
