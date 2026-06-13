export type JavaChoiceKey = "1" | "2" | "3" | "4";
export type JavaPastExamYear = 2017 | 2018 | 2019;

export type JavaPastExamChoice = {
  key: JavaChoiceKey;
  label: string;
  text: string;
  explanation: {
    verdict: "correct" | "wrong";
    reason: string;
  };
};

export type JavaLectureRef = {
  lectureId: number;
  label: string;
  href: string;
  concept: string;
};

export type JavaCodeBlock = {
  title: string;
  code: string;
};

export type JavaPastExamQuestion = {
  id: string;
  year: JavaPastExamYear;
  semester: "1";
  examName: string;
  number: number;
  prompt: string;
  codeBlocks?: JavaCodeBlock[];
  choices: JavaPastExamChoice[];
  correctChoice: JavaChoiceKey;
  lectureRefs: JavaLectureRef[];
  conceptTags: string[];
  answerExplanation: string;
  examSkill: string;
  answerSourceInternal: string;
  questionSourceInternal: string;
};
