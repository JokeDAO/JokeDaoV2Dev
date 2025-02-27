const CreateContestDemoDayTemplate = () => {
  return (
    <div className="flex flex-col gap-4 text-true-white text-[20px] normal-case">
      <div className="md:block hidden">
        <p>
          For a demo day, we'll default to let anyone enter and vote <br />
          (by paying per vote). You'll keep a share of all charges.
        </p>
      </div>

      <div className="md:hidden block">
        <p>For a demo day, we'll default to let anyone enter and vote (by paying per vote).</p>
        <p className="mt-4">You'll keep a share of all charges.</p>
      </div>

      <p>
        <b>Default duration: 2 days.</b> Anyone can enter for one day and vote in the following day.
      </p>
      <p className="font-bold">You can modify any settings you like before launching the contest.</p>
    </div>
  );
};

export default CreateContestDemoDayTemplate;
