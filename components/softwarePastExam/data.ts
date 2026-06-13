import type {
  SoftwareChoiceKey,
  SoftwarePastExamImage,
  SoftwarePastExamQuestion,
  SoftwarePastExamYear,
} from "./types";

const labels: Record<SoftwareChoiceKey, string> = {
  "1": "①",
  "2": "②",
  "3": "③",
  "4": "④",
};

type Spec = {
  year: SoftwarePastExamYear;
  number: number;
  lectureId: number;
  tag: string;
  prompt: string;
  choices: [string, string, string, string];
  correct: SoftwareChoiceKey;
};

const lectureConcept: Record<number, string> = {
  1: "소프트웨어 공학 개요",
  2: "소프트웨어 프로세스",
  3: "프로젝트 관리",
  4: "소프트웨어 품질",
  5: "소프트웨어 테스트",
  6: "사용자 요구 분석",
  7: "소프트웨어 설계",
  8: "코딩과 유지보수",
  9: "UML과 객체지향",
  10: "유스케이스 다이어그램",
  11: "액티비티 다이어그램",
  12: "상호작용 다이어그램",
  13: "클래스·객체 다이어그램",
  14: "상태 머신 다이어그램",
  15: "컴포넌트·배포·패키지 다이어그램",
};

function visual(
  fileName: string,
  alt: string,
  aiDescriptionHidden: string,
  sourcePageInternal: 1 | 2 | 3,
  cropBoxInternal: SoftwarePastExamImage["cropBoxInternal"],
): SoftwarePastExamImage {
  return {
    src: `/software/past-exam/figures/${fileName}`,
    alt,
    aiDescriptionHidden,
    sourcePageInternal,
    cropBoxInternal,
  };
}

