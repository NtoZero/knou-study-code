import type { PrereqEntry } from "@/lib/mlPrereqs";

/** 13강에서 새로 필요한 선행 개념 */
export const lecture13Prereqs: PrereqEntry[] = [
  {
    id: "pre-bounding-box",
    term: "직사각형으로 위치를 적는 법",
    en: "bounding box",
    area: "벡터와 행렬",
    short: "영상 안의 한 영역을 왼쪽 위 좌표와 너비·높이 네 숫자로 적은 것.",
    why: "객체 검출의 출력은 클래스 레이블 하나가 아니라 ‘무엇이, 어디에’다. 그 ‘어디에’를 숫자로 적는 약속이 직사각형 박스다. 이 네 숫자의 뜻이 잡히지 않으면 YOLO 출력값의 x, y, w, h가 무엇을 가리키는지 읽히지 않는다.",
    definition:
      "영상 좌표계는 보통 왼쪽 위가 원점이고, 오른쪽으로 갈수록 x가, 아래로 갈수록 y가 커진다. 한 영역은 (x, y, w, h) 네 숫자로 적는다. x, y는 박스의 기준점, w는 가로 길이, h는 세로 길이다. 박스의 넓이는 w × h이고, 오른쪽 아래 모서리는 (x + w, y + h)다. 기준점을 왼쪽 위 모서리로 잡기도 하고 박스의 중심으로 잡기도 하므로, 어느 쪽인지는 그때그때 정의를 확인해야 한다.",
    formula: [
      { expr: "넓이 = w × h" },
      { expr: "오른쪽 아래 모서리 = (x + w, y + h)" },
    ],
    example: {
      setup: "왼쪽 위 모서리를 기준으로 (x, y, w, h) = (2, 6, 5, 3)인 박스",
      work: [
        "가로로 2부터 2 + 5 = 7까지 걸쳐 있다",
        "세로로 6부터 6 + 3 = 9까지 걸쳐 있다",
        "넓이는 5 × 3 = 15",
      ],
      result: "네 숫자만으로 영역 하나가 완전히 정해진다",
    },
    usedIn: [
      {
        lecture: 13,
        where:
          "객체의 위치 탐지 — 영상에 포함된 복수 개의 객체를 찾고 그 위치를 직사각형 박스로 표시",
      },
      {
        lecture: 13,
        where:
          "YOLO 출력값의 정의 — x, y는 그리드 칸 안에서의 박스 중심, w, h는 영상 크기 기준의 너비·높이",
      },
    ],
    pitfall:
      "YOLO에서는 x, y와 w, h의 기준이 서로 다르다. x, y는 그리드 칸 크기를 기준으로 한 0~1 값이고, w, h는 영상 전체 크기를 기준으로 한 0~1 값이다. 같은 0.5라도 가리키는 길이가 다르다.",
  },
];

/** 이미 있는 선행 개념이 13강에서 쓰이는 자리 */
export const lecture13PrereqUsages: { id: string; where: string }[] = [
  {
    id: "pre-proportion",
    where: "Top-5 오류율(%)과 영상분할에서 범주별 화소가 전체의 몇 %를 차지하는지 읽기",
  },
  {
    id: "pre-gaussian",
    where: "GAN 생성기의 입력으로 들어가는 랜덤 노이즈 ~ N(0, 1)",
  },
  {
    id: "pre-conditional-prob",
    where: "YOLO 출력의 클래스 점수 — P(객체가 클래스 i | 박스 안에 객체가 있음)",
  },
  {
    id: "pre-gradient",
    where:
      "층이 깊어질 때의 기울기 소멸과, 잔차 모듈의 ∂H/∂𝒙 = ∂F/∂𝒙 + 1이 역전파에서 갖는 뜻",
  },
  {
    id: "pre-column-vector",
    where:
      "Show and Tell — GoogLeNet의 인식 층이 아닌 그 이전 층의 출력을 특징값 벡터로 뽑아 RNN의 입력으로 제공",
  },
];
