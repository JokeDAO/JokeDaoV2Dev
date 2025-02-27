import moment from "moment";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { EntryPreview } from "@hooks/useDeployContest/store";

export const grantsRoundConfig: TemplateConfig = {
  type: TemplateType.grantsRound,
  stepsToFulfill: [StepTitle.Voting, StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.EntryContest,
    rules: {
      title: "Official Grants Round!",
      prompt: {
        summarize:
          "In this grants round, builders are invited to submit their project, and a jury of voters will vote on their favorite.",
        evaluateVoters:
          "Judges should evaluate builders’ projects based on their personal relevance, impact, importance, and innovativeness.",
        contactDetails: "Join the JokeRace general telegram: https://t.me/+rW5X0MqnTXBkOGIx",
      },
    },
    entryPreviewConfig: {
      preview: EntryPreview.TITLE,
      isAdditionalDescriptionEnabled: true,
    },
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(7, "days").toDate(),
    votingClose: moment().add(7, "days").add(1, "day").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.OneWeek,
      label: "one week",
    },
    votingClosePeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
  },
};
