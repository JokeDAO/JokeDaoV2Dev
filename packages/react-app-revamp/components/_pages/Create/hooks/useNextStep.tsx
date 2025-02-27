import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useCallback } from "react";
import { StepTitle } from "../types";
import type { DeployContestState } from "@hooks/useDeployContest/store";
import { useAccount } from "wagmi";

const stepValidations: Record<StepTitle, (state: DeployContestState, isConnected: boolean) => boolean> = {
  [StepTitle.Type]: state => {
    return true;
  },
  [StepTitle.Entries]: state => {
    return true;
  },

  [StepTitle.Timing]: state => {
    return true;
  },
  [StepTitle.Voting]: state => {
    return !!state.votingMerkle.csv || !!state.votingMerkle.prefilled;
  },

  [StepTitle.Monetization]: (state, isConnected) => {
    return isConnected && !!state.charge.type.costToPropose && state.charge.type.costToPropose > 0;
  },
  [StepTitle.Rules]: state => {
    return !!state.title && !!state.prompt.summarize && !!state.prompt.evaluateVoters;
  },

  [StepTitle.Confirm]: (state, isConnected) => {
    return isConnected;
  },
};

export const useNextStep = () => {
  const { isConnected } = useAccount();
  const { step: currentStep, setStep } = useDeployContestStore(state => state);

  const onNextStep = useCallback(
    (targetStep?: number, availableSteps?: StepTitle[]) => {
      // if we're going backwards, allow without validation
      if (targetStep !== undefined && targetStep < currentStep) {
        setStep(targetStep);
        return;
      }

      const state = useDeployContestStore.getState();

      // only validate steps that are in our current flow
      for (let i = currentStep; i < (targetStep ?? currentStep + 1); i++) {
        const stepToValidate = availableSteps?.[i];
        if (!stepToValidate) continue;

        const validationFn = stepValidations[stepToValidate];
        if (!validationFn) continue;

        const isValid = validationFn(state, isConnected);
        if (!isValid) {
          return;
        }
      }

      setStep(targetStep ?? currentStep + 1);
    },
    [currentStep, setStep, isConnected],
  );

  return onNextStep;
};
