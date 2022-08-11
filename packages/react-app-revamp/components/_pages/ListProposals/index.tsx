import Link from "next/link";
import { useRouter } from "next/router";
import shallow from "zustand/shallow";
import Button from "@components/Button";
import ProposalContent from "@components/_pages/ProposalContent";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import truncate from "@helpers/truncate";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { useStore as useStoreSubmitProposal } from "@hooks/useSubmitProposal/store";
import { useStore as useStoreCastVotes } from "@hooks/useCastVotes/store";
import styles from "./styles.module.css";
import { IconCaretDown, IconCaretUp, IconSpinner } from "@components/Icons";
import { CONTEST_STATUS } from "@helpers/contestStatus";

export const ListProposals = () => {
  const {
    query: { chain, address },
  } = useRouter();
  const {
    amountOfTokensRequiredToSubmitEntry,
    listProposalsData,
    currentUserAvailableVotesAmount,
    contestStatus,
    didUserPassSnapshotAndCanVote,
    checkIfUserPassedSnapshotLoading,
    downvotingAllowed,
  } = useStoreContest(
    state => ({
      //@ts-ignore
      downvotingAllowed: state.downvotingAllowed,
      //@ts-ignore
      contestStatus: state.contestStatus,
      //@ts-ignore
      listProposalsData: state.listProposalsData,
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      //@ts-ignore
      amountOfTokensRequiredToSubmitEntry: state.amountOfTokensRequiredToSubmitEntry,
      //@ts-ignore
      didUserPassSnapshotAndCanVote: state.didUserPassSnapshotAndCanVote,
      //@ts-ignore
      checkIfUserPassedSnapshotLoading: state.checkIfUserPassedSnapshotLoading,
    }),
    shallow,
  );

  const stateSubmitProposal = useStoreSubmitProposal();
  const { setCastPositiveAmountOfVotes, setPickedProposal, setIsModalOpen } = useStoreCastVotes(
    state => ({
      //@ts-ignore
      setPickedProposal: state.setPickedProposal,
      //@ts-ignore
      setIsModalOpen: state.setIsModalOpen,
      //@ts-ignore
      setCastPositiveAmountOfVotes: state.setCastPositiveAmountOfVotes
    }),
    shallow,
  );

  function onClickUpVote(proposalId: number | string) {
    setCastPositiveAmountOfVotes(true)
    setPickedProposal(proposalId);
    setIsModalOpen(true);
  }

  function onClickDownVote(proposalId: number | string) {
    setCastPositiveAmountOfVotes(false)
    setPickedProposal(proposalId);
    setIsModalOpen(true);
  }

  // Contest not cancelled
  if (contestStatus !== CONTEST_STATUS.CANCELLED) {
    if (contestStatus === CONTEST_STATUS.SUBMISSIONS_NOT_OPEN) {
      return (
        <div className="flex flex-col text-center items-center">
          <p className="text-neutral-9 italic mb-6">Submissions aren&apos;t open yet.</p>
        </div>
      );
    }
    // Empty state
    if (Object.keys(listProposalsData).length === 0) {
      return (
        <div className="flex flex-col text-center items-center">
          <p className="text-neutral-9 italic mb-6">
            {contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN &&
            currentUserAvailableVotesAmount < amountOfTokensRequiredToSubmitEntry
              ? "You can't submit a proposal for this contest."
              : "It seems no one submitted a proposal for this contest."}
          </p>
          {/* @ts-ignore */}
          {contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN &&
            currentUserAvailableVotesAmount >= amountOfTokensRequiredToSubmitEntry && (
              //@ts-ignore
              <Button onClick={() => stateSubmitProposal.setIsModalOpen(true)}>Submit a proposal</Button>
            )}
        </div>
      );
    } else {
      // List
      return (
        <ul className={`${styles.list} space-y-12`}>
          {Object.keys(listProposalsData)
            .sort((a, b) => {
              if (listProposalsData[a].votes === listProposalsData[b].votes) {
                return listProposalsData[b].price - listProposalsData[a].price;
              }
              return listProposalsData[a].votes < listProposalsData[b].votes ? 1 : -1;
            })
            .map((id, i) => {
              return (
                <li
                  className={`${styles.listElement} px-5 pt-5 pb-3 rounded-md 2xs:rounded-none 2xs:p-0 border border-solid border-neutral-1 2xs:border-0 relative overflow-hidden text-sm ${styles.wrapper}`}
                  key={id}
                >
                  <div className="text-center 2xs:border-is-4 border-solid border-neutral-1 2xs:border-neutral-5 flex flex-col 2xs:items-center pt-2 2xs:pt-0">
                    {contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN ? (
                      <span className="text-3xs text-neutral-11 italic">Vote not open yet</span>
                    ) : (
                      <>
                        {listProposalsData[id].votes > 0 && (
                          <span
                            className={`${styles.rankIndicator} hidden 2xs:flex rounded-full items-center justify-center aspect-square text-opacity-100 mb-3`}
                          >
                            #{i + 1}
                          </span>
                        )}

                        <div className=" text-neutral-12 flex space-y-2 flex-col items-center justify-center font-bold text-2xs">
                          {(contestStatus === CONTEST_STATUS.VOTING_OPEN && checkIfUserPassedSnapshotLoading) ||
                            (contestStatus === CONTEST_STATUS.SNAPSHOT_ONGOING && (
                              <IconSpinner className="text-sm animate-spin mie-2 2xs:mie-0 2xs:mb-1" />
                            ))}
                          {didUserPassSnapshotAndCanVote &&
                            contestStatus === CONTEST_STATUS.VOTING_OPEN &&
                            currentUserAvailableVotesAmount > 0 && (
                              <button 
                              onClick={() => onClickUpVote(id)}
                              disabled={
                                checkIfUserPassedSnapshotLoading ||
                                !didUserPassSnapshotAndCanVote ||
                                contestStatus !== CONTEST_STATUS.VOTING_OPEN ||
                                currentUserAvailableVotesAmount === 0
                              }
                              className="w-full 2xs:w-auto disabled:text-opacity-50 disabled:cursor-not-allowed disabled:border-none border border-solid border-neutral-5 rounded-md p-2 2xs:p-1.5 flex items-center justify-center">
                              <IconCaretUp className="text-2xs mie-2 2xs:mie-0" />
                              <span className="2xs:sr-only">Up vote</span>
                              </button>
                            )}
                            <span className="flex 2xs:flex-col">
                            {Intl.NumberFormat("en-US", {
                              notation: "compact",
                              maximumFractionDigits: 3,
                            }).format(parseFloat(listProposalsData[id].votes))}{" "}
                            <span className="text-neutral-11 pis-1ex 2xs:pis-0 text-3xs">
                              vote{listProposalsData[id].votes === 1 && "s"}
                            </span>
                          </span>
                          {didUserPassSnapshotAndCanVote &&
                            contestStatus === CONTEST_STATUS.VOTING_OPEN &&
                            currentUserAvailableVotesAmount > 0 && 
                            downvotingAllowed === true && (
                              <button 
                              onClick={() => onClickDownVote(id)}
                              disabled={
                                checkIfUserPassedSnapshotLoading ||
                                !didUserPassSnapshotAndCanVote ||
                                contestStatus !== CONTEST_STATUS.VOTING_OPEN ||
                                currentUserAvailableVotesAmount === 0
                              }
                              className="w-full 2xs:w-auto disabled:text-opacity-50 disabled:cursor-not-allowed disabled:border-none border border-solid border-neutral-5 rounded-md p-2 2xs:p-1.5 flex items-center justify-center">
                              <IconCaretDown className="text-2xs mie-2 2xs:mie-0" />
                              <span className="2xs:sr-only">Down vote</span>
                              </button>

                            )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="relative overflow-hidden">
                    {listProposalsData[id].votes > 0 && (
                      <span
                        className={`${styles.rankIndicator} inline-flex 2xs:hidden rounded-full items-center justify-center aspect-square text-opacity-100 mb-3`}
                      >
                        #{i + 1}
                      </span>
                    )}
                    <ProposalContent
                      author={listProposalsData[id].author}
                      content={
                        listProposalsData[id].isContentImage
                          ? listProposalsData[id].content
                          : truncate(listProposalsData[id].content, 280)
                      }
                    />
                    <Link
                      href={{
                        pathname: ROUTE_CONTEST_PROPOSAL,
                        //@ts-ignore
                        query: {
                          chain,
                          address,
                          proposal: id,
                        },
                      }}
                    >
                      <a title={`View proposal #${id}`} className="absolute opacity-0 inset-0 w-full h-full z-10 ">
                        View proposal #{id}
                      </a>
                    </Link>
                  </div>
                </li>
              );
            })}
        </ul>
      );
    }
  }

  // Contest cancelled
  return (
    <div className="flex flex-col text-center items-center">
      <p className="text-neutral-9 italic mb-6">This contest was cancelled.</p>
    </div>
  );
};

export default ListProposals;
