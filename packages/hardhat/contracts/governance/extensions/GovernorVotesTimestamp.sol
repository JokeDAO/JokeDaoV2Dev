// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (governance/extensions/GovernorVotes.sol)

pragma solidity ^0.8.0;

import "../Governor.sol";
import "../utils/IVotesTimestamp.sol";

/**
 * @dev Extension of {Governor} for voting weight extraction from an {ERC20Votes} token, or since v4.5 an {ERC721Votes} token.
 *
 * _Available since v4.3._
 */
abstract contract GovernorVotesTimestamp is Governor {
    IVotesTimestamp public immutable token;
    IVotesTimestamp public immutable submissionToken;

    constructor(IVotesTimestamp tokenAddress, IVotesTimestamp submissionTokenAddress) {
        token = tokenAddress;
        submissionToken = submissionTokenAddress;
    }

    /**
     * Read the voting weight from the token's built in snapshot mechanism (see {IGovernor-getVotes}).
     */
    function getVotes(address account, uint256 timestamp) public view virtual override returns (uint256) {
        return token.getPastVotes(account, timestamp);
    }

    /**
     * Read the voting weight from the token's built in snapshot mechanism (see {IGovernor-getCurrentVotes}).
     */
    function getCurrentVotes(address account) public view virtual override returns (uint256) {
        return token.getVotes(account);
    }

    /**
     * Read the voting weight from the token's built in snapshot mechanism (see {IGovernor-getCurrentVotes}).
     */
    function getCurrentSubmissionTokenVotes(address account) public view virtual override returns (uint256) {
        return submissionToken.getVotes(account);
    }
}
