"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { runAdaBoost1D, signOf, type Label } from "./ensembleCore";

const XS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const DEFAULT_T: Label[] = [1, 1, 1, -1, -1, -1, 1, 1, 1, -1];
const MAX_ROUNDS = 6;

const PHASES = [
  { key: "②-1·②-2", label: "가중 오분류율이 최소인 분류기 hᵢ" },
  { key: "②-3", label: "중요도 αᵢ 계산" },
  { key: "②-4", label: "데이터 가중치 수정" },
  { key: "③", label: "지금까지의 결합 f(x)" },
] as const;

const W = 460;
const X0 = 30;
const XW = 400;
const px = (x: number) => X0 + ((x + 0.5) / 10) * XW;

const sub = (n: number) => String(n).split("").map((d) => String.fromCharCode(8320 + Number(d))).join("");
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number) => String(n).split("").map((d) => SUP[Number(d)]).join("");
const fmt = (v: number, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : "∞");

/* 그림 8-3 곡선 */
const alphaOf = (e: number) => 0.5 * Math.log((1 - e) / e);
const GA = { x0: 34, y0: 150, w: 180, h: 130 };

export default function AdaBoostLab() {
  const [labels, setLabels] = useState<Label[]>(DEFAULT_T);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [epsProbe, setEpsProbe] = useState(0.3);

  const rounds = useMemo(() => runAdaBoost1D(XS, labels, MAX_ROUNDS), [labels]);
  const r = rounds[Math.min(round, rounds.length - 1)];
  const stopped = !Number.isFinite(r.alpha);

  const last = rounds.length - 1;

  const canAdvancePhase = phase < PHASES.length - 1 && !stopped;
  const next = () => {
    if (canAdvancePhase) setPhase(phase + 1);
    else if (round < last) {
      setRound(round + 1);
      setPhase(0);
    }
  };
  const prev = () => {
    if (phase > 0) setPhase((p) => p - 1);
    else if (round > 0) {
      setRound((v) => v - 1);
      setPhase(PHASES.length - 1);
    }
  };
  const finished = !canAdvancePhase && round >= last;

  useEffect(() => {
    if (!playing) return;
    if (finished) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => {
      if (canAdvancePhase) setPhase(phase + 1);
      else {
        setRound(round + 1);
        setPhase(0);
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [playing, finished, canAdvancePhase, phase, round]);

  const reset = () => {
    setRound(0);
    setPhase(0);
    setPlaying(false);
  };

  const flipLabel = (j: number) => {
    setLabels((prevL) => prevL.map((t, k) => (k === j ? ((-t) as Label) : t)));
    reset();
  };

  const showW = phase >= 2 && !stopped ? r.wNext : r.w;
  const maxW = Math.max(...r.w, ...r.wNext.filter(Number.isFinite));
  const wrong = r.pred.map((h, j) => h !== labels[j]);
  const combined = r.score.map((s) => signOf(s));

  const epsForGraph = phase >= 1 && !stopped ? r.eps : epsProbe;

  return (
    <section>
      <SectionTitle
        title="05. AdaBoost 알고리즘"
        subtitle="같은 데이터 집합, 데이터마다 적응적으로 바뀌는 가중치, 분류기 중요도를 가진 보팅"
      />

      {/* 알고리즘 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.3 부스팅 — AdaBoost에 의한 분류기 학습과 병합",
          slides: "AdaBoost에 의한 분류기의 학습과 분류 과정",
          lecture: "목표 출력값 tⱼ가 주어지므로 AdaBoost는 지도학습이며, tⱼ ∈ {−1, 1}이라 이진 분류 문제를 가정한다고 짚음",
        }}
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <div className="space-y-3 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            <p>
              <strong>①</strong> N개의 입출력 쌍으로 이루어진 학습 데이터 집합 X = {"{"}(xⱼ, tⱼ){"}"}
              <sub>j=1,…,N</sub>을 준비하고, 각 데이터에 대한 가중치 wⱼ를{" "}
              <span className="font-mono">wⱼ⁽¹⁾ = 1/N</span>로 초기화. 목표 출력값은 tⱼ ∈ {"{"}−1, 1{"}"}
              (이진 분류 문제로 가정).
            </p>
            <p>
              <strong>②</strong> i = 1, …, M에 대해 다음 과정을 수행.
            </p>
            <div className="space-y-2 border-l-2 border-amber-300 pl-4 dark:border-amber-700">
              <p className={phase === 0 ? "rounded bg-white/80 px-2 py-1 dark:bg-gray-900/70" : ""}>
                <strong>②-1.</strong> 가중치가 적용된 오분류율{" "}
                <span className="font-mono">εᵢ = Σⱼ wⱼ⁽ⁱ⁾ I(hᵢ(xⱼ) ≠ tⱼ)</span> — I(·)는 hᵢ(xⱼ) ≠ tⱼ일
                때만 1, 아니면 0.
                <br />
                <strong>②-2.</strong> 오분류율 εᵢ를 최소화하는 분류기 hᵢ(x)를 학습을 통해 얻음.
              </p>
              <p className={phase === 1 ? "rounded bg-white/80 px-2 py-1 dark:bg-gray-900/70" : ""}>
                <strong>②-3.</strong> 각 분류기 hᵢ(x)의 중요도{" "}
                <span className="font-mono">αᵢ = ½ ln{"{"}(1 − εᵢ) / εᵢ{"}"}</span>
              </p>
              <p className={phase === 2 ? "rounded bg-white/80 px-2 py-1 dark:bg-gray-900/70" : ""}>
                <strong>②-4.</strong> 가중치 수정{" "}
                <span className="font-mono">wⱼ⁽ⁱ⁺¹⁾ = wⱼ⁽ⁱ⁾ exp{"{"}−αᵢ tⱼ hᵢ(xⱼ){"}"} / Zᵢ</span>,{" "}
                <span className="font-mono">Zᵢ = Σⱼ wⱼ⁽ⁱ⁾ exp{"{"}−αᵢ tⱼ hᵢ(xⱼ){"}"}</span> — Zᵢ는
                가중치들의 합이 1이 되도록 정규화하기 위한 값.
              </p>
            </div>
            <p className={phase === 3 ? "rounded bg-white/80 px-2 py-1 dark:bg-gray-900/70" : ""}>
              <strong>③</strong> M개의 분류기가 모두 학습되면, 각 분류기의 중요도 값을 이용하여
              결합한 최종 판별함수{" "}
              <span className="font-mono">f_M(x) = sign(Σᵢ αᵢ hᵢ(x))</span>를 만듦.
            </p>
          </div>
        </div>
      </Sourced>

      {/* 단계별 실습 */}
      <Sourced
        className="mb-8"
        refs={{
          textbook: "8.3 부스팅 — AdaBoost 단계별 처리 과정",
          slides: "AdaBoost에 의한 분류기의 학습과 분류 과정",
        }}
      >
        <h3 className="mb-1 text-base font-bold">AdaBoost 단계별 계산 — 1차원 데이터 10개</h3>
        <p className="mb-3 text-sm text-gray-500">
          간단한 분류기 hᵢ로 한 점 θ를 기준으로 왼쪽과 오른쪽에 서로 다른 레이블을 주는
          가장 단순한 선형 분류기를 사용. ②-2는 가능한 모든 θ와 방향 가운데 εᵢ가 가장 작은 것을
          고르는 것으로 수행. 점을 누르면 레이블이 바뀌고 처음부터 다시 계산됨.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-amber-500 px-2.5 py-1 font-mono text-sm font-bold text-white">
              i = {r.i}
            </span>
            {PHASES.map((p, k) => (
              <button
                key={p.key}
                onClick={() => setPhase(k)}
                disabled={stopped && k > 0}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors disabled:opacity-40 ${
                  phase === k
                    ? "bg-amber-100 text-amber-900 ring-1 ring-amber-400 dark:bg-amber-900/40 dark:text-amber-100"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800"
                }`}
              >
                {p.key} {p.label}
              </button>
            ))}
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              onClick={prev}
              disabled={round === 0 && phase === 0}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300"
            >
              <ChevronLeft size={14} /> 이전
            </button>
            <button
              onClick={next}
              disabled={finished}
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600 disabled:opacity-40"
            >
              다음 <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setPlaying((v) => !v)}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "멈춤" : "자동 진행"}
            </button>
            <button
              onClick={() => {
                setLabels(DEFAULT_T);
                reset();
              }}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              <RotateCcw size={14} /> 처음 데이터로
            </button>
          </div>

          {/* 수직선 */}
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${W} 170`} className="w-full min-w-[400px]">
              {/* 그루터기 판정 영역 */}
              {phase < 3 && (
                <>
                  <rect
                    x={X0}
                    y={10}
                    width={Math.max(0, px(r.stump.theta) - X0)}
                    height={80}
                    fill={r.stump.s === 1 ? "#fef3c7" : "#e0f2fe"}
                  />
                  <rect
                    x={px(r.stump.theta)}
                    y={10}
                    width={Math.max(0, X0 + XW - px(r.stump.theta))}
                    height={80}
                    fill={r.stump.s === 1 ? "#e0f2fe" : "#fef3c7"}
                  />
                  <line x1={px(r.stump.theta)} y1={6} x2={px(r.stump.theta)} y2={94} stroke="#b45309" strokeWidth="2" />
                  <text x={px(r.stump.theta)} y={104} fontSize="10" textAnchor="middle" fill="#b45309" fontWeight="bold">
                    θ = {r.stump.theta}
                  </text>
                </>
              )}
              {phase === 3 &&
                XS.map((x, j) => (
                  <rect
                    key={j}
                    x={px(x) - XW / 20}
                    y={10}
                    width={XW / 10}
                    height={80}
                    fill={combined[j] === 1 ? "#fef3c7" : "#e0f2fe"}
                  />
                ))}
              <line x1={X0} y1={50} x2={X0 + XW} y2={50} stroke="#94a3b8" />
              {XS.map((x, j) => {
                const rad = 4 + 30 * Math.sqrt(showW[j] / Math.max(maxW, 1e-9)) * 0.45;
                const isWrong = phase === 3 ? combined[j] !== labels[j] : wrong[j];
                return (
                  <g key={j} onClick={() => flipLabel(j)} className="cursor-pointer">
                    {isWrong && (
                      <motion.circle
                        cx={px(x)}
                        cy={50}
                        initial={false}
                        animate={{ r: rad + 4 }}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeDasharray="3 2"
                      />
                    )}
                    <motion.circle
                      cx={px(x)}
                      cy={50}
                      initial={false}
                      animate={{ r: rad }}
                      transition={{ duration: 0.5 }}
                      fill={labels[j] === 1 ? "#d97706" : "#ffffff"}
                      stroke={labels[j] === 1 ? "#92400e" : "#0284c7"}
                      strokeWidth="2"
                    />
                    <text x={px(x)} y={54} fontSize="10" textAnchor="middle" fontWeight="bold" fill={labels[j] === 1 ? "#fff" : "#0369a1"}>
                      {labels[j] === 1 ? "+" : "−"}
                    </text>
                    <text x={px(x)} y={122} fontSize="10" textAnchor="middle" fill="#64748b">
                      x={x}
                    </text>
                    {/* 가중치 막대 */}
                    <motion.rect
                      x={px(x) - 9}
                      width={18}
                      initial={false}
                      animate={{ y: 165 - (showW[j] / Math.max(maxW, 1e-9)) * 35, height: (showW[j] / Math.max(maxW, 1e-9)) * 35 }}
                      transition={{ duration: 0.5 }}
                      fill={phase >= 2 && !stopped ? (r.factor[j] > 1 ? "#dc2626" : "#16a34a") : "#f59e0b"}
                      opacity={0.75}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            원의 크기와 아래 막대 = {phase >= 2 && !stopped ? `수정된 가중치 w⁽${sup(r.i + 1)}⁾` : `이번 분류기가 쓰는 가중치 w⁽${sup(r.i)}⁾`}. 붉은 점선 원 ={" "}
            {phase === 3 ? "결합 f가 틀린 데이터" : "hᵢ가 틀린 데이터"}.{" "}
            {phase < 3
              ? `hᵢ(x) = ${r.stump.s === 1 ? "+1" : "−1"} (x < θ), ${r.stump.s === 1 ? "−1" : "+1"} (x > θ)`
              : "배경 = 지금까지 결합한 f(x)의 판정"}
          </p>

          {/* 단계별 계산 카드 */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className={`rounded-lg p-3 ${phase === 0 ? "bg-amber-50 ring-1 ring-amber-300 dark:bg-amber-950/40" : "bg-gray-50 dark:bg-gray-800/60"}`}>
              <p className="text-[11px] font-bold text-gray-500">②-1 가중 오분류율</p>
              <p className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">
                ε{sub(r.i)} ={" "}
                {wrong.some(Boolean)
                  ? XS.filter((_, j) => wrong[j]).map((x) => `w(x=${x})`).join(" + ")
                  : "0"}
              </p>
              <p className="mt-1 font-mono text-lg font-bold">{fmt(r.eps)}</p>
            </div>
            <div className={`rounded-lg p-3 ${phase === 1 ? "bg-amber-50 ring-1 ring-amber-300 dark:bg-amber-950/40" : "bg-gray-50 dark:bg-gray-800/60"}`}>
              <p className="text-[11px] font-bold text-gray-500">②-3 중요도</p>
              {stopped ? (
                <p className="mt-1 text-xs text-red-600">
                  εᵢ = 0 → αᵢ가 무한대. 학습 데이터를 모두 맞히는 분류기가 나와 여기서 멈춤.
                </p>
              ) : (
                <>
                  <p className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">
                    α{sub(r.i)} = ½ ln({fmt(1 - r.eps)} / {fmt(r.eps)})
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold">{fmt(r.alpha)}</p>
                </>
              )}
            </div>
            <div className={`rounded-lg p-3 ${phase === 2 ? "bg-amber-50 ring-1 ring-amber-300 dark:bg-amber-950/40" : "bg-gray-50 dark:bg-gray-800/60"}`}>
              <p className="text-[11px] font-bold text-gray-500">②-4 가중치 수정 배수</p>
              {!stopped && (
                <p className="mt-1 font-mono text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  맞힌 데이터 × e<sup>−α</sup> = {fmt(Math.exp(-r.alpha))}
                  <br />
                  틀린 데이터 × e<sup>α</sup> = {fmt(Math.exp(r.alpha))}
                  <br />Z{sub(r.i)} = {fmt(r.Z)}
                </p>
              )}
            </div>
          </div>

          {/* 표 */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-xs">
              <thead>
                <tr className="text-gray-500">
                  {["j", "xⱼ", "tⱼ", `wⱼ⁽${sup(r.i)}⁾`, `h${sub(r.i)}(xⱼ)`, "tⱼhᵢ(xⱼ)", "exp{−αᵢtⱼhᵢ}", `wⱼ⁽${sup(r.i + 1)}⁾`, "Σαₖhₖ", "f(xⱼ)"].map((h) => (
                    <th key={h} className="border-b border-gray-200 p-1.5 text-right font-semibold dark:border-gray-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono">
                {XS.map((x, j) => (
                  <tr key={j} className={wrong[j] ? "bg-red-50/70 dark:bg-red-950/20" : ""}>
                    <td className="border-b border-gray-100 p-1.5 text-right dark:border-gray-800">{j + 1}</td>
                    <td className="border-b border-gray-100 p-1.5 text-right dark:border-gray-800">{x}</td>
                    <td className="border-b border-gray-100 p-1.5 text-right dark:border-gray-800">{labels[j] === 1 ? "+1" : "−1"}</td>
                    <td className="border-b border-gray-100 p-1.5 text-right dark:border-gray-800">{fmt(r.w[j])}</td>
                    <td className="border-b border-gray-100 p-1.5 text-right dark:border-gray-800">{r.pred[j] === 1 ? "+1" : "−1"}</td>
                    <td className={`border-b border-gray-100 p-1.5 text-right dark:border-gray-800 ${wrong[j] ? "font-bold text-red-600" : "text-emerald-600"}`}>
                      {labels[j] * r.pred[j] === 1 ? "+1" : "−1"}
                    </td>
                    <td className={`border-b border-gray-100 p-1.5 text-right dark:border-gray-800 ${phase >= 2 ? "" : "text-gray-300 dark:text-gray-600"}`}>
                      {stopped ? "—" : fmt(r.factor[j])}
                    </td>
                    <td className={`border-b border-gray-100 p-1.5 text-right dark:border-gray-800 ${phase >= 2 ? "font-bold" : "text-gray-300 dark:text-gray-600"}`}>
                      {stopped ? "—" : fmt(r.wNext[j])}
                    </td>
                    <td className={`border-b border-gray-100 p-1.5 text-right dark:border-gray-800 ${phase >= 3 ? "" : "text-gray-300 dark:text-gray-600"}`}>
                      {stopped ? "—" : fmt(r.score[j], 3)}
                    </td>
                    <td
                      className={`border-b border-gray-100 p-1.5 text-right dark:border-gray-800 ${
                        phase >= 3 ? (combined[j] !== labels[j] ? "font-bold text-red-600" : "") : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      {combined[j] === 1 ? "+1" : "−1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {rounds.map((rr) => (
              <button
                key={rr.i}
                onClick={() => {
                  setRound(rr.i - 1);
                  setPhase(Number.isFinite(rr.alpha) ? 3 : 0);
                }}
                className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] ${
                  rr.i === r.i ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                i={rr.i} · ε={fmt(rr.eps, 3)} · α={fmt(rr.alpha, 3)}
                <br />
                <span className="text-gray-500">결합 f 학습 오류 {rr.combinedErrors}/10</span>
              </button>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
            처음 데이터에서 각 단계 결과 — i=1: ε = 0.3, α ≈ 0.4236 · i=2: ε ≈ 0.2143, α ≈ 0.6496 ·
            i=3: ε ≈ 0.1818, α ≈ 0.7520. h₁·h₂·h₃는 각각 3개·3개·4개를 틀리는 분류기지만 세 개를 α로 가중
            결합한 f₃는 학습 데이터 10개를 모두 맞힘. 틀린 데이터는 다음 단계에서 가중치가
            커지므로, 다음 분류기는 그 데이터를 맞히는 쪽으로 선택됨 — 이전 학습기의 결점을
            보완하는 방향.
          </p>
        </div>
      </Sourced>

      {/* 그림 8-3 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.3 부스팅 — 그림 8-3 오분류율에 따른 결합중요도와 비례상수",
          slides: "AdaBoost 알고리즘 — ②-3 결합 중요도 αᵢ, ②-4 가중치 수정 비례상수",
          lecture: "오분류율 0.5는 둘 중 하나를 찍는 랜덤 분류기이고, 오분류율이 낮을수록 틀린 데이터의 가중치가 급격히 커진다고 그래프로 설명함",
        }}
      >
        <h3 className="mb-1 text-base font-bold">오분류율에 따른 αᵢ와 가중치 수정 비례상수</h3>
        <p className="mb-3 text-sm text-gray-500">
          {phase >= 1 && !stopped
            ? `위 실습의 현재 ε${sub(r.i)} = ${fmt(r.eps, 3)} 위치를 표시. 실습을 ②-1 단계로 두면 슬라이더로 직접 움직일 수 있음.`
            : "슬라이더로 εᵢ를 움직여 보기."}
        </p>
        {(phase < 1 || stopped) && (
          <label className="mb-3 flex items-center gap-2 text-sm">
            <span className="font-semibold">εᵢ</span>
            <input
              type="range"
              min={0.02}
              max={0.98}
              step={0.01}
              value={epsProbe}
              onChange={(e) => setEpsProbe(Number(e.target.value))}
              className="w-48 accent-amber-500"
            />
            <span className="font-mono font-bold">{epsProbe.toFixed(2)}</span>
          </label>
        )}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AlphaGraph eps={epsForGraph} />
          <FactorGraph eps={epsForGraph} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 text-xs leading-relaxed text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            <p className="mb-1 text-sm font-bold">αᵢ — εᵢ가 작을수록 큰 값</p>
            오분류율이 0.5보다 작을 때(랜덤한 분류기보다 분류 성능이 높을 때) 양의 값, 그렇지
            못하면 음의 값. 오분류율이 작은 분류기가 더 큰 중요도를 갖도록 정의되어 최종
            판별함수에서 분류기의 결합중요도로 사용됨.
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 text-xs leading-relaxed text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            <p className="mb-1 text-sm font-bold">exp{"{"}−αᵢtⱼhᵢ(xⱼ){"}"}</p>
            hᵢ(xⱼ) = tⱼ (tⱼhᵢ(xⱼ) &gt; 0, 바른 출력) → exp(−αᵢ) &lt; 1, 가중치 감소. hᵢ(xⱼ) ≠ tⱼ
            (tⱼhᵢ(xⱼ) &lt; 0) → exp(αᵢ) &gt; 1, 가중치 증가. 오분류율이 0.5에 가까우면 변화폭이
            크지 않지만, 오분류율이 작아질수록 분류에 성공하지 못한 일부 데이터의 가중치 증가
            폭이 급격히 커짐.
          </div>
        </div>
      </Sourced>

      {/* 결합 방법 + 정리 */}
      <Sourced
        className="mb-4"
        refs={{
          textbook: "8.3 부스팅 — 그림 8-4 부스팅에 의한 결합 방법",
          slides: "AdaBoost 알고리즘의 결합 방법",
        }}
      >
        <h3 className="mb-3 text-base font-bold">AdaBoost 알고리즘의 결합 방법</h3>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <div className="flex min-w-[440px] items-center gap-3 text-xs">
              <span className="rounded-lg bg-gray-100 px-3 py-2 font-bold dark:bg-gray-800">입력 x</span>
              <div className="flex flex-col gap-1">
                {(rounds.filter((rr) => Number.isFinite(rr.alpha)).slice(0, 3)).map((rr) => (
                  <span key={rr.i} className="flex items-center gap-2 font-mono">
                    <span className="rounded border border-amber-300 px-2 py-0.5 dark:border-amber-700">h{sub(rr.i)}(x)</span>
                    <span className="text-amber-600">× α{sub(rr.i)} = {rr.alpha.toFixed(3)}</span>
                  </span>
                ))}
                <span className="font-mono text-gray-400">⋮</span>
              </div>
              <span className="rounded-lg bg-amber-500 px-3 py-2 font-mono font-bold text-white">Σ αᵢhᵢ(x)</span>
              <span className="rounded-lg bg-gray-100 px-3 py-2 font-bold dark:bg-gray-800">출력 y</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            단순한 보팅법에 가중치(분류기의 중요도 αᵢ)를 적용한 형태. 조정된 가중치로 각
            분류기를 단계적으로 학습해 분류기들의 차별성을 높이고, 최종 결합에서는 작은
            오분류율을 가진 분류기가 판단에 더 중요한 역할을 하도록 함.
          </p>
        </div>
      </Sourced>

      <Sourced
        className="mb-4"
        refs={{
          slides: "AdaBoost 알고리즘 — 정리",
        }}
      >
        <ul className="space-y-1.5 rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
          <li>· 이전 단계의 분류기의 학습 결과를 활용하여 다음 단계의 학습에 사용될 데이터에 가중치를 부여함으로써 분류기 간의 차별성 부여</li>
          <li>· 각각의 간단한 분류기의 오분류율이 0.5보다 작은 조건만 만족하면 분류기의 결합을 통해 학습 데이터에 대한 오차를 기하급수적으로 감소시킬 수 있음을 보임 (Freund & Schapire)</li>
          <li>· 최적화된 결합 가중치를 찾아 분류기들을 결합</li>
        </ul>
      </Sourced>

      <Sourced
        refs={{
          textbook: "8.3 부스팅 — AdaBoost와 다중 클래스 문제",
          slides: "AdaBoost 알고리즘 — 이진 분류 문제에 적합한 방법",
        }}
      >
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <strong>이진 분류 문제에 적합한 방법</strong> (10장 SVM과 마찬가지). 다중 클래스
          문제에 적용하려면 → 클래스별 판별함수를 만들어 사용하는 방법, 클래스 쌍에 대한
          판별함수를 만들어 사용하는 방법 등을 적용.
        </p>
      </Sourced>
    </section>
  );
}

function AlphaGraph({ eps }: { eps: number }) {
  const { x0, y0, w, h } = GA;
  const X = (e: number) => x0 + e * w;
  const Y = (a: number) => y0 - h / 2 - (a / 2.5) * (h / 2);
  const pts: string[] = [];
  for (let k = 1; k <= 99; k += 1) {
    const e = k / 100;
    pts.push(`${k === 1 ? "M" : "L"}${X(e).toFixed(1)},${Y(Math.max(-2.5, Math.min(2.5, alphaOf(e)))).toFixed(1)}`);
  }
  const a = alphaOf(eps);
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-1 text-xs font-bold text-gray-500">(a) αᵢ = ½ ln{"{"}(1−εᵢ)/εᵢ{"}"}</p>
      <svg viewBox="0 0 230 170" className="w-full">
        <line x1={x0} y1={Y(0)} x2={x0 + w} y2={Y(0)} stroke="#cbd5e1" />
        <line x1={x0} y1={y0 - h} x2={x0} y2={y0} stroke="#cbd5e1" />
        <line x1={X(0.5)} y1={y0 - h} x2={X(0.5)} y2={y0} stroke="#cbd5e1" strokeDasharray="2 2" />
        {[-2, -1, 0, 1, 2].map((v) => (
          <text key={v} x={x0 - 4} y={Y(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
            {v}
          </text>
        ))}
        {[0, 0.5, 1].map((v) => (
          <text key={v} x={X(v)} y={y0 + 11} fontSize="8" textAnchor="middle" fill="#94a3b8">
            {v}
          </text>
        ))}
        <text x={x0 + w} y={y0 + 11} fontSize="8" textAnchor="end" fill="#64748b">
          εᵢ
        </text>
        <path d={pts.join(" ")} fill="none" stroke="#d97706" strokeWidth="2" />
        <circle cx={X(eps)} cy={Y(Math.max(-2.5, Math.min(2.5, a)))} r={4} fill="#b45309" />
        <text x={X(eps) + 6} y={Y(Math.max(-2.5, Math.min(2.5, a))) - 5} fontSize="9" fill="#b45309" fontWeight="bold">
          α = {a.toFixed(3)}
        </text>
      </svg>
    </div>
  );
}

function FactorGraph({ eps }: { eps: number }) {
  const { x0, y0, w, h } = GA;
  const X = (e: number) => x0 + (e / 0.5) * w;
  const Y = (v: number) => y0 - (Math.min(v, 10) / 10) * h;
  const up: string[] = [];
  const down: string[] = [];
  for (let k = 5; k <= 50; k += 1) {
    const e = k / 100;
    const a = alphaOf(e);
    up.push(`${k === 5 ? "M" : "L"}${X(e).toFixed(1)},${Y(Math.exp(a)).toFixed(1)}`);
    down.push(`${k === 5 ? "M" : "L"}${X(e).toFixed(1)},${Y(Math.exp(-a)).toFixed(1)}`);
  }
  const inRange = eps <= 0.5;
  const a = alphaOf(eps);
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-1 text-xs font-bold text-gray-500">(b) exp{"{"}−αᵢtⱼhᵢ(xⱼ){"}"} (εᵢ ≤ 0.5 구간)</p>
      <svg viewBox="0 0 230 170" className="w-full">
        <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke="#cbd5e1" />
        <line x1={x0} y1={y0 - h} x2={x0} y2={y0} stroke="#cbd5e1" />
        <line x1={x0} y1={Y(1)} x2={x0 + w} y2={Y(1)} stroke="#cbd5e1" strokeDasharray="2 2" />
        {[0, 1, 5, 10].map((v) => (
          <text key={v} x={x0 - 4} y={Y(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
            {v}
          </text>
        ))}
        {[0.1, 0.3, 0.5].map((v) => (
          <text key={v} x={X(v)} y={y0 + 11} fontSize="8" textAnchor="middle" fill="#94a3b8">
            {v}
          </text>
        ))}
        <path d={up.join(" ")} fill="none" stroke="#dc2626" strokeWidth="2" />
        <path d={down.join(" ")} fill="none" stroke="#16a34a" strokeWidth="2" />
        <text x={X(0.12)} y={Y(8.5)} fontSize="8" fill="#dc2626">tⱼ ≠ hᵢ(xⱼ): exp(αᵢ)</text>
        <text x={X(0.2)} y={Y(0.35) - 4} fontSize="8" fill="#16a34a">tⱼ = hᵢ(xⱼ): exp(−αᵢ)</text>
        {inRange && eps >= 0.05 && (
          <>
            <circle cx={X(eps)} cy={Y(Math.exp(a))} r={3.5} fill="#dc2626" />
            <circle cx={X(eps)} cy={Y(Math.exp(-a))} r={3.5} fill="#16a34a" />
            <text x={X(eps) + 5} y={Y(Math.exp(a)) - 4} fontSize="8" fill="#dc2626" fontWeight="bold">
              {Math.exp(a).toFixed(2)}
            </text>
            <text x={X(eps) + 5} y={Y(Math.exp(-a)) + 10} fontSize="8" fill="#16a34a" fontWeight="bold">
              {Math.exp(-a).toFixed(2)}
            </text>
          </>
        )}
      </svg>
      {!inRange && <p className="text-[11px] text-gray-500">εᵢ &gt; 0.5 구간은 그림 밖.</p>}
    </div>
  );
}
