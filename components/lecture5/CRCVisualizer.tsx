"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import { useAnimationStep } from "@/hooks/useAnimationStep";

const steps = [
  {
    title: "1. 전송 비트에 대한 다항식 표현",
    why: "CRC는 다항식 연산 기반이므로 전송 데이터를 다항식으로 표현합니다. 이진수의 각 비트가 다항식의 계수가 됩니다.",
    content: (
      <div className="space-y-2 font-mono text-sm">
        <div>M(X) = <span className="text-blue-600 font-bold">00001011</span> = X³ + X + 1</div>
        <div>G(X) = <span className="text-rose-600 font-bold">11</span> = X + 1 <span className="text-gray-400">(최상위 차수 m = 1)</span></div>
        <div className="text-xs text-gray-500 mt-1">생성다항식 G(X)는 송·수신 양쪽이 약속한 다항식으로, 적절히 선택하면 매우 효과적인 오류검출이 가능합니다.</div>
      </div>
    ),
  },
  {
    title: "2. M(X)에 X^m을 곱하기 (0 추가)",
    why: "생성다항식의 최상위 차수(m) 만큼 원본 데이터 끝에 0을 추가합니다. 이 공간에 나머지(FCS)가 들어갈 자리를 마련하는 것입니다.",
    content: (
      <div className="font-mono text-sm">
        <div>M&apos;(X) = M(X) × X¹ = <span className="text-blue-600 font-bold">00010110</span></div>
        <div className="text-xs text-gray-500 mt-1">끝에 0을 m=1개 추가하여 FCS가 들어갈 자리를 확보. m이 CRC-16이면 16개의 0을 추가합니다.</div>
      </div>
    ),
  },
  {
    title: "3. 모듈로-2 나눗셈 시작",
    why: "M'(X)를 G(X)로 나누는 과정입니다. 일반 나눗셈과 달리 모듈로-2 연산(= XOR)을 사용합니다. 올림수(carry)와 자리빌림(borrow)이 없습니다.",
    content: (
      <div className="space-y-2">
        <div className="font-mono text-xs space-y-0.5">
          <div className="text-gray-400 ml-10">0 0 0 1 0 1 1 1 ← 몫</div>
          <div className="border-b border-gray-300 pb-1 dark:border-gray-600">
            <span className="text-rose-600">11</span> ) <span className="text-blue-600">0 0 0 1 0 1 1 0</span>
          </div>
        </div>
        <div className="rounded bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
          <strong>모듈로-2 연산 규칙 (XOR):</strong> 0+0=0, 0+1=1, 1+0=1, <span className="text-rose-600 font-bold">1+1=0</span> — 올림수 없음, 뺄셈도 동일
        </div>
      </div>
    ),
  },
  {
    title: "4. XOR 나눗셈 과정 (전체)",
    why: "최상위 비트부터 순서대로 G(X)와 XOR 연산을 수행합니다. 최상위 비트가 1이면 나눌 수 있고, 0이면 건너뜁니다. 마지막에 남는 나머지가 FCS입니다.",
    content: (
      <pre className="font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">
{`     0 0 0 1 0 1 1 1  ← 몫
    ─────────────────
11 ) 0 0 0 1 0 1 1 0  ← M'(X)
             1 1       ← XOR (1⊕1=0, 0⊕1=1)
           ─────
             1 1 1
             1 1       ← XOR
           ─────
               0 1 0
               0 0     ← 최상위=0이므로 XOR 건너뜀
             ─────
               1 0
               1 1     ← XOR
             ─────
                 1     ← 나머지 R(X) = FCS`}
      </pre>
    ),
  },
  {
    title: "5. FCS 생성 및 전송 데이터 구성",
    why: "나머지 R(X)가 FCS(Frame Check Sequence)이며, BCC(Block Check Character)라고도 합니다. 이를 M'(X)에 더하면 G(X)로 나누어떨어지는 F(X)가 됩니다.",
    content: (
      <div className="font-mono text-sm space-y-1">
        <div>나머지 R(X) = <span className="text-amber-600 font-bold">1</span></div>
        <div>F(X) = M&apos;(X) + R(X) = 00010110 + 1 = <span className="text-green-600 font-bold">00010111</span></div>
        <div className="text-xs text-gray-500 mt-1">= X⁴ + X² + X + 1 — 이 값이 실제 전송되는 데이터</div>
        <div className="mt-2 text-xs text-gray-500">FCS를 프레임의 실제 내용에 의해 계산하므로 문자마다 잉여 비트를 붙일 필요 없이 프레임 끝에만 추가하면 됩니다.</div>
      </div>
    ),
  },
  {
    title: "6. 수신 측 검증 — 오류 없음",
    why: "수신 측은 받은 데이터 F(X)를 동일한 G(X)로 나눕니다. 원래 F(X) = M'(X) + R(X)이고, 이를 G(X)로 나누면 나머지가 정확히 0이 됩니다.",
    content: (
      <div className="font-mono text-sm space-y-1">
        <div>수신 데이터: <span className="text-green-600">00010111</span> (= F(X))</div>
        <div>G(X) = 11로 나누기 → 나머지 = <span className="text-green-600 font-bold">0</span></div>
        <div className="text-green-600 font-bold mt-2">→ 오류 없음! (나머지가 0이면 정상)</div>
      </div>
    ),
  },
  {
    title: "7. 수신 측 검증 — 오류 발생",
    why: "전송 중 비트가 변경되면 수신 데이터를 G(X)로 나눈 나머지가 0이 아니게 됩니다. CRC는 생성다항식 G(X)를 적절히 선택하면 단일 비트 오류, 2중 오류, 홀수 개 오류, 폭주오류 등을 매우 효과적으로 검출합니다.",
    content: (
      <div className="font-mono text-sm space-y-1">
        <div>수신 데이터 (오류): <span className="text-red-600">10100111</span> <span className="text-xs text-gray-400">(전송 중 비트 변경 발생)</span></div>
        <div>G(X) = 11로 나누기 → 나머지 = <span className="text-red-600 font-bold">1 ≠ 0</span></div>
        <div className="text-red-600 font-bold mt-2">→ 오류 검출!</div>
      </div>
    ),
  },
];

