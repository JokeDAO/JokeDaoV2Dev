import { Proposal } from "@components/_pages/ProposalContent";
import SubmissionPage from "@components/_pages/Submission";
import { chains } from "@config/wagmi";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { getLayout } from "@layouts/LayoutViewContest";
import { fetchProposalData } from "lib/proposal";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

interface PageProps {
  address: string;
  chain: string;
  proposal: Proposal | null;
}

const Page: FC<PageProps> = ({ proposal, address, chain }) => {
  const router = useRouter();
  const { contestPrompt, contestName } = useContestStore(state => state);
  const { setPickedProposal } = useCastVotesStore(state => state);
  const id = router.query.submission as string;

  useEffect(() => {
    setPickedProposal(id);
  }, [id, setPickedProposal]);

  return (
    <>
      <Head>
        <title>
          {proposal ? `proposal by ${shortenEthereumAddress(proposal.authorEthereumAddress)} for ${contestName}` : null}
        </title>
      </Head>
      <SubmissionPage chain={chain} address={address} proposalId={id} prompt={contestPrompt} proposal={proposal} />
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const getChainId = (chain: string) => {
  return chains.find(c => c.name.toLowerCase().replace(" ", "") === chain)?.id;
};

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { chain, address, submission } = params;

  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    !chains.some(c => c.name.toLowerCase().replace(" ", "") === chain) ||
    !submission
  ) {
    return { notFound: true };
  }

  const chainId = getChainId(chain);

  if (!chainId) return;

  const proposal = await fetchProposalData(address, chainId, submission);

  return {
    props: {
      address,
      chain,
      proposal,
    },
  };
}

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
