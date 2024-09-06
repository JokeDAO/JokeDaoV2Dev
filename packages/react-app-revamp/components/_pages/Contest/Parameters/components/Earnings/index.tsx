import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { Charge, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import ContestParamsEarningsModal from "./components/Modal";

interface ContestParametersEarningsProps {
  charge: Charge;
  contestAuthor: string;
  blockExplorerUrl?: string;
}

const ContestParametersEarnings: FC<ContestParametersEarningsProps> = ({ charge, blockExplorerUrl, contestAuthor }) => {
  const { address } = useAccount();
  const isConnectedWalletAuthor = address === contestAuthor;
  const isCreatorSplitEnabled = charge.percentageToCreator > 0;
  const creatorSplitDestination = charge.splitFeeDestination.address
    ? charge.splitFeeDestination.address
    : contestAuthor;
  const blockExplorerAddressUrl = blockExplorerUrl ? `${blockExplorerUrl}/address/${creatorSplitDestination}` : "";
  const [isEditEarningsModalOpen, setIsEditEarningsModalOpen] = useState(false);
  const { contestState } = useContestStateStore(state => state);
  const isContestFinishedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;

  const percentageToCreatorMessage = () => {
    if (charge.percentageToCreator === 50) {
      return "all earnings split 50/50 with JokeRace";
    } else {
      return `all earnings go to JokeRace`;
    }
  };

  const creatorEarningsDestinationMessage = () => {
    if (charge.splitFeeDestination.type === SplitFeeDestinationType.RewardsPool) {
      return "creator earnings go to rewards pool";
    } else {
      return (
        <>
          creator earnings go to{" "}
          <a
            className="underline cursor-pointer hover:text-positive-11 transition-colors duration-300"
            target="_blank"
            href={blockExplorerAddressUrl}
          >
            {shortenEthereumAddress(creatorSplitDestination)}
          </a>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <p className="text-[20px] font-bold text-neutral-14">earnings</p>
        {isConnectedWalletAuthor && charge.percentageToCreator > 0 && !isContestFinishedOrCanceled && (
          <button onClick={() => setIsEditEarningsModalOpen(true)}>
            <PencilSquareIcon className="w-6 h-6 text-neutral-9 hover:text-neutral-11 transition-colors duration-300 ease-in-out" />
          </button>
        )}
      </div>
      <ul className="pl-4 text-[16px] font-bold">
        <li className="list-disc">{percentageToCreatorMessage()}</li>
        {isCreatorSplitEnabled && <li className="list-disc">{creatorEarningsDestinationMessage()}</li>}
      </ul>

      <ContestParamsEarningsModal
        charge={charge}
        isOpen={isEditEarningsModalOpen}
        onClose={() => setIsEditEarningsModalOpen(false)}
      />
    </div>
  );
};

export default ContestParametersEarnings;
