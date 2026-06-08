export type SoftwareFrequentConcept = {
  id: string;
  label: string;
  category: string;
  lectureIds: number[];
  refs: string[];
  years: number[];
  frequency: number;
  sourceLabel: string;
  definition: string;
  examCue: string;
  surrounding: string[];
  variants: string[];
  visuals?: {
    src: string;
    alt: string;
    caption: string;
    sourceLabel: string;
    width: number;
    height: number;
  }[];
};

const concepts = [
  {
    id: "software-overview",
    label: "소프트웨어 공학 개요",
    category: "기초",
    lectureIds: [1],
    refs: ["2019-01", "2019-16", "2017-01", "2017-02"],
    sourceLabel: "1강·교재 1장",
    definition: "소프트웨어의 범위, 성질, 공학적 생산 목표, 공학 환경의 계층을 다루는 기초 개념.",
    examCue: "마모, 변경 용이성, 공학 목표, 방법론·도구 계층을 섞은 부정형 문항으로 자주 출제.",
    surrounding: ["무형성", "비마모성", "소프트웨어 공학 환경", "좋은 소프트웨어 기준"],
    variants: ["software engineering", "공학 목표", "소프트웨어 성질"],
  },
  {
    id: "process-models",
    label: "소프트웨어 프로세스 모델",
    category: "프로세스",
    lectureIds: [2],
    refs: ["2019-02", "2019-03", "2018-02", "2018-03", "2018-04", "2017-03", "2017-04", "2017-05"],
    sourceLabel: "2강·교재 2장",
    definition: "명세, 개발, 검증, 진화 활동을 조직화하는 절차와 폭포수·점증·나선형·V 모델·애자일 등의 생명주기 모델.",
    examCue: "폭포수 장단점, 점증적 릴리스, 프로토타이핑, 애자일 관련 용어와 무관 용어를 구분.",
    surrounding: ["폭포수 모델", "점증적 모델", "나선형 모델", "애자일", "XP"],
    variants: ["SDLC", "Scrum", "프로토타이핑"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/process-prototyping-cycle.png",
        alt: "빠른 계획, 빠른 설계, 프로토타입 만들기, 실행과 피드백이 순환하는 프로토타이핑 과정",
        caption: "프로토타이핑은 요구가 불분명할 때 빠른 설계와 피드백을 반복해 요구사항을 구체화하는 모델로 판별.",
        sourceLabel: "교재 2장 프로토타이핑 과정",
        width: 692,
        height: 455,
      },
    ],
  },
  {
    id: "project-management",
    label: "프로젝트 관리와 규모 산정",
    category: "관리",
    lectureIds: [3],
    refs: ["2019-04", "2019-05", "2019-06", "2019-07", "2018-05", "2018-06", "2018-07", "2017-06", "2017-07", "2017-08", "2017-10"],
    sourceLabel: "3강·교재 3장",
    definition: "WBS, Gantt, PERT/CPM, 기능 점수, 조직 구조, CMMI를 통해 일정·비용·범위·성숙도를 관리하는 개념.",
    examCue: "AFP=UFP*VAF, 임계 경로, CMMI 단계, 제안서 포함 산출물을 직접 묻는다.",
    surrounding: ["WBS", "Gantt", "CPM", "기능 점수", "CMMI"],
    variants: ["PERT", "critical path", "Managed"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/project-cpm-network.png",
        alt: "작업 A부터 M까지의 CPM 네트워크와 각 노드의 EST, EFT, LST, LFT 및 여유 시간",
        caption: "임계 경로 문항은 시작에서 종료까지 가장 긴 경로와 여유 시간 0인 작업 흐름을 함께 확인.",
        sourceLabel: "교재 3장 CPM 네트워크",
        width: 700,
        height: 500,
      },
    ],
  },
  {
    id: "quality-reliability",
    label: "품질과 신뢰도",
    category: "품질",
    lectureIds: [4],
    refs: ["2019-08", "2018-01", "2018-08", "2017-09", "2017-12"],
    sourceLabel: "4강·교재 4장",
    definition: "소프트웨어 품질 특성, 품질 표준, 고장과 신뢰도, 가용성, 유지보수성을 설명하는 개념.",
    examCue: "사용자 관점 품질, 신뢰도와 고장 빈도, 결함과 고장 연결 여부를 구분.",
    surrounding: ["신뢰성", "가용성", "유지보수성", "ISO/IEC 9126"],
    variants: ["reliability", "availability", "MTTR"],
  },
  {
    id: "testing",
    label: "소프트웨어 테스트",
    category: "테스트",
    lectureIds: [5],
    refs: ["2019-09", "2019-10", "2018-09", "2018-10", "2018-11", "2017-11", "2017-13", "2017-14", "2017-15"],
    sourceLabel: "5강·교재 5장",
    definition: "화이트박스와 블랙박스 테스트, 테스트 케이스, 테스트 수준, 인스펙션, 회귀 테스트를 포함.",
    examCue: "동치 분할·경계값·원인결과 그래프와 제어 구조 분석을 분리해서 묻는다.",
    surrounding: ["테스트 케이스", "블랙박스", "화이트박스", "회귀 테스트", "인스펙션"],
    variants: ["V&V", "basis path", "regression test"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/testing-control-flow-graph.png",
        alt: "분기와 반복이 포함된 프로그램 조각과 이를 노드와 간선으로 바꾼 제어 흐름 그래프",
        caption: "화이트박스 테스트는 프로그램 내부 제어 구조를 그래프로 읽고 경로·분기 기준으로 테스트 케이스를 만든다.",
        sourceLabel: "교재 5장 제어 흐름 그래프",
        width: 690,
        height: 505,
      },
    ],
  },
  {
    id: "requirements",
    label: "사용자 요구 분석",
    category: "요구",
    lectureIds: [6],
    refs: ["2019-11", "2019-17", "2018-12", "2017-16", "2017-17"],
    sourceLabel: "6강·교재 6장",
    definition: "요구사항 수집, 분류, 충돌 해결, 우선순위, 명세 품질, 기능적·비기능적 요구사항을 다루는 개념.",
    examCue: "고객 의사소통의 어려움, SRS 품질 특성, 기능 요구와 제약 조건의 구분을 묻는다.",
    surrounding: ["SRS", "기능적 요구사항", "비기능적 요구사항", "명확성", "완전성"],
    variants: ["requirement elicitation", "사용자 스토리", "JAD"],
  },
  {
    id: "design-architecture",
    label: "설계와 아키텍처",
    category: "설계",
    lectureIds: [7],
    refs: ["2019-12", "2019-13", "2019-14", "2019-19", "2018-14", "2018-15", "2017-19", "2017-20"],
    sourceLabel: "7강·교재 7장",
    definition: "요구사항을 구조화된 구현 청사진으로 바꾸고 모듈화, 추상화, 아키텍처 스타일, 품질 속성을 연결한다.",
    examCue: "정보 은닉을 정보 공개로 바꾸거나 성능·보안·가용성 품질 전략을 뒤집어 출제.",
    surrounding: ["모듈화", "추상화", "계층형 아키텍처", "파이프 필터", "아키텍처 스타일"],
    variants: ["architecture", "information hiding", "SOLID"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/architecture-pipe-filter.png",
        alt: "입력 데이터가 파이프를 따라 필터 1과 필터 2를 거쳐 출력으로 전달되는 파이프와 필터 구조",
        caption: "파이프와 필터 구조는 데이터 스트림에 순차 변환을 적용하는 아키텍처 스타일로 구분.",
        sourceLabel: "교재 7장 파이프와 필터 구조",
        width: 685,
        height: 255,
      },
    ],
  },
  {
    id: "maintenance-configuration",
    label: "유지보수와 형상 관리",
    category: "유지보수",
    lectureIds: [8],
    refs: ["2019-15", "2018-16", "2018-17", "2017-21", "2017-22", "2017-23"],
    sourceLabel: "8강·교재 8장",
    definition: "수정·적응·완전·예방 유지보수, 재공학, 역공학, 리팩터링, 형상 관리 활동을 포함.",
    examCue: "역공학과 재공학, 코드 스멜과 리팩터링, 변경 제어·형상 감사 활동을 구분.",
    surrounding: ["역공학", "재공학", "리팩터링", "형상 항목", "베이스라인"],
    variants: ["reverse engineering", "refactoring", "configuration management"],
  },
  {
    id: "uml-oo",
    label: "UML과 객체지향 개발",
    category: "UML",
    lectureIds: [9],
    refs: ["2019-18", "2019-22", "2018-13", "2018-18", "2018-19", "2018-20", "2018-28", "2017-24", "2017-27", "2017-29"],
    sourceLabel: "9강·교재 9장",
    definition: "객체지향 분석·설계, 통합 프로세스, UML 모델과 스테레오 타입, 캡슐화를 포함.",
    examCue: "UP 단계, UML 스테레오 타입 표기, 분석 모델 분류, 캡슐화 정의를 묻는다.",
    surrounding: ["UP", "도입", "정련", "스테레오 타입", "캡슐화"],
    variants: ["Unified Process", "《stereotype》", "OOAD"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/uml-actor-system-boundary.png",
        alt: "Customer, Librarian, Database 액터가 Resource Loan System 경계 안의 BrowseResource, CheckInResource, CheckOutResource와 연결된 그림",
        caption: "UML 분석에서는 액터가 시스템 경계 밖에 있고, 유스케이스는 경계 안의 사용자 목표로 표현되는지 확인.",
        sourceLabel: "교재 9장 액터와 시스템 경계",
        width: 690,
        height: 400,
      },
    ],
  },
  {
    id: "usecase",
    label: "유스케이스와 명세",
    category: "UML",
    lectureIds: [10],
    refs: ["2019-20", "2019-21", "2018-21", "2018-22", "2018-23", "2017-18", "2017-25", "2017-28"],
    sourceLabel: "10강·교재 10장",
    definition: "액터, 시스템 경계, 유스케이스, include, extend, 유스케이스 명세의 기본 흐름과 대안 흐름.",
    examCue: "include와 extend, 액터의 의미, 시스템 경계와 유스케이스 요소를 그림으로 출제.",
    surrounding: ["액터", "시스템 경계", "include", "extend", "기본 흐름"],
    variants: ["use case", "actor", "extension"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/usecase-include-system-boundary.png",
        alt: "HIS System 경계 안에서 Insert EMR과 Load Old Chart가 Check Registration을 include로 포함하는 유스케이스 다이어그램",
        caption: "include는 공통 기능을 항상 포함하는 관계이며, 액터는 시스템 경계 밖에 놓이는지 함께 판독.",
        sourceLabel: "교재 10장 include와 시스템 경계",
        width: 690,
        height: 380,
      },
    ],
  },
  {
    id: "activity",
    label: "액티비티 다이어그램",
    category: "UML",
    lectureIds: [11],
    refs: ["2019-23", "2019-24", "2018-24", "2018-25", "2017-31", "2017-32"],
    sourceLabel: "11강·교재 11장",
    definition: "액션의 흐름, 병렬 처리, 동기화, 시그널, 인터럽트, 파티션으로 업무·계산 흐름을 표현.",
    examCue: "시퀀스 다이어그램의 메시지 설명을 액티비티 설명처럼 섞는 오답을 경계.",
    surrounding: ["포크", "조인", "파티션", "액션", "시그널"],
    variants: ["activity", "swimlane", "fork/join"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/activity-fork-join.png",
        alt: "시작 노드 뒤 포크 막대에서 TV보기와 밥먹기 액션으로 나뉘고 조인 막대에서 합쳐져 종료 노드로 가는 액티비티 흐름",
        caption: "포크는 병렬 흐름 분기, 조인은 병렬 흐름 동기화를 나타내므로 마름모 결정 노드와 구분.",
        sourceLabel: "교재 11장 포크와 조인",
        width: 690,
        height: 220,
      },
    ],
  },
  {
    id: "sequence",
    label: "상호작용 다이어그램",
    category: "UML",
    lectureIds: [12],
    refs: ["2019-25", "2019-26", "2019-27", "2018-26", "2018-27", "2017-30"],
    sourceLabel: "12강·교재 12장",
    definition: "객체 또는 참여 요소 사이 메시지를 시간 순서 또는 링크 구조로 표현하는 시퀀스·통신 다이어그램.",
    examCue: "액터·경계·제어·엔터티 객체 순서, 라이프라인, 활성화 막대, 메시지 종류를 묻는다.",
    surrounding: ["라이프라인", "활성화", "메시지", "경계 객체", "제어 객체"],
    variants: ["sequence", "communication", "lifeline"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/sequence-lifeline-message.png",
        alt: "교수, 수업신청UI, 수업관리모듈, CS강좌 객체의 라이프라인 사이에 메시지와 반환 메시지가 오가는 시퀀스 다이어그램",
        caption: "시퀀스 다이어그램은 위에서 아래로 시간 순서를 읽고, 메시지 방향과 활성화 막대를 함께 판독.",
        sourceLabel: "교재 12장 시퀀스 다이어그램",
        width: 680,
        height: 340,
      },
    ],
  },
  {
    id: "class-object",
    label: "클래스와 객체 다이어그램",
    category: "UML",
    lectureIds: [13],
    refs: ["2019-28", "2019-29", "2019-30", "2018-29", "2018-30", "2018-31", "2017-26", "2017-33"],
    sourceLabel: "13강·교재 13장",
    definition: "클래스, 인터페이스, 속성, 연산, 연관, 일반화, 집합, 합성, 객체와 링크를 표현.",
    examCue: "일반화 화살표 방향, 인터페이스 구현, 집합 관계, 템플릿 클래스를 그림으로 판별.",
    surrounding: ["클래스", "인터페이스", "일반화", "집합", "템플릿"],
    variants: ["class diagram", "object diagram", "realization"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/class-aggregation-composition.png",
        alt: "Room과 Wall 사이의 흰 마름모 집합 관계와 검은 마름모 합성 관계를 나란히 비교한 클래스 다이어그램",
        caption: "집합은 약한 전체-부분 관계, 합성은 부분 생명주기가 전체에 종속되는 강한 전체-부분 관계로 판별.",
        sourceLabel: "교재 13장 집합과 합성",
        width: 690,
        height: 450,
      },
    ],
  },
  {
    id: "state-machine",
    label: "상태 머신 다이어그램",
    category: "UML",
    lectureIds: [14],
    refs: ["2019-31", "2019-32", "2018-32", "2018-33", "2017-34"],
    sourceLabel: "14강·교재 14장",
    definition: "단일 객체의 상태, 전이, 이벤트, 가드 조건, 활동, 병행 상태를 통해 객체의 동적 행위를 모델링.",
    examCue: "상호작용 제어 순서나 업무 흐름 설명을 상태 머신으로 착각하지 않도록 묻는다.",
    surrounding: ["상태", "전이", "이벤트", "가드", "복합 상태"],
    variants: ["state machine", "transition", "guard"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/state-machine-door.png",
        alt: "문 객체가 생성 후 열림 상태가 되고 닫기, 열기, 잠그기, 풀기 이벤트에 따라 닫힘과 잠김 상태로 전이되는 상태 머신",
        caption: "상태 머신은 단일 객체의 상태와 이벤트에 따른 전이를 모델링하므로 업무 절차 흐름과 구분.",
        sourceLabel: "교재 14장 상태 머신 예",
        width: 690,
        height: 245,
      },
    ],
  },
  {
    id: "component-deployment-package",
    label: "컴포넌트·배포·패키지 다이어그램",
    category: "UML",
    lectureIds: [15],
    refs: ["2019-33", "2019-34", "2019-35", "2018-34", "2018-35", "2017-35"],
    sourceLabel: "15강·교재 15장",
    definition: "컴포넌트의 제공·필요 인터페이스, 배포 노드와 아티팩트, 패키지 그룹화와 의존 관계를 표현.",
    examCue: "제공 인터페이스의 방향, 노드·아티팩트·패키지 기호를 그림 보기로 묻는다.",
    surrounding: ["컴포넌트", "제공 인터페이스", "필요 인터페이스", "노드", "아티팩트"],
    variants: ["component", "deployment", "package"],
    visuals: [
      {
        src: "/software/frequent-concepts/figures/component-provided-required-interface.png",
        alt: "DBHelper 컴포넌트가 Query와 StoredProc 제공 인터페이스, DataSource 필요 인터페이스를 가진 그림",
        caption: "제공 인터페이스는 컴포넌트가 외부에 제공하는 기능, 필요 인터페이스는 동작에 필요한 외부 기능.",
        sourceLabel: "교재 15장 제공·필요 인터페이스",
        width: 690,
        height: 265,
      },
    ],
  },
];

function yearFromRef(ref: string) {
  return Number(ref.slice(0, 4));
}

export const softwareFrequentConcepts: SoftwareFrequentConcept[] = concepts.map((concept) => ({
  ...concept,
  frequency: concept.refs.length,
  years: Array.from(new Set(concept.refs.map(yearFromRef))).sort((a, b) => a - b),
}));
