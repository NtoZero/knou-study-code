export type SoftwareChoiceKey = "1" | "2" | "3" | "4";
export type SoftwarePastExamYear = 2017 | 2018 | 2019;

export type SoftwarePastExamImage = {
  src: string;
  alt: string;
  aiDescriptionHidden: string;
  sourcePageInternal: 1 | 2 | 3;
  cropBoxInternal: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type SoftwarePastExamChoice = {
  key: SoftwareChoiceKey;
  label: string;
  text: string;
  explanation: {
    verdict: "correct" | "wrong";
    reason: string;
    conceptBasis: string;
  };
};

export type SoftwareLectureRef = {
  lectureId: number;
  label: string;
  href: string;
  concept: string;
};

export type SoftwarePastExamQuestion = {
  id: string;
  year: SoftwarePastExamYear;
  semester: "1";
  examName: string;
  number: number;
  prompt: string;
  images?: SoftwarePastExamImage[];
  choices: SoftwarePastExamChoice[];
  correctChoice: SoftwareChoiceKey;
  lectureRefs: SoftwareLectureRef[];
  conceptTags: string[];
  basis: string;
  examSkill: string;
  answerSourceInternal: string;
  questionSourceInternal: string;
};
