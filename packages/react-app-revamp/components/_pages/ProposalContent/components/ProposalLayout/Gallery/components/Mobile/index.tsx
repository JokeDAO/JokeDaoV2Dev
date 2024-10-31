import { Proposal } from "@components/_pages/ProposalContent";
import ProposalContentProfile from "@components/_pages/ProposalContent/components/Profile";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ChatBubbleLeftEllipsisIcon, CheckIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import Link from "next/link";
import { FC } from "react";
import ProposalLayoutGalleryRankOrPlaceholderMobile from "../RankOrPlaceholder/components/Mobile";
import { useRouter } from "next/navigation";

interface ProposalLayoutGalleryMobileProps {
  proposal: Proposal;
  proposalAuthorData: {
    name: string;
    avatar: string;
    isLoading: boolean;
    isError: boolean;
  };
  isMobile: boolean;
  chainName: string;
  contestAddress: string;
  contestStatus: ContestStatus;
  formattedVotingOpen: moment.Moment;
  commentLink: string;
  allowDelete: boolean;
  selectedProposalIds: string[];
  handleVotingModalOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  toggleProposalSelection?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ProposalLayoutGalleryMobile: FC<ProposalLayoutGalleryMobileProps> = ({
  proposal,
  proposalAuthorData,
  contestStatus,
  chainName,
  commentLink,
  allowDelete,
  selectedProposalIds,
  toggleProposalSelection,
  contestAddress,
  handleVotingModalOpen,
}) => {
  const router = useRouter();

  const navigateToProposal = () => {
    router.push(`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`);
  };

  const navigateToComment = () => {
    router.push(`${commentLink}`);
  };

  return (
    <Link
      href={`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`}
      className="flex flex-col gap-2 p-4 bg-true-black rounded-2xl shadow-entry-card w-full"
    >
      <div className="flex gap-4">
        <div className="flex flex-col justify-between">
          <ProposalLayoutGalleryRankOrPlaceholderMobile proposal={proposal} contestStatus={contestStatus} />
          <div className="w-6 h-6 flex items-center justify-center">
            {allowDelete ? (
              <button className="h-4 w-4 relative cursor-pointer" onClick={toggleProposalSelection}>
                <CheckIcon
                  className={`absolute top-0 left-0 transform transition-all ease-in-out duration-300 
              ${selectedProposalIds.includes(proposal.id) ? "opacity-100" : "opacity-0"}
              h-4 w-4 text-positive-11 bg-white bg-true-black border border-positive-11 hover:text-positive-10 
              shadow-md hover:shadow-lg rounded-md`}
                />
                <TrashIcon
                  className={`absolute top-0 left-0 transition-opacity duration-300 
              ${selectedProposalIds.includes(proposal.id) ? "opacity-0" : "opacity-100"}
              h-4 w-4 text-negative-11 bg-true-black hover:text-negative-10 transition-colors duration-300 ease-in-out`}
                />
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center">
            <ProposalContentProfile
              name={proposalAuthorData.name}
              avatar={proposalAuthorData.avatar}
              isLoading={proposalAuthorData.isLoading}
              isError={proposalAuthorData.isError}
              size="extraSmall"
              textColor="text-neutral-9"
            />
            <button
              onClick={navigateToProposal}
              className="w-4 h-4 flex justify-center items-center rounded-full border text-positive-11 border-positive-11"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <img src={proposal.metadataFields.stringArray[0]} alt="entry image" className="rounded-2xl" />
          <div className="flex gap-2 items-center">
            {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
              <button
                onClick={handleVotingModalOpen}
                className="min-w-12 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-positive-11  border border-neutral-2"
              >
                <img src="/contest/upvote.svg" width={16} height={16} alt="upvote" className="flex-shrink-0" />
                <p className="text-[16px] font-bold flex-grow text-center">{formatNumberAbbreviated(proposal.votes)}</p>
              </button>
            ) : null}
            <button
              onClick={navigateToComment}
              className="min-w-12 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px]  text-neutral-9  border border-neutral-9"
            >
              <ChatBubbleLeftEllipsisIcon className="w-4 h-4 flex-shrink-0" />
              <p className="text-[16px] font-bold flex-grow text-center">{proposal.commentsCount}</p>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProposalLayoutGalleryMobile;
