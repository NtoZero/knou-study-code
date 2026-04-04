"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SectionTitle from "@/components/common/SectionTitle";

type AnalogMode = "AM" | "FM" | "PM";
type DigitalMode = "ASK" | "FSK" | "PSK";

const analogInfo: Record<AnalogMode, { title: string; changed: string; desc: string; detail: string; application: string }> = {
  AM: {
    title: "진폭 변조 (Amplitude Modulation)",
    changed: "진폭 (Amplitude)",
    desc: "베이스밴드 신호의 순간 진폭에 비례하여 반송파 신호의 순간 진폭을 변화시키는 방법.",
    detail: "포락선(envelope)이 베이스밴드 신호와 형태가 같음. 복조 시 필터링(저주파 통과 필터링) 사용 — 베이스밴드 신호가 저주파이고 반송파가 고주파이면 저주파 통과 필터링으로 원래 신호를 복원.",
    application: "AM 라디오 방송 (530~1,700kHz 대역, 각 방송국 10kHz 보호대역으로 분리)",
  },
  FM: {
    title: "주파수 변조 (Frequency Modulation)",
    changed: "주파수 (Frequency)",
    desc: "반송파 진폭은 일정하게 유지한 채 베이스밴드 신호를 주파수 변화로 변환.",
    detail: "신호 크기가 클수록 주파수가 높아지고, 작을수록 낮아짐. AM보다 잡음에 강하지만 더 넓은 대역폭 필요.",
    application: "FM 라디오 방송 (88~108MHz). AM보다 고음질이지만 전파 도달 거리가 짧음",
  },
  PM: {
    title: "위상 변조 (Phase Modulation)",
    changed: "위상 (Phase)",
    desc: "반송파 진폭은 일정하게 유지한 채 베이스밴드 신호를 주파수 위상각의 변화로 변환.",
    detail: "FM과 유사하지만 신호 크기가 위상각 변화에 비례. FM은 주파수 자체를 변화, PM은 위상(시작점)을 변화시킴.",
    application: "디지털 변조(PSK)의 기초가 되는 기술. 위성 통신 등에 활용",
  },
};

const digitalInfo: Record<DigitalMode, { title: string; desc: string; detail: string; noise: string; efficiency: string; application: string }> = {
  ASK: {
    title: "진폭편이 변조 (Amplitude Shift Keying)",
    desc: "0과 1의 두 가지 상태를 서로 다른 진폭으로 표현.",
    detail: "OOK(On-Off Keying) 방식 — 비트 1이면 반송파 신호를 흐르게, 0이면 흐르지 않게 함.",
    noise: "잡음에 가장 취약 — 진폭 변화가 잡음에 의한 왜곡과 동일한 형태이므로 오류율이 높음",
    efficiency: "대역폭 효율이 낮지만 구현이 가장 단순",
    application: "광섬유를 이용한 디지털 전송, 무선통신 시스템",
  },
  FSK: {
    title: "주파수편이 변조 (Frequency Shift Keying)",
    desc: "0과 1을 서로 다른 주파수를 이용하여 표현.",
    detail: "비트 1 → 1,180Hz, 비트 0 → 980Hz 등 2개의 반송파 신호를 사용. 수신기는 주파수 차이로 비트를 판별.",
    noise: "ASK보다 잡음에 강함 — 진폭 변화에 영향을 받지 않으므로 잡음이 진폭에만 작용할 경우 무시 가능",
    efficiency: "2개의 반송파 필요 → 전송률은 ASK의 절반. 대역폭 효율 낮음",
    application: "저속 모뎀, 무전기. 잡음 심한 환경에서 ASK 대신 사용",
  },
  PSK: {
    title: "위상편이 변조 (Phase Shift Keying)",
    desc: "정현파 한 주기로 하나의 비트를 표현. 0과 1을 위상 변화로 표현.",
    detail: "비트 0 → 위상 0도, 비트 1 → 위상 180도. 2주기 이상의 정현파를 사용하면 높은 전송률 달성 가능 (예: QPSK = 2비트/심볼).",
    noise: "3가지 중 잡음에 가장 강함 — 위상 변화만 감지하므로 진폭·주파수 잡음에 영향을 덜 받음",
    efficiency: "가장 높은 대역폭 효율. BER(비트 오류율) 성능 최우수",
    application: "WiFi, LTE, 위성 통신 등 현대 디지털 통신의 기본. 디지털 변조에서 가장 중요한 변수는 BER(Bit Error Rate)",
  },
};

