export type SoftwareChoiceKey = "1" | "2" | "3" | "4";
export type SoftwarePastExamYear = 2017 | 2018 | 2019;

export type SoftwareQuizChoice = {
  text: string;
  isCorrect: boolean;
  explanation: {
    basis: string;
    reason: string;
  };
};

export type SoftwareConceptTableRow = {
  criterion: string;
  lectureBasis: string;
  examCheck: string;
};

export type SoftwareConceptUnit = {
  title: string;
  anchor: string;
  summary: string;
  definition: string;
  why: string;
  components: string[];
  procedure?: string[];
  formula?: string;
  contrast?: string[];
  examples: string[];
  mistake: string;
  examFocus: string;
  tableRows?: SoftwareConceptTableRow[];
};

export type SoftwareLab = {
  kind:
    | "overview"
    | "process"
    | "cpm"
    | "quality"
    | "test"
    | "requirements"
    | "design"
    | "maintenance"
    | "uml"
    | "usecase"
    | "activity"
    | "sequence"
    | "class"
    | "state"
    | "component";
  title: string;
  subtitle: string;
  cases: {
    label: string;
    input: string;
    output: string;
    rule: string;
  }[];
};

export type SoftwareQuiz = {
  q: string;
  category: string;
  basis: string;
  examSkill: string;
  choices: SoftwareQuizChoice[];
};

export type SoftwareLectureContent = {
  id: number;
  title: string;
  sourceLabel: string;
  intro: string;
  goals: string[];
  audit: {
    lecture: string;
    textbook: string;
    definitions: string;
    procedures: string;
    examples: string;
    examPoint: string;
    implementation: string;
  };
  units: SoftwareConceptUnit[];
  lab: SoftwareLab;
  quizzes: SoftwareQuiz[];
};
