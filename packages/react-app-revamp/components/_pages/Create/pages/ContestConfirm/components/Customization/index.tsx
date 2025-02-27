import { formatNumber } from "@helpers/formatNumber";
import { AdvancedOptions, CustomizationOptions } from "@hooks/useDeployContest/store";
import { FC } from "react";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmCustomizationProps {
  customization: {
    customization: CustomizationOptions;
    advancedOptions: AdvancedOptions;
  };
  step: number;
  onClick?: (stepIndex: number) => void;
}

const CreateContestConfirmCustomization: FC<CreateContestConfirmCustomizationProps> = ({
  customization,
  step,
  onClick,
}) => {
  const { customization: customizationOptions } = customization;

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="flex flex-col gap-2">
        <p className="text-neutral-9 text-[12px] font-bold uppercase">parameters</p>
        <ul className="flex flex-col pl-6 list-disc">
          <li className="text-[16px]">
            {formatNumber(customizationOptions.maxSubmissions)}{" "}
            {customizationOptions.maxSubmissions !== 1 ? "entries" : "entry"} allowed
          </li>
          <li className="text-[16px] list-disc">
            {formatNumber(customizationOptions.allowedSubmissionsPerUser)}{" "}
            {customizationOptions.allowedSubmissionsPerUser !== 1 ? "entries" : "entry"} per address
          </li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmCustomization;
