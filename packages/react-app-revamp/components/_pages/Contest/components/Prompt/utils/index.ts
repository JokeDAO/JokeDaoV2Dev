interface ParsedPrompt {
  contestType: string;
  contestTitle: string;
  contestSummary: string;
  contestEvaluate: string;
  contestContactDetails: string;
  contestImageUrl?: string;
}

export const parsePrompt = (prompt: string): ParsedPrompt => {
  const defaultPrompt: ParsedPrompt = {
    contestType: "",
    contestTitle: "",
    contestSummary: "",
    contestEvaluate: "",
    contestContactDetails: "",
  };

  if (!prompt) return defaultPrompt;

  try {
    const params = new URLSearchParams(prompt);
    if (params.has("type") && params.has("summarize") && params.has("evaluateVoters")) {
      return {
        ...defaultPrompt,
        contestType: params.get("type") || "",
        contestSummary: params.get("summarize") || "",
        contestEvaluate: params.get("evaluateVoters") || "",
        contestContactDetails: params.get("contactDetails") || "",
        contestImageUrl: params.get("imageUrl") || "",
      };
    }
  } catch (error) {
    console.error("Error parsing URLSearchParams:", error);
  }

  const segments = prompt.split("|");

  if (segments.length === 2) {
    return { ...defaultPrompt, contestType: segments[0], contestSummary: segments[1] };
  } else if (segments.length === 3) {
    return { ...defaultPrompt, contestType: segments[0], contestSummary: segments[1], contestEvaluate: segments[2] };
  } else if (segments.length === 4) {
    return {
      ...defaultPrompt,
      contestType: segments[0],
      contestSummary: segments[1],
      contestEvaluate: segments[2],
      contestContactDetails: segments[3],
    };
  } else if (segments.length === 5) {
    return {
      contestType: segments[0],
      contestTitle: segments[1],
      contestSummary: segments[2],
      contestEvaluate: segments[3],
      contestContactDetails: segments[4],
    };
  } else {
    console.error("Unexpected number of segments in prompt");
    return defaultPrompt;
  }
};
