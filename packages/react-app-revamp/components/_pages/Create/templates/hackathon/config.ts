import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";
import { EntryPreview } from "@hooks/useDeployContest/store";

export const hackathonConfig: TemplateConfig = {
  type: TemplateType.hackathon,
  stepsToFulfill: [StepTitle.Voting, StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.EntryContest,
    rules: {
      title: "Official Hackathon!",
      prompt: {
        summarize:
          "In this hackathon, builders are invited to enter their project, and a jury of voters will vote on their favorite.",
        evaluateVoters:
          "Judges should evaluate builders’ projects based on their personal relevance, impact, importance, innovativeness, and success of what they’ve built.",
        contactDetails: "Join the BuildProof telegram of devs: https://t.me/+_0I7UYSgaS45NmRh",
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
