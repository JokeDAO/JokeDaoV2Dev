import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import Loader from "@components/UI/Loader";
import DialogCheckBalanceRewardsModule from "@components/_pages/DialogCheckBalanceRewardsModule";
import DialogWithdrawFundsFromRewardsModule from "@components/_pages/DialogWithdrawFundsFromRewardsModule";
import CreateRewardsFunding from "@components/_pages/Rewards/components/Fund";
import ContestWithdrawRewards from "@components/_pages/Rewards/components/Withdraw";
import RewardsDistributionTable from "@components/_pages/RewardsDistributionTable/components";
import { RewardsTableShare } from "@components/_pages/RewardsTable";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import usePaidRewardTokens from "@hooks/useRewardsTokens/usePaidRewardsTokens";
import { useUnpaidRewardTokens } from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { compareVersions } from "compare-versions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useAccountEffect } from "wagmi";
import CreateRewards from "./components/Create";

const ContestRewards = () => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const {
    isSuccess,
    isLoading,
    supportsRewardsModule,
    contestAuthorEthereumAddress,
    sortingEnabled,
    contestMaxProposalCount,
    version,
    downvotingAllowed,
    rewardsModuleAddress,
  } = useContestStore(state => state);
  const [isFundRewardsOpen, setIsFundRewardsOpen] = useState(false);
  const [isWithdrawRewardsOpen, setIsWithdrawRewardsOpen] = useState(false);
  const [isCheckBalanceRewardsOpen, setIsCheckBalanceRewardsOpen] = useState(false);
  const rewardsStore = useRewardsStore(state => state);
  const { getContestRewardsModule } = useRewardsModule();
  const { address: accountAddress } = useAccount();
  const { unpaidTokens } = useUnpaidRewardTokens("rewards-module-unpaid-tokens", rewardsModuleAddress);
  const { paidTokens } = usePaidRewardTokens("rewards-module-paid-tokens", rewardsModuleAddress);
  const creator = contestAuthorEthereumAddress === accountAddress;

  useAccountEffect({
    onConnect(data) {
      if (ofacAddresses.includes(data.address)) {
        window.location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

  useEffect(() => {
    if (rewardsStore?.isSuccess) return;
    if (supportsRewardsModule) getContestRewardsModule();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardsStore?.isSuccess, supportsRewardsModule]);

  if (!supportsRewardsModule && !creator) {
    return (
      <p className="text-[16px] md:text-[20px] animate-reveal">
        For this contest, there is no rewards module; the contest creator is the only one who may configure one.
      </p>
    );
  }

  if (!supportsRewardsModule && creator) {
    if (version) {
      if (compareVersions(version, "4.1") == -1) {
        if (contestMaxProposalCount > 100) {
          return (
            <p className="text-[16px]">
              For this contest, you cannot create a rewards module; the maximum number of submissions for the contest
              must be <b>100</b> or less in order to be able to create a rewards module.
            </p>
          );
        }
      } else if (compareVersions(version, "4.1") >= 0) {
        if (downvotingAllowed || !sortingEnabled) {
          return (
            <p className="text-[16px]">
              For this contest, you cannot create a rewards module; in order to create rewards module, you need to
              disable downvoting in the creation process.
            </p>
          );
        }
      }
    }

    return <CreateRewards />;
  }

  return (
    <div className="animate-reveal">
      {!isLoading && isSuccess && (
        <>
          {rewardsStore.isLoading && <Loader>Loading rewards</Loader>}
          {rewardsStore.isSuccess && (
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-12">
                <p className="text-[24px] text-neutral-11 font-bold">rewards pool parameters</p>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <p className="text-[16px] text-neutral-11 font-bold">rewards pool address:</p>
                    <a
                      className="text-positive-11 text-[16px] font-bold underline break-all"
                      href={`${rewardsStore?.rewards?.blockExplorers?.url}address/${rewardsStore?.rewards?.contractAddress}`}
                      target="_blank"
                    >
                      {rewardsStore?.rewards?.contractAddress}
                    </a>
                    <p className="text-[12px] font-bold text-neutral-11">
                      {creator ? (
                        <>
                          you can withdraw funds at any time{" "}
                          <span
                            className="text-positive-11 cursor-pointer"
                            onClick={() => setIsWithdrawRewardsOpen(true)}
                          >
                            here
                          </span>
                          .
                        </>
                      ) : (
                        <>the contest creator can withdraw funds at any time.</>
                      )}
                    </p>
                  </div>
                  <p className="text-[16px] text-neutral-11 font-bold">distribution of rewards in pool:</p>
                  {rewardsStore?.rewards?.payees?.map((payee: any, index: number) => (
                    <RewardsTableShare
                      key={`rank-${`${payee}`}`}
                      chainId={chainId}
                      payee={payee}
                      contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                      abiRewardsModule={rewardsStore.rewards.abi}
                      totalShares={rewardsStore.rewards.totalShares}
                      isLast={index === rewardsStore.rewards.payees.length - 1}
                    />
                  ))}
                  {creator && (
                    <>
                      <ButtonV3
                        colorClass={`bg-gradient-create rounded-[40px] mt-3`}
                        size={ButtonSize.LARGE}
                        onClick={() => setIsFundRewardsOpen(true)}
                      >
                        fund pool
                      </ButtonV3>
                      <DialogModalV3
                        isOpen={isFundRewardsOpen}
                        setIsOpen={value => setIsFundRewardsOpen(value)}
                        title="rewards"
                        className="xl:w-[1110px] 3xl:w-[1300px] h-[850px]"
                      >
                        <div className="md:pl-[50px] lg:pl-[100px]">
                          <div className="pt-[50px]">{<CreateRewardsFunding isFundingForTheFirstTime={false} />}</div>
                        </div>
                      </DialogModalV3>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-1">
                  <p className="text-[24px] text-neutral-11 font-bold">rewards to distribute</p>
                  <p className="text-[12px]">
                    If you want to determine for yourself if a custom token is included in the rewards, you can do it{" "}
                    <span
                      className="text-positive-11 cursor-pointer font-bold"
                      onClick={() => setIsCheckBalanceRewardsOpen(true)}
                    >
                      here
                    </span>
                    .
                  </p>
                  <p className="text-neutral-11 text-[12px]">
                    <b>in case of ties, funds will be reverted to you to distribute manually.</b> please be aware of any
                    obligations you might
                    <br /> face for receiving funds.
                  </p>
                </div>

                {rewardsStore?.rewards?.payees?.map((payee: any, index: number) => (
                  <RewardsDistributionTable
                    key={index}
                    chainId={chainId}
                    payee={payee}
                    erc20Tokens={unpaidTokens ?? []}
                    contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                    abiRewardsModule={rewardsStore.rewards.abi}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-1">
                  <p className="text-[24px] text-neutral-11 font-bold">previously distributed rewards</p>
                </div>

                {rewardsStore?.rewards?.payees?.map((payee: any, index: number) => (
                  <RewardsDistributionTable
                    key={index}
                    chainId={chainId}
                    payee={payee}
                    erc20Tokens={paidTokens ?? []}
                    contractRewardsModuleAddress={rewardsStore.rewards.contractAddress}
                    abiRewardsModule={rewardsStore.rewards.abi}
                    showPreviouslyDistributedTable
                  />
                ))}
              </div>
            </div>
          )}
          <DialogWithdrawFundsFromRewardsModule isOpen={isWithdrawRewardsOpen} setIsOpen={setIsWithdrawRewardsOpen}>
            <ContestWithdrawRewards rewardsStore={rewardsStore} />
          </DialogWithdrawFundsFromRewardsModule>
          <DialogCheckBalanceRewardsModule
            isOpen={isCheckBalanceRewardsOpen}
            setIsOpen={setIsCheckBalanceRewardsOpen}
          />
        </>
      )}
    </div>
  );
};

export default ContestRewards;
