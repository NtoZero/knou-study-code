"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface LayerStep {
  num: number;
  name: string;
  eng: string;
  headerLabel: string | null;
  trailerLabel: string | null;
  pduName: string;
  pduAbbr: string;
  color: string;
  headerColor: string;
  note: string;
}

// Encapsulation order: Application → ... → Physical
const stepsTx: LayerStep[] = [
  {
    num: 7,
    name: "응용",
    eng: "Application",
    headerLabel: "AH",
    trailerLabel: null,
    pduName: "Application PDU",
    pduAbbr: "APDU",
    color: "bg-red-500",
    headerColor: "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100",
    note: "사용자 원본 데이터(DATA)에 응용 헤더(AH) 부착",
  },
  {
    num: 6,
    name: "표현",
    eng: "Presentation",
    headerLabel: "PH",
    trailerLabel: null,
    pduName: "Presentation PDU",
    pduAbbr: "PPDU",
    color: "bg-orange-500",
    headerColor: "bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100",
    note: "APDU를 SDU로 받아 표현 헤더(PH) 부착",
  },
  {
    num: 5,
    name: "세션",
    eng: "Session",
    headerLabel: "SH",
    trailerLabel: null,
    pduName: "Session PDU",
    pduAbbr: "SPDU",
    color: "bg-yellow-500",
    headerColor: "bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100",
    note: "PPDU를 SDU로 받아 세션 헤더(SH) 부착",
  },
  {
    num: 4,
    name: "전송",
    eng: "Transport",
    headerLabel: "TH",
    trailerLabel: null,
    pduName: "Transport PDU",
    pduAbbr: "TPDU",
    color: "bg-green-500",
    headerColor: "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100",
    note: "SPDU를 SDU로 받아 전송 헤더(TH) 부착",
  },
  {
    num: 3,
    name: "네트워크",
    eng: "Network",
    headerLabel: "NH",
    trailerLabel: null,
    pduName: "Network PDU",
    pduAbbr: "NPDU",
    color: "bg-teal-500",
    headerColor: "bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100",
    note: "TPDU를 SDU로 받아 네트워크 헤더(NH) 부착",
  },
  {
    num: 2,
    name: "데이터링크",
    eng: "Data Link",
    headerLabel: "LH",
    trailerLabel: "LT",
    pduName: "Data Link PDU",
    pduAbbr: "DLPDU",
    color: "bg-blue-500",
    headerColor: "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
    note: "NPDU에 링크 헤더(LH)와 트레일러(LT) 부착. 프레임 완성",
  },
  {
    num: 1,
    name: "물리",
    eng: "Physical",
    headerLabel: null,
    trailerLabel: null,
    pduName: "Bits",
    pduAbbr: "BIT",
    color: "bg-purple-500",
    headerColor: "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100",
    note: "DLPDU를 비트 스트림으로 전송. 헤더/트레일러 추가 없음",
  },
];

