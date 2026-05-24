export type AlgorithmChapterId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface AlgorithmQuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  wrongNote: string;
}

export interface AlgorithmLecture {
  id: number;
  title: string;
  subtitle: string;
  chapter: AlgorithmChapterId;
  chapterTitle: string;
  examCount: number;
  lectureSource: string;
  textbookSource: string;
  colorClass: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  bgLightClass: string;
  summary: string;
  keywords: string[];
  examKeywords: string[];
  concepts: {
    title: string;
    body: string;
    formula?: string;
    example?: string;
  }[];
  procedures: {
    title: string;
    steps: string[];
  }[];
  pitfalls: string[];
  visualizers: {
    label: string;
    algorithmId: string;
    category: "sort" | "search" | "graph";
  }[];
  quiz: AlgorithmQuizQuestion[];
}

export interface AlgorithmLectureAddendum {
  sourceCheck: string[];
  coverage: {
    title: string;
    items: string[];
  }[];
  tables: {
    title: string;
    headers: string[];
    rows: string[][];
  }[];
  drills: {
    title: string;
    prompt: string;
    checks: string[];
  }[];
  visualAudit: {
    topic: string;
    status: string;
    detail: string;
    href?: string;
  }[];
}

export const algorithmChapterWeights = [
  { chapter: 1, title: "알고리즘 소개", count: 3, lectures: [1, 2] },
  { chapter: 2, title: "정렬", count: 7, lectures: [3, 4, 5] },
  { chapter: 3, title: "탐색", count: 4, lectures: [6, 7] },
  { chapter: 4, title: "그래프", count: 6, lectures: [8, 9, 10] },
  { chapter: 5, title: "동적 프로그래밍", count: 1, lectures: [11] },
  { chapter: 6, title: "스트링 알고리즘", count: 3, lectures: [12, 13, 14] },
  { chapter: 7, title: "NP-완전 문제", count: 1, lectures: [15] },
] as const;

const palette = [
  ["bg-blue-500", "text-blue-600 dark:text-blue-400", "border-blue-500", "bg-blue-50 dark:bg-blue-950/40", "blue"],
  ["bg-emerald-500", "text-emerald-600 dark:text-emerald-400", "border-emerald-500", "bg-emerald-50 dark:bg-emerald-950/40", "emerald"],
  ["bg-amber-500", "text-amber-600 dark:text-amber-400", "border-amber-500", "bg-amber-50 dark:bg-amber-950/40", "amber"],
  ["bg-rose-500", "text-rose-600 dark:text-rose-400", "border-rose-500", "bg-rose-50 dark:bg-rose-950/40", "rose"],
  ["bg-cyan-500", "text-cyan-600 dark:text-cyan-400", "border-cyan-500", "bg-cyan-50 dark:bg-cyan-950/40", "cyan"],
] as const;

function style(index: number) {
  const [bgClass, textClass, borderClass, bgLightClass, colorClass] = palette[index % palette.length];
  return { bgClass, textClass, borderClass, bgLightClass, colorClass };
}

