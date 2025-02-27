import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";
import { EntryPreview } from "@hooks/useDeployContest/store";

export const demoDayConfig: TemplateConfig = {
  type: TemplateType.demoDay,
  stepsToFulfill: [StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.AnyoneCanPlay,
    rules: {
      title: "Official Demo Day!",
      prompt: {
        summarize:
          "In this demo day, anyone can enter their project and then vote on their favorites during the voting period. You can find voter addresses here and on the Dune Dashboards tab on the extensions tab (available on certain chains).",
        evaluateVoters:
          "Voters should evaluate builders’ projects based on their relevance, impact, originality, innovativeness, and success of what they’ve built.",
        contactDetails: "Join the BuildProof telegram of devs: https://t.me/+_0I7UYSgaS45NmRh",
      },
    },
    entryPreviewConfig: {
      preview: EntryPreview.TITLE,
      isAdditionalDescriptionEnabled: true,
    },
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(1, "days").toDate(),
    votingClose: moment().add(1, "days").add(1, "day").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
    votingClosePeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
  },
};
