/* eslint-disable react-hooks/exhaustive-deps */
import Search from "@components/Search";
import Sort, { Sorting } from "@components/Sort";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { FC, useEffect, useState } from "react";
import { Pagination } from "react-headless-pagination";
import Contest from "./Contest";

interface ListContestsProps {
  status: "error" | "loading" | "success";
  page: number;
  setPage: any;
  isContestDataFetching: boolean;
  isRewardsFetching: boolean;
  itemsPerPage: number;
  contestData?: any;
  rewardsData?: any;
  error?: any;
  className?: string;
  includeFullSearch?: boolean;
  includeSearch?: boolean;
  customTitle?: string;
  compact?: boolean;
  onFullSearchChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
}

export const ListContests: FC<ListContestsProps> = ({
  error,
  status,
  contestData,
  page,
  className,
  setPage,
  customTitle,
  includeSearch,
  rewardsData,
  isRewardsFetching,
  itemsPerPage,
  isContestDataFetching,
  compact = false,
  onSearchChange,
}) => {
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<Sorting | null>(null);
  const [fadeBg, setFadeBg] = useState(false);
  const loading = status === "loading" || isContestDataFetching;
  const placeholderCount = compact ? 6 : 7;
  const placeholders = new Array(placeholderCount).fill(null);

  useEffect(() => {
    if (!contestData) return;

    setSortedData(contestData.data);
  }, [contestData]);

  useEffect(() => {
    handleSort();
  }, [sorting]);

  const sortData = (data: any, property: string, order: string) => {
    return data.sort((a: any, b: any) => {
      let valueA;
      let valueB;
      let reverseOrder = false;

      switch (property) {
        case "rewards":
          valueA = a.rewards ? 1 : 0;
          valueB = b.rewards ? 1 : 0;
          break;
        case "qualified":
          valueA = a.qualifiedToSubmit || a.qualifiedToVote ? 1 : 0;
          valueB = b.qualifiedToSubmit || b.qualifiedToVote ? 1 : 0;
          break;
        case "closest_deadline":
          const aTimestamps = [
            new Date(a.start_at).getTime(),
            new Date(a.vote_start_at).getTime(),
            new Date(a.end_at).getTime(),
          ].filter(timestamp => timestamp >= Date.now());
          const bTimestamps = [
            new Date(b.start_at).getTime(),
            new Date(b.vote_start_at).getTime(),
            new Date(b.end_at).getTime(),
          ].filter(timestamp => timestamp >= Date.now());

          valueA = aTimestamps.length > 0 ? Math.min(...aTimestamps) : Infinity;
          valueB = bTimestamps.length > 0 ? Math.min(...bTimestamps) : Infinity;
          reverseOrder = true;
          break;
        case "can_submit":
          valueA =
            (a.qualifiedToSubmit ? 2 : 1) *
            (new Date(a.start_at).getTime() <= Date.now() && Date.now() <= new Date(a.vote_start_at).getTime() ? 1 : 0);
          valueB =
            (b.qualifiedToSubmit ? 2 : 1) *
            (new Date(b.start_at).getTime() <= Date.now() && Date.now() <= new Date(b.vote_start_at).getTime() ? 1 : 0);
          break;
        case "can_vote":
          valueA =
            (a.qualifiedToVote ? 2 : 1) *
            (new Date(a.vote_start_at).getTime() <= Date.now() && Date.now() <= new Date(a.end_at).getTime() ? 1 : 0);
          valueB =
            (b.qualifiedToVote ? 2 : 1) *
            (new Date(b.vote_start_at).getTime() <= Date.now() && Date.now() <= new Date(b.end_at).getTime() ? 1 : 0);
          break;
        default:
          valueA = a[property];
          valueB = b[property];
      }

      if (valueA < valueB) {
        return order === "ascending" ? (reverseOrder ? 1 : -1) : reverseOrder ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === "ascending" ? (reverseOrder ? -1 : 1) : reverseOrder ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = () => {
    if (!contestData) return;

    if (!sorting) {
      setSortedData(contestData.data); // Reset sorted data
      return;
    }

    const { property, ascending } = sorting;
    const order = ascending ? "ascending" : "descending";
    const sorted = sortData([...contestData.data], property, order);
    setSortedData(sorted);
  };

  if (compact) {
    return (
      <>
        <div className="font-bold text-md grid-cols-1 grid gap-5 md:full-width-grid-cols items-center pie-1ex p-3">
          <h2 className="text-[20px] font-bold font-sabo">Featured Contests</h2>
          <Search onSearchChange={onSearchChange} />
          <Sort onSortChange={setSorting} onMenuStateChange={setFadeBg} />
        </div>
        {!isContestDataFetching && contestData?.count === 0 ? (
          <div className="text-neutral-9 text-center italic mb-6 animate-appear mt-12">No contests found</div>
        ) : (
          <div
            className={`grid ${
              fadeBg ? "opacity-50" : "opacity-100"
            } text-[16px] transition-opacity duration-300 ease-in-out`}
          >
            {loading
              ? placeholders.map((_, index) => (
                  <Contest
                    key={`placeholder-contest-${index}`}
                    contest={{}}
                    compact={compact}
                    loading={loading}
                    rewards={rewardsData}
                    rewardsLoading={isRewardsFetching}
                  />
                ))
              : sortedData
                  .slice(0, 6)
                  .map((contest: any, index: number) => (
                    <Contest
                      key={`contest-${index}`}
                      contest={contest}
                      compact={compact}
                      loading={loading}
                      rewards={rewardsData}
                      rewardsLoading={isRewardsFetching}
                    />
                  ))}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {status === "error" ? (
        <div className={`animate-appear bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4`}>
          <p className="text-sm font-bold text-negative-10 text-center">Something went wrong: {error?.message}</p>
        </div>
      ) : (
        <>
          {!isContestDataFetching && contestData?.count === 0 ? (
            <div className="text-neutral-9 text-center italic mb-6 animate-appear">No contests found</div>
          ) : (
            <div className={`${className}`}>
              <div
                className={`grid ${
                  fadeBg ? "opacity-50" : "opacity-100"
                } text-[16px] transition-opacity duration-300 ease-in-out`}
              >
                {loading ? (
                  placeholders.map((_, index) => (
                    <Contest
                      key={`placeholder-contest-${index}`}
                      contest={{}}
                      compact={compact}
                      loading={loading}
                      rewards={rewardsData}
                      rewardsLoading={isRewardsFetching}
                    />
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:full-width-grid-cols lg:gap-0 items-center mb-4 font-bold text-[18px] pie-1ex p-3">
                      <div className="order-3 md:order-none">
                        {customTitle ? (
                          <span className="text-[20px] font-bold font-sabo">{customTitle}</span>
                        ) : (
                          <span aria-hidden="true">
                            🃏
                            <span className={`pis-1ex text-[20px]`}>{contestData?.count} contests</span>
                          </span>
                        )}
                      </div>
                      {includeSearch && (
                        <div className="order-1 md:order-none">
                          <Search onSearchChange={onSearchChange} />
                        </div>
                      )}

                      <div className="order-2 md:order-none">
                        <Sort onSortChange={setSorting} onMenuStateChange={setFadeBg} />
                      </div>
                    </div>
                    {sortedData.map((contest: any, index: number) => (
                      <Contest
                        key={`contest-${index}`}
                        contest={contest}
                        compact={compact}
                        loading={loading}
                        rewards={rewardsData}
                        rewardsLoading={isRewardsFetching}
                      />
                    ))}
                  </>
                )}
              </div>

              {Math.ceil(contestData?.count / itemsPerPage) > 1 && (
                <Pagination
                  currentPage={page}
                  setCurrentPage={(newPage: number) => setPage(newPage)}
                  totalPages={Math.ceil(contestData.count / itemsPerPage)}
                  edgePageCount={1}
                  middlePagesSiblingCount={1}
                  className="mt-6 flex"
                  truncableText="..."
                  truncableClassName=""
                >
                  <Pagination.PrevButton className="disabled:opacity-50 disabled:pointer-events-none flex items-center space-i-4">
                    <ArrowLeftIcon className="w-5" />
                    <span className="sr-only sm:not-sr-only text-xs">Previous</span>
                  </Pagination.PrevButton>

                  <div className="flex items-center flex-wrap justify-center flex-grow no-marker">
                    <Pagination.PageButton
                      activeClassName="bg-primary-10 text-primary-1 hover:bg-opacity-90 focus:bg-primary-11"
                      inactiveClassName="bg-true-black text-neutral-10 hover:bg-true-white hover:bg-opacity-5 focus:bg-true-white focus:bg-opacity-10"
                      className="cursor-pointer flex items-center justify-center rounded-full font-bold w-12 h-12 text-xs border-solid border-4 border-true-black"
                    />
                  </div>

                  <Pagination.NextButton className="disabled:opacity-50 disabled:pointer-events-none flex items-center space-i-4">
                    <span className="sr-only sm:not-sr-only text-xs">Next</span>
                    <ArrowRightIcon className="w-5" />
                  </Pagination.NextButton>
                </Pagination>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ListContests;
