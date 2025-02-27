import React, { FC, useEffect, useState } from "react";
import CreateContestArtTemplate from "./art";
import { artConfig } from "./art/config";
import CreateContestDebateTemplate from "./debate";
import { debateConfig } from "./debate/config";
import CreateContestDemoDayTemplate from "./demo-day";
import { demoDayConfig } from "./demo-day/config";
import CreateContestGrantsRoundTemplate from "./grants-round";
import { grantsRoundConfig } from "./grants-round/config";
import CreateContestHackathonTemplate from "./hackathon";
import { hackathonConfig } from "./hackathon/config";
import CreateContestLeaderboardTemplate from "./leaderboard";
import { leaderboardConfig } from "./leaderboard/config";
import CreateContestLiveContestTemplate from "./live-contest";
import { liveContestConfig } from "./live-contest/config";
import CreateContestMemeTemplate from "./meme";
import { memeConfig } from "./meme/config";
import { displayValueToKeyMapping } from "./templates";
import CreateContestTestContestTemplate from "./test-contest";
import { testContestConfig } from "./test-contest/config";
import { TemplateType } from "./types";

interface TemplateMapping {
  [key: string]: {
    component: React.FC;
    config: any;
  };
}

export const templateMapping: TemplateMapping = {
  leaderboard: {
    component: CreateContestLeaderboardTemplate,
    config: leaderboardConfig,
  },
  "demo day": {
    component: CreateContestDemoDayTemplate,
    config: demoDayConfig,
  },
  "art contest": {
    component: CreateContestArtTemplate,
    config: artConfig,
  },
  "meme contest": {
    component: CreateContestMemeTemplate,
    config: memeConfig,
  },
  hackathon: {
    component: CreateContestHackathonTemplate,
    config: hackathonConfig,
  },
  "grants round": {
    component: CreateContestGrantsRoundTemplate,
    config: grantsRoundConfig,
  },
  debate: {
    component: CreateContestDebateTemplate,
    config: debateConfig,
  },
  "live contest": {
    component: CreateContestLiveContestTemplate,
    config: liveContestConfig,
  },
  "test contest": {
    component: CreateContestTestContestTemplate,
    config: testContestConfig,
  },
};

interface GeneralTemplateProps {
  templateType: TemplateType;
}

const GeneralTemplate: FC<GeneralTemplateProps> = ({ templateType }) => {
  const [currentTemplate, setCurrentTemplate] = useState<TemplateType | null>(null);
  const [key, setKey] = useState(0);
  const enumKey = displayValueToKeyMapping[templateType];
  const TemplateComponent = templateMapping[enumKey]?.component;

  useEffect(() => {
    if (templateType !== currentTemplate) {
      setCurrentTemplate(templateType);
      setKey(prevKey => prevKey + 1);
    }
  }, [templateType, currentTemplate]);

  if (!TemplateComponent) {
    return <div>Template not found</div>;
  }

  return (
    <div className="templates-normal-case animate-reveal" key={key}>
      <TemplateComponent />
    </div>
  );
};

export default GeneralTemplate;
