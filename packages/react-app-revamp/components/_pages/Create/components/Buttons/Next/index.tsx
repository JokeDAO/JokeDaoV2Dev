import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { usePreviousStep } from "@components/_pages/Create/hooks/usePreviousStep";
import { useCreateContestStartStore } from "@components/_pages/Create/pages/ContestStart";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import { FC, MouseEventHandler, useEffect, useState } from "react";

interface CreateNextButtonProps {
  step: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
}

const CreateNextButton: FC<CreateNextButtonProps> = ({ step, onClick, isDisabled }) => {
  const { errors } = useDeployContestStore(state => state);
  const { setStartContest } = useCreateContestStartStore(state => state);
  const [shake, setShake] = useState(false);
  const onPreviousStep = usePreviousStep();

  useEffect(() => {
    // If there's an error for the current step, shake the button
    if (errors.find(error => error.step === step - 1)) {
      setShake(true);
    } else {
      setShake(false);
    }
  }, [errors, step]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If there's an error, shake the button
    if (errors.find(error => error.step === step - 1)) {
      setShake(true);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const onBackHandler = (step: number) => {
    if (step === 1) {
      setStartContest(false);
    } else {
      onPreviousStep();
    }
  };

  return (
    <div className="flex gap-4 items-start mb-5">
      <div className={`flex flex-col gap-4 items-center`}>
        <ButtonV3
          colorClass={`text-[20px] bg-gradient-next rounded-[10px] font-bold ${
            shake ? "animate-shakeTop" : ""
          } text-true-black hover:scale-105 transition-transform duration-200 ease-in-out`}
          size={ButtonSize.LARGE}
          onClick={handleClick}
          isDisabled={isDisabled}
        >
          next
        </ButtonV3>
        <div
          className="hidden lg:flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
          onClick={() => onBackHandler(step)}
        >
          <div className="transition-transform duration-200 group-hover:-translate-x-1">
            <Image src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
          </div>
          <p className="text-[16px]">back</p>
        </div>
      </div>
    </div>
  );
};

export default CreateNextButton;
