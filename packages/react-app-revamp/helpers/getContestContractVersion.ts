import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import LegacyDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.legacy.1.pre-prompt.sol/Contest.json";
import PromptDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.legacy.2.prompt.sol/Contest.json";
import AllProposalTotalVotesDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.legacy.3.allProposalTotalVotes.sol/Contest.json";
import ProposalVotesDownvotes from "@contracts/bytecodeAndAbi/Contest.legacy.4.proposalVotesDownvotes.sol/Contest.json";
import { getProvider } from "@wagmi/core";
import { utils } from "ethers";
import { chains } from "@config/wagmi";

export async function getContestContractVersion(address: string, chainName: string) {
  const chainId = chains
      .filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;;
  const provider = await getProvider({chainId: chainId});
  const bytecode = await provider.getCode(address);

  if (bytecode.length <= 2) return null;
  if (!bytecode.includes(utils.id("prompt()").slice(2, 10))) {
    return LegacyDeployedContestContract.abi;
  } else if (!bytecode.includes(utils.id("allProposalTotalVotes()").slice(2, 10))) {
    return PromptDeployedContestContract.abi;
  } else if (!bytecode.includes(utils.id("downvotingAllowed()").slice(2, 10))) {
    return AllProposalTotalVotesDeployedContestContract.abi;
  } else if (!bytecode.includes(utils.id("submissionGatingByVotingToken()").slice(2, 10))) {
    return ProposalVotesDownvotes.abi;
  }
  
  return DeployedContestContract.abi;
}

export default getContestContractVersion;
