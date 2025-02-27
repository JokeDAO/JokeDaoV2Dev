import { MAX_SUBMISSIONS_LIMIT } from "@hooks/useDeployContest";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect, useState } from "react";
import ContestParamsSubmissionsPerContest from "./components/SubmissionsPerContest";
import ContestParamsSubmissionsPerPlayer from "./components/SubmissionsPerPlayer";

export const VOTING_STEP = 6;

const CreateContestParams = () => {
  const { customization, setCustomization } = useDeployContestStore(state => state);
  const [submissionsPerUserError, setSubmissionsPerUserError] = useState<string>("");
  const [maxSubmissionsError, setMaxSubmissionsError] = useState<string>("");

  useEffect(() => {
    validateMaxSubmissions(customization.maxSubmissions);
  }, [customization.maxSubmissions]);

  useEffect(() => {
    validateSubmissionsPerUser(customization.allowedSubmissionsPerUser);
  }, [customization.allowedSubmissionsPerUser]);

  const onSubmissionsPerUserChange = (value: number | null) => {
    validateSubmissionsPerUser(value);
    if (value) setCustomization({ ...customization, allowedSubmissionsPerUser: value });
  };

  const onMaxSubmissionsChange = (value: number | null) => {
    validateMaxSubmissions(value);
    if (value) setCustomization({ ...customization, maxSubmissions: value });
  };

  const validateSubmissionsPerUser = (value: number | null) => {
    if (value === null || value < 1) {
      setSubmissionsPerUserError("must be at least 1");
    } else if (value > MAX_SUBMISSIONS_LIMIT) {
      setSubmissionsPerUserError(`must be ${MAX_SUBMISSIONS_LIMIT} or less`);
    } else {
      setSubmissionsPerUserError("");
    }
  };

  const validateMaxSubmissions = (value: number | null) => {
    if (value === null || value < 1) {
      setMaxSubmissionsError("must be at least 1");
    } else if (value > MAX_SUBMISSIONS_LIMIT) {
      setMaxSubmissionsError(`must be ${MAX_SUBMISSIONS_LIMIT} or less`);
    } else {
      setMaxSubmissionsError("");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <ContestParamsSubmissionsPerPlayer
        allowedSubmissionsPerUser={customization.allowedSubmissionsPerUser}
        submissionsPerUserError={submissionsPerUserError}
        onSubmissionsPerUserChange={onSubmissionsPerUserChange}
      />
      <ContestParamsSubmissionsPerContest
        maxSubmissions={customization.maxSubmissions}
        submissionsPerContestError={maxSubmissionsError}
        onMaxSubmissionsChange={onMaxSubmissionsChange}
      />
    </div>
  );
};

export default CreateContestParams;
