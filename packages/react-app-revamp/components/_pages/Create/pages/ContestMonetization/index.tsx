import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useContestSteps } from "../../hooks/useContestSteps";
import { useNextStep } from "../../hooks/useNextStep";
import CreateContestCharge from "./components/Charge";
import CreateContestChargeUnconnectedAccount from "./components/UnconnectedAccount";

const CreateContestMonetization = () => {
  const { step } = useDeployContestStore(state => state);
  const { steps } = useContestSteps();
  const { isConnected, chain } = useAccount();
  const [disableNextStep, setDisableNextStep] = useState(false);
  const onNextStep = useNextStep();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const monetizeTitle = isMobile ? `charges` : `let's monetize this puppy`;

  const switchLayout = useMemo<JSX.Element>(() => {
    if (!isConnected) {
      setDisableNextStep(true);
      return <CreateContestChargeUnconnectedAccount />;
    }

    return (
      <CreateContestCharge
        chain={chain?.name.toLowerCase() ?? ""}
        onError={hasError => {
          setDisableNextStep(hasError);
        }}
      />
    );
  }, [isConnected, chain?.name]);

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] text-neutral-11 font-bold">{monetizeTitle}</p>
        </div>
        <div className="grid col-start-1 md:col-start-2 col-span-2  md:ml-10 mt-8 md:mt-14">
          {switchLayout}
          {isConnected && (
            <div className="mt-16">
              <CreateNextButton step={step + 1} isDisabled={disableNextStep} onClick={() => onNextStep()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContestMonetization;
