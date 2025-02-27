import { EntryPreview } from "@hooks/useDeployContest/store";
import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";

export const memeConfig: TemplateConfig = {
  type: TemplateType.memeContest,
  stepsToFulfill: [StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.AnyoneCanPlay,
    rules: {
      title: "Official Meme Contest!",
      prompt: {
        summarize:
          "In this meme contest, anyone can enter their meme below and then vote on their favorites during the voting period.",
        evaluateVoters:
          "Voters should evaluate memes based on their relevance, impact, originality, and—obviously—their humor.",
        contactDetails: "Join The Factorie telegram of creators: https://t.me/+rsiuZqcqzwpjOGYx",
      },
    },
    entryPreviewConfig: {
      preview: EntryPreview.IMAGE,
      isAdditionalDescriptionEnabled: false,
    },
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(7, "days").toDate(),
    votingClose: moment().add(7, "days").add(2, "day").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.OneWeek,
      label: "one week",
    },
    votingClosePeriod: {
      value: TimingPeriod.TwoDays,
      label: "two days",
    },
  },
};
