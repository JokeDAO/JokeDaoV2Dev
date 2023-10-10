import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import DialogModalSendProposal from "@components/_pages/DialogModalSendProposal";
import ListProposals from "@components/_pages/ListProposals";
import useContest from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { useMediaQuery } from "react-responsive";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import { useAccount } from "wagmi";
import ContestPrompt from "../components/Prompt";
import ProposalStatistics from "../components/ProposalStatistics";
import ContestStickyCards from "../components/StickyCards";
import ContestTimeline from "../components/Timeline";
import { useRouter } from "next/router";

const ContestTab = () => {
  const { contestPrompt } = useContestStore(state => state);
  const router = useRouter();
  const { isConnected } = useAccount();
  const { contestStatus } = useContestStatusStore(state => state);
  const { contestMaxNumberSubmissionsPerUser, currentUserQualifiedToSubmit, currentUserProposalCount } = useUserStore(
    state => state,
  );
  const { isListProposalsLoading, isListProposalsSuccess } = useProposalStore(state => state);
  const { isLoading: isContestLoading, isSuccess: isContestSuccess } = useContest();
  const { isSubmitProposalModalOpen, setIsSubmitProposalModalOpen } = useSubmitProposalStore(state => ({
    isSubmitProposalModalOpen: state.isModalOpen,
    setIsSubmitProposalModalOpen: state.setIsModalOpen,
  }));
  const submitButtonText = isConnected ? "submit a response" : "connect wallet to submit";
  const qualifiedToSubmit =
    currentUserQualifiedToSubmit && currentUserProposalCount <= contestMaxNumberSubmissionsPerUser;
  const showSubmitButton = !isConnected || qualifiedToSubmit;
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div>
      <div className="mt-4">
        <ContestTimeline />
      </div>

      <div className="mt-8">
        <ContestPrompt prompt={contestPrompt} type="page" />
      </div>
      {contestStatus === ContestStatus.SubmissionOpen && (
        <div className="mt-8">
          {showSubmitButton && (
            <ButtonV3
              type={ButtonType.TX_ACTION}
              colorClass="bg-gradient-vote rounded-[40px]"
              size={isMobile ? ButtonSize.FULL : ButtonSize.EXTRA_LARGE_LONG}
              onClick={() => setIsSubmitProposalModalOpen(!isSubmitProposalModalOpen)}
            >
              {submitButtonText}
            </ButtonV3>
          )}
        </div>
      )}
      <ContestStickyCards />

      <div className="mt-4">
        <div className="flex flex-col gap-5">
          <hr className="border-primary-2 border-2" />
          {contestStatus !== ContestStatus.ContestOpen && !isContestLoading && (
            <ProposalStatistics contestStatus={contestStatus} />
          )}

          {!isContestLoading && !isListProposalsLoading && isContestSuccess && isListProposalsSuccess && (
            <div className={`animate-appear ${contestStatus !== ContestStatus.SubmissionOpen ? "mt-4" : "mt-0"}`}>
              <ListProposals />
            </div>
          )}
        </div>
      </div>

      <DialogModalSendProposal isOpen={isSubmitProposalModalOpen} setIsOpen={setIsSubmitProposalModalOpen} />
    </div>
  );
};

export default ContestTab;
