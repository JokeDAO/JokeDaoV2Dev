import { VotingMerkle } from "@hooks/useDeployContest/types";
import { Option } from "./components/DefaultDropdown";

export enum StepTitle {
  Type = "Type",
  Entries = "Entries",
  Timing = "Timing",
  Voting = "Voting",
  Monetization = "Monetization",
  Rules = "Rules",
  Confirm = "Confirm!",
}

export enum ContestType {
  AnyoneCanPlay = "anyone can play",
  EntryContest = "entry contest",
  VotingContest = "voting contest",
}

export interface ContestDataForType {
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingOpenPeriod: Option;
  votingClosePeriod: Option;
  votingAllowlist: {
    csv: Record<string, number>;
    prefilled: Record<string, number>;
  };
  votingMerkle: {
    csv: VotingMerkle | null;
    prefilled: VotingMerkle | null;
  };
}

export interface ContestTypeConfig {
  data: ContestDataForType;
}
