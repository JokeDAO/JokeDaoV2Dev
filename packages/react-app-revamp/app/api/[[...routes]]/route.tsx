/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
/** @jsxImportSource frog/jsx */
import SubmissionsFrameAllowlisted from "@components/Frames/submission/Allowlisted";
import SubmissionsFinalFrame from "@components/Frames/submission/FinalFrame";
import SubmissionsInitialFrame from "@components/Frames/submission/InitialFrame";
import SubmissionsFrameTiming, { SubmissionFrameTiming } from "@components/Frames/submission/Timing";
import SubmissionsFrameUnsupportedChain from "@components/Frames/submission/UnsupportedChain";
import TransactionSuccessFrame, { ActionType } from "@components/Frames/transactions/success";
import VoteFrameAllowlisted from "@components/Frames/vote/Allowlisted";
import VoteFinalFrame from "@components/Frames/vote/FinalFrame";
import VoteInitialFrame from "@components/Frames/vote/InitialFrame";
import VoteFrameSubmissionDeleted from "@components/Frames/vote/SubmissionDeleted";
import VoteFrameTiming, { VoteFrameTimingOptions } from "@components/Frames/vote/Timing";
import VoteFrameUnsupportedChain from "@components/Frames/vote/UnsupportedChain";
import { chains } from "@config/wagmi/server";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { parseUnits } from "ethers";
import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/vercel";
import {
  fetchContestInitialData,
  fetchContestSecondaryData,
  fetchCostToPropose,
  safeMetadata,
  targetMetadata,
} from "lib/frames/submission";
import { vars } from "lib/frames/ui";
import { SupportedChainId, getChainId, isSupportedChainId } from "lib/frames/utils";
import { fetchContestInfo, fetchCostToVote, fetchProposalInfo } from "lib/frames/voting";
import moment from "moment";
import { Abi } from "viem";

const isDev = process.env.NODE_ENV === "development";

const URLLink = isDev ? "http://localhost:3000" : "https://JokeRace.io";

const app = new Frog({
  basePath: "/api",
  ui: { vars },
  verify: false,
  imageOptions: {
    format: "png",
  },
});