const visualByQuestion: Partial<Record<string, SoftwarePastExamImage[]>> = {
  "software-2019-21": [
    visual(
      "2019-1-q21-extend-usecase.png",
      "Perform ATM Transaction과 On-Line Help 사이의 확장 관계 유스케이스 그림",
      "Perform ATM Transaction 유스케이스와 On-Line Help 유스케이스가 점선 화살표로 연결되어 있고, 점선은 On-Line Help 쪽에서 Perform ATM Transaction 쪽을 향한다. 두 유스케이스 사이 위쪽에는 빈 스테레오타입 표기 괄호가 있다.",
      2,
      { x: 100, y: 1905, width: 575, height: 143 },
    ),
  ],
  "software-2019-23": [
    visual(
      "2019-1-q23-activity-fork-join.png",
      "TV보기와 밥먹기가 포크와 조인 사이에서 병렬 수행되는 액티비티 다이어그램",
      "초기 노드에서 포크 막대로 흐름이 나뉘어 TV보기와 밥먹기 액션으로 진행하고, 두 흐름이 조인 막대에서 합쳐진 뒤 종료 노드로 이어진다.",
      2,
      { x: 855, y: 372, width: 450, height: 163 },
    ),
  ],
  "software-2019-24": [
    visual(
      "2019-1-q24-activity-partition.png",
      "청구서 발생, 청구서, 결제 액션이 영역별로 나뉜 액티비티 다이어그램",
      "가로와 세로 구분선으로 나뉜 파티션 안에 청구서 발생, 청구서, 결제 액션이 배치되어 있고 흐름 화살표가 각 액션을 순서대로 연결한다.",
      2,
      { x: 860, y: 775, width: 450, height: 225 },
    ),
  ],
  "software-2019-25": [
    visual(
      "2019-1-q25-27-sequence-course.png",
      "교수, 수업신청UI, 수업관리모듈, CS강좌 객체가 참여하는 시퀀스 다이어그램",
      "교수 액터, 수업신청UI 경계 객체, 수업관리모듈 제어 객체, CS강좌 엔터티 객체가 생명선으로 배치되어 있고 강좌 정보 입력, 입력완료, 강좌추가, 생성완료, 강좌 생성 메시지가 시간 순서로 표시된다.",
      2,
      { x: 860, y: 1215, width: 545, height: 315 },
    ),
  ],
  "software-2019-26": [
    visual(
      "2019-1-q25-27-sequence-course.png",
      "교수, 수업신청UI, 수업관리모듈, CS강좌 객체가 참여하는 시퀀스 다이어그램",
      "교수 액터, 수업신청UI 경계 객체, 수업관리모듈 제어 객체, CS강좌 엔터티 객체가 생명선으로 배치되어 있고 강좌 정보 입력, 입력완료, 강좌추가, 생성완료, 강좌 생성 메시지가 시간 순서로 표시된다.",
      2,
      { x: 860, y: 1215, width: 545, height: 315 },
    ),
  ],
  "software-2019-27": [
    visual(
      "2019-1-q25-27-sequence-course.png",
      "교수, 수업신청UI, 수업관리모듈, CS강좌 객체가 참여하는 시퀀스 다이어그램",
      "교수 액터, 수업신청UI 경계 객체, 수업관리모듈 제어 객체, CS강좌 엔터티 객체가 생명선으로 배치되어 있고 강좌 정보 입력, 입력완료, 강좌추가, 생성완료, 강좌 생성 메시지가 시간 순서로 표시된다.",
      2,
      { x: 860, y: 1215, width: 545, height: 315 },
    ),
  ],
  "software-2019-29": [
    visual(
      "2019-1-q29-interface-realization.png",
      "NewsPaper 인터페이스와 KoreanNewsPaper 클래스 사이의 실현 관계",
      "위쪽에는 <<interface>> NewsPaper가, 아래쪽에는 KoreanNewsPaper 클래스가 있으며 아래 클래스에서 위 인터페이스를 향해 점선과 빈 삼각형 화살표가 연결된다.",
      3,
      { x: 100, y: 360, width: 225, height: 265 },
    ),
  ],
  "software-2019-30": [
    visual(
      "2019-1-q30-object-diagram-link.png",
      "myObject:MyClass와 yourObject:YourClass가 링크로 연결된 객체 다이어그램",
      "왼쪽의 myObject:MyClass 객체와 오른쪽의 yourObject:YourClass 객체가 실선 링크로 연결되어 있다.",
      3,
      { x: 100, y: 820, width: 570, height: 105 },
    ),
  ],
  "software-2019-32": [
    visual(
      "2019-1-q32-state-machine-door.png",
      "닫힘 상태에서 열린 상태로 전이하는 문 상태 머신 다이어그램",
      "초기 노드에서 닫힘 상태로 들어가고 노크하기[노크 횟수<3] 조건에서는 닫힘 상태로 되돌아간다. 노크하기[노크 횟수=3]/불켜기 전이가 열린 상태로 이어지고 열린 상태에서 종료 노드로 진행한다.",
      3,
      { x: 95, y: 1455, width: 460, height: 310 },
    ),
  ],
  "software-2019-33": [
    visual(
      "2019-1-q33-component-datasource-provider.png",
      "DBHelper와 MySQLDB가 DataSource 인터페이스로 연결된 컴포넌트 다이어그램",
      "DBHelper 컴포넌트 위에는 Query와 StoredProc 제공 인터페이스가 있고, DBHelper와 MySQLDB 사이에는 DataSource 인터페이스가 연결되어 있다.",
      3,
      { x: 90, y: 1935, width: 535, height: 190 },
    ),
  ],
  "software-2019-34": [
    visual(
      "2019-1-q34-deployment-node.png",
      "Node라고 적힌 UML 배포 다이어그램 노드 기호",
      "Node라고 적힌 입체 직육면체 모양의 UML 노드 기호가 제시되어 있다.",
      3,
      { x: 870, y: 230, width: 175, height: 160 },
    ),
  ],
  "software-2019-35": [
    visual(
      "2019-1-q35-uml-symbol-options.png",
      "패키지, 노드, 아티팩트, 제공 인터페이스 UML 기호 보기",
      "보기 1은 탭이 달린 폴더 모양, 보기 2는 입체 노드 모양, 보기 3은 접힌 모서리가 있는 문서 모양, 보기 4는 작은 선과 원으로 된 제공 인터페이스 기호이다.",
      3,
      { x: 850, y: 645, width: 545, height: 240 },
    ),
  ],
  "software-2018-22": [
    visual(
      "2018-1-q22-usecase-actor-include.png",
      "Doctor와 Insurance Company 액터가 HIS System 유스케이스와 상호작용하는 유스케이스 다이어그램",
      "HIS System 경계 안에 Insert EMR, Load Old Chart, Check Registration 유스케이스가 있고 Insert EMR과 Load Old Chart에서 Check Registration으로 <<include>> 관계가 향한다. Doctor와 Insurance Company 액터가 시스템과 연결되어 있다.",
      2,
      { x: 140, y: 1788, width: 590, height: 267 },
    ),
  ],
  "software-2018-25": [
    visual(
      "2018-1-q25-activity-interrupt-region.png",
      "주문 처리와 주문 취소 흐름이 있는 액티비티 다이어그램",
      "주문 받기 이후 주문 처리와 취소 흐름이 점선 영역 안에서 분기되고, 배송과 주문 취소 액션이 종료 노드로 이어진다.",
      2,
      { x: 925, y: 745, width: 535, height: 195 },
    ),
  ],
  "software-2018-26": [
    visual(
      "2018-1-q26-27-sequence-course.png",
      "교수, 수업신청UI, 수업관리모듈, CS강좌 객체가 참여하는 시퀀스 다이어그램",
      "교수 액터, 수업신청UI, 수업관리모듈, CS강좌:강좌 참여 요소가 생명선으로 배치되고 강좌 정보 입력, 입력완료, 강좌추가, 생성완료, 강좌 생성 메시지가 표시된다.",
      2,
      { x: 925, y: 1170, width: 533, height: 285 },
    ),
  ],
  "software-2018-27": [
    visual(
      "2018-1-q26-27-sequence-course.png",
      "교수, 수업신청UI, 수업관리모듈, CS강좌 객체가 참여하는 시퀀스 다이어그램",
      "교수 액터, 수업신청UI, 수업관리모듈, CS강좌:강좌 참여 요소가 생명선으로 배치되고 강좌 정보 입력, 입력완료, 강좌추가, 생성완료, 강좌 생성 메시지가 표시된다.",
      2,
      { x: 925, y: 1170, width: 533, height: 285 },
    ),
  ],
  "software-2018-29": [
    visual(
      "2018-1-q29-class-association-constraint.png",
      "ShoppingHistory와 Shopping 클래스 사이의 연관 및 제약 조건 클래스 다이어그램",
      "ShoppingHistory 클래스와 Shopping 클래스가 -shoppings {unique} 연관으로 연결되고 다중성 1과 별표가 표시된다. Shopping 클래스에는 orders와 comments private 속성이 들어 있다.",
      3,
      { x: 110, y: 150, width: 655, height: 170 },
    ),
  ],
  "software-2018-30": [
    visual(
      "2018-1-q30-class-generalization.png",
      "A 클래스에서 B 클래스로 빈 삼각형 화살표가 향하는 일반화 관계 클래스 다이어그램",
      "A 클래스와 B 클래스가 실선으로 연결되어 있고 빈 삼각형 화살표가 B 클래스 쪽을 향한다.",
      3,
      { x: 160, y: 530, width: 565, height: 190 },
    ),
  ],
  "software-2018-34": [
    visual(
      "2018-1-q34-component-provided-interface.png",
      "DBHelper 컴포넌트의 Query, StoredProc, DataSource 인터페이스 그림",
      "DBHelper 컴포넌트 위쪽에 Query와 StoredProc 제공 인터페이스가 있고, 오른쪽에는 DataSource 인터페이스가 반원 형태로 연결되어 있다.",
      3,
      { x: 235, y: 1815, width: 400, height: 230 },
    ),
  ],
  "software-2018-35": [
    visual(
      "2018-1-q35-deployment-artifact-node.png",
      "MyServer 노드 안에 MyServer::myLibrary.jar 아티팩트가 배치된 배포 다이어그램",
      "입체 노드 <<device>> MyServer 안에 <<artifact>> MyServer::myLibrary.jar가 포함되어 하드웨어 노드에 아티팩트가 배포된 형태를 보인다.",
      3,
      { x: 1040, y: 165, width: 345, height: 215 },
    ),
  ],
  "software-2017-26": [
    visual(
      "2017-1-q26-aggregation-loan.png",
      "Loan이 Customer와 Resource를 흰 마름모로 포함하는 집합 관계 클래스 다이어그램",
      "Loan 클래스 아래에 흰 마름모가 있고 Customer와 Resource 클래스가 Loan에 포함되는 형태로 연결되어 있다.",
      3,
      { x: 255, y: 180, width: 355, height: 205 },
    ),
  ],
  "software-2017-28": [
    visual(
      "2017-1-q28-usecase-include.png",
      "Insert EMR과 Load Old Chart가 Check Registration을 포함하는 유스케이스 다이어그램",
      "Doctor 액터가 Insert EMR과 Load Old Chart 유스케이스에 연결되고 두 유스케이스에서 Check Registration 유스케이스로 <<include>> 점선 화살표가 향한다.",
      3,
      { x: 100, y: 925, width: 660, height: 295 },
    ),
  ],
  "software-2017-30": [
    visual(
      "2017-1-q30-sequence-course.png",
      "교수, 수업신청UI, 수업관리모듈, CS강좌 객체가 참여하는 시퀀스 다이어그램",
      "교수 액터와 수업신청UI, 수업관리모듈, CS강좌:강좌 참여 요소가 생명선으로 배치되고 강좌정보입력, 입력완료, 강좌추가, 생성완료, 강좌생성 메시지가 순서대로 표시된다.",
      3,
      { x: 85, y: 1740, width: 705, height: 305 },
    ),
  ],
  "software-2017-31": [
    visual(
      "2017-1-q31-32-activity-order.png",
      "Receive Order Request부터 Submit Order까지 이어지는 주문 처리 액티비티 다이어그램",
      "초기 노드에서 Receive Order Request, Order pending, Approve Payment, Order approved, Submit Order를 거쳐 종료 노드로 이동하는 액션 흐름이 표시된다.",
      3,
      { x: 835, y: 145, width: 710, height: 105 },
    ),
  ],
  "software-2017-32": [
    visual(
      "2017-1-q31-32-activity-order.png",
      "Receive Order Request부터 Submit Order까지 이어지는 주문 처리 액티비티 다이어그램",
      "초기 노드에서 Receive Order Request, Order pending, Approve Payment, Order approved, Submit Order를 거쳐 종료 노드로 이동하는 액션 흐름이 표시된다.",
      3,
      { x: 835, y: 145, width: 710, height: 105 },
    ),
  ],
  "software-2017-35": [
    visual(
      "2017-1-q35-component-datasource.png",
      "DBHelper와 MySQLDB가 DataSource 인터페이스로 연결된 컴포넌트 다이어그램",
      "DBHelper 컴포넌트 위에는 Query와 StoredProc 제공 인터페이스가 있고 DBHelper는 DataSource 인터페이스를 통해 MySQLDB 컴포넌트와 연결되어 있다.",
      3,
      { x: 935, y: 1375, width: 520, height: 210 },
    ),
  ],
};

function basisFor(spec: Spec) {
  const concept = lectureConcept[spec.lectureId];
  return `강의와 교재의 ${concept} 개념에서는 정의, 적용 대상, 표기 조건을 함께 보아야 한다. 이 문항은 ${spec.tag}의 조건을 묻는다.`;
}

