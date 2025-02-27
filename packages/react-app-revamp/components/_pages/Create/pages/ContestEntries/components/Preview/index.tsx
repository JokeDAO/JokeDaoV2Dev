import { EntryPreview, useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";
import CreateRadioButtonsGroup, { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";

const ContestEntriesPreview = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { entryPreviewConfig, setEntryPreviewConfig } = useDeployContestStore(state => state);

  const handlePreviewChange = (value: EntryPreview) => {
    setEntryPreviewConfig({ ...entryPreviewConfig, preview: value });
  };

  const options: RadioOption[] = [
    {
      label: (
        <>
          a title <span className="text-[16px]">(recommended for most contests)</span>
        </>
      ),
      value: EntryPreview.TITLE,
    },
    {
      label: (
        <>
          an image{" "}
          <span className="text-[16px]">
            {isMobile ? "" : "(recommended for meme contests, art contests, design contests, etc)"}
          </span>
        </>
      ),
      mobileLabel: "an image",
      value: EntryPreview.IMAGE,
    },
    {
      label: (
        <>
          an image + title{" "}
          <span className="text-[16px]">
            {isMobile ? "" : "(recommended for competitions between projects with logos)"}
          </span>
        </>
      ),
      mobileLabel: "an image + title",
      value: EntryPreview.IMAGE_AND_TITLE,
    },
    {
      label: (
        <>
          a tweet <span className="text-[16px]">{isMobile ? "" : "(recommended for contests on x.com posts)"}</span>
        </>
      ),
      mobileLabel: "a tweet",
      value: EntryPreview.TWEET,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11 font-bold">what kind of preview should a player enter?</p>
      <CreateRadioButtonsGroup options={options} value={entryPreviewConfig.preview} onChange={handlePreviewChange} />
    </div>
  );
};

export default ContestEntriesPreview;
