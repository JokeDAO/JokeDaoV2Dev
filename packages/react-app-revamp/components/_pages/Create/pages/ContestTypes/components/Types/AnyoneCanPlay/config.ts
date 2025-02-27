import { TimingPeriod } from "@components/_pages/Create/pages/ContestTiming/utils";
import { ContestTypeConfig } from "@components/_pages/Create/types";
import moment from "moment";

export const anyoneCanPlayConfig: ContestTypeConfig = {
  data: {
    submissionOpen: new Date(),
    votingOpen: moment().add(7, "days").toDate(),
    votingClose: moment().add(7, "days").add(3, "days").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.OneWeek,
      label: "one week",
    },
    votingClosePeriod: {
      value: TimingPeriod.ThreeDays,
      label: "three days",
    },

    votingAllowlist: {
      csv: {},
      prefilled: {},
    },
    votingMerkle: {
      csv: null,
      prefilled: null,
    },
  },
};
