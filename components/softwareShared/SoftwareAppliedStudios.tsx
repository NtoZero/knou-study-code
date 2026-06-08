"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Layers3,
  Split,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import type { SoftwareLab } from "./types";

type Props = {
  lectureId: number;
  lab: SoftwareLab;
};

const buttonBase =
  "rounded-lg border px-3 py-2 text-sm font-semibold transition-colors";

function cx(...items: Array<string | false | undefined>) {
  return items.filter(Boolean).join(" ");
}

export default function SoftwareAppliedStudio({ lectureId, lab }: Props) {
  if (lectureId === 1) return <OverviewStudio />;
  if (lectureId === 2) return <ProcessStudio />;
  if (lectureId === 3) return <ProjectStudio />;
  if (lectureId === 4) return <QualityStudio />;
  if (lectureId === 5) return <TestingStudio />;
  if (lectureId === 6) return <RequirementsStudio />;
  if (lectureId === 7) return <DesignStudio />;
  if (lectureId === 8) return <MaintenanceStudio />;
  if (lectureId === 9) return <UmlStudio />;
  if (lectureId === 10) return <UsecaseStudio />;
  if (lectureId === 11) return <ActivityStudio />;
  if (lectureId === 12) return <SequenceStudio />;
  if (lectureId === 13) return <ClassStudio />;
  if (lectureId === 14) return <StateStudio />;
  if (lectureId === 15) return <ComponentStudio />;
  return <FallbackStudio lab={lab} />;
}

function StudioShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="rounded-lg border border-emerald-200 bg-white p-5 dark:border-emerald-900 dark:bg-gray-900">
        {children}
      </div>
    </section>
  );
}

function PillButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        buttonBase,
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300",
      )}
    >
      {children}
    </button>
  );
}

