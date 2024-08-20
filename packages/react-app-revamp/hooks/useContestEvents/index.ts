import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { getEthersProvider } from "@helpers/ethers";
import { extractPathSegments } from "@helpers/extractPath";
import isUrlToImage from "@helpers/isUrlToImage";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import { readContract, watchContractEvent } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { formatEther } from "viem";

export function useContestEvents() {
  const asPath = usePathname();
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.find(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.id;
  const provider = getEthersProvider(config, { chainId });
  const { canUpdateVotesInRealTime } = useContestStore(state => state);
  const { retry: refetchTotalVotesCastOnContest } = useTotalVotesCastOnContest(contestAddress, chainId ?? 1);
  const { contestStatus } = useContestStatusStore(state => state);
  const { updateProposal } = useProposal();
  const { setProposalData, listProposalsData } = useProposalStore(state => state);
  const [displayReloadBanner, setDisplayReloadBanner] = useState(false);
  const contestStatusRef = useRef(contestStatus);
  const listProposalsDataRef = useRef(listProposalsData);

  useEffect(() => {
    listProposalsDataRef.current = listProposalsData;
  }, [listProposalsData]);

  useEffect(() => {
    contestStatusRef.current = contestStatus;
  }, [contestStatus]);

  const onVoteCast = useCallback(
    async (args: Array<any>) => {
      try {
        const proposalId = args[0].args.proposalId.toString();

        const votesRaw = (await readContract(config, {
          address: contestAddress as `0x${string}`,
          abi: DeployedContestContract.abi,
          functionName: "proposalVotes",
          args: [proposalId],
        })) as bigint[];

        const [forVotesBigInt, againstVotesBigInt] = votesRaw;
        const finalVotes = forVotesBigInt - againstVotesBigInt;
        const votes = Number(formatEther(finalVotes));

        const proposal = listProposalsDataRef.current.find(p => p.id === proposalId);

        if (proposal) {
          updateProposal(
            {
              ...proposal,
              netVotes: votes,
            },
            listProposalsDataRef.current,
          );
        } else {
          const newProposal = (await readContract(config, {
            address: contestAddress as `0x${string}`,
            abi: DeployedContestContract.abi,
            functionName: "getProposal",
            args: [proposalId],
          })) as any;

          const proposalData: any = {
            id: proposalId,
            authorEthereumAddress: newProposal.author,
            content: newProposal.description,
            isContentImage: isUrlToImage(newProposal.description) ? true : false,
            exists: newProposal.exists,
            votes,
          };

          setProposalData(proposalData);
        }

        refetchTotalVotesCastOnContest();
      } catch (e) {
        console.error("Error in onVoteCast:", e);
      }
    },
    [contestAddress, refetchTotalVotesCastOnContest, setProposalData, updateProposal],
  );

  const removeListeners = useCallback(
    async (event?: string) => {
      if (provider && typeof provider.removeAllListeners === "function") {
        try {
          await provider.removeAllListeners(event);
        } catch (error) {
          console.warn(`Error removing listeners: ${error}`);
        }
      } else {
        console.warn("Unable to remove listeners: provider not available or method not found");
      }
    },
    [provider],
  );

  const addVoteCastListener = useCallback(async () => {
    if (provider && typeof provider.on === "function") {
      try {
        await provider.on("VoteCast", onVoteCast);
      } catch (error) {
        console.error("Error adding VoteCast listener:", error);
      }
    } else {
      console.warn("Unable to add VoteCast listener: provider not available or method not found");
    }
  }, [provider, onVoteCast]);

  useEffect(() => {
    const shouldAddListener = canUpdateVotesInRealTime && contestStatus === ContestStatus.VotingOpen;

    if (shouldAddListener) {
      watchContractEvent(config, {
        address: contestAddress as `0x${string}`,
        abi: DeployedContestContract.abi,
        eventName: "VoteCast",
        onLogs: onVoteCast,
      });
    } else {
      removeListeners("VoteCast");
      setDisplayReloadBanner(false);
    }

    return () => {
      removeListeners("VoteCast");
    };
  }, [contestStatus, canUpdateVotesInRealTime, contestAddress, onVoteCast, removeListeners]);

  const onVisibilityChangeHandler = useCallback(() => {
    if (document.visibilityState === "hidden") {
      removeListeners();
      if (contestStatusRef.current === ContestStatus.VotingOpen && canUpdateVotesInRealTime) {
        setDisplayReloadBanner(true);
      }
    } else {
      if (contestStatusRef.current === ContestStatus.VotingOpen && canUpdateVotesInRealTime) {
        addVoteCastListener();
      }
    }
  }, [removeListeners, canUpdateVotesInRealTime, addVoteCastListener]);

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChangeHandler);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChangeHandler);
    };
  }, [onVisibilityChangeHandler]);

  return {
    displayReloadBanner,
  };
}

export default useContestEvents;
