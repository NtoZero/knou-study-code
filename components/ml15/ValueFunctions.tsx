"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Chip,
  ComputedNote,
  ConceptRows,
  Formula,
  Hint,
  P,
  Scroller,
  Slider,
  fmtQ,
} from "./ui";

/**
 * 14.1.3 정책과 가치함수 — 정책, 수익 Gₜ, 상태/행동 가치함수, 최적 가치함수와 최적 정책,
 * 그리고 MDP에서 학습의 어려움.
 * 수익 계산에 쓰는 보상 시퀀스는 그림 14-9의 경로(1→2→3→7→11→10→14→15→16)에서 가져온다.
 */

const PATH = [1, 2, 3, 7, 11, 10, 14, 15, 16];
// 목표(16)에 도착하는 마지막 이동만 보상 1, 나머지 이동은 0
const PATH_REWARDS: number[] = PATH.slice(1).map((s) => (s === 16 ? 1 : 0));

type Sym = "pi" | "G" | "v" | "q" | "vstar" | "qstar" | "pistar";

const SYMS: {
  id: Sym;
  label: string;
  name: string;
  input: string;
  output: string;
  formula: string;
  body: string;
}[] = [
  {
    id: "pi",
    label: "π(a|s)",
    name: "정책 policy",
    input: "상태 s, 행동 a",
    output: "상태 s에서 행동 a를 고를 확률",
    formula: "π(a|s) = ℙ[Aₜ = a | Sₜ = s]",
    body: "상태 Sₜ와 행동 Aₜ의 시퀀스를 결정하는 함수적 규칙. 주어진 상태에 대한 행동의 조건부확률로 표기한다.",
  },
  {
    id: "G",
    label: "Gₜ",
    name: "수익 return, 이익(이득) gain",
    input: "시점 t 이후의 보상들",
    output: "총할인 보상 total discount reward",
    formula: "Gₜ = Rₜ₊₁ + γRₜ₊₂ + γ²Rₜ₊₃ + ⋯ = Σₖ₌₀^∞ γᵏ Rₜ₊ₖ₊₁",
    body: "‘좋은 정책’에 대한 평가 기준. 시점 t에서부터 얻어지는 보상에 대해 할인율 γ를 곱해서 더한 값이다.",
  },
  {
    id: "v",
    label: "v_π(s)",
    name: "상태 가치함수 state-value function",
    input: "상태 s (정책 π 아래에서)",
    output: "기대 보상(보상의 평균)",
    formula: "v_π(s) = E_π[Gₜ | Sₜ = s]",
    body: "상태 s에서 시작해서 정책 π에 따라 행동을 취하였을 때 얻을 수 있는 기대 보상.",
  },
  {
    id: "q",
    label: "q_π(s, a)",
    name: "행동 가치함수 action-value function",
    input: "상태 s, 행동 a (정책 π 아래에서)",
    output: "기대 보상",
    formula: "q_π(s, a) = E[Gₜ | Sₜ = s, Aₜ = a]",
    body: "정책 π에 따라 상태 s에서 행동 a를 선택하였을 때 얻을 수 있는 기대 보상. 이 함수를 흔히 Q-함수라고 한다.",
  },
  {
    id: "vstar",
    label: "v*(s)",
    name: "최적 상태 가치함수",
    input: "상태 s",
    output: "모든 정책 가운데 가장 큰 상태 가치",
    formula: "v*(s) = max_π v_π(s)",
    body: "가능한 모든 정책에 대해 최대값을 갖는 상태 가치함수.",
  },
  {
    id: "qstar",
    label: "q*(s, a)",
    name: "최적 행동 가치함수",
    input: "상태 s, 행동 a",
    output: "모든 정책 가운데 가장 큰 행동 가치",
    formula: "q*(s, a) = max_π q_π(s, a)",
    body: "가능한 모든 정책에 대해 최대값을 갖는 행동 가치함수.",
  },
  {
    id: "pistar",
    label: "π*(a|s)",
    name: "최적 정책 optimal policy",
    input: "상태 s",
    output: "q*(s, a)를 최대화하는 행동이면 1, 아니면 0",
    formula: "π*(a|s) = 1 if a = argmax_(a∈A) q*(s, a), 0 otherwise",
    body: "최종적인 누적 보상을 최대화하는 정책 π*: S ↦ A. 최적 행동 가치함수 q*(s, a)를 최대화하는 행동을 찾으면 된다.",
  },
];