export const algorithmLectures: AlgorithmLecture[] = [
  {
    id: 1,
    title: "알고리즘 정의와 설계 기법",
    subtitle: "정의, 조건, 대표 설계 기법, 배낭 문제",
    chapter: 1,
    chapterTitle: "알고리즘 소개",
    examCount: 3,
    lectureSource: "강의록 1강",
    textbookSource: "교재 1장 1.1~1.2",
    ...style(0),
    summary:
      "알고리즘을 문제 해결을 위한 단계적인 처리 과정으로 정의하고, 이론적 조건과 실무적 조건을 구분한다. 분할정복, 욕심쟁이, 동적 프로그래밍, 백트래킹 등 대표 설계 기법은 적용 문제와 함께 묶어 기억한다.",
    keywords: ["알고리즘", "입력", "출력", "명확성", "유한성", "정확성", "효율성", "욕심쟁이 방법", "분할정복", "동적 프로그래밍", "배낭 문제"],
    examKeywords: ["알고리즘 정의와 조건", "대표 설계 기법의 개념/특징", "배낭 문제의 적용 기법"],
    concepts: [
      { title: "알고리즘 조건", body: "입력과 출력이 명시되고, 각 단계가 명확하며, 유한 시간 안에 종료하고, 모든 유효 입력에 대해 정확한 결과를 생성해야 한다. 효율성은 실무적 조건으로 함께 평가한다." },
      { title: "설계 기법", body: "욕심쟁이 방법은 현재의 최선 선택을 반복하고, 분할정복은 문제를 독립 부분문제로 나누며, 동적 프로그래밍은 중복되는 소문제의 해를 저장한다." },
      { title: "배낭 문제", body: "물체의 이익과 무게가 주어질 때 제한 용량 안에서 최대 이익을 구하는 최적화 문제다. 분할 가능 여부에 따라 욕심쟁이 방법과 동적 프로그래밍 적용이 달라진다." },
    ],
    procedures: [
      { title: "알고리즘 판정 순서", steps: ["입력과 출력이 정의되어 있는지 확인", "각 단계가 모호하지 않은지 확인", "종료 조건이 있는지 확인", "모든 입력에서 정답을 내는지 확인", "시간/공간 비용이 현실적인지 검토"] },
    ],
    pitfalls: ["항상 종료하는 절차라도 정답을 보장하지 않으면 알고리즘으로 보기 어렵다.", "욕심쟁이 선택은 모든 최적화 문제에서 최적해를 보장하지 않는다.", "배낭 문제는 분할 가능한 경우와 0/1 경우를 구분해야 한다."],
    visualizers: [],
    quiz: [
      { question: "알고리즘의 이론적 조건으로 가장 직접적인 것은?", options: ["정확성", "사용자 친화성", "코드 줄 수"], answer: 0, explanation: "근거: 교재 1장은 유한성, 명확성, 입력, 출력, 정확성을 알고리즘 조건으로 다룬다.", wrongNote: "오답 기준: 구현 편의나 코드 길이는 알고리즘 조건 자체가 아니다." },
      { question: "욕심쟁이 방법의 핵심 설명은?", options: ["현재 단계에서 최선으로 보이는 선택을 반복", "모든 가능한 해를 무조건 열거", "항상 테이블을 채워 해를 저장"], answer: 0, explanation: "근거: 욕심쟁이 방법은 매 단계의 국소적 선택을 통해 해를 구성한다.", wrongNote: "오답 기준: 무조건 열거는 완전 탐색, 테이블 저장은 동적 프로그래밍 쪽 특징이다." },
      { question: "동적 프로그래밍을 적용하기 쉬운 조건은?", options: ["중복 부분문제와 최적성의 원리", "입력이 이미 정렬됨", "간선 가중치가 모두 같음"], answer: 0, explanation: "근거: 교재는 소문제 최적해와 테이블 저장을 동적 프로그래밍의 핵심으로 설명한다.", wrongNote: "오답 기준: 정렬 여부와 간선 조건은 특정 알고리즘의 조건일 수 있으나 DP 일반 조건은 아니다." },
      { question: "분할정복 설명으로 적절한 것은?", options: ["문제를 나누고, 부분문제를 풀고, 결과를 결합", "해시 함수를 적용해 주소를 계산", "큐를 사용해 가까운 정점부터 방문"], answer: 0, explanation: "근거: 분할정복은 분할, 정복, 결합의 구조를 갖는다.", wrongNote: "오답 기준: 해시는 탐색 자료구조, 큐 기반 방문은 BFS 설명이다." },
      { question: "0/1 배낭 문제에서 특히 주의할 점은?", options: ["물체를 쪼갤 수 없음", "항상 단위 무게 이익순으로 최적해 보장", "정렬 알고리즘으로만 해결"], answer: 0, explanation: "근거: 0/1 배낭은 선택 여부가 0 또는 1로 제한된다.", wrongNote: "오답 기준: 단위 무게 이익순 선택은 분할 가능한 배낭에서 더 자연스러운 기준이다." },
    ],
  },
  {
    id: 2,
    title: "성능 분석과 점화식",
    subtitle: "시간/공간 복잡도, 점근 표기, 기본 점화식",
    chapter: 1,
    chapterTitle: "알고리즘 소개",
    examCount: 3,
    lectureSource: "강의록 2강",
    textbookSource: "교재 1장 1.3~1.4",
    ...style(1),
    summary:
      "알고리즘 분석은 정확성과 효율성을 분리해서 본다. 기말에서는 시간 복잡도 계산, 공간 복잡도 개념, Big-O/Ω/Θ의 의미, 빅오 함수의 크기 관계, 기본 점화식 성능을 묻는다.",
    keywords: ["시간 복잡도", "공간 복잡도", "최선 수행시간", "평균 수행시간", "최악 수행시간", "Big-O", "Big-Ω", "Big-Θ", "점화식", "순환 알고리즘"],
    examKeywords: ["주어진 프로그램의 시간 복잡도", "점근 성능 표기법", "빅오 함수의 크기 관계", "기본 점화식과 성능"],
    concepts: [
      { title: "시간 복잡도", body: "알고리즘의 각 문장이나 기본 연산이 수행되는 횟수를 입력 크기 $n$의 함수로 표현한다.", formula: "$T(n)=\\sum$ 각 연산의 수행 횟수" },
      { title: "공간 복잡도", body: "알고리즘 수행에 필요한 메모리 양이며 정적 공간과 동적 공간을 함께 본다." },
      { title: "점근 성능", body: "입력 크기가 충분히 커질 때 최고차항 중심으로 증가율을 비교한다. $O$, $\\Omega$, $\\Theta$의 정의 방향을 구분한다." },
    ],
    procedures: [
      { title: "시간 복잡도 계산", steps: ["입력 크기 $n$ 정의", "반복문과 순환 호출 횟수 계산", "중첩 반복은 곱으로 계산", "낮은 차수항과 상수 계수 제거", "최선/평균/최악 중 문제에서 묻는 기준 확인"] },
      { title: "점화식 해석", steps: ["부분문제 개수 확인", "부분문제 크기 확인", "분할/결합 비용 확인", "기본형 점화식과 비교", "성장 차수로 정리"] },
    ],
    pitfalls: ["$O$는 상한, $\\Omega$는 하한, $\\Theta$는 상하한을 동시에 의미한다.", "입력 데이터의 상태에 따라 최선/평균/최악이 달라지는 알고리즘을 구분해야 한다.", "순환 알고리즘은 호출 횟수와 각 호출의 작업량을 함께 본다."],
    visualizers: [],
    quiz: [
      { question: "최악 수행시간을 주로 비교 기준으로 쓰는 이유는?", options: ["어떤 입력에도 넘지 않는 수행시간을 보장하기 때문", "항상 가장 작은 값이기 때문", "확률분포가 필요하기 때문"], answer: 0, explanation: "근거: 최악 수행시간은 모든 입력에 대한 보장치를 준다.", wrongNote: "오답 기준: 가장 작은 값은 최선 수행시간이고, 확률분포는 평균 수행시간 계산에 필요하다." },
      { question: "$3n^2+10n+7$의 점근적 차수는?", options: ["$O(n^2)$", "$O(n)$", "$O(1)$"], answer: 0, explanation: "근거: 최고차항이 $n^2$이고 상수 계수는 제거한다.", wrongNote: "오답 기준: 낮은 차수항이나 상수항을 대표 차수로 삼으면 안 된다." },
      { question: "공간 복잡도 설명으로 맞는 것은?", options: ["알고리즘 수행에 필요한 메모리 양", "CPU 클록 속도", "출력값의 정답 여부"], answer: 0, explanation: "근거: 공간 복잡도는 정적 공간과 동적 공간을 포함한 메모리 사용량이다.", wrongNote: "오답 기준: 클록 속도는 실행 환경 요소이고 정답 여부는 정확성 문제다." },
      { question: "$T(n)=T(n-1)+1$의 기본 성능은?", options: ["$O(n)$", "$O(\\log n)$", "$O(n^2)$"], answer: 0, explanation: "근거: 크기를 1씩 줄이며 상수 작업을 하므로 호출 수가 $n$에 비례한다.", wrongNote: "오답 기준: 절반씩 줄지 않으므로 로그가 아니고, 중첩 합이 아니면 제곱이 아니다." },
      { question: "$\\Theta(f(n))$의 의미는?", options: ["상한과 하한이 모두 $f(n)$ 수준", "상한만 표시", "하한만 표시"], answer: 0, explanation: "근거: $\\Theta$는 점근적으로 같은 차수임을 나타낸다.", wrongNote: "오답 기준: 상한만은 $O$, 하한만은 $\\Omega$다." },
    ],
  },
  {
    id: 3,
    title: "기초 정렬",
    subtitle: "버블, 선택, 삽입, 셸 정렬과 정렬 분류",
    chapter: 2,
    chapterTitle: "정렬",
    examCount: 7,
    lectureSource: "강의록 3강",
    textbookSource: "교재 2장 2.1~2.2",
    ...style(2),
    summary:
      "정렬의 내부/외부, 안정적, 제자리, 비교 기반 여부를 먼저 구분한다. 선택, 버블, 삽입, 셸 정렬은 처리 과정과 입력 상태에 따른 성능 차이가 핵심이다.",
    keywords: ["내부 정렬", "안정적 정렬", "제자리 정렬", "비교 기반 정렬", "버블 정렬", "선택 정렬", "삽입 정렬", "셸 정렬"],
    examKeywords: ["버블 정렬 개념 및 적용", "선택 정렬 처리 과정", "삽입 정렬 성능/특징", "셸 정렬과 삽입 정렬의 관계", "최선/최악/평균 성능"],
    concepts: [
      { title: "안정적 정렬", body: "같은 키값을 가진 데이터의 상대적 순서가 정렬 후에도 보존되는 정렬이다." },
      { title: "선택 정렬", body: "미정렬 부분에서 최솟값을 찾아 앞자리와 교환한다. 교환 횟수는 적지만 안정적이지 않다." },
      { title: "삽입 정렬", body: "앞쪽의 정렬된 부분에 현재 원소를 끼워 넣는다. 거의 정렬된 입력에서 빠르다." },
      { title: "셸 정렬", body: "간격을 둔 부분 리스트에 삽입 정렬을 적용하고 간격을 줄여 마지막에 일반 삽입 정렬을 수행한다." },
    ],
    procedures: [
      { title: "선택 정렬 한 패스", steps: ["미정렬 부분의 시작 위치 결정", "최솟값 위치 탐색", "시작 위치와 최솟값 교환", "미정렬 부분을 한 칸 줄임"] },
      { title: "삽입 정렬 한 패스", steps: ["현재 원소를 임시 저장", "왼쪽 정렬 부분에서 큰 원소를 오른쪽으로 이동", "삽입 위치에 현재 원소 배치"] },
    ],
    pitfalls: ["버블 정렬은 개선 여부에 따라 최선 성능 설명이 달라질 수 있다.", "선택 정렬은 비교 횟수가 입력 상태와 크게 무관하다.", "삽입 정렬은 데이터 입력 상태에 따라 성능 차이가 크다."],
    visualizers: [
      { label: "선택 정렬", algorithmId: "selection", category: "sort" },
      { label: "버블 정렬", algorithmId: "bubble", category: "sort" },
      { label: "삽입 정렬", algorithmId: "insertion", category: "sort" },
      { label: "셸 정렬", algorithmId: "shell", category: "sort" },
    ],
    quiz: [
      { question: "정렬 전 같은 키의 상대 순서가 보존되는 성질은?", options: ["안정적", "제자리", "외부"], answer: 0, explanation: "근거: 안정적 정렬은 동일 키 데이터의 상대 순서를 보존한다.", wrongNote: "오답 기준: 제자리는 추가 공간 기준, 외부 정렬은 저장 위치 기준이다." },
      { question: "선택 정렬의 핵심 처리 과정은?", options: ["미정렬 부분의 최솟값을 찾아 앞자리와 교환", "인접 원소만 계속 교환", "해시 주소 계산"], answer: 0, explanation: "근거: 선택 정렬은 각 패스에서 최솟값 선택 후 교환한다.", wrongNote: "오답 기준: 인접 교환 중심은 버블 정렬이다." },
      { question: "거의 정렬된 입력에서 유리한 정렬은?", options: ["삽입 정렬", "계수 정렬", "힙 정렬"], answer: 0, explanation: "근거: 삽입 정렬의 이동 횟수는 역전 수에 크게 좌우된다.", wrongNote: "오답 기준: 계수 정렬은 값의 범위 조건, 힙 정렬은 입력 상태와 무관하게 $O(n\\log n)$이다." },
      { question: "셸 정렬은 어떤 정렬을 일반화한 형태인가?", options: ["삽입 정렬", "합병 정렬", "기수 정렬"], answer: 0, explanation: "근거: 셸 정렬은 간격이 있는 부분 리스트에 삽입 정렬을 적용한다.", wrongNote: "오답 기준: 합병/기수 정렬과는 처리 원리가 다르다." },
      { question: "입력 배열 외 상수 개 저장 공간만 쓰는 성질은?", options: ["제자리 정렬", "안정적 정렬", "선형 시간 정렬"], answer: 0, explanation: "근거: 제자리 정렬은 추가 공간이 상수 수준인 정렬이다.", wrongNote: "오답 기준: 안정성은 상대 순서, 선형 시간은 시간 복잡도 기준이다." },
    ],
  },
  {
    id: 4,
    title: "퀵 정렬과 합병 정렬",
    subtitle: "partition(), merge(), 부분배열, 분할정복",
    chapter: 2,
    chapterTitle: "정렬",
    examCount: 7,
    lectureSource: "강의록 4강",
    textbookSource: "교재 2장 2.3",
    ...style(3),
    summary:
      "퀵 정렬은 피벗을 기준으로 부분배열을 나누고, 합병 정렬은 정렬된 부분배열을 합병한다. 기말에서는 partition() 적용, merge() 적용, 입력 상태에 따른 퀵 정렬 성능과 분할함수 호출 횟수가 중요하다.",
    keywords: ["퀵 정렬", "피벗", "부분배열", "partition()", "합병 정렬", "merge()", "분할정복", "안정성"],
    examKeywords: ["퀵 정렬 partition() 적용", "입력 상태에 따른 성능", "분할함수 호출 횟수", "합병 함수 merge()"],
    concepts: [
      { title: "퀵 정렬", body: "피벗이 제자리를 잡도록 분할한 뒤 왼쪽과 오른쪽 부분배열에 순환적으로 퀵 정렬을 적용한다." },
      { title: "partition()", body: "피벗보다 작은 원소와 큰 원소를 양쪽으로 나누어 피벗의 최종 위치를 결정한다." },
      { title: "합병 정렬", body: "배열을 반으로 나누어 각각 정렬한 뒤 merge()로 하나의 정렬 배열을 만든다. 안정적이지만 추가 공간이 필요하다." },
    ],
    procedures: [
      { title: "partition() 추적", steps: ["피벗 선택", "왼쪽/오른쪽 스캔 위치 설정", "피벗 기준으로 교환", "스캔이 교차하면 피벗을 제자리로 이동", "피벗 왼쪽/오른쪽 부분배열 확인"] },
      { title: "merge() 추적", steps: ["두 정렬 부분배열의 첫 원소 비교", "작은 원소를 보조 배열로 이동", "한쪽이 비면 나머지를 복사", "원래 배열 구간에 결과 복사"] },
    ],
    pitfalls: ["첫 원소 피벗과 이미 정렬된 입력은 퀵 정렬 최악 사례가 될 수 있다.", "합병 정렬은 안정적이지만 제자리 정렬로 분류하지 않는다.", "부분배열 경계를 잘못 잡으면 partition() 결과가 틀린다."],
    visualizers: [
      { label: "퀵 정렬", algorithmId: "quick", category: "sort" },
      { label: "합병 정렬", algorithmId: "merge", category: "sort" },
    ],
    quiz: [
      { question: "퀵 정렬의 피벗 역할은?", options: ["분할 후 자신의 최종 위치를 잡는 기준 원소", "보조 배열의 마지막 원소", "해시 함수의 나머지"], answer: 0, explanation: "근거: 피벗은 분할 기준이며 분할 후 제자리를 잡는다.", wrongNote: "오답 기준: 보조 배열은 합병 정렬 쪽 설명이다." },
      { question: "첫 원소 피벗 퀵 정렬에서 정렬된 입력의 위험은?", options: ["분할이 한쪽으로 치우쳐 $O(n^2)$", "항상 $O(n)$", "안정성이 생김"], answer: 0, explanation: "근거: 부분배열 크기가 $n-1$과 0으로 반복되면 최악 시간이 된다.", wrongNote: "오답 기준: 정렬 입력이라고 항상 빠른 것이 아니다." },
      { question: "합병 정렬의 핵심 함수는?", options: ["merge()", "find()", "hash()"], answer: 0, explanation: "근거: 합병 정렬은 정렬된 두 부분배열을 merge()로 합친다.", wrongNote: "오답 기준: find/hash는 탐색과 관련된다." },
      { question: "합병 정렬의 일반적 시간복잡도는?", options: ["$O(n\\log n)$", "$O(n^2)$", "$O(1)$"], answer: 0, explanation: "근거: 매 레벨에서 $O(n)$ 합병, 레벨 수 $O(\\log n)$이다.", wrongNote: "오답 기준: 기본 합병 정렬은 입력 상태와 무관하게 같은 차수로 수행된다." },
      { question: "부분배열 개념을 직접 쓰는 대표 정렬은?", options: ["퀵 정렬과 합병 정렬", "순차 탐색", "선형 탐사"], answer: 0, explanation: "근거: 둘 다 배열 구간을 나누어 처리한다.", wrongNote: "오답 기준: 탐색 방법은 정렬의 부분배열 분할 절차가 아니다." },
    ],
  },
  {
    id: 5,
    title: "힙 정렬과 선형 시간 정렬",
    subtitle: "힙, 계수, 기수, 버킷 정렬",
    chapter: 2,
    chapterTitle: "정렬",
    examCount: 7,
    lectureSource: "강의록 5강",
    textbookSource: "교재 2장 2.3~2.4",
    ...style(4),
    summary:
      "힙 정렬은 힙 자료구조를 이용해 최댓값 삭제를 반복한다. 계수, 기수, 버킷 정렬은 비교 기반이 아니며 선형 시간으로 동작하려면 입력 범위, 자리수, 분포 조건이 맞아야 한다.",
    keywords: ["힙", "완전 이진 트리", "힙 정렬", "초기 힙 구축", "계수 정렬", "기수 정렬", "안정적 정렬", "버킷 정렬", "비교 기반 하한"],
    examKeywords: ["힙 자료구조 성질", "초기 힙 구축 두 방법", "계수 정렬 개념", "기수 정렬과 안정적 정렬", "버킷 정렬 선형 조건", "비교 기반/제자리/안정 여부"],
    concepts: [
      { title: "힙", body: "완전 이진 트리 형태이며 최대 힙은 부모 키가 자식 키보다 크거나 같다." },
      { title: "계수 정렬", body: "각 값 이하의 원소 개수를 이용해 정렬 위치를 계산한다. 값의 범위 $k$가 성능에 직접 영향을 준다.", formula: "$O(n+k)$" },
      { title: "기수 정렬", body: "자리수별로 안정적인 정렬 알고리즘을 적용한다. 내부 정렬로 계수 정렬을 자주 사용한다." },
      { title: "버킷 정렬", body: "자료가 균등하게 분포하고 버킷 내부 처리가 작을 때 선형 시간에 가깝게 동작한다." },
    ],
    procedures: [
      { title: "힙 정렬 처리", steps: ["초기 최대 힙 구축", "루트 최댓값을 배열 끝과 교환", "힙 크기 감소", "루트에서 아래로 힙 재구성", "힙 크기가 1이 될 때까지 반복"] },
      { title: "기수 정렬 처리", steps: ["가장 낮은 자리 또는 높은 자리 선택", "해당 자리값으로 안정 정렬", "다음 자리로 이동", "모든 자리 처리 후 결과 확인"] },
    ],
    pitfalls: ["기수 정렬은 각 자리 정렬이 안정적이어야 이전 자리 순서가 보존된다.", "계수 정렬은 $k$가 크면 선형 시간 장점이 약해진다.", "버킷 정렬은 입력이 균등 분포한다는 조건을 확인해야 한다."],
    visualizers: [
      { label: "힙 정렬", algorithmId: "heap", category: "sort" },
      { label: "계수 정렬", algorithmId: "counting", category: "sort" },
      { label: "기수 정렬", algorithmId: "radix", category: "sort" },
      { label: "버킷 정렬", algorithmId: "bucket", category: "sort" },
    ],
    quiz: [
      { question: "최대 힙의 성질은?", options: ["부모 키가 자식 키보다 크거나 같음", "왼쪽 자식만 존재", "항상 정렬 배열"], answer: 0, explanation: "근거: 최대 힙은 루트에 최댓값이 오도록 부모-자식 관계를 유지한다.", wrongNote: "오답 기준: 힙은 완전 이진 트리지만 전체가 정렬된 배열은 아니다." },
      { question: "기수 정렬 내부에 필요한 정렬 성질은?", options: ["안정적 정렬", "불안정 정렬", "항상 제자리 정렬"], answer: 0, explanation: "근거: 자리별 정렬 후 이전 자리의 상대 순서를 유지해야 한다.", wrongNote: "오답 기준: 안정성이 없으면 낮은 자리 정렬 결과가 깨진다." },
      { question: "계수 정렬의 시간복잡도에 직접 포함되는 값은?", options: ["값의 범위 $k$", "그래프 간선 수", "패턴 길이만"], answer: 0, explanation: "근거: 계수 배열 크기와 누적 처리에 $k$가 들어간다.", wrongNote: "오답 기준: 간선 수와 패턴 길이는 다른 장의 변수다." },
      { question: "버킷 정렬이 선형 시간에 가까운 조건은?", options: ["데이터가 버킷에 균등 분포", "데이터가 역순", "키값이 모두 문자열"], answer: 0, explanation: "근거: 버킷 내부 정렬 부담이 작아야 전체가 선형에 가까워진다.", wrongNote: "오답 기준: 역순 여부만으로 버킷 정렬 성능을 보장하지 않는다." },
      { question: "힙 정렬의 일반적 안정성은?", options: ["안정적이지 않음", "항상 안정적", "입력이 정렬되면 안정적"], answer: 0, explanation: "근거: 힙 재구성 과정에서 동일 키의 상대 순서가 보장되지 않는다.", wrongNote: "오답 기준: 입력 상태만으로 안정성이 보장되는 것은 아니다." },
    ],
  },
  {
    id: 6,
    title: "기초 탐색과 탐색 트리",
    subtitle: "순차 탐색, 이진 탐색, BST, 2-3-4 트리",
    chapter: 3,
    chapterTitle: "탐색",
    examCount: 4,
    lectureSource: "강의록 6강",
    textbookSource: "교재 3장 3.1~3.2",
    ...style(0),
    summary:
      "탐색은 주어진 데이터에서 원하는 키를 찾는 연산이다. 순차 탐색은 비정렬 데이터에 적용 가능하고, 이진 탐색은 정렬된 배열을 전제로 한다. BST와 2-3-4 트리는 삽입·삭제 과정 추적이 중요하다.",
    keywords: ["순차 탐색", "이진 탐색", "초기화", "삽입", "삭제", "이진 탐색 트리", "2-3-4 트리", "노드 분할"],
    examKeywords: ["순차 탐색 특징/장점", "이진 탐색 탐색/삽입/초기화 시간", "BST 삽입 후 탐색", "BST 노드 삭제", "2-3-4 트리 키 삽입"],
    concepts: [
      { title: "순차 탐색", body: "리스트의 원소를 처음부터 차례대로 비교한다. 정렬되지 않은 작은 데이터에도 적용 가능하다." },
      { title: "이진 탐색", body: "정렬된 배열에서 중간 원소와 비교해 탐색 범위를 절반씩 줄인다.", formula: "$O(\\log n)$" },
      { title: "이진 탐색 트리", body: "왼쪽 서브트리 키 < 루트 키 < 오른쪽 서브트리 키를 만족하는 트리다." },
      { title: "2-3-4 트리", body: "한 노드가 1~3개의 키를 가질 수 있는 균형 탐색 트리이며 삽입 과정에서 노드 분할을 수행한다." },
    ],
    procedures: [
      { title: "이진 탐색 추적", steps: ["low와 high 설정", "mid 계산", "키와 중간값 비교", "왼쪽 또는 오른쪽 절반 선택", "찾거나 범위가 빌 때까지 반복"] },
      { title: "BST 삭제", steps: ["삭제할 노드 탐색", "자식이 없으면 제거", "자식 하나면 자식으로 대체", "자식 둘이면 후속자 또는 선행자로 대체"] },
    ],
    pitfalls: ["이진 탐색은 정렬 상태가 선행 조건이다.", "BST는 입력 순서에 따라 편향될 수 있다.", "2-3-4 트리는 삽입 중 4-노드 분할 위치를 정확히 추적해야 한다."],
    visualizers: [
      { label: "순차 탐색", algorithmId: "sequential-search", category: "search" },
      { label: "이진 탐색", algorithmId: "binary-search", category: "search" },
      { label: "BST", algorithmId: "bst", category: "search" },
      { label: "2-3-4 트리", algorithmId: "tree-234", category: "search" },
    ],
    quiz: [
      { question: "이진 탐색의 선행 조건은?", options: ["자료가 정렬되어 있음", "해시 함수가 있음", "그래프가 연결됨"], answer: 0, explanation: "근거: 절반을 버리는 판단은 전체 순서가 있을 때 성립한다.", wrongNote: "오답 기준: 해시/그래프 조건은 이진 탐색의 조건이 아니다." },
      { question: "순차 탐색의 장점은?", options: ["정렬되지 않은 데이터에도 적용 가능", "항상 $O(1)$", "항상 균형 트리 생성"], answer: 0, explanation: "근거: 순차 탐색은 처음부터 차례로 비교하므로 정렬이 필요 없다.", wrongNote: "오답 기준: 최악 탐색은 $O(n)$이다." },
      { question: "BST에서 왼쪽 서브트리의 키 관계는?", options: ["루트보다 작음", "루트보다 큼", "루트와 항상 같음"], answer: 0, explanation: "근거: BST 성질은 왼쪽 < 루트 < 오른쪽이다.", wrongNote: "오답 기준: 오른쪽 서브트리와 혼동하면 삽입/탐색 결과가 틀린다." },
      { question: "BST에서 자식 둘인 노드 삭제 시 흔히 쓰는 대체값은?", options: ["중위 후속자", "임의의 루트", "해시값"], answer: 0, explanation: "근거: 오른쪽 서브트리의 최솟값인 중위 후속자로 대체하면 BST 성질을 유지한다.", wrongNote: "오답 기준: 임의 값은 탐색 트리 순서를 깨뜨릴 수 있다." },
      { question: "2-3-4 트리 삽입에서 4-노드를 만나면?", options: ["분할", "무조건 삭제", "선형 탐사"], answer: 0, explanation: "근거: 2-3-4 트리는 꽉 찬 노드를 분할하며 균형을 유지한다.", wrongNote: "오답 기준: 선형 탐사는 해싱의 충돌 처리다." },
    ],
  },
  {
    id: 7,
    title: "균형 탐색 트리와 해싱",
    subtitle: "레드-블랙 트리, B-트리, 해시 테이블, 선형 탐사",
    chapter: 3,
    chapterTitle: "탐색",
    examCount: 4,
    lectureSource: "강의록 7강",
    textbookSource: "교재 3장 3.3~3.4",
    ...style(1),
    summary:
      "레드-블랙 트리는 2-3-4 트리를 이진 탐색 트리로 표현한 균형 탐색 트리다. B-트리는 외부 탐색에 적합하고, 해싱은 키를 주소로 변환하되 충돌 처리 방식이 성능을 좌우한다.",
    keywords: ["레드-블랙 트리", "빨강 노드", "검정 노드", "회전", "B-트리", "해싱", "해시 함수", "충돌", "개방 해싱", "폐쇄 해싱", "선형 탐사", "1차 클러스터링"],
    examKeywords: ["2-3-4 트리의 레드-블랙 표현", "레드-블랙 트리 키 삽입", "균형 탐색 트리 종류", "해싱 개념", "선형 탐사"],
    concepts: [
      { title: "레드-블랙 트리", body: "이진 탐색 트리이면서 색깔 규칙으로 높이를 제한한다. 삽입 시 색깔 변경과 회전이 필요할 수 있다." },
      { title: "B-트리", body: "하나의 노드에 여러 키를 저장해 디스크 접근 횟수를 줄이는 균형 탐색 트리다." },
      { title: "해싱", body: "해시 함수로 키를 테이블 주소로 바꾼다. 서로 다른 키가 같은 주소를 얻으면 충돌이 발생한다." },
      { title: "선형 탐사", body: "충돌 시 다음 칸을 순서대로 검사하는 폐쇄 해싱 방법이다. 1차 클러스터링에 주의한다." },
    ],
    procedures: [
      { title: "레드-블랙 삽입", steps: ["BST 방식으로 새 빨강 노드 삽입", "부모가 검정이면 종료", "부모와 삼촌 색 확인", "색깔 변경 또는 회전 적용", "루트를 검정으로 유지"] },
      { title: "선형 탐사", steps: ["해시 주소 계산", "비어 있으면 삽입", "차 있으면 다음 칸 검사", "빈 칸 또는 키를 찾을 때까지 반복"] },
    ],
    pitfalls: ["레드-블랙 트리 탐색은 BST 탐색과 동일하지만 삽입은 색과 회전이 추가된다.", "B-트리의 키 개수 범위는 차수 정의와 함께 봐야 한다.", "선형 탐사는 군집화가 성능을 떨어뜨릴 수 있다."],
    visualizers: [
      { label: "레드-블랙 트리", algorithmId: "red-black-tree", category: "search" },
      { label: "B-트리", algorithmId: "b-tree", category: "search" },
      { label: "해시 테이블", algorithmId: "hash-table", category: "search" },
    ],
    quiz: [
      { question: "레드-블랙 트리는 어떤 트리를 이진 탐색 트리로 표현한 것으로 볼 수 있는가?", options: ["2-3-4 트리", "힙", "인접 행렬"], answer: 0, explanation: "근거: 강의록은 2-3-4 트리와 레드-블랙 트리의 대응을 다룬다.", wrongNote: "오답 기준: 힙은 우선순위 자료구조이고 인접 행렬은 그래프 표현이다." },
      { question: "B-트리가 외부 탐색에 적합한 이유는?", options: ["한 노드에 여러 키를 담아 접근 횟수를 줄임", "항상 배열 한 칸만 사용", "충돌을 무시함"], answer: 0, explanation: "근거: B-트리는 디스크 블록 단위 접근에 맞게 노드에 여러 키를 저장한다.", wrongNote: "오답 기준: 배열 한 칸, 충돌 무시는 B-트리 설명이 아니다." },
      { question: "해싱에서 충돌이란?", options: ["서로 다른 키가 같은 주소를 얻음", "트리 높이가 0이 됨", "정렬이 안정적임"], answer: 0, explanation: "근거: 해시 함수 결과가 같으면 같은 버킷을 두 키가 요구한다.", wrongNote: "오답 기준: 트리/정렬 성질과 혼동하면 안 된다." },
      { question: "선형 탐사의 충돌 처리 방식은?", options: ["다음 위치를 순차적으로 검사", "항상 새 트리 생성", "모든 간선 정렬"], answer: 0, explanation: "근거: 선형 탐사는 한 칸씩 이동하며 빈 칸을 찾는다.", wrongNote: "오답 기준: 간선 정렬은 크루스칼 알고리즘이다." },
      { question: "해시 테이블 삭제에서 tombstone이 필요한 이유는?", options: ["탐사 경로를 끊지 않기 위해", "루트 색을 검정으로 바꾸기 위해", "버킷을 정렬하기 위해"], answer: 0, explanation: "근거: 폐쇄 해싱에서 중간 칸을 완전 빈칸으로 만들면 뒤쪽 키 탐색이 실패할 수 있다.", wrongNote: "오답 기준: 색 변경은 레드-블랙 트리 삽입과 관련된다." },
    ],
  },
  {
    id: 8,
    title: "그래프 표현과 순회",
    subtitle: "인접 행렬, 인접 리스트, DFS, BFS, 위상 정렬, 강연결 성분",
    chapter: 4,
    chapterTitle: "그래프",
    examCount: 6,
    lectureSource: "강의록 8강",
    textbookSource: "교재 4장 4.1~4.2",
    ...style(2),
    summary:
      "그래프는 $G=(V,E)$로 표현한다. 인접 행렬과 인접 리스트의 공간/연산 차이, DFS/BFS 방문 순서, 위상 정렬과 강연결 성분의 적용 조건을 중심으로 정리한다.",
    keywords: ["그래프", "정점", "간선", "인접 행렬", "인접 리스트", "DFS", "BFS", "위상 정렬", "강연결 성분"],
    examKeywords: ["그래프 표현", "그래프 순회 방법 종류와 개념", "DFS 방문 순서", "위상 정렬", "강연결 성분"],
    concepts: [
      { title: "인접 행렬", body: "정점 쌍의 간선 존재 여부를 행렬로 표시한다. 간선 존재 확인은 빠르지만 공간은 $O(|V|^2)$이다." },
      { title: "인접 리스트", body: "각 정점에 연결된 정점 목록을 저장한다. 희소 그래프에서 공간 효율이 좋다.", formula: "$O(|V|+|E|)$" },
      { title: "DFS/BFS", body: "DFS는 가능한 깊게 진행하고, BFS는 가까운 정점부터 계층적으로 방문한다." },
      { title: "강연결 성분", body: "방향 그래프에서 구성 정점들이 서로 양방향으로 도달 가능한 최대 부분 그래프다." },
    ],
    procedures: [
      { title: "DFS 방문 순서", steps: ["시작 정점 방문", "아직 방문하지 않은 인접 정점으로 이동", "더 갈 곳이 없으면 되돌아감", "모든 정점 방문까지 반복"] },
      { title: "위상 정렬", steps: ["진입차수 0인 정점 선택", "정점을 결과에 추가", "나가는 간선 제거", "새로 진입차수 0이 된 정점 반복 선택"] },
      { title: "강연결 성분", steps: ["원 그래프에서 DFS 완료 순서 기록", "전치 그래프 생성", "완료 순서가 큰 정점부터 DFS", "각 DFS 트리를 하나의 강연결 성분으로 묶음"] },
    ],
    pitfalls: ["위상 정렬은 방향 비순환 그래프에서만 가능하다.", "DFS 방문 순서는 인접 리스트의 순서에 따라 달라질 수 있다.", "무방향 연결 성분과 방향 강연결 성분을 구분해야 한다."],
    visualizers: [
      { label: "DFS", algorithmId: "dfs", category: "graph" },
      { label: "BFS", algorithmId: "bfs", category: "graph" },
      { label: "위상 정렬", algorithmId: "topological-sort", category: "graph" },
      { label: "강연결 성분", algorithmId: "strongly-connected-components", category: "graph" },
    ],
    quiz: [
      { question: "희소 그래프 표현에 일반적으로 유리한 것은?", options: ["인접 리스트", "인접 행렬", "정렬 배열"], answer: 0, explanation: "근거: 인접 리스트는 존재하는 간선 중심으로 저장해 $O(|V|+|E|)$ 공간을 쓴다.", wrongNote: "오답 기준: 인접 행렬은 간선이 적어도 $|V|^2$ 공간을 쓴다." },
      { question: "DFS의 기본 진행 방식은?", options: ["깊게 방문 후 되돌아감", "항상 가까운 정점부터 계층 방문", "간선을 가중치순 정렬"], answer: 0, explanation: "근거: DFS는 최근에 발견한 정점의 인접 정점을 우선 방문한다.", wrongNote: "오답 기준: 가까운 정점부터는 BFS, 가중치순 간선 선택은 MST 관련이다." },
      { question: "위상 정렬의 적용 대상은?", options: ["방향 비순환 그래프", "모든 무방향 그래프", "음수 간선 그래프"], answer: 0, explanation: "근거: 선후 관계를 만족하는 순서는 DAG에서 정의된다.", wrongNote: "오답 기준: 사이클이 있으면 모든 정점을 선행 관계대로 나열할 수 없다." },
      { question: "강연결 성분의 기준은?", options: ["방향 그래프에서 양방향 도달 가능", "간선 가중치가 모두 동일", "루트가 하나임"], answer: 0, explanation: "근거: 강연결은 임의 두 정점 사이에 서로 가는 경로가 있는 성질이다.", wrongNote: "오답 기준: 가중치나 루트 개념은 SCC 정의가 아니다." },
      { question: "BFS에서 자연스럽게 쓰는 자료구조는?", options: ["큐", "최소 힙만", "분할표"], answer: 0, explanation: "근거: BFS는 먼저 발견한 정점을 먼저 확장하므로 큐가 맞다.", wrongNote: "오답 기준: 최소 힙은 다익스트라 구현에서 자주 쓰인다." },
    ],
  },
  {
    id: 9,
    title: "MST와 데이크스트라",
    subtitle: "크루스칼, 프림, 최단 경로, 욕심쟁이 방법",
    chapter: 4,
    chapterTitle: "그래프",
    examCount: 6,
    lectureSource: "강의록 9강",
    textbookSource: "교재 4장 4.3~4.4.1",
    ...style(3),
    summary:
      "크루스칼과 프림은 최소 신장 트리를 구하는 욕심쟁이 알고리즘이다. 데이크스트라는 음이 아닌 가중치 그래프에서 단일 출발점 최단 경로를 구한다.",
    keywords: ["최소 신장 트리", "크루스칼", "프림", "Union-Find", "최단 경로", "데이크스트라", "욕심쟁이 방법", "음수 간선 한계"],
    examKeywords: ["크루스칼 적용", "프림 적용", "최단 경로 알고리즘과 설계 기법", "데이크스트라 개념/성능/한계/적용"],
    concepts: [
      { title: "최소 신장 트리", body: "연결된 가중 무방향 그래프에서 모든 정점을 포함하고 사이클이 없으며 간선 가중치 합이 최소인 트리다." },
      { title: "크루스칼", body: "간선을 가중치 증가 순으로 보며 사이클을 만들지 않는 간선을 선택한다." },
      { title: "프림", body: "하나의 정점에서 시작해 현재 트리에 인접한 최소 가중치 간선을 추가한다." },
      { title: "데이크스트라", body: "거리 추정값이 가장 작은 미확정 정점을 확정하며 완화한다. 음수 간선이 있으면 적용에 주의한다." },
    ],
    procedures: [
      { title: "크루스칼 적용", steps: ["모든 간선을 가중치 증가순 정렬", "가장 작은 간선부터 검사", "사이클을 만들지 않으면 선택", "선택 간선 수가 $|V|-1$이면 종료"] },
      { title: "데이크스트라 적용", steps: ["출발점 거리를 0, 나머지를 무한대로 설정", "미확정 정점 중 최단 거리 정점 선택", "인접 간선 완화", "모든 정점 확정까지 반복"] },
    ],
    pitfalls: ["MST는 무방향 연결 그래프에서 다룬다.", "크루스칼은 간선 중심, 프림은 정점 집합 확장 중심이다.", "데이크스트라는 음수 가중치 간선에서 일반적으로 사용하지 않는다."],
    visualizers: [
      { label: "크루스칼", algorithmId: "kruskal", category: "graph" },
      { label: "프림", algorithmId: "prim", category: "graph" },
      { label: "데이크스트라", algorithmId: "dijkstra", category: "graph" },
    ],
    quiz: [
      { question: "크루스칼 알고리즘의 선택 기준은?", options: ["가중치가 작은 간선부터, 사이클 제외", "출발점에서 가까운 정점만", "진입차수 0 정점"], answer: 0, explanation: "근거: 크루스칼은 간선을 정렬하고 사이클을 만들지 않는 간선을 고른다.", wrongNote: "오답 기준: 출발점 거리 기준은 데이크스트라, 진입차수는 위상 정렬이다." },
      { question: "프림 알고리즘의 진행 방식은?", options: ["현재 트리에 인접한 최소 간선 추가", "모든 간선을 먼저 삭제", "패턴을 오른쪽에서 비교"], answer: 0, explanation: "근거: 프림은 하나의 정점 집합을 확장한다.", wrongNote: "오답 기준: 문자열 비교는 스트링 매칭이다." },
      { question: "MST에 포함되는 간선 수는?", options: ["$|V|-1$", "$|V|+1$", "$|E|$ 전부"], answer: 0, explanation: "근거: 모든 정점을 포함하는 트리는 간선이 정점 수보다 하나 적다.", wrongNote: "오답 기준: 모든 간선을 포함하면 사이클이 생길 수 있다." },
      { question: "데이크스트라의 대표 한계는?", options: ["음수 가중치 간선에 부적합", "무방향 그래프만 처리", "정렬된 배열만 처리"], answer: 0, explanation: "근거: 음수 간선은 확정된 최단 거리 가정을 깨뜨릴 수 있다.", wrongNote: "오답 기준: 방향/무방향 모두 가중 조건에 따라 다룰 수 있다." },
      { question: "크루스칼과 프림의 공통 설계 기법은?", options: ["욕심쟁이 방법", "동적 프로그래밍", "백트래킹"], answer: 0, explanation: "근거: 매 단계에서 안전한 최소 비용 선택을 한다.", wrongNote: "오답 기준: 테이블 점화식이 핵심인 DP와 다르다." },
    ],
  },
  {
    id: 10,
    title: "최단 경로와 네트워크 플로",
    subtitle: "벨만-포드, 플로이드, 포드-풀커슨",
    chapter: 4,
    chapterTitle: "그래프",
    examCount: 6,
    lectureSource: "강의록 10강",
    textbookSource: "교재 4장 4.4.2~4.5",
    ...style(4),
    summary:
      "벨만-포드는 음수 간선을 허용하는 단일 출발점 최단 경로, 플로이드는 모든 쌍 최단 경로를 동적 프로그래밍으로 구한다. 포드-풀커슨은 증가 경로와 여유량으로 최대 플로를 늘린다.",
    keywords: ["벨만-포드", "완화", "음수 사이클", "플로이드", "P[][]", "네트워크 플로", "용량", "플로", "증가 경로", "여유량", "포드-풀커슨"],
    examKeywords: ["벨만-포드 개념/적용", "플로이드 적용", "P[][]로 최단 경로 구하기", "네트워크 플로 개념", "증가 경로 여유량"],
    concepts: [
      { title: "벨만-포드", body: "모든 간선을 반복 완화해 단일 출발점 최단 경로를 구한다. $|V|-1$회 후 추가 완화가 가능하면 음수 사이클을 의심한다." },
      { title: "플로이드", body: "경유 정점 집합을 늘려가며 모든 정점 쌍 최단 거리를 구한다.", formula: "$D^{(k)}[i][j]=\\min(D^{(k-1)}[i][j], D^{(k-1)}[i][k]+D^{(k-1)}[k][j])$" },
      { title: "네트워크 플로", body: "방향 그래프에서 각 간선 용량을 넘지 않게 소스에서 싱크로 보내는 흐름을 다룬다." },
      { title: "포드-풀커슨", body: "잔여 그래프에서 증가 경로를 찾고, 경로의 최소 잔여 용량만큼 플로를 증가시킨다." },
    ],
    procedures: [
      { title: "벨만-포드 적용", steps: ["출발점 0, 나머지 무한대 초기화", "모든 간선을 $|V|-1$회 완화", "부모와 거리 갱신", "추가 완화 가능 여부로 음수 사이클 확인"] },
      { title: "플로이드 경로 복원", steps: ["거리 행렬과 P 행렬 초기화", "경유 정점 k를 하나씩 추가", "더 짧은 경로가 있으면 거리와 P 갱신", "P 값을 따라 중간 정점을 재귀적으로 복원"] },
      { title: "포드-풀커슨 여유량", steps: ["잔여 그래프에서 증가 경로 선택", "경로 간선의 잔여 용량 계산", "최솟값을 여유량으로 결정", "정방향/역방향 잔여 용량 갱신"] },
    ],
    pitfalls: ["벨만-포드는 데이크스트라보다 느리지만 음수 간선을 다룰 수 있다.", "플로이드의 P 행렬은 거리값이 아니라 경로 복원 정보다.", "증가 경로 여유량은 경로 위 잔여 용량의 최솟값이다."],
    visualizers: [
      { label: "벨만-포드", algorithmId: "bellman-ford", category: "graph" },
      { label: "플로이드", algorithmId: "floyd-warshall", category: "graph" },
      { label: "포드-풀커슨", algorithmId: "ford-fulkerson", category: "graph" },
    ],
    quiz: [
      { question: "벨만-포드가 데이크스트라와 구분되는 핵심은?", options: ["음수 간선을 허용할 수 있음", "정렬만 수행", "패턴 해시를 계산"], answer: 0, explanation: "근거: 벨만-포드는 반복 완화로 음수 간선이 있는 그래프도 다룬다.", wrongNote: "오답 기준: 문자열 해시는 라빈-카프 내용이다." },
      { question: "플로이드 알고리즘의 설계 기법은?", options: ["동적 프로그래밍", "선형 탐사", "허프만 코딩"], answer: 0, explanation: "근거: 경유 정점 집합을 단계적으로 확장하는 점화식을 사용한다.", wrongNote: "오답 기준: 선형 탐사는 해싱, 허프만은 압축이다." },
      { question: "포드-풀커슨에서 증가 경로 여유량은?", options: ["경로 위 잔여 용량의 최솟값", "경로 위 용량의 최댓값", "정점 수"], answer: 0, explanation: "근거: 한 간선이라도 더 보낼 수 없는 용량이 전체 경로의 병목이 된다.", wrongNote: "오답 기준: 최댓값을 쓰면 일부 간선 용량을 초과한다." },
      { question: "플로이드의 P[][] 활용 목적은?", options: ["최단 경로 자체 복원", "힙 재구성", "해시 충돌 처리"], answer: 0, explanation: "근거: P 행렬은 중간 정점을 기록해 실제 경로를 찾는 데 쓰인다.", wrongNote: "오답 기준: 거리 행렬과 경로 복원 행렬을 구분해야 한다." },
      { question: "네트워크 플로의 간선 제약은?", options: ["플로는 용량을 초과할 수 없음", "항상 음수여야 함", "모든 간선이 무방향이어야 함"], answer: 0, explanation: "근거: 플로는 각 간선의 용량 제한을 만족해야 한다.", wrongNote: "오답 기준: 네트워크 플로는 일반적으로 방향 그래프에서 다룬다." },
    ],
  },
  {
    id: 11,
    title: "동적 프로그래밍",
    subtitle: "행렬의 연쇄적 곱셈, P[][], LCS",
    chapter: 5,
    chapterTitle: "동적 프로그래밍",
    examCount: 1,
    lectureSource: "강의록 11강",
    textbookSource: "교재 5장",
    ...style(0),
    summary:
      "동적 프로그래밍은 최적성의 원리가 성립하는 문제에서 작은 소문제의 해를 테이블에 저장하고 큰 문제를 해결한다. 기말은 행렬의 연쇄적 곱셈 계산과 P[][]를 이용한 최적 곱셈 순서가 핵심이다.",
    keywords: ["동적 프로그래밍", "최적성의 원리", "피보나치 수열", "행렬의 연쇄적 곱셈", "최소 기본 곱셈 횟수", "P[][]", "최장 공통 부분 수열", "LCS"],
    examKeywords: ["동적 프로그래밍 개념/특징", "기본 처리 과정", "행렬의 연쇄적 곱셈 최소 횟수", "P[][]로 최적 곱셈 순서"],
    concepts: [
      { title: "기본 처리 과정", body: "최적해 점화식을 도출하고, 가장 작은 소문제부터 해를 구해 테이블에 저장한 뒤 큰 문제의 해를 계산한다." },
      { title: "행렬의 연쇄적 곱셈", body: "행렬 곱셈 순서에 따라 기본 곱셈 횟수가 달라지므로 최소 비용 순서를 찾는다.", example: "교재 예제 차원 $[5,4,2,3,1,6]$의 최적 비용은 64." },
      { title: "LCS", body: "두 문자열에서 순서를 유지하며 공통으로 나타나는 가장 긴 부분 수열을 구한다.", example: "$SNOWY$와 $SUNNY$의 LCS는 $SNY$." },
    ],
    procedures: [
      { title: "행렬 연쇄 DP", steps: ["행렬 차원 배열 확인", "길이 1인 구간 비용을 0으로 초기화", "구간 길이를 2부터 증가", "가능한 분할점 k를 모두 비교", "최소 비용과 분할 위치 P[][] 저장"] },
      { title: "P[][]로 순서 복원", steps: ["전체 구간의 P값 확인", "왼쪽/오른쪽 구간으로 나눔", "각 구간의 P값을 재귀적으로 확인", "괄호를 붙여 최적 순서 표현"] },
    ],
    pitfalls: ["행렬 크기 호환 조건을 먼저 확인해야 한다.", "C[][]는 비용, P[][]는 분할 위치다.", "LCS는 연속 부분문자열이 아니라 순서를 유지하는 부분 수열이다."],
    visualizers: [],
    quiz: [
      { question: "동적 프로그래밍의 기본 처리 과정으로 적절한 것은?", options: ["소문제 해를 테이블에 저장", "항상 간선을 정렬", "항상 해시 주소 계산"], answer: 0, explanation: "근거: 교재 5장은 작은 소문제부터 점화식의 해를 구해 테이블에 저장한다고 설명한다.", wrongNote: "오답 기준: 간선 정렬은 크루스칼, 해시 주소 계산은 해싱이다." },
      { question: "행렬 연쇄 곱셈에서 최소화하는 값은?", options: ["기본 곱셈 횟수", "문자 빈도", "정점 진입차수"], answer: 0, explanation: "근거: 문제는 최소 기본 곱셈 횟수의 곱셈 순서를 구하는 것이다.", wrongNote: "오답 기준: 문자 빈도는 허프만 코딩, 진입차수는 위상 정렬과 관련된다." },
      { question: "P[][] 테이블의 용도는?", options: ["최적 분할 위치 저장", "해시 충돌 표시", "간선 용량 저장"], answer: 0, explanation: "근거: P[][]는 최적 곱셈 순서를 복원하기 위한 분할 위치를 담는다.", wrongNote: "오답 기준: 비용 C[][]와 분할 P[][]를 혼동하지 않아야 한다." },
      { question: "최적성의 원리 설명으로 맞는 것은?", options: ["문제의 최적해가 소문제의 최적해로 구성", "항상 첫 원소를 피벗으로 선택", "항상 가까운 정점부터 방문"], answer: 0, explanation: "근거: 동적 프로그래밍 적용의 핵심 원리다.", wrongNote: "오답 기준: 피벗과 가까운 정점 방문은 각각 퀵 정렬, BFS/최단 경로의 문맥이다." },
      { question: "LCS에서 부분 수열의 의미는?", options: ["연속될 필요는 없지만 순서는 유지", "반드시 연속 문자열", "문자 빈도만 같으면 됨"], answer: 0, explanation: "근거: LCS는 순서를 유지하는 공통 부분 수열이다.", wrongNote: "오답 기준: 연속 조건은 substring에 가깝고 빈도만으로는 순서를 알 수 없다." },
    ],
  },
  {
    id: 12,
    title: "스트링 매칭 I",
    subtitle: "스트링 기본, 라빈-카프, KMP",
    chapter: 6,
    chapterTitle: "스트링 알고리즘",
    examCount: 3,
    lectureSource: "강의록 12강",
    textbookSource: "교재 6장 6.1~6.2",
    ...style(1),
    summary:
      "스트링 매칭은 텍스트에서 패턴이 나타나는 위치를 찾는 문제다. 라빈-카프는 해시값으로 후보를 찾고 직접 비교하며, KMP는 전처리 배열로 이미 비교한 패턴 정보를 재사용한다.",
    keywords: ["스트링", "알파벳", "텍스트", "패턴", "브루트-포스", "라빈-카프", "해시", "KMP", "전처리", "실패 함수"],
    examKeywords: ["스트링 매칭 알고리즘 종류", "라빈-카프 개념/동작/성능", "KMP 전처리 개념과 성능", "KMP 매칭 성능"],
    concepts: [
      { title: "스트링 매칭", body: "긴 문자열인 텍스트 $T$에서 짧은 문자열인 패턴 $P$가 나타나는 위치를 찾는다." },
      { title: "라빈-카프", body: "패턴과 텍스트 윈도의 해시값을 비교해 후보를 찾고, 후보는 실제 문자 비교로 확인한다." },
      { title: "KMP", body: "패턴의 접두부/접미부 일치 정보를 전처리해 불일치 때 텍스트 인덱스를 되돌리지 않는다." },
    ],
    procedures: [
      { title: "라빈-카프", steps: ["패턴 해시 계산", "첫 텍스트 윈도 해시 계산", "해시가 같으면 직접 비교", "롤링 해시로 다음 윈도 계산", "끝까지 반복"] },
      { title: "KMP", steps: ["패턴의 실패 함수 F 계산", "텍스트와 패턴을 왼쪽부터 비교", "불일치 시 F값으로 패턴 위치 이동", "텍스트 인덱스는 되돌리지 않음"] },
    ],
    pitfalls: ["라빈-카프에서 해시가 같아도 문자열이 같다고 단정하지 않는다.", "KMP 전처리 비용과 매칭 비용을 분리해서 기억한다.", "텍스트 길이 $n$, 패턴 길이 $m$의 역할을 혼동하지 않는다."],
    visualizers: [],
    quiz: [
      { question: "스트링 매칭에서 일반적으로 긴 문자열은?", options: ["텍스트", "패턴", "해시"], answer: 0, explanation: "근거: 교재는 긴 스트링을 텍스트, 짧은 스트링을 패턴으로 부른다.", wrongNote: "오답 기준: 패턴은 찾고자 하는 짧은 문자열이다." },
      { question: "라빈-카프에서 해시값이 같은 경우 다음 단계는?", options: ["문자열을 직접 비교", "무조건 매치 확정", "트리 회전"], answer: 0, explanation: "근거: 해시 충돌 가능성 때문에 실제 비교가 필요하다.", wrongNote: "오답 기준: 해시 일치만으로 실제 일치를 확정하지 않는다." },
      { question: "KMP가 재비교를 줄이는 근거는?", options: ["패턴의 접두부/접미부 정보", "간선 가중치 정렬", "빈도 기반 코드"], answer: 0, explanation: "근거: KMP 전처리는 패턴 내부의 최대 일치 정보를 사용한다.", wrongNote: "오답 기준: 가중치 정렬은 MST, 빈도 코드는 허프만이다." },
      { question: "KMP 매칭 중 불일치가 발생하면?", options: ["실패 함수 값으로 패턴 위치 조정", "텍스트 전체를 처음부터 다시 시작", "해시 테이블 삭제"], answer: 0, explanation: "근거: KMP는 텍스트 인덱스를 되돌리지 않고 패턴을 이동한다.", wrongNote: "오답 기준: 처음부터 다시 시작하면 KMP의 장점이 사라진다." },
      { question: "라빈-카프의 대표적 장점은?", options: ["여러 패턴 후보를 해시로 빠르게 걸러낼 수 있음", "항상 비교 없이 종료", "트리 균형 유지"], answer: 0, explanation: "근거: 해시 비교로 후보를 빠르게 선별한다.", wrongNote: "오답 기준: 후보 검증을 위한 직접 비교가 필요할 수 있다." },
    ],
  },
  {
    id: 13,
    title: "스트링 매칭 II와 RLE",
    subtitle: "보이어-무어, 불일치 문자, 데이터 압축 기초",
    chapter: 6,
    chapterTitle: "스트링 알고리즘",
    examCount: 3,
    lectureSource: "강의록 13강",
    textbookSource: "교재 6장 6.2~6.3",
    ...style(2),
    summary:
      "보이어-무어는 패턴의 오른쪽에서 왼쪽으로 비교하고 불일치 문자 방법과 일치 접미부 방법으로 이동량을 정한다. RLE는 연속된 동일 문자를 문자와 반복 횟수로 표현하는 무손실 압축이다.",
    keywords: ["보이어-무어", "오른쪽 비교", "불일치 문자 방법", "일치 접미부 방법", "데이터 압축", "무손실 압축", "손실 압축", "RLE"],
    examKeywords: ["보이어-무어 개념/특징/시간복잡도", "불일치 문자 방법 적용", "RLE"],
    concepts: [
      { title: "보이어-무어", body: "패턴의 오른쪽 끝부터 비교하며 불일치가 나면 패턴을 크게 이동할 수 있다." },
      { title: "불일치 문자 방법", body: "텍스트의 불일치 문자가 패턴에서 마지막으로 나타나는 위치를 이용해 이동량을 계산한다." },
      { title: "RLE", body: "동일 문자가 연속되는 run을 `(문자, 횟수)` 형태로 압축한다.", example: "aaabb는 a3b2처럼 표현 가능." },
    ],
    procedures: [
      { title: "보이어-무어 적용", steps: ["패턴을 텍스트 위치에 맞춤", "패턴 오른쪽 끝부터 비교", "불일치 문자 이동량 계산", "일치 접미부 이동량 계산", "둘 중 큰 값만큼 이동"] },
      { title: "RLE 인코딩", steps: ["첫 문자를 현재 run으로 시작", "같은 문자가 이어지면 횟수 증가", "다른 문자가 나오면 run 출력", "새 run 시작", "끝에서 마지막 run 출력"] },
    ],
    pitfalls: ["보이어-무어는 왼쪽부터 비교하는 KMP와 비교 방향이 다르다.", "불일치 문자와 일치 접미부 이동량 중 큰 값을 택한다.", "RLE는 반복이 적은 데이터에서는 오히려 길어질 수 있다."],
    visualizers: [],
    quiz: [
      { question: "보이어-무어의 비교 방향은?", options: ["패턴 오른쪽에서 왼쪽", "항상 왼쪽에서 오른쪽", "무작위"], answer: 0, explanation: "근거: 강의록은 패턴의 오른쪽부터 비교하는 특징을 다룬다.", wrongNote: "오답 기준: 왼쪽부터 비교하는 방식은 브루트-포스/KMP와 더 가깝다." },
      { question: "보이어-무어에서 이동량 결정에 쓰는 대표 규칙은?", options: ["불일치 문자 방법", "선형 탐사", "P[][]"], answer: 0, explanation: "근거: 불일치 문자 방법과 일치 접미부 방법이 이동 규칙이다.", wrongNote: "오답 기준: 선형 탐사는 해싱, P[][]는 DP/플로이드 문맥이다." },
      { question: "RLE가 효과적인 입력은?", options: ["같은 문자가 길게 반복되는 입력", "모든 문자가 번갈아 나오는 입력", "음수 간선 그래프"], answer: 0, explanation: "근거: RLE는 run을 짧게 표현할 때 효과가 난다.", wrongNote: "오답 기준: 반복이 거의 없으면 압축 이득이 작거나 음수가 된다." },
      { question: "RLE는 어떤 압축으로 분류되는가?", options: ["무손실 압축", "손실 압축", "최단 경로 알고리즘"], answer: 0, explanation: "근거: RLE는 원문 복원이 가능한 압축이다.", wrongNote: "오답 기준: 손실 압축은 일부 정보를 버리는 방식이다." },
      { question: "보이어-무어의 좋은 성능이 나오는 이유는?", options: ["불일치 때 여러 칸 이동 가능", "항상 한 칸만 이동", "테이블 없이 전체 재시작"], answer: 0, explanation: "근거: 오른쪽 비교와 이동 규칙으로 큰 이동이 가능하다.", wrongNote: "오답 기준: 항상 한 칸 이동하면 장점이 줄어든다." },
    ],
  },
  {
    id: 14,
    title: "허프만 코딩과 LZ77",
    subtitle: "허프만 트리, 허프만 코드, LZ77 인코딩",
    chapter: 6,
    chapterTitle: "스트링 알고리즘",
    examCount: 3,
    lectureSource: "강의록 14강",
    textbookSource: "교재 6장 6.3",
    ...style(3),
    summary:
      "허프만 코딩은 문자 빈도에 따라 접두부 코드를 만들고, LZ77은 슬라이딩 윈도에서 이전 문자열을 참조해 인코딩한다. 기말은 허프만 트리/코드 생성과 LZ77 인코딩 적용이 핵심이다.",
    keywords: ["허프만 코딩", "허프만 트리", "접두부 코드", "빈도", "최소 힙", "LZ77", "슬라이딩 윈도", "거리", "길이", "다음 문자"],
    examKeywords: ["허프만 트리", "허프만 코드", "LZ77 인코딩"],
    concepts: [
      { title: "허프만 코딩", body: "문자의 빈도 정보를 이용해 자주 나오는 문자에 짧은 코드를 부여하는 무손실 압축 방법이다." },
      { title: "허프만 트리", body: "가장 작은 빈도 두 노드를 반복적으로 병합해 만든 이진 트리다." },
      { title: "접두부 코드", body: "어떤 코드도 다른 코드의 접두부가 되지 않아 왼쪽부터 읽으며 유일하게 복원할 수 있다." },
      { title: "LZ77", body: "슬라이딩 윈도에서 이전에 나타난 가장 긴 일치를 찾아 거리, 길이, 다음 문자로 출력한다." },
    ],
    procedures: [
      { title: "허프만 트리 생성", steps: ["문자 빈도 계산", "각 문자를 노드로 최소 힙에 넣음", "최소 빈도 두 노드 선택", "두 빈도의 합을 갖는 부모 생성", "노드 하나가 남을 때까지 반복"] },
      { title: "LZ77 인코딩", steps: ["검색 버퍼와 lookahead 버퍼 설정", "lookahead 접두부와 가장 긴 이전 일치 탐색", "거리와 길이 계산", "다음 문자와 함께 triple 출력", "윈도를 이동"] },
    ],
    pitfalls: ["같은 빈도가 있으면 허프만 트리는 하나로 고정되지 않을 수 있다.", "허프만 코드에서 왼쪽/오른쪽에 0/1을 붙이는 관례를 일관되게 유지한다.", "LZ77의 거리는 현재 위치에서 과거 일치 시작점까지의 거리다."],
    visualizers: [],
    quiz: [
      { question: "허프만 트리 생성의 첫 반복 선택 기준은?", options: ["가장 작은 빈도 두 노드", "가장 큰 빈도 하나", "임의의 간선"], answer: 0, explanation: "근거: 허프만 트리는 최소 빈도 두 노드를 반복 병합한다.", wrongNote: "오답 기준: 큰 빈도부터 병합하면 평균 코드 길이가 커질 수 있다." },
      { question: "허프만 코드의 중요한 성질은?", options: ["접두부 코드", "항상 고정 길이", "항상 손실 압축"], answer: 0, explanation: "근거: 허프만 코드는 접두부 성질로 유일 복호화가 가능하다.", wrongNote: "오답 기준: 빈도에 따라 길이가 달라지는 가변 길이 코드다." },
      { question: "자주 나오는 문자의 허프만 코드 길이는 보통?", options: ["짧음", "항상 가장 김", "항상 0"], answer: 0, explanation: "근거: 평균 코드 길이를 줄이기 위해 빈도 높은 문자를 루트 가까이에 둔다.", wrongNote: "오답 기준: 특정 문자가 항상 0이라는 보장은 없다." },
      { question: "LZ77 출력의 기본 구성은?", options: ["거리, 길이, 다음 문자", "정점, 간선, 가중치", "피벗, 왼쪽, 오른쪽"], answer: 0, explanation: "근거: LZ77은 이전 문자열 참조 정보와 다음 문자를 함께 출력한다.", wrongNote: "오답 기준: 정점/간선은 그래프, 피벗은 퀵 정렬이다." },
      { question: "LZ77이 이용하는 구조는?", options: ["슬라이딩 윈도", "레드-블랙 색깔 규칙", "진입차수 0 큐"], answer: 0, explanation: "근거: 검색 버퍼와 lookahead 버퍼가 이동하며 이전 문자열을 참조한다.", wrongNote: "오답 기준: 색깔 규칙은 트리, 진입차수 큐는 위상 정렬이다." },
    ],
  },
  {
    id: 15,
    title: "NP-완전 문제",
    subtitle: "P/NP, 변환, NP-완전 문제의 종류와 개념",
    chapter: 7,
    chapterTitle: "NP-완전 문제",
    examCount: 1,
    lectureSource: "강의록 15강",
    textbookSource: "교재 7장",
    ...style(4),
    summary:
      "NP-완전 문제는 클래스 NP에 속하면서 NP의 모든 문제가 다항 시간에 변환되는 문제다. 기말은 개념과 대표 문제 종류를 묻고, 근사 알고리즘은 NP-하드 최적화 문제의 대략적 해를 빠르게 구하는 맥락으로 정리한다.",
    keywords: ["클래스 P", "클래스 NP", "비결정론적 튜링 기계", "판정 문제", "다항 시간", "변환", "NP-완전", "NP-하드", "근사 알고리즘", "버텍스 커버", "외판원 문제", "통 채우기"],
    examKeywords: ["NP-완전 문제의 개념", "NP-완전 문제의 종류와 개념"],
    concepts: [
      { title: "클래스 P", body: "결정론적 계산 모델로 다항 시간에 풀 수 있는 판정 문제의 집합이다." },
      { title: "클래스 NP", body: "비결정론적 튜링 기계로 다항 시간에 해결할 수 있는 판정 문제의 집합으로, 주어진 해의 검증이 다항 시간에 가능한 문제로 이해할 수 있다." },
      { title: "변환", body: "문제 Q의 입력과 출력을 문제 A의 입력과 출력 형태로 다항 시간 안에 바꾸어 A 알고리즘으로 Q를 풀 수 있게 하는 관계다." },
      { title: "NP-완전", body: "문제 A가 NP에 속하고, NP의 모든 문제가 A로 다항 시간 변환될 때 A를 NP-완전 문제라고 한다." },
    ],
    procedures: [
      { title: "NP-완전 판정 흐름", steps: ["문제가 판정 문제인지 확인", "NP에 속하는지 확인", "알려진 NP-완전 문제로부터 다항 시간 변환을 보임", "두 조건이 모두 성립하면 NP-완전으로 정리"] },
      { title: "근사 알고리즘 사용 맥락", steps: ["정확한 최적해 계산이 어려운 문제 식별", "다항 시간 근사 절차 선택", "근사해 품질 기준 확인", "최적해와의 차이를 해석"] },
    ],
    pitfalls: ["NP-하드는 반드시 NP에 속할 필요가 없다.", "NP-완전은 NP에도 속하고 NP-하드이기도 한 문제다.", "최적화 문제를 판정 문제 형태로 바꾸는 관점을 놓치면 정의가 흐려진다."],
    visualizers: [],
    quiz: [
      { question: "NP-완전 문제의 두 조건은?", options: ["NP에 속함 + 모든 NP 문제가 다항 시간 변환", "항상 $O(n)$ + 항상 정렬", "무조건 근사 가능 + 무조건 해시 가능"], answer: 0, explanation: "근거: 교재 7장은 NP-완전의 두 조건을 정의로 제시한다.", wrongNote: "오답 기준: 선형 시간이나 해싱 가능성은 NP-완전 정의가 아니다." },
      { question: "클래스 P는 무엇을 모은 집합인가?", options: ["다항 시간에 풀 수 있는 판정 문제", "모든 문자열 압축 문제", "모든 정렬 알고리즘"], answer: 0, explanation: "근거: P는 결정론적 계산에서 다항 시간 해결 가능한 판정 문제 집합이다.", wrongNote: "오답 기준: 특정 알고리즘 분야 전체를 뜻하지 않는다." },
      { question: "변환의 핵심 의미는?", options: ["한 문제를 다른 문제의 입력/출력 형태로 바꿈", "트리 색을 바꿈", "문자를 빈도로 바꿈"], answer: 0, explanation: "근거: 다항 시간 변환은 문제 해결 가능성을 다른 문제로 옮기는 도구다.", wrongNote: "오답 기준: 색 변경은 레드-블랙, 빈도 변환은 허프만 맥락이다." },
      { question: "NP-하드 설명으로 맞는 것은?", options: ["NP에 속할 필요는 없음", "항상 NP-완전보다 쉬움", "항상 다항 시간에 정확히 풀림"], answer: 0, explanation: "근거: NP-하드는 모든 NP 문제가 변환되는 어려움 조건이며 NP 소속 조건은 없다.", wrongNote: "오답 기준: NP-완전은 NP-하드이면서 NP에 속하는 경우다." },
      { question: "근사 알고리즘을 쓰는 이유는?", options: ["정확한 최적해가 너무 비쌀 때 빠른 근사해를 얻기 위해", "해시 충돌을 없애기 위해", "항상 코드를 짧게 만들기 위해"], answer: 0, explanation: "근거: 근사 알고리즘은 NP-하드 최적화 문제의 실용적 해법으로 다룬다.", wrongNote: "오답 기준: 충돌 처리나 코드 길이는 각각 해싱/압축의 문제다." },
    ],
  },
];

