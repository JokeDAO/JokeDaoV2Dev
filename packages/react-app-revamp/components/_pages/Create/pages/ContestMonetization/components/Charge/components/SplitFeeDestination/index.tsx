import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { SplitFeeDestination, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import CreateRadioButtonsGroup, { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";

interface ContestParamsSplitFeeDestinationProps {
  splitFeeDestination: SplitFeeDestination;
  splitFeeDestinationError: string;
  onSplitFeeDestinationTypeChange?: (value: SplitFeeDestinationType) => void;
  onSplitFeeDestinationAddressChange?: (value: string) => void;
  includeRewardsPool?: boolean;
  includeRewardsInfo?: boolean;
  rewardsModuleAddress?: string;
}

const PLACEHOLDER_ADDRESS = "0x7B15427393A98A041D00b50254A0C7a6fDC79F4E";
const SELF_FUND_DOCS = "https://docs.jokerace.io/faq#how-can-a-contest-fund-itself";

const ContestParamsSplitFeeDestination: FC<ContestParamsSplitFeeDestinationProps> = ({
  splitFeeDestination,
  splitFeeDestinationError,
  onSplitFeeDestinationTypeChange,
  onSplitFeeDestinationAddressChange,
  includeRewardsPool,
  rewardsModuleAddress,
  includeRewardsInfo,
}) => {
  const [showRewardsInfo, setShowRewardsInfo] = useState(false);
  const [selected, setSelected] = useState<SplitFeeDestinationType>(splitFeeDestination.type);
  const [address, setAddress] = useState(splitFeeDestination.address);
  const [isRewardsModuleAddress, setIsRewardsModuleAddress] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const percentageTitle = isMobile
    ? "who should we split charges with?"
    : "we split all charges 50/50. who should receive these?";

  useEffect(() => {
    setSelected(splitFeeDestination.type);
    setAddress(splitFeeDestination.address);

    if (splitFeeDestination.address && rewardsModuleAddress && splitFeeDestination.address === rewardsModuleAddress) {
      setIsRewardsModuleAddress(true);
    } else {
      setIsRewardsModuleAddress(false);
    }
  }, [splitFeeDestination, rewardsModuleAddress]);

  const handleSplitFeeDestinationTypeChange = (value: SplitFeeDestinationType) => {
    setSelected(value);
    setShowRewardsInfo(false);
    onSplitFeeDestinationTypeChange?.(value);
  };

  const handleSplitFeeDestinationAddressChange = (value: string) => {
    if (value === rewardsModuleAddress) {
      setIsRewardsModuleAddress(true);
    } else {
      setIsRewardsModuleAddress(false);
    }
    setAddress(value);
    onSplitFeeDestinationAddressChange?.(value);
  };

  const getOptions = (): RadioOption[] => {
    const options: RadioOption[] = [
      {
        label: (
          <>
            my wallet <span className="text-[16px]">({isMobile ? "i earn" : "i want to earn"})</span>
          </>
        ),
        value: SplitFeeDestinationType.CreatorWallet,
      },
      {
        label: (
          <>
            another wallet{" "}
            <span className="text-[16px]">({isMobile ? "they earn" : "i want someone else to earn"})</span>
          </>
        ),
        value: SplitFeeDestinationType.AnotherWallet,
        content:
          selected === SplitFeeDestinationType.AnotherWallet ? (
            <>
              <input
                type="text"
                autoFocus
                value={address}
                onChange={e => handleSplitFeeDestinationAddressChange(e.target.value)}
                placeholder={isMobile ? shortenEthereumAddress(PLACEHOLDER_ADDRESS, "long") : PLACEHOLDER_ADDRESS}
                className="w-full md:w-[536px] h-10 bg-true-black border border-secondary-11 rounded-[10px] text-[20px] text-neutral-11 placeholder-neutral-10 placeholder:font-bold p-4 focus:outline-none"
              />
              {isRewardsModuleAddress && (
                <p className="text-[16px] font-bold text-secondary-11">
                  looks like this is the rewards pool! we'll send all charges to the rewards.
                </p>
              )}
            </>
          ) : null,
      },
      {
        label: isMobile ? (
          <>
            nobody <span className="text-[16px] normal-case">(JokeRace earns)</span>
          </>
        ) : (
          <>
            i prefer to take 0% <span className="text-[16px] normal-case">(i want JokeRace to earn)</span>
          </>
        ),
        value: SplitFeeDestinationType.NoSplit,
      },
    ];

    return options;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <p className="text-[20px] md:text-[20px] text-neutral-11 font-bold">{percentageTitle}</p>
        <CreateRadioButtonsGroup
          options={getOptions()}
          value={selected}
          onChange={handleSplitFeeDestinationTypeChange}
        />

        {includeRewardsInfo ? (
          <div className="flex flex-col gap-4">
            <div className="w-fit -ml-2 md:-ml-4">
              <div
                className="flex gap-4 items-start cursor-pointer bg-neutral-2 rounded-lg px-2 md:px-4 py-1"
                onClick={() => setShowRewardsInfo(!showRewardsInfo)}
              >
                <div className="flex items-center mt-1 justify-center w-6 h-6 border border-primary-5 rounded-full"></div>
                <div className="flex gap-2 items-center">
                  <p className="text-[20px] text-primary-5">
                    {isMobile ? (
                      <>
                        rewards pool <span className="text-[16px]">(winners earn)</span>
                      </>
                    ) : (
                      <>
                        the rewards pool <span className="text-[16px]">(i want winners to earn)</span>
                      </>
                    )}
                  </p>
                  <InformationCircleIcon className="w-7 h-7 text-primary-5" />
                </div>
              </div>
            </div>

            {showRewardsInfo && (
              <div className="w-fit -ml-0 md:-ml-4 animate-appear">
                <div className="flex flex-col gap-4 md:gap-6 p-4 shadow-split-fee-destination border border-primary-1 rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex gap-4 md:gap-2 items-center">
                      <InformationCircleIcon className="w-7 h-7 text-negative-11" />
                      <p className=" text-[16px] md:text-[20px] text-negative-11 italic font-bold">action required</p>
                    </div>
                    <button onClick={() => setShowRewardsInfo(false)}>
                      <img
                        src="/modal/modal_close.svg"
                        width={24}
                        height={24}
                        alt="close"
                        className="hidden md:block cursor-pointer"
                      />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4 md:gap-6 pl-8">
                    <p className="text-[16px] md:text-[20px] text-neutral-11">
                      {isMobile
                        ? "finish creating this contest first, then:"
                        : "finish creating this contest first, and we'll direct you to:"}
                    </p>
                    <ul className="list-disc list-inside pl-4">
                      <li className="text-[16px] md:text-[20px] text-neutral-11">create a rewards pool</li>
                      <li className="text-[16px] md:text-[20px] text-neutral-11">
                        turn on self-funding rewards{" "}
                        {!isMobile && (
                          <>
                            (read more{" "}
                            <a
                              href={SELF_FUND_DOCS}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-positive-11"
                            >
                              here)
                            </a>
                          </>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ContestParamsSplitFeeDestination;
