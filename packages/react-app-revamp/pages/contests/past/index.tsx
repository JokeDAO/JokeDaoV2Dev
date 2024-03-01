import ListContests from "@components/_pages/ListContests";
import { isSupabaseConfigured } from "@helpers/database";
import getPagination from "@helpers/getPagination";
import { getLayout } from "@layouts/LayoutContests";
import { useQuery } from "@tanstack/react-query";
import { getPastContests, getRewards, ITEMS_PER_PAGE } from "lib/contests";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAccount } from "wagmi";

function useContests(initialData: any) {
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  //@ts-ignore
  if (initialData?.data) queryOptions.initialData = initialData.data;

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery({
    queryKey: ["pastContests", page, address],
    queryFn: () => getPastContests(page, ITEMS_PER_PAGE, address),
  });

  const { data: rewardsData, isFetching: isRewardsFetching } = useQuery({
    queryKey: ["rewards", contestData],
    queryFn: () => getRewards(contestData?.data ?? []),
    enabled: !!contestData,
  });

  return {
    page,
    setPage,
    status,
    contestData,
    rewardsData,
    isRewardsFetching,
    error,
    isContestDataFetching,
  };
}
const Page: NextPage = props => {
  const initialData = props;
  const {
    page,
    setPage,
    status,
    contestData,
    rewardsData,
    error,
    isContestDataFetching,
    isRewardsFetching,
    //@ts-ignore
  } = useContests(initialData?.data);

  return (
    <>
      <Head>
        <title>Past contests - jokerace</title>
        <meta name="description" content="Past contests on jokerace." />
      </Head>

      <div className="container mx-auto pt-10">
        <h1 className="sr-only">Past contests</h1>
        {isSupabaseConfigured ? (
          <ListContests
            isContestDataFetching={isContestDataFetching}
            isRewardsFetching={isRewardsFetching}
            itemsPerPage={ITEMS_PER_PAGE}
            status={status}
            error={error}
            page={page}
            setPage={setPage}
            contestData={contestData}
            rewardsData={rewardsData}
          />
        ) : (
          <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
            This site&apos;s current deployment does not have access to jokerace&apos;s reference database of contests,
            but you can check out our Supabase backups{" "}
            <a
              className="link px-1ex"
              href="https://github.com/jk-labs-inc/jokerace/tree/staging/packages/supabase"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>{" "}
            for contest chain and address information!
          </div>
        )}{" "}
      </div>
    </>
  );
};

export async function getStaticProps() {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(0, 7);

    const result = await supabase
      .from("contests_v3")
      .select(
        "created_at, start_at, end_at, address, author_address, network_name, vote_start_at, featured, title, type, summary, prompt",
        { count: "exact" },
      )
      // all rows whose votes end date is < to the current date.
      .lt("end_at", new Date().toISOString())
      .order("end_at", { ascending: false })
      .range(from, to);

    const { data, error } = result;

    if (error) {
      return {
        props: {},
        revalidate: 60,
      };
    }
    return {
      props: {
        data,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 60 seconds
      revalidate: 60, // In seconds
    };
  }
  return {
    props: {
      data: [],
    },
  };
}

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
