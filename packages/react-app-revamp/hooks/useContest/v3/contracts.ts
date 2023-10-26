export function getV3Contracts(contractConfig: any) {
  const contractFunctionNames = [
    "name",
    "creator",
    "numAllowedProposalSubmissions",
    "maxProposalCount",
    "contestStart",
    "contestDeadline",
    "voteStart",
    "state",
    "prompt",
    "downvotingAllowed",
    "costToPropose",
    "percentageToCreator",
  ];

  const contracts = contractFunctionNames.map(functionName => ({
    ...contractConfig,
    functionName,
  }));

  return contracts;
}
