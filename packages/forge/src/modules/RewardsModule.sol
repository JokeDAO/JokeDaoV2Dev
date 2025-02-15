// SPDX-License-Identifier: AGPL-3.0-only
// Forked from OpenZeppelin Contracts (v4.7.0) (finance/PaymentSplitter.sol)
pragma solidity ^0.8.19;

import "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/utils/Address.sol";
import "../governance/extensions/GovernorCountingSimple.sol";

/**
 * @title RewardsModule
 * @dev This contract allows to split Ether payments among a group of accounts. The sender does not need to be aware
 * that the Ether will be split in this way, since it is handled transparently by the contract.
 *
 * The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each
 * account to a number of shares. Of all the Ether that this contract receives, each account will then be able to claim
 * an amount proportional to the percentage of total shares they were assigned. The distribution of shares is set at the
 * time of contract deployment and can't be updated thereafter.
 *
 * `RewardsModule` follows a _pull payment_ model. This means that payments are not automatically forwarded to the
 * accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release}
 * function.
 *
 * NOTE: This contract assumes that ERC20 tokens will behave similarly to native tokens (Ether). Rebasing tokens, and
 * tokens that apply fees during transfers, are likely to not be supported as expected. If in doubt, we encourage you
 * to run tests before sending real value to this contract.
 */
