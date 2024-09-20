import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { MAX_SUBMISSIONS_LIMIT } from "@hooks/useDeployContest";
import { FC } from "react";

interface ContestParamsSubmissionsPerContestProps {
  maxSubmissions: number;
  submissionsPerContestError: string;
  onMaxSubmissionsChange: (value: number | null) => void;
}

const ContestParamsSubmissionsPerContest: FC<ContestParamsSubmissionsPerContestProps> = ({
  maxSubmissions,
  submissionsPerContestError,
  onMaxSubmissionsChange,
}) => {
  const title = "how many total entries does your contest accept?";
  const displayMax = maxSubmissions < MAX_SUBMISSIONS_LIMIT;

  const handleMaxClick = () => {
    onMaxSubmissionsChange(MAX_SUBMISSIONS_LIMIT);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">{title}</p>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-2 w-2/3 md:w-auto">
          <CreateNumberInput
            value={maxSubmissions}
            onChange={onMaxSubmissionsChange}
            errorMessage={submissionsPerContestError}
            textClassName="font-bold text-center pl-0 pr-4"
            disableDecimals
          />
        </div>
        {displayMax ? (
          <div
            className="w-16 text-center rounded-[10px] border items-center border-positive-11 hover:border-2 cursor-pointer"
            onClick={handleMaxClick}
          >
            <p className="text-[16px] text-positive-11 infinite-submissions uppercase">max</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ContestParamsSubmissionsPerContest;
