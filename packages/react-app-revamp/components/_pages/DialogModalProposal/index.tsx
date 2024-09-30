import Comments from "@components/Comments";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";
import useCastVotes from "@hooks/useCastVotes";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import { compareVersions } from "compare-versions";
import { COMMENTS_VERSION, ProposalData } from "lib/proposal";
import Image from "next/image";
import { FC, useEffect } from "react";
import { useAccount } from "wagmi";
import ListProposalVotes from "../ListProposalVotes";
import { VoteType } from "@hooks/useDeployContest/types";
import { chains } from "@config/wagmi";

interface DialogModalProposalProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
    version: string;
  };
  isOpen: boolean;
  prompt: string;
  proposalId: string;
  proposalData: ProposalData | null;
  isProposalLoading: boolean;
  isProposalError: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
  onConnectWallet?: () => void;
}

const DialogModalProposal: FC<DialogModalProposalProps> = ({
  contestInfo,
  isOpen,
  setIsOpen,
  prompt,
  proposalData,
  proposalId,
  isProposalLoading,
  isProposalError,
  onClose,
  onVote,
  onPreviousEntry,
  onNextEntry,
  onConnectWallet,
}) => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { isConnected } = useAccount();
  const { isSuccess } = useCastVotes();
  const { listProposalsIds } = useProposalStore(state => state);
  const stringifiedProposalsIds = listProposalsIds.map(id => id.toString());
  const currentIndex = stringifiedProposalsIds.indexOf(proposalId);
  const totalProposals = listProposalsIds.length;
  const { downvotingAllowed, charge } = useContestStore(state => state);
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;
  const commentsAllowed = compareVersions(contestInfo.version, COMMENTS_VERSION) == -1 ? false : true;
  const chainCurrencySymbol = chains.find(chain => chain.id === contestInfo.chainId)?.nativeCurrency?.symbol;
  const isAnyoneCanVote = charge?.voteType === VoteType.PerVote;

  useEffect(() => {
    if (isSuccess) setIsOpen?.(false);
  }, [isSuccess, setIsOpen]);

  if (isProposalError) {
    return (
      <DialogModalV3
        title="Proposal"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="xl:w-[1110px] 3xl:w-[1300px]"
        onClose={onClose}
      >
        <div
          className="flex flex-col gap-8 md:pl-[50px] lg:pl-[100px] mt-[20px] md:mt-[60px] pb-[60px]"
          id="custom-modal"
        >
          <p className="text-[16px] text-negative-11 font-bold">
            ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
          </p>
        </div>
      </DialogModalV3>
    );
  }

  return (
    <DialogModalV3
      title="Proposal"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="xl:w-[1110px] 3xl:w-[1300px]"
      onClose={onClose}
    >
      <div
        className="flex flex-col gap-8 md:pl-[50px] lg:pl-[100px] mt-[20px] md:mt-[60px] pb-[60px]"
        id="custom-modal"
      >
        <ContestPrompt type="modal" prompt={prompt} hidePrompt />
        <div className={`${totalProposals > 1 ? "flex" : "hidden"} gap-4`}>
          {currentIndex !== 0 && (
            <ButtonV3
              colorClass="bg-primary-2"
              textColorClass="flex items-center justify-center gap-2 text-neutral-11 text-[16px] font-bold rounded-[40px] group transform transition-transform duration-200 active:scale-95"
              size={ButtonSize.LARGE}
              onClick={onPreviousEntry}
              isDisabled={isProposalLoading}
            >
              <div className="transition-transform duration-200 group-hover:-translate-x-1">
                <Image src="/contest/previous-entry.svg" alt="prev-entry" width={16} height={14} className="mt-1" />
              </div>
              previous entry
            </ButtonV3>
          )}
          {currentIndex !== totalProposals - 1 && (
            <ButtonV3
              colorClass="bg-primary-2"
              textColorClass="flex items-center justify-center gap-2 text-neutral-11 text-[16px] font-bold rounded-[40px] group transform transition-transform duration-200 active:scale-95"
              size={ButtonSize.LARGE}
              onClick={onNextEntry}
              isDisabled={isProposalLoading}
            >
              next entry
              <div className="transition-transform duration-200 group-hover:translate-x-1">
                <Image src="/contest/next-entry.svg" alt="prev-entry" width={16} height={14} className="mt-[3px]" />
              </div>
            </ButtonV3>
          )}
        </div>

        {isProposalLoading ? (
          <p className="loadingDots font-sabo text-[18px] mt-8 text-neutral-9">loading submission info</p>
        ) : (
          <div className="animate-reveal flex flex-col gap-12">
            {proposalData?.proposal ? (
              <div className="flex gap-2 items-center">
                <UserProfileDisplay
                  ethereumAddress={proposalData.proposal.authorEthereumAddress}
                  shortenOnFallback={true}
                />
                {proposalData.proposal.rank > 0 && (
                  <div className="flex gap-2 items-center">
                    <span className="text-neutral-11">&#8226;</span>{" "}
                    <p className="text-[16px] font-bold text-neutral-11">
                      {formatNumberAbbreviated(proposalData.proposal.votes)} vote
                      {proposalData.proposal.votes > 1 ? "s" : ""}
                    </p>
                    <span className="text-neutral-9">&#8226;</span>{" "}
                    <p className="text-[16px] font-bold text-neutral-9">
                      {ordinalize(proposalData.proposal.rank).label} place{" "}
                      {proposalData.proposal.isTied ? "(tied)" : ""}
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {proposalData?.proposal ? (
              <ContestProposal
                proposal={proposalData.proposal}
                contestStatus={contestStatus}
                proposalId={proposalId}
                displaySocials
              />
            ) : null}
            {contestStatus === ContestStatus.VotingOpen && (
              <div className="flex flex-col gap-4 md:gap-8 md:w-80">
                <div className="flex flex-col gap-4">
                  <hr className="block border border-neutral-9" />
                  <p className="text-neutral-11 font-bold text-[20px]">add votes</p>
                </div>
                {isConnected ? (
                  currentUserAvailableVotesAmount > 0 ? (
                    <VotingWidget
                      proposalId={proposalId}
                      amountOfVotes={currentUserAvailableVotesAmount}
                      onVote={onVote}
                      downvoteAllowed={downvotingAllowed}
                    />
                  ) : outOfVotes ? (
                    <p className="text-[16px] text-neutral-11">
                      looks like you've used up all your votes this contest <br />
                      feel free to try connecting another wallet to see if it has more votes!
                    </p>
                  ) : isAnyoneCanVote ? (
                    <p className="text-[16px] text-negative-11 font-bold">
                      add {chainCurrencySymbol} to {contestInfo.chain} to get votes
                    </p>
                  ) : (
                    <p className="text-[16px] text-neutral-11">
                      unfortunately your wallet didn't qualify to vote in this contest <br />
                      feel free to try connecting another wallet!
                    </p>
                  )
                ) : (
                  <p className="text-[16px] text-neutral-11 font-bold">
                    <span className="text-positive-11 cursor-pointer text-[16px]" onClick={onConnectWallet}>
                      connect wallet
                    </span>{" "}
                    to see if you qualify
                  </p>
                )}
              </div>
            )}

            {proposalData && proposalData.proposal && proposalData.proposal.votes > 0 && (
              <ListProposalVotes proposalId={proposalId} votedAddresses={proposalData.votedAddresses} />
            )}
            {commentsAllowed && proposalData ? (
              <Comments
                contestAddress={contestInfo.address}
                contestChainId={contestInfo.chainId}
                proposalId={proposalId}
                numberOfComments={proposalData?.numberOfComments}
              />
            ) : null}
          </div>
        )}
      </div>
    </DialogModalV3>
  );
};

export default DialogModalProposal;
