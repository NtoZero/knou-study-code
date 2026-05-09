"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Monitor, Globe, Layers, TrendingUp, Bot, Brain } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface TreeNode {
  id: string;
  label: string;
  en?: string;
  desc?: string;
  children?: TreeNode[];
  leaf?: boolean;
  color?: string;
}

const treeData: TreeNode = {
  id: "ids",
  label: "IDS",
  en: "Intrusion Detection System",
  desc: "컴퓨터 시스템이나 네트워크에서 비인가된 접근, 침입, 공격을 탐지하는 시스템",
  color: "fuchsia",
  children: [
    {
      id: "model",
      label: "침입 모델 기반",
      en: "Intrusion Model Based",
      desc: "어떤 기준으로 침입을 탐지하느냐에 따른 분류",
      color: "purple",
      children: [
        {
          id: "anomaly",
          label: "이상탐지",
          en: "Anomaly Detection",
          desc: "정상 행위의 기준선(Baseline)을 설정하고, 이로부터 벗어난 행위를 침입으로 판단. 통계·프로파일 기반 접근법. 새로운 공격에 대응 가능하나 오탐율이 높음.",
          leaf: true,
          color: "purple",
        },
        {
          id: "misuse",
          label: "오용탐지",
          en: "Misuse Detection",
          desc: "알려진 공격 패턴(시그니처)과 일치 여부를 비교하여 탐지. 시그니처 기반 접근법. 오탐율이 낮으나 알려지지 않은 공격(Zero-day)은 탐지 불가.",
          leaf: true,
          color: "violet",
        },
      ],
    },
    {
      id: "source",
      label: "데이터 소스 기반",
      en: "Data Source Based",
      desc: "어디에서 데이터를 수집하느냐에 따른 분류",
      color: "fuchsia",
      children: [
        {
          id: "hids",
          label: "호스트 기반 IDS",
          en: "HIDS — Host-based IDS",
          desc: "개별 호스트(서버, PC) 내부에 에이전트를 설치하여 해당 호스트의 활동을 모니터링. 시스템 로그, 파일 무결성, 시스템 콜을 감시함.",
          leaf: true,
          color: "pink",
        },
        {
          id: "nids",
          label: "네트워크 기반 IDS",
          en: "NIDS — Network-based IDS",
          desc: "네트워크 세그먼트에 설치하여 지나가는 패킷을 캡처·분석. 호스트에 영향 없이 광범위한 모니터링이 가능하지만 암호화 트래픽 분석은 불가.",
          leaf: true,
          color: "rose",
        },
        {
          id: "hybrid",
          label: "하이브리드 IDS",
          en: "Hybrid IDS",
          desc: "HIDS와 NIDS를 결합하여 두 방식의 장점을 통합. 호스트 내부와 네트워크 모두 모니터링하여 더 완벽한 탐지 커버리지를 제공함.",
          leaf: true,
          color: "orange",
        },
      ],
    },
  ],
};

