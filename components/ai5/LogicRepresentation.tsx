"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ArrowRight } from "lucide-react";

const operators = [
  { symbol: "∧", name: "AND (논리곱)", desc: "둘 다 참일 때만 참" },
  { symbol: "∨", name: "OR (논리합)", desc: "하나라도 참이면 참" },
  { symbol: "~", name: "NOT (부정)", desc: "참→거짓, 거짓→참" },
  { symbol: "→", name: "조건명제 (IF-THEN)", desc: "X가 참이고 Y가 거짓일 때만 거짓" },
  { symbol: "↔", name: "동치 (쌍조건)", desc: "둘 다 같으면 참" },
];

type TruthValue = true | false;

function computeResults(x: TruthValue, y: TruthValue) {
  return {
    "X ∧ Y": x && y,
    "X ∨ Y": x || y,
    "~X": !x,
    "X → Y": !x || y,
    "X ↔ Y": x === y,
  };
}

const modusPonensExamples = [
  {
    premise1: "Man(철수)",
    premise2: "∀x(Man(x) → Think(x))",
    conclusion: "Think(철수)",
    premise1Korean: "철수는 사람이다",
    premise2Korean: "모든 사람은 생각한다",
    conclusionKorean: "철수는 생각한다",
  },
  {
    premise1: "GLASS",
    premise2: "GLASS → FRAGILE",
    conclusion: "FRAGILE",
    premise1Korean: "이것은 유리이다",
    premise2Korean: "유리는 잘 깨진다",
    conclusionKorean: "이것은 잘 깨진다",
  },
];

