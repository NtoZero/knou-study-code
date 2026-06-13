import type { PastExamSolutionProcess } from "@/components/pastExam/solutionProcessTypes";

export const AI_PAST_EXAM_SOLUTION_PROCESSES = {
  "2018-2-q01": {
    title: "게임트리 값 역전파",
    overview: "최대최소 탐색트리는 말단 평가값을 부모로 올린 뒤, 루트에서 가장 유리한 자식을 고르는 문항에만 풀이과정을 붙인다.",
    steps: [
      {
        title: "말단값 묶기",
        body: "B, C, D, E의 하위 말단값을 각각 한 묶음으로 본다.",
      },
      {
        title: "MIN 단계 계산",
        body: "상대 차례의 내부 노드는 각 묶음에서 가장 작은 값을 부모값으로 올린다.",
      },
      {
        title: "MAX 단계 선택",
        body: "A에서는 올라온 값 중 가장 큰 4를 고르므로 다음 선택은 B이다.",
      },
    ],
    visual: {
      kind: "tree",
      title: "A에서 B가 선택되는 과정",
      frames: [
        {
          title: "1. 말단 평가값을 자식별로 묶기",
          caption: "말단 F~Q의 평가값을 B, C, D, E 아래에 나누어 붙인다.",
          nodes: [
            { id: "A", label: "A", x: 50, y: 10, variant: "idle" },
            { id: "B", label: "B: 5,6,4", x: 15, y: 48, variant: "active" },
            { id: "C", label: "C: 6,2,7", x: 38, y: 48, variant: "active" },
            { id: "D", label: "D: 5,9,3", x: 62, y: 48, variant: "active" },
            { id: "E", label: "E: 5,1,2", x: 85, y: 48, variant: "active" },
          ],
          edges: [
            { from: "A", to: "B" },
            { from: "A", to: "C" },
            { from: "A", to: "D" },
            { from: "A", to: "E" },
          ],
          table: {
            columns: ["자식", "말단값", "부모로 올릴 값"],
            rows: [
              { cells: ["B", "5, 6, 4", "아직 계산 전"], variant: "active" },
              { cells: ["C", "6, 2, 7", "아직 계산 전"], variant: "active" },
              { cells: ["D", "5, 9, 3", "아직 계산 전"], variant: "active" },
              { cells: ["E", "5, 1, 2", "아직 계산 전"], variant: "active" },
            ],
          },
        },
        {
          title: "2. 각 자식 노드에서 작은 값 올리기",
          caption: "A의 자식은 상대가 선택하는 단계이므로 각 묶음의 최솟값을 올린다.",
          nodes: [
            { id: "A", label: "A", x: 50, y: 10, variant: "idle" },
            { id: "B", label: "B=4", x: 15, y: 48, variant: "done" },
            { id: "C", label: "C=2", x: 38, y: 48, variant: "done" },
            { id: "D", label: "D=3", x: 62, y: 48, variant: "done" },
            { id: "E", label: "E=1", x: 85, y: 48, variant: "done" },
          ],
          edges: [
            { from: "A", to: "B", label: "4", variant: "done" },
            { from: "A", to: "C", label: "2", variant: "done" },
            { from: "A", to: "D", label: "3", variant: "done" },
            { from: "A", to: "E", label: "1", variant: "done" },
          ],
          table: {
            columns: ["자식", "계산", "값"],
            rows: [
              { cells: ["B", "min(5,6,4)", "4"], variant: "answer" },
              { cells: ["C", "min(6,2,7)", "2"] },
              { cells: ["D", "min(5,9,3)", "3"] },
              { cells: ["E", "min(5,1,2)", "1"] },
            ],
          },
        },
        {
          title: "3. A에서 가장 큰 값 고르기",
          caption: "A는 MAX 단계이므로 4, 2, 3, 1 중 4를 고르고 B로 이동한다.",
          nodes: [
            { id: "A", label: "A=4", x: 50, y: 10, variant: "answer" },
            { id: "B", label: "B=4", x: 15, y: 48, variant: "answer" },
            { id: "C", label: "C=2", x: 38, y: 48, variant: "idle" },
            { id: "D", label: "D=3", x: 62, y: 48, variant: "idle" },
            { id: "E", label: "E=1", x: 85, y: 48, variant: "idle" },
          ],
          edges: [
            { from: "A", to: "B", label: "선택", variant: "answer" },
            { from: "A", to: "C" },
            { from: "A", to: "D" },
            { from: "A", to: "E" },
          ],
          array: [
            { label: "B", value: "4", variant: "answer" },
            { label: "C", value: "2" },
            { label: "D", value: "3" },
            { label: "E", value: "1" },
          ],
        },
      ],
    },
    checkpoint: "말단값을 바로 루트에서 비교하지 말고, 먼저 자식 노드의 MIN 값을 만든 뒤 A에서 MAX를 선택한다.",
  },
  "2018-2-q02": {
    title: "α-β 가지치기 디버깅",
    overview: "α와 β의 크기 비교가 필요한 문항은 탐색 중단 시점을 눈으로 확인할 수 있게 표시한다.",
    steps: [
      { title: "현재 한계 읽기", body: "C에 도착했을 때 α=4, β=∞라는 현재 탐색 한계를 먼저 적는다." },
      { title: "J 값 반영", body: "J의 값 2를 본 뒤 C의 β가 2로 내려간다." },
      { title: "남은 자식 자르기", body: "β=2가 α=4보다 작으므로 K와 L을 더 보지 않아도 된다." },
    ],
    visual: {
      kind: "tree",
      title: "C에서 K, L이 잘리는 순간",
      frames: [
        {
          title: "1. C의 시작 상태",
          caption: "이미 A 쪽에서 α=4가 확보되어 있고 C의 β는 아직 제한이 없다.",
          nodes: [
            { id: "A", label: "α=4", x: 50, y: 12, variant: "done" },
            { id: "C", label: "C β=∞", x: 50, y: 42, variant: "active" },
            { id: "J", label: "J", x: 25, y: 76 },
            { id: "K", label: "K", x: 50, y: 76 },
            { id: "L", label: "L", x: 75, y: 76 },
          ],
          edges: [
            { from: "A", to: "C", label: "α=4", variant: "done" },
            { from: "C", to: "J" },
            { from: "C", to: "K" },
            { from: "C", to: "L" },
          ],
        },
        {
          title: "2. J=2를 C에 반영",
          caption: "MIN 노드 C는 본 값 중 작은 값을 β로 잡으므로 β가 2가 된다.",
          nodes: [
            { id: "A", label: "α=4", x: 50, y: 12, variant: "done" },
            { id: "C", label: "C β=2", x: 50, y: 42, variant: "active" },
            { id: "J", label: "J=2", x: 25, y: 76, variant: "done" },
            { id: "K", label: "K", x: 50, y: 76 },
            { id: "L", label: "L", x: 75, y: 76 },
          ],
          edges: [
            { from: "A", to: "C", label: "α=4", variant: "done" },
            { from: "C", to: "J", label: "2", variant: "done" },
            { from: "C", to: "K" },
            { from: "C", to: "L" },
          ],
          formula: [
            { value: "β(C)=2", variant: "active" },
            { value: "<" },
            { value: "α=4", variant: "done" },
          ],
        },
        {
          title: "3. K, L 가지치기",
          caption: "C는 이미 4보다 좋은 값을 A에 줄 수 없으므로 K와 L의 평가는 생략한다.",
          nodes: [
            { id: "A", label: "α=4", x: 50, y: 12, variant: "done" },
            { id: "C", label: "C β=2", x: 50, y: 42, variant: "answer" },
            { id: "J", label: "J=2", x: 25, y: 76, variant: "done" },
            { id: "K", label: "K", x: 50, y: 76, variant: "cut" },
            { id: "L", label: "L", x: 75, y: 76, variant: "cut" },
          ],
          edges: [
            { from: "A", to: "C", label: "α=4", variant: "done" },
            { from: "C", to: "J", label: "확인", variant: "done" },
            { from: "C", to: "K", label: "cut", variant: "cut" },
            { from: "C", to: "L", label: "cut", variant: "cut" },
          ],
        },
      ],
    },
    checkpoint: "α-β 문항은 값 자체보다 β≤α가 되는 순간 어떤 형제 노드를 보지 않는지가 핵심이다.",
  },
  "2019-2-q03": {
    title: "MCTS 네 단계 순서",
    overview: "순서 선택 문항은 용어를 길게 설명하기보다 네 단계가 이어지는 방향을 애니메이션으로 확인한다.",
    steps: [
      { title: "선택", body: "이미 있는 트리에서 탐사와 활용 기준으로 내려갈 노드를 고른다." },
      { title: "확장·시뮬레이션", body: "새 노드를 붙이고 임의 진행으로 결과를 얻는다." },
      { title: "역전파", body: "시뮬레이션 결과를 선택 경로를 따라 위로 되돌려 통계를 갱신한다." },
    ],
    visual: {
      kind: "sequence",
      title: "선택 → 확장 → 시뮬레이션 → 역전파",
      frames: [
        {
          title: "1. 선택",
          caption: "루트에서 통계가 있는 자식 중 다음 탐색 경로를 고른다.",
          array: [
            { value: "선택", variant: "active" },
            { value: "확장" },
            { value: "시뮬레이션" },
            { value: "역전파" },
          ],
        },
        {
          title: "2. 확장 뒤 시뮬레이션",
          caption: "선택된 말단에 새 노드를 붙이고 끝 상태까지 가상 진행한다.",
          array: [
            { value: "선택", variant: "done" },
            { value: "확장", variant: "active" },
            { value: "시뮬레이션", variant: "active" },
            { value: "역전파" },
          ],
        },
        {
          title: "3. 결과 역전파",
          caption: "승패나 보상 값을 지나온 노드의 방문 수와 가치 통계에 더한다.",
          array: [
            { value: "선택", variant: "done" },
            { value: "확장", variant: "done" },
            { value: "시뮬레이션", variant: "done" },
            { value: "역전파", variant: "answer" },
          ],
        },
      ],
    },
    checkpoint: "MCTS 순서는 노드를 고른 뒤 붙이고, 진행 결과를 다시 위로 올리는 흐름이다.",
  },
  "2017-2-q08": {
    title: "도출연역 상보 리터럴 제거",
    overview: "절 계산 문항은 두 부모절에서 서로 지워지는 리터럴을 표시하면 답이 바로 보인다.",
    steps: [
      { title: "부모절 나누기", body: "~p∨q∨r과 ~q∨s를 두 줄로 나누어 쓴다." },
      { title: "상보쌍 제거", body: "q와 ~q는 서로 상보 리터럴이므로 도출 과정에서 제거한다." },
      { title: "나머지 합치기", body: "남은 ~p, r, s를 논리합으로 묶어 ~p∨r∨s를 만든다." },
    ],
    visual: {
      kind: "formula",
      title: "q와 ~q를 지우는 절 계산",
      frames: [
        {
          title: "1. 부모절 확인",
          caption: "두 절을 한 줄에 섞지 않고 부모절 1, 부모절 2로 분리한다.",
          formula: [
            { value: "~p" },
            { value: "∨" },
            { value: "q", variant: "active" },
            { value: "∨" },
            { value: "r" },
            { value: "," },
            { value: "~q", variant: "active" },
            { value: "∨" },
            { value: "s" },
          ],
        },
        {
          title: "2. 상보 리터럴 제거",
          caption: "q와 ~q만 제거하고 다른 리터럴은 버리지 않는다.",
          formula: [
            { value: "~p" },
            { value: "∨" },
            { value: "q", variant: "cut" },
            { value: "∨" },
            { value: "r" },
            { value: "," },
            { value: "~q", variant: "cut" },
            { value: "∨" },
            { value: "s" },
          ],
        },
        {
          title: "3. 도출절 만들기",
          caption: "제거되지 않은 리터럴을 합치면 보기 ②의 절이 된다.",
          formula: [
            { value: "~p", variant: "answer" },
            { value: "∨", variant: "answer" },
            { value: "r", variant: "answer" },
            { value: "∨", variant: "answer" },
            { value: "s", variant: "answer" },
          ],
        },
      ],
    },
    checkpoint: "도출연역은 상보 리터럴만 지우고, 나머지 리터럴은 모두 남긴다.",
  },
  "2018-2-q26": {
    title: "k-평균 중심 갱신",
    overview: "k-평균은 분류된 표본 묶음이 생긴 뒤 중심을 다시 평균으로 옮기는 문항에만 풀이과정을 붙인다.",
    steps: [
      { title: "가까운 중심 찾기", body: "각 표본이 어떤 평균벡터에 가장 가까운지 먼저 배정한다." },
      { title: "부분집합 만들기", body: "같은 평균벡터에 배정된 표본들을 하나의 군집 후보로 묶는다." },
      { title: "평균으로 갱신", body: "그 표본 부분집합의 평균을 새 평균벡터로 사용한다." },
    ],
    visual: {
      kind: "network",
      title: "표본 묶음에서 중심으로 되돌아가기",
      frames: [
        {
          title: "1. 표본을 가까운 중심에 배정",
          caption: "표본은 가장 가까운 평균벡터 쪽 군집으로 들어간다.",
          nodes: [
            { id: "m", label: "평균벡터", x: 50, y: 46, variant: "active" },
            { id: "x1", label: "x1", x: 30, y: 24 },
            { id: "x2", label: "x2", x: 70, y: 28 },
            { id: "x3", label: "x3", x: 58, y: 72 },
          ],
          edges: [
            { from: "x1", to: "m", variant: "active" },
            { from: "x2", to: "m", variant: "active" },
            { from: "x3", to: "m", variant: "active" },
          ],
        },
        {
          title: "2. 표본 부분집합 확인",
          caption: "같은 중심에 가까운 표본들이 새 평균 계산의 입력이 된다.",
          table: {
            columns: ["군집", "포함 표본", "다음 처리"],
            rows: [
              { cells: ["Cᵢ", "x1, x2, x3", "평균 계산"], variant: "active" },
            ],
          },
        },
        {
          title: "3. 중심을 평균으로 이동",
          caption: "평균벡터를 표본 부분집합의 산술평균 위치로 업데이트한다.",
          nodes: [
            { id: "old", label: "이전 중심", x: 38, y: 60, variant: "cut" },
            { id: "new", label: "새 중심", x: 56, y: 44, variant: "answer" },
            { id: "x1", label: "x1", x: 30, y: 24, variant: "done" },
            { id: "x2", label: "x2", x: 70, y: 28, variant: "done" },
            { id: "x3", label: "x3", x: 58, y: 72, variant: "done" },
          ],
          edges: [
            { from: "old", to: "new", label: "update", variant: "answer" },
          ],
        },
      ],
    },
    checkpoint: "k-평균에서 중심을 키우거나 표본을 중심 방향으로 움직이는 것이 아니라, 중심 자체를 배정 표본들의 평균으로 바꾼다.",
  },
  "2019-2-q32": {
    title: "SOM 가중치 벡터 이동",
    overview: "SOM 갱신식은 가중치가 입력 벡터 쪽으로 이동한다는 방향만 잡으면 부호를 헷갈리지 않는다.",
    steps: [
      { title: "현재 가중치 표시", body: "wm(t)를 현재 승자 노드 또는 이웃 노드의 가중치로 둔다." },
      { title: "입력 방향 계산", body: "xj-wm(t)는 현재 가중치에서 입력 벡터로 향하는 방향이다." },
      { title: "α만큼 이동", body: "wm(t)에 α(t){xj-wm(t)}를 더해 입력 쪽으로 가깝게 만든다." },
    ],
    visual: {
      kind: "network",
      title: "wm이 xj 쪽으로 이동하는 식",
      frames: [
        {
          title: "1. 현재 위치와 입력 위치",
          caption: "현재 가중치 wm(t)와 학습표본 xj를 분리해서 본다.",
          nodes: [
            { id: "w", label: "wm(t)", x: 28, y: 58, variant: "active" },
            { id: "x", label: "xj", x: 76, y: 28, variant: "done" },
          ],
        },
        {
          title: "2. 입력으로 향하는 방향",
          caption: "xj-wm(t)는 현재 가중치에서 입력 벡터로 향하는 차이 벡터이다.",
          nodes: [
            { id: "w", label: "wm(t)", x: 28, y: 58, variant: "active" },
            { id: "x", label: "xj", x: 76, y: 28, variant: "done" },
          ],
          edges: [
            { from: "w", to: "x", label: "xj-wm(t)", variant: "active" },
          ],
        },
        {
          title: "3. 새 가중치",
          caption: "양수 α(t)를 곱한 만큼만 이동하므로 입력에 가까워진다.",
          nodes: [
            { id: "w", label: "wm(t)", x: 28, y: 58, variant: "cut" },
            { id: "new", label: "wm(t+1)", x: 52, y: 43, variant: "answer" },
            { id: "x", label: "xj", x: 76, y: 28, variant: "done" },
          ],
          edges: [
            { from: "w", to: "new", label: "+α(t){xj-wm(t)}", variant: "answer" },
            { from: "new", to: "x", variant: "done" },
          ],
          formula: [
            { value: "wm(t+1)", variant: "answer" },
            { value: "=" },
            { value: "wm(t)" },
            { value: "+", variant: "answer" },
            { value: "α(t){xj-wm(t)}", variant: "answer" },
          ],
        },
      ],
    },
    checkpoint: "SOM 갱신식은 빼는 식이 아니라 현재 가중치에 입력 방향의 일부를 더하는 식이다.",
  },
  "2019-2-q01": {
    title: "빈칸이 있는 최대최소 트리",
    overview: "A는 MAX 노드, B·C·D는 MIN 노드로 보고 말단값을 한 단계씩 위로 올린다. 빈칸 L만 맞히는 문제가 아니라 L을 넣었을 때 D가 선택되고 루트 A의 값도 보기와 일치해야 한다.",
    steps: [
      {
        title: "MIN 값 올리기",
        body: "B는 min(4,9,5)=4, C는 min(7,12)=7이다. D는 min(8,13,L)이므로 L을 넣기 전에는 D의 값을 확정하지 않는다.",
      },
      {
        title: "L 후보 대입",
        body: "④번의 L=10을 넣으면 D=min(8,13,10)=8이다. L이 크더라도 D는 말단 8 때문에 8을 넘지 못한다는 점이 핵심이다.",
      },
      {
        title: "A에서 MAX 선택",
        body: "A는 max(B=4,C=7,D=8)=8을 선택한다. 따라서 D가 선택되고 A의 값도 8이 되어 ④번의 (ㄱ) 10, (ㄴ) 8이 동시에 맞는다.",
      },
    ],
    visual: {
      kind: "tree",
      title: "B, C, D 값을 만든 뒤 A에서 선택",
      frames: [
        {
          title: "1. B와 C의 MIN 값 먼저 계산",
          caption: "B와 C는 말단값 중 작은 값을 부모값으로 올린다. D는 L이 비어 있어 아직 후보값만 표시한다.",
          nodes: [
            { id: "A", label: "A=MAX", x: 50, y: 10 },
            { id: "B", label: "B=min(4,9,5)=4", x: 18, y: 42, variant: "done" },
            { id: "C", label: "C=min(7,12)=7", x: 50, y: 42, variant: "done" },
            { id: "D", label: "D=min(8,13,L)", x: 82, y: 42, variant: "active" },
            { id: "Bleaf", label: "4 9 5", x: 18, y: 76 },
            { id: "Cleaf", label: "7 12", x: 50, y: 76 },
            { id: "Dleaf", label: "8 13 L?", x: 82, y: 76, variant: "active" },
          ],
          edges: [
            { from: "A", to: "B", label: "4", variant: "done" },
            { from: "A", to: "C", label: "7", variant: "done" },
            { from: "A", to: "D", variant: "active" },
            { from: "B", to: "Bleaf" },
            { from: "C", to: "Cleaf" },
            { from: "D", to: "Dleaf", variant: "active" },
          ],
          table: {
            columns: ["노드", "계산", "올라가는 값"],
            rows: [
              { cells: ["B", "min(4,9,5)", "4"], variant: "done" },
              { cells: ["C", "min(7,12)", "7"], variant: "done" },
              { cells: ["D", "min(8,13,L)", "L 대입 필요"], variant: "active" },
            ],
          },
        },
        {
          title: "2. L=10을 D에 대입",
          caption: "④번의 L=10을 넣으면 D는 min(8,13,10)=8이다. MIN 노드라서 10이 그대로 올라가지 않고 8이 올라간다.",
          nodes: [
            { id: "A", label: "A=MAX", x: 50, y: 10 },
            { id: "B", label: "B=4", x: 18, y: 42, variant: "done" },
            { id: "C", label: "C=7", x: 50, y: 42, variant: "done" },
            { id: "D", label: "D=8", x: 82, y: 42, variant: "answer" },
            { id: "Dleaf", label: "8 13 10", x: 82, y: 76, variant: "answer" },
          ],
          edges: [
            { from: "A", to: "B", label: "4", variant: "done" },
            { from: "A", to: "C", label: "7", variant: "done" },
            { from: "A", to: "D", label: "8", variant: "answer" },
            { from: "D", to: "Dleaf", label: "min", variant: "answer" },
          ],
          formula: [
            { value: "D" },
            { value: "=" },
            { value: "min(8,13,10)", variant: "active" },
            { value: "=" },
            { value: "8", variant: "answer" },
          ],
        },
        {
          title: "3. A에서 MAX로 최종 선택",
          caption: "A는 4, 7, 8 중 가장 큰 값을 고른다. 그래서 D가 선택되고 A의 값은 8이다.",
          nodes: [
            { id: "A", label: "A=max(4,7,8)=8", x: 50, y: 10, variant: "answer" },
            { id: "B", label: "B=4", x: 18, y: 46 },
            { id: "C", label: "C=7", x: 50, y: 46 },
            { id: "D", label: "D=8 선택", x: 82, y: 46, variant: "answer" },
          ],
          edges: [
            { from: "A", to: "B", label: "4" },
            { from: "A", to: "C", label: "7" },
            { from: "A", to: "D", label: "선택", variant: "answer" },
          ],
          array: [
            { label: "ㄱ", value: "10", variant: "answer" },
            { label: "ㄴ", value: "8", variant: "answer" },
          ],
        },
      ],
    },
    checkpoint: "L=10은 D의 말단값이지만 D의 부모값은 MIN 계산 때문에 8이다. A는 그 8을 선택하므로 (ㄱ) 10과 (ㄴ) 8을 함께 고른다.",
  },
} satisfies Record<string, PastExamSolutionProcess>;
