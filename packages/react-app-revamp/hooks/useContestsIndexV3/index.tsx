import { config } from "@config/wagmi";
import { getAccount } from "@wagmi/core";

export type VotingRequirementsSchema = {
  type: string;
  tokenAddress: string;
  chain: string;
  description: string;
  minTokensRequired: number;
  timestamp: number;
};

export type SubmissionRequirementsSchema = {
  type: string;
  chain: string;
  tokenAddress: string;
  minTokensRequired: number;
  timestamp: number;
};

export interface ContestValues {
  datetimeOpeningSubmissions: Date;
  datetimeOpeningVoting: Date;
  datetimeClosingVoting: Date;
  title: string;
  type: string;
  prompt: string;
  contractAddress: string;
  networkName: string;
  votingMerkleRoot: string;
  submissionMerkleRoot: string;
  voting_requirements: VotingRequirementsSchema | null;
  cost_to_propose: number;
  cost_to_vote: number;
  percentage_to_creator: number;
  authorAddress?: string;
  featured?: boolean;
}

export function useContestsIndexV3() {
  async function indexContestV3(values: ContestValues) {
    try {
      const { address } = getAccount(config);
      const supabaseConfig = await import("@config/supabase");
      const supabase = supabaseConfig.supabase;
      const { error, data } = await supabase.from("contests_v3").insert([
        {
          created_at: new Date().toISOString(),
          start_at: values.datetimeOpeningSubmissions.toISOString(),
          vote_start_at: values.datetimeOpeningVoting.toISOString(),
          end_at: values.datetimeClosingVoting.toISOString(),
          title: values.title,
          type: values.type,
          prompt: values.prompt,
          address: values.contractAddress,
          votingMerkleRoot: values.votingMerkleRoot,
          submissionMerkleRoot: values.submissionMerkleRoot,
          author_address: values?.authorAddress ?? address,
          network_name: values.networkName,
          featured: values.featured ?? false,
          voting_requirements: values.voting_requirements,
          cost_to_propose: values.cost_to_propose,
          cost_to_vote: values.cost_to_vote,
          percentage_to_creator: values.percentage_to_creator,
        },
      ]);
      if (error) {
        throw new Error(error.message);
      }
    } catch (e) {
      throw e;
    }
  }

  return {
    indexContestV3,
  };
}

export default useContestsIndexV3;
