import Collapsible from "@components/UI/Collapsible";
import { formatBalance } from "@helpers/formatBalance";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { SplitFeeDestination } from "@hooks/useDeployContest/types";
import Image from "next/image";
import { FC, useState } from "react";
import ChargeLayoutCommisionDetails from "../CommisionDetails";

interface ChargeLayoutSubmissionProps {
  userAddress: string;
  balance: string;
  entryChargeFormatted: string;
  splitFeeDestination: SplitFeeDestination;
  commisionValue: string;
  nativeCurrencySymbol: string;
  nativeCurrencyLabel: string;
  insufficientBalance: boolean;
}

const ChargeLayoutSubmission: FC<ChargeLayoutSubmissionProps> = ({
  userAddress,
  balance,
  nativeCurrencySymbol,
  nativeCurrencyLabel,
  entryChargeFormatted,
  commisionValue,
  splitFeeDestination,
  insufficientBalance,
}) => {
  const [isEntryChargeDetailsOpen, setIsEntryChargeDetailsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full md:w-[344px]">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <div className="flex gap-3">
            <Image
              src={`${insufficientBalance ? "/contest/wallet-entry-insufficient.svg" : "/contest/wallet-entry.svg"}`}
              height={20}
              width={22}
              alt="wallet"
            />
            <p className={`text-[16px] ${insufficientBalance ? "text-negative-11" : "text-neutral-9"}  font-bold`}>
              {shortenEthereumAddress(userAddress ?? "")}
            </p>
          </div>
          {insufficientBalance ? <p className="text-negative-11 text-[16px]">insufficient funds</p> : null}
        </div>

        <p className={`text-[16px] ${insufficientBalance ? "text-negative-11" : "text-neutral-9"} ml-auto font-bold`}>
          {formatBalance(balance)} {nativeCurrencySymbol} available
        </p>
      </div>
      <div className={`flex flex-col`}>
        <div className="flex items-center">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => setIsEntryChargeDetailsOpen(!isEntryChargeDetailsOpen)}
          >
            <p className="text-[16px] text-neutral-9">entry charge</p>
            <button
              className={`transition-transform duration-500 ease-in-out transform ${
                isEntryChargeDetailsOpen ? "" : "rotate-180"
              }`}
            >
              <ChevronUpIcon height={20} className="text-neutral-9" />
            </button>
          </div>

          <p className="text-[16px] text-neutral-9 ml-auto">
            {entryChargeFormatted} {nativeCurrencyLabel} (+gas)
          </p>
        </div>
        <Collapsible isOpen={isEntryChargeDetailsOpen}>
          <ChargeLayoutCommisionDetails
            splitFeeDestination={splitFeeDestination}
            commisionValue={commisionValue}
            nativeCurrencyLabel={nativeCurrencyLabel}
          />
        </Collapsible>
      </div>
    </div>
  );
};

export default ChargeLayoutSubmission;
