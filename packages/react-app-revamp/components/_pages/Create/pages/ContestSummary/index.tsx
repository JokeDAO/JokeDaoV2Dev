import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMedia } from "react-use";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import CreateTextInput from "../../components/TextInput";
import TipMessage from "../../components/Tip";
import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "../../constants/length";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";

// Define your mobile and desktop placeholders.
const MOBILE_PLACEHOLDER = "eg. “submit a project” “propose a delegate”";
const DESKTOP_PLACEHOLDER = "eg. “submit a project” “propose a delegate” “predict the market”";

const CreateContestSummary = () => {
  const { summary, setSummary, step, errors } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const summaryValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => summaryValidation?.[0].validation(summary)]);
  const isMobile = useMedia("(max-width: 768px)");

  const placeholderText = isMobile ? MOBILE_PLACEHOLDER : DESKTOP_PLACEHOLDER;

  const handleSummaryChange = (value: string) => {
    setSummary(value);
  };

  return (
    <div className="mt-12 lg:mt-[100px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start  lg:items-center gap-5 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <p className="text-primary-10 font-bold">what’s a 2-3 word summary of how to participate in your contest?</p>
      </div>
      <div className="mt-7 lg:ml-[70px]">
        <CreateTextInput
          className="w-full md:w-[600px]"
          value={summary}
          placeholder={placeholderText}
          minLength={CONTEST_TITLE_MIN_LENGTH}
          maxLength={CONTEST_TITLE_MAX_LENGTH}
          onChange={value => handleSummaryChange(value)}
          onNextStep={onNextStep}
        />
        {currentStepError ? (
          <ErrorMessage error={(currentStepError || { message: "" }).message} />
        ) : (
          <TipMessage tip="we’ll use this to summarize and promote your contest on our site" error={""} />
        )}
        <div className="mt-20 md:mt-12">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestSummary;
