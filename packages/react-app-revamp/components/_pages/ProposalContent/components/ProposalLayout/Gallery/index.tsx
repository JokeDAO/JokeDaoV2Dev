import { Proposal } from "@components/_pages/ProposalContent";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import ImageWithFallback from "../../ImageWithFallback";
import ProposalContentProfile from "../../Profile";
import ProposalLayoutGalleryRankOrPlaceholder from "./components/RankOrPlaceholder";

interface ProposalLayoutGalleryProps {
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
  handleVotingModalOpen?: () => void;
  toggleProposalSelection?: (proposalId: string) => void;
}

const ProposalLayoutGallery: FC<ProposalLayoutGalleryProps> = ({
  proposal,
  proposalAuthorData,
  chainName,
  contestAddress,
  contestStatus,
  allowDelete,
  selectedProposalIds,
  handleVotingModalOpen,
  toggleProposalSelection,
}) => {
  const router = useRouter();

  const onVotingModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    handleVotingModalOpen?.();
  };

  const navigateToProposal = () => {
    router.push(`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`);
  };

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    toggleProposalSelection?.(proposal.id);
  };

  return (
    <Link
      href={`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`}
      className="flex flex-col gap-2 p-2 bg-true-black rounded-2xl shadow-entry-card w-full border border-transparent hover:border-primary-3 transition-colors duration-300 ease-in-out"
    >
      <div className="rounded-2xl overflow-hidden relative">
        <ImageWithFallback
          mediumSrc={`${proposal.metadataFields.stringArray[0]}`}
          fullSrc={proposal.metadataFields.stringArray[0]}
          alt="entry image"
        />

        {proposal.rank ? (
          <div className="absolute top-2 left-2">
            <ProposalLayoutGalleryRankOrPlaceholder rank={proposal.rank} />
          </div>
        ) : null}

        <div className="absolute top-2 right-2">
          <ProposalContentProfile
            name={proposalAuthorData.name}
            avatar=""
            isLoading={proposalAuthorData.isLoading}
            isError={proposalAuthorData.isError}
            textColor="text-neutral-15"
            size="extraSmall"
            dropShadow
          />
        </div>

        {allowDelete ? (
          <div className="absolute bottom-1 left-2">
            <div className="bg-true-black bg-opacity-75 w-8 h-6 rounded-full flex items-center justify-center">
              <button className="relative w-4 h-4 cursor-pointer" onClick={onDeleteClick}>
                <CheckIcon
                  className={`absolute inset-0 transform transition-all ease-in-out duration-300 
            ${selectedProposalIds.includes(proposal.id) ? "opacity-100" : "opacity-0"}
            text-positive-11 bg-white bg-transparent border border-positive-11 hover:text-positive-10 
            shadow-md hover:shadow-lg rounded-md`}
                />
                <TrashIcon
                  className={`absolute inset-0 transition-opacity duration-300 
            ${selectedProposalIds.includes(proposal.id) ? "opacity-0" : "opacity-100"}
            text-negative-11 bg-transparent hover:text-negative-10 transition-colors duration-300 ease-in-out`}
                />
              </button>
            </div>
          </div>
        ) : null}

        {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <button
              onClick={onVotingModalOpen}
              className="min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black bg-opacity-75 rounded-[16px] cursor-pointer text-positive-11  border border-neutral-2 hover:bg-positive-11 hover:text-true-black transition-colors duration-300 ease-in-out group"
            >
              <img
                src="/contest/upvote.svg"
                width={16}
                height={16}
                alt="upvote"
                className="flex-shrink-0 transition-all duration-300 ease-in-out group-hover:brightness-0 group-hover:saturate-0"
              />
              <p className="text-[16px] font-bold flex-grow text-center">{formatNumberAbbreviated(proposal.votes)}</p>
            </button>
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default ProposalLayoutGallery;
