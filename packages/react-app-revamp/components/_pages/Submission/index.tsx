import { useRouter } from "next/router";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { Proposal } from "../ProposalContent";
import SubmissionPageDesktopLayout from "./Desktop";
import SubmissionPageMobileLayout from "./Mobile";

interface SubmissionPageProps {
  chain: string;
  address: string;
  proposalId: string;
  prompt: string;
  proposal: Proposal;
}

const SubmissionPage: FC<SubmissionPageProps> = ({ chain, address, proposalId, prompt, proposal }) => {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: "768px" });

  const onClose = () => {
    router.push(`/contest/${chain}/${address}`, undefined, { shallow: true, scroll: false });
  };

  if (isMobile) {
    return <SubmissionPageMobileLayout prompt={prompt} proposal={proposal} proposalId={proposalId} onClose={onClose} />;
  }

  return <SubmissionPageDesktopLayout prompt={prompt} proposal={proposal} proposalId={proposalId} onClose={onClose} />;
};

export default SubmissionPage;
