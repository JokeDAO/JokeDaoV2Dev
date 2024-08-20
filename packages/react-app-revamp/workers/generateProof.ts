import { parseUnits } from "ethers";
import { createMerkleTree, generateProof, Recipient } from "lib/merkletree/generateMerkleTree";

interface MerkleTreeProofPayload {
  data: Recipient[];
  address: string;
  numVotes: string;
}

self.onmessage = (event: MessageEvent<MerkleTreeProofPayload>) => {
  const { address, numVotes, data } = event.data;

  const convertedRecipients = data.map(vote => ({
    ...vote,
    numVotes: parseUnits(vote.numVotes, 18).toString(),
  }));

  const merkleTree = createMerkleTree(convertedRecipients);

  const proofs = generateProof(merkleTree, address, numVotes);

  postMessage({ proofs });
};