// 그림 14-10(b) — 상태 11에서의 Q-값 (γ = 0.9)
const Q11: { a: string; v: number }[] = [
  { a: "R", v: 0 },
  { a: "L", v: 0.729 },
  { a: "U", v: 0 },
  { a: "D", v: 0.9 },
];

const HARD = [
  "에이전트는 상태와 보상에 관해 오직 지역적/부분적 정보만 관찰/이용 가능",
  "보상이 즉시 주어지기보다는 긴 시간 동안의 지연이 발생",
  "상태 전이와 보상이 비결정론적인 경우, 함수식으로 정해지지 않거나 알려지지 않은 경우도 존재",
  "상태공간과 정책공간이 너무 방대",
  "비효율적 학습",
];

export default function ValueFunctions() {
  const [sym, setSym] = useState<Sym>("v");
  const [gamma, setGamma] = useState(0.9);
  const [pick, setPick] = useState<string | null>(null);
  const s = SYMS.find((x) => x.id === sym)!;

  const weights = PATH_REWARDS.map((_, k) => gamma ** k);
  const G = PATH_REWARDS.reduce((acc, r, k) => acc + weights[k] * r, 0);
  const best = Q11.reduce((m, x) => (x.v > m.v ? x : m), Q11[0]);

  return (
    <section id="value-function" className="scroll-mt-32">
      <SectionTitle
        title="정책과 가치함수"
        subtitle="좋은 정책을 어떻게 평가하고, 그 평가로 최적 정책을 어떻게 찾는가"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.1.3 정책과 가치함수 — 식 14-1 ~ 14-3", slides: "정책과 가치함수 — 정책 π", lecture: "상태 1에서는 오른쪽과 아래로만 갈 수 있으니 확률이 각각 1/2이라는 예로, 상태–행동의 시퀀스를 만들어 내는 함수적 규칙이 정책이라고 정리" }}>
          <Card>
            <CardTitle>정책 π</CardTitle>
            <Formula note="(식 14-1) 상태–행동 쌍이 이어지고, 쌍 사이마다 보상이 붙는다">
              (S₀, A₀) —R₁→ (S₁, A₁) —R₂→ ⋯ → (Sₜ, Aₜ) —Rₜ₊₁→ (Sₜ₊₁, Aₜ₊₁) —Rₜ₊₂→ ⋯
            </Formula>
            <div className="mt-2">
              <Formula note="(식 14-2) 주어진 상태에 대한 행동의 조건부확률">
                π(a|s) = ℙ[Aₜ = a | Sₜ = s]
              </Formula>
            </div>
            <div className="mt-3">
              <ConceptRows
                rows={[
                  { k: "정의", v: "상태 Sₜ와 행동 Aₜ의 시퀀스를 결정하는 함수적 규칙." },
                  {
                    k: "직관",
                    v: "에이전트가 시점 t에서 해야 할 일은 현재 상태 Sₜ에 대해 행동 Aₜ를 결정하는 것이다. 그 결정 방식 전체를 함수로 적은 것이 정책이다.",
                  },
                  {
                    k: "예시",
                    v: "(식 14-3) 미로 찾기의 상태 1에서 동일한 확률로 행동을 고른다면, 오른쪽과 아래 방향으로만 이동할 수 있으므로 π(우|1) = ℙ[Aₜ = 우 | Sₜ = 1] = 1/2, π(하|1) = 1/2.",
                  },
                  {
                    k: "오답 기준",
                    v: "상태와 행동의 시퀀스를 결정하는 규칙을 묻는다면 답은 정책이다. 수익은 보상의 할인합이고, 행동 가치함수(Q-함수)는 상태–행동 쌍의 기대 보상이다.",
                  },
                ]}
              />
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.1.3 정책과 가치함수 — 식 14-4", slides: "정책과 가치함수 — ‘좋은 정책’에 대한 평가 기준", lecture: "γ가 0과 1 사이라 거듭제곱할수록 작아지므로, 바로 다음 보상이 가장 크게, 먼 보상일수록 작게 반영된다고 설명" }}>
          <Card>
            <CardTitle>수익 Gₜ — 멀리 있는 보상일수록 덜 쳐 준다</CardTitle>
            <Formula note="(식 14-4) 총할인 보상 total discount reward">
              Gₜ = Rₜ₊₁ + γRₜ₊₂ + γ²Rₜ₊₃ + ⋯ = Σₖ₌₀^∞ γᵏ Rₜ₊ₖ₊₁
            </Formula>
            <div className="mt-3">
              <P>
                4×4 미로에서 시작 1부터 목표 16까지 1 → 2 → 3 → 7 → 11 → 10 → 14 → 15 → 16으로 간
                경로를 보자. 8번 움직이는 동안 보상은 마지막 도착 때 1, 나머지는 0이다. γ를 바꾸면 각
                보상에 곱해지는 무게 γᵏ가 어떻게 바뀌는지 막대로 보인다.
              </P>
            </div>
            <div className="mt-3 max-w-sm">
              <Slider
                label="할인율 γ"
                value={gamma}
                min={0}
                max={1}
                step={0.05}
                onChange={setGamma}
                display={gamma.toFixed(2)}
              />
            </div>
            <Scroller>
              <div className="mt-3 flex min-w-[420px] items-end gap-1.5" style={{ height: 120 }}>
                {PATH_REWARDS.map((r, k) => (
                  <div key={k} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <span className="font-mono text-[9.5px] text-gray-500">{fmtQ(weights[k], 3)}</span>
                    <motion.div
                      className={`w-full rounded-t ${r > 0 ? "bg-cyan-600" : "bg-gray-300 dark:bg-gray-700"}`}
                      animate={{ height: Math.max(2, weights[k] * 80) }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="text-[9.5px] text-gray-500">
                      {PATH[k]}→{PATH[k + 1]}
                    </span>
                    <span className="font-mono text-[9.5px] font-bold text-gray-700 dark:text-gray-200">
                      R={r}
                    </span>
                  </div>
                ))}
              </div>
            </Scroller>
            <div className="mt-2 rounded-md bg-gray-50 p-2 font-mono text-[12px] text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
              G = 0 + γ·0 + ⋯ + γ⁶·0 + γ⁷·1 = {gamma.toFixed(2)}⁷ ={" "}
              <strong className="text-cyan-700 dark:text-cyan-300">{fmtQ(G, 4)}</strong>
            </div>
            <div className="mt-2">
              <ConceptRows
                rows={[
                  {
                    k: "직관",
                    v: "할인율 γ (0 ≤ γ ≤ 1)는 먼 미래의 보상보다 최근의 보상이 더 크게 반영되도록, 현재 시점에서 멀어질수록 보상을 할인하여 Gₜ에 대한 기여도를 낮춘다.",
                  },
                  {
                    k: "오답 기준",
                    v: "γ = 1이면 할인이 없어 몇 걸음 만에 도착하든 G = 1로 같아진다. 짧은 경로를 더 좋게 평가하려면 γ < 1이어야 한다 — 이 점은 뒤의 ‘더 좋은 경로에 대한 선택’에서 다시 쓰인다.",
                  },
                ]}
              />
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "14.1.3 정책과 가치함수 — 식 14-5 ~ 14-9",
            slides: "정책과 가치함수 — 가치함수 · 최적 가치함수와 최적 정책",
            lecture: "모든 정책을 평가하는 방법은 바둑처럼 정책공간이 방대하면 불가능하므로 상태·행동의 가치를 평가하는 함수를 쓴다고 하고, 최적 가치함수는 특정 정책과 무관하게 최대값을 갖는 함수로 해석",
          }}
        >
          <Card>
            <CardTitle>가치함수 — 무엇을 받아 무엇을 돌려주는가</CardTitle>
            <P>
              정책마다 품질을 하나하나 평가해 고르는 방법은 정책공간이 너무 방대해서 현실적으로 쓸 수
              없다. 그래서 상태와 행동의 가치를 평가하는 함수를 쓴다. 기호를 눌러 입력과 출력을
              확인하자.
            </P>
            <div className="my-3 flex flex-wrap gap-1.5">
              {SYMS.map((x) => (
                <Chip key={x.id} active={sym === x.id} onClick={() => setSym(x.id)}>
                  <span className="font-mono">{x.label}</span>
                </Chip>
              ))}
            </div>
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100">{s.name}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-800/60">
                  <p className="text-[10.5px] font-semibold text-gray-500">받는 것</p>
                  <p className="text-[12.5px] text-gray-700 dark:text-gray-200">{s.input}</p>
                </div>
                <div className="rounded-md bg-cyan-50 p-2 dark:bg-cyan-950/40">
                  <p className="text-[10.5px] font-semibold text-cyan-700 dark:text-cyan-300">돌려주는 것</p>
                  <p className="text-[12.5px] text-gray-700 dark:text-gray-200">{s.output}</p>
                </div>
              </div>
              <Formula>{s.formula}</Formula>
              <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{s.body}</p>
            </motion.div>
            <Hint>
              상태 가치함수와 행동 가치함수가 돌려주는 것은 둘 다 ‘정책에 따른 기대 보상’, 즉 누적
              보상의 기대치다. 다음 상태나 할인율, 최적 정책을 돌려주는 함수가 아니다. 둘의 차이는
              입력에 행동 a가 들어가느냐뿐이다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.1.3 정책과 가치함수 — 식 14-9", slides: "최적 가치함수와 최적 정책", lecture: "식으로는 간단해 보여도 실제 환경에서 Q*를 찾으려면 모든 정책을 조사해야 해서 쉽지 않고, 그래서 DQN이 등장해 주로 쓰인다고 연결" }}>
          <Card>
            <CardTitle>최적 정책은 q*(s, a)가 가장 큰 행동에 확률 1을 준다</CardTitle>
            <P>
              뒤의 Q-학습에서 구하게 될 상태 11의 값(γ = 0.9)을 미리 빌려 와 규칙만 적용해 보자.
              π*(a|11)이 1이 되는 행동을 고르라.
            </P>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Q11.map((x) => {
                const chosen = pick === x.a;
                const correct = x.a === best.a;
                return (
                  <button
                    key={x.a}
                    type="button"
                    onClick={() => setPick(x.a)}
                    className={`rounded-lg border p-2 text-center transition-colors ${
                      pick === null
                        ? "border-gray-200 hover:bg-cyan-50 dark:border-gray-700 dark:hover:bg-cyan-950/30"
                        : correct
                          ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
                          : chosen
                            ? "border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30"
                            : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="font-mono text-[12px] text-gray-500">Q̂(11, {x.a})</p>
                    <p className="font-mono text-[15px] font-bold text-gray-800 dark:text-gray-100">
                      {fmtQ(x.v)}
                    </p>
                    {pick !== null && (
                      <p className="mt-0.5 font-mono text-[11px] text-cyan-700 dark:text-cyan-300">
                        π* = {correct ? 1 : 0}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            {pick !== null && (
              <p
                className={`mt-2 flex items-center gap-1.5 text-[12.5px] ${
                  pick === best.a ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {pick === best.a ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {pick === best.a
                  ? "맞다. argmax가 D이므로 π*(D|11) = 1, 나머지 행동은 0이다."
                  : `Q̂(11, ${pick}) = ${fmtQ(Q11.find((x) => x.a === pick)!.v)}은 최대값이 아니다. 최대값 0.9를 주는 D에만 확률 1이 간다.`}
              </p>
            )}
            <div className="mt-3">
              <ComputedNote>
                이 네 값은 교재 그림 14-10(b)에서 Q-학습으로 추정한 Q̂ 값입니다. 진짜 q*(s, a)가 아니라
                추정값이지만, ‘가장 큰 값을 주는 행동에 1, 나머지에 0’이라는 (식 14-9)의 규칙을 연습하기
                위해 빌려 왔습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.1.3 정책과 가치함수 — 학습의 어려움", slides: "MDP에서 학습의 어려움", lecture: "미로 찾기에서 목표가 어디 있는지 전체적으로는 모르고 다음 상태로 가 봐야 알 수 있다는 예로 ‘지역적·부분적 정보’를 설명" }}>
          <Card>
            <CardTitle>MDP에서 학습의 어려움</CardTitle>
            <ol className="space-y-1.5">
              {HARD.map((h, i) => (
                <li key={h} className="flex gap-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {h}
                </li>
              ))}
            </ol>
            <p className="mt-3 rounded-lg bg-cyan-50 p-2.5 text-[12.5px] font-semibold text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200">
              → 심층 Q-학습 Deep Q-learning이 좋은 해결책으로 등장
            </p>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
