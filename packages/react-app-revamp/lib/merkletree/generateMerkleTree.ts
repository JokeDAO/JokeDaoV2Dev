import { solidityPackedKeccak256 } from "ethers";
import MerkleTree from "merkletreejs";
import { getAddress, keccak256, parseUnits } from "viem";

export interface Recipient {
  address: string;
  numVotes: string;
}

export interface Proof {
  position: "left" | "right";
  data: Buffer;
}

export interface MerkleTreeData {
  merkleTree: MerkleTree;
  merkleRoot: string;
  recipients: Recipient[];
}

/**
 * Setup recipients
 * @param {number} decimals of votes
 * @param {Record<string, number>} votesData address to claim mapping
 * @returns {Recipient[]} array of recipients
 */
const setupVoteRecipients = (decimals: number, votesData: Record<string, number>): Recipient[] => {
  const recipients: Recipient[] = [];

  // For each entry
  for (const [address, votes] of Object.entries(votesData)) {
    recipients.push({
      address: getAddress(address),
      numVotes: parseUnits(votes.toString(), decimals).toString(),
    });
  }

  return recipients;
};

/**
 * Generate Merkle Tree leaf from address and numVotes
 * @param {string} address of recipient
 * @param {string} numVotes dedicated to the recipient
 * @returns {Buffer} Merkle Tree node
 */
const generateLeaf = (address: string, numVotes: string): Buffer => {
  const checksumAddress = getAddress(address);

  return Buffer.from(solidityPackedKeccak256(["address", "uint256"], [checksumAddress, numVotes]).slice(2), "hex");
};

/**
 * Generate Merkle Tree from  recipients
 * @param {Recipient[]} recipients array of recipients
 * @returns {MerkleTree} merkle tree
 */
export const createMerkleTree = (recipients: Recipient[]): MerkleTree => {
  return new MerkleTree(
    recipients.map(({ address, numVotes }) => generateLeaf(address, numVotes)),
    keccak256,
    { sortPairs: true },
  );
};

/**
 * Main processing function
 * @param {number} decimals of votes
 * @param {Record<string, number>} data address to claim mapping
 * @returns {Promise<void>}
 */
export const generateMerkleTree = (decimals: number, data: Record<string, number>): MerkleTreeData => {
  const recipients = setupVoteRecipients(decimals, data);
  const merkleTree = createMerkleTree(recipients);
  const merkleRoot: string = merkleTree.getHexRoot();

  return {
    merkleTree,
    merkleRoot,
    recipients,
  };
};

/**
 * Generate Merkle proof for a given address and number of votes
 * @param {MerkleTree} merkleTree The merkle tree instance
 * @param {string} address of recipient
 * @param {string} numVotes dedicated to the recipient
 * @returns {Proof[]} Array of objects containing a position property and a data property of type Buffer
 */
export const generateProof = (merkleTree: MerkleTree, address: string, numVotes: string): string[] => {
  const leaf = generateLeaf(address, parseUnits(numVotes, 18).toString());

  return merkleTree.getHexProof(leaf);
};
