import { getAddress } from "ethers";

const MAX_VOTES = 1e9; // 1 billion

export const validateVotingFields = (
  address: string,
  votes: string,
): "address" | "votes" | "both" | "exceededLimit" | null => {
  // If both address and votes are empty, consider it as a valid case
  if (address === "" && votes === "") {
    return null;
  }
  let error: "address" | "votes" | "both" | "exceededLimit" | null = null;

  if (address.trim() === "") {
    error = "address";
  }

  try {
    getAddress(address);
  } catch (e) {
    error = "address";
  }

  if (votes.trim() === "" || Number(votes) <= 0 || isNaN(Number(votes))) {
    error = error ? "both" : "votes";
  }

  // check for more than 4 decimal places
  const decimalPart = votes.split(".")[1];
  if (decimalPart && decimalPart.length > 4) {
    error = "exceededLimit";
  }

  // check for more than 1 billion votes
  if (Number(votes) > MAX_VOTES) {
    error = "exceededLimit";
  }

  return error;
};

export const validateSubmissionFields = (address: string): boolean => {
  if (address === "") {
    return true;
  }

  try {
    getAddress(address);
    return false;
  } catch (e) {
    return true;
  }
};
