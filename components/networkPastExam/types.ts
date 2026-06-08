export type NetworkChoiceKey = "1" | "2" | "3" | "4";
export type NetworkPastExamYear = 2015 | 2016 | 2017 | 2018 | 2019;

export type NetworkExamCategory =
  | "통신망 기초"
  | "프로토콜·계층"
  | "신호·전송"
  | "오류·흐름 제어"
  | "TCP/IP"
  | "LAN"
  | "보안";

export type NetworkAnswerKeySet = {
  year: NetworkPastExamYear;
  answers: NetworkChoiceKey[];
  groups: string[];
};

export type NetworkConceptVisual = {
  src: string;
  alt: string;
  caption: string;
  sourceLabel: string;
  width: number;
  height: number;
};

export type NetworkExamPattern = {
  id: string;
  label: string;
  category: NetworkExamCategory;
  lectureIds: number[];
  refs: string[];
  sourceLabel: string;
  definition: string;
  examCue: string;
  studyAction: string;
  surrounding: string[];
  variants: string[];
  visuals?: NetworkConceptVisual[];
};

export type NetworkFrequentConcept = NetworkExamPattern & {
  frequency: number;
  years: NetworkPastExamYear[];
};

export type NetworkPastExamChoice = {
  key: NetworkChoiceKey;
  label: string;
  text: string;
  explanation: {
    verdict: "correct" | "wrong";
    reason: string;
    conceptBasis: string;
  };
};

export type NetworkLectureRef = {
  lectureId: number;
  label: string;
  href: string;
  concept: string;
};

export type NetworkReconstructedQuestion = {
  id: string;
  number: number;
  patternId: string;
  category: NetworkExamCategory;
  lectureRefs: NetworkLectureRef[];
  conceptTags: string[];
  refs: string[];
  sourceLabel: string;
  prompt: string;
  choices: NetworkPastExamChoice[];
  correctChoice: NetworkChoiceKey;
  explanation: string;
  examSkill: string;
};
