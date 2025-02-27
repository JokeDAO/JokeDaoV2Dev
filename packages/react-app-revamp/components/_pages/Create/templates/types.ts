import { EntryPreviewConfig, Prompt } from "@hooks/useDeployContest/store";
import { Option } from "../components/DefaultDropdown";
import { ContestType, StepTitle } from "../types";

export enum TemplateType {
  leaderboard = "leaderboard",
  demoDay = "demo day",
  artContest = "art contest",
  memeContest = "meme contest",
  hackathon = "hackathon",
  grantsRound = "grants round",
  debate = "debate",
  liveContest = "live contest",
  testContest = "test contest",
}

interface ContestData {
  contestType: ContestType;
  rules: {
    title: string;
    prompt: Prompt;
  };
  entryPreviewConfig: EntryPreviewConfig;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingOpenPeriod: Option;
  votingClosePeriod: Option;
}

export interface TemplateConfig {
  type: TemplateType;
  stepsToFulfill: StepTitle[];
  data: ContestData;
}
