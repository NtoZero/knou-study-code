export type OfficialExerciseKind = "multiple" | "written";

export type OfficialExerciseSubject =
  | "컴퓨터보안"
  | "소프트웨어공학"
  | "정보통신망"
  | "Java프로그래밍"
  | "인공지능"
  | "알고리즘";

export type OfficialExerciseChoice = {
  key: string;
  text: string;
};

export type OfficialExerciseImage = {
  src: string;
  alt: string;
};

export type OfficialExerciseQuestion = {
  id: string;
  subject: OfficialExerciseSubject;
  subjectSlug: string;
  lectureId: number;
  lectureTitle: string;
  questionNumber: number;
  kind: OfficialExerciseKind;
  stimulus: string;
  prompt: string;
  choices: OfficialExerciseChoice[];
  answer: string;
  correctChoice?: string;
  explanation: string;
  image?: OfficialExerciseImage;
};

export type OfficialExerciseSubjectMeta = {
  subject: OfficialExerciseSubject;
  slug: string;
  label: string;
};

export type OfficialExerciseStats = {
  totalQuestions: number;
  imageQuestions: number;
  writtenQuestions: number;
  multipleChoiceQuestions: number;
  activeSubjects: number;
};
