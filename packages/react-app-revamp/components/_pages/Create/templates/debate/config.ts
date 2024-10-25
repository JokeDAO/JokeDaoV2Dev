import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";
import { EntryPreview } from "@hooks/useDeployContest/store";

export const debateConfig: TemplateConfig = {
  type: TemplateType.debate,
  stepsToFulfill: [StepTitle.Title, StepTitle.Entries, StepTitle.Timing, StepTitle.Voting, StepTitle.Confirm],
  data: {
    prompt: {
      summarize: "Pick whoever you think won this debate or feud.",
      evaluateVoters:
        "Voters should evaluate contestants equally based on the merits of their case as well as their delivery.",
    },
    entryPreviewConfig: {
      preview: EntryPreview.TITLE,
      isAdditionalDescriptionEnabled: true,
    },
    type: "debate",
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(30, "minutes").toDate(),
    votingClose: moment().add(30, "minutes").add(1, "day").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.Custom,
      label: "custom",
    },
    votingClosePeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
  },
};
