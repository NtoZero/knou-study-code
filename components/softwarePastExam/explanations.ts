import type { SoftwareExplanationSet } from "./explanations/types";
import { softwareExplanationsGroupA } from "./explanations/group-a";
import { softwareExplanationsGroupB } from "./explanations/group-b";
import { softwareExplanationsGroupC } from "./explanations/group-c";
import { softwareExplanationsGroupD } from "./explanations/group-d";
import { softwareExplanationsGroupE } from "./explanations/group-e";
import { softwareExplanationsGroupF } from "./explanations/group-f";

export type { SoftwareExplanationSet } from "./explanations/types";

// 강의 그룹별로 작성한 수작업 해설을 한 곳에 병합한다. 모든 근거는
// 26-1/소프트웨어공학 강의록·교재·정리하기에서 확인했다.
export const softwarePastExamExplanations: Record<string, SoftwareExplanationSet> = {
  ...softwareExplanationsGroupA,
  ...softwareExplanationsGroupB,
  ...softwareExplanationsGroupC,
  ...softwareExplanationsGroupD,
  ...softwareExplanationsGroupE,
  ...softwareExplanationsGroupF,
};
