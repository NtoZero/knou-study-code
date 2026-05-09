"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, ChevronDown, Users, User } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface KeyType {
  id: string;
  name: string;
  en: string;
  badge: string;
  bgLight: string;
  border: string;
  textColor: string;
  desc: string;
  usage: string;
  protection: string;
}

const KEY_TYPES: KeyType[] = [
  {
    id: "session",
    name: "세션키",
    en: "Session Key",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-400",
    textColor: "text-amber-700 dark:text-amber-300",
    desc: "일회용 대칭키. PGP가 메시지를 보낼 때마다 새로 무작위 생성하여 사용 후 폐기.",
    usage: "메시지 본문 암호화 (IDEA/AES 등 대칭 알고리즘 사용)",
    protection: "수신자의 공개키로 암호화하여 안전하게 전달",
  },
  {
    id: "public",
    name: "공개키",
    en: "Public Key",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
    desc: "비대칭키 쌍의 공개 부분. 누구에게나 배포 가능하며 비밀을 유지할 필요 없음.",
    usage: "① 세션키 암호화 (발신) ② 디지털 서명 검증 (수신)",
    protection: "공개 배포 — 보호 불필요 (누구나 알아도 됨)",
  },
  {
    id: "private",
    name: "개인키",
    en: "Private Key",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-400",
    textColor: "text-rose-700 dark:text-rose-300",
    desc: "비대칭키 쌍의 비밀 부분. 절대 타인에게 공개해서는 안 되는 핵심 비밀.",
    usage: "① 디지털 서명 생성 (발신) ② 세션키 복호화 (수신)",
    protection: "암호구문(Passphrase)으로 암호화하여 파일 보호",
  },
  {
    id: "passphrase",
    name: "암호구문",
    en: "Passphrase",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    desc: "개인키를 잠그는 비밀번호 역할. 단순 패스워드가 아닌 긴 문구(phrase) 형태 권장.",
    usage: "개인키 파일 보호 — 로컬 저장된 개인키를 잠금",
    protection: "사용자의 기억 속에만 존재 (어디에도 저장 안 됨)",
  },
];

interface WOTNode {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

const WOT_NODES: WOTNode[] = [
  { id: "alice", name: "Alice", x: 80, y: 100, color: "#e11d48" },
  { id: "bob", name: "Bob", x: 230, y: 60, color: "#2563eb" },
  { id: "carol", name: "Carol", x: 380, y: 100, color: "#16a34a" },
  { id: "dave", name: "Dave", x: 230, y: 160, color: "#d97706" },
];

const TRUST_COLORS: Record<string, string> = {
  full: "#e11d48",
  marginal: "#d97706",
  none: "#9ca3af",
};

export default function PGPKeyRingExplorer() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [trustModel, setTrustModel] = useState<"wot" | "ca">("wot");

