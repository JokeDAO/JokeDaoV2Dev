import Search from "@components/Search";
import Sort, { SortOption } from "@components/Sort";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { FC, useState, useEffect } from "react";
import { Pagination } from "react-headless-pagination";
import Contest from "./Contest";

interface ListContestsProps {
  status: "error" | "pending" | "success";
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
  sortOptions?: SortOption[];
  onFullSearchChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  onSortChange?: (sort: string) => void;
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
  sortOptions,
  onSearchChange,
  onSortChange,
}) => {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    if (contestData && contestData.count !== totalCount) {
      setTotalCount(contestData.count);
    }
  }, [contestData, totalCount]);

  const isInitialLoading = (status === "pending" || isContestDataFetching) && totalCount === null;
  const isPaginationLoading = (status === "pending" || isContestDataFetching) && totalCount !== null;

  const placeholderCount = 7;
  const placeholders = new Array(placeholderCount).fill(null);

  if (status === "error") {
    return (
      <div className={`animate-appear bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4`}>
        <p className="text-sm font-bold text-negative-10 text-center">Something went wrong: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="text-[16px] transition-opacity duration-300 ease-in-out">
        <div className="grid grid-cols-1 gap-4 md:full-width-grid-cols lg:gap-0 items-center mb-4 font-bold text-[18px] pie-1ex p-3">
          <div className="order-3 md:order-none">
            {customTitle ? (
              <span className="text-[20px] font-bold font-sabo">{customTitle}</span>
            ) : (
              totalCount !== null && (
                <span aria-hidden="true">
                  <span className={`pis-1ex text-[20px]`}>{totalCount} contests</span>
                </span>
              )
            )}
          </div>
          {includeSearch && totalCount !== null && (
            <div className="order-1 md:order-none">
              <Search onSearchChange={onSearchChange} />
            </div>
          )}

          {sortOptions && totalCount !== null && (
            <div className="order-2 md:order-none">
              <Sort sortOptions={sortOptions} onSortChange={onSortChange} />
            </div>
          )}
        </div>
        {isInitialLoading ? (
          // Display placeholders when loading
          placeholders.map((_, index) => (
            <Contest
              key={`placeholder-contest-${index}`}
              contest={{}}
              loading={true}
              rewards={rewardsData}
              rewardsLoading={isRewardsFetching}
            />
          ))
        ) : totalCount === 0 ? (
          <div className="text-neutral-9 mt-20 font-sabo text-[24px] text-center italic mb-6 animate-appear">
            No contests found
          </div>
        ) : (
          <div>
            {isPaginationLoading
              ? placeholders.map((_, index) => (
                  <Contest
                    key={`placeholder-contest-${index}`}
                    contest={{}}
                    loading={true}
                    rewards={rewardsData}
                    rewardsLoading={isRewardsFetching}
                  />
                ))
              : contestData?.data.map((contest: any, index: number) => (
                  <Contest
                    key={`contest-${index}`}
                    contest={contest}
                    loading={false}
                    rewards={rewardsData}
                    rewardsLoading={isRewardsFetching}
                  />
                ))}
          </div>
        )}
      </div>

      {totalCount !== null && Math.ceil(totalCount / itemsPerPage) > 1 && (
        <Pagination
          currentPage={page}
          setCurrentPage={(newPage: number) => setPage(newPage)}
          totalPages={Math.ceil(totalCount / itemsPerPage)}
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
  );
};

export default ListContests;
