import LegacyDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.1.pre-prompt.sol/Contest.json";
import BetterRewardsNotesContract from "@contracts/bytecodeAndAbi/Contest.2.10.betterRewardsNotes.sol/Contest.json";
import PromptDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.2.prompt.sol/Contest.json";
import AllProposalTotalVotesDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.3.allProposalTotalVotes.sol/Contest.json";
import ProposalVotesDownvotesContract from "@contracts/bytecodeAndAbi/Contest.2.4.proposalVotesDownvotes.sol/Contest.json";
import SubmissionTokenGatingContract from "@contracts/bytecodeAndAbi/Contest.2.5.submissionTokenGating.sol/Contest.json";
import RewardsContract from "@contracts/bytecodeAndAbi/Contest.2.6.rewards.sol/Contest.json";
import NumberedVersioningContract from "@contracts/bytecodeAndAbi/Contest.2.8.numberedVersioning.sol/Contest.json";
import GateSubmissionsOpenContract from "@contracts/bytecodeAndAbi/Contest.2.9.gateSubmissionsOpen.sol/Contest.json";
import MerkleVotesContract from "@contracts/bytecodeAndAbi/Contest.3.1.merkleVotes.sol/Contest.json";
import CantVoteOnDeletedContract from "@contracts/bytecodeAndAbi/Contest.3.10.cantVoteOnDeletedProps.sol/Contest.json";
import AuditMinorFixesContract from "@contracts/bytecodeAndAbi/Contest.3.11.auditMinorFixes.sol/Contest.json";
import AuditInfoAndOptimizationsContract from "@contracts/bytecodeAndAbi/Contest.3.12.auditInfoAndOptimizations.sol/Contest.json";
import CleanUpContractDocsContract from "@contracts/bytecodeAndAbi/Contest.3.13.cleanUpContractDocs.sol/Contest.json";
import TrackProposalAuthorsContract from "@contracts/bytecodeAndAbi/Contest.3.14.trackProposalAuthors.sol/Contest.json";
import TrackVotersContract from "@contracts/bytecodeAndAbi/Contest.3.15.trackVoters.sol/Contest.json";
import MakeVarsPublicContract from "@contracts/bytecodeAndAbi/Contest.3.16.makeVarsPublic.sol/Contest.json";
import LetJkLabsCancelContract from "@contracts/bytecodeAndAbi/Contest.3.17.letJkLabsCancel.sol/Contest.json";
import AddJokeraceCreatedEventContract from "@contracts/bytecodeAndAbi/Contest.3.18.addJokeraceCreatedEvent.sol/Contest.json";
import TotalVotesCastContract from "@contracts/bytecodeAndAbi/Contest.3.2.totalVotesCast.sol/Contest.json";
import SetCompilerContract from "@contracts/bytecodeAndAbi/Contest.3.3.setCompilerTo8Dot19.sol/Contest.json";
import AddIsDeletedContract from "@contracts/bytecodeAndAbi/Contest.3.4.addIsDeleted.sol/Contest.json";
import DeletedDontHitLimitContract from "@contracts/bytecodeAndAbi/Contest.3.5.deletedDontHitLimit.sol/Contest.json";
import BringBackDeletedIdsContract from "@contracts/bytecodeAndAbi/Contest.3.6.bringBackDeletedIds.sol/Contest.json";
import ArrayOfDeletedIdsContract from "@contracts/bytecodeAndAbi/Contest.3.7.makeArrayOfDeletedIds.sol/Contest.json";
import DeletedIdAccessorContract from "@contracts/bytecodeAndAbi/Contest.3.8.makeDeletedIdAccessor.sol/Contest.json";
import PrivateDeletedIdsContract from "@contracts/bytecodeAndAbi/Contest.3.9.privateDeletedIds.sol/Contest.json";
import AddEntryChargeContract from "@contracts/bytecodeAndAbi/Contest.4.1.addEntryCharge.sol/Contest.json";
import RmImmutableKeywordContract from "@contracts/bytecodeAndAbi/Contest.4.10.rmImmutableKeyword.sol/Contest.json";
import GasOptimizeGettersContract from "@contracts/bytecodeAndAbi/Contest.4.11.gasOptimizeGetters.sol/Contest.json";
import AllowCancelCompletedContract from "@contracts/bytecodeAndAbi/Contest.4.12.allowCancelCompleted.sol/Contest.json";
import AddCommentsContract from "@contracts/bytecodeAndAbi/Contest.4.13.addComments.sol/Contest.json";
import RmShadowingPropIdsContract from "@contracts/bytecodeAndAbi/Contest.4.14.rmShadowingPropIds.sol/Contest.json";
import RmUnusedViewFuncContract from "@contracts/bytecodeAndAbi/Contest.4.15.rmUnusedViewFunc.sol/Contest.json";
import PinAllToSameContract from "@contracts/bytecodeAndAbi/Contest.4.16.pinAllToSame.sol/Contest.json";
import MitToAGPLContract from "@contracts/bytecodeAndAbi/Contest.4.17.mitToAGPL.sol/Contest.json";
import AddEmergencyFuncsContract from "@contracts/bytecodeAndAbi/Contest.4.18.addEmergencyFuncs.sol/Contest.json";
import AddMoreAttributionContract from "@contracts/bytecodeAndAbi/Contest.4.19.addMoreAttribution.sol/Contest.json";
import UpdateSortingAlgoContract from "@contracts/bytecodeAndAbi/Contest.4.2.updateSortingAlgo.sol/Contest.json";
import AddGetDeletedAuthorsContract from "@contracts/bytecodeAndAbi/Contest.4.20.addGetDeletedAuthors.sol/Contest.json";
import AddContentToEventsContract from "@contracts/bytecodeAndAbi/Contest.4.21.addContentToEvents.sol/Contest.json";
import RefactorDistributionFuncContract from "@contracts/bytecodeAndAbi/Contest.4.22.refactorDistributionFunc.sol/Contest.json";
import AddCostToVoteContract from "@contracts/bytecodeAndAbi/Contest.4.23.addCostToVote.sol/Contest.json";
import RefactorCostDistroContract from "@contracts/bytecodeAndAbi/Contest.4.24.refactorCostDistro.sol/Contest.json";
import PayPerVoteContract from "@contracts/bytecodeAndAbi/Contest.4.25.payPerVote.sol/Contest.json";
import CleanUpConstructorsContract from "@contracts/bytecodeAndAbi/Contest.4.26.cleanUpConstructors.sol/Contest.json";
import AnyoneCanVoteContract from "@contracts/bytecodeAndAbi/Contest.4.27.anyoneCanVote.sol/Contest.json";
import UpdateForgeLibsContract from "@contracts/bytecodeAndAbi/Contest.4.28.updateForgeLibs.sol/Contest.json";
import SetSplitDestinationContract from "@contracts/bytecodeAndAbi/Contest.4.29.setSplitDestination.sol/Contest.json";
import MakeJkLabsSplitConfigurableContract from "@contracts/bytecodeAndAbi/Contest.4.30.makeJkLabsSplitConfigurable.sol/Contest.json";
import AddMetadataFieldsContract from "@contracts/bytecodeAndAbi/Contest.4.31.addMetadataFields.sol/Contest.json";
import CheckCanceledContract from "@contracts/bytecodeAndAbi/Contest.4.32.checkCanceled.sol/Contest.json";
import MustCancelToWithdrawContract from "@contracts/bytecodeAndAbi/Contest.4.33.mustCancelToWithdraw.sol/Contest.json";
import AllowJkLabsDestUpdateContract from "@contracts/bytecodeAndAbi/Contest.4.34.allowJkLabsDestUpdate.sol/Contest.json";
import OnlyCreatorChangeMerkleContract from "@contracts/bytecodeAndAbi/Contest.4.35.onlyCreatorChangeMerkle.sol/Contest.json";
import NoCommentAfterCloseContract from "@contracts/bytecodeAndAbi/Contest.4.36.noCommentAfterClose.sol/Contest.json";
import EditTitleDescContract from "@contracts/bytecodeAndAbi/Contest.4.37.editTitleDesc.sol/Contest.json";
import NewValueAlreadyInArrayContract from "@contracts/bytecodeAndAbi/Contest.4.3.newValueAlreadyInArray.sol/Contest.json";
import UseCustomErrorsContract from "@contracts/bytecodeAndAbi/Contest.4.4.useCustomErrors.sol/Contest.json";
import CleanUpSortingContract from "@contracts/bytecodeAndAbi/Contest.4.5.cleanUpSorting.sol/Contest.json";
import RestructureExtensionsAndUtilsContract from "@contracts/bytecodeAndAbi/Contest.4.6.restructureExtensionsAndUtils.sol/Contest.json";
import RmUnnecessaryVirtualsContract from "@contracts/bytecodeAndAbi/Contest.4.7.rmUnnecessaryVirtuals.sol/Contest.json";
import DeleteInMapAfterForLoopContract from "@contracts/bytecodeAndAbi/Contest.4.8.deleteInMapAfterForLoop.sol/Contest.json";
import AddGetPropIdsWithForVotesContract from "@contracts/bytecodeAndAbi/Contest.4.9.addGetPropIdsWithForVotes.sol/Contest.json";
import RmDownvotingContract from "@contracts/bytecodeAndAbi/Contest.5.1.rmDownvoting.sol/Contest.json";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { ethers, utils } from "ethers";
import { getEthersProvider } from "./ethers";
import { MAX_TIME_TO_WAIT_FOR_RPC, executeWithTimeout } from "./timeout";
import { serverConfig } from "@config/wagmi/server";

