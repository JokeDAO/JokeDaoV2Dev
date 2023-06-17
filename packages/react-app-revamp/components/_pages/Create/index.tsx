import { usePageActionStore } from "@hooks/useCreateFlowAction/store";
import Stepper from "./components/Stepper";
import CreateContestParams from "./pages/ContestParams";
import ContestPlay from "./pages/ContestPlay";
import CreateContestPrompt from "./pages/ContestPrompt";
import CreateContestSubmissions from "./pages/ContestSubmission";
import CreateContestSummary from "./pages/ContestSummary";
import CreateContestTiming from "./pages/ContestTiming";
import CreateContestTitle from "./pages/ContestTitle";
import CreateContestType from "./pages/ContestType";
import CreateContestVoting from "./pages/ContestVoting";

const steps = [
  { title: "contest type", content: <CreateContestType /> },
  { title: "contest title", content: <CreateContestTitle /> },
  { title: "summary", content: <CreateContestSummary /> },
  { title: "prompt", content: <CreateContestPrompt /> },
  { title: "timing", content: <CreateContestTiming /> },
  { title: "voting", content: <CreateContestVoting /> },
  { title: "submissions", content: <CreateContestSubmissions /> },
  { title: "parameters", content: <CreateContestParams /> },
];

const CreateFlow = () => {
  const pageAction = usePageActionStore(state => state.pageAction);

  return (
    <div className="pl-[30px] pr-[20px] lg:pl-[80px] lg:pr-[60px]">
      {pageAction === "create" ? <Stepper steps={steps} /> : <ContestPlay />}
    </div>
  );
};

export default CreateFlow;
