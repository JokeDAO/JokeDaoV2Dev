import { useContestStore } from "@hooks/useContest/store";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import ContestPromptModalLegacyLayout from "./components/Layout/Legacy";
import ContestPromptModalV3Layout from "./components/Layout/V3";
import { parsePrompt } from "../../utils";

interface ContestPromptModalProps {
  prompt: string;
  hidePrompt?: boolean;
}

const ContestPromptModal: FC<ContestPromptModalProps> = ({ prompt, hidePrompt = false }) => {
  const { isV3, votesClose, contestName } = useContestStore(state => state);
  const [isPromptOpen, setIsPromptOpen] = useState(moment().isBefore(votesClose) && !hidePrompt);
  const { contestType, contestTitle, contestSummary, contestEvaluate, contestContactDetails } = parsePrompt(prompt);

  useEffect(() => {
    setIsPromptOpen(!hidePrompt);
  }, [hidePrompt]);

  return (
    <>
      {isV3 ? (
        <ContestPromptModalV3Layout
          contestName={contestName}
          contestType={contestType}
          contestSummary={contestSummary}
          contestEvaluate={contestEvaluate}
          contestContactDetails={contestContactDetails}
          isPromptOpen={isPromptOpen}
          setIsPromptOpen={setIsPromptOpen}
        />
      ) : (
        <ContestPromptModalLegacyLayout prompt={prompt} isPromptOpen={isPromptOpen} setIsPromptOpen={setIsPromptOpen} />
      )}
    </>
  );
};

export default ContestPromptModal;
