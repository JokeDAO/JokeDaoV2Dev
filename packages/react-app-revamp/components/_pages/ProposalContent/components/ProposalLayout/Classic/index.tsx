import { Proposal } from "@components/_pages/ProposalContent";
import {
  clearStorageIfNeeded,
  ContestVisibilities,
  HIDDEN_PROPOSALS_STORAGE_KEY,
  toggleContentVisibility,
} from "@components/_pages/ProposalContent/utils/contestVisibility";
import { transform } from "@components/_pages/ProposalContent/utils/markdown";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { loadFromLocalStorage } from "@helpers/localStorage";
import { ChatBubbleLeftEllipsisIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProposalContentInfo from "../../ProposalContentInfo";

interface ProposalLayoutClassicProps {
  proposal: Proposal;
  isMobile: boolean;
  chainName: string;
  contestAddress: string;
  contestStatus: ContestStatus;
  formattedVotingOpen: moment.Moment;
  commentLink: string;
  allowDelete: boolean;
  selectedProposalIds: string[];
  handleVotingModalOpen?: () => void;
  toggleProposalSelection?: (proposalId: string) => void;
}

const ProposalLayoutClassic = ({
  proposal,
  isMobile,
  chainName,
  contestAddress,
  contestStatus,
  formattedVotingOpen,
  commentLink,
  allowDelete,
  selectedProposalIds,
  handleVotingModalOpen,
  toggleProposalSelection,
}: ProposalLayoutClassicProps) => {
  const [isContentHidden, setIsContentHidden] = useState(false);

  useEffect(() => {
    clearStorageIfNeeded();

    const visibilityState = loadFromLocalStorage<ContestVisibilities>(HIDDEN_PROPOSALS_STORAGE_KEY, {});
    const hiddenProposals = visibilityState[contestAddress] || [];

    setIsContentHidden(hiddenProposals.includes(proposal.id));
  }, [contestAddress, proposal.id]);

  const handleToggleVisibility = () => {
    const newVisibility = toggleContentVisibility(contestAddress, proposal.id, isContentHidden);
    setIsContentHidden(newVisibility);
  };
  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-primary-2 animate-reveal">
      <ProposalContentInfo
        authorAddress={proposal.authorEthereumAddress}
        rank={proposal.rank}
        isTied={proposal.isTied}
        isMobile={isMobile}
        isContentHidden={isContentHidden}
        toggleContentVisibility={handleToggleVisibility}
      />
      {!isContentHidden && (
        <div className="md:mx-8 flex flex-col gap-4">
          <div className="flex w-full">
            <Link
              className="inline-block p-4 rounded-[8px] bg-primary-1 border border-transparent hover:border-neutral-9 transition-colors duration-300 ease-in-out overflow-hidden"
              href={`/contest/${chainName}/${contestAddress}/submission/${proposal.id}`}
              shallow
              scroll={false}
              prefetch
            >
              <div className="max-w-full overflow-hidden interweave-container">
                <Interweave
                  className="prose prose-invert interweave-container inline-block w-full"
                  content={proposal.content}
                  transform={transform}
                  tagName="div"
                />
              </div>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
                <button
                  onClick={handleVotingModalOpen}
                  className="min-w-36 flex-shrink-0 h-10 p-2 flex items-center justify-between gap-2 bg-primary-1 rounded-[16px] cursor-pointer border border-transparent hover:border-positive-11 transition-colors duration-300 ease-in-out"
                >
                  <img src="/contest/upvote.svg" width={21.56} height={20.44} alt="upvote" className="flex-shrink-0" />
                  <p className="text-[16px] text-positive-11 font-bold flex-grow text-center">
                    {formatNumberAbbreviated(proposal.votes)} vote{proposal.votes !== 1 ? "s" : ""}
                  </p>
                </button>
              ) : (
                <p className="text-neutral-10 text-[16px] font-bold">
                  voting opens {formattedVotingOpen.format("MMMM Do, h:mm a")}
                </p>
              )}
              <Link
                href={commentLink}
                className="min-w-16 flex-shrink-0 h-10 p-2 flex items-center justify-between gap-2 bg-primary-1 rounded-[16px] cursor-pointer border border-transparent hover:border-neutral-9 transition-colors duration-300 ease-in-out"
                shallow
                scroll={false}
              >
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-neutral-9 flex-shrink-0" />
                <p className="text-[16px] text-neutral-9 font-bold flex-grow text-center">{proposal.commentsCount}</p>
              </Link>
            </div>
            {allowDelete && (
              <div className="h-8 w-8 relative cursor-pointer" onClick={() => toggleProposalSelection?.(proposal.id)}>
                <CheckIcon
                  className={`absolute top-0 left-0 transform transition-all ease-in-out duration-300 
                    ${selectedProposalIds.includes(proposal.id) ? "opacity-100" : "opacity-0"}
                    h-6 w-6 text-positive-11 bg-white bg-true-black border border-positive-11 hover:text-positive-10 
                    shadow-md hover:shadow-lg rounded-md`}
                />
                <TrashIcon
                  className={`absolute top-0 left-0 transition-opacity duration-300 
                    ${selectedProposalIds.includes(proposal.id) ? "opacity-0" : "opacity-100"}
                    h-6 w-6 text-negative-11 bg-true-black hover:text-negative-10 transition-colors duration-300 ease-in-out`}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalLayoutClassic;