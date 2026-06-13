export type PastExamSolutionVisualKind =
  | "array"
  | "formula"
  | "graph"
  | "network"
  | "sequence"
  | "stack"
  | "table"
  | "tree";

export type PastExamSolutionVariant = "idle" | "active" | "done" | "cut" | "answer";

export type PastExamSolutionNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  variant?: PastExamSolutionVariant;
};

export type PastExamSolutionEdge = {
  from: string;
  to: string;
  label?: string;
  variant?: PastExamSolutionVariant;
};

export type PastExamSolutionVisualFrame = {
  title: string;
  caption: string;
  nodes?: PastExamSolutionNode[];
  edges?: PastExamSolutionEdge[];
  array?: Array<{
    label?: string;
    value: string;
    variant?: PastExamSolutionVariant;
  }>;
  formula?: Array<{
    value: string;
    variant?: PastExamSolutionVariant;
  }>;
  table?: {
    columns: string[];
    rows: Array<{
      label?: string;
      cells: string[];
      variant?: PastExamSolutionVariant;
    }>;
  };
};

export type PastExamSolutionProcess = {
  title: string;
  overview: string;
  steps: Array<{
    title: string;
    body: string;
  }>;
  visual: {
    kind: PastExamSolutionVisualKind;
    title: string;
    frames: PastExamSolutionVisualFrame[];
  };
  checkpoint: string;
};
