"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Shuffle,
  GitBranch,
  Copy,
  CheckCircle2,
  Scissors,
  Plug,
  FileCode,
  ArrowUpDown,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const principles = [
  {
    n: 1,
    icon: Layers,
    title: "과다 계층 분할 금지",
    desc: "너무 많은 계층으로 분리함으로써 각 계층에 대한 설명과 이들에 대한 조합이 필요 이상으로 많지 않아야 함.",
  },
  {
    n: 2,
    icon: Shuffle,
    title: "경계에서 최소 상호작용",
    desc: "서비스의 양이 적고, 경계를 중심으로 최소의 상호 작용이 일어나도록 경계를 정해야 함.",
  },
  {
    n: 3,
    icon: GitBranch,
    title: "명백히 다른 기능 분리",
    desc: "수행하는 일의 측면에서나 필요로 하는 기술의 측면에 있어서 명백히 서로 다른 기능들을 다룰 수 있도록 계층을 설정.",
  },
  {
    n: 4,
    icon: Copy,
    title: "유사 기능은 한 계층",
    desc: "비슷한 기능들은 같은 계층에 존재하도록 함.",
  },
  {
    n: 5,
    icon: CheckCircle2,
    title: "성공 사례 기반 경계",
    desc: "과거의 경험에 의해 성공적이라 판단되는 곳에 경계를 설정.",
  },
  {
    n: 6,
    icon: Scissors,
    title: "세분화 용이 기능은 계층화",
    desc: "쉽게 세분화되는 기능을 하나의 계층으로 함.",
  },
  {
    n: 7,
    icon: Plug,
    title: "표준 인터페이스 위치에 경계",
    desc: "필요한 경우 표준화된 인터페이스를 가질 수 있는 곳에 경계를 설정.",
  },
  {
    n: 8,
    icon: FileCode,
    title: "구문·의미 추상화 수준 분리",
    desc: "데이터에 대한 조작, 즉 구문(syntax), 의미(semantic) 등의 추상적 개념에 대해 서로 다른 수준을 필요로 하는 곳에서 계층을 설정.",
  },
  {
    n: 9,
    icon: ArrowUpDown,
    title: "인접 계층과만 상호작용",
    desc: "각 계층은 단지 상위 계층과 하위 계층에만 경계를 갖도록 함. 즉, 다른 계층과는 전혀 무관하도록 함.",
  },
];

export default function LayerSeparationPrinciples() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <section>
      <SectionTitle
        title="계층 분리의 9가지 원칙"
        subtitle="OSI 모델이 7계층을 채택하게 된 설계 원칙. 각 원칙을 클릭하면 상세 설명이 펼쳐집니다."
      />

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((p) => {
          const Icon = p.icon;
          const open = expanded === p.n;
          return (
            <motion.button
              key={p.n}
              layout
              onClick={() => setExpanded(open ? null : p.n)}
              className={`rounded-xl border p-4 text-left transition-all ${
                open
                  ? "border-lime-500 bg-lime-50 shadow-md dark:border-lime-600 dark:bg-lime-950/30"
                  : "border-gray-200 bg-white hover:border-lime-300 dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    open ? "bg-lime-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-lime-600 dark:text-lime-400">
                      #{p.n}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {p.title}
                    </span>
                  </div>
                  <AnimatePresence>
                    {open && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden text-xs text-gray-600 dark:text-gray-400"
                      >
                        {p.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