export default function LogicRepresentation() {
  const [truthX, setTruthX] = useState<TruthValue>(true);
  const [truthY, setTruthY] = useState<TruthValue>(true);
  const [selectedExample, setSelectedExample] = useState(0);
  const [activeSection, setActiveSection] = useState<number>(0);

  const results = computeResults(truthX, truthY);

  const sections = ["형식논리학", "명제논리", "술어논리", "추론(연역법칙)"];

  return (
    <section>
      <SectionTitle
        title="논리 기반 지식표현"
        subtitle="형식논리학, 명제논리, 술어논리를 통한 지식의 형식적 표현"
      />

      {/* Section tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {sections.map((sec, i) => (
          <button
            key={i}
            onClick={() => setActiveSection(i)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSection === i
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Section 1: 형식논리학 */}
        {activeSection === 0 && (
          <motion.div
            key="formal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-bold">
                형식논리학 — 기호와 논리연산자
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                기호를 사용하여 <strong>참(T)</strong> 또는 <strong>거짓(F)</strong>을
                판별하는 형식적 체계
              </p>

              {/* Operator cards */}
              <div className="mb-6 grid gap-2 sm:grid-cols-3">
                {operators.map((op, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <span className="text-2xl font-bold text-orange-500">
                      {op.symbol}
                    </span>
                    <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                      {op.name}
                    </p>
                    <p className="text-xs text-gray-500">{op.desc}</p>
                  </div>
                ))}
              </div>

              {/* Interactive truth table */}
              <h4 className="mb-3 text-sm font-semibold text-orange-600 dark:text-orange-400">
                대화형 진리표 — X, Y 값을 클릭하여 결과 확인
              </h4>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <button
                  onClick={() => setTruthX(!truthX)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                    truthX
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  X = {truthX ? "T" : "F"}
                </button>
                <button
                  onClick={() => setTruthY(!truthY)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                    truthY
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  Y = {truthY ? "T" : "F"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-3 py-2 text-left text-gray-500">연산</th>
                      <th className="px-3 py-2 text-left text-gray-500">결과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(results).map(([op, val]) => (
                      <motion.tr
                        key={op}
                        initial={false}
                        animate={{
                          backgroundColor: val
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(239,68,68,0.1)",
                        }}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="px-3 py-2 font-mono font-medium text-gray-700 dark:text-gray-300">
                          {op}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-bold ${
                              val
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {val ? "T (참)" : "F (거짓)"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section 2: 명제논리 */}
        {activeSection === 1 && (
          <motion.div
            key="propositional"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-bold">명제논리</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                <strong>명제</strong>: 참 또는 거짓을 판단할 수 있는 문장.
                명제를 기호로 표현하고 논리연산자로 연결하여 복합명제를 구성.
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                  <h4 className="mb-2 text-sm font-bold text-orange-700 dark:text-orange-300">
                    예제: 유리의 성질
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-orange-200 px-2 py-0.5 text-xs font-mono dark:bg-orange-800">
                        GLASS
                      </span>
                      <ArrowRight size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        &quot;이것은 유리이다&quot;
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-orange-200 px-2 py-0.5 text-xs font-mono dark:bg-orange-800">
                        FRAGILE
                      </span>
                      <ArrowRight size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        &quot;이것은 잘 깨진다&quot;
                      </span>
                    </div>
                    <div className="mt-2 rounded bg-white p-2 dark:bg-gray-800">
                      <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                        GLASS → FRAGILE
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        (유리이면 잘 깨진다)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h4 className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    명제논리의 한계
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>- 명제를 더 이상 분해할 수 없음 (원자적)</li>
                    <li>- 변수 사용 불가 → 일반화 표현 어려움</li>
                    <li>- &quot;모든&quot;, &quot;어떤&quot; 등의 한정사 표현 불가</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section 3: 술어논리 */}
        {activeSection === 2 && (
          <motion.div
            key="predicate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-bold">술어논리</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                명제를 <strong>술어(predicate)</strong>와{" "}
                <strong>객체(object)</strong>로 분리하여 표현.
                변수와 한정사(∀, ∃)를 사용하여 일반화된 지식 표현 가능.
              </p>

              <div className="space-y-3 mb-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">
                    Mammal(CAT)
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    — &quot;고양이는 포유류이다&quot; (술어: Mammal, 객체: CAT)
                  </span>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">
                    Man(철수)
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    — &quot;철수는 사람이다&quot;
                  </span>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">
                    ∀x(Man(x) → Think(x))
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    — &quot;모든 사람은 생각한다&quot; (∀: 전칭한정사)
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>술어논리의 장점:</strong> 변수를 사용하여 일반적인
                  규칙을 표현할 수 있으며, ∀(전칭)과 ∃(존재) 한정사로
                  다양한 범위의 지식을 표현 가능.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section 4: 추론 — Modus Ponens */}
        {activeSection === 3 && (
          <motion.div
            key="inference"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-bold">
                추론 — 연역법칙 (Modus Ponens)
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                X가 참이고, X→Y가 참이면, Y도 참이다.
              </p>

              {/* Visual formula */}
              <div className="mb-6 flex justify-center">
                <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-6 text-center dark:border-orange-700 dark:bg-orange-950">
                  <span className="font-mono text-xl font-bold text-orange-700 dark:text-orange-300">
                    X, X → Y ⊢ Y
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    전제 X와 규칙 X→Y로부터 결론 Y를 도출
                  </p>
                </div>
              </div>

              {/* Example selector */}
              <div className="mb-4 flex gap-2">
                {modusPonensExamples.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedExample(i)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedExample === i
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    예제 {i + 1}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedExample}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {(() => {
                    const ex = modusPonensExamples[selectedExample];
                    return (
                      <>
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            전제 1:
                          </span>
                          <p className="font-mono text-sm text-green-800 dark:text-green-200">
                            {ex.premise1}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ex.premise1Korean}
                          </p>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            전제 2 (규칙):
                          </span>
                          <p className="font-mono text-sm text-blue-800 dark:text-blue-200">
                            {ex.premise2}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ex.premise2Korean}
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                            }}
                          >
                            <ArrowRight
                              size={24}
                              className="rotate-90 text-orange-500"
                            />
                          </motion.div>
                        </div>
                        <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-3 dark:border-orange-700 dark:bg-orange-900/20">
                          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                            결론:
                          </span>
                          <p className="font-mono text-sm font-bold text-orange-800 dark:text-orange-200">
                            {ex.conclusion}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ex.conclusionKorean}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
