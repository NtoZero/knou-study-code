"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowDownToLine, Check } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, CalcRow, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { fmt, fmtWide } from "./rnnCore";

const CW = 440;
const CH = 170;
const PAD = { l: 42, r: 14, t: 14, b: 26 };
/** 세로축은 상용로그 — 10의 몇 제곱인지 */
const LOG_RANGE = 10;
const AXIS_LABEL: Record<number, string> = {
  10: "10¹⁰",
  5: "10⁵",
  0: "1",
  "-5": "10⁻⁵",
  "-10": "10⁻¹⁰",
};

const PRESETS = [
  { key: "vanish", label: "기울기 소멸", w: 0.9, dphi: 0.8 },
  { key: "keep", label: "거의 유지", w: 1.1, dphi: 0.9 },
  { key: "explode", label: "기울기 폭발", w: 1.5, dphi: 0.9 },
];

export default function GradientChainLab() {
  const [w, setW] = useState(0.9);
  const [dphi, setDphi] = useState(0.8);
  const [t, setT] = useState(20);
  const [clip, setClip] = useState(5);

  const factor = w * dphi;
  const series = useMemo(
    () => Array.from({ length: t }, (_, k) => factor ** k),
    [factor, t],
  );
  const value = series[t - 1];
  const wPow = w ** (t - 1);
  const phiPow = dphi ** (t - 1);

  /**
   * 교재가 가르는 기준은 최종 크기가 아니라 한 칸의 곱이다 —
   * "활성화 함수의 미분값이 1보다 작다면 … 기울기 소멸, 1보다 큰 값이라면 … 기울기 폭발".
   * 1 바로 근처만 ‘거의 유지’로 둔다.
   */
  const state = factor < 0.97 ? "vanish" : factor > 1.03 ? "explode" : "ok";

  const px = (k: number) => PAD.l + (k / Math.max(t - 1, 1)) * (CW - PAD.l - PAD.r);
  const py = (v: number) => {
    const l = Math.log10(Math.max(Math.abs(v), 1e-30));
    const clamped = Math.max(-LOG_RANGE, Math.min(LOG_RANGE, l));
    return CH - PAD.b - ((clamped + LOG_RANGE) / (2 * LOG_RANGE)) * (CH - PAD.t - PAD.b);
  };

  const clipped = Math.abs(value) > clip ? Math.sign(value) * clip : value;

  return (
    <section id="gradient-problem" className="scroll-mt-32">
      <SectionTitle
        title="RNN 학습의 문제 — 기울기 소멸과 기울기 폭발"
        subtitle="시각을 거슬러 가며 같은 값이 거듭 곱해지면 어떻게 되는지 직접 계산합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.2 — 식 12-14, 역방향으로 전달되는 기울기",
            slides: "RNN 학습의 문제 — 시점 i = t에서 i = 1까지 역전파되는 기울기",
          }}
        >
          <Card>
            <CardTitle>기울기는 곱의 형태로 계산된다</CardTitle>
            <Formula note="식 12-14 — w는 은닉층의 가중치로 W_hh에 해당하고, φ′은 활성화 함수의 미분값">
              ∂h_t/∂h₁ = ∏(k = 1 … t−1) w φ′(w h_(t−k)) = w^(t−1) ∏(k = 1 … t−1) φ′(w h_(t−k))
            </Formula>
            <p className="mt-2 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              연쇄법칙을 적용한 편미분식에서 보듯이 역방향으로 전달되는 기울기는{" "}
              <strong>가중치와 활성화 함수의 미분값이 연속해서 곱해지는 형태</strong>로 계산됩니다.
              따라서 역전파 단계에서 기울기는 기하급수적으로 커지거나 작아질 수 있습니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.2 — 기울기 소멸 · 기울기 폭발",
            slides: "RNN 학습의 문제 — 기울기 소멸 gradient vanishing / 기울기 폭발",
          }}
        >
          <Card>
            <CardTitle>곱해지는 값의 개수를 바꿔 보기</CardTitle>

            <div className="mb-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    setW(p.w);
                    setDphi(p.dphi);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    Math.abs(w - p.w) < 0.001 && Math.abs(dphi - p.dphi) < 0.001
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Slider
                label="가중치 w (= W_hh)"
                value={w}
                min={0.3}
                max={2}
                step={0.05}
                onChange={setW}
                display={fmt(w, 2)}
              />
              <Slider
                label="활성화 함수의 미분값 φ′"
                value={dphi}
                min={0.05}
                max={1}
                step={0.05}
                onChange={setDphi}
                display={fmt(dphi, 2)}
              />
              <Slider
                label="timestep t"
                value={t}
                min={2}
                max={40}
                step={1}
                onChange={setT}
                display={`${t}`}
              />
            </div>

            <div className="mt-4">
              <Scroller>
                <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full min-w-[400px]">
                  {[LOG_RANGE, LOG_RANGE / 2, 0, -LOG_RANGE / 2, -LOG_RANGE].map((l) => (
                    <g key={l}>
                      <line
                        x1={PAD.l}
                        y1={py(10 ** l)}
                        x2={CW - PAD.r}
                        y2={py(10 ** l)}
                        stroke={l === 0 ? "#9ca3af" : "#e5e7eb"}
                        strokeWidth={l === 0 ? 1.2 : 1}
                        strokeDasharray={l === 0 ? "" : "3 3"}
                      />
                      <text x={4} y={py(10 ** l) + 3} className="fill-gray-400 text-[9px]">
                        {AXIS_LABEL[l]}
                      </text>
                    </g>
                  ))}
                  <polyline
                    points={series.map((v, k) => `${px(k)},${py(v)}`).join(" ")}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={2.2}
                  />
                  {series.map((v, k) => (
                    <circle key={k} cx={px(k)} cy={py(v)} r={2} fill="#ef4444" />
                  ))}
                  <motion.circle
                    initial={false}
                    animate={{ cx: px(t - 1), cy: py(value) }}
                    r={5}
                    fill="#ef4444"
                    stroke="#fff"
                    strokeWidth={1.6}
                  />
                  <text x={PAD.l} y={CH - 8} className="fill-gray-400 text-[9px]">
                    곱해진 횟수 0
                  </text>
                  <text x={CW - PAD.r - 46} y={CH - 8} className="fill-gray-400 text-[9px]">
                    t − 1 = {t - 1}
                  </text>
                </svg>
              </Scroller>
              <p className="mt-1 text-center text-[10.5px] text-gray-400">
                세로축은 상용로그 눈금 — 한 칸 내려갈 때마다 값이 10배씩 작아집니다
              </p>
            </div>

            <div className="mt-3 space-y-1.5">
              <CalcRow label="한 칸 곱" expr="w × φ′" value={fmt(factor, 4)} />
              <CalcRow label="w^(t−1)" expr={`${fmt(w, 2)}^${t - 1}`} value={fmtWide(wPow)} />
              <CalcRow label="∏φ′" expr={`${fmt(dphi, 2)}^${t - 1}`} value={fmtWide(phiPow)} />
              <CalcRow
                label="∂h_t/∂h₁"
                expr={`(${fmt(factor, 4)})^${t - 1}`}
                value={fmtWide(value)}
                tone="accent"
              />
            </div>

            <div
              className={`mt-3 flex items-start gap-2 rounded-lg p-3 ${
                state === "vanish"
                  ? "bg-blue-50 dark:bg-blue-950/30"
                  : state === "explode"
                    ? "bg-red-50 dark:bg-red-950/30"
                    : "bg-green-50 dark:bg-green-950/30"
              }`}
            >
              {state === "vanish" ? (
                <ArrowDownToLine size={15} className="mt-0.5 shrink-0 text-blue-500" />
              ) : state === "explode" ? (
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-500" />
              ) : (
                <Check size={15} className="mt-0.5 shrink-0 text-green-600" />
              )}
              <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                {state === "vanish" && (
                  <>
                    <strong>기울기 소멸(gradient vanishing)</strong> — 활성화 함수의 미분값과
                    가중치의 곱이 1보다 작아 기울기가 기하급수적으로 작아지며, 결국 0에 가까워져서
                    기울기 조정의 기능을 상실합니다. 지금은 {t - 1}번 곱해져{" "}
                    <span className="font-mono font-bold">{fmtWide(value)}</span>까지
                    내려왔습니다 — timestep을 늘릴수록 더 빨리 0으로 갑니다.
                  </>
                )}
                {state === "explode" && (
                  <>
                    <strong>기울기 폭발(gradient explosion)</strong> — 한 칸의 곱이 1보다 커서
                    기울기가 기하급수적으로 커집니다. 지금은 {t - 1}번 곱해져{" "}
                    <span className="font-mono font-bold">{fmtWide(value)}</span>까지
                    올라왔습니다.
                  </>
                )}
                {state === "ok" && (
                  <>
                    한 칸의 곱이 1 근처여서 {t}시각을 거슬러도 기울기의 크기가 크게 달라지지
                    않습니다. 그러나 이 균형은 매우 좁은 구간에서만 유지됩니다 — 슬라이더를 조금만
                    움직여도 금방 한쪽으로 쏠립니다.
                  </>
                )}
              </p>
            </div>

            <div className="mt-3 space-y-2">
              <Hint>
                식 12-14를 보면 RNN에서 기울기 소멸 문제는 <strong>층의 개수가 아닌 곱해지는 값의
                개수</strong>, 즉 RNN의 계산에 참여하는 시점 1에서 t까지의 길이(이를 timestep t라고
                부름)에 영향을 받는다는 것을 알 수 있습니다.
              </Hint>
              <ComputedNote>
                계산의 편의를 위해 모든 시각에서 φ′의 값이 같다고 두고 (w·φ′)^(t−1)로 계산했습니다.
                w와 φ′의 구체적인 수치는 교재·강의록에 제시되어 있지 않으며, 이 페이지에서 조절할
                수 있도록 둔 값입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.2 — 기울기 클리핑(gradient clipping)",
            slides: "RNN 학습의 문제 — 기울기 클리핑으로 해결 가능",
          }}
        >
          <Card>
            <CardTitle>기울기 폭발은 기울기 클리핑으로</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              기울기 클리핑은 기울기가 일정한 값을 초과하지 않도록 그 크기를 제한하기 위해{" "}
              <strong>주어진 임계치보다 크면 그 값을 일정 범위에 있도록 조정</strong>하는
              방법입니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
              <Slider
                label="임계치"
                value={clip}
                min={0.5}
                max={20}
                step={0.5}
                onChange={setClip}
                display={fmt(clip, 1)}
              />
              <div className="space-y-1.5">
                <CalcRow label="원래 기울기" expr="위에서 계산한 ∂h_t/∂h₁" value={fmtWide(value)} />
                <CalcRow
                  label="클리핑 후"
                  expr={Math.abs(value) > clip ? `|기울기| > ${fmt(clip, 1)} → 임계치로 제한` : "임계치 이내 — 그대로 둠"}
                  value={fmtWide(clipped)}
                  tone="accent"
                />
              </div>
            </div>
            <div className="mt-3">
              <Hint>
                클리핑은 <strong>폭발만</strong> 막아 줍니다. 0으로 사그라든 기울기를 되살리지는
                못합니다. 기울기 소멸을 해결하려면 LSTM이나 GRU처럼 좀 더 정교한 형태의 뉴런(셀)이
                필요합니다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
