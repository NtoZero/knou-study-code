"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

export default function SlidingWindow() {
  const [wf, setWf] = useState(0); // first unacknowledged
  const [wn, setWn] = useState(4); // next to send
  const [mode, setMode] = useState<"gobackn" | "selective">("gobackn");

  const totalSeq = 8; // 3-bit: 0~7
  const maxWinGoBackN = totalSeq - 1; // 7
  const maxWinSelective = totalSeq / 2; // 4
  const windowSize = mode === "gobackn" ? maxWinGoBackN : maxWinSelective;

  const frames = Array.from({ length: totalSeq * 2 }, (_, i) => i % totalSeq);

  const getStatus = (seqNum: number, idx: number) => {
    // Simple visualization: frames before wf = acked, wf..wn-1 = unacked, wn..wf+win = ready
    const normIdx = idx;
    if (normIdx < wf) return "acked";
    if (normIdx >= wf && normIdx < wn) return "unacked";
    if (normIdx >= wn && normIdx < wf + windowSize) return "ready";
    return "future";
  };

  const ackOne = () => {
    if (wf < wn) setWf((f) => f + 1);
  };

  const sendOne = () => {
    if (wn < wf + windowSize && wn < totalSeq * 2) setWn((n) => n + 1);
  };

  const reset = () => {
    setWf(0);
    setWn(4);
  };

  const statusStyles: Record<string, string> = {
    acked: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300",
    unacked: "bg-blue-400 text-white",
    ready: "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    future: "bg-gray-100 text-gray-400 dark:bg-gray-800",
  };

  return (
    <section>
      <SectionTitle
        title="슬라이딩 윈도우 (Sliding Window)"
        subtitle="연속적 ARQ에서 사용하는 윈도우 기반 흐름 제어"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => { setMode("gobackn"); reset(); }}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === "gobackn" ? "bg-rose-500 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            Go-Back-N (W=7)
          </button>
          <button
            onClick={() => { setMode("selective"); reset(); }}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === "selective" ? "bg-rose-500 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            Selective Repeat (W≤4)
          </button>
        </div>

        {/* Window visualization */}
        <div className="mb-4 overflow-x-auto">
          <div className="relative min-w-[600px]">
            {/* Frames */}
            <div className="flex gap-1">
              {frames.slice(0, 16).map((seq, idx) => (
                <div
                  key={idx}
                  className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg text-xs font-bold ${statusStyles[getStatus(seq, idx)]}`}
                >
                  <span>{seq}</span>
                </div>
              ))}
            </div>

            {/* Window bracket */}
            <div
              className="absolute -bottom-6 h-1 rounded bg-rose-400 transition-all"
              style={{
                left: `${wf * 52}px`,
                width: `${windowSize * 52 - 4}px`,
              }}
            />

            {/* Pointers */}
            <div className="mt-8 flex gap-8 text-xs">
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                <span>Wf = {wf % totalSeq} (미확인 첫 프레임)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span>Wn = {wn % totalSeq} (다음 전송 대기)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span>Wsize = {windowSize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={sendOne}
            className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            프레임 전송 →
          </button>
          <button
            onClick={ackOne}
            className="rounded-lg bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600"
          >
            ACK 수신 ✓
          </button>
          <button
            onClick={reset}
            className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700"
          >
            초기화
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            { style: statusStyles.acked, label: "전송 완료 (ACK)" },
            { style: statusStyles.unacked, label: "전송했지만 미확인" },
            { style: statusStyles.ready, label: "전송 대기 (버퍼)" },
            { style: statusStyles.future, label: "앞으로 보낼 프레임" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1">
              <span className={`h-3 w-5 rounded ${l.style}`} />
              {l.label}
            </span>
          ))}
        </div>

        {/* Formula info */}
        <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm dark:bg-rose-900/20">
          <p className="font-semibold">윈도우 크기와 순서번호의 관계 (3비트 = 0~7):</p>
          <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            <li>
              <strong>Go-Back-N:</strong> W = 순서번호 총 개수 - 1 ={" "}
              <span className="font-mono">2³ - 1 = 7</span>
            </li>
            <li>
              <strong>Selective Repeat:</strong> W ≤ 순서번호 총 개수 / 2 ={" "}
              <span className="font-mono">2³ / 2 = 4</span>
            </li>
            <li className="text-gray-500">
              순서번호가 반복되므로 재전송에 의한 것인지, 새 프레임인지 구별하기 위한 제약 조건
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
