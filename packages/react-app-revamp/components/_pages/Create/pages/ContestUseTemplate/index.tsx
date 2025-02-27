import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import GradientText from "@components/UI/GradientText";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import useSetContestTemplate from "@hooks/useSetContestTemplate";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import MobileBottomButton from "../../components/Buttons/Mobile";
import CreateDefaultDropdown from "../../components/DefaultDropdown";
import Stepper from "../../components/Stepper";
import { TemplateOption } from "../../components/TemplateDropdown";
import { useContestSteps } from "../../hooks/useContestSteps";
import GeneralTemplate from "../../templates";
import { getTemplateConfigByType } from "../../templates/templates";
import { TemplateType } from "../../templates/types";
import { useCreateContestStartStore } from "../ContestStart";

const templateOptions: TemplateOption[] = Object.values(TemplateType).map(value => ({
  value: value as TemplateType,
  label: value,
}));

const CreateContestTemplate = () => {
  const { steps, allSteps } = useContestSteps();
  const { setStartContestWithTemplate } = useCreateContestStartStore(state => state);
  const { step: currentStep, setStep } = useDeployContestStore(state => state);
  const setContestTemplateConfig = useSetContestTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | "">(TemplateType.leaderboard);
  const [showStepper, setShowStepper] = useState(false);
  const [isFullMode, setIsFullMode] = useState(false);
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });

  const templateConfig = useMemo(
    () => (selectedTemplate ? getTemplateConfigByType(selectedTemplate) : null),
    [selectedTemplate],
  );

  const filteredSteps = useMemo(() => {
    if (!templateConfig) return steps;
    return allSteps.filter(step => templateConfig.stepsToFulfill.includes(step.title));
  }, [templateConfig, allSteps, steps]);

  const handleNextClick = () => {
    if (selectedTemplate && templateConfig) {
      setContestTemplateConfig(templateConfig);
      setShowStepper(true);
      setStep(0);
    }
  };

  const handleBackClick = () => {
    setStartContestWithTemplate(false);
    setShowStepper(false);
  };

  if (showStepper) {
    if (currentStep === filteredSteps.length - 1 && !isFullMode) {
      setIsFullMode(true);
      setStep(steps.length - 1);
    }

    const stepsToShow = isFullMode ? steps : filteredSteps;
    return (
      <div className="pl-4 pr-4 lg:pl-[120px] lg:pr-[60px]">
        <Stepper steps={stepsToShow} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pl-4 pr-4 lg:pl-[120px] lg:pr-[60px] lg:ml-[300px] mt-8 md:mt-32 animate-reveal">
      <GradientText
        text="Pick a template"
        isStrikethrough={false}
        textSizeClassName="text-[24px] font-bold"
        isFontSabo={false}
      />

      <div className="flex gap-8 flex-col">
        <div className="flex flex-col gap-4">
          <p className="text-[16px] text-neutral-11 uppercase font-bold">template</p>
          <CreateDefaultDropdown
            options={templateOptions}
            className="w-[240px]"
            onChange={value => setSelectedTemplate(value as TemplateType)}
            defaultOption={templateOptions[0]}
          />
        </div>

        {selectedTemplate ? <GeneralTemplate templateType={selectedTemplate} /> : null}
        {isMobileOrTablet ? (
          <MobileBottomButton>
            <div className={`flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2 px-8`}>
              <p className="text-[20px] text-neutral-11" onClick={handleBackClick}>
                back
              </p>
              <ButtonV3
                onClick={handleNextClick}
                isDisabled={!selectedTemplate}
                colorClass="text-[20px] bg-gradient-purple rounded-[15px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
              >
                next
              </ButtonV3>
            </div>
          </MobileBottomButton>
        ) : (
          <div className="flex gap-4 items-start mt-8">
            <div className={`flex flex-col gap-4 items-center`}>
              <ButtonV3
                colorClass="text-[20px] bg-gradient-purple rounded-[10px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
                size={ButtonSize.LARGE}
                onClick={handleNextClick}
                isDisabled={!selectedTemplate}
              >
                Next
              </ButtonV3>
              <div
                className="hidden lg:flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
                onClick={handleBackClick}
              >
                <div className="transition-transform duration-200 group-hover:-translate-x-1">
                  <img src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
                </div>
                <p className="text-[16px]">Back</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateContestTemplate;
