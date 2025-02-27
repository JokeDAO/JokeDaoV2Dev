import { EntryPreview } from "@hooks/useDeployContest/store";
import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";

export const artConfig: TemplateConfig = {
  type: TemplateType.artContest,
  stepsToFulfill: [StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.AnyoneCanPlay,
    rules: {
      title: "Official Art Contest!",
      prompt: {
        summarize:
          "In this art contest, anyone can enter their art below and then vote on their favorites during the voting period.",
        evaluateVoters: "Voters should evaluate art based on its originality, beauty, and use of the medium.",
        contactDetails: "Join The Factorie telegram of creators: https://t.me/+rsiuZqcqzwpjOGYx",
      },
    },
    entryPreviewConfig: {
      preview: EntryPreview.IMAGE_AND_TITLE,
      isAdditionalDescriptionEnabled: true,
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
