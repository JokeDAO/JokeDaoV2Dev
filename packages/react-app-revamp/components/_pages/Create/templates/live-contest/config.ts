import { EntryPreview } from "@hooks/useDeployContest/store";
import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";

export const liveContestConfig: TemplateConfig = {
  type: TemplateType.liveContest,
  stepsToFulfill: [StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.AnyoneCanPlay,
    rules: {
      title: "Live Contest!",
      prompt: {
        summarize:
          "In this live contest, anyone can enter themselves or nominate a friend below and then vote on their favorites during the voting period.",
        evaluateVoters: "Voters should evaluate entries based on the vibes of the moment",
        contactDetails: "Join the JokeRace telegram: https://t.me/+rW5X0MqnTXBkOGIx",
      },
    },
    entryPreviewConfig: {
      preview: EntryPreview.TITLE,
      isAdditionalDescriptionEnabled: true,
    },
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(30, "minutes").toDate(),
    votingClose: moment().add(30, "minutes").add(2.5, "hours").toDate(),
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