function OverviewStudio() {
  const [selected, setSelected] = useState("generic");
  const items = [
    {
      id: "generic",
      label: "일반 소프트웨어",
      stack: ["시장 다수 사용자", "개발 회사가 기능명세 통제", "패키지·제품 판매", "요구 안정성 중요"],
      verdict: "불특정 다수를 대상으로 하는 패키지 제품이면 일반 소프트웨어로 판정.",
    },
    {
      id: "custom",
      label: "맞춤형 소프트웨어",
      stack: ["특정 고객", "고객 요구 반영", "사용 환경 특수", "계약·인도 중심"],
      verdict: "고객이 구체 요구와 사용 환경을 제시하면 맞춤형 소프트웨어로 판정.",
    },
    {
      id: "property",
      label: "소프트웨어 성질",
      stack: ["무형성", "조립 어려움", "설계 품질 중요", "비마모성", "유연성"],
      verdict: "물리적 마모가 아니라 변경과 환경 변화가 품질 저하의 핵심.",
    },
  ];
  const current = items.find((item) => item.id === selected) ?? items[0];
  return (
    <StudioShell title="산출물 범위와 성질 분류" subtitle="소프트웨어를 코드, 문서, 데이터, 성질 기준으로 직접 분류">
      <div className="mb-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <PillButton key={item.id} active={item.id === selected} onClick={() => setSelected(item.id)}>
            {item.label}
          </PillButton>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-2">
          {current.stack.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{step}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-100">
            <Layers3 size={16} />
            판정
          </div>
          <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">{current.verdict}</p>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            시험에서는 “프로그램만 소프트웨어”처럼 범위를 좁히거나, 비마모성을 하드웨어 고장률처럼 설명하는 보기를 먼저 제거.
          </p>
        </div>
      </div>
    </StudioShell>
  );
}

function ProcessStudio() {
  const [model, setModel] = useState("waterfall");
  const models = {
    waterfall: {
      label: "폭포수",
      steps: ["타당성 조사", "요구 분석과 명세", "설계와 명세", "코딩과 단위 테스트", "통합·시스템 테스트", "인도·유지보수"],
      check: "단계별 산출물과 문서 관리가 장점이나, 늦은 요구 변경 수용은 어렵다.",
    },
    spiral: {
      label: "나선형",
      steps: ["목표 설정", "위험 식별", "위험 감소 개발", "고객 평가", "다음 반복 계획"],
      check: "반복 자체보다 위험 분석이 중심이라는 점이 폭포수·점증 모델과의 차이.",
    },
    agile: {
      label: "애자일",
      steps: ["짧은 반복 계획", "작동 소프트웨어 구현", "고객 피드백", "변경 반영", "다음 스프린트"],
      check: "스크럼, XP, 짝 프로그래밍은 관련되지만 DIP는 객체지향 설계 원칙.",
    },
  } as const;
  const current = models[model as keyof typeof models];
  return (
    <StudioShell title="프로세스 모델 타임라인" subtitle="프로젝트 조건에 따라 단계 흐름과 약점을 비교">
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(models).map(([key, item]) => (
          <PillButton key={key} active={key === model} onClick={() => setModel(key)}>
            {item.label}
          </PillButton>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        {current.steps.map((step, index) => (
          <div key={step} className="relative rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-2 text-xs font-black text-emerald-700 dark:text-emerald-200">STEP {index + 1}</div>
            <div className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">{step}</div>
            {index < current.steps.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-emerald-500 lg:block" size={18} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:bg-amber-950/25 dark:text-amber-100">
        {current.check}
      </div>
    </StudioShell>
  );
}

function ProjectStudio() {
  const [vaf, setVaf] = useState(1.05);
  const paths = [
    { name: "A-B-D", days: 9 },
    { name: "A-C-D", days: 11 },
    { name: "A-E-F-D", days: 10 },
  ];
  const critical = paths.reduce((max, path) => (path.days > max.days ? path : max), paths[0]);
  const ufp = 120;
  const afp = Math.round(ufp * vaf * 10) / 10;
  return (
    <StudioShell title="일정·규모 산정 검산" subtitle="CPM 임계 경로와 기능 점수 공식을 함께 적용">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">CPM 경로 비교</div>
          <div className="space-y-2">
            {paths.map((path) => (
              <div key={path.name} className={cx("rounded-lg border p-3", path.name === critical.name ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950")}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-mono font-black">{path.name}</span>
                  <span className="font-bold">{path.days}일</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            가장 긴 경로인 {critical.name}가 임계 경로이며, 이 경로 위 작업은 지연 여유가 없다.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <label className="text-sm font-bold text-gray-900 dark:text-gray-100">
            VAF 조정 계수: {vaf.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.65"
            max="1.35"
            step="0.05"
            value={vaf}
            onChange={(event) => setVaf(Number(event.target.value))}
            className="mt-4 w-full accent-emerald-600"
          />
          <div className="mt-4 rounded-lg bg-white p-4 dark:bg-gray-900">
            <div className="font-mono text-sm text-gray-700 dark:text-gray-300">AFP = UFP * VAF</div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-200">{ufp} * {vaf.toFixed(2)} = {afp}</div>
          </div>
        </div>
      </div>
    </StudioShell>
  );
}

function QualityStudio() {
  const [mtbf, setMtbf] = useState(80);
  const [mttr, setMttr] = useState(5);
  const availability = Math.round((mtbf / (mtbf + mttr)) * 1000) / 10;
  return (
    <StudioShell title="신뢰도·가용성 감각 만들기" subtitle="결함, 고장, 복구 시간의 관계를 숫자로 확인">
      <div className="grid gap-4 lg:grid-cols-3">
        <SliderBox label="평균 고장 간격" value={mtbf} min={20} max={200} unit="시간" onChange={setMtbf} />
        <SliderBox label="평균 복구 시간" value={mttr} min={1} max={40} unit="시간" onChange={setMttr} />
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <div className="text-sm font-bold text-emerald-800 dark:text-emerald-100">가용성</div>
          <div className="mt-3 text-3xl font-black text-emerald-700 dark:text-emerald-200">{availability}%</div>
          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
            고장 빈도뿐 아니라 복구 시간이 짧아지는지도 함께 보아야 한다.
          </p>
        </div>
      </div>
    </StudioShell>
  );
}

function SliderBox({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
      <label className="text-sm font-bold text-gray-900 dark:text-gray-100">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-emerald-600"
      />
      <div className="mt-3 font-mono text-lg font-black text-gray-900 dark:text-gray-100">{value}{unit}</div>
    </div>
  );
}

function TestingStudio() {
  const [technique, setTechnique] = useState("boundary");
  const map = {
    boundary: ["블랙박스", "입력 영역의 경계값 주변을 검사", "나이 1~120이면 0, 1, 120, 121 확인"],
    equivalence: ["블랙박스", "같은 성격의 입력 영역을 대표값으로 검사", "유효/무효 구간을 나누어 대표값 선택"],
    path: ["화이트박스", "제어 흐름의 독립 경로를 실행", "if-else 분기와 반복 구조를 기준으로 케이스 선정"],
    regression: ["회귀 테스트", "수정 후 기존 기능의 파급 오류를 재검사", "이전 통과 케이스를 선별 재실행"],
  } as const;
  const current = map[technique as keyof typeof map];
  return (
    <StudioShell title="테스트 기법 판별판" subtitle="명세 기반인지 구조 기반인지 먼저 나누고 테스트 케이스를 만든다">
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(map).map(([key, item]) => (
          <PillButton key={key} active={key === technique} onClick={() => setTechnique(key)}>
            {item[1]}
          </PillButton>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {["분류", "판별 기준", "예시"].map((label, index) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-2 text-xs font-black text-gray-500">{label}</div>
            <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">{current[index]}</p>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}

function RequirementsStudio() {
  const [scenario, setScenario] = useState("speed");
  const scenarios = {
    speed: ["검색 결과는 1초 이내 표시", "비기능적 요구사항", "성능 품질 조건이며 기능 자체가 아니라 제약."],
    id: ["회원 ID는 영문 8~12자로 입력", "기능적 요구사항", "입력 처리 규칙으로 시스템이 수행할 기능 조건."],
    db: ["지정된 DBMS를 사용", "비기능적 요구사항", "설계 제약 또는 조직/환경 제약으로 분류."],
    trace: ["요구 REQ-17은 테스트 TC-17과 연결", "추적성", "요구-설계-코드-테스트 관계를 추적하는 관리 기준."],
  } as const;
  const current = scenarios[scenario as keyof typeof scenarios];
  return (
    <StudioShell title="요구사항 분류 연습" subtitle="기능, 품질, 제약, 추적성 기준으로 요구 문장을 분류">
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(scenarios).map(([key, item]) => (
          <PillButton key={key} active={key === scenario} onClick={() => setScenario(key)}>
            {item[0]}
          </PillButton>
        ))}
      </div>
      <div className="rounded-lg bg-emerald-50 p-5 dark:bg-emerald-950/30">
        <div className="text-sm font-bold text-emerald-800 dark:text-emerald-100">{current[1]}</div>
        <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{current[2]}</p>
      </div>
    </StudioShell>
  );
}

function DesignStudio() {
  const qualities = [
    ["성능", "서브시스템 간 통신 최소화, 병렬 처리 고려"],
    ["보안", "계층형 아키텍처와 내부 계층 보호"],
    ["가용성", "동일 기능 컴포넌트 중복"],
    ["유지보수성", "자료 공유 회피, 낮은 결합도와 높은 응집도"],
  ];
  return (
    <StudioShell title="품질 속성별 아키텍처 선택" subtitle="비기능 요구사항을 구조 전략으로 바꾸어 읽기">
      <div className="grid gap-3 md:grid-cols-2">
        {qualities.map(([quality, strategy]) => (
          <div key={quality} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-2 text-sm font-black text-emerald-700 dark:text-emerald-200">{quality}</div>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{strategy}</p>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}

function MaintenanceStudio() {
  const [change, setChange] = useState("adaptive");
  const changes = {
    corrective: ["로그인 오류 수정", "수정 유지보수", "결함을 제거하는 변경."],
    adaptive: ["새 운영체제 지원", "적응 유지보수", "환경 변화에 맞추는 변경."],
    perfective: ["검색 속도와 기능 개선", "완전 유지보수", "성능·기능을 더 좋게 만드는 변경."],
    preventive: ["중복 코드 제거", "예방 유지보수/리팩터링", "미래 변경을 쉽게 하되 외부 행위는 유지."],
  } as const;
  const current = changes[change as keyof typeof changes];
  return (
    <StudioShell title="변경 요청 분류" subtitle="변경 목적을 보고 유지보수 유형과 리팩터링 여부를 판정">
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(changes).map(([key, item]) => (
          <PillButton key={key} active={key === change} onClick={() => setChange(key)}>
            {item[0]}
          </PillButton>
        ))}
      </div>
      <div className="rounded-lg bg-emerald-50 p-5 dark:bg-emerald-950/30">
        <div className="text-sm font-bold text-emerald-800 dark:text-emerald-100">{current[1]}</div>
        <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{current[2]}</p>
      </div>
    </StudioShell>
  );
}

function UmlStudio() {
  const items = [
    ["논리 뷰", "클래스·객체 구조", "정적 구조와 관계"],
    ["유스케이스 뷰", "액터와 목표", "기능 요구의 외부 관점"],
    ["구현 뷰", "컴포넌트", "소프트웨어 구성요소"],
    ["배포 뷰", "노드와 아티팩트", "실행 환경 배치"],
  ];
  return <MatrixStudio title="UML 뷰 매핑" subtitle="관점, 다이어그램, 시험 단서를 연결" rows={items} />;
}

function UsecaseStudio() {
  const rows = [
    ["include", "항상 수행되는 공통 기능", "여러 유스케이스가 로그인 확인을 재사용"],
    ["extend", "조건부·선택적 확장", "거래 중 도움말 보기"],
    ["일반화", "일반-특수 관계", "회원 액터를 관리자와 일반회원으로 특화"],
  ];
  return <MatrixStudio title="유스케이스 관계 판독" subtitle="점선 화살표만 보지 말고 실행 조건을 읽기" rows={rows} />;
}

function ActivityStudio() {
  const steps = ["주문 접수", "재고 확인", "결제 승인", "포장 준비", "배송 요청"];
  return <FlowStudio title="액티비티 흐름 추적" subtitle="액션, 분기, 포크·조인, 파티션을 절차 흐름으로 확인" steps={steps} note="마름모는 조건 분기, 굵은 막대는 병렬 흐름의 분기와 동기화." />;
}

function SequenceStudio() {
  const steps = ["학생→수강신청UI: 신청", "UI→수강관리: 검증", "수강관리→강좌: 잔여석 확인", "강좌→수강관리: 결과", "수강관리→UI: 완료"];
  return <FlowStudio title="시퀀스 메시지 순서" subtitle="위에서 아래로 시간 순서를 따라 메시지와 객체 역할을 읽기" steps={steps} note="경계 객체는 UI, 제어 객체는 흐름 제어, 엔터티 객체는 핵심 데이터를 담당." />;
}

function ClassStudio() {
  const rows = [
    ["일반화", "빈 삼각형", "화살표가 향하는 쪽이 상위 클래스"],
    ["집합", "흰 마름모", "전체-부분이나 부분 생명주기가 약하게 종속"],
    ["합성", "검은 마름모", "부분 생명주기가 전체에 강하게 종속"],
    ["실현", "점선+빈 삼각형", "클래스가 인터페이스 명세를 구현"],
  ];
  return <MatrixStudio title="클래스 관계 기호 판독" subtitle="관계 종류, 기호, 방향을 한 번에 대조" rows={rows} />;
}

function StateStudio() {
  const [count, setCount] = useState(0);
  const state = count >= 3 ? "불켜짐" : "닫힘";
  return (
    <StudioShell title="상태 전이 라벨 읽기" subtitle="이벤트[가드]/활동 형식으로 상태 변화를 추적">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">현재 상태</div>
          <div className="mt-3 text-3xl font-black text-emerald-700 dark:text-emerald-200">{state}</div>
          <button
            type="button"
            onClick={() => setCount((value) => Math.min(3, value + 1))}
            className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800"
          >
            노크하기
          </button>
          <button
            type="button"
            onClick={() => setCount(0)}
            className="ml-2 mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            초기화
          </button>
        </div>
        <div className="rounded-lg bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:bg-amber-950/25 dark:text-amber-100">
          노크하기[노크 횟수=3]/불켜기에서 노크하기는 이벤트, 대괄호는 가드 조건, 슬래시 뒤는 전이 활동.
        </div>
      </div>
    </StudioShell>
  );
}

function ComponentStudio() {
  const rows = [
    ["공 모양", "제공 인터페이스", "컴포넌트가 외부에 제공하는 서비스"],
    ["소켓 모양", "필요 인터페이스", "컴포넌트가 사용하기 위해 요구하는 서비스"],
    ["육면체 노드", "배포 다이어그램", "실행 환경이나 장치"],
    ["폴더 기호", "패키지 다이어그램", "모델 요소나 구성 요소 그룹화"],
  ];
  return <MatrixStudio title="구조 다이어그램 기호 분류" subtitle="컴포넌트·배포·패키지의 초점을 기호와 역할로 분리" rows={rows} />;
}

function MatrixStudio({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: string[][];
}) {
  const [active, setActive] = useState(0);
  return (
    <StudioShell title={title} subtitle={subtitle}>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {rows.map(([label, meaning, clue], index) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(index)}
            className={cx(
              "rounded-lg border p-4 text-left transition-colors",
              active === index
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-gray-200 bg-gray-50 hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-950",
            )}
          >
            <div className="text-sm font-black text-gray-900 dark:text-gray-100">{label}</div>
            <div className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{meaning}</div>
            <div className="mt-3 text-xs font-semibold leading-5 text-emerald-700 dark:text-emerald-200">{clue}</div>
          </button>
        ))}
      </div>
    </StudioShell>
  );
}

function FlowStudio({
  title,
  subtitle,
  steps,
  note,
}: {
  title: string;
  subtitle: string;
  steps: string[];
  note: string;
}) {
  const [active, setActive] = useState(0);
  return (
    <StudioShell title={title} subtitle={subtitle}>
      <div className="grid gap-3 lg:grid-cols-5">
        {steps.map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => setActive(index)}
            className={cx(
              "relative rounded-lg border p-4 text-left transition-colors",
              active === index
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-gray-200 bg-gray-50 hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-950",
            )}
          >
            <div className="mb-2 text-xs font-black text-emerald-700 dark:text-emerald-200">{index + 1}</div>
            <div className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">{step}</div>
            {index < steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-emerald-500 lg:block" size={18} />}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:bg-amber-950/25 dark:text-amber-100">
        {note}
      </div>
    </StudioShell>
  );
}

function FallbackStudio({ lab }: { lab: SoftwareLab }) {
  const [active, setActive] = useState(0);
  const current = lab.cases[active];
  return (
    <StudioShell title={lab.title} subtitle={lab.subtitle}>
      <div className="mb-4 flex flex-wrap gap-2">
        {lab.cases.map((item, index) => (
          <PillButton key={item.label} active={index === active} onClick={() => setActive(index)}>
            {item.label}
          </PillButton>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <InfoBox icon={<Split size={16} />} label="조건" value={current.input} />
        <InfoBox icon={<CheckCircle2 size={16} />} label="판정" value={current.output} />
        <InfoBox icon={<GitBranch size={16} />} label="검산 기준" value={current.rule} />
      </div>
    </StudioShell>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-2 flex items-center gap-2 text-xs font-black text-gray-500">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
