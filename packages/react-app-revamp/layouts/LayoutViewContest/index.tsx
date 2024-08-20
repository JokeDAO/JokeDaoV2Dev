"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import ShareDropdown from "@components/Share";
import ButtonV3 from "@components/UI/ButtonV3";
import Loader from "@components/UI/Loader";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ContestTab from "@components/_pages/Contest/Contest";
import ContestExtensions from "@components/_pages/Contest/Extensions";
import ContestParameters from "@components/_pages/Contest/Parameters";
import ContestRewards from "@components/_pages/Contest/Rewards";
import ContestName from "@components/_pages/Contest/components/ContestName";
import ContestRewardsInfo from "@components/_pages/Contest/components/RewardsInfo";
import ContestTabs, { Tab } from "@components/_pages/Contest/components/Tabs";
import { useShowRewardsStore } from "@components/_pages/Create/pages/ContestDeploying";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { extractPathSegments } from "@helpers/extractPath";
import { populateBugReportLink } from "@helpers/githubIssue";
import { generateUrlContest } from "@helpers/share";
import { MAX_MS_TIMEOUT } from "@helpers/timeout";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAccountChange } from "@hooks/useAccountChange";
import { useContest } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import useContestEvents from "@hooks/useContestEvents";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useUser from "@hooks/useUser";
import moment from "moment";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUrl } from "nextjs-current-url";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount, useAccountEffect } from "wagmi";
import LayoutViewContestError from "./components/Error";

