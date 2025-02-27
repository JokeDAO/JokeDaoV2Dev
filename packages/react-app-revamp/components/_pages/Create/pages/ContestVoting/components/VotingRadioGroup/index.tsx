import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { VotingMerkle } from "@hooks/useDeployContest/types";
import { useEffect, useState } from "react";
import CreateVotingRequirements from "../VotingRequirements";
import CreateVotingCSVUploader from "../VotingUploadCsv";
import CreateRadioButtonsGroup, { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";

const CreateVotingRadioGroup = () => {
  const { setVotingTab, votingTab, setVotingMerkle, step, votingAllowlist } = useDeployContestStore(state => state);
  const [isNextClicked, setIsNextClicked] = useState(false);

  const onVotingRadioChange = (value: number) => {
    setVotingTab(value);
    setAllVotingMerkles(null);
    setIsNextClicked(false);
  };

  const setAllVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  const tabOptions: RadioOption[] = [
    {
      label: "upload a spreadsheet",
      mobileLabel: "upload csv",
      content: <CreateVotingCSVUploader isNextClicked={isNextClicked} />,
      value: 0,
    },
    {
      label: "use presets",
      mobileLabel: "use presets",
      content: <CreateVotingRequirements isNextClicked={isNextClicked} />,
      value: 1,
    },
  ];

  return (
    <div className="flex flex-col gap-16">
      <CreateRadioButtonsGroup options={tabOptions} value={votingTab} onChange={onVotingRadioChange} />
      <CreateNextButton
        step={step + 1}
        onClick={() => setIsNextClicked(true)}
        isDisabled={votingTab === 0 && Object.keys(votingAllowlist.csv).length === 0}
      />
    </div>
  );
};

export default CreateVotingRadioGroup;