export default function CRCVisualizer() {
  const anim = useAnimationStep({ totalSteps: 7, intervalMs: 2000 });

  return (
    <section>
      <SectionTitle
        title="순환잉여검사 (CRC: Cyclic Redundancy Check)"
        subtitle="SDLC, HDLC 프로토콜에서 블록 단위 메시지 전달 시 사용하는 순환 코드 기반 오류검출 방식. 교재 예시: M(X) = X³+X+1, G(X) = X+1"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <StepControls
          step={anim.step} totalSteps={anim.totalSteps} playing={anim.playing}
          onPlay={anim.play} onStop={anim.stop} onReset={anim.reset}
          onNext={anim.next} onPrev={anim.prev}
        />

        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 font-semibold text-rose-600 dark:text-rose-400">{steps[anim.step].title}</h3>
          {steps[anim.step].content}
          <div className="mt-3 rounded bg-white/60 p-2 text-xs text-gray-500 dark:bg-gray-900/60">
            <strong>왜 이 단계가 필요한가:</strong> {steps[anim.step].why}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300">대표적 생성다항식</h4>
            <ul className="mt-1 space-y-0.5 text-xs text-gray-600 dark:text-gray-400">
              <li><strong>CRC-12:</strong> X¹² + X¹¹ + X³ + X² + 1 <span className="text-gray-400">(6비트 문자용)</span></li>
              <li><strong>CRC-16:</strong> X¹⁶ + X¹⁵ + X⁵ + 1</li>
              <li><strong>CRC-CCITT:</strong> X¹⁶ + X¹² + X⁵ + 1 <span className="text-gray-400">(패킷 교환 네트워크)</span></li>
            </ul>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300">CRC vs 패리티 vs 검사합</h4>
            <ul className="mt-1 space-y-0.5 text-xs text-gray-600 dark:text-gray-400">
              <li><strong>패리티:</strong> 문자 단위, 짝수개 오류 검출 불가</li>
              <li><strong>검사합:</strong> 블록 단위, 순서 변경 검출 불가</li>
              <li><strong>CRC:</strong> 프레임 단위, 가장 강력한 검출 능력</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
