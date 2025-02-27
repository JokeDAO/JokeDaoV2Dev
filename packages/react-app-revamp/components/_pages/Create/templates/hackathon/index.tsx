const CreateContestHackathonTemplate = () => {
  return (
    <div className="flex flex-col gap-4 text-true-white text-[20px]">
      <p>
        For a hackathon, we’ll default to an entry contest: anyone can enter, and you’ll allowlist the jury to vote.{" "}
        <br /> You can upload a csv with their wallet addresses and voting power, use presets, or let anyone vote.
      </p>
      <p>As always, you’ll keep a share of all charges.</p>

      <p>
        <b>Default duration: 8 days.</b> Builders have one week to submit their projects, and judges one day to vote.
      </p>
      <p className="font-bold">You can modify any settings you like before launching the contest.</p>
    </div>
  );
};

export default CreateContestHackathonTemplate;
