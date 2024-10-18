/* eslint-disable @next/next/no-img-element */
import { toastInfo } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { Tweet as TweetType } from "@helpers/isContentTweet";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { EntryPreview } from "@hooks/useDeployContest/store";
import { VoteType } from "@hooks/useDeployContest/types";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import { RawMetadataFields } from "@hooks/useProposal/utils";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import moment from "moment";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { verifyEntryPreviewPrompt } from "../DialogModalSendProposal/utils";
import DialogModalVoteForProposal from "../DialogModalVoteForProposal";
import ProposalLayoutClassic from "./components/ProposalLayout/Classic";
import ProposalLayoutLeaderboard from "./components/ProposalLayout/Leaderboard";

export interface Proposal {
  id: string;
  authorEthereumAddress: string;
  content: string;
  exists: boolean;
  isContentImage: boolean;
  tweet: TweetType;
  votes: number;
  rank: number;
  isTied: boolean;
  commentsCount: number;
  metadataFields: RawMetadataFields;
}

interface ProposalContentProps {
  proposal: Proposal;
  allowDelete: boolean;
  selectedProposalIds: string[];
  toggleProposalSelection?: (proposalId: string) => void;
}

const ProposalContent: FC<ProposalContentProps> = ({
  proposal,
  allowDelete,
  selectedProposalIds,
  toggleProposalSelection,
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const chainCurrencySymbol = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.nativeCurrency
    ?.symbol;
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const { currentUserAvailableVotesAmount } = useUserStore(state => state);
  const { votesOpen, charge } = useContestStore(state => state);
  const canVote = currentUserAvailableVotesAmount > 0;
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const setPickProposal = useCastVotesStore(state => state.setPickedProposal);
  const formattedVotingOpen = moment(votesOpen);
  const commentLink = {
    pathname: `/contest/${chainName}/${contestAddress}/submission/${proposal.id}`,
    query: { comments: "comments" },
  };
  const { fields: metadataFieldsConfig } = useMetadataStore(state => state);
  const { enabledPreview } =
    metadataFieldsConfig.length > 0
      ? verifyEntryPreviewPrompt(metadataFieldsConfig[0].prompt)
      : { enabledPreview: null };

  const handleVotingModalOpen = () => {
    if (isContestCanceled) {
      alert("This contest has been canceled and voting is terminated.");
      return;
    }

    if (contestStatus === ContestStatus.VotingClosed) {
      toastInfo("Voting is closed for this contest.");
      return;
    }

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!canVote) {
      if (charge?.voteType === VoteType.PerVote) {
        toastInfo(`add ${chainCurrencySymbol} to ${chainName} to get votes`);
        return;
      }
      toastInfo("You need to be allowlisted to vote for this contest.");
      return;
    }

    setPickProposal(proposal.id);
    setIsVotingModalOpen(true);
  };

  const renderLayout = () => {
    switch (enabledPreview) {
      case EntryPreview.TITLE:
        return (
          <ProposalLayoutLeaderboard
            proposal={proposal}
            isMobile={isMobile}
            chainName={chainName}
            contestAddress={contestAddress}
            contestStatus={contestStatus}
            formattedVotingOpen={formattedVotingOpen}
            commentLink={commentLink.pathname}
            allowDelete={allowDelete}
            selectedProposalIds={selectedProposalIds}
            handleVotingModalOpen={handleVotingModalOpen}
            toggleProposalSelection={toggleProposalSelection}
          />
        );
      case EntryPreview.IMAGE:
        return <p>image</p>;
      case EntryPreview.TWEET:
        return <p>tweet</p>;
      default:
        return (
          <ProposalLayoutClassic
            proposal={proposal}
            isMobile={isMobile}
            chainName={chainName}
            contestAddress={contestAddress}
            contestStatus={contestStatus}
            formattedVotingOpen={formattedVotingOpen}
            commentLink={commentLink.pathname}
            allowDelete={allowDelete}
            selectedProposalIds={selectedProposalIds}
            handleVotingModalOpen={handleVotingModalOpen}
            toggleProposalSelection={toggleProposalSelection}
          />
        );
    }
  };

  return (
    <>
      {renderLayout()}
      <DialogModalVoteForProposal isOpen={isVotingModalOpen} setIsOpen={setIsVotingModalOpen} proposal={proposal} />
    </>
  );
};

export default ProposalContent;
