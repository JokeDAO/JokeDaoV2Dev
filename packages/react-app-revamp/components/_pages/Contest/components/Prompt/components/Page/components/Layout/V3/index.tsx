import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { FC, useState } from "react";
import EditContestPrompt from "./components/EditContestPrompt";
import { useLineCount } from "@hooks/useLineCount";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "react-responsive";

interface ContestPromptPageV3LayoutProps {
  prompt: string;
  canEditTitleAndDescription: boolean;
}

const ContestPromptPageV3Layout: FC<ContestPromptPageV3LayoutProps> = ({ prompt, canEditTitleAndDescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { elementRef, lineCount } = useLineCount();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const { contestSummary, contestEvaluate, contestContactDetails } = parsePrompt(prompt);
  const shouldShowReadMore = lineCount > 5;

  const renderSection = (content: string, showDivider: boolean) => {
    if (!content) return null;

    return (
      <>
        {showDivider && <div className="bg-gradient-to-r from-neutral-7 w-full h-[1px] my-6" />}
        <Interweave content={content} matchers={[new UrlMatcher("url")]} />
      </>
    );
  };

  return (
    <div className="flex items-start relative w-full">
      <div className="absolute md:top-2 right-0 md:right-auto md:left-0 md:-translate-x-full md:-ml-4">
        <EditContestPrompt canEditPrompt={canEditTitleAndDescription} prompt={prompt} />
      </div>

      <div className="flex flex-col gap-2 md:gap-4 w-80 xs:w-[460px] sm:w-[560px]">
        <div className="relative">
          <div ref={elementRef} className="prose prose-invert flex flex-col invisible absolute w-full">
            {renderSection(contestSummary, false)}
            {renderSection(contestEvaluate, true)}
            {renderSection(contestContactDetails, true)}
          </div>

          <div
            className={`
              prose prose-invert flex flex-col 
              ${isContestCanceled ? "line-through" : ""}
              ${!isExpanded && shouldShowReadMore ? "overflow-hidden" : ""}
            `}
            style={{
              ...(!isExpanded && shouldShowReadMore
                ? {
                    maskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
                    maxHeight: `${Math.min(lineCount, 5) * 1.6}em`,
                  }
                : {}),
            }}
          >
            {renderSection(contestSummary, false)}
            {(isExpanded || !shouldShowReadMore) && (
              <>
                {renderSection(contestEvaluate, true)}
                {renderSection(contestContactDetails, true)}
              </>
            )}
          </div>
        </div>

        {shouldShowReadMore && !isExpanded && (
          <div className="w-full flex -mt-12 items-center justify-center z-10">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-[12px] md:text-[16px] font-bold flex z-50 w-[120px] md:w-40 h-10 rounded-lg items-center justify-center bg-primary-1 gap-1 text-positive-11 hover:bg-positive-11 hover:text-primary-1 transition-all duration-300 ease-in-out"
            >
              <span>full description</span>
              <ChevronDownIcon
                width={isMobile ? 16 : 21}
                height={isMobile ? 16 : 21}
                className="md:mt-1 transition-transform duration-300"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestPromptPageV3Layout;
