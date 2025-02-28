// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "@forge-std/Test.sol";
import "../src/Contest.sol";
import "../src/governance/Governor.sol";

contract ContestTest is Test {
    Contest public contest;
    Contest public anyoneCanSubmitContest;
    Contest public anyoneCanSubmitCostsAnEthContest;

    // BASIC INT PARAMS
    uint64 public constant CONTEST_START = 1681650000;
    uint64 public constant VOTING_DELAY = 10000;
    uint64 public constant VOTING_PERIOD = 10000;
    uint64 public constant NUM_ALLOWED_PROPOSAL_SUBMISSIONS = 3;
    uint64 public constant MAX_PROPOSAL_COUNT = 100;

    // COST PARAMS
    uint256 public constant FIFTY_PERCENT_TO_CREATOR = 50;
    uint256 public constant ZERO_COST_TO_PROPOSE = 0;
    uint256 public constant ONE_ETH_COST_TO_PROPOSE = 1 ether;
    uint256 public constant ZERO_COST_TO_VOTE = 0;
    uint256 public constant PAY_PER_VOTE_OFF = 0;
    address public constant CREATOR_SPLIT_DESTINATION = CREATOR_ADDRESS_1;
    address public constant JK_LABS_SPLIT_DESTINATION = JK_LABS_ADDRESS;

    // SORTING INT PARAMS
    uint256 public constant SORTING_ENABLED = 1;
    uint256 public constant RANK_LIMIT_250 = 250;

    // METADATA CONSTRUCTOR PARAMS
    string public constant METADATA_FIELDS_SCHEMA =
        "{\'Test Address Field\': \'address\', \'Test String Field\': \'string\', \'Test Uint Field\': \'uint256\'}";

    Governor.IntConstructorArgs public zeroCostIntConstructorArgs = Governor.IntConstructorArgs(
        CONTEST_START,
        VOTING_DELAY,
        VOTING_PERIOD,
        NUM_ALLOWED_PROPOSAL_SUBMISSIONS,
        MAX_PROPOSAL_COUNT,
        SORTING_ENABLED,
        RANK_LIMIT_250,
        FIFTY_PERCENT_TO_CREATOR,
        ZERO_COST_TO_PROPOSE,
        ZERO_COST_TO_VOTE,
        PAY_PER_VOTE_OFF
    );

    Governor.IntConstructorArgs public oneEthIntConstructorArgs = Governor.IntConstructorArgs(
        CONTEST_START,
        VOTING_DELAY,
        VOTING_PERIOD,
        NUM_ALLOWED_PROPOSAL_SUBMISSIONS,
        MAX_PROPOSAL_COUNT,
        SORTING_ENABLED,
        RANK_LIMIT_250,
        FIFTY_PERCENT_TO_CREATOR,
        ONE_ETH_COST_TO_PROPOSE,
        ZERO_COST_TO_VOTE,
        PAY_PER_VOTE_OFF
    );

    Governor.ConstructorArgs public zeroCostToProposeNumParams = Governor.ConstructorArgs(
        zeroCostIntConstructorArgs, CREATOR_SPLIT_DESTINATION, JK_LABS_SPLIT_DESTINATION, METADATA_FIELDS_SCHEMA
    );

    Governor.ConstructorArgs public oneEthToProposeNumParams = Governor.ConstructorArgs(
        oneEthIntConstructorArgs, CREATOR_SPLIT_DESTINATION, JK_LABS_SPLIT_DESTINATION, METADATA_FIELDS_SCHEMA
    );

    // MERKLE TREE PARAMS
    /*
        Voting merkle tree:
        {
            "decimals": 18,
            "airdrop": {
                "0xd698e31229aB86334924ed9DFfd096a71C686900": 10,
                "0x5b45e296C06ab3dAD836BCBc0fBd7a4b75b83C02": 100
            }
        }

        Submission merkle tree (both are value 10 because that's just the dummy value
        that we make proposal merkle trees have and check against for a simpler flow):
        {
            "decimals": 18,
            "airdrop": {
                "0xd698e31229aB86334924ed9DFfd096a71C686900": 10,
                "0x5b45e296C06ab3dAD836BCBc0fBd7a4b75b83C02": 10
            }
        }
    */
    bytes32 public constant VOTING_MERKLE_ROOT =
        bytes32(0xdb0fd5147843d56c8f32dd8b2ab5bfe04c1fe199d121790ff805fb0f0f7019c5);
    bytes32 public constant SUBMISSION_MERKLE_ROOT =
        bytes32(0x7665f9790e783f13b614dacf6e7624e755b188e1bb086d301855d73f9b81fa85);
    bytes32 public constant SUB_ZERO_MERKLE_ROOT =
        bytes32(0x0000000000000000000000000000000000000000000000000000000000000000);
    address public constant JK_LABS_ADDRESS = 0xDc652C746A8F85e18Ce632d97c6118e8a52fa738;
    address public constant CREATOR_ADDRESS_1 = 0xc109636a2b47f8b290cc134dd446Fcd7d7e0cC94;
    address public constant PERMISSIONED_ADDRESS_1 = 0xd698e31229aB86334924ed9DFfd096a71C686900;
    address public constant PERMISSIONED_ADDRESS_2 = 0x5b45e296C06ab3dAD836BCBc0fBd7a4b75b83C02;
    address public constant UNPERMISSIONED_ADDRESS_1 = 0x016C8780e5ccB32E5CAA342a926794cE64d9C364;
    bytes32[] public proof0 = [bytes32(0x0000000000000000000000000000000000000000000000000000000000000000)];
    bytes32[] public votingProof1 = [bytes32(0xf712e9f1bed1665ca7b426db8e09d438375a76fc5cf8052b6abae75233a117e7)];
    bytes32[] public votingProof2 = [bytes32(0x3704b461c09457df5491016097977d5364e607b59049ca6d36dfb9c16d03a2bf)];
    bytes32[] public submissionProof1 = [bytes32(0x3525e2aa1b921658191cfccf7e63bf6bcac64a0315ca9eb04f2bcc08975d431f)];
    bytes32[] public submissionProof2 = [bytes32(0x3704b461c09457df5491016097977d5364e607b59049ca6d36dfb9c16d03a2bf)];

    // METADATA PARAMS
    address[] public safeSigners = [address(0)];
    uint8 public constant SAFE_THRESHOLD = 1;
    address[] public METADATA_FIELDS_ADDRESS_ARRAY = [CREATOR_ADDRESS_1]; // placeholder value
    string[] public METADATA_FIELDS_STRING_ARRAY = [METADATA_FIELDS_SCHEMA]; // placeholder value
    uint256[] public METADATA_FIELDS_UINT_ARRAY = [SAFE_THRESHOLD]; // placeholder value

    // PROPOSALS PARAMS
    uint256[] public proposalsToDelete;

    Governor.ProposalCore public firstProposalPA1 = Governor.ProposalCore({
        author: PERMISSIONED_ADDRESS_1,
        description: "firstProposalPA1",
        exists: true,
        targetMetadata: Governor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: Governor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD}),
        fieldsMetadata: Governor.FieldsMetadata({
            addressArray: METADATA_FIELDS_ADDRESS_ARRAY,
            stringArray: METADATA_FIELDS_STRING_ARRAY,
            uintArray: METADATA_FIELDS_UINT_ARRAY
        })
    });
    Governor.ProposalCore public secondProposalPA1 = Governor.ProposalCore({
        author: PERMISSIONED_ADDRESS_1,
        description: "secondProposalPA1",
        exists: true,
        targetMetadata: Governor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_2}),
        safeMetadata: Governor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD}),
        fieldsMetadata: Governor.FieldsMetadata({
            addressArray: METADATA_FIELDS_ADDRESS_ARRAY,
            stringArray: METADATA_FIELDS_STRING_ARRAY,
            uintArray: METADATA_FIELDS_UINT_ARRAY
        })
    });
    Governor.ProposalCore public firstProposalPA2 = Governor.ProposalCore({
        author: PERMISSIONED_ADDRESS_2,
        description: "firstProposalPA2",
        exists: true,
        targetMetadata: Governor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_2}),
        safeMetadata: Governor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD}),
        fieldsMetadata: Governor.FieldsMetadata({
            addressArray: METADATA_FIELDS_ADDRESS_ARRAY,
            stringArray: METADATA_FIELDS_STRING_ARRAY,
            uintArray: METADATA_FIELDS_UINT_ARRAY
        })
    });
    Governor.ProposalCore public unpermissionedAuthorProposal1 = Governor.ProposalCore({
        author: UNPERMISSIONED_ADDRESS_1,
        description: "unpermissionedAuthorProposal1",
        exists: true,
        targetMetadata: Governor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: Governor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD}),
        fieldsMetadata: Governor.FieldsMetadata({
            addressArray: METADATA_FIELDS_ADDRESS_ARRAY,
            stringArray: METADATA_FIELDS_STRING_ARRAY,
            uintArray: METADATA_FIELDS_UINT_ARRAY
        })
    });

    /////////////////////////////

    // SETUP

    function setUp() public {
        vm.startPrank(CREATOR_ADDRESS_1);

        contest =
            new Contest("test", "hello world", SUBMISSION_MERKLE_ROOT, VOTING_MERKLE_ROOT, zeroCostToProposeNumParams);

        anyoneCanSubmitContest =
            new Contest("test", "hello world", SUB_ZERO_MERKLE_ROOT, VOTING_MERKLE_ROOT, zeroCostToProposeNumParams);

        anyoneCanSubmitCostsAnEthContest =
            new Contest("test", "hello world", SUB_ZERO_MERKLE_ROOT, VOTING_MERKLE_ROOT, oneEthToProposeNumParams);

        vm.stopPrank();
    }

    /////////////////////////////

    // GOVERNOR SETTINGS

    function testContestStart() public view {
        assertEq(contest.contestStart(), CONTEST_START);
    }

    function testVotingDelay() public view {
        assertEq(contest.votingDelay(), VOTING_DELAY);
    }

    function testVotingPeriod() public view {
        assertEq(contest.votingPeriod(), VOTING_PERIOD);
    }

    function testNumAllowedProposalSubmissions() public view {
        assertEq(contest.numAllowedProposalSubmissions(), NUM_ALLOWED_PROPOSAL_SUBMISSIONS);
    }

    function testMaxProposalCount() public view {
        assertEq(contest.maxProposalCount(), MAX_PROPOSAL_COUNT);
    }

    function testCreator() public view {
        assertEq(contest.creator(), CREATOR_ADDRESS_1);
    }

    /////////////////////////////

    // PROPOSING

    function testValidate() public {
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.validateProposalData(firstProposalPA1);
    }

    function testPropose() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);

        assertEq(proposalId, 113012308618275462188231871773661406017840369232388967339979650418749335396171);
    }

    function testProposeAnyone() public {
        vm.warp(1681650001);
        vm.prank(UNPERMISSIONED_ADDRESS_1);
        uint256 proposalId = anyoneCanSubmitContest.propose(unpermissionedAuthorProposal1, proof0);

        assertEq(proposalId, 115165251560031427429607767944389537131137037929814060832786039738764740468274);
    }

    function testProposeWithoutProof() public {
        vm.warp(1681650001);
        vm.startPrank(PERMISSIONED_ADDRESS_1);
        uint256 firstProposalId = contest.propose(firstProposalPA1, submissionProof1);
        uint256 secondProposalId = contest.proposeWithoutProof(secondProposalPA1);
        vm.stopPrank();

        assertEq(firstProposalId, 113012308618275462188231871773661406017840369232388967339979650418749335396171);
        assertEq(secondProposalId, 100550081537902060961196880423907903647012929095765413382065790941904788206777);
    }

    function testProposeAnyoneWithoutProof() public {
        vm.warp(1681650001);
        vm.prank(UNPERMISSIONED_ADDRESS_1);
        uint256 proposalId = anyoneCanSubmitContest.proposeWithoutProof(unpermissionedAuthorProposal1);

        assertEq(proposalId, 115165251560031427429607767944389537131137037929814060832786039738764740468274);
    }

    function testProposeAuthorIsntSender() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        vm.expectRevert(
            abi.encodeWithSelector(
                Governor.AuthorIsNotSender.selector, unpermissionedAuthorProposal1.author, PERMISSIONED_ADDRESS_1
            )
        );
        contest.propose(unpermissionedAuthorProposal1, submissionProof1);
    }

    function testProposeWithoutProofAuthorIsntSender() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.propose(firstProposalPA1, submissionProof1);
        vm.prank(PERMISSIONED_ADDRESS_1);
        vm.expectRevert(
            abi.encodeWithSelector(
                Governor.AuthorIsNotSender.selector, unpermissionedAuthorProposal1.author, PERMISSIONED_ADDRESS_1
            )
        );
        contest.proposeWithoutProof(unpermissionedAuthorProposal1);
    }

    function testProposeDuplicateProposal() public {
        vm.warp(1681650001);
        vm.startPrank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.expectRevert(abi.encodeWithSelector(Governor.DuplicateSubmission.selector, proposalId));
        contest.propose(firstProposalPA1, submissionProof1);
        vm.stopPrank();
    }

    function testDeleteProposal() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);

        proposalsToDelete.push(proposalId);
        vm.prank(CREATOR_ADDRESS_1);
        contest.deleteProposals(proposalsToDelete);
        assertEq(contest.proposalIsDeleted(proposalId), true);
    }

    function testProposeAnyoneCanCostIsOneEther() public {
        vm.warp(1681650001);
        vm.deal(address(UNPERMISSIONED_ADDRESS_1), 1 ether); // give the proposer wei to pay the cost to propose
        vm.prank(UNPERMISSIONED_ADDRESS_1);
        uint256 proposalId =
            anyoneCanSubmitCostsAnEthContest.propose{value: 1 ether}(unpermissionedAuthorProposal1, proof0);

        assertEq(proposalId, 115165251560031427429607767944389537131137037929814060832786039738764740468274);
        assertEq(CREATOR_ADDRESS_1.balance, 0.5 ether);
        assertEq(JK_LABS_ADDRESS.balance, 0.5 ether);
    }

    function testProposeAnyoneCanCostIsOneEtherNoMsgValue() public {
        vm.warp(1681650001);
        vm.prank(UNPERMISSIONED_ADDRESS_1);
        vm.expectRevert(abi.encodeWithSelector(Governor.IncorrectCostSent.selector, 0, 1 ether));
        anyoneCanSubmitCostsAnEthContest.propose(unpermissionedAuthorProposal1, proof0);
    }

    function testProposeAnyoneCanCostIsOneEtherTooMuchMsgValue() public {
        vm.warp(1681650001);
        vm.deal(address(UNPERMISSIONED_ADDRESS_1), 2 ether); // give the proposer wei to pay the cost to propose
        vm.prank(UNPERMISSIONED_ADDRESS_1);
        vm.expectRevert(abi.encodeWithSelector(Governor.IncorrectCostSent.selector, 2 ether, 1 ether));
        anyoneCanSubmitCostsAnEthContest.propose{value: 2 ether}(unpermissionedAuthorProposal1, proof0);
    }

    // VOTING

    function testVote1() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        uint256 totalVotes = contest.castVote(proposalId, 10 ether, 1 ether, votingProof1);

        vm.stopPrank();

        assertEq(totalVotes, 10 ether);
    }

    function testVote2() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        vm.prank(PERMISSIONED_ADDRESS_2);
        uint256 totalVotes = contest.castVote(proposalId, 100 ether, 1 ether, votingProof2);

        assertEq(totalVotes, 100 ether);
    }

    function testVoteWithoutProof() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 10 ether, 1 ether, votingProof1);
        uint256 totalVotesWithoutProof = contest.castVoteWithoutProof(proposalId, 1 ether);

        vm.stopPrank();

        assertEq(totalVotesWithoutProof, 10 ether);
    }

    /////////////////////////////
}
