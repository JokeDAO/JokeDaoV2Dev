import { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { metadataFields } from "@components/_pages/Create/pages/ContestParams/components/Metadata/components/Fields/utils";
import { ContestType } from "@components/_pages/Create/types";
import { ReactNode } from "react";
import { create } from "zustand";
import { Charge, SplitFeeDestinationType, SubmissionMerkle, VoteType, VotingMerkle, VotingRequirements } from "./types";
import moment from "moment";

type ReactStyleStateSetter<T> = T | ((prev: T) => T);

const DEFAULT_SUBMISSIONS = 1000;

type ContestDeployError = {
  step: number;
  message: string;
};

export type Prompt = {
  summarize: string;
  evaluateVoters: string;
  contactDetails?: string;
  imageUrl?: string;
};

export type AdvancedOptions = {
  sorting: boolean;
  rankLimit: number;
};

export type CustomizationOptions = {
  allowedSubmissionsPerUser: number;
  maxSubmissions: number;
};

export type MerkleKey = "prefilled" | "csv";

export interface MetadataField {
  elementType: "string" | "number";
  metadataType: "string" | "uint256" | "address";
  promptLabel: string;
  prompt: string;
  description: {
    desktop: ReactNode;
    mobile: ReactNode;
  };
}

export enum EntryPreview {
  TITLE = "JOKERACE_TITLE_PREVIEW",
  IMAGE = "JOKERACE_IMAGE_PREVIEW",
  IMAGE_AND_TITLE = "JOKERACE_IMAGE_AND_TITLE_PREVIEW",
  TWEET = "JOKERACE_TWEET_PREVIEW",
}
export interface EntryPreviewConfig {
  preview: EntryPreview;
  isAdditionalDescriptionEnabled: boolean;
}

export const emptyVotingRequirements = {
  type: "erc20",
  nftType: "erc721",
  chain: "mainnet",
  tokenAddress: "",
  minTokensRequired: 0.01,
  powerType: "token",
  powerValue: 100,
  timestamp: Date.now(),
  name: "",
  symbol: "",
  logo: "",
  nftTokenId: "",
};

export interface DeployContestState {
  deployContestData: {
    chain: string;
    chainId: number;
    hash: string;
    address: string;
    sortingEnabled: boolean;
  };
  title: string;
  prompt: Prompt;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingRequirements: VotingRequirements;
  votingRequirementsOption: Option;
  votingAllowlist: {
    csv: Record<string, number>;
    prefilled: Record<string, number>;
  };
  votingMerkle: {
    csv: VotingMerkle | null;
    prefilled: VotingMerkle | null;
  };
  submissionMerkle: SubmissionMerkle | null;
  customization: CustomizationOptions;
  advancedOptions: AdvancedOptions;
  isLoading: boolean;
  isSuccess: boolean;
  errors: ContestDeployError[];
  step: number;
  votingTab: number;
  charge: Charge;
  minCharge: {
    minCostToPropose: number;
    minCostToVote: number;
  };
  prevChainRefInCharge: string;
  metadataToggle: boolean;
  metadataFields: MetadataField[];
  entryPreviewConfig: EntryPreviewConfig;
  contestType: ContestType;
  emailSubscriptionAddress: string;
  setDeployContestData: (
    chain: string,
    chainId: number,
    hash: string,
    address: string,
    sortingEnabled: boolean,
  ) => void;
  setTitle: (title: string) => void;
  setPrompt: (prompt: Prompt) => void;
  setSubmissionOpen: (submissionOpen: Date) => void;
  setVotingOpen: (votingOpen: Date) => void;
  setVotingClose: (votingClose: Date) => void;
  setVotingRequirements: (votingRequirements: VotingRequirements) => void;
  setVotingRequirementsOption: (votingRequirementsOption: Option) => void;
  setVotingAllowlist: (type: MerkleKey, votingAllowlist: Record<string, number>) => void;
  setVotingMerkle: (type: MerkleKey, votingMerkle: VotingMerkle | null) => void;
  setSubmissionMerkle: (submissionMerkle: SubmissionMerkle | null) => void;
  setCustomization: (customization: CustomizationOptions) => void;
  setAdvancedOptions: (advancedOptions: AdvancedOptions) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (step: number, error: ContestDeployError) => void;
  setStep: (step: number) => void;
  setVotingTab: (tab: number) => void;
  setCharge: (charge: Charge) => void;
  setMinCharge: (minCharge: { minCostToPropose: number; minCostToVote: number }) => void;
  setPrevChainRefInCharge: (chain: string) => void;
  reset: () => void;
  setMetadataToggle: (toggle: boolean) => void;
  setMetadataFields: (data: ReactStyleStateSetter<MetadataField[]>) => void;
  setEntryPreviewConfig: (data: ReactStyleStateSetter<EntryPreviewConfig>) => void;
  setContestType: (contestType: ContestType) => void;
  setEmailSubscriptionAddress: (emailSubscriptionAddress: string) => void;
}
export const useDeployContestStore = create<DeployContestState>((set, get) => {
  const initialSubmissionOpen: Date = new Date();

  const initialVotingOpen: Date = moment().add(7, "days").toDate();
  const initialVotingClose: Date = moment().add(7, "days").add(3, "days").toDate();

  const initialState = {
    deployContestData: {
      chain: "",
      chainId: 0,
      hash: "",
      address: "",
      sortingEnabled: false,
    },
    title: "",
    prompt: {
      summarize: "",
      evaluateVoters: "Voters should evaluate based on 50% relevance to the prompt and 50% originality.",
      contactDetails: "Join the JokeRace telegram: https://t.co/j7Fp3u7pqS.",
    },

    submissionOpen: initialSubmissionOpen,
    votingOpen: initialVotingOpen,
    votingClose: initialVotingClose,
    votingRequirementsOption: {
      value: "erc20",
      label: "token holders",
    },
    votingAllowlist: {
      csv: {},
      prefilled: {},
    },
    votingMerkle: {
      csv: null,
      prefilled: null,
    },
    votingRequirements: emptyVotingRequirements,
    submissionMerkle: null,
    charge: {
      percentageToCreator: 50,
      splitFeeDestination: { type: SplitFeeDestinationType.CreatorWallet, address: "" },
      voteType: VoteType.PerVote,
      type: {
        costToPropose: 0,
        costToVote: 0,
      },
      error: false,
    },
    minCharge: {
      minCostToPropose: 0,
      minCostToVote: 0,
    },
    prevChainRefInCharge: "",
    customization: {
      allowedSubmissionsPerUser: 3,
      maxSubmissions: DEFAULT_SUBMISSIONS,
    },
    advancedOptions: {
      sorting: true,
      rankLimit: 250,
    },
    isLoading: false,
    isSuccess: false,
    errors: [],
    step: 0,
    votingTab: 0,
    metadataFields: metadataFields.slice(0, 1),
    metadataToggle: false,
    entryPreviewConfig: {
      preview: EntryPreview.TITLE,
      isAdditionalDescriptionEnabled: true,
    },
    contestType: ContestType.AnyoneCanPlay,
    emailSubscriptionAddress: "",
  };

  return {
    ...initialState,
    setDeployContestData: (chain: string, chainId: number, hash: string, address: string, sortingEnabled: boolean) =>
      set({ deployContestData: { chain, chainId, hash, address, sortingEnabled } }),
    setTitle: (title: string) => set({ title }),
    setPrompt: (prompt: Prompt) => set({ prompt }),
    setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),
    setVotingOpen: (votingOpen: Date) => set({ votingOpen }),
    setVotingClose: (votingClose: Date) => set({ votingClose }),
    setVotingRequirementsOption: (votingRequirementsOption: Option) => set({ votingRequirementsOption }),
    setVotingAllowlist: (type, votingAllowlist) => {
      set(state => ({
        votingAllowlist: {
          ...state.votingAllowlist,
          [type]: votingAllowlist,
        },
      }));
    },
    setVotingMerkle: (type, votingMerkle) => {
      set(state => ({
        votingMerkle: {
          ...state.votingMerkle,
          [type]: votingMerkle,
        },
      }));
    },

    setVotingRequirements: (votingRequirements: VotingRequirements) => set({ votingRequirements }),
    setSubmissionMerkle: (submissionMerkle: SubmissionMerkle | null) => set({ submissionMerkle }),
    setCustomization: (customization: CustomizationOptions) => set({ customization }),
    setAdvancedOptions: (advancedOptions: AdvancedOptions) => set({ advancedOptions }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setIsSuccess: (isSuccess: boolean) => set({ isSuccess }),
    setError: (step: number, error: ContestDeployError) => {
      let errorsCopy = [...get().errors];

      errorsCopy = errorsCopy.filter(error => error.step !== step);

      if (error.message) {
        errorsCopy.push(error);
      }

      set({ errors: errorsCopy });
    },
    setStep: (step: number) => set({ step }),
    setVotingTab: (votingTab: number) => set({ votingTab }),
    setCharge: (charge: Charge) => set({ charge }),
    setMinCharge: (minCharge: { minCostToPropose: number; minCostToVote: number }) => set({ minCharge }),
    setPrevChainRefInCharge: (chain: string) => set({ prevChainRefInCharge: chain }),
    reset: () => set({ ...initialState }),
    setMetadataFields: (data: ReactStyleStateSetter<MetadataField[]>) =>
      set(state => ({
        metadataFields: typeof data === "function" ? data(state.metadataFields) : data,
      })),
    setMetadataToggle: (toggle: boolean) => set({ metadataToggle: toggle }),
    setEntryPreviewConfig: (data: ReactStyleStateSetter<EntryPreviewConfig>) =>
      set(state => ({
        entryPreviewConfig: typeof data === "function" ? data(state.entryPreviewConfig) : data,
      })),
    setContestType: (contestType: ContestType) => set({ contestType }),
    setEmailSubscriptionAddress: (emailSubscriptionAddress: string) => set({ emailSubscriptionAddress }),
  };
});