interface TreeNodeProps {
  node: TreeNode;
  depth?: number;
}

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  fuchsia: { bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20", border: "border-fuchsia-400", text: "text-fuchsia-700 dark:text-fuchsia-300", badge: "bg-fuchsia-500" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-400", text: "text-purple-700 dark:text-purple-300", badge: "bg-purple-500" },
  violet: { bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-400", text: "text-violet-700 dark:text-violet-300", badge: "bg-violet-500" },
  pink: { bg: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-400", text: "text-pink-700 dark:text-pink-300", badge: "bg-pink-500" },
  rose: { bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-400", text: "text-rose-700 dark:text-rose-300", badge: "bg-rose-500" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-400", text: "text-orange-700 dark:text-orange-300", badge: "bg-orange-500" },
};

function TreeNodeItem({ node, depth = 0 }: TreeNodeProps) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  const c = colorMap[node.color ?? "fuchsia"];

  return (
    <div className={`${depth > 0 ? "ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-3" : ""}`}>
      <button
        onClick={() => !node.leaf && setOpen(!open)}
        className={`group flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${node.leaf ? "cursor-default" : "cursor-pointer"}`}
      >
        <span className={`mt-0.5 shrink-0 ${c.text}`}>
          {hasChildren ? (
            open ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <span className={`inline-block h-3 w-3 rounded-full ${c.badge}`} />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold ${depth === 0 ? "text-base" : ""} text-gray-800 dark:text-gray-100`}>
            {node.label}
            {node.en && <span className="ml-2 text-xs font-normal text-gray-400">{node.en}</span>}
          </div>
          {node.desc && (
            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {node.desc}
            </div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {hasChildren && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1">
              {node.children!.map(child => (
                <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const hidsNidsComparison = [
  { category: "모니터링 위치", hids: "개별 호스트 내부", nids: "네트워크 세그먼트" },
  { category: "설치 방식", hids: "호스트에 에이전트 설치", nids: "네트워크에 센서 설치" },
  { category: "암호화 트래픽", hids: "분석 가능 (호스트에서 복호화 후)", nids: "분석 불가" },
  { category: "분석 세밀도", hids: "세밀한 내부 분석 가능", nids: "패킷 수준 분석" },
  { category: "시스템 자원", hids: "호스트 자원 소비", nids: "호스트에 영향 없음" },
  { category: "공격 취약성", hids: "호스트 공격 시 IDS도 위험", nids: "별도 장비로 안전" },
  { category: "모니터링 범위", hids: "해당 호스트만", nids: "광범위한 네트워크 감시" },
  { category: "고속 링크", hids: "해당 없음", nids: "고속 링크에서 한계 발생" },
];

const trends = [
  {
    id: "distributed",
    icon: <Layers size={18} />,
    title: "분산 IDS",
    en: "Distributed IDS",
    desc: "여러 에이전트가 분산 배치되어 협력하여 탐지. 단일 지점의 한계를 극복하고 대규모 네트워크를 커버.",
    color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300 dark:bg-fuchsia-900/30 dark:text-fuchsia-200 dark:border-fuchsia-700",
  },
  {
    id: "agent",
    icon: <Bot size={18} />,
    title: "에이전트 기반 IDS",
    en: "Agent-based IDS",
    desc: "이동형 에이전트(Mobile Agent)를 활용하여 네트워크를 능동적으로 순회하며 탐지. 유연한 배치가 가능.",
    color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700",
  },
  {
    id: "aiml",
    icon: <Brain size={18} />,
    title: "AI/ML 기반 IDS",
    en: "AI/Machine Learning IDS",
    desc: "머신러닝과 딥러닝을 활용하여 패턴을 자동 학습. 복잡한 공격 패턴 탐지 능력 향상 및 오탐율 감소.",
    color: "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-200 dark:border-violet-700",
  },
];

export default function IDSClassificationTree() {
  const [activeCompare, setActiveCompare] = useState<"hids" | "nids" | null>(null);

  return (
    <section>
      <SectionTitle
        title="IDS 분류 체계"
        subtitle="침입 모델 기반 및 데이터 소스 기반의 IDS 전체 분류 트리"
      />

      {/* Tree */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <TreeNodeItem node={treeData} depth={0} />
      </div>

      {/* HIDS vs NIDS Comparison */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">
          HIDS vs NIDS 상세 비교
        </h3>
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => setActiveCompare(activeCompare === "hids" ? null : "hids")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCompare === "hids"
                ? "bg-pink-500 text-white"
                : "bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/40 dark:text-pink-300"
            }`}
          >
            <Monitor size={12} className="mr-1 inline" />
            HIDS 하이라이트
          </button>
          <button
            onClick={() => setActiveCompare(activeCompare === "nids" ? null : "nids")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCompare === "nids"
                ? "bg-rose-500 text-white"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300"
            }`}
          >
            <Globe size={12} className="mr-1 inline" />
            NIDS 하이라이트
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">비교 항목</th>
                <th className={`px-4 py-2.5 text-left text-xs font-semibold transition-all ${
                  activeCompare === "hids" ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" : "text-gray-600 dark:text-gray-300"
                }`}>
                  <Monitor size={12} className="mr-1 inline" />HIDS
                </th>
                <th className={`px-4 py-2.5 text-left text-xs font-semibold transition-all ${
                  activeCompare === "nids" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" : "text-gray-600 dark:text-gray-300"
                }`}>
                  <Globe size={12} className="mr-1 inline" />NIDS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {hidsNidsComparison.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400">{row.category}</td>
                  <td className={`px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 transition-all ${
                    activeCompare === "hids" ? "bg-pink-50 font-semibold text-pink-800 dark:bg-pink-900/20 dark:text-pink-200" : ""
                  }`}>{row.hids}</td>
                  <td className={`px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 transition-all ${
                    activeCompare === "nids" ? "bg-rose-50 font-semibold text-rose-800 dark:bg-rose-900/20 dark:text-rose-200" : ""
                  }`}>{row.nids}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Development Trends */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100">
          <TrendingUp size={16} className="text-fuchsia-600" />
          IDS 개발 동향 3가지
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {trends.map(t => (
            <div key={t.id} className={`rounded-xl border p-4 ${t.color}`}>
              <div className="mb-2 flex items-center gap-2">
                {t.icon}
                <span className="text-sm font-bold">{t.title}</span>
              </div>
              <div className="mb-1.5 text-xs opacity-70">{t.en}</div>
              <p className="text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