function makeQuestion(spec: Spec): SoftwarePastExamQuestion {
  const concept = lectureConcept[spec.lectureId];
  const correctText = spec.choices[Number(spec.correct) - 1];
  const id = `software-${spec.year}-${spec.number}`;

  return {
    id,
    year: spec.year,
    semester: "1",
    examName: `${spec.year}학년도 1학기 기말`,
    number: spec.number,
    prompt: spec.prompt,
    images: visualByQuestion[id],
    choices: spec.choices.map((text, idx) => {
      const key = String(idx + 1) as SoftwareChoiceKey;
      const verdict = key === spec.correct ? "correct" : "wrong";
      return {
        key,
        label: labels[key],
        text,
        explanation: {
          verdict,
          reason:
            verdict === "correct"
              ? `${correctText}은/는 ${spec.tag}의 정의와 적용 조건을 가장 정확하게 만족한다.`
              : `오답: ${text}은/는 ${concept} 단원에서 묻는 ${spec.tag}의 판단 기준과 맞지 않는다.`,
          conceptBasis: basisFor(spec),
        },
      };
    }),
    correctChoice: spec.correct,
    lectureRefs: [
      {
        lectureId: spec.lectureId,
        label: `${spec.lectureId}강 ${concept}`,
        href: `/software/lecture/${spec.lectureId}`,
        concept,
      },
    ],
    conceptTags: [spec.tag, concept],
    basis: basisFor(spec),
    examSkill: `${spec.tag}의 정의, 절차, 그림 표기, 오답 선택지의 범위 차이를 판별한다.`,
    answerSourceInternal: `${spec.year} 1학기 정답표 소프트웨어공학 행`,
    questionSourceInternal: `${spec.year} 1학기 소프트웨어공학 기출 PDF ${spec.number}번`,
  };
}