// Submit proposal
app.frame("/contest/:chain/:address", async c => {
  const { chain, address } = c.req.param();
  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);
  const { name, creator, ensName, anyoneCanSubmit, submissionsOpenDate, submissionsClosedDate } =
    await fetchContestInitialData(abi as Abi, chainId, address);
  const now = moment();

  if (!anyoneCanSubmit) {
    return c.res({
      image: <SubmissionsFrameAllowlisted contestName={name} contestCreator={creator} contestCreatorEns={ensName} />,
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  }

  if (!isSupportedChainId(chainId)) {
    return c.res({
      image: (
        <SubmissionsFrameUnsupportedChain contestName={name} contestCreator={creator} contestCreatorEns={ensName} />
      ),
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  }

  if (now.isBefore(submissionsOpenDate)) {
    return c.res({
      image: (
        <SubmissionsFrameTiming
          contestName={name}
          contestCreator={creator}
          contestCreatorEns={ensName}
          timingStatus={SubmissionFrameTiming.NOT_OPEN}
        />
      ),
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  } else if (now.isAfter(submissionsClosedDate)) {
    return c.res({
      image: (
        <SubmissionsFrameTiming
          contestName={name}
          contestCreator={creator}
          contestCreatorEns={ensName}
          timingStatus={SubmissionFrameTiming.CLOSED}
        />
      ),
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  }

  return c.res({
    action: "/submit",
    image: <SubmissionsInitialFrame contestName={name} contestCreator={creator} contestCreatorEns={ensName} />,
    intents: [<Button>submit an entry</Button>],
  });
});

app.frame("/submit", async c => {
  const pathSegments = c.initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);
  const { name, creator, ensName, prompt, costToPropose, voteStartDate } = await fetchContestSecondaryData(
    abi as Abi,
    chainId,
    address,
  );
  const nativeCurrency = chains.find(c => c.id === chainId)?.nativeCurrency;
  const [contestType, contestTitle] = prompt.split("|");
  const now = moment();

  if (now.isAfter(voteStartDate)) {
    return c.res({
      image: (
        <SubmissionsFrameTiming
          contestName={name}
          contestCreator={creator}
          contestCreatorEns={ensName}
          timingStatus={SubmissionFrameTiming.CLOSED}
        />
      ),
      intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
    });
  }

  return c.res({
    image: (
      <SubmissionsFinalFrame
        contestName={name}
        contestCreator={creator}
        contestCreatorEns={ensName}
        contestType={contestType}
        contestTitle={contestTitle}
        costToPropose={costToPropose}
        voteStartDate={voteStartDate}
        nativeCurrency={nativeCurrency?.symbol}
      />
    ),
    intents: [
      <TextInput placeholder="describe your submission..." />,
      <Button.Transaction action="/submit-details" target="/submit-tx">
        submit
      </Button.Transaction>,
      <Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>,
    ],
  });
});

app.frame("/submit-details", async c => {
  const { initialPath } = c;
  const pathSegments = initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];

  return c.res({
    image: <TransactionSuccessFrame type={ActionType.SUBMISSION} />,
    intents: [<Button.Link href={`${URLLink}/contest/${chain}/${address}`}>visit contest</Button.Link>],
  });
});

app.transaction("/submit-tx", async c => {
  const { inputText: proposalContent } = c;
  const pathSegments = c.initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const userAddress = c.address;
  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);
  const costToPropose = await fetchCostToPropose(abi as Abi, chainId, address);

  let proposalCore = {
    author: userAddress,
    exists: true,
    description: proposalContent,
    targetMetadata: targetMetadata,
    safeMetadata: safeMetadata,
  };

  return c.contract({
    abi: abi as unknown as Abi,
    chainId: `eip155:${chainId as SupportedChainId}`,
    to: address as `0x${string}`,
    functionName: "propose",
    args: [proposalCore, []],
    value: costToPropose,
  });
});

// Vote on a proposal
app.frame("/contest/:chain/:address/submission/:submission", async c => {
  const { chain, address, submission } = c.req.param();
  const chainId = getChainId(chain);
  const { abi } = await getContestContractVersion(address, chainId);

  const { anyoneCanVote, contestDeadline, isDeleted, voteStartDate, proposalAuthor, ensName } = await fetchContestInfo(
    abi as Abi,
    address,
    chainId,
    submission,
  );

  if (!anyoneCanVote) {
    return c.res({
      image: (
        <VoteFrameAllowlisted submission={submission} proposalAuthor={proposalAuthor} proposalAuthorEns={ensName} />
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  if (!isSupportedChainId(chainId)) {
    return c.res({
      image: (
        <VoteFrameUnsupportedChain
          submission={submission}
          proposalAuthor={proposalAuthor}
          proposalAuthorEns={ensName}
        />
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  if (isDeleted) {
    return c.res({
      image: (
        <VoteFrameSubmissionDeleted
          submission={submission}
          proposalAuthor={proposalAuthor}
          proposalAuthorEns={ensName}
        />
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  if (moment().isAfter(contestDeadline)) {
    return c.res({
      image: (
        <VoteFrameTiming
          submission={submission}
          proposalAuthor={proposalAuthor}
          proposalAuthorEns={ensName}
          timingStatus={VoteFrameTimingOptions.CLOSED}
        />
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  if (moment().isBefore(voteStartDate)) {
    return c.res({
      image: (
        <VoteFrameTiming
          submission={submission}
          proposalAuthor={proposalAuthor}
          proposalAuthorEns={ensName}
          timingStatus={VoteFrameTimingOptions.NOT_OPEN}
        />
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  return c.res({
    action: "/vote",
    image: <VoteInitialFrame submission={submission} proposalAuthor={proposalAuthor} proposalAuthorEns={ensName} />,
    intents: [<Button>let’s vote!</Button>],
  });
});

app.frame("/vote", async c => {
  const { initialPath } = c;
  const pathSegments = initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const submission = pathSegments[6];
  const chainId = getChainId(chain);
  const nativeCurrency = chains.find(c => c.id === chainId)?.nativeCurrency;
  const { abi } = await getContestContractVersion(address, chainId);
  const now = moment();
  const { name, authorEthereumAddress, ensName, isTied, rank, votes, costToVote, contestDeadline } =
    await fetchProposalInfo(abi as Abi, address, chainId, submission);

  if (now.isAfter(contestDeadline)) {
    return c.res({
      image: (
        <VoteFrameTiming
          submission={submission}
          proposalAuthor={authorEthereumAddress}
          proposalAuthorEns={ensName}
          timingStatus={VoteFrameTimingOptions.CLOSED}
        />
      ),
      intents: [
        <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
          see submission
        </Button.Link>,
      ],
    });
  }

  return c.res({
    image: (
      <VoteFinalFrame
        submission={submission}
        authorEthereumAddress={authorEthereumAddress}
        authorEns={ensName}
        contestName={name}
        contestDeadline={contestDeadline}
        costToVote={costToVote}
        nativeCurrency={nativeCurrency?.symbol}
        rank={rank}
        votes={votes}
        isTied={isTied}
      />
    ),
    intents: [
      <TextInput placeholder="add votes..." />,
      <Button.Transaction action="/vote-details" target="/vote-tx">
        vote
      </Button.Transaction>,
      <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
        see submission
      </Button.Link>,
    ],
  });
});

app.frame("/vote-details", async c => {
  const { initialPath } = c;
  const pathSegments = initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const submission = pathSegments[6];

  return c.res({
    image: <TransactionSuccessFrame type={ActionType.VOTING} />,
    intents: [
      <Button.Link href={`${URLLink}/contest/${chain}/${address}/submission/${submission}`}>
        see submission
      </Button.Link>,
    ],
  });
});

app.transaction("/vote-tx", async c => {
  const { inputText: amountOfVotesToCast } = c;
  const pathSegments = c.initialPath.split("/");
  const chain = pathSegments[3];
  const address = pathSegments[4];
  const submission = pathSegments[6];
  const chainId = getChainId(chain);

  const { abi } = await getContestContractVersion(address, chainId);

  const costToVote = await fetchCostToVote(abi as Abi, chainId, address, Number(amountOfVotesToCast));

  return c.contract({
    abi: abi as unknown as Abi,
    chainId: `eip155:${chainId as SupportedChainId}`,
    to: address as `0x${string}`,
    functionName: "castVote",
    args: [submission, 0, 0, parseUnits(amountOfVotesToCast?.toString() ?? ""), []],
    value: costToVote,
  });
});

export const GET = handle(app);
export const POST = handle(app);
