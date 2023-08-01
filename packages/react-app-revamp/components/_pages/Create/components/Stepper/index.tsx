import { isSupabaseConfigured } from "@helpers/database";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, ReactElement } from "react";
import CreateContestDeploying from "../../pages/ContestDeploying";
import { validateStep } from "../../utils/validation";

interface Step {
  title: string;
  content: ReactElement;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: FC<StepperProps> = ({ steps }) => {
  const {
    step: currentStep,
    setStep: setCurrentStep,
    furthestStep,
    setFurthestStep,
    errors,
    isLoading,
    isSuccess,
    ...state
  } = useDeployContestStore(state => state);

  const handleStepClick = (index: number) => {
    // Navigate backwards always allowed
    if (index < currentStep) {
      setCurrentStep(index);
      return;
    }

    // Navigate forwards, validate each step from the current up to the clicked step
    for (let stepToValidate = currentStep; stepToValidate <= index; stepToValidate++) {
      // If stepToValidate is submission step, pass submissionTab (as 'submissionRequirements' or 'submissionMerkle') to validateStep
      const errorMessage = validateStep(
        stepToValidate,
        state,
        stepToValidate === 6 ? (state.submissionTab === 0 ? "submissionRequirements" : "submissionMerkle") : undefined,
      );

      // If an error is found, don't proceed and break out of the loop
      if (errorMessage) {
        setCurrentStep(stepToValidate);
        return;
      }
    }

    // If no errors found, move to the selected step
    setCurrentStep(index);
    if (index > furthestStep) {
      setFurthestStep(index);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center mt-40">
        <p className="text-[24px] font-sabo text-primary-10">
          Oops, it seems you've forgotten to include environmental variables!
        </p>
        <p className="text-[16px]">
          for more details, visit{" "}
          <a className="text-positive-11" href="https://github.com/jk-labs-inc/jokerace#readme" target="_blank">
            <b>here!</b>
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      {isLoading || isSuccess ? (
        <CreateContestDeploying />
      ) : (
        <div>
          <div className="hidden lg:flex gap-2 mt-12">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                className="flex flex-col items-center text-[24px] font-bold cursor-pointer relative"
              >
                <hr
                  className={`w-32 3xl:w-36 border-2 transition-colors duration-500 ease-in-out ${
                    currentStep === index
                      ? "border-primary-10"
                      : currentStep > index
                      ? "border-primary-7"
                      : "border-neutral-9"
                  }`}
                />
                {currentStep === index && <p className="text-primary-10">{step.title}</p>}
              </div>
            ))}
          </div>
          <div className="lg:pl-[100px]">{steps[currentStep].content}</div>
        </div>
      )}
    </div>
  );
};

export default Stepper;
