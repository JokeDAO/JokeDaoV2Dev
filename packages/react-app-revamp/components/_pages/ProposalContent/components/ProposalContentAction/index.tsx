/* eslint-disable react/no-unescaped-entities */
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatEther } from "ethers";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";

interface ProposalActionProps {
  proposalId: string;
  onVotingModalOpen: (value: boolean) => void;
}

const ProposalContentAction: FC<ProposalActionProps> = ({ proposalId, onVotingModalOpen }) => {
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { openConnectModal } = useConnectModal();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { votesOpen, anyoneCanVote, charge } = useContestStore(state => state);
  const { isConnected } = useAccount();
  const formattedVotingOpen = moment(votesOpen);
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const setPickProposal = useCastVotesStore(state => state.setPickedProposal);
  const { currentUserAvailableVotesAmount, isCurrentUserVoteQualificationLoading, currentUserTotalVotesAmount } =
    useUserStore(state => state);
  const canVote = currentUserAvailableVotesAmount > 0;
  const outOfVotes = currentUserTotalVotesAmount > 0 && !canVote;
  const costToVoteFormatted = formatEther(BigInt(charge?.type.costToVote ?? 0));
  const nativeCurrency = chains.find(chain => chain.name === chainName.toLowerCase())?.nativeCurrency;
  const zeroVotesOnAnyoneCanVote = currentUserTotalVotesAmount === 0 && anyoneCanVote;

  switch (contestStatus) {
    case ContestStatus.ContestOpen:
    case ContestStatus.SubmissionOpen:
      return <p className="text-neutral-10">voting opens {formattedVotingOpen.format("MMMM Do, h:mm a")}</p>;

    case ContestStatus.VotingOpen:
      if (!isConnected) {
        return (
          <p className="text-[16px] text-positive-11 font-bold" onClick={openConnectModal}>
            connect wallet to vote
          </p>
        );
      }

      if (isCurrentUserVoteQualificationLoading) {
        return (
          <Skeleton
            height={32}
            width={isMobile ? 100 : 160}
            borderRadius={40}
            baseColor="#706f78"
            highlightColor="#FFE25B"
            duration={1}
          />
        );
      }

      if (canVote) {
        if (isMobile) {
          return (
            <Link href={`/contest/${chainName}/${contestAddress}/submission/${proposalId}`} className="w-full">
              <ButtonV3 type={ButtonType.TX_ACTION} colorClass="bg-gradient-next rounded-[40px]" size={ButtonSize.FULL}>
                add votes
              </ButtonV3>
            </Link>
          );
        } else {
          return (
            <ButtonV3
              type={ButtonType.TX_ACTION}
              colorClass="bg-gradient-next rounded-[40px]"
              size={ButtonSize.DEFAULT_LONG}
              onClick={() => {
                setPickProposal(proposalId);
                onVotingModalOpen(true);
              }}
            >
              add votes
            </ButtonV3>
          );
        }
      }

      if (zeroVotesOnAnyoneCanVote) {
        return (
          <p className="text-[16px] text-neutral-10 font-bold">
            only wallets with at least {costToVoteFormatted} {nativeCurrency?.symbol} can play
          </p>
        );
      }

      if (outOfVotes) {
        return <p className="text-[16px] text-neutral-10 font-bold">you've deployed all your votes</p>;
      }

      if (!canVote) {
        return <p className="text-[16px] text-neutral-10 font-bold">only allowlisted wallets can play</p>;
      }

    case ContestStatus.VotingClosed:
      return <p className="text-neutral-10">voting closed</p>;
  }
};

export default ProposalContentAction;
