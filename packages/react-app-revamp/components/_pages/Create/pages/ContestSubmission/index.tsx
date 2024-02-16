import { MerkleKey, SubmissionType, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle, VotingMerkle } from "@hooks/useDeployContest/types";
import CreateNextButton from "../../components/Buttons/Next";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import CreateSubmissionTabContent from "./components/SubmissionTabContent";
import CreateSubmissionTabMessage from "./components/SubmissionTabMessage";
import CreateSubmissionType from "./components/SubmissionType";

const CreateContestSubmissions = () => {
  const { step, submissionTypeOption, setSubmissionMerkle, setVotingMerkle } = useDeployContestStore(state => state);
  const onNextStep = useNextStep([]);

  const setAllSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled", "manual"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const setAllVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled", "manual"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  // Handle next step for same as voters option
  const handleNextStep = () => {
    setAllSubmissionMerkles(null);
    setAllVotingMerkles(null);
    onNextStep();
  };

  return (
    <div className="mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col md:flex-row items-start gap-10 text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col">
          <div className="flex flex-col gap-11">
            <p className="text-[24px] text-primary-10 font-bold">Who can submit?</p>
            <div className="flex flex-col gap-8">
              <CreateSubmissionType />
              <CreateSubmissionTabMessage />
            </div>
          </div>

          {submissionTypeOption.value === SubmissionType.DifferentFromVoters ? (
            <CreateSubmissionTabContent />
          ) : (
            <div className="mt-16">
              <CreateNextButton step={step + 1} onClick={handleNextStep} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContestSubmissions;
