import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateTab from "../../components/Tab";
import CreateVotingAllowlist from "./components/VotingAllowlist";

const tabOptions = [
  { label: "set allowlist manually", content: <CreateVotingAllowlist /> },
  { label: "set voting requirements", content: <div className="mt-7 ml-[20px]">voting req tab</div> },
];

const CreateContestVoting = () => {
  const { errors, setStep, step } = useDeployContestStore(state => state);

  return (
    <div className="mt-12 lg:mt-[50px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-5 text-[24px]">
        <StepCircle step={step + 1} />
        <CreateTab options={tabOptions} disabledTab={1} className="w-full md:w-[600px]" />
      </div>
    </div>
  );
};

export default CreateContestVoting;
