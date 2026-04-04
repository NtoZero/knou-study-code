"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type ARQType = "stop-wait" | "go-back-n" | "selective-repeat";

interface Frame {
  id: number;
  status: "pending" | "sending" | "sent" | "ack" | "error" | "retransmit";
}

export default function ARQMethods() {
  const [mode, setMode] = useState<ARQType>("stop-wait");
  const [frames, setFrames] = useState<Frame[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i, status: "pending" }))
  );
  const [errorFrame, setErrorFrame] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFrames(Array.from({ length: 8 }, (_, i) => ({ id: i, status: "pending" })));
    setLog([]);
    setRunning(false);
  }, []);

  const toggleError = (id: number) => {
    setErrorFrame((prev) => (prev === id ? null : id));
  };

  const simulate = useCallback(() => {
    reset();
    setRunning(true);
    const newLog: string[] = [];
    const frameStates = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      status: "pending" as Frame["status"],
    }));

    let step = 0;

    const tick = () => {
      if (mode === "stop-wait") {
        // Stop-and-Wait: send one, wait for ACK
        const idx = Math.floor(step / 2);
        if (idx >= 8) { setRunning(false); return; }
        if (step % 2 === 0) {
          const isError = idx === errorFrame;
          frameStates[idx].status = isError ? "error" : "sending";
          newLog.push(`프레임 ${idx} 전송${isError ? " → 오류 발생!" : ""}`);
          if (isError) {
            // Will retransmit
            newLog.push(`REJ: 프레임 ${idx} 재전송 요구`);
          }
        } else {
          const prevIdx = Math.floor((step - 1) / 2);
          if (prevIdx === errorFrame) {
            frameStates[prevIdx].status = "retransmit";
            newLog.push(`프레임 ${prevIdx} 재전송 → ACK 수신`);
            frameStates[prevIdx].status = "ack";
            setErrorFrame(null); // only error once
          } else {
            frameStates[prevIdx].status = "ack";
            newLog.push(`ACK ${prevIdx} 수신 → 다음 프레임 요구`);
          }
        }
      } else if (mode === "go-back-n") {
        // Simplified: send window of 4, error on errorFrame → go back
        if (step < 4) {
          const isError = step === errorFrame;
          frameStates[step].status = isError ? "error" : "sent";
          newLog.push(`프레임 ${step} 전송${isError ? " → 오류 발생!" : ""}`);
        } else if (step === 4 && errorFrame !== null && errorFrame < 4) {
          newLog.push(`REJ ${errorFrame}: 프레임 ${errorFrame}부터 모두 재전송`);
          for (let i = errorFrame; i < 4; i++) {
            frameStates[i].status = "retransmit";
          }
        } else if (step === 5) {
          for (let i = 0; i < 4; i++) frameStates[i].status = "ack";
          newLog.push("프레임 0~3 ACK 수신");
        } else if (step < 10) {
          const idx = step - 6 + 4;
          if (idx < 8) {
            frameStates[idx].status = "sent";
            newLog.push(`프레임 ${idx} 전송`);
          }
        } else if (step === 10) {
          for (let i = 4; i < 8; i++) frameStates[i].status = "ack";
          newLog.push("프레임 4~7 ACK 수신");
          setRunning(false);
        }
        if (step > 10) { setRunning(false); return; }
      } else {
        // Selective Repeat: only retransmit error frame
        if (step < 4) {
          const isError = step === errorFrame;
          frameStates[step].status = isError ? "error" : "sent";
          newLog.push(`프레임 ${step} 전송${isError ? " → 오류 발생!" : ""}`);
        } else if (step === 4 && errorFrame !== null && errorFrame < 4) {
          newLog.push(`REJ ${errorFrame}: 프레임 ${errorFrame}만 재전송 (선택적)`);
          frameStates[errorFrame].status = "retransmit";
        } else if (step === 5) {
          for (let i = 0; i < 4; i++) frameStates[i].status = "ack";
          newLog.push("프레임 0~3 ACK 수신");
        } else if (step < 10) {
          const idx = step - 6 + 4;
          if (idx < 8) {
            frameStates[idx].status = "sent";
            newLog.push(`프레임 ${idx} 전송`);
          }
        } else if (step === 10) {
          for (let i = 4; i < 8; i++) frameStates[i].status = "ack";
          newLog.push("프레임 4~7 ACK 수신");
          setRunning(false);
        }
        if (step > 10) { setRunning(false); return; }
      }

      setFrames([...frameStates]);
      setLog([...newLog]);
      step++;
      timerRef.current = setTimeout(tick, 800);
    };

    tick();
  }, [mode, errorFrame, reset]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const statusColor: Record<Frame["status"], string> = {
    pending: "bg-gray-200 dark:bg-gray-700",
    sending: "bg-blue-400 animate-pulse",
    sent: "bg-blue-500 text-white",
    ack: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    retransmit: "bg-amber-500 text-white",
  };

  return (
    <section>
      <SectionTitle
        title="ARQ (Automatic Repeat Request)"
        subtitle="프레임을 클릭하여 오류 지점을 설정한 후 시뮬레이션을 실행하세요"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap gap-2">
          {([
            { key: "stop-wait", label: "정지-대기 ARQ" },
            { key: "go-back-n", label: "N-프레임 후퇴 ARQ (Go-Back-N)" },
            { key: "selective-repeat", label: "선택적 반복 ARQ" },
          ] as const).map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); reset(); }}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                mode === m.key ? "bg-rose-500 text-white" : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Frames */}
        <div className="mb-4">
          <div className="mb-2 text-xs text-gray-500">
            프레임 클릭 → 오류 지점 설정 (빨간 테두리 = 오류 예정)
          </div>
          <div className="flex gap-1">
            {frames.map((f) => (
              <button
                key={f.id}
                onClick={() => !running && toggleError(f.id)}
                className={`relative h-12 w-12 rounded-lg text-sm font-bold ${statusColor[f.status]} ${
                  errorFrame === f.id && f.status === "pending"
                    ? "ring-2 ring-red-500 ring-offset-1"
                    : ""
                }`}
              >
                F{f.id}
              </button>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {[
              { color: "bg-gray-200", label: "대기" },
              { color: "bg-blue-500", label: "전송" },
              { color: "bg-green-500", label: "ACK" },
              { color: "bg-red-500", label: "오류" },
              { color: "bg-amber-500", label: "재전송" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1">
                <span className={`h-2.5 w-2.5 rounded ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={simulate}
          disabled={running}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
        >
          {running ? "시뮬레이션 중..." : "시뮬레이션 시작 ▶"}
        </button>

        {/* Log */}
        {log.length > 0 && (
          <div className="mt-4 max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            {log.map((l, i) => (
              <div
                key={i}
                className={`text-xs py-0.5 ${
                  l.includes("오류") || l.includes("REJ")
                    ? "text-red-600 font-medium"
                    : l.includes("ACK")
                      ? "text-green-600"
                      : "text-gray-600 dark:text-gray-400"
                }`}
              >
                [{i + 1}] {l}
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm dark:bg-rose-900/20">
          {mode === "stop-wait" && (
            <p>
              <strong>정지-대기 ARQ:</strong> 1개의 프레임을 전송하고 ACK를 기다림. 구현이 단순하나{" "}
              <strong>전송 효율이 크게 저하</strong>. ACK 수신 전까지 해당 프레임을 버퍼에 보관.
            </p>
          )}
          {mode === "go-back-n" && (
            <p>
              <strong>N-프레임 후퇴 ARQ:</strong> 윈도우 크기만큼 연속 전송. 오류 발생 시 해당 프레임부터{" "}
              <strong>모든 프레임을 재전송</strong>. REJ 발생 조건: (1) 오류 검출, (2) 프레임 손상, (3) 기대 순서보다 큰 순서번호 수신.
              윈도우 크기 = 순서번호 총 개수 - 1 (3비트면 W=7).
            </p>
          )}
          {mode === "selective-repeat" && (
            <p>
              <strong>선택적 반복 ARQ:</strong> 오류 프레임<strong>만</strong> 재전송. 전송 효율이 높으나 수신 측에서도 동일 크기
              윈도우를 유지하고 순서 재배열 필요. 윈도우 크기 ≤ 순서번호 총 개수의 절반 (3비트면 W≤4).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