const specs: Spec[] = [
  {
    year: 2019,
    number: 1,
    lectureId: 1,
    tag: "소프트웨어 공학 목표",
    prompt: "소프트웨어 공학의 목표에 해당하지 않는 것은?",
    choices: ["품질 좋은 소프트웨어의 생산", "생산적이고 경제적인 과정을 통해 소프트웨어를 생산", "가용 자원을 최대한 활용하여 소프트웨어를 생산", "계획된 일정과 비용에 맞춰 소프트웨어를 생산"],
    correct: "3",
  },
  {
    year: 2019,
    number: 2,
    lectureId: 2,
    tag: "폭포수 모델",
    prompt: "다음 중 폭포수 모델의 장점은 무엇인가?",
    choices: ["요구사항의 변경을 수용하기 적합한 형태이다.", "산출물을 통해 프로젝트의 진척사항을 관리하기 용이하다.", "개발 초기에 모든 요구사항을 완전하고 명확하게 추출한다.", "작고 짧은 주기의 반복 작업을 통해 테스트를 중요시한다."],
    correct: "2",
  },
  {
    year: 2019,
    number: 3,
    lectureId: 2,
    tag: "애자일 방법",
    prompt: "다음 중 애자일 방법과의 관련성이 가장 적은 것은?",
    choices: ["스크럼(Scrum)", "짝 프로그래밍", "익스트림 프로그래밍(XP)", "의존성 역전 원칙(DIP)"],
    correct: "4",
  },
  {
    year: 2019,
    number: 4,
    lectureId: 3,
    tag: "프로젝트 제안",
    prompt: "소프트웨어 개발 회사에서 프로젝트 수주를 위해 제안서를 작성할 때, 제안서에 포함시킬 필요가 없는 것은?",
    choices: ["WBS", "간트(Gantt) 차트", "구조도(SC)", "개발 방법론"],
    correct: "3",
  },
  {
    year: 2019,
    number: 5,
    lectureId: 3,
    tag: "기능 점수",
    prompt: "소프트웨어 규모의 산정에서 기능 점수 방법에 관한 설명으로 잘못된 것은?",
    choices: ["소프트웨어가 가진 기능적 사용자 요구사항의 양을 추정한다.", "개발 전이나 초기에 개발 비용을 추정할 때 기초가 된다.", "구현 기술이나 개발 방법론과 무관하게 추정할 수 있다.", "개발 예산이 오천만원 미만일 때 유효하다고 알려져 있다."],
    correct: "4",
  },
  {
    year: 2019,
    number: 6,
    lectureId: 3,
    tag: "기능 점수 계산",
    prompt: "전통적 기능 점수 방법에서 미조정 기능점수(UFP), 조정 계수(VAF), 조정 기능 점수(AFP)와의 관계는 무엇인가? 단, VAF는 0.65~1.35 사이이다.",
    choices: ["AFP = UFP + VAF", "AFP = UFP * VAF", "AFP = UFP * (1+VAF)", "UFP = AFP * VAF"],
    correct: "2",
  },
  {
    year: 2019,
    number: 7,
    lectureId: 3,
    tag: "CMMI 성숙도",
    prompt: "CMMI 단계적 모델에서 프로세스 하에서 프로젝트가 통제되고 일정이나 비용과 같은 관리 프로세스가 중심이며 의미 있는 인증 수준으로는 최저 단계인 것은?",
    choices: ["초기(Initial)", "관리됨(Managed)", "정의됨(Defined)", "최적화됨(Optimizing)"],
    correct: "2",
  },
  {
    year: 2019,
    number: 8,
    lectureId: 4,
    tag: "신뢰도",
    prompt: "소프트웨어 신뢰도에 관한 일반적 설명이다. 잘못된 것은?",
    choices: ["내재된 결함은 반드시 고장으로 연결된다.", "고장의 결과가 심각하지 않으면 신뢰성이 높을 수 있다.", "사용 환경에 따라 고장의 빈도가 달라진다.", "가용성을 높이려면 고장의 평균 복구시간이 빨라야 한다."],
    correct: "1",
  },
  {
    year: 2019,
    number: 9,
    lectureId: 5,
    tag: "테스트 방법",
    prompt: "다음 중 나머지 셋과 성격이 다른 테스트 방법은 무엇인가?",
    choices: ["입력 집합을 동치 분할로 나누고 대표값으로 테스트를 수행함", "제어 구조를 분석하여 특정 경로를 실행하게 만드는 테스트 케이스를 선정함", "명세서를 분석하여 원인-결과 그래프를 작성한 후 테스트 케이스를 개발함", "가능한 입력 값들에서 랜덤하게 데이터를 선택함"],
    correct: "2",
  },
  {
    year: 2019,
    number: 10,
    lectureId: 5,
    tag: "테스트 케이스",
    prompt: "소프트웨어 테스트 분야에서 사용되는 테스트 케이스라는 용어의 정확한 의미는 무엇인가?",
    choices: ["기능의 검증 작업 시 사용되는 고수준 테스트 데이터", "테스트 작업의 사례를 상세히 기술한 보고서", "테스트 작업을 할 때 사용하는 입력 데이터의 집합", "테스트를 위한 입력과 예상 출력에 관한 명세 및 무엇을 검사할지에 관한 설명"],
    correct: "4",
  },
  {
    year: 2019,
    number: 11,
    lectureId: 6,
    tag: "요구사항 추출",
    prompt: "분석가가 고객과 의사소통하면서 요구사항 추출과 분석 작업을 수행한다. 이것에 관한 일반적 설명으로 잘못된 것은?",
    choices: ["고객이 자주 원하는 것을 정확하게 표현하지 못한다.", "응용 분야를 모르는 분석가가 오히려 고객과 의사소통을 원활하게 잘 할 수 있다.", "작업 중에도 요구사항이 바뀌거나 새롭게 추가된다.", "서로 다른 요구를 하는 고객이 존재하고 동일한 내용이 다르게 표현되기도 한다."],
    correct: "2",
  },
  {
    year: 2019,
    number: 12,
    lectureId: 7,
    tag: "설계 원리",
    prompt: "소프트웨어 설계 작업의 주요 원리를 설명한 것이다. 잘못된 것은?",
    choices: ["모듈화 - 전체를 독립적인 작은 단위들로 분할하는 것", "추상화 - 복잡한 것을 간단하고 요약하여 표현하는 것", "정보공개 - 정보에 쉽게 접근하도록 인터페이스를 제공하는 것", "단계적 정제 - 점차적으로 구체화하는 것"],
    correct: "3",
  },
  {
    year: 2019,
    number: 13,
    lectureId: 7,
    tag: "아키텍처 스타일",
    prompt: "아키텍처 스타일 가운데 추상화의 성질을 잘 이용한 구조로 시스템을 계층적으로 분할하며 하위 층이 제공하는 서비스를 상위층의 서브시스템이 사용하도록 구성하는 것은?",
    choices: ["계층형 아키텍처", "파이프 필터 구조", "MVC 아키텍처", "클라이언트-서버 아키텍처"],
    correct: "1",
  },
  {
    year: 2019,
    number: 14,
    lectureId: 7,
    tag: "아키텍처와 품질 속성",
    prompt: "소프트웨어 아키텍처는 비기능적 요구사항과 큰 관련이 있다. 다음 설명 중 잘못된 것은?",
    choices: ["보안이 중요하다면 계층형 아키텍처를 사용하고 중요 보안 요소를 시스템의 내부 계층에 위치시킨다.", "안전성이 요구되는 컴포넌트라면 적은 수의 서브시스템들에 두어 고립화시킴으로써 검증 비용을 줄일 수 있다.", "가용성이 중요하다면 주요 기능의 컴포넌트가 중복되도록 설계한다.", "성능이 중요하다면 주요 오퍼레이션을 많은 수의 서브시스템들에 분산 배치시켜 서브시스템 간에 활발한 통신을 하게 한다."],
    correct: "4",
  },
  {
    year: 2019,
    number: 15,
    lectureId: 8,
    tag: "역공학",
    prompt: "역공학 활동에 대한 설명이 아닌 것은?",
    choices: ["시스템 명세서에 기초하여 시스템을 신규 개발하기로 한다.", "기존 프로그램으로부터 요구 명세서나 설계 문서를 복구한다.", "전체 시스템을 분석하여 아키텍처를 파악한다.", "프로그램으로부터 데이터 흐름도와 자료 사전을 생성한다."],
    correct: "1",
  },
  {
    year: 2019,
    number: 16,
    lectureId: 1,
    tag: "소프트웨어 복잡도",
    prompt: "다음 중 소프트웨어 제품의 복잡도를 높이는 요구로 보기 어려운 것은?",
    choices: ["타 기관의 다른 시스템과 연동되어야 한다.", "응답성능에 대한 특별한 요구가 없다.", "이질적 플랫폼 사이에서도 운영되어야 한다.", "결함 발생 시 국가경제에 중대한 손실이 발생된다."],
    correct: "2",
  },
  {
    year: 2019,
    number: 17,
    lectureId: 6,
    tag: "요구사항 추출 활동",
    prompt: "개발 과정 중 요구사항 추출 단계의 활동으로 보기 어려운 것은?",
    choices: ["사용자와 인터뷰하여 시스템의 사용 시나리오를 작성한다.", "유스케이스를 상세히 작성하고 형식화한다.", "JAD 회의를 통해 요구사항 명세에 관한 의견 일치를 본다.", "요구사항의 재사용을 제공하는 기성 솔루션이나 디자인 패턴을 찾는다."],
    correct: "4",
  },
  {
    year: 2019,
    number: 18,
    lectureId: 9,
    tag: "통합 프로세스",
    prompt: "UML의 저자들이 제안한 점증적 반복적 개발 프로세스의 통합 프로세스(UP)에서 핵심 아키텍처를 구축하고 대부분의 요구사항을 명확히 하며 일정을 상세히 추정하는 단계는?",
    choices: ["도입(inception)", "전이(transition)", "정련(elaboration)", "구축(construction)"],
    correct: "3",
  },
  {
    year: 2019,
    number: 19,
    lectureId: 7,
    tag: "설계 목표",
    prompt: "암호화, 웹취약점 검사, 시큐어 코딩과 같은 요구는 다음 설계 목표 중 어떤 요인으로 분류될 수 있는가?",
    choices: ["결합 내성", "보안", "확장성", "사용성"],
    correct: "2",
  },
  {
    year: 2019,
    number: 20,
    lectureId: 10,
    tag: "유스케이스 다이어그램",
    prompt: "유스케이스 다이어그램에서 표현되는 것이 아닌 것은?",
    choices: ["기능적 요구사항으로서의 유스케이스", "시스템과 상호작용하는 액터", "시스템 내부와 외부를 구분하는 경계", "액터가 사용하는 하드웨어와 소프트웨어의 형상"],
    correct: "4",
  },
  {
    year: 2019,
    number: 21,
    lectureId: 10,
    tag: "extend 관계",
    prompt: "그림에서 선택적 또는 예외적 조건에서 기본 유스케이스를 확장하기 위한 관계에 해당하는 것은?",
    choices: ["include", "extend", "generalize", "use"],
    correct: "2",
  },
  {
    year: 2019,
    number: 22,
    lectureId: 9,
    tag: "UML 스테레오 타입",
    prompt: "UML 스테레오 타입에 관한 설명이 아닌 것은?",
    choices: ["UML 요소의 의미를 바꾸거나 명확하게 하기 위한 방법이다.", "《parallel》과 같이 키워드를 《》로 감싸 표현한다.", "스테레오 타입 대신 특별한 아이콘을 사용하여 표현할 때도 있다.", "몇 개의 특별한 UML 요소들에만 적용할 수 있다."],
    correct: "4",
  },
  {
    year: 2019,
    number: 23,
    lectureId: 11,
    tag: "액티비티 병렬화",
    prompt: "그림은 TV보기와 밥먹기 액션이 포크와 조인 사이에서 병렬로 수행되는 액티비티 다이어그램이다. 주요 내용은 무엇인가?",
    choices: ["복수개의 액션으로 구성된 복합 액션", "액션의 생성과 삭제", "액션의 반복", "액션의 병렬처리와 동기화"],
    correct: "4",
  },
  {
    year: 2019,
    number: 24,
    lectureId: 11,
    tag: "파티션",
    prompt: "액티비티 다이어그램에서 파티션 또는 스윔 레인의 목적은 무엇인가?",
    choices: ["액션의 수행 주체를 보임", "시그널을 이용한 인터럽트 상황을 표현함", "외부에서 정의된 액티비티의 호출을 표현함", "영역을 이용한 객체 집합의 처리를 명세함"],
    correct: "1",
  },
  {
    year: 2019,
    number: 25,
    lectureId: 12,
    tag: "시퀀스 다이어그램 요소",
    prompt: "시퀀스 다이어그램 그림에서 나타나 있지 않은 것은?",
    choices: ["참여 요소(액터)", "액티비티", "객체의 생명선", "메시지 전송"],
    correct: "2",
  },
  {
    year: 2019,
    number: 26,
    lectureId: 12,
    tag: "시퀀스 다이어그램",
    prompt: "시퀀스 다이어그램에 관한 설명으로 잘못된 것은?",
    choices: ["유스케이스의 실현을 위해 객체들이 어떻게 상호작용하는가를 보여준다.", "통신 다이어그램과 의미적으로 동일하다고 할 수 있다.", "순서도와 유사하며 업무 프로세스의 개괄적 모델링에 효과적이다.", "시간의 흐름과 순서에 따라 시스템이 동작하는 모습을 살펴보기에 유용하다."],
    correct: "3",
  },
  {
    year: 2019,
    number: 27,
    lectureId: 12,
    tag: "참여 요소 종류",
    prompt: "시퀀스 다이어그램의 참여 요소 종류로 액터, 경계 객체, 제어 객체, 엔터티 객체가 있다. 그림에서 경계 객체에 해당하는 것은?",
    choices: ["교수", "수업신청UI", "수업관리모듈", "CS강좌"],
    correct: "2",
  },
  {
    year: 2019,
    number: 28,
    lectureId: 13,
    tag: "클래스 다이어그램",
    prompt: "클래스 다이어그램에 관한 설명으로 적당하지 않은 것은?",
    choices: ["클래스 명세와 클래스 간의 관계를 표현함", "시스템의 정적인 구조를 표현함", "객체지향 프로그램을 개발할 때 많이 활용됨", "UML의 4+1 뷰에서 물리 뷰에 속하는 다이어그램"],
    correct: "4",
  },
  {
    year: 2019,
    number: 29,
    lectureId: 13,
    tag: "인터페이스 구현",
    prompt: "그림에서 KoreanNewsPaper가 NewsPaper 인터페이스를 실현하는 관계를 가장 정확하게 설명하는 것은?",
    choices: ["클래스의 단순 사용", "전체와 부분의 집합체 연관", "클래스의 상속", "인터페이스의 구현"],
    correct: "4",
  },
  {
    year: 2019,
    number: 30,
    lectureId: 13,
    tag: "객체 다이어그램",
    prompt: "객체 다이어그램 그림을 통해 알 수 있는 내용이 아닌 것은?",
    choices: ["템플릿에서 파라미터로 사용된 클래스가 동적으로 바인딩됨", "박스는 특정 클래스의 객체를 표현함", "두 클래스 간에 관계를 맺고 있음을 시사함", "링크를 통해 관계를 맺은 두 요소는 메시지를 주고받을 것임"],
    correct: "1",
  },
  {
    year: 2019,
    number: 31,
    lectureId: 14,
    tag: "상태 머신 다이어그램",
    prompt: "상태 머신 다이어그램에 관한 설명으로 적당하지 않은 것은?",
    choices: ["시스템의 동적인 면을 모델링하는 다이어그램이다.", "시스템 구성요소 간의 상호작용과 제어순서를 표현하기에 적당하다.", "단일 객체의 상태 변화를 표현할 때 사용한다.", "실시간 시스템이나 반응형 시스템에서 이벤트 중심의 처리 과정을 보여줄 때 사용할 수 있다."],
    correct: "2",
  },
  {
    year: 2019,
    number: 32,
    lectureId: 14,
    tag: "상태 전이 이벤트",
    prompt: "상태 전이 그림에서 닫힘에서 열림으로 전이를 일으킬 수 있는 이벤트는?",
    choices: ["노크하기", "열림", "노크 횟수=3", "불켜기"],
    correct: "1",
  },
  {
    year: 2019,
    number: 33,
    lectureId: 15,
    tag: "컴포넌트 제공 인터페이스",
    prompt: "컴포넌트 다이어그램에서 DataSource 인터페이스의 구현을 제공하는 컴포넌트는 무엇인가?",
    choices: ["Query와 StoredProc", "DBHelper", "MySQLDB", "알 수 없음"],
    correct: "3",
  },
  {
    year: 2019,
    number: 34,
    lectureId: 15,
    tag: "배포 다이어그램",
    prompt: "하드웨어 형상과 소프트웨어 요소의 배치를 표현하는 UML 다이어그램은 무엇인가?",
    choices: ["상태 머신 다이어그램", "컴포넌트 다이어그램", "배포 다이어그램", "패키지 다이어그램"],
    correct: "3",
  },
  {
    year: 2019,
    number: 35,
    lectureId: 15,
    tag: "패키지 기호",
    prompt: "소프트웨어 구성 요소나 UML 요소 등을 그룹화할 때 사용하는 것은?",
    choices: ["패키지 모양", "노드 모양", "아티팩트 모양", "제공 인터페이스 기호"],
    correct: "1",
  },
];

