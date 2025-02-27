import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";
import CreateRadioButtonsGroup, { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";

const ContestEntriesAdditionalDescription = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { entryPreviewConfig, setEntryPreviewConfig } = useDeployContestStore(state => state);

  const handleAddDescriptionChange = (value: boolean) => {
    setEntryPreviewConfig({ ...entryPreviewConfig, isAdditionalDescriptionEnabled: value });
  };

  const options: RadioOption[] = [
    {
      label: (
        <>
          yes <span className="text-[16px]">(recommended)</span>
        </>
      ),
      value: true,
    },
    {
      label: "no",
      mobileLabel: "no",
      value: false,
      content:
        !entryPreviewConfig.isAdditionalDescriptionEnabled && !isMobile ? (
          <p className="text-neutral-9 text-[16px]">
            (select if you *only* want players to enter a title, image, title + image, or tweet)
          </p>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11 font-bold">
        can players include an "additional description" for their preview?
      </p>
      <CreateRadioButtonsGroup
        options={options}
        value={entryPreviewConfig.isAdditionalDescriptionEnabled}
        onChange={handleAddDescriptionChange}
      />
    </div>
  );
};

export default ContestEntriesAdditionalDescription;
