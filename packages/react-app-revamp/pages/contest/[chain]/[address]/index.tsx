import DialogModalV3 from "@components/UI/DialogModalV3";
import { useShowRewardsStore } from "@components/_pages/Create/pages/ContestDeploying";
import CreateContestRewards from "@components/_pages/Create/pages/ContestRewards";
import ListProposals from "@components/_pages/ListProposals";
import CreateRewardsPool from "@components/_pages/Rewards/components/Create";
import CreateRewardsFunding from "@components/_pages/Rewards/components/Fund";
import { chains } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { getLayout } from "@layouts/LayoutViewContest";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface PageProps {
  address: string;
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address } = props;
  const { isLoading, isSuccess, contestName } = useContestStore(state => state);
  const { isListProposalsLoading, isListProposalsSuccess } = useProposalStore(state => state);

  return (
    <>
      <Head>
        <title>Contest {contestName ? contestName : address} - jokerace</title>
        <meta name="description" content="@TODO: change this" />
      </Head>
      <h1 className="sr-only">Contest {contestName ? contestName : address} </h1>
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params;
  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter(c => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return { notFound: true };
  }

  try {
    return {
      props: {
        address,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
//@ts-ignore
Page.getLayout = getLayout;

export default Page;
