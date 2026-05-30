"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import type { AlgorithmLecture as AlgorithmLectureData } from "@/lib/algorithmCourse";

type TraceStep = {
  title: string;
  note: string;
  values?: number[];
  active?: number[];
  locked?: number[];
  table?: string[][];
  tags?: string[];
};

type TabSpec<T extends string> = {
  id: T;
  label: string;
};

const tone = {
  amber: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100",
};

function clampStep(step: number, total: number) {
  return Math.min(Math.max(step, 0), Math.max(total - 1, 0));
}

function StepControls({
  step,
  total,
  onStep,
}: {
  step: number;
  total: number;
  onStep: (next: number) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
      <div className="text-xs font-semibold text-slate-500">
        단계 {step + 1} / {total}
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onStep(0)}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw size={13} />
        </button>
        <button
          type="button"
          disabled={step === 0}
          onClick={() => onStep(step - 1)}
          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          이전
        </button>
        <button
          type="button"
          disabled={step >= total - 1}
          onClick={() => onStep(step + 1)}
          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          다음
        </button>
      </div>
    </div>
  );
}

function UnitShell({
  title,
  subtitle,
  children,
  wrongRule,
  examPoint,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  wrongRule: string;
  examPoint: string;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">단원별 전용 랩</p>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
        </div>
        <div className="grid gap-2 text-xs lg:w-80">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 leading-5 text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
            <span className="font-bold">흔한 실수: </span>
            {wrongRule}
          </div>
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3 leading-5 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100">
            <span className="font-bold">시험 포인트: </span>
            {examPoint}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

function Tabs<T extends string>({ tabs, value, onChange }: { tabs: readonly TabSpec<T>[]; value: T; onChange: (next: T) => void }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            value === tab.id
              ? "bg-slate-950 text-white dark:bg-cyan-200 dark:text-slate-950"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ArrayStrip({ values, active = [], locked = [] }: { values: number[]; active?: number[]; locked?: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex min-h-44 items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      {values.map((value, index) => {
        const isActive = active.includes(index);
        const isLocked = locked.includes(index);
        return (
          <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full rounded-t-lg transition-all duration-300 ${
                isActive ? "bg-rose-500 shadow-lg shadow-rose-500/30" : isLocked ? "bg-emerald-500" : "bg-cyan-500"
              }`}
              style={{ height: `${Math.max(18, (value / max) * 128)}px` }}
            />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

function TraceCard({ step }: { step: TraceStep }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-slate-950 dark:text-white">{step.title}</h3>
        {step.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{step.note}</p>
      {step.values && <div className="mt-4"><ArrayStrip values={step.values} active={step.active} locked={step.locked} /></div>}
      {step.table && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="min-w-full text-sm">
            <tbody>
              {step.table.map((row, r) => (
                <tr key={r} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  {row.map((cell, c) => (
                    <td key={`${r}-${c}`} className={`px-3 py-2 ${r === 0 || c === 0 ? "bg-slate-100 font-bold dark:bg-slate-900" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AlgorithmConceptLadder({ lecture }: { lecture: AlgorithmLectureData }) {
  const steps = ["정의", "왜 필요한가", "작동 절차", "비예와 흔한 실수", "시험에서 묻는 방식"];
  const firstProcedure = lecture.procedures[0]?.steps ?? [];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">개념 설명 사다리</p>
        <h2 className="text-lg font-bold">키워드가 문제풀이 기준이 되는 과정</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          개념명만 외우지 않고, 정의와 적용 절차, 틀리는 조건을 한 화면에서 연결한다.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-5">
        {steps.map((step, index) => {
          const concept = lecture.concepts[index % lecture.concepts.length];
          const procedure = firstProcedure[index % Math.max(firstProcedure.length, 1)];
          const pitfall = lecture.pitfalls[index % lecture.pitfalls.length];
          const examKeyword = lecture.examKeywords[index % lecture.examKeywords.length];
          const body =
            index === 0
              ? `${concept.title}: ${concept.body}`
              : index === 1
                ? lecture.summary
                : index === 2
                  ? procedure
                  : index === 3
                    ? pitfall
                    : examKeyword;
          return (
            <article key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-cyan-200 dark:text-slate-950">
                {index + 1}
              </div>
              <h3 className="font-bold">{step}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AlgorithmDesignLab() {
  const scenarios = [
    { label: "종료하지만 특정 입력에서 오답", verdict: "알고리즘 조건 미충족", reason: "유한성은 만족하지만 정확성을 위반한다." },
    { label: "현재 최선 선택을 되돌리지 않음", verdict: "욕심쟁이 방법 후보", reason: "분할 가능 배낭, MST처럼 안전한 선택 기준이 있으면 효과적이다." },
    { label: "같은 소문제를 반복 계산", verdict: "동적 프로그래밍 후보", reason: "중복 부분문제와 최적성의 원리가 보이면 테이블 저장을 검토한다." },
  ];
  const [selected, setSelected] = useState(0);
  const items = [
    { name: "소시지", weight: 3, profit: 15 },
    { name: "빵", weight: 5, profit: 20 },
    { name: "귤", weight: 3, profit: 9 },
    { name: "생선", weight: 4, profit: 14 },
  ].map((item) => ({ ...item, ratio: item.profit / item.weight })).sort((a, b) => b.ratio - a.ratio);

  return (
    <UnitShell
      title="조건 판정과 배낭 선택 랩"
      subtitle="알고리즘 조건을 먼저 판정하고, 설계 기법은 문제 구조와 함께 연결한다."
      wrongRule="종료 여부만 보고 알고리즘이라고 판단하거나, 0/1 배낭에도 단위 이익 욕심쟁이를 그대로 적용하면 틀린다."
      examPoint="알고리즘 조건, 설계 기법 분류, 분할 가능 배낭의 단위 무게당 이익 기준을 함께 묻는다."
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2">
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.label}
              type="button"
              onClick={() => setSelected(index)}
              className={`w-full rounded-xl border p-4 text-left transition ${selected === index ? tone.cyan : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"}`}
            >
              <div className="font-bold">{scenario.label}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{scenario.verdict}</div>
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-bold">{scenarios[selected].verdict}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{scenarios[selected].reason}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {items.map((item, index) => (
              <div key={item.name} className="rounded-lg bg-white p-3 text-sm shadow-sm dark:bg-slate-950">
                <div className="font-bold">{index + 1}. {item.name}</div>
                <div className="mt-1 text-slate-500">이익/무게 {item.profit}/{item.weight}</div>
                <div className="mt-2 rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-100">
                  단위 이익 {item.ratio.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UnitShell>
  );
}

function ComplexityLab() {
  const [n, setN] = useState(32);
  const rows = [
    ["O(1)", 1],
    ["O(log n)", Math.log2(n)],
    ["O(n)", n],
    ["O(n log n)", n * Math.log2(n)],
    ["O(n²)", n * n],
    ["O(2ⁿ)", Math.min(2 ** Math.min(n, 16), 65536)],
  ];
  const max = Math.max(...rows.map((row) => Number(row[1])));
  return (
    <UnitShell
      title="성장률 체감 슬라이더"
      subtitle="입력 크기를 바꾸며 점근 성능의 크기 관계와 점화식 패턴을 수치로 확인한다."
      wrongRule="낮은 차수항이나 작은 입력에서의 우연한 값만 보고 성장률을 판단하면 틀린다."
      examPoint="Big-O 함수 크기 관계, 반복문 횟수, 기본 점화식의 성능을 묻는다."
    >
      <label className="block text-sm font-semibold">입력 크기 n = {n}</label>
      <input className="mt-2 w-full accent-cyan-600" type="range" min={4} max={128} step={4} value={n} onChange={(event) => setN(Number(event.target.value))} />
      <div className="mt-5 space-y-3">
        {rows.map(([label, raw]) => {
          const value = Number(raw);
          return (
            <div key={label} className="grid gap-2 sm:grid-cols-[120px_1fr_90px] sm:items-center">
              <div className="font-mono text-sm font-bold">{label}</div>
              <div className="h-5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-cyan-500 transition-all duration-300" style={{ width: `${Math.max(2, (value / max) * 100)}%` }} />
              </div>
              <div className="font-mono text-sm text-slate-500">{Math.round(value).toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </UnitShell>
  );
}

const sortSteps: Record<string, TraceStep[]> = {
  bubble: [
    { title: "버블 정렬 시작", note: "인접한 두 원소를 비교하고 큰 값을 오른쪽으로 보낸다.", values: [35, 20, 10, 40, 25, 15, 30], active: [0, 1] },
    { title: "첫 교환", note: "35와 20은 오름차순 기준이 아니므로 교환한다.", values: [20, 35, 10, 40, 25, 15, 30], active: [1, 2] },
    { title: "패스 후반", note: "40은 오른쪽으로 이동하며 패스 끝에서 가장 큰 값이 뒤쪽에 고정된다.", values: [20, 10, 35, 25, 15, 30, 40], active: [5, 6], locked: [6] },
  ],
  selection: [
    { title: "최솟값 탐색", note: "미정렬 구간 전체에서 최솟값의 위치를 찾는다.", values: [29, 10, 14, 37, 13], active: [0, 1] },
    { title: "최솟값 선택", note: "10이 최솟값이므로 첫 자리와 교환한다.", values: [10, 29, 14, 37, 13], active: [0, 1], locked: [0] },
    { title: "다음 구간", note: "첫 자리는 고정하고 남은 구간에서 다시 최솟값을 찾는다.", values: [10, 13, 14, 37, 29], active: [1, 4], locked: [0, 1] },
  ],
  insertion: [
    { title: "정렬 구간", note: "왼쪽은 이미 정렬된 구간으로 보고 현재 원소를 삽입한다.", values: [10, 35, 20, 40, 15], active: [1, 2], locked: [0] },
    { title: "이동", note: "35가 20보다 크므로 오른쪽으로 이동한다.", values: [10, 35, 35, 40, 15], active: [1, 2], locked: [0] },
    { title: "삽입", note: "빈 자리에 20을 넣어 왼쪽 정렬 구간을 확장한다.", values: [10, 20, 35, 40, 15], active: [1], locked: [0, 1, 2] },
  ],
  shell: [
    { title: "간격 3 비교", note: "떨어진 원소끼리 먼저 삽입 정렬을 적용해 큰 이동을 줄인다.", values: [35, 20, 10, 40, 25, 15], active: [0, 3] },
    { title: "부분수열 정렬", note: "간격이 있는 부분수열의 역전을 줄인다.", values: [35, 20, 10, 40, 25, 15], active: [2, 5] },
    { title: "간격 1 마무리", note: "마지막에는 일반 삽입 정렬처럼 처리한다.", values: [10, 15, 20, 25, 35, 40], locked: [0, 1, 2, 3, 4, 5] },
  ],
};

function ElementarySortLab() {
  const tabs = [
    { id: "bubble", label: "버블" },
    { id: "selection", label: "선택" },
    { id: "insertion", label: "삽입" },
    { id: "shell", label: "셸" },
  ] as const;
  const [mode, setMode] = useState<(typeof tabs)[number]["id"]>("bubble");
  const [step, setStep] = useState(0);
  const steps = sortSteps[mode];
  const active = steps[clampStep(step, steps.length)];
  return (
    <UnitShell
      title="기초 정렬 단계 추적"
      subtitle="정렬별로 비교 위치, 교환/삽입, 정렬 완료 구간이 어떻게 달라지는지 직접 비교한다."
      wrongRule="선택 정렬을 인접 교환으로 보거나, 삽입 정렬을 최솟값 선택으로 보면 처리 과정 판별 문제가 틀린다."
      examPoint="버블·선택·삽입·셸 정렬의 처리 방식, 안정성, 제자리 여부, 입력 상태별 성능을 묻는다."
    >
      <Tabs tabs={tabs} value={mode} onChange={(next) => { setMode(next); setStep(0); }} />
      <TraceCard step={active} />
      <StepControls step={step} total={steps.length} onStep={(next) => setStep(clampStep(next, steps.length))} />
    </UnitShell>
  );
}

function PartitionMergeLab() {
  const tabs = [
    { id: "quick", label: "partition()" },
    { id: "merge", label: "merge()" },
  ] as const;
  const traces: Record<(typeof tabs)[number]["id"], TraceStep[]> = {
    quick: [
      { title: "피벗 선택", note: "맨 왼쪽 15를 피벗으로 두고 작은 값과 큰 값을 나눌 준비를 한다.", values: [15, 1, 7, 11, 22], active: [0], tags: ["피벗"] },
      { title: "작은 값 이동", note: "1, 7, 11은 피벗보다 작으므로 왼쪽 부분배열에 남는다.", values: [15, 1, 7, 11, 22], active: [1, 2, 3] },
      { title: "피벗 확정", note: "피벗 15는 작은 값 3개 뒤에 위치한다. 부분배열 경계가 이후 재귀 호출의 기준이다.", values: [11, 1, 7, 15, 22], active: [3], locked: [3] },
    ],
    merge: [
      { title: "두 부분배열", note: "[10, 35]와 [15, 20, 40]처럼 이미 정렬된 두 구간을 앞에서부터 비교한다.", values: [10, 35, 15, 20, 40], active: [0, 2] },
      { title: "작은 값 복사", note: "10 다음에는 15가 작으므로 보조 배열에 순서대로 들어간다.", values: [10, 15, 35, 20, 40], active: [1, 2], locked: [0, 1] },
      { title: "나머지 복사", note: "한쪽 부분배열이 비면 남은 값을 그대로 붙여 합병을 끝낸다.", values: [10, 15, 20, 35, 40], locked: [0, 1, 2, 3, 4] },
    ],
  };
  const [mode, setMode] = useState<(typeof tabs)[number]["id"]>("quick");
  const [step, setStep] = useState(0);
  const steps = traces[mode];
  return (
    <UnitShell
      title="부분배열 경계와 합병 포인터"
      subtitle="퀵 정렬은 피벗 위치를 확정하고, 합병 정렬은 두 정렬 구간의 포인터를 움직인다."
      wrongRule="피벗 최종 위치와 단순 정렬 결과를 혼동하거나, merge()가 정렬되지 않은 구간을 합친다고 보면 틀린다."
      examPoint="partition() 1회 적용 결과, 피벗 기준 부분배열, merge()의 비교·복사 순서를 묻는다."
    >
      <Tabs tabs={tabs} value={mode} onChange={(next) => { setMode(next); setStep(0); }} />
      <TraceCard step={steps[clampStep(step, steps.length)]} />
      <StepControls step={step} total={steps.length} onStep={(next) => setStep(clampStep(next, steps.length))} />
    </UnitShell>
  );
}

function HeapLinearSortLab() {
  const tabs = [
    { id: "heap", label: "힙" },
    { id: "counting", label: "계수" },
    { id: "radix", label: "기수" },
    { id: "bucket", label: "버킷" },
  ] as const;
  const traces: Record<(typeof tabs)[number]["id"], TraceStep[]> = {
    heap: [
      { title: "최대 힙", note: "부모 키가 자식 키보다 크거나 같아 루트에 최댓값이 온다.", values: [88, 50, 15, 30, 40, 7], active: [0] },
      { title: "최댓값 삭제", note: "루트와 마지막 원소를 교환한 뒤 힙 크기를 줄인다.", values: [7, 50, 15, 30, 40, 88], active: [0, 5], locked: [5] },
      { title: "힙 재구성", note: "루트에서 아래로 내려가며 부모-자식 성질을 회복한다.", values: [50, 40, 15, 30, 7, 88], active: [0, 1], locked: [5] },
    ],
    counting: [
      { title: "개수 세기", note: "각 키값의 빈도를 센 뒤 누적 개수로 정렬 위치를 계산한다.", table: [["값", "1", "2", "3", "4"], ["빈도", "1", "2", "1", "1"], ["누적", "1", "3", "4", "5"]] },
      { title: "위치 결정", note: "자신보다 작거나 같은 원소 수를 이용해 뒤에서부터 안정적으로 배치한다.", values: [1, 2, 2, 3, 4], locked: [0, 1, 2, 3, 4] },
    ],
    radix: [
      { title: "1의 자리 안정 정렬", note: "낮은 자리부터 정렬할 때 이전 자리 순서가 보존되어야 하므로 내부 정렬은 안정적이어야 한다.", values: [170, 90, 802, 2, 24, 45, 75, 66], active: [2, 3] },
      { title: "10의 자리", note: "다음 자리 정렬은 앞 자리에서 만든 상대 순서를 깨뜨리지 않아야 한다.", values: [802, 2, 24, 45, 66, 170, 75, 90], active: [0, 1] },
      { title: "완료", note: "모든 자리 처리가 끝나면 전체 숫자 순서가 정렬된다.", values: [2, 24, 45, 66, 75, 90, 170, 802], locked: [0, 1, 2, 3, 4, 5, 6, 7] },
    ],
    bucket: [
      { title: "버킷 분배", note: "입력이 균등 분포해야 각 버킷 내부 부담이 작아진다.", table: [["버킷", "0.0~0.3", "0.3~0.6", "0.6~0.9"], ["원소", "0.12, 0.22", "0.39, 0.51", "0.68, 0.74"]] },
      { title: "버킷 내부 정렬", note: "버킷 내부에는 삽입 정렬 같은 다른 정렬이 필요할 수 있다.", values: [12, 22, 39, 51, 68, 74], locked: [0, 1, 2, 3, 4, 5] },
    ],
  };
  const [mode, setMode] = useState<(typeof tabs)[number]["id"]>("heap");
  const [step, setStep] = useState(0);
  const steps = traces[mode];
  return (
    <UnitShell
      title="힙 성질과 분포 정렬 조건"
      subtitle="비교 기반 정렬과 선형 시간 정렬은 적용 조건 자체가 다르다."
      wrongRule="기수 정렬에서 안정 정렬 조건을 빼거나, 버킷 정렬을 입력 분포와 무관한 선형 정렬로 보면 틀린다."
      examPoint="힙 재구성, 계수 배열, 기수 정렬의 안정성, 버킷 정렬의 선형 조건을 묻는다."
    >
      <Tabs tabs={tabs} value={mode} onChange={(next) => { setMode(next); setStep(0); }} />
      <TraceCard step={steps[clampStep(step, steps.length)]} />
      <StepControls step={step} total={steps.length} onStep={(next) => setStep(clampStep(next, steps.length))} />
    </UnitShell>
  );
}

function SearchTreeLab() {
  const tabs = [
    { id: "binary", label: "이진 탐색" },
    { id: "bst", label: "BST 삭제" },
    { id: "tree234", label: "2-3-4 삽입" },
  ] as const;
  const traces: Record<(typeof tabs)[number]["id"], TraceStep[]> = {
    binary: [
      { title: "중간값 비교", note: "정렬 배열에서 중간값 22와 목표 44를 비교한다.", values: [7, 15, 22, 30, 44, 55, 88], active: [3] },
      { title: "오른쪽 절반 선택", note: "목표가 중간값보다 크므로 왼쪽 절반은 버린다.", values: [7, 15, 22, 30, 44, 55, 88], active: [4, 5, 6], locked: [0, 1, 2, 3] },
      { title: "탐색 성공", note: "다시 중간값을 비교해 44를 찾는다.", values: [7, 15, 22, 30, 44, 55, 88], active: [4], locked: [0, 1, 2, 3] },
    ],
    bst: [
      { title: "삭제 노드 탐색", note: "루트 30을 삭제하면 두 자식이 있으므로 대체 후보가 필요하다.", tags: ["두 자식"] },
      { title: "중위 후속자", note: "오른쪽 서브트리의 최솟값 44를 루트 자리로 올리면 BST 성질이 유지된다.", tags: ["왼쪽 < 루트 < 오른쪽"] },
      { title: "링크 조정", note: "44가 있던 위치의 부모 링크를 44의 오른쪽 자식으로 바꿔 마무리한다.", tags: ["검산"] },
    ],
    tree234: [
      { title: "4-노드 확인", note: "삽입 경로에서 키 3개를 가진 4-노드를 만나면 먼저 분할한다.", tags: ["분할"] },
      { title: "중간 키 상승", note: "중간 키는 부모로 올라가고 양쪽 키는 두 자식 노드로 나뉜다.", tags: ["균형 유지"] },
      { title: "리프 삽입", note: "분할 후 내려간 리프에 새 키를 삽입한다.", tags: ["모든 리프 레벨 동일"] },
    ],
  };
  const [mode, setMode] = useState<(typeof tabs)[number]["id"]>("binary");
  const [step, setStep] = useState(0);
  const steps = traces[mode];
  return (
    <UnitShell
      title="탐색 조건과 트리 조작"
      subtitle="배열 탐색은 정렬 조건, 트리 탐색은 키 순서 불변식, 2-3-4 트리는 노드 분할을 추적한다."
      wrongRule="이진 탐색을 비정렬 데이터에 적용하거나, BST 두 자식 삭제에서 임의 노드를 올리면 틀린다."
      examPoint="이진 탐색 시간, BST 삽입·삭제, 2-3-4 트리 삽입 과정을 묻는다."
    >
      <Tabs tabs={tabs} value={mode} onChange={(next) => { setMode(next); setStep(0); }} />
      <TraceCard step={steps[clampStep(step, steps.length)]} />
      <StepControls step={step} total={steps.length} onStep={(next) => setStep(clampStep(next, steps.length))} />
    </UnitShell>
  );
}

function BalancedHashLab() {
  const [mode, setMode] = useState<"rb" | "hash">("rb");
  return (
    <UnitShell
      title="균형 규칙과 충돌 처리"
      subtitle="레드-블랙 트리는 색 규칙으로 높이를 제한하고, 해싱은 충돌 후 탐사 경로를 관리한다."
      wrongRule="레드-블랙 탐색과 삽입 보정을 혼동하거나, 선형 탐사 삭제에서 탐사 경로 단절을 무시하면 틀린다."
      examPoint="2-3-4와 레드-블랙 표현, 삽입 보정, 해싱 충돌과 선형 탐사의 클러스터링을 묻는다."
    >
      <Tabs tabs={[{ id: "rb", label: "레드-블랙" }, { id: "hash", label: "선형 탐사" }]} value={mode} onChange={setMode} />
      {mode === "rb" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {["부모와 삼촌이 빨강이면 색 변경", "삼촌이 검정이고 꺾인 형태면 1차 회전", "일직선 형태면 2차 회전 후 색 교환"].map((text, index) => (
            <div key={text} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-5 w-5 rounded-full ${index === 0 ? "bg-red-500" : "bg-slate-950 dark:bg-slate-100"}`} />
                <span className="font-bold">삽입 보정 {index + 1}</span>
              </div>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-7">
          {[0, 1, 2, 3, 4, 5, 6].map((slot) => (
            <div key={slot} className={`rounded-xl border p-4 text-center ${[3, 4, 5].includes(slot) ? tone.amber : "border-slate-200 dark:border-slate-800"}`}>
              <div className="text-xs text-slate-500">slot {slot}</div>
              <div className="mt-1 font-bold">{slot === 3 ? "24" : slot === 4 ? "31" : slot === 5 ? "38" : "·"}</div>
            </div>
          ))}
          <div className="sm:col-span-7 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
            24, 31, 38이 같은 해시 주소에서 연속 슬롯을 점유하면 1차 클러스터링이 커져 평균 탐색 시간이 증가한다.
          </div>
        </div>
      )}
    </UnitShell>
  );
}

function GraphTraversalLab() {
  const [mode, setMode] = useState<"dfs" | "topo" | "scc">("dfs");
  const [step, setStep] = useState(0);
  const traces: Record<typeof mode, TraceStep[]> = {
    dfs: [
      { title: "시작 정점 방문", note: "정점 1을 방문하고 아직 방문하지 않은 인접 정점으로 깊게 진행한다.", tags: ["stack: 1"] },
      { title: "깊게 진행", note: "정점 2, 4처럼 가능한 경로를 먼저 따라간다.", tags: ["stack: 1→2→4"] },
      { title: "되돌아가기", note: "더 갈 곳이 없으면 직전 정점으로 돌아와 다음 인접 정점을 확인한다.", tags: ["backtrack"] },
    ],
    topo: [
      { title: "진입차수 0 선택", note: "선행 조건이 없는 정점을 결과에 넣는다.", tags: ["DAG"] },
      { title: "간선 제거", note: "선택한 정점의 나가는 간선을 제거해 새 진입차수 0 정점을 만든다.", tags: ["queue"] },
      { title: "사이클 검산", note: "모든 정점을 꺼내지 못하면 방향 사이클이 있어 위상 정렬이 불가능하다.", tags: ["검산"] },
    ],
    scc: [
      { title: "DFS 완료 순서", note: "원 그래프에서 DFS를 수행해 완료 시간이 큰 정점을 기록한다.", tags: ["1차 DFS"] },
      { title: "전치 그래프", note: "모든 간선 방향을 뒤집어 전치 그래프를 만든다.", tags: ["transpose"] },
      { title: "묶음 판정", note: "완료 시간이 큰 정점부터 DFS한 각 트리가 하나의 강연결 성분이다.", tags: ["SCC"] },
    ],
  };
  const steps = traces[mode];
  return (
    <UnitShell
      title="그래프 순회 상태 추적"
      subtitle="DFS, 위상 정렬, 강연결 성분은 방문 순서와 보조 구조가 결과를 결정한다."
      wrongRule="무방향 연결 성분과 방향 강연결 성분을 혼동하거나, DAG 조건 없이 위상 정렬을 적용하면 틀린다."
      examPoint="인접 행렬/리스트, DFS 방문 순서, 위상 정렬 조건, 강연결 성분 절차를 묻는다."
    >
      <Tabs tabs={[{ id: "dfs", label: "DFS" }, { id: "topo", label: "위상 정렬" }, { id: "scc", label: "강연결 성분" }]} value={mode} onChange={(next) => { setMode(next); setStep(0); }} />
      <TraceCard step={steps[clampStep(step, steps.length)]} />
      <StepControls step={step} total={steps.length} onStep={(next) => setStep(clampStep(next, steps.length))} />
    </UnitShell>
  );
}

function GreedyGraphLab() {
  const [mode, setMode] = useState<"kruskal" | "prim" | "dijkstra">("kruskal");
  const traces: Record<typeof mode, TraceStep[]> = {
    kruskal: [
      { title: "간선 정렬", note: "모든 간선을 가중치 증가 순으로 정렬한다.", table: [["순서", "1", "2", "3", "4"], ["간선", "(a,b)", "(c,e)", "(d,f)", "(b,c)"], ["가중치", "2", "3", "4", "6"]] },
      { title: "사이클 검사", note: "가장 작은 간선부터 선택하되 이미 같은 집합을 연결하면 제외한다.", tags: ["Union-Find"] },
      { title: "간선 수 검산", note: "선택 간선 수가 |V|-1이면 최소 신장 트리가 완성된다.", tags: ["|V|-1"] },
    ],
    prim: [
      { title: "시작 정점", note: "현재 트리에 포함된 정점 집합에서 바깥으로 나가는 최소 간선을 고른다." },
      { title: "트리 확장", note: "정점 집합이 하나씩 커지며 항상 연결 상태를 유지한다." },
      { title: "크루스칼과 구분", note: "프림은 정점 집합 중심, 크루스칼은 전체 간선 정렬 중심이다." },
    ],
    dijkstra: [
      { title: "거리 초기화", note: "출발점 0, 나머지는 무한대로 둔다.", table: [["정점", "A", "B", "C", "D"], ["거리", "0", "∞", "∞", "∞"]] },
      { title: "최소 거리 확정", note: "미확정 정점 중 거리 추정값이 가장 작은 정점을 확정한다.", table: [["정점", "A", "B", "C", "D"], ["거리", "0", "4", "2", "∞"]] },
      { title: "음수 간선 한계", note: "나중에 더 짧아질 수 있는 음수 간선이 있으면 확정 전략이 깨질 수 있다.", tags: ["한계"] },
    ],
  };
  const [step, setStep] = useState(0);
  const steps = traces[mode];
  return (
    <UnitShell
      title="욕심쟁이 그래프 알고리즘 비교"
      subtitle="크루스칼·프림·데이크스트라는 모두 욕심쟁이지만 선택 단위와 검산 기준이 다르다."
      wrongRule="MST와 최단 경로를 같은 문제로 보거나, 데이크스트라를 음수 간선 그래프에 그대로 적용하면 틀린다."
      examPoint="크루스칼/프림 적용, 데이크스트라 성능과 한계, 설계 기법 연결을 묻는다."
    >
      <Tabs tabs={[{ id: "kruskal", label: "크루스칼" }, { id: "prim", label: "프림" }, { id: "dijkstra", label: "데이크스트라" }]} value={mode} onChange={(next) => { setMode(next); setStep(0); }} />
      <TraceCard step={steps[clampStep(step, steps.length)]} />
      <StepControls step={step} total={steps.length} onStep={(next) => setStep(clampStep(next, steps.length))} />
    </UnitShell>
  );
}

function ShortestFlowLab() {
  const [mode, setMode] = useState<"bellman" | "floyd" | "flow">("bellman");
  const traces: Record<typeof mode, TraceStep[]> = {
    bellman: [
      { title: "모든 간선 완화", note: "|V|-1번 모든 간선을 검사하며 거리 값을 줄인다.", tags: ["음수 간선 허용"] },
      { title: "추가 완화 검산", note: "|V|번째에도 값이 줄면 음수 사이클을 의심한다.", tags: ["negative cycle"] },
    ],
    floyd: [
      { title: "경유 정점 k", note: "D[i][j]와 D[i][k]+D[k][j]를 비교한다.", table: [["D", "1", "2", "3"], ["1", "0", "4", "∞"], ["2", "∞", "0", "2"], ["3", "1", "∞", "0"]] },
      { title: "P[][] 경로 복원", note: "거리뿐 아니라 중간 경유 정점을 저장하면 최단 경로 자체를 복원할 수 있다.", tags: ["P[][]"] },
    ],
    flow: [
      { title: "잔여 네트워크", note: "현재 유량을 기준으로 더 보낼 수 있는 여유 용량을 계산한다.", tags: ["residual"] },
      { title: "증가 경로", note: "s에서 t까지 여유 용량이 양수인 경로를 찾고 병목값만큼 유량을 증가시킨다.", tags: ["bottleneck"] },
    ],
  };
  const [step, setStep] = useState(0);
  const steps = traces[mode];
  return (
    <UnitShell
      title="최단 경로 표와 유량 잔여량"
      subtitle="벨만-포드, 플로이드, 포드-풀커슨은 반복 갱신 표와 잔여 네트워크를 검산해야 한다."
      wrongRule="단일 출발점과 모든 정점 쌍 문제를 혼동하거나, 증가 경로의 여유량을 간선 용량 그대로 읽으면 틀린다."
      examPoint="벨만-포드 적용, 플로이드 D/P 행렬, 포드-풀커슨 증가 경로와 여유량을 묻는다."
    >
      <Tabs tabs={[{ id: "bellman", label: "벨만-포드" }, { id: "floyd", label: "플로이드" }, { id: "flow", label: "포드-풀커슨" }]} value={mode} onChange={(next) => { setMode(next); setStep(0); }} />
      <TraceCard step={steps[clampStep(step, steps.length)]} />
      <StepControls step={step} total={steps.length} onStep={(next) => setStep(clampStep(next, steps.length))} />
    </UnitShell>
  );
}

export function AlgorithmUnitLab({ lectureId }: { lectureId: number }) {
  if (lectureId === 1) return <AlgorithmDesignLab />;
  if (lectureId === 2) return <ComplexityLab />;
  if (lectureId === 3) return <ElementarySortLab />;
  if (lectureId === 4) return <PartitionMergeLab />;
  if (lectureId === 5) return <HeapLinearSortLab />;
  if (lectureId === 6) return <SearchTreeLab />;
  if (lectureId === 7) return <BalancedHashLab />;
  if (lectureId === 8) return <GraphTraversalLab />;
  if (lectureId === 9) return <GreedyGraphLab />;
  if (lectureId === 10) return <ShortestFlowLab />;
  return null;
}
