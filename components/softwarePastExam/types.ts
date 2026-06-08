export type SoftwareChoiceKey = "1" | "2" | "3" | "4";
export type SoftwarePastExamYear = 2017 | 2018 | 2019;

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
  choices: SoftwarePastExamChoice[];
  correctChoice: SoftwareChoiceKey;
  lectureRefs: SoftwareLectureRef[];
  conceptTags: string[];
  basis: string;
  examSkill: string;
  answerSourceInternal: string;
  questionSourceInternal: string;
};
