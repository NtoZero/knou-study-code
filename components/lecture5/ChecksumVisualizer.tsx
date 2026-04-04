"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import { useAnimationStep } from "@/hooks/useAnimationStep";

const chars = [
  { ch: "N", ascii: "01001110" }, { ch: "e", ascii: "01100101" },
  { ch: "t", ascii: "01110100" }, { ch: "w", ascii: "01110111" },
  { ch: "o", ascii: "01101111" }, { ch: "r", ascii: "01110010" },
  { ch: "k", ascii: "01101011" }, { ch: "s", ascii: "01110011" },
];

const segments = [
  { label: "Ne", binary: "0100111001100101", decimal: 20069 },
  { label: "tw", binary: "0111010001110111", decimal: 29815 },
  { label: "or", binary: "0110111101110010", decimal: 28530 },
  { label: "ks", binary: "0110101101110011", decimal: 27507 },
];

const sum = 20069 + 29815 + 28530 + 27507;
const wrapped = (sum & 0xffff) + (sum >> 16);
const checksum = (~wrapped) & 0xffff;
const checksumBin = checksum.toString(2).padStart(16, "0");

const steps = [
  {
    title: "1. 문자열을 ASCII 코드로 변환",
    desc: "'Networks' 각 문자를 8비트 ASCII 코드로 변환",
    why: "검사합은 이진수 연산 기반이므로 먼저 문자를 이진수로 변환해야 합니다. ASCII 코드는 7비트 정보 + 1비트 패리티로 구성됩니다.",
  },
  {
    title: "2. 16비트 세그먼트로 분할",
    desc: "2문자씩 묶어 16비트 세그먼트 4개 생성",
    why: "검사합은 데이터를 n비트 단위의 세그먼트로 분할하여 합산합니다. TCP/UDP에서는 16비트 단위를 사용합니다.",
  },
  {
    title: "3. 세그먼트 합산 (2진수 덧셈)",
    desc: `4개 세그먼트를 2진수로 간주하고 합산 → ${sum} (${sum.toString(2)})`,
    why: "세그먼트들을 2진수로 간주하고 산술 합산을 수행합니다. 합산 결과가 16비트를 초과하면 캐리(carry)가 발생합니다.",
  },
  {
    title: "4. 순환 캐리 처리 + 1의 보수",
    desc: `캐리 비트를 순환 캐리(end-around carry)로 합침 → 1의 보수 → 검사합: ${checksumBin}`,
    why: "캐리 비트가 발생하면 순환 캐리로 전체 합의 16비트 부분에 더합니다. 그 후 모든 비트를 반전(1의 보수)하여 검사합을 생성합니다. 1의 보수를 사용하는 이유: 수신 측에서 모든 세그먼트+검사합을 합산하면 정확히 전부 1이 되어 검증이 단순합니다.",
  },
  {
    title: "5. 송신: 데이터 + 검사합 전송",
    desc: "4개 데이터 세그먼트 끝에 검사합을 덧붙여 수신 측으로 전송",
    why: "검사합은 데이터의 '요약값' 역할을 합니다. 전송 중 데이터가 변경되면 수신 측에서 계산한 검사합이 달라져 오류를 검출할 수 있습니다.",
  },
  {
    title: "6. 수신: 검증 (오류 없는 경우)",
    desc: "5개 세그먼트(4 데이터 + 1 검사합) 합산 → 1의 보수 → 결과가 0이면 오류 없음",
    why: "수신한 모든 세그먼트(데이터+검사합)를 합산하면 결과가 모든 비트 1(1111...1111)이 됩니다. 이를 1의 보수로 변환하면 0이 되어 '오류 없음'을 확인합니다. 만약 결과가 0이 아니면 전송 중 오류가 발생한 것입니다.",
  },
];

