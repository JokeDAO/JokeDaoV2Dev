import BurgerMenu from "@components/UI/BurgerMenu";
import GradientText from "@components/UI/GradientText";
import { FOOTER_LINKS } from "@config/links";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import CancelContest from "../CancelContest";
import EditContestName from "./components/EditContestName";

interface ContestNameProps {
  contestName: string;
  canEditTitle: boolean;
}

const ContestName: FC<ContestNameProps> = ({ contestName, canEditTitle }) => {
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const allowedLinks = ["Github", "Twitter", "Telegram", "Report a bug", "Terms", "Media Kit", "FAQ"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));

  if (isMobile) {
    return (
      <div className="flex items-center justify-between w-full">
        <GradientText text={contestName} isStrikethrough={isContestCanceled} />
        <div className="flex items-center gap-2">
          <EditContestName contestName={contestName} canEditTitle={canEditTitle} />
          <CancelContest />
          <BurgerMenu>
            <div className="flex justify-end flex-col gap-2">
              {filteredLinks.map((link, key) => (
                <a
                  className="font-sabo text-neutral-11 text-[24px]"
                  key={`footer-link-${key}`}
                  href={link.href}
                  rel="nofollow noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </BurgerMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <GradientText text={contestName} isStrikethrough={isContestCanceled} />
      <div className="flex items-center gap-2 justify-end">
        <EditContestName contestName={contestName} canEditTitle={canEditTitle} />
        <CancelContest />
      </div>
    </div>
  );
};

export default ContestName;