function drawAnalog(ctx: CanvasRenderingContext2D, w: number, h: number, mode: AnalogMode) {
  ctx.clearRect(0, 0, w, h);
  const third = h / 3;
  ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 1.5; ctx.beginPath();
  for (let x = 0; x < w; x++) { const y = third / 2 + 20 * Math.sin((x / w) * Math.PI * 2); x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke(); ctx.fillStyle = "#6b7280"; ctx.font = "11px sans-serif"; ctx.fillText("베이스밴드 신호", 4, 14);
  ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2; ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const t = x / w; const baseband = Math.sin(t * Math.PI * 2); let y: number;
    if (mode === "AM") y = third * 2 + (20 + 15 * baseband) * Math.sin(t * Math.PI * 20);
    else if (mode === "FM") y = third * 2 + 20 * Math.sin(t * Math.PI * 20 + 5 * baseband);
    else y = third * 2 + 20 * Math.sin(t * Math.PI * 20 + Math.PI * baseband);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke(); ctx.fillStyle = "#3b82f6"; ctx.fillText(`변조 신호 (${mode})`, 4, third * 2 - 30);
}

function drawDigital(ctx: CanvasRenderingContext2D, w: number, h: number, mode: DigitalMode, bits: number[]) {
  ctx.clearRect(0, 0, w, h); const bitW = w / bits.length; const mid = h / 2;
  ctx.fillStyle = "#6b7280"; ctx.font = "12px monospace";
  bits.forEach((b, i) => {
    ctx.fillText(String(b), i * bitW + bitW / 2 - 4, 18);
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(i * bitW, 24); ctx.lineTo(i * bitW, h); ctx.stroke();
  });
  ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 1.5; ctx.beginPath();
  bits.forEach((b, i) => { const x1 = i * bitW; const x2 = (i + 1) * bitW; const y = b === 1 ? 35 : 55; if (i === 0) ctx.moveTo(x1, y); else ctx.lineTo(x1, y); ctx.lineTo(x2, y); });
  ctx.stroke();
  ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2; ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const bitIdx = Math.min(Math.floor(x / bitW), bits.length - 1); const b = bits[bitIdx]; const t = x / bitW; let y: number;
    if (mode === "ASK") y = mid + 30 + (b === 1 ? 25 : 0) * Math.sin(t * Math.PI * 6);
    else if (mode === "FSK") y = mid + 30 + 25 * Math.sin(t * Math.PI * (b === 1 ? 10 : 5));
    else y = mid + 30 + 25 * Math.sin(t * Math.PI * 6 + (b === 1 ? Math.PI : 0));
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke(); ctx.fillStyle = "#3b82f6"; ctx.fillText(`${mode} 변조 출력`, 4, mid + 10);
}

export default function ModulationVisualizer() {
  const [tab, setTab] = useState<"analog" | "digital">("analog");
  const [analogMode, setAnalogMode] = useState<AnalogMode>("AM");
  const [digitalMode, setDigitalMode] = useState<DigitalMode>("ASK");
  const [bits, setBits] = useState([1, 0, 1, 1, 0, 0, 1, 0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    if (tab === "analog") drawAnalog(ctx, canvas.width, canvas.height, analogMode);
    else drawDigital(ctx, canvas.width, canvas.height, digitalMode, bits);
  }, [tab, analogMode, digitalMode, bits]);

  useEffect(() => { draw(); }, [draw]);

  const toggleBit = (i: number) => setBits((prev) => prev.map((b, idx) => (idx === i ? 1 - b : b)));

  const aInfo = analogInfo[analogMode];
  const dInfo = digitalInfo[digitalMode];

  return (
    <section>
      <SectionTitle title="변조 / 복조"
        subtitle="변조: 베이스밴드 신호를 반송파 신호에 싣는 과정. 복조: 변조된 신호에서 원래 신호를 복원. 변조의 목적: ①전송매체 특성에 맞는 형태 변환, ②주파수분할 다중화(FDM) 통한 동시 전송" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex gap-2">
          <button onClick={() => setTab("analog")} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "analog" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>아날로그 변조 (AM/FM/PM)</button>
          <button onClick={() => setTab("digital")} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "digital" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>디지털 변조 (ASK/FSK/PSK)</button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {tab === "analog"
            ? (["AM", "FM", "PM"] as AnalogMode[]).map((m) => (
                <button key={m} onClick={() => setAnalogMode(m)} className={`rounded px-3 py-1 text-sm ${analogMode === m ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                  {analogInfo[m].title.split("(")[0].trim()}
                </button>))
            : (["ASK", "FSK", "PSK"] as DigitalMode[]).map((m) => (
                <button key={m} onClick={() => setDigitalMode(m)} className={`rounded px-3 py-1 text-sm ${digitalMode === m ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                  {digitalInfo[m].title.split("(")[0].trim()}
                </button>))}
        </div>

        {tab === "digital" && (
          <div className="mb-4 flex items-center gap-1">
            <span className="mr-2 text-xs text-gray-500">입력 비트 (클릭 전환):</span>
            {bits.map((b, i) => (
              <button key={i} onClick={() => toggleBit(i)} className={`h-8 w-8 rounded text-sm font-mono font-bold ${b === 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>{b}</button>
            ))}
          </div>
        )}

        <canvas ref={canvasRef} width={640} height={240} className="w-full rounded-lg border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950" />

        {/* Context-sensitive explanation */}
        {tab === "analog" ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-emerald-50 p-4 text-sm dark:bg-emerald-900/20">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-300">{aInfo.title}</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400"><strong>변화 요소:</strong> {aInfo.changed}</p>
              <p className="mt-1 text-gray-600 dark:text-gray-400">{aInfo.desc}</p>
              <p className="mt-2 text-xs text-gray-500">{aInfo.detail}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-xs dark:bg-blue-900/20">
              <span className="font-semibold text-blue-700 dark:text-blue-300">활용 분야:</span>{" "}
              <span className="text-gray-600 dark:text-gray-400">{aInfo.application}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-emerald-50 p-4 text-sm dark:bg-emerald-900/20">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-300">{dInfo.title}</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400">{dInfo.desc}</p>
              <p className="mt-2 text-xs text-gray-500">{dInfo.detail}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-red-50 p-3 text-xs dark:bg-red-900/20">
                <span className="font-semibold text-red-700 dark:text-red-300">잡음 내성</span>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{dInfo.noise}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-xs dark:bg-amber-900/20">
                <span className="font-semibold text-amber-700 dark:text-amber-300">대역폭 효율</span>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{dInfo.efficiency}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-xs dark:bg-blue-900/20">
                <span className="font-semibold text-blue-700 dark:text-blue-300">활용 분야</span>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{dInfo.application}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