export async function getContestContractVersion(address: string, chainId: number) {
  try {
    const provider = getEthersProvider(serverConfig, { chainId });
    const contract = new ethers.Contract(address, NumberedVersioningContract.abi, provider);

    // Here we check if all RPC calls are successful, otherwise we throw an error and return empty ABI
    const version: string = await executeWithTimeout(MAX_TIME_TO_WAIT_FOR_RPC, contract.version());

    const defaultReturn = { abi: null, version: "unknown" };
    if (version === "5.1") {
      return { abi: RmDownvotingContract.abi, version }; 
    } else if (version === "4.37") {
      return { abi: EditTitleDescContract.abi, version }; 
    } else if (version === "4.36") {
      return { abi: NoCommentAfterCloseContract.abi, version }; 
    } else if (version === "4.35") {
      return { abi: OnlyCreatorChangeMerkleContract.abi, version }; 
    } else if (version === "4.34") {
      return { abi: AllowJkLabsDestUpdateContract.abi, version }; 
    } else if (version === "4.33") {
      return { abi: MustCancelToWithdrawContract.abi, version }; 
    } else if (version === "4.32") {
      return { abi: CheckCanceledContract.abi, version }; 
    } else if (version === "4.31") {
      return { abi: AddMetadataFieldsContract.abi, version };
    } else if (version === "4.30") {
      return { abi: MakeJkLabsSplitConfigurableContract.abi, version };
    } else if (version === "4.29") {
      return { abi: SetSplitDestinationContract.abi, version };
    } else if (version === "4.28") {
      return { abi: UpdateForgeLibsContract.abi, version };
    } else if (version === "4.27") {
      return { abi: AnyoneCanVoteContract.abi, version };
    } else if (version === "4.26") {
      return { abi: CleanUpConstructorsContract.abi, version };
    } else if (version === "4.25") {
      return { abi: PayPerVoteContract.abi, version };
    } else if (version === "4.24") {
      return { abi: RefactorCostDistroContract.abi, version };
    } else if (version === "4.23") {
      return { abi: AddCostToVoteContract.abi, version };
    } else if (version === "4.22") {
      return { abi: RefactorDistributionFuncContract.abi, version };
    } else if (version === "4.21") {
      return { abi: AddContentToEventsContract.abi, version };
    } else if (version === "4.20") {
      return { abi: AddGetDeletedAuthorsContract.abi, version };
    } else if (version === "4.19") {
      return { abi: AddMoreAttributionContract.abi, version };
    } else if (version === "4.18") {
      return { abi: AddEmergencyFuncsContract.abi, version };
    } else if (version === "4.17") {
      return { abi: MitToAGPLContract.abi, version };
    } else if (version === "4.16") {
      return { abi: PinAllToSameContract.abi, version };
    } else if (version === "4.15") {
      return { abi: RmUnusedViewFuncContract.abi, version };
    } else if (version === "4.14") {
      return { abi: RmShadowingPropIdsContract.abi, version };
    } else if (version === "4.13") {
      return { abi: AddCommentsContract.abi, version };
    } else if (version === "4.12") {
      return { abi: AllowCancelCompletedContract.abi, version };
    } else if (version === "4.11") {
      return { abi: GasOptimizeGettersContract.abi, version };
    } else if (version === "4.10") {
      return { abi: RmImmutableKeywordContract.abi, version };
    } else if (version === "4.9") {
      return { abi: AddGetPropIdsWithForVotesContract.abi, version };
    } else if (version === "4.8") {
      return { abi: DeleteInMapAfterForLoopContract.abi, version };
    } else if (version === "4.7") {
      return { abi: RmUnnecessaryVirtualsContract.abi, version };
    } else if (version === "4.6") {
      return { abi: RestructureExtensionsAndUtilsContract.abi, version };
    } else if (version === "4.5") {
      return { abi: CleanUpSortingContract.abi, version };
    } else if (version === "4.4") {
      return { abi: UseCustomErrorsContract.abi, version };
    } else if (version === "4.3") {
      return { abi: NewValueAlreadyInArrayContract.abi, version };
    } else if (version === "4.2") {
      return { abi: UpdateSortingAlgoContract.abi, version };
    } else if (version === "4.1") {
      return { abi: AddEntryChargeContract.abi, version };
    } else if (version === "3.18") {
      return { abi: AddJokeraceCreatedEventContract.abi, version };
    } else if (version === "3.17") {
      return { abi: LetJkLabsCancelContract.abi, version };
    } else if (version === "3.16") {
      return { abi: MakeVarsPublicContract.abi, version };
    } else if (version === "3.15") {
      return { abi: TrackVotersContract.abi, version };
    } else if (version === "3.14") {
      return { abi: TrackProposalAuthorsContract.abi, version };
    } else if (version === "3.13") {
      return { abi: CleanUpContractDocsContract.abi, version };
    } else if (version === "3.12") {
      return { abi: AuditInfoAndOptimizationsContract.abi, version };
    } else if (version === "3.11") {
      return { abi: AuditMinorFixesContract.abi, version };
    } else if (version === "3.10") {
      return { abi: CantVoteOnDeletedContract.abi, version };
    } else if (version === "3.9") {
      return { abi: PrivateDeletedIdsContract.abi, version };
    } else if (version === "3.8") {
      return { abi: DeletedIdAccessorContract.abi, version };
    } else if (version === "3.7") {
      return { abi: ArrayOfDeletedIdsContract.abi, version };
    } else if (version === "3.6") {
      return { abi: BringBackDeletedIdsContract.abi, version };
    } else if (version === "3.5") {
      return { abi: DeletedDontHitLimitContract.abi, version };
    } else if (version === "3.4") {
      return { abi: AddIsDeletedContract.abi, version };
    } else if (version === "3.3") {
      return { abi: SetCompilerContract.abi, version };
    } else if (version === "3.2") {
      return { abi: TotalVotesCastContract.abi, version };
    } else if (version === "3.1") {
      return { abi: MerkleVotesContract.abi, version };
    } else if (version === "2.10") {
      return { abi: BetterRewardsNotesContract.abi, version };
    } else if (version === "2.9") {
      return { abi: GateSubmissionsOpenContract.abi, version };
    } else if (version === "2.8") {
      return { abi: NumberedVersioningContract.abi, version };
    }

    if (version === "1") {
      const bytecode = await provider.getCode(address);
      if (bytecode.length <= 2) return defaultReturn;
      if (!bytecode.includes(utils.id("prompt()").slice(2, 10))) {
        return { abi: LegacyDeployedContestContract.abi, version };
      } else if (!bytecode.includes(utils.id("allProposalTotalVotes()").slice(2, 10))) {
        return { abi: PromptDeployedContestContract.abi, version };
      } else if (!bytecode.includes(utils.id("downvotingAllowed()").slice(2, 10))) {
        return { abi: AllProposalTotalVotesDeployedContestContract.abi, version };
      } else if (!bytecode.includes(utils.id("submissionGatingByVotingToken()").slice(2, 10))) {
        return { abi: ProposalVotesDownvotesContract.abi, version };
      } else if (!bytecode.includes(utils.id("officialRewardsModule()").slice(2, 10))) {
        return { abi: SubmissionTokenGatingContract.abi, version };
      } else {
        return { abi: RewardsContract.abi, version };
      }
    }

    return { abi: DeployedContestContract.abi, version };
  } catch (error: unknown) {
    console.error(`Error while fetching the contract version for address ${address} on chainId ${chainId}:`, error);
    return { abi: null, version: "error" };
  }
}

export default getContestContractVersion;
