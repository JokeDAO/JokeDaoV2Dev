import { artConfig } from "./art/config";
import { debateConfig } from "./debate/config";
import { demoDayConfig } from "./demo-day/config";
import { grantsRoundConfig } from "./grants-round/config";
import { hackathonConfig } from "./hackathon/config";
import { leaderboardConfig } from "./leaderboard/config";
import { liveContestConfig } from "./live-contest/config";
import { memeConfig } from "./meme/config";
import { testContestConfig } from "./test-contest/config";
import { TemplateConfig, TemplateType } from "./types";

export const templateConfigs: { [key in TemplateType]: TemplateConfig } = {
  [TemplateType.leaderboard]: leaderboardConfig,
  [TemplateType.demoDay]: demoDayConfig,
  [TemplateType.artContest]: artConfig,
  [TemplateType.memeContest]: memeConfig,
  [TemplateType.hackathon]: hackathonConfig,
  [TemplateType.grantsRound]: grantsRoundConfig,
  [TemplateType.debate]: debateConfig,
  [TemplateType.liveContest]: liveContestConfig,
  [TemplateType.testContest]: testContestConfig,
};

export const displayValueToKeyMapping: { [key: string]: TemplateType } = {
  leaderboard: TemplateType.leaderboard,
  "demo day": TemplateType.demoDay,
  "art contest": TemplateType.artContest,
  "meme contest": TemplateType.memeContest,
  hackathon: TemplateType.hackathon,
  "grants round": TemplateType.grantsRound,
  debate: TemplateType.debate,
  "live contest": TemplateType.liveContest,
  "test contest": TemplateType.testContest,
};

export const getTemplateConfigByType = (type: TemplateType) => {
  const enumKey = displayValueToKeyMapping[type];

  return templateConfigs[enumKey];
};
