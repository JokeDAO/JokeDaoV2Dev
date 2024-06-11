import CreateRewardsNavigation from "@components/_pages/Contest/Rewards/components/Create/components/Buttons/Navigation";
import { ValidationError, useCreateRewardsStore } from "@components/_pages/Contest/Rewards/components/Create/store";
import CreateRewardsPoolRecipients from "./components/Recipients";
import { useMediaQuery } from "react-responsive";

const hasValidationErrors = (errors: ValidationError): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};

const CreateRewardsPool = () => {
  const { currentStep, rewardPoolData } = useCreateRewardsStore(state => state);
  const isError = hasValidationErrors(rewardPoolData.validationError);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex flex-col gap-12 animate-swingInLeft">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">rewards for winners 🤑</p>

        <p className="text-[16px] text-neutral-11">
          a rewards pool incentivizes submissions, compensates winners, and
          {isMobile ? " " : <br />}
          helps showcase you to players. you can fund it with tokens in a sec.
        </p>
        <p className="text-[16px] text-neutral-11">
          it’s up to you whether you want to add one—but it’s easier to attract
          {isMobile ? " " : <br />}
          and retain a community if you do.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <p className="text-[20px] font-bold text-neutral-11">how should we divide winners’ rewards?</p>
        <CreateRewardsPoolRecipients />
      </div>

      <CreateRewardsNavigation step={currentStep} isDisabled={isError} />
    </div>
  );
};

export default CreateRewardsPool;
