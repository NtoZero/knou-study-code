export type JavaQuizChoice = {
  text: string;
  isCorrect: boolean;
  explanation: {
    basis: string;
    reason: string;
  };
};

export type JavaConceptUnit = {
  title: string;
  anchor: string;
  summary: string;
  definition: string;
  why: string;
  components: string[];
  procedure?: string[];
  examples: string[];
  mistake: string;
  examFocus: string;
};

export type JavaCodeStep = {
  label: string;
  code: string;
  output: string;
  explanation: string;
};

export type JavaDrillCase = {
  label: string;
  input: string;
  output: string;
  rule: string;
};

export type JavaDrill = {
  title: string;
  subtitle: string;
  cases: JavaDrillCase[];
};

export type JavaTermDetail = {
  term: string;
  sourceBasis?: string;
  definition: string;
  role: string;
  distinction: string;
  example: string;
};

export type JavaVisualStudioKind =
  | "pipeline"
  | "classifier"
  | "matrix"
  | "state"
  | "stack"
  | "graph";

export type JavaVisualItem = {
  label: string;
  value: string;
  detail: string;
  note: string;
};

export type JavaVisualStudio = {
  kind: JavaVisualStudioKind;
  title: string;
  subtitle: string;
  prompt: string;
  items: JavaVisualItem[];
};

export type JavaLectureDeepDive = {
  sourceBasis: string;
  terms: JavaTermDetail[];
  studio: JavaVisualStudio;
};

export type JavaQuiz = {
  q: string;
  category: string;
  basis: string;
  examSkill: string;
  choices: JavaQuizChoice[];
};

export type JavaLectureContent = {
  id: number;
  title: string;
  sourceLabel: string;
  intro: string;
  goals: string[];
  audit: {
    lecture: string;
    definitions: string;
    procedures: string;
    examples: string;
    exercisePoint: string;
    implementation: string;
  };
  units: JavaConceptUnit[];
  codeSteps: JavaCodeStep[];
  drill: JavaDrill;
  quizzes: JavaQuiz[];
};
