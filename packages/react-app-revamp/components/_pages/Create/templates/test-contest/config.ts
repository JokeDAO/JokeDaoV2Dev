import { EntryPreview } from "@hooks/useDeployContest/store";
import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";

export const testContestConfig: TemplateConfig = {
  type: TemplateType.testContest,
  stepsToFulfill: [StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.AnyoneCanPlay,
    rules: {
      title: "Test Contest!",
      prompt: {
        summarize: "This is a test contest! Anyone can enter, and anyone can vote.",
        evaluateVoters: "Vote based entirely on personal relevance.",
        contactDetails: "Join the JokeRace telegram: https://t.me/+rW5X0MqnTXBkOGIx",
      },
    },
    entryPreviewConfig: {
      preview: EntryPreview.TITLE,
      isAdditionalDescriptionEnabled: true,
    },
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(10, "minutes").toDate(),
    votingClose: moment().add(10, "minutes").add(10, "minutes").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.Custom,
      label: "custom",
    },
    votingClosePeriod: {
      value: TimingPeriod.Custom,
      label: "custom",
    },
  },
};
