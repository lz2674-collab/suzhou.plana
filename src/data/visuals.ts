import { works } from "./works";

export const visualExploreItems = [
  ...works.filter((work) => work.section === "visual"),
  ...works.filter((work) => work.section !== "visual").slice(0, 4),
].map((work, index) => ({
  ...work,
  label:
    ["Style Frame", "概念镜头", "世界观设计", "角色资产", "场景资产", "Motion Test", "Look Development", "AI工作流片段"][
      index % 8
    ],
}));
