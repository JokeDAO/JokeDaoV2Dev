import Button from "@components/Button";
import Loader from "@components/Loader";
import useProposalVotes from "@hooks/useProposalVotes";
import { useStore as useStoreProposalVotes } from "@hooks/useProposalVotes/store";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import shallow from "zustand/shallow";
import { useAccount } from "wagmi";

interface ListProposalVotesProps {
  id: number | string;
}

export const ListProposalVotes = (props: ListProposalVotesProps) => {
  const { id } = props;
  const accountData = useAccount();
  const { isLoading, isSuccess, isError, retry, fetchVotesPage } = useProposalVotes(id);
  const { listProposalsData } = useStoreContest(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
    }),
    shallow,
  );
  const {
    votesPerAddress,
    isPageVotesLoading,
    currentPagePaginationVotes,
    isPageVotesError,
    indexPaginationVotes,
    totalPagesPaginationVotes,
    hasPaginationVotesNextPage,
  } = useStoreProposalVotes(
    state => ({
      //@ts-ignore
      votesPerAddress: state.votesPerAddress,
      //@ts-ignore
      isPageVotesLoading: state.isPageVotesLoading,
      //@ts-ignore
      currentPagePaginationVotes: state.currentPagePaginationVotes,
      //@ts-ignore
      isPageVotesError: state.isPageVotesError,
      //@ts-ignore
      indexPaginationVotes: state.indexPaginationVotes,
      //@ts-ignore
      totalPagesPaginationVotes: state.totalPagesPaginationVotes,
      //@ts-ignore
      hasPaginationVotesNextPage: state.hasPaginationVotesNextPage,
    }),
    shallow,
  );
  return (
    <>
      {isLoading && (
        <div className="animate-appear">
          <Loader classNameWrapper={!isLoading ? "hidden" : ""} scale="component">
            Loading votes, one moment please...{" "}
          </Loader>
        </div>
      )}

      {!isLoading && isError && (
        <div className="animate-appear">
          <div className="flex flex-col">
            <div className="bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
              <p className="text-sm font-bold text-negative-10 text-center">
                Something went wrong while fetching the votes of this proposal.
              </p>
            </div>
            <Button
              onClick={() => retry()}
              className="mt-5 w-full mx-auto py-1 xs:w-auto xs:min-w-fit-content"
              intent="neutral-outline"
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {isSuccess && !isLoading && (
        <section className="animate-appear">
          <p className="animate-appear font-bold mb-3">
            <span>Current votes:</span> <br />
            <span className="text-positive-9">
              {new Intl.NumberFormat().format(parseFloat(listProposalsData[id].votes.toFixed(2)))}
            </span>
          </p>
          <table className="text-xs">
            <caption className="sr-only">Votes details</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Ethereum address</th>
                <th scope="col">Votes</th>
              </tr>
            </thead>
            <tbody>
              {accountData?.address && Object.keys(votesPerAddress)?.includes(accountData?.address) && (
                <tr className="animate-appear">
                  <td title={accountData?.address} className="relative text-ellipsis font-mono overflow-hidden p-2">
                    <a
                      className="top-0 left-0 absolute w-full h-full z-10 cursor-pointer opacity-0"
                      target="_blank"
                      rel="nofollow noreferrer"
                      href={`https://debank.com/profile/${accountData?.address}`}
                    >
                      Click to view this address on Debank
                    </a>
                    {votesPerAddress[accountData?.address].displayAddress}:
                  </td>
                  <td className="p-2 font-bold">
                    {new Intl.NumberFormat().format(parseFloat(votesPerAddress[accountData?.address].votes.toFixed(2)))}
                  </td>
                </tr>
              )}
              {Object.keys(votesPerAddress)
                .filter(address => {
                  if (!accountData?.address) return address;
                  if (address !== accountData?.address) return address;
                })
                .map((address: string) => (
                  <tr
                    className="animate-appear"
                    key={`${votesPerAddress[address].displayAddress}-${votesPerAddress[address].votes}`}
                  >
                    <td title={address} className="relative text-ellipsis font-mono overflow-hidden p-2">
                      <a
                        className="top-0 left-0 absolute w-full h-full z-10 cursor-pointer opacity-0"
                        target="_blank"
                        rel="nofollow noreferrer"
                        href={`https://debank.com/profile/${address}`}
                      >
                        Click to view this address on Debank
                      </a>
                      {votesPerAddress[address].displayAddress}:
                    </td>
                    <td className="p-2 font-bold">
                      {new Intl.NumberFormat().format(parseFloat(votesPerAddress[address].votes.toFixed(2)))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isPageVotesLoading && Object.keys(listProposalsData)?.length > 1 && (
            <Loader scale="component" classNameWrapper="my-3">
              Loading votes...
            </Loader>
          )}
          {hasPaginationVotesNextPage && !isPageVotesLoading && (
            <div className="pt-8 flex animate-appear">
              <Button
                intent="neutral-outline"
                scale="sm"
                className="mx-auto animate-appear"
                onClick={() =>
                  fetchVotesPage(
                    currentPagePaginationVotes + 1,
                    indexPaginationVotes[currentPagePaginationVotes + 1],
                    totalPagesPaginationVotes,
                  )
                }
              >
                {isPageVotesError ? "Try again" : "Show more votes"}
              </Button>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default ListProposalVotes;