export default function EncapsulationAnimator() {
  // step 0 = initial (DATA only at app layer before AH)
  // step 1..7 = encapsulation at layer (7..1)
  // step 8..13 = decapsulation on receiving side (layer 2..7, physical excluded)
  // step 14 = done
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const TOTAL = 14;

  useEffect(() => {
    if (!playing) return;
    if (step >= TOTAL) {
      setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step]);

  const txProgress = Math.min(step, 7); // how many tx layers processed
  const rxProgress = Math.max(0, step - 7); // how many rx layers (decap) processed

  const txSegments = useMemo(() => {
    // Build segments array up to current tx step
    const segs: { label: string; cls: string }[] = [{ label: "DATA", cls: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200" }];
    for (let i = 0; i < txProgress; i++) {
      const s = stepsTx[i];
      if (s.headerLabel) segs.unshift({ label: s.headerLabel, cls: s.headerColor });
      if (s.trailerLabel) segs.push({ label: s.trailerLabel, cls: s.headerColor });
    }
    return segs;
  }, [txProgress]);

  const rxSegments = useMemo(() => {
    // Receive side starts with full frame after tx complete, then strips headers going up
    // At rxProgress=0 (step==7): full frame
    // At rxProgress=1 (step==8): link layer stripped
    if (step < 7) return [];
    const full = [...txSegments];
    // Strip in reverse order of tx: L2 first, then L3, L4, L5, L6, L7
    const stripOrder = [2, 3, 4, 5, 6, 7]; // layer numbers
    const stripped = rxProgress; // 0..6
    const result = [...full];
    for (let i = 0; i < stripped; i++) {
      const layerNum = stripOrder[i];
      const layer = stepsTx.find((s) => s.num === layerNum)!;
      if (layer.headerLabel) {
        const idx = result.findIndex((x) => x.label === layer.headerLabel);
        if (idx >= 0) result.splice(idx, 1);
      }
      if (layer.trailerLabel) {
        const idx = result.findIndex((x) => x.label === layer.trailerLabel);
        if (idx >= 0) result.splice(idx, 1);
      }
    }
    return result;
  }, [step, txSegments, rxProgress]);

  const currentTxLayer = step > 0 && step <= 7 ? stepsTx[step - 1] : null;
  const currentRxLayer =
    step > 7 && step <= 13 ? stepsTx.find((s) => s.num === [2, 3, 4, 5, 6, 7][step - 8]) : null;

  const reset = () => {
    setPlaying(false);
    setStep(0);
  };

  return (
    <section>
      <SectionTitle
        title="캡슐화 / 역캡슐화 애니메이션"
        subtitle="응용 A → (송신 OSI 7계층) → 물리매체 → (수신 OSI 7계층) → 응용 B. 각 계층에서 SDU + PCI(헤더) → PDU가 만들어지는 과정을 단계별로 재생합니다."
      />

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPlaying(!playing)}
          className="flex items-center gap-1.5 rounded-lg bg-lime-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-lime-600"
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
          {playing ? "일시정지" : "재생"}
        </button>
        <button
          onClick={() => setStep((s) => Math.min(TOTAL, s + 1))}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-lime-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          <StepForward size={12} /> 다음 단계
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-lime-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          <RotateCcw size={12} /> 리셋
        </button>
        <span className="ml-auto text-xs text-gray-500">
          단계 {step} / {TOTAL}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-lime-500 transition-all duration-500"
          style={{ width: `${(step / TOTAL) * 100}%` }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Transmit (sender) */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              송신: 응용 A (캡슐화 ↓)
            </div>
            <span className="rounded-full bg-lime-100 px-2 py-0.5 text-[10px] font-semibold text-lime-700 dark:bg-lime-950 dark:text-lime-300">
              SDU + PCI → PDU
            </span>
          </div>
          <div className="space-y-1.5">
            {stepsTx.map((s, idx) => {
              const done = idx < txProgress;
              const active = idx === txProgress - 1 && step <= 7;
              return (
                <div
                  key={`tx-${s.num}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-all ${
                    active ? "ring-2 ring-lime-500" : ""
                  } ${done ? "opacity-100" : "opacity-40"}`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${s.color} text-[10px] font-bold text-white`}
                  >
                    L{s.num}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {s.name}{" "}
                      <span className="text-[10px] text-gray-400">({s.eng})</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500">{s.pduAbbr}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Receive (receiver) */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              수신: 응용 B (역캡슐화 ↑)
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              물리 제외 모든 계층
            </span>
          </div>
          <div className="space-y-1.5">
            {[...stepsTx].reverse().map((s) => {
              const stripOrder = [2, 3, 4, 5, 6, 7];
              const idxInStrip = stripOrder.indexOf(s.num);
              const done = idxInStrip >= 0 && idxInStrip < rxProgress;
              const active =
                idxInStrip >= 0 && idxInStrip === rxProgress - 1 && step > 7 && step <= 13;
              const reached = s.num === 1 && step >= 7; // physical first
              return (
                <div
                  key={`rx-${s.num}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-all ${
                    active ? "ring-2 ring-lime-500" : ""
                  } ${done || reached ? "opacity-100" : "opacity-40"}`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${s.color} text-[10px] font-bold text-white`}
                  >
                    L{s.num}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {s.name}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500">
                    {s.num === 1 ? "수신" : done ? "header removed" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PDU visualization */}
      <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
          {step === 0
            ? "초기: 응용 A 사용자 데이터"
            : step <= 7
              ? `송신측 L${8 - step} (${stepsTx[step - 1].name}) 캡슐화 중`
              : step <= 13
                ? `수신측 L${[2, 3, 4, 5, 6, 7][step - 8]} 역캡슐화 중`
                : "완료: 응용 B 데이터 복원"}
        </div>
        <div className="flex flex-wrap gap-1">
          <AnimatePresence initial={false}>
            {(step <= 7 ? txSegments : rxSegments).map((seg, i) => (
              <motion.div
                key={`${seg.label}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.25 }}
                className={`rounded px-3 py-2 font-mono text-xs font-semibold ${seg.cls}`}
              >
                {seg.label}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {(currentTxLayer || currentRxLayer) && (
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            <b>{currentTxLayer?.name ?? currentRxLayer?.name}</b> —{" "}
            {currentTxLayer
              ? currentTxLayer.note
              : `${currentRxLayer?.name} 계층에서 ${currentRxLayer?.headerLabel ?? ""}${
                  currentRxLayer?.trailerLabel ? `/${currentRxLayer.trailerLabel}` : ""
                } 제거`}
          </motion.div>
        )}
      </div>

      {/* Formula */}
      <div className="mt-4 rounded-lg border border-dashed border-lime-300 bg-lime-50/50 p-3 text-center text-xs dark:border-lime-800 dark:bg-lime-950/20">
        <span className="font-semibold text-lime-700 dark:text-lime-300">공식</span>{" "}
        <span className="font-mono text-gray-700 dark:text-gray-300">
          Service Data Unit (SDU) + Protocol Control Information (PCI) ⇒ Protocol Data Unit (PDU)
        </span>
      </div>
    </section>
  );
}
