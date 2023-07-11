import Collapsible from "@components/UI/Collapsible";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { useContestStore } from "@hooks/useContest/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import moment from "moment";
import { FC, useEffect, useState } from "react";

interface LayoutContestPromptProps {
  prompt: string;
  hidePrompt?: boolean;
}

const LayoutContestPrompt: FC<LayoutContestPromptProps> = ({ prompt, hidePrompt = false }) => {
  const { isV3, votesClose } = useContestStore(state => state);
  const [isPromptOpen, setIsPromptOpen] = useState(moment().isBefore(votesClose) && !hidePrompt);
  const [type, title, promptText] = prompt.split("|");

  useEffect(() => {
    setIsPromptOpen(!hidePrompt);
  }, [hidePrompt]);

  return (
    <>
      {isV3 ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <p className="text-[24px] text-neutral-11 font-bold">{title}</p>
            <div className="flex items-center px-2 h-4 leading-tight pb-1 mt-1 bg-neutral-9 rounded-[5px] border-0 text-true-black text-[16px] font-bold">
              {type}
            </div>
            <button
              onClick={() => setIsPromptOpen(!isPromptOpen)}
              className={`transition-transform duration-500 ease-in-out transform ${isPromptOpen ? "" : "rotate-180"}`}
            >
              <ChevronUpIcon height={30} />
            </button>
          </div>
          {isPromptOpen && (
            <div className="pl-5">
              <Collapsible isOpen={isPromptOpen}>
                <div className="border-l border-true-white ">
                  <p className="prose prose-invert pl-5">
                    <Interweave content={promptText} matchers={[new UrlMatcher("url")]} />
                  </p>
                </div>
              </Collapsible>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[24px] text-neutral-11 font-bold">contest prompt</p>
            <button
              onClick={() => setIsPromptOpen(!isPromptOpen)}
              className={`transition-transform duration-500 ease-in-out transform ${isPromptOpen ? "" : "rotate-180"}`}
            >
              <ChevronUpIcon height={30} />
            </button>
          </div>

          <div className="pl-5">
            <Collapsible isOpen={isPromptOpen}>
              <div className="border-l border-true-white ">
                <p className="prose pl-5 ">
                  <Interweave content={prompt} matchers={[new UrlMatcher("url")]} />
                </p>
              </div>
            </Collapsible>
          </div>
        </div>
      )}
    </>
  );
};

export default LayoutContestPrompt;
