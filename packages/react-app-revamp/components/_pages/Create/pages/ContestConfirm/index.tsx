import EthereumDeploymentModal from "@components/UI/Deployment/Ethereum";
import { useDeployContest } from "@hooks/useDeployContest";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { fetchChargeDetails } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { steps } from "../..";
import CreateContestButton from "../../components/Buttons/Submit";
import StepCircle from "../../components/StepCircle";
import { VOTING_STEP } from "../ContestParams";
import CreateContestConfirmAllowlists from "./components/Allowlists";
import CreateContestConfirmCustomization from "./components/Customization";
import CreateContestConfirmDescription from "./components/Description";
import CreateContestConfirmMonetization from "./components/Monetization";
import CreatContestConfirmSummary from "./components/Summary";
import CreateContestConfirmTag from "./components/Tag";
import CreateContestConfirmTiming from "./components/Timing";
import CreateContestConfirmTitle from "./components/Title";
import { toastError } from "@components/UI/Toast";

export enum Steps {
  ContestTitle = 0,
  ContestDescription = 1,
  ContestSummary = 2,
  ContestTag = 3,
  ContestTiming = 4,
  ContestSubmissions = 5,
  ContestVoting = 6,
  ContestMonetization = 7,
  ContestCustomization = 8,
}

const ETHEREUM_MAINNET_CHAIN_ID = 1;

const CreateContestConfirm = () => {
  const { chainId, chain } = useAccount();
  const { ...state } = useDeployContestStore(state => state);
  const { deployContest } = useDeployContest();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const title = isMobile ? "let’s confirm" : "finally, let’s confirm";
  const [isEthereumDeploymentModalOpen, setIsEthereumDeploymentModalOpen] = useState(false);

  const onDeployHandler = useCallback(() => {
    if (chainId === ETHEREUM_MAINNET_CHAIN_ID) {
      setIsEthereumDeploymentModalOpen(true);
    } else {
      deployContest();
    }
  }, [chainId, deployContest]);

  const handleNextStepMobile = useCallback(() => {
    if (!state.mobileStepTitle) return;

    if (state.mobileStepTitle === steps[state.step].title) {
      onDeployHandler();
      state.resetMobileStepTitle();
    }
  }, [onDeployHandler, state]);

  useEffect(() => {
    if (!chain) return;

    const fetchDetails = async () => {
      try {
        const { isError, minCostToPropose, minCostToVote } = await fetchChargeDetails(chain.name.toLowerCase());

        if (isError || !minCostToPropose || !minCostToVote) {
          toastError(`${chain.name} chain is not supported for anyone to vote.`);
          state.setStep(VOTING_STEP);
        }
      } catch (error) {
        state.setStep(VOTING_STEP);
      }
    };

    fetchDetails();
  }, [chain, state]);

  // Mobile listeners
  useEffect(() => {
    handleNextStepMobile();
  }, [handleNextStepMobile]);

  const onNavigateToStep = (step: Steps) => {
    state.setStep(step);
  };

  return (
    <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="col-span-1">
        <StepCircle step={state.step + 1} />
      </div>
      <div className="col-span-2 ml-10">
        <p className="text-[24px] text-primary-10 font-bold">{title}</p>
      </div>
      <div className="grid gap-4 col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-4">
        <CreateContestConfirmTitle
          step={Steps.ContestTitle}
          title={state.title}
          onClick={step => onNavigateToStep(step)}
        />
        <CreateContestConfirmTag step={Steps.ContestTag} tag={state.type} onClick={step => onNavigateToStep(step)} />
        <CreatContestConfirmSummary
          step={Steps.ContestSummary}
          summary={state.summary}
          onClick={step => onNavigateToStep(step)}
        />
        <CreateContestConfirmDescription
          step={Steps.ContestDescription}
          prompt={state.prompt}
          onClick={step => onNavigateToStep(step)}
        />
        <CreateContestConfirmTiming
          step={Steps.ContestTiming}
          onClick={step => onNavigateToStep(step)}
          timing={{
            submissionOpen: state.submissionOpen,
            votingOpen: state.votingOpen,
            votingClose: state.votingClose,
          }}
        />
        <CreateContestConfirmAllowlists
          step={Steps.ContestSubmissions}
          onClick={step => onNavigateToStep(step)}
          allowlists={{
            submissionMerkle: state.submissionMerkle,
            votingMerkle: state.votingMerkle,
            submissionRequirements: state.submissionRequirements,
            votingRequirements: state.votingRequirements,
            submissionTypeOption: state.submissionTypeOption,
          }}
        />
        <CreateContestConfirmMonetization
          step={Steps.ContestMonetization}
          charge={state.charge}
          onClick={step => onNavigateToStep(step)}
        />
        <CreateContestConfirmCustomization
          customization={{
            customization: state.customization,
            advancedOptions: state.advancedOptions,
          }}
          step={Steps.ContestCustomization}
          onClick={step => onNavigateToStep(step)}
        />
        <div className="mt-12">
          <CreateContestButton step={state.step} onClick={onDeployHandler} />
        </div>
      </div>
      <EthereumDeploymentModal
        isOpen={isEthereumDeploymentModalOpen}
        setIsOpen={value => setIsEthereumDeploymentModalOpen(value)}
        onDeploy={deployContest}
      />
    </div>
  );
};

export default CreateContestConfirm;
