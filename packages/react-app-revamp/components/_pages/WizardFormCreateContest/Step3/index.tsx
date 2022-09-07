import shallow from "zustand/shallow";
import Button from "@components/Button";
import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { addMinutes } from "date-fns";
import Link from "next/link";
import { DialogModalDeployTransaction } from "../DialogModalDeployTransaction";
import { useStore } from "../store";
import Form from "./Form";
import { schema } from "./schema";
import { useDeployContest } from "./useDeployContest";
import Timeline from "../Timeline";
import DialogModalMintProposalToken from "./DialogModalMintProposalToken";

export const Step3 = () => {
  const {
    contestDeployedToChain,
    setCurrentStep,
    dataDeployVotingToken,
    modalDeployContestOpen,
    setModalDeployContestOpen,
    dataDeployContest,
    modalDeploySubmissionTokenOpen,
  } = useStore(
    state => ({
      //@ts-ignore
      setCurrentStep: state.setCurrentStep,
      //@ts-ignore
      dataDeployVotingToken: state.dataDeployVotingToken,
      //@ts-ignore
      modalDeployContestOpen: state.modalDeployContestOpen,
      //@ts-ignore
      setModalDeployContestOpen: state.setModalDeployContestOpen,
      //@ts-ignore
      setModalDeployContestOpen: state.setModalDeployContestOpen,
      //@ts-ignore
      contestDeployedToChain: state.contestDeployedToChain,
      //@ts-ignore
      dataDeployContest: state.dataDeployContest,
      //@ts-ignore
      modalDeploySubmissionTokenOpen: state.modalDeploySubmissionTokenOpen,
    }),
    shallow,
  );
  /*
    add 10min to the current datetime to anticipate
    the user actions on the form and prevent 
    the datetime to be expired by the time 
    the user is finished filling up the form
  */
  const date = addMinutes(new Date(), 10);

  const form = useForm({
    initialValues: {
      useSameTokenForSubmissions: true,
      votingTokenAddress: dataDeployVotingToken?.address ?? null,
      datetimeOpeningSubmissions: new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -8), // get current local time in ISO format without seconds & milliseconds
      datetimeOpeningVoting: "",
      datetimeClosingVoting: "",
      submissionOpenToAll: true,
      noSubmissionLimitPerUser: false,
      submissionMaxNumber: 200,
      requiredNumberOfTokensToSubmit: 1,
      submissionPerUserMaxNumber: 1,
      usersQualifyToVoteIfTheyHoldTokenOnVoteStart: true,
      downvoting: false,
    },
    extend: validator({ schema }),
    onSubmit: values => handleSubmitForm(values),
  });
  const { handleSubmitForm, stateContestDeployment } = useDeployContest(form);
  return (
    <>
      <div className="tracking-wide pb-8">
        <h2 className="sr-only">Step 3: Create contest</h2>
        <p className="font-bold text-lg mb-2">Let’s set the rules for your contest across two stages.</p>
        <ul className="mb-3 list-disc pis-4 text-neutral-12">
          <li>
            <span className="font-bold">submissions:</span> participants submit entries responding to a prompt.
          </li>
          <li>
            <span className="font-bold">voting:</span> your community votes on the entries.
          </li>
        </ul>
        <p className="text-neutral-11 text-xs mb-8">note: voting starts when submissions end.</p>

        <Timeline />
      </div>
      <Form isDeploying={stateContestDeployment.isLoading} {...form} />
      {modalDeploySubmissionTokenOpen && <DialogModalMintProposalToken formCreateContestSetFields={form.setFields} />}
      <DialogModalDeployTransaction
        isOpen={modalDeployContestOpen}
        setIsOpen={setModalDeployContestOpen}
        title="Token deployment transaction"
        isError={stateContestDeployment.isError}
        isLoading={stateContestDeployment.isLoading}
        isSuccess={stateContestDeployment.isSuccess}
        error={stateContestDeployment.error}
        //@ts-ignore
        transactionHref={`${contestDeployedToChain?.blockExplorers?.default?.url}/tx/${dataDeployContest?.hash}`}
      >
        {stateContestDeployment.isSuccess && (
          <div className="mt-3 animate-appear relative">
            <Link
              href={{
                pathname: ROUTE_VIEW_CONTEST,
                //@ts-ignore
                query: {
                  chain: contestDeployedToChain?.name.toLowerCase().replace(" ", ""),
                  address: dataDeployContest?.address,
                },
              }}
            >
              <a target="_blank">
                View contest <span className="link">here</span>
              </a>
            </Link>
          </div>
        )}

        <div className="pt-6 flex flex-col space-y-3 xs:flex-row xs:space-y-0 xs:space-i-3">
          <Button
            className="w-full py-1 xs:min-w-fit-content xs:w-auto"
            onClick={() => setCurrentStep(4)}
            disabled={!stateContestDeployment.isSuccess}
            intent="neutral-outline"
          >
            Next
          </Button>
          {stateContestDeployment.isError && (
            <Button
              onClick={() => {
                handleSubmitForm(form.data());
              }}
              className="w-full py-1 xs:w-auto xs:min-w-fit-content"
              disabled={stateContestDeployment.isLoading}
              intent="neutral-outline"
              type="submit"
            >
              Try again
            </Button>
          )}
        </div>
      </DialogModalDeployTransaction>
    </>
  );
};

export default Step3;
