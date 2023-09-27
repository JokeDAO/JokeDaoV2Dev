// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Logic for sorting and ranking.
 *
 * _Available since v4.3._
 */
abstract contract GovernorSorting {
    uint256 public constant RANK_LIMIT = 25; // cannot be 0

    uint256[] public sortedRanks = new uint256[](RANK_LIMIT); // value is forVotes counts
    uint256 public smallestNonZeroSortedRanksValueIdx = 0; // the index of the smallest non-zero value in sortedRanks, useful to finding where sortedRanks has been populated to

    /**
     * @dev Get the number of proposals that have `forVotes` number of for votes.
     */
    function getNumProposalsWithThisManyForVotes(uint256 forVotes) public view virtual returns (uint256 count);

    // get the idx of sortedRanks considered to hold the queried rank taking deleted proposals into account
    // a rank has to have > 0 votes to be considered valid
    function getRankIndex(uint256 rank) public view returns (uint256 rankIndex) {
        uint256 smallestIdxMemVar = smallestNonZeroSortedRanksValueIdx; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        require(rank != 0, "GovernorSorting: rank cannot equal 0");
        uint256 counter = 1;
        for (uint256 index = 0; index < smallestIdxMemVar + 1; index++) {
            // if this is a deleted proposal, go forwards without incrementing the counter
            if (getNumProposalsWithThisManyForVotes(sortedRanksMemVar[index]) == 0) {
                continue;
            }
            // if the counter is at the rank we are looking for, then return with it
            if (counter == rank) {
                return index;
            }
            counter++;
        }

        // if there's no valid index for that rank in sortedRanks, revert
        // (how you would get here is it you deleted the top 25 voted proposals with a RANK_LIMIT of 25
        // and then tried to pay out rank 1, or any rank for that matter; or just don't have enough proposals with forVotes on them
        // to get to this rank)
        revert(
            "GovernorSorting: this rank does not exist or is out of the allowed rank tracking range taking deleted proposals into account"
        );
    }

    // returns whether a given index in sortedRanks is tied or is below a tied rank
    function isOrIsBelowTiedRank(uint256 idx) public view returns (bool atOrBelowTiedRank) {
        if (idx > smallestNonZeroSortedRanksValueIdx) {
            // if `idx` hasn't been populated, then it's not a valid index to be checking and something is wrong
            revert("GovernorSorting: this index or one above it has not been populated");
        }

        for (uint256 index = 0; index < idx + 1; index++) {
            if (getNumProposalsWithThisManyForVotes(index) > 1) {
                return true;
            }
        }
        return false;
    }

    // insert a new value into sortedRanks at insertingIndex
    // this is only called when we've already checked that insertingIndex isn't tied and is before smallestNonZeroSortedRanksValueIdx
    function _insertRank(uint256 newValue, uint256 insertingIndex) internal {
        uint256 smallestIdxMemVar = smallestNonZeroSortedRanksValueIdx; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        // if smallestNonZeroSortedRanksValueIdx is at the highest possible index due to the limit already, then we want to drop the value currently there off of the array in shifting. if not then we'll just shift the value there into the next index.
        uint256 maxIdxOfShiftedArray = smallestIdxMemVar + 1 == RANK_LIMIT ? smallestIdxMemVar : smallestIdxMemVar + 1;

        // go through and shift the value of `insertingIndex` and everything under it down one in sortedRanks
        uint256 tmp1 = sortedRanksMemVar[insertingIndex];
        uint256 tmp2;
        for (uint256 index = insertingIndex + 1; index < maxIdxOfShiftedArray + 1; index++) {
            tmp2 = sortedRanksMemVar[index];
            sortedRanks[index] = tmp1;
            tmp1 = tmp2;
        }

        // now that everything's been swapped out and sortedRanks[insertingIndex] == sortedRanks[insertingIndex + 1], let's correctly set sortedRanks[insertingIndex]
        sortedRanks[insertingIndex] = newValue;

        // if smallestNonZeroSortedRanksValueIdx isn't already at the limit, bump it one
        if (smallestIdxMemVar + 1 != RANK_LIMIT) {
            smallestNonZeroSortedRanksValueIdx++;
        }
    }

    // keep things sorted as we go
    // only works for no downvoting bc dealing w what happens when something leaves the top ranks and needs to be *replaced* is an issue that necessitates the sorting of all the others, which we don't want to do bc gas
    function _updateRanks(uint256 newProposalForVotes) internal {
        uint256 smallestIdxMemVar = smallestNonZeroSortedRanksValueIdx; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        // 1. is it after smallestNonZeroSortedRanksValueIdx?
        // is the current proposal's forVotes less than that of the currently lowest value element in the sorted
        // array? if so, just insert it after it. if that index would be RANK_LIMIT, then we're done.
        if (newProposalForVotes < sortedRanksMemVar[smallestIdxMemVar]) {
            if (smallestIdxMemVar + 1 == RANK_LIMIT) {
                // if we've reached the size limit of sortedRanks, then we're done here
                return;
            } else {
                // otherwise, put this value in the index after the current smallest value and increment
                // smallestNonZeroSortedRanksValueIdx to reflect the updated state
                sortedRanks[smallestIdxMemVar] = newProposalForVotes;
                smallestNonZeroSortedRanksValueIdx++;
                return;
            }
        }

        // 2. if not, then find where it should go at or before smallestNonZeroSortedRanksValueIdx
        // find the index that newProposalForVotes is larger than or equal to.
        // working right to left starting at smallestNonZeroSortedRanksValueIdx.
        uint256 indexToInsertAt;
        for (uint256 index = 0; index < smallestIdxMemVar + 1; index++) {
            uint256 valueToCheck = sortedRanksMemVar[smallestIdxMemVar - index];

            // in the case of a tie, there's nothing more to do
            if (newProposalForVotes == valueToCheck) {
                return;
            }

            if (newProposalForVotes > valueToCheck) {
                // then this is the index that the new value should be inserted at
                indexToInsertAt = smallestIdxMemVar - index;
                break;
            }
        }

        // 3. insert it there, pushing everything behind it down
        _insertRank(newProposalForVotes, indexToInsertAt);
    }
}
