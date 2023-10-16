import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import { useContestStore } from "@hooks/useContest/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { Editor, EditorContent } from "@tiptap/react";
import { FC, useState } from "react";
import DialogModalSendProposalSuccessLayout from "../components/SuccessLayout";
import { emailRegex } from "@helpers/regex";

interface DialogModalSendProposalDesktopLayoutProps {
  chainName: string;
  contestId: string;
  proposal: string;
  editorProposal: Editor | null;
  address: string;
  formattedDate: string | null;
  isOpen: boolean;
  isCorrectNetwork: boolean;
  isDragging: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onSwitchNetwork?: () => void;
  onSubmitProposal?: () => void;
}

const DialogModalSendProposalDesktopLayout: FC<DialogModalSendProposalDesktopLayoutProps> = ({
  chainName,
  contestId,
  proposal,
  editorProposal,
  address,
  formattedDate,
  isOpen,
  isCorrectNetwork,
  isDragging,
  setIsOpen,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  onSwitchNetwork,
  onSubmitProposal,
}) => {
  const { contestPrompt } = useContestStore(state => state);
  const { wantsSubscription, setWantsSubscription, setEmailForSubscription, emailForSubscription } =
    useSubmitProposalStore(state => state);
  const { isLoading, isSuccess } = useSubmitProposal();
  const { proposalId } = useSubmitProposalStore(state => state);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWantsSubscription(event.target.checked);
    setEmailError(null);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForSubscription(event.target.value);
    setEmailError(null);
  };

  const handleConfirm = () => {
    if (wantsSubscription && !emailForSubscription) {
      setEmailError("Please enter an email address.");
      return;
    }

    if (!wantsSubscription && emailForSubscription) {
      setEmailError("Please check the box if you want to be notified.");
      return;
    }

    if (emailForSubscription && !emailRegex.test(emailForSubscription)) {
      setEmailError("Invalid email address.");
      return;
    }

    setEmailError(null);
    onSubmitProposal?.();
  };

  return (
    <DialogModalV3
      title="submission"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="w-full xl:w-[1110px] 3xl:w-[1300px]"
      disableClose={!!(isSuccess && proposalId)}
    >
      <div className="flex flex-col gap-4 md:pl-[50px] lg:pl-[100px] mt-[60px] mb-[60px]">
        {isSuccess && proposalId ? (
          <div className="flex flex-col gap-8">
            <p className="text-[24px] font-bold text-neutral-11">your submission is live!</p>
            <DialogModalSendProposalSuccessLayout proposalId={proposalId} chainName={chainName} contestId={contestId} />
          </div>
        ) : (
          <>
            <ContestPrompt type="modal" prompt={contestPrompt} hidePrompt />
            <div className="flex flex-col gap-2">
              <EthereumAddress ethereumAddress={address ?? ""} shortenOnFallback={true} />
              <p className="text-[16px] font-bold text-neutral-10">{formattedDate}</p>
            </div>
            <div className="flex flex-col min-h-[12rem] rounded-md md:w-[650px]">
              <div className="flex bg-true-black z-10 justify-start w-full px-1 py-2 border-y border-neutral-10">
                <TipTapEditorControls editor={editorProposal} />
              </div>

              <EditorContent
                editor={editorProposal}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`md:border-b border-primary-2 bg-transparent outline-none placeholder-neutral-9 w-full md:w-[650px] overflow-y-auto h-auto max-h-[300px] pb-2 ${
                  isDragging ? "backdrop-blur-md opacity-70" : ""
                }`}
              />
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex gap-4">
                  <label className="checkbox-container">
                    <input type="checkbox" checked={wantsSubscription} onChange={handleCheckboxChange} />
                    <span className="checkmark"></span>
                  </label>

                  <p className="text-[16px] text-neutral-9">
                    i’d like to receive notifications about contests and future opportunities on{" "}
                    <span className="normal-case">JokeRace</span>
                  </p>
                </div>
                <div>
                  <input
                    value={emailForSubscription}
                    type="text"
                    className="w-[350px] rounded-[40px] h-8 bg-true-black border border-neutral-9 indent-4 placeholder-neutral-9 focus:outline-none submission-subscription-input"
                    placeholder="myemail@email.com"
                    onChange={handleEmailChange}
                  />
                  {emailError && <p className="text-[14px] text-negative-11 font-bold pl-2 mt-2">{emailError}</p>}
                </div>
              </div>
            </div>
            <div className="flex mt-14">
              {isCorrectNetwork ? (
                <ButtonV3
                  colorClass="bg-gradient-vote rounded-[40px]"
                  size={ButtonSize.EXTRA_LARGE_LONG}
                  onClick={handleConfirm}
                  isDisabled={isLoading || !proposal.length || editorProposal?.isEmpty}
                >
                  submit!
                </ButtonV3>
              ) : (
                <ButtonV3
                  colorClass="bg-gradient-create rounded-[40px]"
                  size={ButtonSize.EXTRA_LARGE_LONG}
                  onClick={onSwitchNetwork}
                >
                  switch network
                </ButtonV3>
              )}
            </div>
          </>
        )}
      </div>
    </DialogModalV3>
  );
};

export default DialogModalSendProposalDesktopLayout;
