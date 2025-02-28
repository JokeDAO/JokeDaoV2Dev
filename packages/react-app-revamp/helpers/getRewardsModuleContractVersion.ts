import { config } from "@config/wagmi";
import LegacyDeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.1.first.sol/RewardsModule.json";
import NumberedVersioningRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.3.numberedVersioning.sol/RewardsModule.json";
import GateSubmissionsOpenRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.4.gateSubmissionsOpen.sol/RewardsModule.json";
import BetterRewardsNotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.5.betterRewardsNotes.sol/RewardsModule.json";
import MerkleVotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.1.merkleVotes.sol/RewardsModule.json";
import CantVoteOnDeletedPropsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.10.cantVoteOnDeletedProps.sol/RewardsModule.json";
import AuditMinorFixesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.11.auditMinorFixes.sol/RewardsModule.json";
import AuditInfoAndOptimizationsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.12.auditInfoAndOptimizations.sol/RewardsModule.json";
import CleanUpContractDocsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.13.cleanUpContractDocs.sol/RewardsModule.json";
import TrackProposalAuthorsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.14.trackProposalAuthors.sol/RewardsModule.json";
import TrackVotersRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.15.trackVoters.sol/RewardsModule.json";
import MakeVarsPublicRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.16.makeVarsPublic.sol/RewardsModule.json";
import LetJkLabsCancelRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.17.letJkLabsCancel.sol/RewardsModule.json";
import AddJokeraceCreatedEventRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.18.addJokeraceCreatedEvent.sol/RewardsModule.json";
import TotalVotesCastRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.2.totalVotesCast.sol/RewardsModule.json";
import SetCompilerRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.3.setCompilerTo8Dot19.sol/RewardsModule.json";
import AddIsDeletedRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.4.addIsDeleted.sol/RewardsModule.json";
import DeletedDontHitLimitRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.5.deletedDontHitLimit.sol/RewardsModule.json";
import BringBackDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.6.bringBackDeletedIds.sol/RewardsModule.json";
import ArrayOfDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.7.makeArrayOfDeletedIds.sol/RewardsModule.json";
import DeletedIdAccessorRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.8.makeDeletedIdAccessor.sol/RewardsModule.json";
import PrivateDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.9.privateDeletedIds.sol/RewardsModule.json";
import AddEntryChargeRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.1.addEntryCharge.sol/RewardsModule.json";
import RmImmutableKeywordRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.10.rmImmutableKeyword.sol/RewardsModule.json";
import GasOptimizeGettersRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.11.gasOptimizeGetters.sol/RewardsModule.json";
import AllowCancelCompletedRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.12.allowCancelCompleted.sol/RewardsModule.json";
import AddCommentsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.13.addComments.sol/RewardsModule.json";
import RmShadowingPropIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.14.rmShadowingPropIds.sol/RewardsModule.json";
import RmUnusedViewFuncRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.15.rmUnusedViewFunc.sol/RewardsModule.json";
import PinAllToSameRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.16.pinAllToSame.sol/RewardsModule.json";
import MitToAGPLRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.17.mitToAGPL.sol/RewardsModule.json";
import AddEmergencyFuncsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.18.addEmergencyFuncs.sol/RewardsModule.json";
import AddMoreAttributionRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.19.addMoreAttribution.sol/RewardsModule.json";
import UpdateSortingAlgoRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.2.updateSortingAlgo.sol/RewardsModule.json";
import AddGetDeletedAuthorsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.20.addGetDeletedAuthors.sol/RewardsModule.json";
import AddContentToEventsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.21.addContentToEvents.sol/RewardsModule.json";
import RefactorDistributionFuncRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.22.refactorDistributionFunc.sol/RewardsModule.json";
import NewValueAlreadyInArrayRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.3.newValueAlreadyInArray.sol/RewardsModule.json";
import UseCustomErrorsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.4.useCustomErrors.sol/RewardsModule.json";
import CleanUpSortingRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.5.cleanUpSorting.sol/RewardsModule.json";
import RestructureExtensionsAndUtilsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.6.restructureExtensionsAndUtils.sol/RewardsModule.json";
import RmUnnecessaryVirtualsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.7.rmUnnecessaryVirtuals.sol/RewardsModule.json";
import DeleteInMapAfterForLoopRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.8.deleteInMapAfterForLoop.sol/RewardsModule.json";
import AddGetPropIdsWithForVotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.9.addGetPropIdsWithForVotes.sol/RewardsModule.json";
import AddCostToVoteRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.23.addCostToVote.sol/RewardsModule.json";
import RefactorCostDistroRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.24.refactorCostDistro.sol/RewardsModule.json";
import PayPerVoteRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.25.payPerVote.sol/RewardsModule.json";
import CleanUpConstructorsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.26.cleanUpConstructors.sol/RewardsModule.json";
import AnyoneCanVoteRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.27.anyoneCanVote.sol/RewardsModule.json";
import UpdateForgeLibsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.28.updateForgeLibs.sol/RewardsModule.json";
import SetSplitDestinationRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.29.setSplitDestination.sol/RewardsModule.json";
import MakeJkLabsSplitConfigurableRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.30.makeJkLabsSplitConfigurable.sol/RewardsModule.json";
import AddMetadataFieldsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.31.addMetadataFields.sol/RewardsModule.json";
import CheckCanceledRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.32.checkCanceled.sol/RewardsModule.json";
import MustCancelToWithdrawRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.33.mustCancelToWithdraw.sol/RewardsModule.json";
import AllowJkLabsDestUpdateRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.34.allowJkLabsDestUpdate.sol/RewardsModule.json";
import OnlyCreatorChangeMerkleRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.35.onlyCreatorChangeMerkle.sol/RewardsModule.json";
import NoCommentAfterCloseRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.36.noCommentAfterClose.sol/RewardsModule.json";
import EditTitleDescRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.37.editTitleDesc.sol/RewardsModule.json";
import RmDownvotingRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.5.1.rmDownvoting.sol/RewardsModule.json";
import DeployedRewardsContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { ethers } from "ethers";
import { getEthersProvider } from "./ethers";
import { executeWithTimeout, MAX_TIME_TO_WAIT_FOR_RPC } from "./timeout";

