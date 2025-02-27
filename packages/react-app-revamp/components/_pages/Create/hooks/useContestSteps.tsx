import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateContestConfirm from "../pages/ContestConfirm";
import CreateContestEntries from "../pages/ContestEntries";
import CreateContestMonetization from "../pages/ContestMonetization";
import CreateContestRules from "../pages/ContestRules/components";
import CreateContestTiming from "../pages/ContestTiming";
import CreateContestTypes from "../pages/ContestTypes";
import CreateContestVoting from "../pages/ContestVoting";
import { ContestType, StepTitle } from "../types";

export const useContestSteps = () => {
  const { contestType } = useDeployContestStore(state => state);

  const stepReferences = {
    ContestType: 0,
    ContestVoting: 1,
    ContestMonetization: 2,
    ContestTiming: 3,
    ContestEntries: 4,
    ContestRules: 5,
    Confirm: 6,
  };

  const allSteps = [
    { title: StepTitle.Type, content: <CreateContestTypes /> },
    { title: StepTitle.Voting, content: <CreateContestVoting /> },
    { title: StepTitle.Monetization, content: <CreateContestMonetization /> },
    { title: StepTitle.Timing, content: <CreateContestTiming /> },
    { title: StepTitle.Entries, content: <CreateContestEntries /> },
    { title: StepTitle.Rules, content: <CreateContestRules /> },
    { title: StepTitle.Confirm, content: <CreateContestConfirm /> },
  ];

  // filter steps based on contest type
  const getStepsForContestType = () => {
    if (contestType === ContestType.EntryContest) {
      return allSteps;
    }

    // For non-entry contests, remove the voting step
    return allSteps.filter(step => step.title !== StepTitle.Voting);
  };

  return {
    steps: getStepsForContestType(),
    stepReferences,
    allSteps, // expose all steps for template filtering
  };
};
