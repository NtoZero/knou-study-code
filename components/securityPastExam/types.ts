export type SecurityChoiceKey = "1" | "2" | "3" | "4";
export type SecurityPastExamYear = 2015 | 2016 | 2017 | 2018 | 2019;

export type SecurityPastExamChoice = {
  key: SecurityChoiceKey;
  label: string;
  text: string;
  explanation: {
    verdict: "correct" | "wrong";
    reason: string;
    conceptBasis: string;
  };
};

export type SecurityLectureRef = {
  lectureId: number;
  label: string;
  href: string;
  concept: string;
};

export type SecurityPastExamQuestion = {
  id: string;
  year: SecurityPastExamYear;
  semester: "1";
  examName: string;
  number: number;
  prompt: string;
  choices: SecurityPastExamChoice[];
  correctChoice: SecurityChoiceKey;
  lectureRefs: SecurityLectureRef[];
  conceptTags: string[];
  basis: string;
  examSkill: string;
};