const LayoutViewContest = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const url = useUrl();
  const { address: accountAddress } = useAccount();
  const { chainName: chainNameFromUrl, address: addressFromUrl } = extractPathSegments(pathname ?? "");
  const showRewards = useShowRewardsStore(state => state.showRewards);
  const { isLoading, address, fetchContestInfo, isSuccess, error, chainName } = useContest();
  const {
    submissionsOpen,
    votesClose,
    votesOpen,
    contestAuthorEthereumAddress,
    contestName,
    isReadOnly,
    rewardsModuleAddress,
    rewardsAbi,
  } = useContestStore(state => state);
  const accountChanged = useAccountChange();
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { setContestStatus } = useContestStatusStore(state => state);
  const { displayReloadBanner } = useContestEvents();
  const [tab, setTab] = useState<Tab>(Tab.Contest);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const bugReportLink = populateBugReportLink(url?.href ?? "", accountAddress ?? "", error ?? "");
  const [fadeBg, setFadeBg] = useState(false);

  useAccountEffect({
    onConnect(data) {
      if (ofacAddresses.includes(data.address)) {
        window.location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

  useEffect(() => {
    if (isLoading) return;

    const now = moment();
    const formattedSubmissionOpen = moment(submissionsOpen);
    const formattedVotingOpen = moment(votesOpen);
    const formattedVotingClose = moment(votesClose);

    let timeoutId: NodeJS.Timeout;

    const setAndScheduleStatus = (status: ContestStatus, nextStatus: ContestStatus, nextTime: moment.Moment) => {
      setContestStatus(status);
      if (now.isBefore(nextTime)) {
        const msUntilNext = nextTime.diff(now);
        timeoutId = setTimeout(
          () => {
            setContestStatus(nextStatus);
          },
          msUntilNext > MAX_MS_TIMEOUT ? MAX_MS_TIMEOUT : msUntilNext,
        );
      }
    };

    if (now.isBefore(formattedSubmissionOpen)) {
      setAndScheduleStatus(ContestStatus.ContestOpen, ContestStatus.SubmissionOpen, formattedSubmissionOpen);
    } else if (now.isBefore(formattedVotingOpen)) {
      setAndScheduleStatus(ContestStatus.SubmissionOpen, ContestStatus.VotingOpen, formattedVotingOpen);
    } else if (now.isBefore(formattedVotingClose)) {
      setAndScheduleStatus(ContestStatus.VotingOpen, ContestStatus.VotingClosed, formattedVotingClose);
    } else {
      setContestStatus(ContestStatus.VotingClosed);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [submissionsOpen, votesOpen, votesClose, setContestStatus, isLoading]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accountChanged) {
        await Promise.all([checkIfCurrentUserQualifyToSubmit(), checkIfCurrentUserQualifyToVote()]);
      }
    };

    fetchUserData();
  }, [accountChanged]);

  useEffect(() => {
    fetchContestInfo();
  }, [chainNameFromUrl, addressFromUrl]);

  useEffect(() => {
    if (showRewards) {
      setTab(Tab.Rewards);
    }
  }, [showRewards]);

  const renderTabs = useMemo<ReactNode>(() => {
    switch (tab) {
      case Tab.Contest:
        return <ContestTab />;
      case Tab.Rewards:
        return (
          <div className="mt-12">
            <ContestRewards />
          </div>
        );
      case Tab.Parameters:
        return (
          <div className="mt-12">
            <ContestParameters />
          </div>
        );
      case Tab.Extensions:
        return (
          <div className="mt-12">
            <ContestExtensions />
          </div>
        );
      default:
        break;
    }
  }, [tab]);

  if (error && !isLoading) {
    return <LayoutViewContestError error={error} bugReportLink={bugReportLink} />;
  }

  if (isLoading) {
    return <Loader>Loading contest info...</Loader>;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`${isLoading ? "pointer-events-none" : ""} w-full px-6 md:px-7 lg:w-[750px] mx-auto`}>
      <div
        className={`md:pt-5 md:pb-20 flex flex-col ${
          pathname === ROUTE_CONTEST_PROPOSAL ? "md:col-span-12" : "md:col-span-9"
        }`}
      >
        {isReadOnly && !isLoading && (
          <div className="w-full bg-true-black text-[16px] text-center flex flex-col gap-1 border border-neutral-11 rounded-[10px] py-2 px-4 items-center shadow-timer-container">
            <div className="flex flex-col text-start">
              <p>
                missing environmental variables limit some functionalities to <b>read mode</b>.
              </p>
              <p>
                for more details, visit{" "}
                <a className="text-positive-11" href="https://github.com/jk-labs-inc/jokerace#readme" target="_blank">
                  <b>here!</b>
                </a>
              </p>
            </div>
          </div>
        )}

        {
          <>
            {isSuccess && !error && !isLoading && (
              <>
                {displayReloadBanner && (
                  <div className="w-full bg-true-black text-[16px] text-center flex flex-col sticky top-0 gap-1 z-10 border border-neutral-11 rounded-[10px] py-2 items-center shadow-timer-container">
                    <div className="flex flex-col">
                      <span>Let&apos;s refresh!</span>
                      <p className="font-normal">Looks like live updates were frozen.</p>
                    </div>
                    <ButtonV3 colorClass="bg-gradient-create" onClick={handleRefresh}>
                      Refresh
                    </ButtonV3>
                  </div>
                )}
                <div className="animate-reveal pt-3 md:pt-0">
                  <div className="flex flex-col mt-6 md:mt-10 gap-4">
                    <ContestName contestName={contestName} address={address} chainName={chainName} />

                    <div
                      className={`flex flex-row ${rewardsModuleAddress && rewardsAbi ? "justify-between" : "gap-3"} md:justify-normal md:gap-4 items-center`}
                    >
                      <UserProfileDisplay
                        ethereumAddress={contestAuthorEthereumAddress}
                        shortenOnFallback
                        textualVersion={isMobile}
                      />
                      {rewardsModuleAddress && rewardsAbi ? (
                        <ContestRewardsInfo rewardsModuleAddress={rewardsModuleAddress} rewardsAbi={rewardsAbi} />
                      ) : null}
                      {isMobile ? (
                        <div
                          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-[10px] border border-neutral-11 cursor-pointer"
                          onClick={() =>
                            navigator.share({
                              url: generateUrlContest(address, chainName),
                            })
                          }
                        >
                          <Image src="/forward.svg" alt="share" width={15} height={13} />
                        </div>
                      ) : (
                        <ShareDropdown
                          contestAddress={address}
                          chain={chainName}
                          contestName={contestName}
                          onMenuStateChange={setFadeBg}
                        />
                      )}

                      <div
                        className="standalone-pwa w-8 h-8 items-center rounded-[10px] border border-neutral-11 cursor-pointer"
                        onClick={() => window.location.reload()}
                      >
                        <ArrowPathIcon className="w-4 h-4 m-auto" />
                      </div>
                    </div>
                  </div>
                  <div className={`${fadeBg ? "opacity-30" : "opacity-100"}`}>
                    <div className="mt-8 mb-8 gap-3 flex flex-col">
                      <ContestTabs tab={tab} onChange={tab => setTab(tab)} />
                    </div>
                    {renderTabs}

                    {children}
                  </div>
                </div>
              </>
            )}
          </>
        }
      </div>
    </div>
  );
};

export default LayoutViewContest;