const compact2018: Spec[] = [
  { year: 2018, number: 1, lectureId: 4, tag: "고장과 신뢰도", prompt: "소프트웨어의 고장률 또는 신뢰도에 관한 설명으로 적절하지 않은 것은?", choices: ["결함의 발견과 수정 과정을 거치면서 점차 안정화된다.", "버그 수정이나 기능 추가로 인해 새로운 오류가 유입될 수 있다.", "오랜 시간이 지나면 부품이 마모되고 고장률이 높아진다.", "주변 환경이 변화하면 품질이 저하될 수 있다."], correct: "3" },
  { year: 2018, number: 2, lectureId: 2, tag: "점증적 모델", prompt: "소프트웨어 프로세스 모델 중 점증적 모델의 특징을 설명한 내용으로 적절하지 않은 것은?", choices: ["중요한 점증을 가장 먼저 개발한다.", "중요한 부분이 반복적으로 테스트되는 효과가 있다.", "개발이 최종적으로 종료된 후에야 시스템을 사용할 수 있다.", "시간차를 두고 점증이 추가되면서 여러 번 릴리스된다."], correct: "3" },
  { year: 2018, number: 3, lectureId: 2, tag: "애자일 방법", prompt: "애자일 방법과 가장 관련이 깊은 것은?", choices: ["높은 안정성과 신뢰성이 요구되는 소프트웨어의 개발", "요구사항의 변화에 대응하기 위한 반복적 개발 방법", "익스트림 프로그래밍(XP)", "문서화보다 소프트웨어 자체에 집중함"], correct: "1" },
  { year: 2018, number: 4, lectureId: 2, tag: "폭포수 모델", prompt: "다음 중 폭포수 모델의 장점으로 볼 수 있는 것은?", choices: ["단계별로 산출물을 체크하여 진행 상황을 명확하게 알 수 있다.", "요구사항이 불안정하고 명확하지 않을 때도 적용이 어렵지 않다.", "요구사항의 변화에 쉽게 대응할 수 있다.", "경험이 없는 대형 프로젝트 수행에도 위험 발생을 줄일 수 있다."], correct: "1" },
  { year: 2018, number: 5, lectureId: 3, tag: "기능 점수", prompt: "기능 점수에 의한 비용 산정 방법을 설명한 내용이다. 잘못된 설명은?", choices: ["기능 점수는 기능의 규모를 측정하기 위한 단위이다.", "먼저 소스 코드의 라인 수를 정확하게 추정한 후 기능 점수를 계산한다.", "구현 기술이나 구현 언어와는 무관하다.", "요구사항이나 설계 명세서를 사용하여 기능 점수를 추정할 수 있다."], correct: "2" },
  { year: 2018, number: 6, lectureId: 3, tag: "CPM", prompt: "프로젝트 계획에서 CPM에 관한 설명으로 잘못된 것은?", choices: ["작업의 선후 관계를 고려하여 그래프를 작성한다.", "상단에 시간 축을 표시하고 작업량을 의미하는 막대를 가로 방향으로 표시한다.", "임계 경로는 시작에서 종료까지의 경로 중 가장 긴 경로이다.", "임계 경로상의 작업은 일정 준수를 위해 지연이 허용되지 않는다."], correct: "2" },
  { year: 2018, number: 7, lectureId: 3, tag: "프로세스 성숙도", prompt: "개발 조직이 있다고 가정할 때 프로세스의 성숙도가 가장 높은 조직은 무엇인가?", choices: ["개발자 역량에 따라 프로세스를 수시로 바꾸어 사용한다.", "프로젝트의 예산이나 일정을 예측할 수 있다.", "조직 차원의 표준 프로세스를 정의하였다.", "정량적 측정과 통제가 가능한 표준 프로세스가 존재한다."], correct: "4" },
  { year: 2018, number: 8, lectureId: 4, tag: "품질 특성", prompt: "사용자 관점의 품질 특성이 아닌 것은?", choices: ["신뢰성", "사용 용이성", "성능", "유지보수성"], correct: "4" },
  { year: 2018, number: 9, lectureId: 5, tag: "테스트 작업", prompt: "소프트웨어 테스트작업에 관한 일반적 설명이다. 잘못된 것은?", choices: ["테스트 작업을 제대로 수행하려면 요구 명세서가 있어야 한다.", "요구사항의 내용은 테스트 작업을 통해 검증 가능해야 한다.", "오류 검출을 위해 가능한 많은 수의 테스트 케이스를 사용해야 한다.", "테스트 케이스를 설계할 때 예외적 입력 값을 고려해야 한다."], correct: "3" },
  { year: 2018, number: 10, lectureId: 5, tag: "시스템 테스트", prompt: "완전한 시스템이 구축되면 시스템 테스트를 수행한다. 다음 중 시스템 테스트의 종류로 보기 어려운 것은?", choices: ["보안 테스트", "성능 테스트", "인수 테스트", "회귀 테스트"], correct: "4" },
  { year: 2018, number: 11, lectureId: 5, tag: "블랙박스 테스트", prompt: "블랙박스 테스트를 위한 테스트 케이스 개발 방법이 아닌 것은?", choices: ["입력값의 범위와 경계값을 분석함", "원인-결과 그래프로 의사 결정 테이블을 유도함", "입력값 범위를 동치 클래스로 나누고 대표값을 선택함", "프로그램의 제어구조를 분석하여 기본 경로를 추출함"], correct: "4" },
  { year: 2018, number: 12, lectureId: 6, tag: "기능적 요구사항", prompt: "다음 요구사항 중 기능적 요구사항은?", choices: ["산출물은 CS2009 표준 형식을 따른다.", "자바와 CBO 방법론을 적용해야 한다.", "개인 정보의 P_ID는 13자리 숫자로 구성된다.", "결과 조회 시 1초 이내로 화면에 출력되어야 한다."], correct: "3" },
  { year: 2018, number: 13, lectureId: 9, tag: "분석 모델", prompt: "객체지향 분석 과정의 결과물 세 부류 중 분석 과정의 입력물이기도 한 모델에 해당하는 것은?", choices: ["상태 머신 다이어그램과 시퀀스 다이어그램", "유스케이스 명세 또는 사용자 스토리", "클래스 다이어그램과 객체 다이어그램", "배포 다이어그램"], correct: "2" },
  { year: 2018, number: 14, lectureId: 7, tag: "모듈화", prompt: "시스템의 모듈화에 관한 설명이다. 잘못된 것은?", choices: ["모듈 간에 느슨하게 결합되어 있는 것이 바람직하다.", "모듈은 상호 독립적이어야 이해와 재사용이 쉽다.", "하나의 모듈은 높은 응집력을 가지는 것이 좋다.", "모듈화의 단점은 시스템의 유지보수가 어렵다는 점이다."], correct: "4" },
  { year: 2018, number: 15, lectureId: 7, tag: "아키텍처 스타일", prompt: "같은 응용 분야의 시스템은 유사한 아키텍처를 가질 수 있고 시스템 설계 모델의 초안으로 사용할 수 있는 시스템 구성 패턴은?", choices: ["디자인 패턴", "저장소 모델", "클라이언트-서버 아키텍처", "아키텍처 스타일"], correct: "4" },
  { year: 2018, number: 16, lectureId: 8, tag: "유지보수 유형", prompt: "기능이나 성능 개선을 위해 필요한 변경 작업을 의미하는 것은?", choices: ["수정 유지보수", "적응 유지보수", "완전 유지보수", "예방 유지보수"], correct: "3" },
  { year: 2018, number: 17, lectureId: 8, tag: "리팩토링", prompt: "기능적 행위를 바꾸지 않고 구조를 개선하여 가독성·유지보수성을 높이는 용어는?", choices: ["코드 스멜", "리팩토링", "형상 관리", "역공학"], correct: "2" },
  { year: 2018, number: 18, lectureId: 9, tag: "객체지향 설계 단계", prompt: "객체지향 개발 방법에서 프로젝트의 설계 목표를 정의하고 시스템을 서브시스템들로 분해하는 단계는?", choices: ["요구사항 분석 단계", "시스템 설계 단계", "객체 설계 단계", "통합과 테스트 단계"], correct: "2" },
  { year: 2018, number: 19, lectureId: 9, tag: "통합 프로세스", prompt: "통합 프로세스에서 전체 시스템의 약 15%를 구현하고 유스케이스를 상세 작성하는 단계는?", choices: ["도입(inception)", "정련(elaboration)", "구축(construction)", "전이(transition)"], correct: "2" },
  { year: 2018, number: 20, lectureId: 9, tag: "요구 분석 다이어그램", prompt: "다음 UML 다이어그램 중 요구 분석 단계에서 사용된다고 볼 수 없는 것은?", choices: ["클래스 다이어그램", "유스케이스 다이어그램", "컴포넌트 다이어그램", "시퀀스 다이어그램"], correct: "3" },
  { year: 2018, number: 21, lectureId: 10, tag: "유스케이스 명세", prompt: "유스케이스 명세에 관한 설명 중 적당하지 않은 것은?", choices: ["유스케이스 및 이들 간의 관계를 요약적으로 표현한다.", "사용자 요구사항을 구조화하고 테스트 형식으로 기술할 수 있다.", "무엇보다 어떻게에 초점을 맞추어야 한다.", "기본 흐름은 목적을 달성하는 성공적 시나리오이다."], correct: "3" },
  { year: 2018, number: 22, lectureId: 10, tag: "액터", prompt: "유스케이스 다이어그램에서 사람 모양 요소가 의미하는 것은?", choices: ["액션을 수행하는 주체", "액터와 상호작용하는 경계객체", "소프트웨어 시스템을 발주한 개인 또는 회사", "시스템과 상호작용하는 사람이나 외부 시스템"], correct: "4" },
  { year: 2018, number: 23, lectureId: 10, tag: "include 관계", prompt: "include의 의미와 관련이 깊은 설명은?", choices: ["다양한 액션의 주체를 별도의 유스케이스로 분리", "전체적 의미는 같으나 구현 방법이 다른 경우 부모와 자식 유스케이스로 분리", "두 유스케이스에서 중복된 부분을 별도의 유스케이스로 분리", "특정 조건에서 선택적으로 사용되는 시나리오를 분리"], correct: "3" },
  { year: 2018, number: 24, lectureId: 11, tag: "액티비티 다이어그램", prompt: "UML 액티비티 다이어그램에 관한 설명으로 잘못된 것은?", choices: ["액션 흐름으로 계산 과정을 단계적으로 표현한다.", "비즈니스 프로세스의 작업 흐름을 표현한다.", "흐름도와 유사하나 액션의 병렬 수행이나 시간 관련 이벤트를 표현할 수 있다.", "객체들 간에 주고받는 메시지로 시스템의 사용 시나리오를 명세한다."], correct: "4" },
  { year: 2018, number: 25, lectureId: 11, tag: "액티비티 다이어그램 요소", prompt: "액티비티 다이어그램 그림에서 볼 수 있는 요소가 아닌 것은?", choices: ["시그널 수신", "액션 또는 액티비티", "인터럽트의 처리", "파티션 또는 스윔 레인"], correct: "4" },
  { year: 2018, number: 26, lectureId: 12, tag: "시퀀스 다이어그램", prompt: "그림과 같은 UML 다이어그램은 무엇이라 하는가?", choices: ["시퀀스 다이어그램", "통신 다이어그램", "액티비티 다이어그램", "객체 다이어그램"], correct: "1" },
  { year: 2018, number: 27, lectureId: 12, tag: "참여 요소 종류", prompt: "시퀀스 다이어그램의 4개 참여 요소 종류를 순서대로 나열한 것은?", choices: ["액터-경계 객체-엔터티 객체-제어 객체", "액터-경계 객체-제어 객체-엔터티 객체", "액터-엔터티 객체-제어 객체-경계 객체", "경계 객체-제어 객체-엔터티 객체-액터"], correct: "2" },
  { year: 2018, number: 28, lectureId: 9, tag: "캡슐화", prompt: "객체의 내부 속성과 메소드를 숨기고 필요한 부분만 노출하는 개념은?", choices: ["상속", "다형성", "분할 정복", "캡슐화"], correct: "4" },
  { year: 2018, number: 29, lectureId: 13, tag: "클래스 다이어그램 요소", prompt: "클래스 다이어그램 그림에서 나타나 있지 않은 것은?", choices: ["클래스 간의 연관 관계", "제약 조건", "클래스의 private 속성", "클래스가 제공하는 public 인터페이스"], correct: "4" },
  { year: 2018, number: 30, lectureId: 13, tag: "일반화 관계", prompt: "클래스 A에서 B로 빈 삼각형 화살표가 향하는 관계를 정확히 설명하는 것은?", choices: ["A has a B", "B has a A", "A is a kind of B", "B is a kind of A"], correct: "3" },
  { year: 2018, number: 31, lectureId: 13, tag: "템플릿 클래스", prompt: "타입 파라미터를 가지며 객체의 타입을 미리 정하지 않고 파라미터로 넘겨두는 클래스는?", choices: ["템플릿(또는 제네릭)", "스택", "추상 클래스", "복합 상태"], correct: "1" },
  { year: 2018, number: 32, lectureId: 14, tag: "객체 다이어그램", prompt: "단일 객체의 생성부터 소멸까지 발생하는 이벤트와 상태 변화를 다루는 UML 다이어그램은?", choices: ["상태 머신 다이어그램", "액티비티 다이어그램", "클래스 다이어그램", "객체 다이어그램"], correct: "1" },
  { year: 2018, number: 33, lectureId: 14, tag: "병행 상태", prompt: "병행 상태를 표현할 때 사용하는 것은?", choices: ["선택 노드", "트리거와 조건문", "포크와 조인", "진입점과 탈출점"], correct: "3" },
  { year: 2018, number: 34, lectureId: 15, tag: "제공 인터페이스", prompt: "컴포넌트가 기능을 구현하고 외부에서 사용할 수 있게 노출한 인터페이스를 의미하는 것은?", choices: ["DataSource", "DBHelper", "Query와 StoredProc", "그림 전체"], correct: "3" },
  { year: 2018, number: 35, lectureId: 15, tag: "배포 다이어그램", prompt: "배포 다이어그램 그림의 설명으로 적당하지 않은 것은?", choices: ["육면체는 하드웨어 노드를 표현한다.", "소프트웨어 조각이 어떤 하드웨어에 배포되는지 보여준다.", "동종의 UML 요소를 계층적으로 구조화시켜 표현한다.", "artifact로부터 소프트웨어 요소임을 알 수 있다."], correct: "3" },
];

