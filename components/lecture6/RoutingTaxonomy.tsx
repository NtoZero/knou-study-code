"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface TreeNode {
  label: string;
  desc?: string;
  children?: TreeNode[];
}

const tree: TreeNode = {
  label: "라우팅 (routing)",
  desc: "데이터 블록이 목적 노드로 전달되도록 출발노드에서 목적노드까지의 경로를 결정하는 기능. 목적: 성능 최적화, 임계값 유지, 혼잡 방지, 전송 신뢰도 증대.",
  children: [
    {
      label: "비적응적 라우팅 (non-adaptive)",
      desc: "네트워크 상태에 관계없이 미리 정해진 규칙에 따라 경로 결정.",
      children: [
        {
          label: "랜덤 라우팅 (random)",
          desc: "다음 노드를 임의로 결정. 모든 경로가 동일한 확률로 선택 가능. 루프(loop)는 허용되지 않음.",
        },
        {
          label: "플러딩 라우팅 (flooding)",
          desc: "블록이 들어온 노드만 제외한 모든 노드에 전송. 신뢰성이 높으나 매우 큰 트래픽(중복 패킷 범람)이 형성될 수 있음.",
        },
        {
          label: "고정 라우팅 (fixed)",
          desc: "다음 노드가 일단 정해지면 환경이 변해도 유지. 대표적인 비적응적 경로선택 방식.",
          children: [
            {
              label: "단일 경로선택",
              desc: "다음 노드가 오직 하나로 고정. 플러딩과 정반대. 노드·선로 고장 시 경로가 완전 차단.",
            },
            {
              label: "이중 경로선택",
              desc: "주 경로 외에 by-pass link를 첨가하여 두 가지 경로 / 양자택일 경로 확보.",
            },
            {
              label: "다중 경로선택",
              desc: "여러 가지 선택할 수 있는 경로로 구성.",
            },
          ],
        },
      ],
    },
    {
      label: "적응적 라우팅 (adaptive)",
      desc: "네트워크 상태의 변화에 적응하여 경로를 동적으로 결정.",
      children: [
        {
          label: "국부 라우팅 (local)",
          desc: "라우팅 정보를 한 노드에서만 활용. 다음 노드의 결정은 해당 노드에서 수행.",
          children: [
            {
              label: "핫 포테이토 라우팅 (hot potato)",
              desc: "= shortest queue routing. 가장 짧은 큐를 가진 출력 선로를 선택. 패킷을 최대한 빨리 현재 노드에서 내보냄(뜨거운 감자).",
            },
            {
              label: "국부지연평가 / backward routing",
              desc: "과거의 정보를 이용. 데이터를 반대 방향으로 전송하는 데 걸리는 시간을 계산하여 다음 노드를 결정.",
            },
          ],
        },
        {
          label: "분산형 라우팅 (distributed)",
          desc: "라우팅 정보를 인접 노드 사이에서만 교환. 제한된 크기의 전송지연표로 목적 노드까지의 최소 지연 다음 노드 결정. 최소 지연 벡터는 주기적으로 갱신.",
          children: [
            { label: "1차 인접 노드", desc: "바로 이웃한 노드와만 정보 교환" },
            {
              label: "1차, 2차 인접 노드",
              desc: "1차 이웃 + 2차 이웃(이웃의 이웃)까지 정보 교환",
            },
            { label: "모든 다른 노드", desc: "네트워크 내 모든 노드와 정보 교환" },
          ],
        },
        {
          label: "중앙집중형 라우팅 (centralized)",
          desc: "Network Routing Center(NRC) 존재. 모든 노드가 NRC에 정보 제공, NRC가 라우팅 벡터를 갱신하여 각 노드에 제공. 분산형과 정반대. 각 노드는 편리하나 NRC는 복잡.",
        },
        {
          label: "델타 라우팅 (delta)",
          desc: "분산형 + 중앙집중형의 결합. 인접 노드 사이 경로선택은 분산형, 통신망 전체 경로선택은 중앙집중형으로 수행하여 국부 유연성과 전역 최적성을 동시에 추구.",
        },
      ],
    },
  ],
};

function TreeNodeComponent({
  node,
  depth = 0,
}: {
  node: TreeNode;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 2);
  const [showDesc, setShowDesc] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      className={
        depth > 0
          ? "ml-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700"
          : ""
      }
    >
      <button
        onClick={() => {
          if (hasChildren) setOpen(!open);
          setShowDesc(!showDesc);
        }}
        className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
          depth === 0 ? "bg-sky-50 font-bold dark:bg-sky-900/20" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          {hasChildren && (
            <span className="text-gray-400">{open ? "▼" : "▶"}</span>
          )}
          <span
            className={
              depth === 0 ? "text-sky-700 dark:text-sky-300" : ""
            }
          >
            {node.label}
          </span>
        </div>
        <AnimatePresence>
          {node.desc && showDesc && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-1 text-xs text-gray-500"
            >
              {node.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children!.map((child, i) => (
              <TreeNodeComponent key={i} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoutingTaxonomy() {
  return (
    <section>
      <SectionTitle
        title="라우팅 방법의 분류"
        subtitle="노드를 클릭하여 펼치거나 접고, 설명을 토글할 수 있습니다"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <TreeNodeComponent node={tree} />
      </div>

      {/* 적응적 라우팅 비교표 */}
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 p-3 text-xs font-bold dark:bg-gray-800">
          적응적 라우팅 비교 정리
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-2 text-left">방법</th>
              <th className="p-2 text-left">정보 범위</th>
              <th className="p-2 text-left">결정 위치</th>
              <th className="p-2 text-left">장단점</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["국부", "자기 노드", "자기 노드", "단순하나 최적성 낮음"],
              ["분산형", "인접 노드", "각 노드", "확장성 우수, 갱신 지연"],
              ["중앙집중형", "전체 노드 → NRC", "NRC", "최적해 가능, NRC 병목"],
              ["델타", "인접(분산) + 전체(중앙)", "수준별 분할", "두 방식 장점 결합"],
            ].map((r) => (
              <tr
                key={r[0]}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-2 font-semibold text-sky-600">{r[0]}</td>
                <td className="p-2">{r[1]}</td>
                <td className="p-2">{r[2]}</td>
                <td className="p-2 text-gray-500">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
