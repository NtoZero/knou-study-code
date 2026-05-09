"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const services = [
  { id: "peer-auth", label: "동료 개체 인증", short: "동료인증" },
  { id: "data-origin", label: "데이터 발신처 인증", short: "발신처인증" },
  { id: "access-ctrl", label: "접근제어", short: "접근제어" },
  { id: "conn-conf", label: "연결 기밀성", short: "연결기밀" },
  { id: "noconn-conf", label: "비연결 기밀성", short: "비연결기밀" },
  { id: "sel-conf", label: "선택적 필드 기밀성", short: "선택기밀" },
  { id: "flow-conf", label: "트래픽 흐름 기밀성", short: "흐름기밀" },
  { id: "conn-integ", label: "연결 무결성", short: "연결무결" },
  { id: "nonrep", label: "부인방지", short: "부인방지" },
];

const layers = [
  { id: "phy", label: "물리", en: "Physical", num: 1 },
  { id: "dl", label: "데이터링크", en: "Data Link", num: 2 },
  { id: "net", label: "네트워크", en: "Network", num: 3 },
  { id: "trans", label: "전송", en: "Transport", num: 4 },
  { id: "sess", label: "세션", en: "Session", num: 5 },
  { id: "pres", label: "표현", en: "Presentation", num: 6 },
  { id: "app", label: "응용", en: "Application", num: 7 },
];

// O = true, - = false
const matrix: boolean[][] = [
  // svc \ layer: phy, dl, net, trans, sess, pres, app
  [false, false, true,  true,  false, false, true ], // 동료 개체 인증
  [false, false, true,  true,  false, false, true ], // 데이터 발신처 인증
  [false, false, true,  true,  false, false, true ], // 접근제어
  [true,  true,  true,  true,  false, true,  true ], // 연결 기밀성
  [false, true,  true,  true,  false, true,  true ], // 비연결 기밀성
  [false, false, false, false, false, true,  true ], // 선택적 필드 기밀성
  [true,  false, true,  false, false, true,  true ], // 트래픽 흐름 기밀성
  [false, false, true,  true,  false, false, true ], // 연결 무결성
  [false, false, false, false, false, true,  true ], // 부인방지
];

export default function OSISecurityLayerMap() {
  const [highlightCol, setHighlightCol] = useState<number | null>(null);
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  const handleColClick = (c: number) => {
    setHighlightCol((prev) => (prev === c ? null : c));
    setHighlightRow(null);
    setSelectedCell(null);
  };

  const handleRowClick = (r: number) => {
    setHighlightRow((prev) => (prev === r ? null : r));
    setHighlightCol(null);
    setSelectedCell(null);
  };

  const handleCellClick = (r: number, c: number) => {
    if (selectedCell?.r === r && selectedCell?.c === c) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ r, c });
    }
    setHighlightCol(null);
    setHighlightRow(null);
  };

  return (
    <section>
      <SectionTitle
        title="OSI 보안서비스 계층 매핑"
        subtitle="9가지 보안서비스 × OSI 7계층 — 서비스/계층 클릭 시 하이라이트"
      />

      {/* 안내 */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-purple-100 dark:bg-purple-900/40">
            <Check size={10} className="text-purple-600" />
          </span>
          제공 (O)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
            <Minus size={10} className="text-gray-400" />
          </span>
          미제공 (-)
        </span>
        <span className="text-gray-400">| 헤더 클릭: 열/행 하이라이트 | 셀 클릭: 상세 정보</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-[700px] text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <th className="p-3 text-left font-semibold text-gray-500">
                보안서비스 \ 계층
              </th>
              {layers.map((layer, c) => (
                <th key={layer.id} className="p-2 text-center">
                  <button
                    onClick={() => handleColClick(c)}
                    className={`rounded-lg px-2 py-1.5 font-semibold transition-colors ${
                      highlightCol === c
                        ? "bg-purple-600 text-white"
                        : "text-gray-600 hover:bg-purple-100 dark:text-gray-300 dark:hover:bg-purple-900/30"
                    }`}
                  >
                    <div>{layer.label}</div>
                    <div className="text-[10px] font-normal opacity-70">{layer.num}계층</div>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((svc, r) => (
              <tr
                key={svc.id}
                className={`border-b border-gray-100 transition-colors dark:border-gray-800 ${
                  highlightRow === r ? "bg-purple-50 dark:bg-purple-900/10" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <td className="p-2">
                  <button
                    onClick={() => handleRowClick(r)}
                    className={`rounded-lg px-2 py-1 text-left font-medium transition-colors ${
                      highlightRow === r
                        ? "bg-purple-600 text-white"
                        : "text-gray-600 hover:bg-purple-100 dark:text-gray-300 dark:hover:bg-purple-900/30"
                    }`}
                  >
                    {svc.label}
                  </button>
                </td>
                {matrix[r].map((provided, c) => {
                  const isColHL = highlightCol === c;
                  const isRowHL = highlightRow === r;
                  const isSel = selectedCell?.r === r && selectedCell?.c === c;

                  return (
                    <td key={c} className="p-2 text-center">
                      <button
                        onClick={() => handleCellClick(r, c)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                          isSel
                            ? provided
                              ? "bg-purple-600 text-white scale-110 shadow-md"
                              : "bg-gray-300 text-gray-600 dark:bg-gray-600 scale-110"
                            : isColHL || isRowHL
                            ? provided
                              ? "bg-purple-200 text-purple-700 dark:bg-purple-800/60 dark:text-purple-200"
                              : "bg-gray-200 dark:bg-gray-700"
                            : provided
                            ? "bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-gray-50 text-gray-300 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-600"
                        }`}
                      >
                        {provided ? (
                          <Check size={14} className="font-bold" />
                        ) : (
                          <Minus size={12} />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 선택 셀 상세 */}
      {selectedCell && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl border-2 p-4 ${
            matrix[selectedCell.r][selectedCell.c]
              ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20"
              : "border-gray-300 bg-gray-50 dark:bg-gray-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {services[selectedCell.r].label}
              </span>
              <span className="mx-2 text-gray-400">×</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {layers[selectedCell.c].label} 계층
              </span>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${
                matrix[selectedCell.r][selectedCell.c]
                  ? "bg-purple-600 text-white"
                  : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
              }`}
            >
              {matrix[selectedCell.r][selectedCell.c] ? "제공 O" : "미제공 -"}
            </span>
          </div>
        </motion.div>
      )}

      {/* 통계 요약 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "가장 많은 보안서비스 제공 계층",
            value: "응용 계층 (7계층)",
            detail: "9개 서비스 중 8개 제공",
            color: "text-purple-600",
          },
          {
            label: "서비스를 전혀 제공 안 하는 계층",
            value: "세션 계층 (5계층)",
            detail: "보안서비스 0개 제공",
            color: "text-gray-500",
          },
          {
            label: "부인방지 서비스 제공 계층",
            value: "표현 · 응용 계층",
            detail: "6, 7계층에서만 제공",
            color: "text-violet-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className={`mt-1 font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
