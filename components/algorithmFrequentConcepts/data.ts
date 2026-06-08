import { algorithmLectures } from "@/lib/algorithmCourse";
import { algorithmPastExamQuestions } from "@/components/algorithmPastExam/data";

export type AlgorithmFrequentConceptCategory =
  | "기초·성능"
  | "정렬"
  | "탐색"
  | "그래프"
  | "동적 프로그래밍"
  | "스트링·압축"
  | "NP";

export type AlgorithmFrequentConcept = {
  id: string;
  label: string;
  category: AlgorithmFrequentConceptCategory;
  lectureIds: number[];
  questionIds: string[];
  refs: string[];
  years: number[];
  frequency: number;
  sourceLabel: string;
  definition: string;
  examCue: string;
  wrongRule: string;
  variants: string[];
  visuals?: AlgorithmFrequentConceptVisual[];
};

export type AlgorithmFrequentConceptVisual = {
  src: string;
  alt: string;
  caption: string;
  sourceLabel: string;
  width: number;
  height: number;
};

export const algorithmFrequentConceptCategories: AlgorithmFrequentConceptCategory[] = [
  "기초·성능",
  "정렬",
  "탐색",
  "그래프",
  "동적 프로그래밍",
  "스트링·압축",
  "NP",
];

export const algorithmFrequentConceptYears = [2019, 2018, 2017] as const;

function categoryForLecture(lectureId: number): AlgorithmFrequentConceptCategory {
  const lecture = algorithmLectures.find((item) => item.id === lectureId);
  if (!lecture) return "기초·성능";
  if (lecture.chapter === 1) return "기초·성능";
  if (lecture.chapter === 2) return "정렬";
  if (lecture.chapter === 3) return "탐색";
  if (lecture.chapter === 4) return "그래프";
  if (lecture.chapter === 5) return "동적 프로그래밍";
  if (lecture.chapter === 6) return "스트링·압축";
  return "NP";
}

function lectureLabel(lectureId: number) {
  const lecture = algorithmLectures.find((item) => item.id === lectureId);
  return lecture ? `${lectureId}강 ${lecture.title}` : `${lectureId}강`;
}

function conceptId(label: string) {
  return label
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .toLowerCase();
}

function visual(
  file: string,
  width: number,
  height: number,
  sourceLabel: string,
  caption: string,
): AlgorithmFrequentConceptVisual {
  return {
    src: `/algorithm/frequent-concepts/figures/${file}`,
    alt: `${sourceLabel} 도식`,
    caption,
    sourceLabel,
    width,
    height,
  };
}

