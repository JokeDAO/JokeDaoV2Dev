// SPDX-License-Identifier: AGPL-3.0-only
// Forked from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol
pragma solidity ^0.8.19;

import "../Governor.sol";

/**
 * @dev Extension of {Governor} for simple vote counting.
 */
abstract contract GovernorCountingSimple is Governor {
    struct ProposalVote {
        uint256 proposalVoteCount;
        address[] addressesVoted;
        mapping(address => uint256) addressVoteCount;
    }

    uint256 public totalVotesCast; // Total votes cast in contest so far
    mapping(address => uint256) public addressTotalCastVoteCount;
    mapping(uint256 => ProposalVote) public proposalVoteStructs;

    mapping(uint256 => uint256[]) public votesToProposalIds;

    error MoreThanOneProposalWithThisManyVotes();
    error NotEnoughVotesLeft();

    error RankCannotBeZero();
    error RankIsNotInSortedRanks();
    error IndexHasNotBeenPopulated();

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function proposalVotes(uint256 proposalId) public view returns (uint256 voteCount) {
        return proposalVoteStructs[proposalId].proposalVoteCount;
    }

    /**
     * @dev Accessor to how many votes an address has cast for a given proposal.
     */
    function proposalAddressVotes(uint256 proposalId, address userAddress) public view returns (uint256 voteCount) {
        return proposalVoteStructs[proposalId].addressVoteCount[userAddress];
    }

    /**
     * @dev Accessor to which addresses have cast a vote for a given proposal.
     */
    function proposalAddressesHaveVoted(uint256 proposalId) public view returns (address[] memory) {
        ProposalVote storage proposalVote = proposalVoteStructs[proposalId];
        return proposalVote.addressesVoted;
    }

    /**
     * @dev Accessor to how many votes an address has cast total for the contest so far.
     */
    function contestAddressTotalVotesCast(address userAddress) public view returns (uint256 userTotalVotesCast) {
        return addressTotalCastVoteCount[userAddress];
    }

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function allProposalTotalVotes()
        public
        view
        returns (uint256[] memory proposalIdsReturn, uint256[] memory proposalVoteCountsArrayReturn)
    {
        uint256[] memory proposalIdsMemVar = getAllProposalIds();
        uint256[] memory proposalVoteCountsArray = new uint256[](proposalIdsMemVar.length);
        for (uint256 i = 0; i < proposalIdsMemVar.length; i++) {
            proposalVoteCountsArray[i] = proposalVoteStructs[proposalIdsMemVar[i]].proposalVoteCount;
        }
        return (proposalIdsMemVar, proposalVoteCountsArray);
    }

    /**
     * @dev Get the whole array in `votesToProposalIds` for a given votes amount.
     */
    function getProposalsWithThisManyVotes(uint256 votes)
        public
        view
        returns (uint256[] memory proposalsWithThisManyVotes)
    {
        return votesToProposalIds[votes];
    }

    /**
     * @dev Get the number of proposals that have a given number of votes.
     */
    function getNumProposalsWithThisManyVotes(uint256 votes) public view override returns (uint256 count) {
        return votesToProposalIds[votes].length;
    }

    /**
     * @dev Get the only proposal id with this many votes.
     * NOTE: Should only get called at a point at which you are sure there is only one proposal id
     *       with a certain number of votes (we only use it in the RewardsModule after ties have
     *       been checked for).
     */
    function getOnlyProposalIdWithThisManyVotes(uint256 votes) public view returns (uint256 proposalId) {
        if (votesToProposalIds[votes].length != 1) revert MoreThanOneProposalWithThisManyVotes();
        return votesToProposalIds[votes][0];
    }

    /**
     * @dev Get the idx of sortedRanks considered to hold the queried rank taking deleted proposals into account.
     *      A rank has to have > 0 votes to be considered valid.
     */
    function getRankIndex(uint256 rank) public view returns (uint256 rankIndex) {
        if (rank == 0) revert RankCannotBeZero();

        uint256 sortedRanksLength = sortedRanks.length; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        uint256 counter = 1;
        for (uint256 index = 0; index < sortedRanksLength; index++) {
            // if this is a value of a deleted proposal or an ungarbage collected oldValue, go forwards without
            // incrementing the counter
            if (getNumProposalsWithThisManyVotes(sortedRanksMemVar[index]) == 0) {
                continue;
            }
            // if the counter is at the rank we are looking for, then return with it
            if (counter == rank) {
                return index;
            }
            counter++;
        }

        // if there's no valid index for that rank in sortedRanks, revert
        revert RankIsNotInSortedRanks();
    }

    /**
     * @dev Returns whether a given index in sortedRanks is tied or is below a tied rank.
     */
    function isOrIsBelowTiedRank(uint256 idx) public view returns (bool atOrBelowTiedRank) {
        if (idx > sortedRanks.length - 1) {
            // if `idx` hasn't been populated, then it's not a valid index to be checking and something is wrong
            revert IndexHasNotBeenPopulated();
        }

        for (uint256 index = 0; index < idx + 1; index++) {
            if (getNumProposalsWithThisManyVotes(sortedRanks[index]) > 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Remove this proposalId from the list of proposalIds that share its current votes
     *      value in votesToProposalIds.
     */
    function _rmProposalIdFromVotesMap(uint256 proposalId, uint256 votes) internal {
        uint256[] memory votesToPropIdMemVar = votesToProposalIds[votes]; // only check state var once to save on gas
        for (uint256 i = 0; i < votesToPropIdMemVar.length; i++) {
            if (votesToPropIdMemVar[i] == proposalId) {
                // swap with last item and pop bc we don't care about order.
                // makes things cleaner (than just deleting) and saves on gas if there end up being a ton of proposals that pass
                // through having a certain number of votes throughout the contest.
                votesToProposalIds[votes][i] = votesToPropIdMemVar[votesToPropIdMemVar.length - 1];
                votesToProposalIds[votes].pop();
                break;
            }
        }
    }

    /**
     * @dev See {Governor-_multiRmProposalIdFromForVotesMap}.
     */
    function _multiRmProposalIdFromVotesMap(uint256[] calldata proposalIdsToDelete) internal override {
        for (uint256 i = 0; i < proposalIdsToDelete.length; i++) {
            uint256 currentProposalId = proposalIdsToDelete[i];
            uint256 currentProposalsVotes = proposalVoteStructs[currentProposalId].proposalVoteCount;

            // remove this proposalId from the list of proposalIdsToDelete that share its current votes
            // value in votesToProposalIds
            _rmProposalIdFromVotesMap(currentProposalId, currentProposalsVotes);
        }
    }

    /**
     * @dev See {Governor-_countVote}.
     */
    function _countVote(uint256 proposalId, address account, uint256 numVotes, uint256 totalVotes) internal override {
        ProposalVote storage proposalVote = proposalVoteStructs[proposalId];

        if ((votingMerkleRoot != 0) && (numVotes > (totalVotes - addressTotalCastVoteCount[account]))) {
            revert NotEnoughVotesLeft();
        }

        bool firstTimeVoting = (proposalVote.addressVoteCount[account] == 0);

        proposalVote.proposalVoteCount += numVotes;
        proposalVote.addressVoteCount[account] += numVotes;

        if (firstTimeVoting) {
            proposalVote.addressesVoted.push(account);
        }
        addressTotalCastVoteCount[account] += numVotes;
        totalVotesCast += numVotes;

        // sorting and consequently rewards module compatibility is only available if downvoting is disabled and sorting enabled
        if (sortingEnabled == 1) {
            uint256 newVotes = proposalVote.proposalVoteCount; // only check state var once to save on gas
            uint256 oldVotes = newVotes - numVotes;

            // update map of forVotes => proposalId[] to be able to go from rank => proposalId.
            // if oldVotes is 0, then this proposal will not already be in this map, so we don't need to rm it
            if (oldVotes > 0) {
                _rmProposalIdFromVotesMap(proposalId, oldVotes);
            }
            votesToProposalIds[newVotes].push(proposalId);

            _updateRanks(oldVotes, newVotes);
        }
    }
}