  return (
    <section>
      <SectionTitle
        title="PGP 키 구조 및 신뢰 모델"
        subtitle="세션키·공개키·개인키·암호구문 + 키링 구조 + 웹오브트러스트"
      />

      {/* 키 4종 카드 */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KEY_TYPES.map((k) => {
          const isOpen = activeKey === k.id;
          return (
            <div
              key={k.id}
              className={`overflow-hidden rounded-xl border-2 ${k.border} transition-all`}
            >
              <button
                onClick={() => setActiveKey((v) => (v === k.id ? null : k.id))}
                className={`flex w-full items-start justify-between p-4 text-left ${k.bgLight}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Key size={16} className={k.textColor} />
                    <span className="font-bold text-gray-800 dark:text-gray-100">{k.name}</span>
                  </div>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${k.badge}`}>
                    {k.en}
                  </span>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} className="text-gray-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                      <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">{k.desc}</p>
                      <div className="mb-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                        <div className="text-xs font-bold text-gray-500 mb-0.5">용도</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">{k.usage}</div>
                      </div>
                      <div className={`rounded-lg ${k.bgLight} border ${k.border} p-2`}>
                        <div className="text-xs font-bold text-gray-500 mb-0.5">보호 방식</div>
                        <div className={`text-xs ${k.textColor}`}>{k.protection}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 키링 구조 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-800 dark:bg-rose-900/20">
          <div className="mb-3 flex items-center gap-2">
            <User size={18} className="text-rose-600" />
            <h3 className="font-bold text-rose-700 dark:text-rose-300">개인키링 (Private Key Ring)</h3>
          </div>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            자신의 공개키-개인키 쌍들을 저장하는 저장소. 여러 키 쌍을 관리 가능.
          </p>
          <div className="space-y-2">
            {[
              { label: "키 ID", val: "각 키 쌍의 고유 식별자" },
              { label: "타임스탬프", val: "키 쌍 생성 시각" },
              { label: "공개키", val: "자신의 공개키 저장" },
              { label: "개인키", val: "암호구문으로 암호화하여 저장" },
              { label: "사용자 ID", val: "자신의 이메일 주소 등" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2 text-xs">
                <span className="w-20 shrink-0 font-semibold text-rose-600 dark:text-rose-400">{row.label}</span>
                <span className="text-gray-600 dark:text-gray-400">{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="mb-3 flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <h3 className="font-bold text-blue-700 dark:text-blue-300">공개키링 (Public Key Ring)</h3>
          </div>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            통신 상대방들의 공개키를 저장하는 저장소. 신뢰 수준 정보 포함.
          </p>
          <div className="space-y-2">
            {[
              { label: "키 ID", val: "상대방 키의 고유 식별자" },
              { label: "공개키", val: "상대방의 공개키" },
              { label: "사용자 ID", val: "상대방 이메일 등" },
              { label: "신뢰 수준", val: "완전/한계/신뢰없음" },
              { label: "서명 목록", val: "이 공개키를 보증한 서명자들" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2 text-xs">
                <span className="w-20 shrink-0 font-semibold text-blue-600 dark:text-blue-400">{row.label}</span>
                <span className="text-gray-600 dark:text-gray-400">{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 신뢰 모델 토글 */}
      <div className="mb-4 flex items-center gap-3">
        <h3 className="font-bold text-gray-800 dark:text-gray-100">신뢰 모델 비교</h3>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden dark:border-gray-700">
          <button
            onClick={() => setTrustModel("wot")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              trustModel === "wot"
                ? "bg-rose-600 text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            웹오브트러스트 (PGP)
          </button>
          <button
            onClick={() => setTrustModel("ca")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              trustModel === "ca"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            PKI/CA (S/MIME)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {trustModel === "wot" ? (
          <motion.div
            key="wot"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-rose-200 bg-white p-5 dark:border-rose-800 dark:bg-gray-900"
          >
            <div className="mb-3">
              <h4 className="font-bold text-rose-700 dark:text-rose-300">
                웹오브트러스트 (Web of Trust) — PGP 특유의 분산 신뢰 모델
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                사용자들이 서로의 공개키에 서명(보증)하여 신뢰 네트워크를 형성. 내가 신뢰하는 사람이 보증한 키는 간접적으로 신뢰 가능.
              </p>
            </div>

            {/* SVG 신뢰 다이어그램 */}
            <div className="mb-4 overflow-x-auto rounded-xl bg-gray-50 dark:bg-gray-800 p-4">
              <svg viewBox="0 0 460 230" className="w-full max-w-lg mx-auto" style={{ minWidth: 300 }}>
                {/* 간접 신뢰선 (점선) */}
                <line
                  x1={WOT_NODES[0].x} y1={WOT_NODES[0].y}
                  x2={WOT_NODES[2].x} y2={WOT_NODES[2].y}
                  stroke="#e11d48" strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5}
                />
                <text x={230} y={85} textAnchor="middle" fontSize={9} fill="#e11d48" opacity={0.8}>간접 신뢰</text>

                {/* Alice → Bob */}
                <line
                  x1={WOT_NODES[0].x + 20} y1={WOT_NODES[0].y - 10}
                  x2={WOT_NODES[1].x - 20} y2={WOT_NODES[1].y + 10}
                  stroke={TRUST_COLORS.full} strokeWidth={2.5}
                />
                <text x={155} y={62} textAnchor="middle" fontSize={9} fill={TRUST_COLORS.full}>완전 신뢰</text>

                {/* Bob → Carol */}
                <line
                  x1={WOT_NODES[1].x + 20} y1={WOT_NODES[1].y + 10}
                  x2={WOT_NODES[2].x - 20} y2={WOT_NODES[2].y - 10}
                  stroke={TRUST_COLORS.full} strokeWidth={2.5}
                />
                <text x={305} y={62} textAnchor="middle" fontSize={9} fill={TRUST_COLORS.full}>서명(보증)</text>

                {/* Alice → Dave */}
                <line
                  x1={WOT_NODES[0].x + 20} y1={WOT_NODES[0].y + 10}
                  x2={WOT_NODES[3].x - 20} y2={WOT_NODES[3].y - 10}
                  stroke={TRUST_COLORS.marginal} strokeWidth={2}
                  strokeDasharray="4,3"
                />
                <text x={155} y={150} textAnchor="middle" fontSize={9} fill={TRUST_COLORS.marginal}>한계 신뢰</text>

                {/* 노드 */}
                {WOT_NODES.map((n) => (
                  <g key={n.id}>
                    <circle cx={n.x} cy={n.y} r={24} fill={n.color} opacity={0.15} />
                    <circle cx={n.x} cy={n.y} r={18} fill={n.color} />
                    <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={11} fontWeight="bold">
                      {n.name[0]}
                    </text>
                    <text x={n.x} y={n.y + 32} textAnchor="middle" fontSize={11} fill="#374151">
                      {n.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* 흐름 설명 */}
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm dark:border-rose-800 dark:bg-rose-900/20">
              <strong className="text-rose-700 dark:text-rose-300">신뢰 전파: </strong>
              <span className="text-gray-700 dark:text-gray-300">
                Alice가 Bob을 완전 신뢰 → Bob이 Carol의 공개키에 서명(보증) → Alice는 Carol을 간접 신뢰
              </span>
            </div>

            {/* 신뢰 수준 배지 */}
            <div className="flex flex-wrap gap-2">
              {[
                { level: "완전 신뢰", en: "Full Trust", color: "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300", desc: "이 사람이 보증한 모든 공개키를 신뢰" },
                { level: "한계 신뢰", en: "Marginal Trust", color: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300", desc: "한계 신뢰자 2~3명이 공동 보증해야 신뢰" },
                { level: "신뢰 없음", en: "No Trust", color: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400", desc: "이 사람의 보증을 신뢰하지 않음" },
              ].map((t) => (
                <div key={t.level} className={`rounded-lg border px-3 py-2 ${t.color}`}>
                  <div className="text-xs font-bold">{t.level} <span className="font-normal opacity-70">({t.en})</span></div>
                  <div className="text-xs opacity-80 mt-0.5">{t.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ca"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-blue-200 bg-white p-5 dark:border-blue-800 dark:bg-gray-900"
          >
            <div className="mb-3">
              <h4 className="font-bold text-blue-700 dark:text-blue-300">
                PKI/CA — S/MIME의 중앙 집중 신뢰 모델
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                인증기관(CA, Certificate Authority)이 X.509 인증서를 발급하여 공개키와 신원을 공식 인증. 모든 참여자가 CA를 신뢰.
              </p>
            </div>

            {/* CA 계층 다이어그램 */}
            <div className="mb-4 overflow-x-auto rounded-xl bg-gray-50 dark:bg-gray-800 p-4">
              <svg viewBox="0 0 400 180" className="w-full max-w-md mx-auto">
                {/* Root CA */}
                <rect x={150} y={10} width={100} height={40} rx={8} fill="#2563eb" />
                <text x={200} y={35} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">Root CA</text>

                {/* 선 */}
                <line x1={140} y1={50} x2={90} y2={90} stroke="#60a5fa" strokeWidth={2} />
                <line x1={200} y1={50} x2={200} y2={90} stroke="#60a5fa" strokeWidth={2} />
                <line x1={260} y1={50} x2={310} y2={90} stroke="#60a5fa" strokeWidth={2} />

                {/* Sub CA들 */}
                {[
                  { x: 50, label: "Sub CA" },
                  { x: 160, label: "Sub CA" },
                  { x: 270, label: "Sub CA" },
                ].map((ca, i) => (
                  <g key={i}>
                    <rect x={ca.x} y={90} width={80} height={34} rx={6} fill="#3b82f6" />
                    <text x={ca.x + 40} y={112} textAnchor="middle" fill="white" fontSize={10}>{ca.label}</text>
                  </g>
                ))}

                {/* 사용자들 */}
                <line x1={90} y1={124} x2={70} y2={155} stroke="#93c5fd" strokeWidth={1.5} />
                <line x1={90} y1={124} x2={110} y2={155} stroke="#93c5fd" strokeWidth={1.5} />
                {[
                  { x: 50, name: "Alice" },
                  { x: 90, name: "Bob" },
                  { x: 160, name: "Carol" },
                  { x: 270, name: "Dave" },
                ].map((u, i) => (
                  <g key={i}>
                    <circle cx={u.x + 15} cy={160} r={12} fill="#6b7280" />
                    <text x={u.x + 15} y={177} textAnchor="middle" fill="#374151" fontSize={9}>{u.name}</text>
                  </g>
                ))}

                {/* X.509 라벨 */}
                <rect x={155} y={140} width={90} height={22} rx={4} fill="#dbeafe" />
                <text x={200} y={155} textAnchor="middle" fill="#1d4ed8" fontSize={9} fontWeight="bold">X.509 인증서 발급</text>
              </svg>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "신뢰 기반", val: "중앙 CA 기관", color: "text-blue-700 dark:text-blue-300" },
                { label: "인증서", val: "X.509 표준 인증서", color: "text-blue-700 dark:text-blue-300" },
                { label: "적합 환경", val: "기업·조직 이메일", color: "text-blue-700 dark:text-blue-300" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="text-xs font-bold text-gray-500">{item.label}</div>
                  <div className={`text-sm font-semibold ${item.color}`}>{item.val}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3 dark:bg-blue-900/20 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong className="text-blue-700 dark:text-blue-300">CA 신뢰 모델의 장점: </strong>
                이메일 클라이언트에 내장되어 별도 설정 없이 사용 가능. 기업 환경에서 IT팀이 중앙 관리.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
