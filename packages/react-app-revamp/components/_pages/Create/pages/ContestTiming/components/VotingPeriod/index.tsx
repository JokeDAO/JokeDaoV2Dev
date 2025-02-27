import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import CreateDefaultDropdown from "@components/_pages/Create/components/DefaultDropdown";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import moment from "moment";
import { TimingPeriod, addTimeBasedOnPeriod, timingPeriodsOptions, useTimingOptionForVotingPeriod } from "../../utils";

const CreateVotingPeriod = () => {
  const { votingClose, setVotingClose, errors, step, votingOpen } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const currentVotesOpenError = currentStepError?.message.startsWith("Voting ends") ? currentStepError.message : "";
  const { timingOption, setTimingOption } = useTimingOptionForVotingPeriod(state => state);
  const formattedVoteOpen = moment(votingOpen).format("MMMM D, YYYY h:mm A z");

  const onEndContesDateChange = (value: Date) => {
    setVotingClose(value);
    setTimingOption({
      label: "custom",
      value: "custom",
    });
  };

  const onTimingPeriodChange = (option: string) => {
    setTimingOption({
      value: option,
      label: timingPeriodsOptions.find(opt => opt.value === option)?.label ?? "",
    });

    const timingOption = option as TimingPeriod;

    const votingCloseDate = addTimeBasedOnPeriod(votingOpen, timingOption);
    setVotingClose(votingCloseDate);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">voting period</p>
        <CreateDefaultDropdown
          options={timingPeriodsOptions}
          defaultOption={timingOption}
          className="w-48 md:w-[216px]"
          onChange={option => onTimingPeriodChange(option)}
        />
      </div>
      <div className={`flex flex-col gap-8 border-l border-neutral-11 pl-6`}>
        <div className="flex flex-col gap-4">
          <p className="text-[16px] font-bold text-neutral-11 uppercase">opens</p>
          <div className="flex flex-col gap-2">
            <p className="text-[20px] text-neutral-11">{formattedVoteOpen}</p>
            <p className="text-[16px] text-neutral-14">voting opens when the entry period closes</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-[16px] font-bold text-neutral-11 uppercase">closes</p>
          <CreateDatePicker
            error={currentVotesOpenError}
            onChange={onEndContesDateChange}
            defaultDate={votingClose}
            minDate={votingOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateVotingPeriod;