export async function getRewardsModuleContractVersion(address: string, chainId: number) {
  const provider = getEthersProvider(config, { chainId });
  const contract = new ethers.Contract(address, NumberedVersioningRewards.abi, provider);

  try {
    const version: string = await executeWithTimeout(MAX_TIME_TO_WAIT_FOR_RPC, contract.version());
    if (version === "5.1") {
      return RmDownvotingRewards.abi;
    } else if (version === "4.37") {
      return EditTitleDescRewards.abi;
    } else if (version === "4.36") {
      return NoCommentAfterCloseRewards.abi;
    } else if (version === "4.35") {
      return OnlyCreatorChangeMerkleRewards.abi;
    } else if (version === "4.34") {
      return AllowJkLabsDestUpdateRewards.abi;
    } else if (version === "4.33") {
      return MustCancelToWithdrawRewards.abi;
    } else if (version === "4.32") {
      return CheckCanceledRewards.abi;
    } else if (version === "4.31") {
      return AddMetadataFieldsRewards.abi;
    } else if (version === "4.30") {
      return MakeJkLabsSplitConfigurableRewards.abi;
    } else if (version === "4.29") {
      return SetSplitDestinationRewards.abi;
    } else if (version === "4.28") {
      return UpdateForgeLibsRewards.abi;
    } else if (version === "4.27") {
      return AnyoneCanVoteRewards.abi;
    } else if (version === "4.26") {
      return CleanUpConstructorsRewards.abi;
    } else if (version === "4.25") {
      return PayPerVoteRewards.abi;
    } else if (version === "4.24") {
      return RefactorCostDistroRewards.abi;
    } else if (version === "4.23") {
      return AddCostToVoteRewards.abi;
    } else if (version === "4.22") {
      return RefactorDistributionFuncRewards.abi;
    } else if (version === "4.21") {
      return AddContentToEventsRewards.abi;
    } else if (version === "4.20") {
      return AddGetDeletedAuthorsRewards.abi;
    } else if (version === "4.19") {
      return AddMoreAttributionRewards.abi;
    } else if (version === "4.18") {
      return AddEmergencyFuncsRewards.abi;
    } else if (version === "4.17") {
      return MitToAGPLRewards.abi;
    } else if (version === "4.16") {
      return PinAllToSameRewards.abi;
    } else if (version === "4.15") {
      return RmUnusedViewFuncRewards.abi;
    } else if (version === "4.14") {
      return RmShadowingPropIdsRewards.abi;
    } else if (version === "4.13") {
      return AddCommentsRewards.abi;
    } else if (version === "4.12") {
      return AllowCancelCompletedRewards.abi;
    } else if (version === "4.11") {
      return GasOptimizeGettersRewards.abi;
    } else if (version === "4.10") {
      return RmImmutableKeywordRewards.abi;
    } else if (version === "4.9") {
      return AddGetPropIdsWithForVotesRewards.abi;
    } else if (version === "4.8") {
      return DeleteInMapAfterForLoopRewards.abi;
    } else if (version === "4.7") {
      return RmUnnecessaryVirtualsRewards.abi;
    } else if (version === "4.6") {
      return RestructureExtensionsAndUtilsRewards.abi;
    } else if (version === "4.5") {
      return CleanUpSortingRewards.abi;
    } else if (version === "4.4") {
      return UseCustomErrorsRewards.abi;
    } else if (version === "4.3") {
      return NewValueAlreadyInArrayRewards.abi;
    } else if (version === "4.2") {
      return UpdateSortingAlgoRewards.abi;
    } else if (version === "4.1") {
      return AddEntryChargeRewards.abi;
    } else if (version === "3.18") {
      return AddJokeraceCreatedEventRewards.abi;
    } else if (version === "3.17") {
      return LetJkLabsCancelRewards.abi;
    } else if (version === "3.16") {
      return MakeVarsPublicRewards.abi;
    } else if (version === "3.15") {
      return TrackVotersRewards.abi;
    } else if (version === "3.14") {
      return TrackProposalAuthorsRewards.abi;
    } else if (version === "3.13") {
      return CleanUpContractDocsRewards.abi;
    } else if (version === "3.12") {
      return AuditInfoAndOptimizationsRewards.abi;
    } else if (version === "3.11") {
      return AuditMinorFixesRewards.abi;
    } else if (version === "3.10") {
      return CantVoteOnDeletedPropsRewards.abi;
    } else if (version === "3.9") {
      return PrivateDeletedIdsRewards.abi;
    } else if (version === "3.8") {
      return DeletedIdAccessorRewards.abi;
    } else if (version === "3.7") {
      return ArrayOfDeletedIdsRewards.abi;
    } else if (version === "3.6") {
      return BringBackDeletedIdsRewards.abi;
    } else if (version === "3.5") {
      return DeletedDontHitLimitRewards.abi;
    } else if (version === "3.4") {
      return AddIsDeletedRewards.abi;
    } else if (version === "3.3") {
      return SetCompilerRewards.abi;
    } else if (version === "3.2") {
      return TotalVotesCastRewards.abi;
    } else if (version === "3.1") {
      return MerkleVotesRewards.abi;
    } else if (version === "2.5") {
      return BetterRewardsNotesRewards.abi;
    } else if (version === "2.4") {
      return GateSubmissionsOpenRewards.abi;
    } else if (version === "2.3") {
      return NumberedVersioningRewards.abi;
    } else if (version === "1") {
      return LegacyDeployedRewardsModuleContract.abi;
    } else {
      return DeployedRewardsContract.abi;
    }
  } catch (error) {
    // If the version method does not exist, use the legacy ABI
    return LegacyDeployedRewardsModuleContract.abi;
  }
}

export default getRewardsModuleContractVersion;
