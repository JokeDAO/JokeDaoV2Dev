/* eslint-disable react/no-unescaped-entities */
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useChainChange } from "@hooks/useChainChange";
import useChargeDetails from "@hooks/useChargeDetails";
import { JK_LABS_SPLIT_DESTINATION_DEFAULT } from "@hooks/useDeployContest";
import { Charge, SplitFeeDestinationType, VoteType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmMonetizationProps {
  charge: Charge;
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmMonetization: FC<CreateContestConfirmMonetizationProps> = ({ charge, step, onClick }) => {
  const { chain, address } = useAccount();
  const chainChanged = useChainChange();
  const { type, splitFeeDestination } = charge;
  const { isError, refetch: refetchChargeDetails, isLoading } = useChargeDetails(chain?.name.toLowerCase() ?? "");
  const [isHovered, setIsHovered] = useState(false);
  const nativeCurrencySymbol = chain?.nativeCurrency.symbol;
  const chargeEnabled = type.costToPropose !== 0 || type.costToVote !== 0;
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const [highlightChainChange, setHighlightChainChange] = useState(false);
  const blockExplorerUrl = chain?.blockExplorers?.default.url;
  const blockExplorerAddressUrl = blockExplorerUrl
    ? `${blockExplorerUrl}/address/${
        splitFeeDestination.type === SplitFeeDestinationType.NoSplit
          ? JK_LABS_SPLIT_DESTINATION_DEFAULT
          : splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet
            ? address
            : splitFeeDestination.address
      }`
    : "";

  useEffect(() => {
    if (chainChanged) {
      setHighlightChainChange(true);
      const timer = setTimeout(() => setHighlightChainChange(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [chainChanged]);

  const renderEarningsSplitMessage = () => {
    if (
      splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet ||
      splitFeeDestination.type === SplitFeeDestinationType.AnotherWallet
    ) {
      return <li className="text-[16px] list-disc normal-case">all earnings split 50/50 with JokeRace</li>;
    } else {
      return (
        <li className="text-[16px] list-disc normal-case">
          all earnings go to{" "}
          <a href={blockExplorerAddressUrl} target="_blank" rel="noopener noreferrer" className="underline normal-case">
            JokeRace
          </a>
        </li>
      );
    }
  };

  if (isError) {
    return (
      <CreateContestConfirmLayout onClick={() => refetchChargeDetails()} onHover={value => setIsHovered(value)}>
        <div className={`flex flex-col gap-4 ${isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"}`}>
          <p className="text-[16px] font-bold">
            monetization:
            {!chargeEnabled ? <b className="uppercase"> OFF</b> : null}
          </p>
          <p className="text-[16px] text-negative-11 font-bold">
            ruh roh, we couldn't load charge details for this chain!{" "}
            <span className="underline cursor-pointer" onClick={refetchChargeDetails}>
              please try again
            </span>
          </p>
        </div>
      </CreateContestConfirmLayout>
    );
  }

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div
        className={`flex flex-col gap-4 ${highlightChainChange && !isLoading ? "text-negative-11 animate-pulse" : isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"} transition-all duration-300`}
      >
        <p className="text-[16px] font-bold">
          monetization:
          {!chargeEnabled ? <b className="uppercase"> OFF</b> : null}
        </p>
        {isLoading ? (
          <p className="loadingDots font-sabo text-[14px]  text-neutral-14">loading charge fees</p>
        ) : chargeEnabled ? (
          <ul className="flex flex-col pl-8">
            <li className={`text-[16px] list-disc`}>
              {charge.type.costToPropose} <span className="uppercase">${nativeCurrencySymbol}</span> to enter
            </li>
            <li className={`text-[16px] list-disc`}>
              {charge.type.costToVote} <span className="uppercase">${nativeCurrencySymbol}</span>{" "}
              {charge.voteType === VoteType.PerVote ? "for each" : "to"} vote
            </li>
            {renderEarningsSplitMessage()}
            {splitFeeDestination.type === SplitFeeDestinationType.AnotherWallet ||
            splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet ? (
              <li className="text-[16px] list-disc">
                creator earnings go to{" "}
                <a className="underline cursor-pointer" target="_blank" href={blockExplorerAddressUrl}>
                  {shortenEthereumAddress(
                    splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet
                      ? address ?? ""
                      : splitFeeDestination.address ?? "",
                  )}
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmMonetization;
