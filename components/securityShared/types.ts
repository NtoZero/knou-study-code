export type SecurityTerm = {
  term: string;
  parent: string;
  prereq: string;
  intro: string;
  apply: string;
  reinforce: string;
};

export type SecurityConceptUnit = {
  title: string;
  anchor: string;
  summary: string;
  definition: string;
  why: string;
  components: string[];
  examples: string[];
  mistake: string;
  examFocus: string;
};

export type SecurityQuizChoice = {
  text: string;
  isCorrect: boolean;
  explanation: {
    basis: string;
    reason: string;
  };
};

export type SecurityQuiz = {
  q: string;
  category: string;
  choices: SecurityQuizChoice[];
  basis: string;
  examSkill: string;
};

type FlowStep = {
  title: string;
  desc: string;
  check: string;
};

export type SecurityLab =
  | {
      kind: "triad";
      title: string;
      subtitle: string;
      scenarios: {
        label: string;
        desc: string;
        goals: string[];
        why: string;
      }[];
    }
  | {
      kind: "cipher";
      title: string;
      subtitle: string;
      plain: string;
      shiftDefault: number;
      vigenereKey: number[];
    }
  | {
      kind: "mac";
      title: string;
      subtitle: string;
      message: string;
      tampered: string;
      key: string;
      methods: {
        label: string;
        desc: string;
      }[];
    }
  | {
      kind: "classifier";
      title: string;
      subtitle: string;
      categories: string[];
      cases: {
        prompt: string;
        answer: string;
        feedback: string;
      }[];
    }
  | {
      kind: "flow";
      title: string;
      subtitle: string;
      steps: FlowStep[];
      decisionCards: {
        label: string;
        correct: boolean;
        reason: string;
      }[];
    }
  | {
      kind: "block";
      title: string;
      subtitle: string;
      modes: {
        name: string;
        formula: string;
        parallel: string;
        error: string;
        use: string;
      }[];
      lfsr: {
        seed: number[];
        taps: number[];
      };
    }
  | {
      kind: "rsa";
      title: string;
      subtitle: string;
      defaults: {
        p: number;
        q: number;
        e: number;
        message: number;
      };
      problems: {
        label: string;
        easy: string;
        hard: string;
        algorithms: string;
      }[];
    }
  | {
      kind: "hash-signature";
      title: string;
      subtitle: string;
      messages: string[];
      algorithms: {
        name: string;
        output: string;
        status: string;
      }[];
    }
  | {
      kind: "dhke";
      title: string;
      subtitle: string;
      defaults: {
        p: number;
        g: number;
        aliceSecret: number;
        bobSecret: number;
      };
      publicKeyMethods: {
        name: string;
        risk: string;
        safePoint: string;
      }[];
    };

export type SecurityLectureContent = {
  id: number;
  title: string;
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
  density: {
    concepts: number;
    labs: number;
    drills: number;
    quiz: number;
  };
  terms: SecurityTerm[];
  units: SecurityConceptUnit[];
  lab: SecurityLab;
  quizzes: SecurityQuiz[];
};

export type SecurityLectureViewContent = Omit<
  SecurityLectureContent,
  "audit" | "density"
>;
