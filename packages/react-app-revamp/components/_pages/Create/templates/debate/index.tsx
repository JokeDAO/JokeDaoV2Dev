const CreateContestDebateTemplate = () => {
  return (
    <div className="flex flex-col gap-4 text-true-white text-[20px] normal-case">
      <div className="md:block hidden">
        <p>
          For a debate, we'll default to a voting contest: you'll enter the contestants, and then anyone can vote on who
          wins <br />
          (by paying per vote). You'll keep a share of all charges.
        </p>
      </div>

      <div className="md:hidden block">
        <p>
          For a debate, we'll default to a voting contest: you'll enter the contestants, and then anyone can vote on who
          wins (by paying per vote).
        </p>
        <p className="mt-4">You'll keep a share of all charges.</p>
      </div>

      <p>
        <b>Default duration: 48 hours. </b> You'll have 30 minutes to enter the contestants, and then voting will run
        for the next 47.5 hours.
      </p>
      <p className="font-bold">You can modify any settings you like before launching the contest.</p>
    </div>
  );
};

export default CreateContestDebateTemplate;
