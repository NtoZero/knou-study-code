import type { PastExamSolutionProcess } from "@/components/pastExam/solutionProcessTypes";

export type ChoiceKey = "1" | "2" | "3" | "4";

export type PastExamQuestionImage = {
  src: string;
  alt: string;
  aiDescriptionHidden: string;
  sourcePageInternal: number;
  cropBoxInternal: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type LectureRef = {
  lectureId: number;
  label: string;
  href: string;
  concept: string;
};

export type PastExamChoice = {
  key: ChoiceKey;
  label: string;
  text: string;
  explanation: {
    verdict: "correct" | "wrong";
    reason: string;
  };
};

export type PastExamQuestion = {
  id: string;
  year: 2017 | 2018 | 2019;
  semester: "2";
  examName: string;
  number: number;
  prompt: string;
  images?: PastExamQuestionImage[];
  choices: PastExamChoice[];
  correctChoice: ChoiceKey;
  lectureRefs: LectureRef[];
  conceptTags: string[];
  answerExplanation: string;
  solutionProcess?: PastExamSolutionProcess;
  examSkill: string;
  sourceBasisInternal: Array<{
    concept: string;
    internalLectureSource: string;
    internalTextbookSource: string;
  }>;
  answerSourceInternal: string;
  questionSourceInternal: string;
};
