import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";
import { EntryPreview } from "@hooks/useDeployContest/store";

export const leaderboardConfig: TemplateConfig = {
  type: TemplateType.leaderboard,
  stepsToFulfill: [StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.AnyoneCanPlay,
    rules: {
      title: "Project Leaderboard",
      prompt: {
        summarize:
          "This will serve as a leaderboard of the most beloved projects. Anyone can enter their project below and then vote on their favorites during the voting period.",
        evaluateVoters: "Voters should evaluate projects based on their impact, importance, and personal relevance.",
        contactDetails: "Join the JokeRace telegram: https://t.me/+rW5X0MqnTXBkOGIx",
      },
    },
    entryPreviewConfig: {
      preview: EntryPreview.TITLE,
      isAdditionalDescriptionEnabled: true,
    },
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(5, "days").toDate(),
    votingClose: moment().add(5, "days").add(2, "days").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.Custom,
      label: "custom",
    },
    votingClosePeriod: {
      value: TimingPeriod.TwoDays,
      label: "2 days",
    },
  },
};