const compact2017: Spec[] = [
  { year: 2017, number: 1, lectureId: 1, tag: "소프트웨어 성질", prompt: "다음은 소프트웨어의 성질에 관한 설명이다. 잘못된 것은?", choices: ["소프트웨어 개발 비용의 대부분은 노동력에 투입되는 편이다.", "소프트웨어는 하드웨어에 비해 상대적으로 변경이 어렵다.", "소프트웨어는 마모되지 않는다.", "소프트웨어의 쓸모가 유지되려면 주위 환경 변화에 대한 대처가 필요하다."], correct: "2" },
  { year: 2017, number: 2, lectureId: 1, tag: "소프트웨어 공학 환경", prompt: "프로세스 안에서 방법과 기술을 묶어 주어진 기간에 어떻게 행위를 수행하고 결과물을 표현할지 기술하는 것은?", choices: ["소프트웨어공학 원리", "소프트웨어공학 환경", "방법론", "CASE 도구"], correct: "3" },
  { year: 2017, number: 3, lectureId: 2, tag: "프로토타이핑", prompt: "프로토타이핑 방법의 목적 또는 혜택이라고 볼 수 없는 것은?", choices: ["프로젝트의 실현 가능성을 판단할 수 있다.", "사용자의 기능적 요구사항을 파악한다.", "성능이나 유용성 등의 품질 요구를 분명히 한다.", "문서화를 장려하고 용이하게 진척사항을 제어한다."], correct: "4" },
  { year: 2017, number: 4, lectureId: 2, tag: "점증적 모델", prompt: "점증적 모델의 특징에 관한 설명이다. 잘못된 것은?", choices: ["중요한 점증이 가장 나중에 개발되어야 한다.", "중요한 부분이 반복적으로 테스트되는 효과가 있다.", "기능적으로 분해하기 어렵거나 적당한 점증으로 나누기 어려운 문제가 발생한다.", "시간차를 두고 점증을 개발하여 릴리스하는 방식이 요구 변화에 대응하기 용이하다."], correct: "1" },
  { year: 2017, number: 5, lectureId: 2, tag: "애자일 방법", prompt: "애자일 방법과 관련이 없는 것은?", choices: ["협업을 강조하고 제품의 빠른 인도를 강조함", "점증적이고 반복적 개발 방법", "설계나 문서화 작업보다 소프트웨어 자체를 중요하게 생각함", "높은 안전성과 신뢰성이 필요한 소프트웨어 개발에 좋음"], correct: "4" },
  { year: 2017, number: 6, lectureId: 3, tag: "기능 점수", prompt: "기능 점수 방법에 관한 설명이다. 잘못된 것은?", choices: ["기능 점수는 소프트웨어의 규모를 측정하기 위한 단위이다.", "라인 수(LOC)를 먼저 계산한 후 기능 점수를 추정한다.", "사무 정보 시스템 규모 산정에 적합하다고 알려져 있다.", "기능 점수는 구현 기술이나 구현 언어와 무관하다."], correct: "2" },
  { year: 2017, number: 7, lectureId: 3, tag: "매트릭스 조직", prompt: "프로젝트 조직과 기능별 조직의 장점을 취한 팀 구성 방식은?", choices: ["책임 프로그래머 팀", "매트릭스 조직", "계층적 관료 조직", "분산형 비이기적인 팀"], correct: "2" },
  { year: 2017, number: 8, lectureId: 3, tag: "프로젝트 관리", prompt: "프로젝트 관리에 관한 일반적 설명이다. 잘못된 설명은?", choices: ["프로젝트 실패의 가장 흔한 이유는 일정을 맞추지 못한 것이다.", "일정이 늦어진 프로젝트에 인력을 추가하면 일정을 상당히 앞당길 수 있다.", "기술 발전 속도가 빨라 경험을 살리기 어렵다.", "예산과 일정 제약 때문에 프로젝트 관리가 필요하다."], correct: "2" },
  { year: 2017, number: 9, lectureId: 4, tag: "품질 표준", prompt: "나머지 셋과 다른 부류의 품질 표준은 무엇인가?", choices: ["ISO 9000 시리즈", "ISO/IEC 15504(SPICE)", "CMMI", "ISO/IEC 9126"], correct: "4" },
  { year: 2017, number: 10, lectureId: 3, tag: "CMMI 성숙도", prompt: "CMMI 단계적 모델에서 기본 관리 프로세스가 구축되어 프로젝트가 관리되는 등급은?", choices: ["수준 1(Initial)", "수준 2(Managed)", "수준 3(Defined)", "수준 4(Quantitatively managed)"], correct: "2" },
  { year: 2017, number: 11, lectureId: 5, tag: "인스펙션", prompt: "IBM의 페이건이 소개했고 공식 기술 검토로 설계 문서나 코드를 검사하는 검토 방법은?", choices: ["인스펙션", "형상 관리", "V&V(확인과 검증)", "위험 관리"], correct: "1" },
  { year: 2017, number: 12, lectureId: 4, tag: "신뢰도", prompt: "소프트웨어 신뢰도는 고장과 관련이 있다. 잘못된 것은?", choices: ["고장 빈도는 시스템 사용 환경과 무관하다.", "논스톱 시스템 신뢰도 측정에 가용시간 비율을 자주 사용한다.", "내재된 결함이 있어도 고장으로 연결되지 않을 수 있다.", "신뢰성이 높으면 고장이 발생해도 결과가 심각하지 않을 수 있다."], correct: "1" },
  { year: 2017, number: 13, lectureId: 5, tag: "회귀 테스트", prompt: "수정된 부분과 수정에 의한 파급 효과를 분석해 이전 테스트 케이스 집합을 선택적으로 재사용하는 테스트는?", choices: ["샌드위치 테스트", "회귀 테스트", "빅뱅 테스트", "스트레스 테스트"], correct: "2" },
  { year: 2017, number: 14, lectureId: 5, tag: "경로 검증 기준", prompt: "시작 노드에서 종료 노드까지 선형 독립 경로를 모두 테스트하고 사이클로매틱 수와 일치하는 기준은?", choices: ["문장 검증 기준", "기본 경로 테스트", "경로 검증 기준", "완전 테스트"], correct: "2" },
  { year: 2017, number: 15, lectureId: 5, tag: "블랙박스 테스트", prompt: "블랙박스 테스트 방법과 관련이 없는 것은?", choices: ["요구 명세서를 이용하여 테스트 데이터를 개발한다.", "주어진 입력에 대한 출력 결과를 조사한다.", "소스 프로그램의 제어 구조를 분석하여 테스트 기준을 정한다.", "동치 분할 방법을 사용할 수 있다."], correct: "3" },
  { year: 2017, number: 16, lectureId: 6, tag: "요구사항 수집과 분석", prompt: "요구사항 수집과 분석에 관한 설명이다. 잘못된 것은?", choices: ["수집과 분석 중에도 요구사항 변경을 고려해야 한다.", "고객이나 사용자와 의사소통하여 요구 성능이나 제약 사항을 찾아낸다.", "의사소통을 위해서는 분석가가 도메인 지식보다 프로그래밍 지식에 정통해야 한다.", "일반적으로 요구 분석은 수집, 분류, 충돌 해결, 우선순위 매기기 순으로 진행된다."], correct: "3" },
  { year: 2017, number: 17, lectureId: 6, tag: "요구사항 문서 품질", prompt: "요구사항 문서가 가져야 하는 좋은 특성에 관해 잘못 설명한 것은?", choices: ["완전성은 가능한 시나리오를 기술하는 것이다.", "일관성은 제약·요구·설계·코드 사이 관계를 추적할 수 있어야 한다.", "명확성은 요구사항 표현에 모호함이 없어야 한다.", "실현성은 제약 조건을 만족하며 구현할 수 있어야 한다."], correct: "2" },
  { year: 2017, number: 18, lectureId: 10, tag: "유스케이스와 사용자 스토리", prompt: "객체지향 기반 요구사항 추출과 분석에서 필요한 산물이며 시스템 동작 시나리오를 기술한 문서와 외부 환경 상호작용을 표현하는 다이어그램은?", choices: ["유스케이스", "사용자 스토리", "분석 객체", "데이터 흐름"], correct: "1" },
  { year: 2017, number: 19, lectureId: 7, tag: "아키텍처 중요성", prompt: "아키텍처의 중요성을 설명한 내용으로 적당하지 않은 것은?", choices: ["설계 초기 또는 요구 명세 활동에서 작성되며 개발 과정에 큰 영향을 준다.", "요구공학 과정과 설계과정의 연결고리가 된다.", "개별 모듈에서 사용되는 자료 구조와 알고리즘을 자세히 설계한다.", "프로젝트 참여자 사이의 중요한 의사소통 수단이 된다."], correct: "3" },
  { year: 2017, number: 20, lectureId: 7, tag: "파이프 필터 구조", prompt: "입력 데이터를 받아 처리하고 결과를 다른 서브시스템에 보내는 작업이 반복되는 아키텍처 스타일은?", choices: ["클라이언트-서버 아키텍처", "파이프 필터 구조", "MVC 아키텍처", "계층형 아키텍처"], correct: "2" },
  { year: 2017, number: 21, lectureId: 8, tag: "소프트웨어 재공학", prompt: "레거시 시스템의 이해를 높이고 유지보수성·재사용성을 개선하기 위해 소프트웨어를 변경하는 작업은?", choices: ["완전 유지보수", "소프트웨어 재공학", "역공학", "형상관리"], correct: "2" },
  { year: 2017, number: 22, lectureId: 8, tag: "코드 리팩토링", prompt: "코드 스멜을 제거하고 구조나 성능을 개선하기 위해 기존 동작을 유지하며 코드를 수정하는 것은?", choices: ["소프트웨어 사이언스", "테스트 선행 개발", "코드 리팩토링", "버전관리"], correct: "3" },
  { year: 2017, number: 23, lectureId: 8, tag: "형상 관리 활동", prompt: "소프트웨어 형상 관리 활동에 관한 설명으로 옳지 않은 것은?", choices: ["형상 항목 식별은 관리 항목을 정하고 베이스라인을 수립한다.", "변경 제어는 변경 요청 발생 시 즉시 변경하여 융통성을 높인다.", "형상 감사는 계획대로 관리가 진행되고 변경이 일치하는지 감사한다.", "형상 상태 보고는 수행 결과를 기록하고 보고한다."], correct: "2" },
  { year: 2017, number: 24, lectureId: 9, tag: "UML 모델 분류", prompt: "객체지향 분석 과정의 결과물 중 동적 모델에 해당하는 UML 다이어그램은?", choices: ["상태 머신 다이어그램과 시퀀스 다이어그램", "유스케이스 다이어그램", "클래스 다이어그램과 객체 다이어그램", "액티비티 다이어그램과 배포 다이어그램"], correct: "1" },
  { year: 2017, number: 25, lectureId: 10, tag: "유스케이스", prompt: "유스케이스를 실현하는 객체 협력을 나타내고 사용자와 의사소통 수단이며 변환을 통해 객체를 발견하게 해 주는 것은?", choices: ["시퀀스 다이어그램", "상태 머신 다이어그램", "클래스 다이어그램", "액티비티 다이어그램"], correct: "1" },
  { year: 2017, number: 26, lectureId: 13, tag: "집합 관계", prompt: "Loan이 Customer와 Resource를 포함하는 흰 마름모 관계는 무엇인가?", choices: ["부모와 자식 간 상속 관계", "집합체와 부품 간의 관계", "엔터티/경계/제어 객체 사이의 연관", "단순과 복합 상태 간 포함 관계"], correct: "2" },
  { year: 2017, number: 27, lectureId: 9, tag: "통합 프로세스", prompt: "통합 프로세스의 도입, 정련, 구축, 전이 중 유스케이스 작성이 시작되는 단계는?", choices: ["도입", "정련", "구축", "전이"], correct: "1" },
  { year: 2017, number: 28, lectureId: 10, tag: "유스케이스 요소", prompt: "유스케이스 다이어그램에서 등장하는 요소가 아닌 것은?", choices: ["유스케이스", "액터", "시스템 경계", "유스케이스 간의 관계"], correct: "3" },
  { year: 2017, number: 29, lectureId: 9, tag: "UML 스테레오 타입", prompt: "UML 스테레오 타입에 관한 설명으로 잘못된 것은?", choices: ["UML 요소의 의미를 바꾸거나 명확하게 하기 위한 방법이다.", "《actor》와 같이 키워드를 《》로 감싸 표현한다.", "자주 사용되는 경우 특별한 아이콘을 사용하여 표현하기도 한다.", "몇 개의 특별한 UML 요소들에만 적용할 수 있다."], correct: "4" },
  { year: 2017, number: 30, lectureId: 12, tag: "시퀀스 다이어그램 요소", prompt: "시퀀스 다이어그램 보기에서 나타나 있지 않은 요소는?", choices: ["상호작용을 일으키는 참여 요소", "시퀀스 프레그먼트(스윔 레인)", "객체의 생명선과 활성화 막대", "동기 메시지와 리턴 메시지의 전송"], correct: "2" },
  { year: 2017, number: 31, lectureId: 11, tag: "액티비티 다이어그램", prompt: "액티비티 다이어그램에 관한 일반적 설명으로 잘못된 것은?", choices: ["업무 흐름이나 계산 과정을 액션 흐름으로 표현한다.", "비즈니스 프로세스나 오퍼레이션 제어 흐름을 표현한다.", "객체 간 메시지를 통해 사용자와 시스템 사이 상호작용을 표현한다.", "4+1 뷰에서 프로세스 뷰를 표현한다."], correct: "3" },
  { year: 2017, number: 32, lectureId: 11, tag: "액티비티 다이어그램 요소", prompt: "주문 처리 액티비티 다이어그램에서 등장하고 있는 요소는?", choices: ["복합 상태", "시그널 주고받기", "포크와 조인", "호출 액티비티 노드"], correct: "4" },
  { year: 2017, number: 33, lectureId: 13, tag: "클래스 다이어그램 구성요소", prompt: "클래스 다이어그램의 구성 요소로 보기 힘든 것은?", choices: ["추상 클래스", "인터페이스", "노드", "템플릿(또는 제네릭)"], correct: "3" },
  { year: 2017, number: 34, lectureId: 14, tag: "상태 머신 다이어그램", prompt: "UML 상태 머신 다이어그램에 관한 설명으로 잘못된 것은?", choices: ["객체의 상태와 상태 전이를 표현하여 객체 행위를 모델링한다.", "단일 객체 관점에서 동적 행위를 모델링한다.", "상태 변화를 통해 객체 간 협력을 표현하여 개별 유스케이스를 구현한다.", "객체 생성부터 소멸까지 이벤트와 상태 변화를 다룬다."], correct: "3" },
  { year: 2017, number: 35, lectureId: 15, tag: "컴포넌트 다이어그램", prompt: "컴포넌트 다이어그램에서 DataSource의 제공자와 DBHelper의 필요 인터페이스를 설명한 그림에 관한 설명으로 잘못된 것은?", choices: ["컴포넌트의 물리적 배치를 보여주는 배포 다이어그램이다.", "DataSource의 제공자는 MySQLDB이다.", "Query와 StoredProc은 DBHelper의 제공 인터페이스이다.", "DataSource는 DBHelper가 필요로 하는 인터페이스이다."], correct: "1" },
];

specs.push(...compact2018, ...compact2017);

export const softwarePastExamYears: SoftwarePastExamYear[] = [2019, 2018, 2017];
export const softwarePastExamQuestions = specs.map(makeQuestion);

export const softwarePastExamTopicEntries = softwarePastExamQuestions.map((question) => ({
  id: question.id,
  year: question.year,
  number: question.number,
  lectureId: question.lectureRefs[0].lectureId,
  title: question.conceptTags[0],
  tag: question.conceptTags[0],
}));