export default function ChecksumVisualizer() {
  const anim = useAnimationStep({ totalSteps: 6, intervalMs: 2000 });

  return (
    <section>
      <SectionTitle
        title="검사합 (Checksum)"
        subtitle="패리티 검사보다 더 명확한 오류검출을 제공. TCP와 UDP 헤더 내에 검사합 필드가 존재. 교재 예시: 'Networks' 문자열"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <StepControls
          step={anim.step} totalSteps={anim.totalSteps} playing={anim.playing}
          onPlay={anim.play} onStop={anim.stop} onReset={anim.reset}
          onNext={anim.next} onPrev={anim.prev}
        />

        {/* Step title + explanation */}
        <div className="mt-4 rounded-lg bg-rose-50 p-4 dark:bg-rose-900/20">
          <h3 className="font-semibold text-rose-700 dark:text-rose-300">{steps[anim.step].title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{steps[anim.step].desc}</p>
          <p className="mt-2 rounded bg-white/60 p-2 text-xs text-gray-500 dark:bg-gray-800/60">
            <strong>왜 이 단계가 필요한가:</strong> {steps[anim.step].why}
          </p>
        </div>

        {/* Step 0: ASCII */}
        {anim.step >= 0 && (
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-2">
              {chars.map((c, i) => (
                <div key={i} className={`rounded border px-2 py-1.5 text-center text-xs transition-opacity ${
                  anim.step === 0 ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"
                }`}>
                  <div className="font-bold">{c.ch}</div>
                  <div className="mt-0.5 font-mono text-gray-500">{c.ascii}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1+: Segments */}
        {anim.step >= 1 && (
          <div className="mt-4 space-y-1">
            {segments.map((seg, i) => (
              <div key={i} className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-mono ${
                anim.step === 1 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-gray-50 dark:bg-gray-800"
              }`}>
                <span className="w-12 text-gray-500">Seg{i + 1}</span>
                <span className="font-bold text-gray-400">({seg.label})</span>
                <span>{seg.binary}</span>
                <span className="text-gray-400">= {seg.decimal}</span>
              </div>
            ))}
          </div>
        )}

        {anim.step >= 2 && (
          <div className="mt-3 flex items-center gap-2 rounded bg-violet-50 px-3 py-2 text-sm font-mono dark:bg-violet-900/20">
            <span className="text-violet-600 dark:text-violet-400">합계:</span>
            <span>{sum}</span>
            <span className="text-gray-400">({sum.toString(2)})</span>
            {anim.step >= 3 && (
              <span className="text-xs text-gray-500">→ 16비트 초과분(캐리) = {(sum >> 16).toString(2)}</span>
            )}
          </div>
        )}

        {anim.step >= 3 && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 rounded bg-amber-50 px-3 py-2 text-sm font-mono dark:bg-amber-900/20">
              <span className="text-amber-600 dark:text-amber-400">캐리 래핑:</span>
              <span>{wrapped.toString(2).padStart(16, "0")}</span>
              <span className="text-gray-400">= {wrapped}</span>
            </div>
            <div className="flex items-center gap-2 rounded bg-rose-100 px-3 py-2 text-sm font-mono dark:bg-rose-900/30">
              <span className="font-bold text-rose-600 dark:text-rose-400">검사합 (1의 보수):</span>
              <span className="font-bold">{checksumBin}</span>
            </div>
          </div>
        )}

        {anim.step >= 5 && (
          <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm dark:bg-green-900/20">
            <span className="font-bold text-green-700 dark:text-green-400">검증 결과:</span>{" "}
            5개 세그먼트 합산 → <span className="font-mono">1111111111111111</span> → 1의 보수 →{" "}
            <span className="font-mono font-bold">0000000000000000</span> ={" "}
            <span className="font-bold text-green-600">오류 없음</span>
            <p className="mt-1 text-xs text-gray-500">
              <strong>검사합의 한계:</strong> 합산은 교환법칙이 성립하므로 두 세그먼트의 순서가 바뀌어도 검출 불가. 또한 동일한 위치에 동일한 크기의 오류가 짝수 개 발생하면 상쇄되어 검출하지 못할 수 있음.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
