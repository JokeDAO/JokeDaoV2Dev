import ListContests from "@components/_pages/ListContests";
import { isSupabaseConfigured } from "@helpers/database";
import { useQuery } from "@tanstack/react-query";
import { getLiveContests, getRewards, ITEMS_PER_PAGE, searchContests } from "lib/contests";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";

const ContestPlay = () => {
  const [page, setPage] = useState(0);
  const { address } = useAccount();
  const [searchValue, setSearchValue] = useState("");

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery(["liveContests", page, address, searchValue], () =>
    searchValue
      ? searchContests(
          {
            searchString: searchValue,
            pagination: {
              currentPage: page,
            },
          },
          address,
        )
      : getLiveContests(page, 7, address),
  );

  const { data: rewardsData, isFetching: isRewardsFetching } = useQuery(
    ["rewards", contestData],
    data => getRewards(contestData?.data ?? []),
    {
      enabled: !!contestData,
    },
  );

  const customTitle = useMemo(() => {
    if (!searchValue) return "Live Contests";

    return "All contests";
  }, [searchValue]);

  return (
    <div className="text-[16px] mt-12 mb-14 w-full md:w-5/6">
      {isSupabaseConfigured ? (
        <ListContests
          className="animate-swingInLeft"
          isContestDataFetching={isContestDataFetching}
          isRewardsFetching={isRewardsFetching}
          itemsPerPage={ITEMS_PER_PAGE}
          status={status}
          error={error}
          page={page}
          setPage={setPage}
          includeSearch
          contestData={contestData}
          rewardsData={rewardsData}
          customTitle={customTitle}
          onSearchChange={(value: string) => setSearchValue(value)}
        />
      ) : (
        <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
          This site&apos;s current deployment does not have access to jokedao&apos;s reference database of contests, but
          you can check out our Supabase backups{" "}
          <a
            className="link px-1ex"
            href="https://github.com/JokeDAO/JokeDaoV2Dev/tree/staging/packages/supabase"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{" "}
          for contest chain and address information!
        </div>
      )}
    </div>
  );
};

export default ContestPlay;
