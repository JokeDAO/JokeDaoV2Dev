import { formatUnits } from "ethers";
import { Recipient } from "lib/merkletree/generateMerkleTree";

export const indexContestParticipantsV3 = async (
  address: string,
  participants: string[],
  voterSet: Set<string>,
  submitterSet: Set<string>,
  voters: Recipient[],
  networkName: string,
  everyoneCanSubmit?: boolean,
) => {
  try {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const votersMap = new Map(voters.map(voter => [voter.address, voter]));

    const data = participants.map(participant => {
      const isVoter = voterSet.has(participant);
      const isSubmitter = everyoneCanSubmit ? everyoneCanSubmit : submitterSet.has(participant);

      let num_votes = 0;

      if (isVoter) {
        const voter = votersMap.get(participant);
        if (voter) {
          num_votes = parseFloat(formatUnits(voter.numVotes, 18));
        }
      }

      return {
        contest_address: address,
        user_address: participant,
        can_submit: isSubmitter,
        num_votes: num_votes,
        network_name: networkName,
      };
    });

    const { error } = await supabase.from("contest_participants_v3").insert(data);

    if (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    throw e;
  }
};
