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
  label: "오류제어",
  desc: "잡음, 고장 등의 영향에 대비하여 잔류오류율(RER)을 한계 이내로 유지하는 통신 기능",
  children: [
    {
      label: "전진 오류정정 (FEC)",
      desc: "송신 측이 부가 정보를 첨가하여 수신 측에서 오류를 검출하고 정정까지 수행. 재전송이 어려운 동시통신 환경에 적합",
      children: [
        { label: "해밍 코드 (Hamming)", desc: "가장 대표적인 FEC 코드" },
        { label: "리드-뮬러 코드", desc: "Reed-Muller code" },
        { label: "리드-솔로몬 코드", desc: "Reed-Solomon code" },
      ],
    },
    {
      label: "귀환 오류제어",
      desc: "역방향 채널을 이용하는 오류검출 방법",
      children: [
        {
          label: "결정귀환 (ARQ)",
          desc: "수신지국에서 오류 여부를 결정. ACK/REJ 신호 사용. 낮은 대역의 역방향 채널 필요",
          children: [
            { label: "정지-대기 ARQ", desc: "1개 프레임 전송 후 ACK 대기. 단순하지만 비효율적" },
            {
              label: "연속적 ARQ",
              children: [
                { label: "Go-Back-N ARQ", desc: "오류 시 해당 프레임부터 모든 프레임 재전송. W = 2ⁿ - 1" },
                { label: "Selective Repeat ARQ", desc: "오류 프레임만 재전송. W ≤ 2ⁿ / 2" },
              ],
            },
            { label: "적응적 ARQ", desc: "프레임 길이를 오류율에 따라 동적으로 변경" },
          ],
        },
        { label: "정보귀환", desc: "송신지국이 오류 여부를 판단. 넓은 대역의 역방향 채널 필요. 블록 비교 또는 BCC 비교 방법" },
        { label: "복합귀환", desc: "오류 검출 시 → 결정귀환, 미검출 시 → 정보귀환으로 동작" },
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
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={depth > 0 ? "ml-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700" : ""}>
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
          hasChildren ? "hover:bg-gray-50 dark:hover:bg-gray-800" : ""
        } ${depth === 0 ? "bg-rose-50 font-bold dark:bg-rose-900/20" : ""}`}
      >
        <div className="flex items-center gap-2">
          {hasChildren && (
            <span className="text-gray-400">{open ? "▼" : "▶"}</span>
          )}
          <span className={depth === 0 ? "text-rose-700 dark:text-rose-300" : ""}>
            {node.label}
          </span>
        </div>
        {node.desc && open && (
          <p className="mt-1 text-xs text-gray-500">{node.desc}</p>
        )}
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

export default function ErrorControlTree() {
  return (
    <section>
      <SectionTitle
        title="오류제어 분류 체계"
        subtitle="노드를 클릭하여 펼치거나 접을 수 있습니다"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <TreeNodeComponent node={tree} />
      </div>
    </section>
  );
}
