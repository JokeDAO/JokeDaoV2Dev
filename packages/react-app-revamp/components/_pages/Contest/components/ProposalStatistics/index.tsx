import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { SortOptions, useProposalStore } from "@hooks/useProposal/store";
import { FC, ReactNode, useMemo } from "react";
import SortProposalsDropdown from "./components/SortDropdown";

interface ProposalStatisticsProps {
  contestStatus: ContestStatus;
  onMenuStateChange: (isOpen: boolean) => void;
}

const ProposalStatistics: FC<ProposalStatisticsProps> = ({ contestStatus, onMenuStateChange }) => {
  const { contestMaxProposalCount, totalVotes, totalVotesCast } = useContestStore(state => state);
  const { submissionsCount, sortBy } = useProposalStore(state => state);
  const { sortProposalData } = useProposal();

  const handleSortTypeChange = (value: string) => {
    sortProposalData(value as SortOptions);
  };

  const content = useMemo<ReactNode>(() => {
    switch (contestStatus) {
      case ContestStatus.SubmissionOpen:
        return (
          <p className="text-[16px] text-neutral-11">
            {submissionsCount} submission
            {submissionsCount > 1 || submissionsCount === 0 ? "s" : ""} &#8226; {contestMaxProposalCount.toString()}{" "}
            allowed
          </p>
        );
      case ContestStatus.VotingOpen:
      case ContestStatus.VotingClosed:
        return (
          <p className="text-[16px] text-neutral-11">
            {submissionsCount} submission{submissionsCount > 1 ? "s" : ""} &#8226; {formatNumber(totalVotesCast)} out of{" "}
            {formatNumber(totalVotes)} votes deployed in contest
          </p>
        );
    }
  }, [contestStatus, submissionsCount, contestMaxProposalCount, totalVotesCast, totalVotes]);

  return (
    <div className="flex flex-col">
      <p className="text-[24px] text-neutral-11 font-bold">submissions</p>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        {content}
        <SortProposalsDropdown
          defaultValue={sortBy ?? ""}
          onChange={handleSortTypeChange}
          onMenuStateChange={onMenuStateChange}
        />
      </div>
    </div>
  );
};

export default ProposalStatistics;
