import { ButtonSize } from "@components/UI/ButtonV3";
import ButtonV3 from "@components/UI/ButtonV3";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback } from "react";

const CreateContestChargeUnconnectedAccount = () => {
  const { openConnectModal } = useConnectModal();
  const { step, setStep } = useDeployContestStore(state => state);

  const onBackHandler = useCallback(() => {
    setStep(step - 1);
  }, [step, setStep]);

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] text-neutral-11">
          to proceed, you need to connect a wallet and pick which chain <br /> you want the contest on.
        </p>
        <p className="text-[16px] text-neutral-11">this way, you can price charges in the native token of the chain.</p>
      </div>
      <div className="flex gap-4 items-start mb-5">
        <div className={`flex flex-col gap-4 items-center`}>
          <ButtonV3
            colorClass={`text-[16px] bg-gradient-create rounded-[10px] font-bold  text-true-black hover:scale-105 transition-transform duration-200 ease-in-out`}
            size={ButtonSize.LARGE}
            onClick={openConnectModal}
            isDisabled={false}
          >
            connect wallet
          </ButtonV3>
          <div
            className="hidden lg:flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
            onClick={() => onBackHandler()}
          >
            <div className="transition-transform duration-200 group-hover:-translate-x-1">
              <img src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
            </div>
            <p className="text-[16px]">back</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestChargeUnconnectedAccount;
