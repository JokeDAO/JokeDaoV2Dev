// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@forge-std/Test.sol";
import "../src/Contest.sol";
import "../src/modules/RewardsModule.sol";

contract RewardsModuleTest is Test {
    // CONTEST VARS
    Contest public contest;
    uint64 public constant CONTEST_START = 1681650000;
    uint64 public constant VOTING_DELAY = 10000;
    uint64 public constant VOTING_PERIOD = 10000;
    uint64 public constant NUM_ALLOWED_PROPOSAL_SUBMISSIONS = 3;
    uint64 public constant MAX_PROPOSAL_COUNT = 100;
    uint64 public constant DOWNVOTING_ALLOWED = 0;
    uint256[] public numParams = [
        CONTEST_START,
        VOTING_DELAY,
        VOTING_PERIOD,
        NUM_ALLOWED_PROPOSAL_SUBMISSIONS,
        MAX_PROPOSAL_COUNT,
        DOWNVOTING_ALLOWED
    ];

    /*
        For this merkle tree:
        {
            "decimals": 18,
            "airdrop": {
                "0x016C8780e5ccB32E5CAA342a926794cE64d9C364": 10,
                "0x185a4dc360CE69bDCceE33b3784B0282f7961aea": 10
            }
        }
    */
    bytes32 public constant SUB_AND_VOTING_MERKLE_ROOT =
        bytes32(0x6bdfe79384e162c9368032b3ea1deaa851760ec8664c8b25238c21fe595ba271);
    address public constant CREATOR_ADDRESS_1 = 0xc109636a2b47f8b290cc134dd446Fcd7d7e0cC94;
    address public constant PERMISSIONED_ADDRESS_1 = 0x016C8780e5ccB32E5CAA342a926794cE64d9C364;
    address public constant PERMISSIONED_ADDRESS_2 = 0x185a4dc360CE69bDCceE33b3784B0282f7961aea;
    bytes32[] public proof1 = [bytes32(0x8ab0a9b9a7cf0c105eeef64b71dd45268e015022a66069f01086437c80c78a4c)];
    bytes32[] public proof2 = [bytes32(0xceeae64152a2deaf8c661fccd5645458ba20261b16d2f6e090fe908b0ac9ca88)];

    address[] public safeSigners = [address(0)];
    uint8 public constant SAFE_THRESHOLD = 1;

    IGovernor.ProposalCore public firstProposalPA1 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_1,
        description: "firstProposalPA1",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public secondProposalPA1 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_1,
        description: "secondProposalPA1",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public thirdProposalPA1 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_1,
        description: "thirdProposalPA1",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public firstProposalPA2 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_2,
        description: "firstProposalPA2",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_2}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });

    // REWARDS MODULE VARS
    RewardsModule public rewardsModulePaysTarget;
    RewardsModule public rewardsModulePaysAuthor;
    uint256[] public payees = [1, 2, 3];
    uint256[] public shares = [3, 2, 1];

    // SETUP

    function setUp() public {
        vm.startPrank(CREATOR_ADDRESS_1);

        contest = new Contest("test",
                              "hello world",
                              SUB_AND_VOTING_MERKLE_ROOT,
                              SUB_AND_VOTING_MERKLE_ROOT,
                              numParams);

        rewardsModulePaysTarget = new RewardsModule(payees,
                                          shares,
                                          GovernorSorting(contest),
                                          true);

        rewardsModulePaysAuthor = new RewardsModule(payees,
                                          shares,
                                          GovernorSorting(contest),
                                          false);

        vm.stopPrank();
    }

    // REWARDS

    // 1 proposal at 1 vote; release to author of rank 1
    function testReleaseToAuthorFirstPlace1() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, proof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10 ether, 1 ether, proof1);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        rewardsModulePaysAuthor.release(1);

        vm.stopPrank();

        assertEq(PERMISSIONED_ADDRESS_1.balance, 50);
    }

    // 1 proposal at 1 vote; release to target of rank 1
    function testReleaseToTargetFirstPlace1() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, proof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10 ether, 1 ether, proof1);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysTarget), 100); // give the rewards module wei to pay out
        rewardsModulePaysTarget.release(1);

        vm.stopPrank();

        assertEq(PERMISSIONED_ADDRESS_1.balance, 50);
    }

    // 2 proposals with different authors, at 1 and 5 votes; release to author of rank 1
    function testReleaseToAuthorFirstPlace2() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId1 = contest.propose(firstProposalPA1, proof1);
        vm.prank(PERMISSIONED_ADDRESS_2);
        uint256 proposalId2 = contest.propose(firstProposalPA2, proof2);
        vm.warp(1681660001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.castVote(proposalId1, 0, 10 ether, 1 ether, proof1);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.castVote(proposalId2, 0, 10 ether, 5 ether, proof1);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        rewardsModulePaysAuthor.release(1);

        assertEq(PERMISSIONED_ADDRESS_2.balance, 50);
    }

    // 2 proposals with different authors, at 1 and 5 votes; release to target of rank 1
    function testReleaseToTargetFirstPlace2() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId1 = contest.propose(firstProposalPA1, proof1);
        vm.prank(PERMISSIONED_ADDRESS_2);
        uint256 proposalId2 = contest.propose(firstProposalPA2, proof2);
        vm.warp(1681660001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.castVote(proposalId1, 0, 10 ether, 1 ether, proof1);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.castVote(proposalId2, 0, 10 ether, 5 ether, proof1);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysTarget), 100); // give the rewards module wei to pay out
        rewardsModulePaysTarget.release(1);

        assertEq(PERMISSIONED_ADDRESS_2.balance, 50);
    }

    // 2 proposals with different authors, both at 1 vote; send back to creator
    function testFirstPlaceTie() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId1 = contest.propose(firstProposalPA1, proof1);
        vm.prank(PERMISSIONED_ADDRESS_2);
        uint256 proposalId2 = contest.propose(firstProposalPA2, proof2);
        vm.warp(1681660001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.castVote(proposalId1, 0, 10 ether, 1 ether, proof1);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.castVote(proposalId2, 0, 10 ether, 1 ether, proof1);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        rewardsModulePaysAuthor.release(1);

        assertEq(CREATOR_ADDRESS_1.balance, 50);
    }

    // 2 proposals with different authors, both at 0 votes; send back to creator
    function testFirstPlaceTieWithZeroVotes() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.propose(firstProposalPA1, proof1);
        vm.prank(PERMISSIONED_ADDRESS_2);
        contest.propose(firstProposalPA2, proof2);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        rewardsModulePaysAuthor.release(1);

        assertEq(CREATOR_ADDRESS_1.balance, 50);
    }

    // 2 proposals with different authors, both at 0 votes; revert with error message
    function testFirstPlaceTieWithZeroProposals() public {
        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        vm.expectRevert(bytes("GovernorSorting: cannot sort a list of zero length"));
        rewardsModulePaysAuthor.release(1);
    }

    // 3 proposals from 2 different authors, 1 at 3 votes and 2 at 1 vote; send back to creator
    function testSecondPlaceTie() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId1 = contest.propose(firstProposalPA1, proof1);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId2 = contest.propose(secondProposalPA1, proof1);
        vm.prank(PERMISSIONED_ADDRESS_2);
        uint256 proposalId3 = contest.propose(firstProposalPA2, proof2);
        vm.warp(1681660001);
        vm.startPrank(PERMISSIONED_ADDRESS_1);
        contest.castVote(proposalId1, 0, 10 ether, 3 ether, proof1);
        contest.castVote(proposalId2, 0, 10 ether, 1 ether, proof1);
        contest.castVote(proposalId3, 0, 10 ether, 1 ether, proof1);
        vm.stopPrank();

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        rewardsModulePaysAuthor.release(2);

        assertEq(CREATOR_ADDRESS_1.balance, 33);
    }

    // 4 proposals from 2 different authors, 1 at 3 votes and 2 at 2 votes, and 1 at 1 vote; send back to creator
    function testSecondPlaceTiePayOutThirdPlace() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId1 = contest.propose(firstProposalPA1, proof1);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId2 = contest.propose(secondProposalPA1, proof1);
        vm.prank(PERMISSIONED_ADDRESS_2);
        uint256 proposalId3 = contest.propose(firstProposalPA2, proof2);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId4 = contest.propose(thirdProposalPA1, proof1);
        vm.warp(1681660001);
        vm.startPrank(PERMISSIONED_ADDRESS_1);
        contest.castVote(proposalId1, 0, 10 ether, 3 ether, proof1);
        contest.castVote(proposalId2, 0, 10 ether, 2 ether, proof1);
        contest.castVote(proposalId3, 0, 10 ether, 2 ether, proof1);
        contest.castVote(proposalId4, 0, 10 ether, 1 ether, proof1);
        vm.stopPrank();

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        rewardsModulePaysAuthor.release(3);

        assertEq(CREATOR_ADDRESS_1.balance, 16);
    }
}
