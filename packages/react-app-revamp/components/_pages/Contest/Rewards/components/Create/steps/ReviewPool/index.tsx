import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { toastError } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useDeployRewardsPool } from "@hooks/useDeployRewards";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import CreateRewardsSubmitButton from "../../components/Buttons/Submit";
import { useCreateRewardsStore } from "../../store";
import { useFundPoolStore } from "../FundPool/store";
import CreateRewardsAddEarningsToggle from "./components/AddEarnings";
import CreateRewardsReviewTable from "./components/Table";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";

const CreateRewardsReviewPool = () => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const contestChainId = chains.find(
    chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.id;
  const { chainId: userChainId } = useAccount();
  const { deployRewardsPool } = useDeployRewardsPool();
  const { rewardPoolData, currentStep, setStep } = useCreateRewardsStore(state => state);
  const { tokens } = useFundPoolStore(state => state);
  const { charge } = useContestStore(state => state);
  const { contestState } = useContestStateStore(state => state);
  const isUserOnCorrectChain = contestChainId === userChainId;
  const isContestFinishedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const enableEarningsToggle = charge && charge.percentageToCreator > 0 && !isContestFinishedOrCanceled;

  const handleSwitchNetwork = async () => {
    if (!contestChainId) return;

    try {
      await switchChain(config, { chainId: contestChainId });
    } catch (error) {
      toastError("failed to switch network");
    }
  };

  const handleCreateRewards = async () => {
    if (!contestChainId) return;

    if (contestChainId !== userChainId) {
      try {
        await switchChain(config, { chainId: contestChainId });
      } catch (error) {
        toastError("failed to switch network");
        return;
      }
    }

    setStep(currentStep + 1);
    deployRewardsPool();
  };

  return (
    <div className="flex flex-col gap-16 animate-swingInLeft">
      <div className="flex flex-col gap-8">
        <p className="text-[24px] text-true-white font-bold">let’s confirm</p>
        <CreateRewardsReviewTable
          rankings={rewardPoolData.rankings}
          shareAllocations={rewardPoolData.shareAllocations}
          tokens={tokens}
        />
        {enableEarningsToggle ? <CreateRewardsAddEarningsToggle /> : null}
      </div>
      <div className="flex flex-col gap-6">
        {isUserOnCorrectChain ? (
          <CreateRewardsSubmitButton step={currentStep} onSubmit={handleCreateRewards} />
        ) : (
          <ButtonV3
            colorClass="text-[20px] bg-gradient-create-pool rounded-[40px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
            size={ButtonSize.EXTRA_LARGE_LONG}
            onClick={handleSwitchNetwork}
          >
            switch network
          </ButtonV3>
        )}
        <p className="text-[14px] text-neutral-14">
          you cannot edit these rewards after confirming. <br /> you can always come back to fund more.
        </p>
      </div>
    </div>
  );
};

export default CreateRewardsReviewPool;