export const algorithmLectureAddenda: Record<number, AlgorithmLectureAddendum> = {
  1: {
    sourceCheck: ["강의록 1강: 알고리즘 정의·조건·설계 기법·배낭 문제", "교재 1장: 알고리즘 소개와 설계 전략"],
    coverage: [
      {
        title: "알고리즘 성립 조건",
        items: ["입력과 출력의 명시", "각 단계의 명확성", "유한 시간 종료", "모든 유효 입력에 대한 정확성", "실무적 조건으로서 효율성과 구현 가능성"],
      },
      {
        title: "대표 설계 기법",
        items: ["분할정복: 독립 부분문제와 결합", "욕심쟁이 방법: 현재 단계 최선 선택", "동적 프로그래밍: 중복 부분문제 테이블화", "백트래킹/분기한정: 후보 공간 가지치기", "근사 알고리즘: 최적해 대신 품질 보장 해"],
      },
      {
        title: "배낭 문제 구분",
        items: ["분할 가능 배낭은 단위 무게당 이익 기준 욕심쟁이 선택 가능", "0/1 배낭은 물체를 쪼갤 수 없어 욕심쟁이 선택이 일반 최적해를 보장하지 않음", "0/1 배낭은 용량과 물체 수를 축으로 한 동적 프로그래밍 표로 확장 가능"],
      },
    ],
    tables: [
      {
        title: "설계 기법-대표 문제 연결",
        headers: ["기법", "판단 기준", "대표 연결"],
        rows: [
          ["욕심쟁이", "한 번 선택한 후보를 되돌리지 않음", "거스름돈, 분할 가능 배낭, MST, 데이크스트라"],
          ["분할정복", "부분문제가 독립적이고 결합 단계 존재", "합병 정렬, 퀵 정렬, 이진 탐색"],
          ["동적 프로그래밍", "중복 부분문제와 최적성의 원리", "행렬 연쇄 곱셈, LCS, 0/1 배낭"],
          ["백트래킹", "제약 위반 후보를 즉시 제외", "N-Queen, 부분집합 탐색"],
          ["근사", "정확 최적해 계산이 과도하게 비쌈", "버텍스 커버, TSP, 통 채우기"],
        ],
      },
      {
        title: "배낭 문제 시험 구분표",
        headers: ["구분", "선택 단위", "주요 기법", "주의점"],
        rows: [
          ["분할 가능", "물체 일부 허용", "욕심쟁이", "단위 무게당 이익 기준 정렬"],
          ["0/1", "선택 또는 미선택", "동적 프로그래밍/백트래킹", "욕심쟁이 반례 가능"],
        ],
      },
    ],
    drills: [
      {
        title: "조건 판정",
        prompt: "절차가 항상 종료하지만 특정 입력에서 오답을 낸다면 알고리즘 조건을 만족하는가?",
        checks: ["유한성은 만족", "정확성 위반", "알고리즘으로 인정하기 어려움"],
      },
      {
        title: "분할 가능 배낭",
        prompt: "용량 10, 물체 (이익,무게)=(60,10),(100,20),(120,30)에서 단위 이익을 비교.",
        checks: ["단위 이익: 6, 5, 4", "첫 물체 전체 선택", "남은 용량이 없으면 종료"],
      },
      {
        title: "0/1 배낭 반례 확인",
        prompt: "단위 이익이 큰 물체를 먼저 고르는 방식이 항상 최적인지 작은 예로 반박.",
        checks: ["물체 분할 금지 확인", "선택 조합을 비교", "욕심쟁이 선택과 최적 조합이 다를 수 있음"],
      },
    ],
    visualAudit: [
      { topic: "배낭 문제", status: "드릴 추가", detail: "분할 가능/0-1 차이를 표와 손풀이 드릴로 보강. 별도 애니메이션은 후속 대상." },
      { topic: "설계 기법 분류", status: "표 보강", detail: "정렬·그래프·DP·NP 장과 연결되는 기법 표 추가." },
      { topic: "알고리즘 조건", status: "텍스트 드릴", detail: "유한성만으로 충분하지 않고 정확성까지 확인하는 판정 문제 추가." },
    ],
  },
  2: {
    sourceCheck: ["강의록 2강: 복잡도·점근 표기·점화식", "교재 1장: 알고리즘 분석"],
    coverage: [
      {
        title: "성능 분석 단위",
        items: ["시간 복잡도는 기본 연산 수행 횟수의 입력 크기 함수", "공간 복잡도는 고정 공간과 입력 크기에 따라 늘어나는 동적 공간을 함께 고려", "최선·평균·최악 수행시간의 기준을 문제에서 먼저 확인"],
      },
      {
        title: "점근 표기",
        items: ["$O(g(n))$: 충분히 큰 $n$에서 상수배 상한", "$\\Omega(g(n))$: 충분히 큰 $n$에서 상수배 하한", "$\\Theta(g(n))$: 상한과 하한이 같은 차수", "그래프상으로는 특정 지점 이후의 성장률 비교"],
      },
      {
        title: "프로그램 시간 계산",
        items: ["단일 반복문은 반복 횟수", "중첩 반복문은 반복 범위의 합 또는 곱", "반씩 줄어드는 반복은 로그", "순환 호출은 점화식으로 분리"],
      },
    ],
    tables: [
      {
        title: "빅오 함수 크기 관계",
        headers: ["작음", "중간", "큼"],
        rows: [
          ["$O(1)$", "$O(\\log n)$", "$O(n)$"],
          ["$O(n\\log n)$", "$O(n^2)$", "$O(n^3)$"],
          ["$O(2^n)$", "$O(n!)$", "지수/팩토리얼은 다항보다 큼"],
        ],
      },
      {
        title: "기본 점화식 패턴",
        headers: ["점화식", "대표 상황", "성능"],
        rows: [
          ["$T(n)=T(n-1)+c$", "크기를 1씩 감소", "$O(n)$"],
          ["$T(n)=T(n/2)+c$", "이진 탐색", "$O(\\log n)$"],
          ["$T(n)=2T(n/2)+n$", "합병 정렬", "$O(n\\log n)$"],
          ["$T(n)=T(n-1)+n$", "한쪽 치우친 분할", "$O(n^2)$"],
        ],
      },
    ],
    drills: [
      {
        title: "중첩 반복 계산",
        prompt: "`for i=1..n` 안에서 `for j=1..i`가 실행될 때 총 횟수 계산.",
        checks: ["합 $1+2+...+n$", "$n(n+1)/2$", "최고차항 기준 $O(n^2)$"],
      },
      {
        title: "점화식 판정",
        prompt: "$T(n)=2T(n/2)+n$을 재귀 트리로 해석.",
        checks: ["각 레벨 비용 $n$", "레벨 수 $\\log n$", "전체 $O(n\\log n)$"],
      },
      {
        title: "표기법 구분",
        prompt: "$f(n)=3n^2+5n$과 $g(n)=n^2$의 관계를 $O/\\Omega/\\Theta$로 판정.",
        checks: ["상한 성립", "하한 성립", "따라서 $\\Theta(n^2)$"],
      },
    ],
    visualAudit: [
      { topic: "Big-O/Ω/Θ 성장 비교", status: "표·드릴 추가", detail: "그래프형 인터랙션은 없으므로 성장 순서표와 판정 드릴로 보완." },
      { topic: "점화식 풀이", status: "드릴 추가", detail: "분할정복 점화식과 한쪽 치우친 점화식을 시험형으로 추가." },
      { topic: "프로그램 시간 복잡도", status: "드릴 추가", detail: "중첩 반복 합 계산 문제 추가." },
    ],
  },
  3: {
    sourceCheck: ["강의록 3강: 버블·선택·삽입·셸 정렬", "교재 2장: 기초 정렬과 정렬 분류"],
    coverage: [
      {
        title: "정렬 분류 기준",
        items: ["내부/외부 정렬", "비교 기반/분포 기반 정렬", "안정적/불안정 정렬", "제자리/비제자리 정렬", "입력 상태에 민감한 알고리즘"],
      },
      {
        title: "기초 정렬 처리 과정",
        items: ["버블: 인접 원소 교환과 큰 값의 뒤쪽 이동", "선택: 미정렬 구간 최솟값 선택 후 교환", "삽입: 정렬 구간에 현재 원소 삽입", "셸: 간격별 부분배열에 삽입 정렬 적용"],
      },
      {
        title: "입력 상태 영향",
        items: ["삽입 정렬은 거의 정렬된 입력에서 이동이 적음", "개선 버블은 교환이 없으면 조기 종료 가능", "선택 정렬 비교 횟수는 입력 상태 영향이 작음", "셸 정렬 성능은 간격 수열에 좌우"],
      },
    ],
    tables: [
      {
        title: "기초 정렬 성질",
        headers: ["알고리즘", "최선", "평균/최악", "안정", "제자리"],
        rows: [
          ["버블", "개선형 $O(n)$", "$O(n^2)$", "예", "예"],
          ["선택", "$O(n^2)$", "$O(n^2)$", "아니오", "예"],
          ["삽입", "$O(n)$", "$O(n^2)$", "예", "예"],
          ["셸", "간격 수열 의존", "대체로 $O(n^2)$ 이하", "아니오", "예"],
        ],
      },
      {
        title: "부분배열/간격 적용",
        headers: ["개념", "사용 알고리즘", "시험 포인트"],
        rows: [
          ["정렬 구간+미정렬 구간", "삽입·선택", "각 패스 후 경계 확인"],
          ["인접 비교 구간", "버블", "한 패스 후 최댓값 위치"],
          ["간격 부분배열", "셸", "마지막 간격 1은 삽입 정렬"],
        ],
      },
    ],
    drills: [
      {
        title: "선택 정렬 1패스",
        prompt: "[29, 10, 14, 37, 13]에서 첫 번째 패스 후 배열.",
        checks: ["최솟값 10 탐색", "첫 위치 29와 교환", "[10, 29, 14, 37, 13]"],
      },
      {
        title: "안정성 판정",
        prompt: "[2a, 2b, 1]을 선택 정렬하면 2a와 2b의 상대 순서가 유지되는지 확인.",
        checks: ["최솟값 1과 첫 원소 2a 교환", "2b가 2a보다 앞설 수 있음", "불안정"],
      },
      {
        title: "거의 정렬 입력",
        prompt: "[1,2,3,5,4]에서 삽입 정렬 이동 횟수가 왜 작은지 설명.",
        checks: ["역전은 5와 4 하나", "대부분 비교 후 바로 통과", "최선에 가까움"],
      },
    ],
    visualAudit: [
      { topic: "선택/버블/삽입/셸", status: "인터랙티브 연결", detail: "각 알고리즘 실행 시각화 링크 유지." },
      { topic: "정렬 안정성", status: "드릴 추가", detail: "동일 키 라벨 예제로 안정성 판정 보강." },
      { topic: "입력 상태별 성능", status: "표·드릴 추가", detail: "개선 버블·삽입·선택의 차이를 표로 비교." },
    ],
  },
  4: {
    sourceCheck: ["강의록 4강: 퀵 정렬과 합병 정렬", "교재 2장: 분할정복 정렬"],
    coverage: [
      {
        title: "퀵 정렬 핵심",
        items: ["피벗 선택", "partition()으로 피벗보다 작은/큰 영역 분리", "피벗은 분할 후 최종 위치 확정", "부분배열 경계를 순환 호출"],
      },
      {
        title: "퀵 정렬 성능",
        items: ["균등 분할은 $O(n\\log n)$", "한쪽 치우친 분할은 $O(n^2)$", "첫 원소 피벗과 이미 정렬된 입력의 위험", "분할함수 호출 횟수는 부분배열 생성 구조와 연결"],
      },
      {
        title: "합병 정렬 핵심",
        items: ["절반 분할", "길이 1에서 정렬 완료", "merge()로 정렬된 두 부분배열 결합", "보조 배열 때문에 추가 공간 필요"],
      },
    ],
    tables: [
      {
        title: "퀵 vs 합병",
        headers: ["구분", "퀵 정렬", "합병 정렬"],
        rows: [
          ["설계", "분할 후 피벗 위치 확정", "먼저 끝까지 분할 후 합병"],
          ["최악", "$O(n^2)$", "$O(n\\log n)$"],
          ["평균", "$O(n\\log n)$", "$O(n\\log n)$"],
          ["공간", "일반적으로 제자리 성격", "보조 배열 필요"],
          ["안정성", "일반 구현은 불안정", "일반 구현은 안정 가능"],
        ],
      },
    ],
    drills: [
      {
        title: "partition 추적",
        prompt: "피벗 30, 배열 [30, 10, 50, 20, 40]에서 피벗보다 작은 원소 영역을 확인.",
        checks: ["10과 20은 왼쪽", "50과 40은 오른쪽", "피벗 30은 최종 위치에 배치"],
      },
      {
        title: "merge 추적",
        prompt: "[2,8,9]와 [1,3,7]을 merge할 때 출력 순서.",
        checks: ["1 선택", "2 선택", "3 선택", "7 선택", "8,9 복사"],
      },
      {
        title: "분할함수 호출 수",
        prompt: "퀵 정렬에서 크기 1 이하 부분배열은 더 분할하지 않는다고 할 때 호출 트리의 내부 노드 수를 생각.",
        checks: ["각 partition은 하나의 피벗 확정", "비어 있는 구간 제외 여부 확인", "문제의 의사코드 기준으로 계산"],
      },
    ],
    visualAudit: [
      { topic: "퀵 정렬 partition()", status: "인터랙티브 연결", detail: "퀵 정렬 시각화로 피벗과 부분배열 경계 확인." },
      { topic: "합병 merge()", status: "인터랙티브 연결", detail: "보조 배열과 합병 순서를 실행 단계로 확인." },
      { topic: "분할함수 호출 횟수", status: "드릴 추가", detail: "호출 트리 기준 계산 포인트 추가." },
    ],
  },
  5: {
    sourceCheck: ["강의록 5강: 힙 정렬·계수·기수·버킷", "교재 2장: 고급 정렬과 선형 시간 정렬"],
    coverage: [
      {
        title: "힙 정렬",
        items: ["완전 이진 트리 성질", "최대 힙의 부모-자식 우선순위", "초기 힙 구축: 반복 삽입 방식과 바닥부터 heapify 방식", "최댓값 삭제와 힙 재구성 반복"],
      },
      {
        title: "선형 시간 정렬",
        items: ["계수 정렬은 키 범위 $k$가 작을 때 유리", "기수 정렬은 자리수별 안정 정렬이 필수", "버킷 정렬은 균등 분포와 작은 버킷 내부 비용이 조건", "분포 기반 정렬은 비교 기반 하한과 분리"],
      },
      {
        title: "정렬 전체 성질 대조",
        items: ["최선·평균·최악 성능", "비교 기반 여부", "제자리 여부", "안정성", "입력 상태 영향"],
      },
    ],
    tables: [
      {
        title: "기말용 정렬 총정리",
        headers: ["알고리즘", "최선", "평균", "최악", "안정", "제자리", "비교"],
        rows: [
          ["버블", "$O(n)$ 개선형", "$O(n^2)$", "$O(n^2)$", "예", "예", "예"],
          ["선택", "$O(n^2)$", "$O(n^2)$", "$O(n^2)$", "아니오", "예", "예"],
          ["삽입", "$O(n)$", "$O(n^2)$", "$O(n^2)$", "예", "예", "예"],
          ["셸", "간격 의존", "간격 의존", "대체로 $O(n^2)$", "아니오", "예", "예"],
          ["퀵", "$O(n\\log n)$", "$O(n\\log n)$", "$O(n^2)$", "아니오", "예", "예"],
          ["합병", "$O(n\\log n)$", "$O(n\\log n)$", "$O(n\\log n)$", "예", "아니오", "예"],
          ["힙", "$O(n\\log n)$", "$O(n\\log n)$", "$O(n\\log n)$", "아니오", "예", "예"],
          ["계수", "$O(n+k)$", "$O(n+k)$", "$O(n+k)$", "예 가능", "아니오", "아니오"],
          ["기수", "$O(d(n+k))$", "$O(d(n+k))$", "$O(d(n+k))$", "내부 정렬 필요", "아니오", "아니오"],
          ["버킷", "$O(n)$ 조건부", "분포 의존", "$O(n^2)$ 가능", "내부 정렬 의존", "아니오", "아니오"],
        ],
      },
      {
        title: "내부적으로 다른 정렬이 필요한 경우",
        headers: ["알고리즘", "내부 정렬", "조건"],
        rows: [
          ["기수 정렬", "자리별 안정 정렬", "낮은 자리 결과를 보존해야 함"],
          ["버킷 정렬", "각 버킷 내부 정렬", "버킷에 여러 원소가 들어갈 때 필요"],
        ],
      },
    ],
    drills: [
      {
        title: "초기 힙 구축 비교",
        prompt: "반복 삽입 방식과 바닥부터 heapify 방식의 차이를 말로 구분.",
        checks: ["반복 삽입은 원소를 하나씩 힙에 추가", "heapify는 마지막 내부 노드부터 아래로 조정", "구축 비용 설명이 달라짐"],
      },
      {
        title: "기수 정렬 안정성",
        prompt: "1의 자리 정렬 뒤 10의 자리 정렬을 불안정하게 수행하면 왜 틀릴 수 있는지 설명.",
        checks: ["이전 자리 순서가 깨짐", "같은 높은 자리 내부의 낮은 자리 순서 필요", "안정 정렬 필수"],
      },
      {
        title: "버킷 선형 조건",
        prompt: "모든 데이터가 한 버킷에 몰리면 버킷 정렬 시간은 어떻게 변하는가?",
        checks: ["버킷 내부 정렬 비용 증가", "선형 시간 조건 붕괴", "분포 가정 확인"],
      },
    ],
    visualAudit: [
      { topic: "힙/계수/기수/버킷", status: "인터랙티브 연결", detail: "기존 실행 시각화 링크 유지." },
      { topic: "정렬 속성 총정리", status: "표 보강", detail: "시험 범위의 안정성·제자리·비교 기반·성능을 한 표로 통합." },
      { topic: "초기 힙 구축 두 방법", status: "드릴 추가", detail: "반복 삽입과 heapify 방식 구분 드릴 추가." },
    ],
  },
  6: {
    sourceCheck: ["강의록 6강: 순차/이진 탐색·BST·2-3-4 트리", "교재 3장: 탐색 구조"],
    coverage: [
      {
        title: "순차 탐색과 이진 탐색",
        items: ["순차 탐색은 비정렬 자료에 바로 적용 가능", "정렬 배열의 이진 탐색은 탐색 $O(\\log n)$", "정렬 배열 삽입은 위치 탐색 후 이동 때문에 $O(n)$", "정렬 배열 초기화는 정렬 비용 포함"],
      },
      {
        title: "BST",
        items: ["삽입 순서에 따라 트리 모양이 달라짐", "탐색은 키 비교로 좌/우 이동", "삭제는 leaf, one-child, two-child 세 경우", "두 자식 삭제는 중위 후속자 또는 선행자 대체"],
      },
      {
        title: "2-3-4 트리",
        items: ["모든 leaf가 같은 깊이", "노드는 2-node/3-node/4-node", "삽입 중 4-node 분할", "분할로 부모에 키가 올라가며 균형 유지"],
      },
    ],
    tables: [
      {
        title: "탐색 방법 성능",
        headers: ["방법", "평균 탐색", "최악 탐색", "삽입/삭제 포인트"],
        rows: [
          ["순차 탐색", "$O(n)$", "$O(n)$", "배열/리스트 구현에 따라 이동 비용 차이"],
          ["이진 탐색 배열", "$O(\\log n)$", "$O(\\log n)$", "삽입은 자리 이동으로 $O(n)$"],
          ["BST", "$O(\\log n)$ 기대", "$O(n)$ 편향", "삭제 3사례 구분"],
          ["2-3-4 트리", "$O(\\log n)$", "$O(\\log n)$", "4-node 분할"],
        ],
      },
      {
        title: "BST 삭제 3사례",
        headers: ["사례", "처리", "주의"],
        rows: [
          ["leaf", "부모 링크 제거", "가장 단순"],
          ["자식 하나", "자식을 부모와 직접 연결", "서브트리 보존"],
          ["자식 둘", "중위 후속자/선행자로 값 대체 후 해당 노드 제거", "대체 노드의 원래 위치 처리"],
        ],
      },
    ],
    drills: [
      {
        title: "BST 삽입 후 탐색",
        prompt: "50,30,70,20,40을 차례로 삽입한 뒤 40 탐색 경로.",
        checks: ["50에서 왼쪽", "30에서 오른쪽", "40 발견"],
      },
      {
        title: "BST 두 자식 삭제",
        prompt: "루트 50의 좌우 자식이 모두 있을 때 중위 후속자로 삭제.",
        checks: ["오른쪽 서브트리 최솟값 선택", "50 위치에 대체", "후속자의 원래 링크 조정"],
      },
      {
        title: "2-3-4 삽입",
        prompt: "4-node를 만난 뒤 새 키를 내려보내기 전에 해야 할 일.",
        checks: ["중간 키 상승", "좌우 키 분리", "부모가 꽉 찼는지 다시 확인"],
      },
    ],
    visualAudit: [
      { topic: "순차/이진/BST/2-3-4", status: "인터랙티브 연결", detail: "기존 탐색 시각화 링크 유지." },
      { topic: "BST 삭제 3사례", status: "표·드릴 추가", detail: "Claude 검토에서 직접 누락 후보로 지적된 삭제 사례를 별도 표로 보강." },
      { topic: "이진 탐색 삽입/초기화 시간", status: "세부 범위 보강", detail: "탐색 시간만이 아니라 삽입과 초기화 비용까지 명시." },
    ],
  },
  7: {
    sourceCheck: ["강의록 7강: 레드-블랙·B-트리·해싱", "교재 3장: 균형 탐색 트리와 해시 테이블"],
    coverage: [
      {
        title: "레드-블랙 트리",
        items: ["각 노드는 빨강 또는 검정", "루트와 NIL은 검정", "빨강 노드의 자식은 검정", "모든 루트-leaf 경로의 검정 노드 수 동일", "삽입 후 색 변경과 회전으로 규칙 회복"],
      },
      {
        title: "B-트리",
        items: ["외부 저장장치 접근 감소 목적", "노드에 여러 키와 자식 포인터 저장", "차수에 따른 키 개수 범위 확인", "탐색·삽입·삭제는 균형 높이 $O(\\log n)$"],
      },
      {
        title: "해싱",
        items: ["제산 잔여법 등 해시 함수", "충돌 해결: 버킷 해싱, 선형 탐사, 이차 탐사, 이중 해싱", "선형 탐사는 1차 클러스터링 발생", "삭제 시 비석(tombstone)으로 탐사 경로 보존"],
      },
    ],
    tables: [
      {
        title: "균형 탐색 트리 대조",
        headers: ["구조", "균형 방식", "강점", "시험 포인트"],
        rows: [
          ["2-3-4", "다중 키 노드", "삽입 분할이 직관적", "레드-블랙 표현으로 변환"],
          ["레드-블랙", "색 규칙과 회전", "이진 탐색 트리 형태 유지", "삽입 case와 색 변경"],
          ["B-트리", "다중 키/다중 자식", "디스크 접근 감소", "차수와 키 개수 범위"],
        ],
      },
      {
        title: "해싱 충돌 처리",
        headers: ["방법", "저장 위치", "장점", "주의"],
        rows: [
          ["버킷 해싱", "같은 주소의 버킷", "충돌 관리 단순", "버킷 넘침"],
          ["선형 탐사", "테이블 다음 칸", "구현 단순", "1차 클러스터링"],
          ["이차 탐사", "제곱 간격", "클러스터 완화", "탐사 순서 조건"],
          ["이중 해싱", "두 번째 해시 간격", "분산 개선", "함수 선택 중요"],
        ],
      },
    ],
    drills: [
      {
        title: "선형 탐사",
        prompt: "크기 7, h(k)=k mod 7, 키 10,17,24를 삽입.",
        checks: ["10은 3", "17도 3이라 4", "24도 3이라 5까지 탐사"],
      },
      {
        title: "비석 삭제",
        prompt: "선형 탐사 테이블 중간 키를 완전 빈칸으로 지우면 어떤 문제가 생기는가?",
        checks: ["뒤쪽 충돌 키 탐색 경로 단절", "탐색 실패 오판", "비석으로 삭제 표시 필요"],
      },
      {
        title: "RB 삽입 case",
        prompt: "새 빨강 노드의 부모도 빨강이면 먼저 확인할 대상.",
        checks: ["삼촌 색", "빨강 삼촌이면 색 변경", "검정 삼촌이면 회전과 색 변경"],
      },
    ],
    visualAudit: [
      { topic: "레드-블랙/B-트리/해시", status: "인터랙티브 연결", detail: "기존 탐색 구조 시각화 링크 유지." },
      { topic: "선형 탐사 충돌 순서", status: "드릴 추가", detail: "키별 home bucket과 probe sequence를 직접 추적." },
      { topic: "삭제와 비석", status: "세부 범위 보강", detail: "강의록의 삭제 연산 조건을 오답 방지에 연결." },
    ],
  },
  8: {
    sourceCheck: ["강의록 8강: 그래프 표현·순회·위상 정렬·SCC", "교재 4장: 그래프 기본"],
    coverage: [
      {
        title: "그래프 기본 용어",
        items: ["정점과 간선", "방향/무방향", "가중/비가중", "차수와 진입/진출 차수", "경로·사이클·연결·강연결"],
      },
      {
        title: "그래프 표현",
        items: ["인접 행렬은 간선 존재 확인이 빠름", "인접 리스트는 희소 그래프 공간 효율이 좋음", "무방향 그래프는 대칭 행렬", "방향 그래프는 행/열 의미를 고정"],
      },
      {
        title: "순회와 응용",
        items: ["DFS 방문 순서는 인접 정점 나열 순서에 따라 달라짐", "BFS는 큐로 계층 방문", "위상 정렬은 DAG만 가능", "SCC는 전치 그래프와 완료시간 순서 또는 low-link로 구함"],
      },
    ],
    tables: [
      {
        title: "인접 행렬 vs 인접 리스트",
        headers: ["구분", "인접 행렬", "인접 리스트"],
        rows: [
          ["공간", "$O(|V|^2)$", "$O(|V|+|E|)$"],
          ["간선 존재 확인", "빠름", "해당 리스트 탐색"],
          ["모든 인접 정점 순회", "행 전체 확인", "리스트 길이만큼"],
          ["유리한 그래프", "밀집 그래프", "희소 그래프"],
        ],
      },
      {
        title: "순회 알고리즘",
        headers: ["알고리즘", "자료구조", "대표 결과", "주의"],
        rows: [
          ["DFS", "스택/재귀", "방문 순서, 완료 시간", "인접 순서 영향"],
          ["BFS", "큐", "레벨, 최단 간선 수", "가중 최단 경로 아님"],
          ["위상 정렬", "진입차수 0 큐", "선후 관계 순서", "사이클 있으면 실패"],
          ["SCC", "DFS 완료순/전치", "강연결 성분", "방향 그래프 대상"],
        ],
      },
    ],
    drills: [
      {
        title: "DFS 순서",
        prompt: "인접 리스트가 작은 번호 순으로 정렬되어 있을 때 방문 순서를 기록.",
        checks: ["시작 정점 표시", "방문한 정점 재방문 금지", "더 갈 곳 없으면 백트래킹"],
      },
      {
        title: "위상 정렬",
        prompt: "진입차수 0 정점이 여러 개일 때 가능한 결과가 하나인지 확인.",
        checks: ["여러 결과 가능", "선택 규칙에 따라 달라짐", "모든 간선 방향은 앞에서 뒤로 유지"],
      },
      {
        title: "SCC",
        prompt: "방향 그래프에서 A→B와 B→A 경로가 모두 있는지 성분 기준으로 확인.",
        checks: ["상호 도달성", "최대 부분그래프", "연결 성분과 구분"],
      },
    ],
    visualAudit: [
      { topic: "DFS/BFS/위상/SCC", status: "인터랙티브 연결", detail: "기존 그래프 실행 시각화 링크 유지." },
      { topic: "그래프 표현", status: "표·드릴 추가", detail: "인접 행렬/리스트 비교가 기존 시각화 밖에 있어 별도 표로 보강." },
      { topic: "SCC 절차", status: "절차 보강", detail: "결과 성분만 보지 않도록 전치 그래프와 완료순 개념을 명시." },
    ],
  },
  9: {
    sourceCheck: ["강의록 9강: MST와 데이크스트라", "교재 4장: 최소 신장 트리와 단일 출발점 최단 경로"],
    coverage: [
      {
        title: "최소 신장 트리",
        items: ["연결 가중 무방향 그래프", "모든 정점을 포함", "사이클 없음", "간선 수 $|V|-1$", "총 가중치 최소"],
      },
      {
        title: "크루스칼과 프림",
        items: ["크루스칼은 간선을 정렬하고 사이클을 피함", "프림은 현재 트리에서 바깥으로 나가는 최소 간선 선택", "둘 다 욕심쟁이 방법", "동률이면 여러 MST 가능"],
      },
      {
        title: "데이크스트라",
        items: ["거리 추정값 초기화", "가장 작은 미확정 정점 확정", "인접 간선 완화", "음수 간선에서 확정 원리가 깨질 수 있음"],
      },
    ],
    tables: [
      {
        title: "그래프 알고리즘 기법 연결",
        headers: ["알고리즘", "문제", "설계 기법", "한계/조건"],
        rows: [
          ["크루스칼", "MST", "욕심쟁이", "무방향 연결 그래프"],
          ["프림", "MST", "욕심쟁이", "인접 최소 간선 선택"],
          ["데이크스트라", "단일 출발점 최단 경로", "욕심쟁이", "음수 간선 부적합"],
          ["벨만-포드", "단일 출발점 최단 경로", "동적 계획식 반복 완화", "느리지만 음수 간선 가능"],
          ["플로이드", "모든 쌍 최단 경로", "동적 프로그래밍", "$O(|V|^3)$"],
        ],
      },
    ],
    drills: [
      {
        title: "크루스칼 적용",
        prompt: "간선을 가중치순으로 보면서 선택/폐기 이유를 각각 적기.",
        checks: ["가중치 오름차순", "사이클 생성 여부", "$|V|-1$개 선택 시 종료"],
      },
      {
        title: "프림 적용",
        prompt: "현재 선택된 정점 집합에서 밖으로 나가는 간선만 후보로 두기.",
        checks: ["전체 최소 간선이 아니라 컷을 가로지르는 최소 간선", "정점 집합 확장", "사이클 방지"],
      },
      {
        title: "데이크스트라 한계",
        prompt: "확정된 정점으로 들어오는 음수 간선이 나중에 발견되면 어떤 문제가 생기는가?",
        checks: ["확정 거리 감소 가능", "욕심쟁이 확정 원리 위반", "벨만-포드 고려"],
      },
    ],
    visualAudit: [
      { topic: "크루스칼/프림/데이크스트라", status: "인터랙티브 연결", detail: "기존 그래프 알고리즘 시각화 링크 유지." },
      { topic: "최단 경로 설계 기법", status: "표 보강", detail: "데이크스트라·벨만-포드·플로이드 기법 차이를 같은 표에 연결." },
      { topic: "MST 조건", status: "드릴 추가", detail: "간선 수·사이클·연결 조건을 적용 문제로 확인." },
    ],
  },
  10: {
    sourceCheck: ["강의록 10강: 벨만-포드·플로이드·네트워크 플로", "교재 4장: 최단 경로와 플로"],
    coverage: [
      {
        title: "벨만-포드",
        items: ["모든 간선을 반복 완화", "$|V|-1$회 반복", "부모 정보로 경로 복원 가능", "추가 완화 가능하면 음수 사이클"],
      },
      {
        title: "플로이드와 P[][]",
        items: ["모든 쌍 최단 거리", "경유 정점 k를 하나씩 허용", "거리 행렬 D와 중간 정점 행렬 P 구분", "P[i][j]를 재귀적으로 따라 실제 경로 복원"],
      },
      {
        title: "네트워크 플로",
        items: ["용량 제한", "유량 보존", "소스와 싱크", "잔여 용량", "정방향/역방향 잔여 간선", "증가 경로의 여유량은 경로 잔여 용량 최솟값"],
      },
    ],
    tables: [
      {
        title: "최단 경로 알고리즘 비교",
        headers: ["알고리즘", "대상", "음수 간선", "핵심"],
        rows: [
          ["데이크스트라", "단일 출발점", "부적합", "최소 거리 미확정 정점 확정"],
          ["벨만-포드", "단일 출발점", "가능", "모든 간선 반복 완화"],
          ["플로이드", "모든 쌍", "가능하나 음수 사이클 주의", "경유 정점 DP"],
        ],
      },
      {
        title: "플로와 잔여 그래프",
        headers: ["개념", "의미", "시험 계산"],
        rows: [
          ["용량 c(u,v)", "간선에 보낼 수 있는 최대값", "유량이 초과하면 오답"],
          ["플로 f(u,v)", "현재 보내는 양", "소스/싱크 제외 보존 확인"],
          ["잔여 용량 r(u,v)", "추가로 보낼 수 있는 양", "증가 경로 후보 판단"],
          ["여유량 Δ", "경로의 병목 잔여 용량", "경로 간선 잔여 용량의 최솟값"],
        ],
      },
    ],
    drills: [
      {
        title: "Floyd P[][] 복원",
        prompt: "P[4][2]=3이고 P[3][2]=0이면 4에서 2까지 경로 복원 흐름.",
        checks: ["4→2 사이 중간 정점 3", "4→3과 3→2로 분할", "0이면 직접 연결 구간"],
      },
      {
        title: "Ford-Fulkerson 여유량",
        prompt: "증가 경로의 잔여 용량이 7,4,5라면 Δ.",
        checks: ["경로 병목 확인", "최솟값 4", "정방향 증가와 역방향 잔여 갱신"],
      },
      {
        title: "벨만-포드 음수 사이클",
        prompt: "$|V|-1$회 후에도 완화되는 간선이 있으면 의미.",
        checks: ["더 짧은 경로가 계속 생김", "음수 사이클 가능", "최단 경로 정의 불안정"],
      },
    ],
    visualAudit: [
      { topic: "벨만-포드/플로이드/포드-풀커슨", status: "인터랙티브 연결", detail: "기존 그래프 알고리즘 시각화 링크 유지." },
      { topic: "Floyd P[][]", status: "드릴 추가", detail: "Claude 검토의 직접 누락 후보. D[][]가 아니라 P[][] 경로 복원 절차를 별도 드릴로 추가." },
      { topic: "잔여 그래프와 여유량", status: "표·드릴 추가", detail: "증가 경로의 병목 잔여 용량 계산을 보강." },
    ],
  },
  11: {
    sourceCheck: ["강의록 11강: 동적 프로그래밍", "교재 5장: 행렬 연쇄 곱셈과 LCS"],
    coverage: [
      {
        title: "동적 프로그래밍 조건",
        items: ["최적성의 원리", "중복 부분문제", "점화식 정의", "작은 소문제부터 테이블 저장", "역추적으로 실제 해 복원"],
      },
      {
        title: "행렬 연쇄 곱셈",
        items: ["행렬 차원 배열 $d_0..d_n$", "C[i][j]는 최소 기본 곱셈 횟수", "P[i][j]는 최적 분할점", "구간 길이를 늘려가며 계산", "P[][]로 괄호 순서 복원"],
      },
      {
        title: "LCS와 배낭 연계",
        items: ["LCS는 부분 문자열이 아니라 부분 수열", "문자가 같으면 대각선+1", "다르면 위/왼쪽 최댓값", "0/1 배낭은 용량 축 테이블로 같은 DP 사고를 사용"],
      },
    ],
    tables: [
      {
        title: "DP 문제별 테이블 의미",
        headers: ["문제", "테이블", "값의 의미", "복원 정보"],
        rows: [
          ["피보나치", "F[i]", "i번째 값", "이전 두 값"],
          ["행렬 연쇄", "C[i][j]", "i..j 최소 곱셈 횟수", "P[i][j] 분할점"],
          ["LCS", "L[i][j]", "두 접두부의 LCS 길이", "대각/위/왼쪽 이동"],
          ["0/1 배낭", "K[i][w]", "i개 물체와 용량 w의 최대 이익", "선택/미선택 비교"],
        ],
      },
    ],
    drills: [
      {
        title: "행렬 연쇄 점화식",
        prompt: "구간 i..j에서 분할점 k를 선택할 때 비용 항을 말로 분해.",
        checks: ["왼쪽 비용 C[i][k]", "오른쪽 비용 C[k+1][j]", "두 결과 행렬 곱셈 비용"],
      },
      {
        title: "P[][] 괄호 복원",
        prompt: "P[1][5]=4이면 첫 분할 위치와 다음 확인 구간.",
        checks: ["(1..4)와 (5..5)로 분할", "1..4의 P값 재확인", "재귀적으로 괄호 구성"],
      },
      {
        title: "LCS 표 추적",
        prompt: "두 문자가 같을 때와 다를 때 LCS 테이블 갱신 규칙을 구분.",
        checks: ["같으면 대각선+1", "다르면 위/왼쪽 중 큰 값", "동률이면 복원 경로가 여러 개 가능"],
      },
    ],
    visualAudit: [
      { topic: "행렬 연쇄 곱셈", status: "강의 실습", detail: "lecture 11의 단계 추적 실습으로 C[][]와 P[][]를 표시." },
      { topic: "LCS", status: "강의 실습", detail: "lecture 11의 단계 추적 실습으로 길이표와 복원 경로 확인." },
      { topic: "0/1 배낭 DP", status: "드릴 추가", detail: "기말 범위의 배낭 문제와 DP 사고를 연결. 별도 애니메이션은 후속 대상." },
    ],
  },
  12: {
    sourceCheck: ["강의록 12강: 브루트-포스·라빈-카프·KMP", "교재 6장: 스트링 매칭"],
    coverage: [
      {
        title: "스트링 매칭 기본",
        items: ["텍스트 길이 n과 패턴 길이 m 구분", "브루트-포스는 모든 시작 위치에서 직접 비교", "알파벳 크기와 문자 코드가 해시 계산에 영향", "전처리 비용과 매칭 비용을 분리"],
      },
      {
        title: "라빈-카프",
        items: ["패턴 해시와 텍스트 윈도 해시 비교", "롤링 해시로 다음 윈도 갱신", "해시 충돌 가능성 때문에 직접 비교 필요", "평균적으로 빠르나 최악은 직접 비교 증가"],
      },
      {
        title: "KMP",
        items: ["패턴의 접두부/접미부 일치 정보를 F 배열에 저장", "불일치 시 F값으로 패턴 인덱스 이동", "텍스트 인덱스는 되돌리지 않음", "전처리와 매칭 모두 선형 시간"],
      },
    ],
    tables: [
      {
        title: "스트링 매칭 비교",
        headers: ["알고리즘", "전처리", "매칭 핵심", "성능 포인트"],
        rows: [
          ["브루트-포스", "없음", "모든 위치 직접 비교", "최악 $O(nm)$"],
          ["라빈-카프", "해시 설정", "해시 후보 후 직접 비교", "평균 효율, 충돌 주의"],
          ["KMP", "실패 함수 F", "접두부/접미부 재사용", "$O(n+m)$"],
          ["보이어-무어", "bad/good shift", "오른쪽부터 비교", "실무적으로 큰 이동 가능"],
        ],
      },
      {
        title: "KMP 실패 함수 의미",
        headers: ["항목", "의미", "시험 포인트"],
        rows: [
          ["F[i]", "P[0..i]에서 접두부=접미부인 최대 위치 정보", "불일치 후 돌아갈 패턴 위치"],
          ["idx", "현재까지 맞은 접두부 끝", "불일치 시 F[idx]로 후퇴"],
          ["전처리 비용", "패턴 길이에 비례", "$O(m)$"],
        ],
      },
    ],
    drills: [
      {
        title: "라빈-카프 후보 검증",
        prompt: "해시가 같지만 실제 문자가 다를 수 있는 이유.",
        checks: ["해시 함수는 압축된 값", "서로 다른 문자열의 같은 해시 가능", "후보는 직접 비교"],
      },
      {
        title: "KMP F 배열",
        prompt: "패턴 `aabaa`에서 각 위치까지의 접두부/접미부 길이를 손으로 표시.",
        checks: ["접두부와 접미부가 같은 부분 찾기", "불일치 시 이전 F값 활용", "전처리 과정 자체가 시험 대상"],
      },
      {
        title: "비교 횟수 관점",
        prompt: "KMP가 텍스트 인덱스를 되돌리지 않는다는 말의 의미.",
        checks: ["이미 비교한 텍스트 문자 재사용", "패턴 위치만 이동", "선형 매칭으로 연결"],
      },
    ],
    visualAudit: [
      { topic: "라빈-카프", status: "강의 실습", detail: "lecture 12의 단계 추적 실습으로 해시 후보와 직접 비교 확인." },
      { topic: "KMP 매칭", status: "강의 실습", detail: "lecture 12의 단계 추적 실습으로 패턴 이동 확인." },
      { topic: "KMP 실패 함수", status: "표·드릴 추가", detail: "Claude 검토의 누락 후보. 전처리 F 배열 구성 드릴 추가." },
    ],
  },
  13: {
    sourceCheck: ["강의록 13강: 보이어-무어와 압축 기초", "교재 6장: 스트링 매칭과 데이터 압축"],
    coverage: [
      {
        title: "보이어-무어",
        items: ["패턴 오른쪽에서 왼쪽으로 비교", "불일치 문자 방법", "일치 접미부 방법", "두 이동량 중 큰 값 선택", "전처리 비용과 최악/평균 성능 구분"],
      },
      {
        title: "불일치 문자 방법",
        items: ["불일치한 텍스트 문자가 패턴에 마지막으로 나타난 위치 확인", "그 위치가 불일치 위치에 오도록 이동", "패턴에 없으면 패턴 전체를 지나치게 이동 가능"],
      },
      {
        title: "압축 기초와 RLE",
        items: ["무손실/손실 압축 구분", "압축률과 복원 가능성", "RLE는 연속 반복을 길이로 표현", "반복이 적으면 오히려 길어질 수 있음"],
      },
    ],
    tables: [
      {
        title: "보이어-무어 이동 규칙",
        headers: ["규칙", "사용 정보", "장점", "주의"],
        rows: [
          ["불일치 문자", "텍스트 불일치 문자와 패턴 내 마지막 위치", "큰 이동 가능", "음수/0 이동은 최소 1칸 처리"],
          ["일치 접미부", "이미 맞은 접미부의 재등장 위치", "반복 패턴에서 효과", "전처리 이해 필요"],
          ["최종 이동", "두 규칙의 큰 값", "불필요한 비교 감소", "한 규칙만 적용하면 이동량 부족 가능"],
        ],
      },
      {
        title: "압축 구분",
        headers: ["방식", "복원", "대표 예", "효과 조건"],
        rows: [
          ["RLE", "무손실", "반복 문자 길이 저장", "긴 run"],
          ["허프만", "무손실", "빈도 기반 가변 길이 코드", "빈도 편차"],
          ["LZ77", "무손실", "이전 문자열 참조", "반복 부분문자열"],
          ["영상 압축", "손실 가능", "시각적으로 덜 민감한 정보 제거", "품질/용량 절충"],
        ],
      },
    ],
    drills: [
      {
        title: "불일치 문자 적용",
        prompt: "패턴 `ABCD`, 비교 중 텍스트 문자가 `X`와 불일치하고 X가 패턴에 없을 때 이동.",
        checks: ["패턴 내 X 없음", "현재 정렬 위치를 크게 이동", "문제의 이동 공식 기준 확인"],
      },
      {
        title: "일치 접미부 확인",
        prompt: "오른쪽 일부가 이미 일치한 상태에서 그 접미부가 패턴 앞쪽에 다시 나타나는지 확인.",
        checks: ["일치한 suffix 추출", "패턴 내부 재등장 위치 확인", "bad character 이동과 비교"],
      },
      {
        title: "RLE 손익",
        prompt: "`AAAAABBC`와 `ABCDEFG` 중 RLE에 유리한 입력.",
        checks: ["반복 run 길이", "부호화 오버헤드", "반복이 적으면 불리"],
      },
    ],
    visualAudit: [
      { topic: "보이어-무어", status: "강의 실습", detail: "lecture 13의 단계 추적 실습으로 오른쪽 비교와 이동 확인." },
      { topic: "불일치 문자 방법", status: "드릴 추가", detail: "시험 범위에 직접 명시된 이동량 계산을 손풀이로 보강." },
      { topic: "RLE", status: "강의 실습", detail: "lecture 13 실습과 압축 구분표로 반복 run 효과 확인." },
    ],
  },
  14: {
    sourceCheck: ["강의록 14강: 허프만 코딩·LZ77", "교재 6장: 데이터 압축"],
    coverage: [
      {
        title: "허프만 코딩",
        items: ["문자 빈도 계산", "최소 빈도 두 노드 반복 병합", "트리 간선에 0/1 부여", "접두부 코드로 유일 복호화", "같은 빈도에서는 트리가 유일하지 않을 수 있음"],
      },
      {
        title: "허프만 성능",
        items: ["알파벳 크기만큼 최소 힙 연산 반복", "트리와 코드 생성 비용은 알파벳 크기에 좌우", "인코딩은 각 문자 코드를 이어 붙임", "디코딩은 루트부터 비트에 따라 leaf까지 이동"],
      },
      {
        title: "LZ77",
        items: ["검색 버퍼와 lookahead 버퍼", "이전 문자열과 가장 긴 일치 탐색", "출력 triple: 거리, 길이, 다음 문자", "디코딩은 거리와 길이로 이미 복원된 문자열 참조"],
      },
    ],
    tables: [
      {
        title: "허프만 vs LZ77",
        headers: ["구분", "허프만", "LZ77"],
        rows: [
          ["기준", "문자 빈도", "이전 문자열 반복"],
          ["자료구조", "이진 트리/최소 힙", "슬라이딩 윈도"],
          ["출력", "가변 길이 비트 코드", "(거리, 길이, 다음 문자)"],
          ["주의", "동률 시 코드가 달라질 수 있음", "거리 기준을 현재 위치에서 계산"],
        ],
      },
      {
        title: "허프만 코드 생성 체크",
        headers: ["단계", "확인할 값", "오답 원인"],
        rows: [
          ["빈도 정렬", "최소 두 빈도", "큰 빈도 먼저 병합"],
          ["부모 생성", "두 빈도 합", "합산 누락"],
          ["0/1 부여", "왼쪽/오른쪽 일관성", "중간에 규칙 변경"],
          ["코드 확인", "다른 코드의 접두부가 아님", "유일 복호화 실패"],
        ],
      },
    ],
    drills: [
      {
        title: "허프만 병합",
        prompt: "빈도 5,7,10,15에서 첫 두 번 병합.",
        checks: ["5와 7 병합해 12", "10과 12 병합 또는 남은 최소 두 개 확인", "매번 현재 최소 두 개 선택"],
      },
      {
        title: "허프만 디코딩",
        prompt: "비트열을 루트부터 따라가며 leaf에 도달할 때마다 문자 출력.",
        checks: ["leaf 도달 시 문자 확정", "루트로 복귀", "접두부 코드라 경계가 모호하지 않음"],
      },
      {
        title: "LZ77 triple",
        prompt: "현재 위치 앞 검색 버퍼에 같은 문자열이 있으면 거리와 길이를 어떻게 잡는가?",
        checks: ["가장 긴 일치 선택", "현재 위치에서 과거 시작점까지 거리", "일치 뒤 다음 문자 포함"],
      },
    ],
    visualAudit: [
      { topic: "허프만 트리/코드", status: "강의 실습", detail: "lecture 14의 단계 추적 실습으로 빈도 병합과 코드 확인." },
      { topic: "LZ77 인코딩", status: "강의 실습", detail: "lecture 14의 단계 추적 실습으로 검색 버퍼/lookahead와 triple 확인." },
      { topic: "허프만 유일성", status: "드릴 추가", detail: "같은 빈도에서 트리와 코드는 달라질 수 있으나 접두부 성질은 유지됨을 보강." },
    ],
  },
  15: {
    sourceCheck: ["강의록 15강: NP-완전 문제", "교재 7장: NP-완전과 근사 알고리즘"],
    coverage: [
      {
        title: "복잡도 클래스",
        items: ["P는 결정론적 다항 시간 판정 문제", "NP는 다항 시간 검증 가능한 판정 문제로 이해 가능", "NP-하드는 모든 NP 문제가 다항 시간 변환되는 어려움 조건", "NP-완전은 NP에 속하면서 NP-하드"],
      },
      {
        title: "변환과 판정 문제",
        items: ["최적화 문제는 임계값을 둔 판정 문제로 바꾸어 다룸", "A가 B로 변환되면 B를 풀 수 있을 때 A도 풀 수 있음", "알려진 NP-완전 문제에서 새 문제로 변환해 어려움을 보임"],
      },
      {
        title: "대표 문제와 근사",
        items: ["SAT/3-SAT", "클리크·독립집합·버텍스 커버", "해밀턴 사이클", "외판원 문제", "통 채우기", "근사 알고리즘은 품질 비율을 함께 확인"],
      },
    ],
    tables: [
      {
        title: "P/NP/NP-hard/NP-complete",
        headers: ["분류", "NP 소속 필요", "다항 시간 해결 알려짐", "핵심 조건"],
        rows: [
          ["P", "예", "예", "결정론적 다항 시간 해결"],
          ["NP", "예", "일부만 알려짐", "해 검증이 다항 시간"],
          ["NP-hard", "아니오", "일반적으로 어려움", "모든 NP 문제가 변환"],
          ["NP-complete", "예", "P=NP이면 가능", "NP 소속 + NP-hard"],
        ],
      },
      {
        title: "대표 NP-완전/근사 문제",
        headers: ["문제", "개념", "연결"],
        rows: [
          ["Vertex Cover", "모든 간선을 덮는 정점 집합", "2-근사 greedy"],
          ["Clique", "모든 정점 쌍이 인접한 부분집합", "독립집합/보수 그래프"],
          ["Hamiltonian Cycle", "모든 정점을 한 번씩 지나는 사이클", "TSP 판정형과 연결"],
          ["TSP", "모든 도시 순회 최소 비용", "metric 조건 근사"],
          ["Bin Packing", "물건을 최소 통 수에 배치", "first-fit류 근사"],
        ],
      },
    ],
    drills: [
      {
        title: "NP-완전 증명 틀",
        prompt: "새 문제 X가 NP-완전임을 보이기 위한 두 단계.",
        checks: ["X가 NP에 속함", "알려진 NP-완전 문제 Y를 X로 다항 시간 변환", "방향을 X→Y로 쓰지 않도록 주의"],
      },
      {
        title: "판정형 변환",
        prompt: "TSP 최적화 문제를 판정 문제로 바꾸기.",
        checks: ["경로 길이 한계 K 제시", "길이 K 이하 순회가 있는가?", "예/아니오 답으로 구성"],
      },
      {
        title: "근사비 감각",
        prompt: "최적해가 10이고 2-근사 알고리즘 결과가 18이면 보장 위반인가?",
        checks: ["최소화 문제 2-근사는 결과 ≤ 20 보장", "18은 보장 범위", "최적해와 같다는 의미는 아님"],
      },
    ],
    visualAudit: [
      { topic: "NP 분류", status: "강의 실습", detail: "lecture 15의 NP taxonomy 실습으로 P/NP/NP-hard/NP-complete 관계 확인." },
      { topic: "대표 문제", status: "강의 실습", detail: "Vertex Cover, TSP, Bin Packing 데모 유지." },
      { topic: "변환 방향과 근사비", status: "표·드릴 추가", detail: "개념 카드만으로 부족한 reduction/approximation reasoning 보강." },
    ],
  },
};

export function getAlgorithmLecture(id: number) {
  return algorithmLectures.find((lecture) => lecture.id === id);
}

export function getAlgorithmChapterWeight(chapter: AlgorithmChapterId) {
  return algorithmChapterWeights.find((item) => item.chapter === chapter);
}

export function getAlgorithmLectureAddendum(id: number) {
  return algorithmLectureAddenda[id];
}