contract RewardsModule {
    event PayeeAdded(uint256 ranking, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event ERC20PaymentReleased(IERC20 indexed token, address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);
    event RewardWithdrawn(address by, uint256 amount);
    event ERC20RewardWithdrawn(IERC20 indexed token, address by, uint256 amount);

    uint256 public totalShares;
    uint256 public totalReleased;

    mapping(uint256 => uint256) public shares; // Getter for the amount of shares held by a ranking.
    mapping(uint256 => uint256) public released; // Getter for the amount of Ether already released to a ranking.
    uint256[] public payees;
    string private constant VERSION = "5.1"; // Private as to not clutter the ABI

    mapping(IERC20 => uint256) public erc20TotalReleased;
    mapping(IERC20 => mapping(uint256 => uint256)) public erc20Released;

    GovernorCountingSimple public underlyingContest;
    address public creator;
    bool public paysOutTarget; // If true, pay out target address; if false, pay out proposal author.
    bool public canceled; // A rewards module must be canceled in order to withdraw funds, and once canceled it can no longer release funds, only withdraw

    error PayeesSharesLengthMismatch();
    error MustHaveAtLeastOnePayee();
    error TotalSharesCannotBeZero();
    error MustHaveSortingEnabled();
    error ContestMustBeCompleted();
    error PayoutRankCannotBeZero();
    error RankingHasNoShares();
    error AccountNotDueNativePayment();
    error CannotPayOutToZeroAddress();
    error AccountNotDueERC20Payment();
    error OnlyCreatorCanWithdraw();
    error RankingCannotBeZero();
    error SharesCannotBeZero();
    error AccountAlreadyHasShares();
    error CannotReleaseCanceledModule();
    error MustBeCanceledToWithdraw();

    /**
     * @dev Creates an instance of `RewardsModule` where each ranking in `payees` is assigned the number of shares at
     * the matching position in the `shares` array.
     *
     * All rankings in `payees` must be non-zero. Both arrays must have the same non-zero length, and there must be no
     * duplicates in `payees`.
     */
    constructor(
        uint256[] memory payees_,
        uint256[] memory shares_,
        GovernorCountingSimple underlyingContest_,
        bool paysOutTarget_
    ) payable {
        if (payees_.length != shares_.length) revert PayeesSharesLengthMismatch();
        if (payees_.length == 0) revert MustHaveAtLeastOnePayee();

        for (uint256 i = 0; i < payees_.length; i++) {
            _addPayee(payees_[i], shares_[i]);
        }

        if (totalShares == 0) revert TotalSharesCannotBeZero();

        paysOutTarget = paysOutTarget_;
        underlyingContest = underlyingContest_;
        creator = msg.sender;
    }

    /**
     * @dev The Ether received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Ether without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Ether.
     */
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @dev Version of the rewards module.
     */
    function version() public pure returns (string memory) {
        return VERSION;
    }

    /**
     * @dev Getter for list of rankings that will be paid out.
     */
    function getPayees() public view returns (uint256[] memory) {
        return payees;
    }

    /**
     * @dev Getter for the underlying contest.
     */
    function getUnderlyingContest() public view returns (GovernorCountingSimple) {
        return underlyingContest;
    }

    /**
     * @dev Getter for the amount of payee's releasable Ether.
     */
    function releasable(uint256 ranking) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + totalReleased;
        return _pendingPayment(ranking, totalReceived, released[ranking]);
    }

    /**
     * @dev Getter for the amount of payee's releasable `token` tokens. `token` should be the address of an
     * IERC20 contract.
     */
    function releasable(IERC20 token, uint256 ranking) public view returns (uint256) {
        uint256 totalReceived = token.balanceOf(address(this)) + erc20TotalReleased[token];
        return _pendingPayment(ranking, totalReceived, erc20Released[token][ranking]);
    }

    /**
     * @dev Run release checks.
     */
    function runReleaseChecks(uint256 ranking) public view {
        if (underlyingContest.sortingEnabled() != 1) revert MustHaveSortingEnabled();
        if (underlyingContest.state() != Governor.ContestState.Completed) revert ContestMustBeCompleted();
        if (ranking == 0) revert PayoutRankCannotBeZero();
        if (shares[ranking] == 0) revert RankingHasNoShares();
        if (canceled == true) revert CannotReleaseCanceledModule();
    }

    /**
     * @dev Return address to pay out for a given ranking.
     */
    function getAddressToPayOut(uint256 ranking) public view returns (address) {
        address addressToPayOut;
        uint256 determinedRankingIdxInSortedRanks = underlyingContest.getRankIndex(ranking);

        // if the ranking that we land on is tied or it's below a tied ranking, send to creator
        if (underlyingContest.isOrIsBelowTiedRank(determinedRankingIdxInSortedRanks)) {
            addressToPayOut = creator;
        }
        // otherwise, determine proposal at ranking and pay out according to that
        else {
            uint256 rankValue = underlyingContest.sortedRanks(determinedRankingIdxInSortedRanks);
            Governor.ProposalCore memory rankingProposal = underlyingContest.getProposal(
                underlyingContest.getOnlyProposalIdWithThisManyVotes(rankValue) // if no ties there should only be one
            );
            addressToPayOut = paysOutTarget ? rankingProposal.targetMetadata.targetAddress : rankingProposal.author;
        }

        return addressToPayOut;
    }

    /**
     * @dev Cancels the rewards module.
     */
    function cancel() public {
        canceled = true;
    }

    /**
     * @dev Triggers a transfer to `ranking` of the amount of Ether they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */
    function release(uint256 ranking) public {
        runReleaseChecks(ranking);

        uint256 payment = releasable(ranking);

        if (payment == 0) revert AccountNotDueNativePayment();

        // totalReleased is the sum of all values in released.
        // If "totalReleased += payment" does not overflow, then "released[account] += payment" cannot overflow.
        totalReleased += payment;
        unchecked {
            released[ranking] += payment;
        }

        address payable addressToPayOut = payable(getAddressToPayOut(ranking));

        if (addressToPayOut == address(0)) revert CannotPayOutToZeroAddress();

        emit PaymentReleased(addressToPayOut, payment);
        Address.sendValue(addressToPayOut, payment);
    }

    /**
     * @dev Triggers a transfer to `ranking` of the amount of `token` tokens they are owed, according to their
     * percentage of the total shares and their previous withdrawals. `token` must be the address of an IERC20
     * contract.
     */
    function release(IERC20 token, uint256 ranking) public {
        runReleaseChecks(ranking);

        uint256 payment = releasable(token, ranking);

        if (payment == 0) revert AccountNotDueERC20Payment();

        // erc20TotalReleased[token] is the sum of all values in erc20Released[token].
        // If "erc20TotalReleased[token] += payment" does not overflow, then "erc20Released[token][account] += payment" cannot overflow.
        erc20TotalReleased[token] += payment;
        unchecked {
            erc20Released[token][ranking] += payment;
        }

        address payable addressToPayOut = payable(getAddressToPayOut(ranking));

        if (addressToPayOut == address(0)) revert CannotPayOutToZeroAddress();

        emit ERC20PaymentReleased(token, addressToPayOut, payment);
        SafeERC20.safeTransfer(token, addressToPayOut, payment);
    }

    function withdrawRewards() public {
        if (msg.sender != creator) revert OnlyCreatorCanWithdraw();
        if (canceled != true) revert MustBeCanceledToWithdraw();

        emit RewardWithdrawn(creator, address(this).balance);
        Address.sendValue(payable(creator), address(this).balance);
    }

    function withdrawRewards(IERC20 token) public {
        if (msg.sender != creator) revert OnlyCreatorCanWithdraw();

        emit ERC20RewardWithdrawn(token, creator, token.balanceOf(address(this)));
        SafeERC20.safeTransfer(token, payable(creator), token.balanceOf(address(this)));
    }

    /**
     * @dev internal logic for computing the pending payment of a `ranking` given the token historical balances and
     * already released amounts.
     */
    function _pendingPayment(uint256 ranking, uint256 totalReceived, uint256 alreadyReleased)
        private
        view
        returns (uint256)
    {
        return (totalReceived * shares[ranking]) / totalShares - alreadyReleased;
    }

    /**
     * @dev Add a new payee to the contract.
     * @param ranking The ranking of the payee to add.
     * @param shares_ The number of shares owned by the payee.
     */
    function _addPayee(uint256 ranking, uint256 shares_) private {
        if (ranking == 0) revert RankingCannotBeZero();
        if (shares_ == 0) revert SharesCannotBeZero();
        if (shares[ranking] != 0) revert AccountAlreadyHasShares();

        payees.push(ranking);
        shares[ranking] = shares_;
        totalShares = totalShares + shares_;
        emit PayeeAdded(ranking, shares_);
    }
}