const conceptVisuals: Record<string, AlgorithmFrequentConceptVisual[]> = {
  "점근 성능 표기": [
    visual(
      "asymptotic-notations.png",
      770,
      230,
      "교재 1장 점근 표기법",
      "O, Ω, Θ가 각각 상한·하한·동시 상하한을 어떻게 나타내는지 그래프로 확인.",
    ),
  ],
  "버블 정렬": [
    visual(
      "bubble-sort-direction.png",
      780,
      680,
      "교재 2장 버블 정렬 진행 방향",
      "버블 정렬은 인접 원소 비교·교환 방향과 한 패스 후 확정 위치를 함께 추적.",
    ),
  ],
  "셸 정렬": [
    visual(
      "shell-sort-gap-pass.png",
      740,
      290,
      "교재 2장 셸 정렬 부분배열",
      "셸 정렬은 간격 D에 따라 부분배열을 나누고 각 부분배열에 삽입 정렬을 적용.",
    ),
  ],
  "힙 정렬": [
    visual(
      "heap-structure-array.png",
      720,
      410,
      "교재 2장 힙의 예와 배열 표현",
      "힙 정렬 문항은 완전 이진 트리의 부모·자식 위치와 일차원 배열 대응을 함께 확인.",
    ),
  ],
  "이진 탐색 트리": [
    visual(
      "bst-search-path.png",
      780,
      380,
      "교재 3장 이진 탐색 트리 탐색",
      "BST는 왼쪽 < 루트 < 오른쪽 성질을 따라 비교 방향을 내려가며 탐색.",
    ),
  ],
  "B-트리": [
    visual(
      "btree-234-insert.png",
      680,
      210,
      "교재 3장 2-3-4 트리 삽입",
      "2-3-4 트리와 B-트리는 한 노드의 여러 키와 삽입 위치 이동을 그림으로 판별.",
    ),
  ],
  "2-3-4 트리": [
    visual(
      "btree-234-insert.png",
      680,
      210,
      "교재 3장 2-3-4 트리 삽입",
      "2-3-4 트리와 B-트리는 한 노드의 여러 키와 삽입 위치 이동을 그림으로 판별.",
    ),
  ],
  "DFS와 강연결 성분": [
    visual(
      "dfs-scc-directed-graph.png",
      310,
      600,
      "교재 4장 강연결 성분",
      "강연결 성분은 방향 그래프에서 서로 도달 가능한 정점 묶음을 DFS 흐름과 함께 읽음.",
    ),
  ],
  "최소 신장 트리": [
    visual(
      "mst-prim-process.png",
      780,
      700,
      "교재 4장 프림 알고리즘",
      "최소 신장 트리는 가장 작은 간선을 차례로 추가하되 사이클을 만들지 않는 과정으로 확인.",
    ),
  ],
  "최단 경로 알고리즘": [
    visual(
      "dijkstra-shortest-path-process.png",
      720,
      1120,
      "교재 4장 데이크스트라 과정",
      "최단 경로 문항은 선택된 정점 집합과 거리값 갱신 순서를 함께 추적.",
    ),
  ],
  "행렬 연쇄 곱셈": [
    visual(
      "matrix-chain-dp-table.png",
      660,
      260,
      "교재 5장 행렬 연쇄 곱셈 표",
      "동적 프로그래밍 표에서 C[i][j]와 P[i][j]가 부분문제의 최소 비용과 분할 위치를 저장.",
    ),
  ],
  "스트링 매칭": [
    visual(
      "kmp-prefix-shift-table.png",
      740,
      1150,
      "교재 6장 KMP 일치 접미부 정보",
      "KMP는 접두부·접미부 일치 정보를 이용해 불필요한 재비교를 건너뜀.",
    ),
  ],
  "허프만 코딩": [
    visual(
      "huffman-tree-example.png",
      400,
      370,
      "교재 6장 허프만 트리 예",
      "허프만 코딩은 빈도가 작은 노드부터 합쳐 이진 코드 길이를 다르게 부여.",
    ),
  ],
  "영상 압축과 JPEG": [
    visual(
      "mpeg-jpeg-frame-similarity.png",
      640,
      420,
      "교재 6장 동영상 압축과 JPEG",
      "MPEG은 프레임 간 유사성을 활용하고 개별 화면은 JPEG 방식의 압축 개념과 연결.",
    ),
  ],
};

const grouped = algorithmPastExamQuestions.reduce<Map<string, typeof algorithmPastExamQuestions>>(
  (acc, question) => {
    const concept = question.lectureRefs[0]?.concept ?? question.conceptTags[0] ?? question.id;
    const items = acc.get(concept) ?? [];
    items.push(question);
    acc.set(concept, items);
    return acc;
  },
  new Map(),
);

export const algorithmFrequentConcepts: AlgorithmFrequentConcept[] = Array.from(grouped, ([label, questions]) => {
  const representative = questions[0];
  const lectureIds = Array.from(
    new Set(questions.flatMap((question) => question.lectureRefs.map((ref) => ref.lectureId))),
  ).sort((a, b) => a - b);
  const refs = questions
    .map((question) => `${question.year}-${question.number}`)
    .sort((a, b) => {
      const [ay, an] = a.split("-").map(Number);
      const [by, bn] = b.split("-").map(Number);
      return by - ay || an - bn;
    });
  const years = Array.from(new Set(questions.map((question) => question.year))).sort((a, b) => b - a);
  const variants = Array.from(new Set(questions.flatMap((question) => question.conceptTags))).sort((a, b) =>
    a.localeCompare(b, "ko"),
  );

  return {
    id: conceptId(label),
    label,
    category: categoryForLecture(lectureIds[0]),
    lectureIds,
    questionIds: questions.map((question) => question.id),
    refs,
    years,
    frequency: questions.length,
    sourceLabel: lectureIds.map(lectureLabel).join(" · "),
    definition: representative.basis,
    examCue: representative.examSkill,
    wrongRule: representative.wrongRule,
    variants,
    visuals: conceptVisuals[label],
  };
}).sort((a, b) => b.frequency - a.frequency || a.label.localeCompare(b.label, "ko"));
