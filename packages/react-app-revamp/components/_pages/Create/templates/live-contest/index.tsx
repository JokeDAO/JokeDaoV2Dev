const CreateContestLiveContestTemplate = () => {
  return (
    <div className="flex flex-col gap-4 text-true-white text-[20px]">
      <div className="md:block hidden">
        <p>
          For a live contest, we’ll default to let anyone enter and vote <br />
          (by paying per vote). You’ll keep a share of all charges.
        </p>
      </div>

      <div className="md:hidden block">
        <p>For a live contest, we'll default to let anyone enter and vote (by paying per vote).</p>
        <p className="mt-4">You'll keep a share of all charges.</p>
      </div>

      <p>
        <b>Default duration: 3 hours.</b> Anyone can enter for 30 minutes, and vote in the following 2.5 hours.
      </p>
      <p className="font-bold">You can modify any settings you like before launching the contest.</p>
    </div>
  );
};

export default CreateContestLiveContestTemplate;
