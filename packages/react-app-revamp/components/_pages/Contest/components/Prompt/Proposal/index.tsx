import { Proposal } from "@components/_pages/ProposalContent";
import { Tweet } from "@components/_pages/ProposalContent/components/ProposalLayout/Tweet/components/CustomTweet";
import { extractPathSegments } from "@helpers/extractPath";
import { twitterRegex } from "@helpers/regex";
import {
  generateFacebookShareUrlForSubmission,
  generateFarcasterShareUrlForSubmission,
  generateLensShareUrlForSubmission,
  generateLinkedInShareUrlForSubmission,
  generateTwitterShareUrlForSubmission,
  generateUrlSubmissions,
} from "@helpers/share";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { ProposalState } from "lib/proposal";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

interface ContestProposalProps {
  proposal: Proposal;
  proposalId?: string;
  displaySocials?: boolean;
  contestStatus?: ContestStatus;
  votingOpen?: Date;
}

const transform = (node: HTMLElement): ReactNode => {
  const element = node.tagName.toLowerCase();
  if (element === "a") {
    const href = node.getAttribute("href");
    const tweetUrlMatch = href && href.match(twitterRegex);

    const isInsideList =
      node.parentNode?.parentNode?.nodeName === "li" ||
      node.parentNode?.parentNode?.nodeName === "ul" ||
      node.parentNode?.parentNode?.nodeName === "ol";

    if (tweetUrlMatch) {
      if (isInsideList) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {node.childNodes[0]?.textContent || ""}
          </a>
        );
      }

      const hasTextContent = node.childNodes[0]?.textContent && node.childNodes[0]?.textContent !== href;

      if (hasTextContent) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {node.childNodes[0]?.textContent}
          </a>
        );
      } else {
        const tweetId = tweetUrlMatch[4] || tweetUrlMatch[2];
        return (
          <div className="dark not-prose">
            <Tweet apiUrl={`/api/tweet/${tweetId}`} id={tweetId} />
          </div>
        );
      }
    }
  }
};

const ContestProposal: FC<ContestProposalProps> = ({ proposal, proposalId, contestStatus, displaySocials }) => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const { contestName } = useContestStore(state => state);

  return (
    <div className="flex flex-col gap-4 justify-between h-full">
      {proposal.content === ProposalState.Deleted ? (
        <p className="text-[16px] text-neutral-11">{ProposalState.Deleted}</p>
      ) : (
        <Interweave
          className="prose prose-invert overflow-hidden"
          content={proposal.content}
          matchers={[new UrlMatcher("url")]}
          transform={transform}
        />
      )}

      {displaySocials && proposalId ? (
        <div className="hidden md:flex gap-2">
          <a
            className={`flex items-center  bg-neutral-12 rounded-full overflow-hidden w-8 h-8`}
            href={generateLensShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <img
              width={32}
              height={32}
              className="object-cover m-auto grayscale"
              src="/socials/lens-leaf.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center  bg-neutral-13 rounded-full overflow-hidden w-8 h-8`}
            href={generateTwitterShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <img width={28} height={28} className="object-cover m-auto" src="/socials/twitter-light.svg" alt="avatar" />
          </a>
          <a
            className={`flex items-center  bg-neutral-13 rounded-full overflow-hidden w-8 h-8`}
            href={generateFarcasterShareUrlForSubmission(contestName, address, chainName, proposalId)}
            target="_blank"
          >
            <img
              width={28}
              height={28}
              className="object-cover m-auto"
              src="/socials/farcaster-light.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center rounded-full overflow-hidden w-8 h-8`}
            href={generateFacebookShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <img
              width={30}
              height={30}
              className="object-cover m-auto grayscale"
              src="/socials/share-submission/facebook.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center   rounded-full overflow-hidden w-8 h-8`}
            href={generateLinkedInShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <img
              width={34}
              height={34}
              className="object-cover m-auto grayscale"
              src="/socials/share-submission/linkedin.svg"
              alt="avatar"
            />
          </a>

          <div
            className={`flex items-center bg-true-black rounded-full border-neutral-11 border overflow-hidden w-8 h-8 cursor-pointer`}
            onClick={() =>
              navigator.share({
                url: generateUrlSubmissions(address, chainName, ""),
              })
            }
          >
            <img src="/forward.svg" alt="share" className="object-cover m-auto" width={15} height={13} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ContestProposal;
