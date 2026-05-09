"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ToggleLeft, ToggleRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Algorithm {
  id: string;
  function: string;
  algo: string;
  desc: string;
  detail: string;
  keySize?: string;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  badge: string;
}

const ALGORITHMS: Algorithm[] = [
  {
    id: "sign",
    function: "디지털서명",
    algo: "RSA, ECDSA",
    desc: "발신자 신원 인증 + 메시지 무결성 보장",
    detail:
      "RSA: 큰 소수의 곱을 이용한 공개키 암호화. ECDSA: 타원 곡선 암호화 기반 서명. 해시(SHA-256/512)를 개인키로 암호화해 서명 생성. 수신자는 발신자 공개키로 복호화 후 해시 비교.",
    keySize: "RSA 2048비트 이상 권장",
    color: "bg-rose-500",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-400",
    textColor: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-800/40 dark:text-rose-300",
  },
  {
    id: "keyex",
    function: "키 교환",
    algo: "RSA, ECDH",
    desc: "세션키를 안전하게 수신자에게 전달",
    detail:
      "RSA 방식: 세션키를 수신자 공개키로 암호화하여 전송. ECDH(Elliptic Curve Diffie-Hellman): 쌍방이 공개 정보를 교환하여 공유 비밀키 도출. 직접 키를 전송하지 않고도 키 합의 가능.",
    color: "bg-orange-500",
    bgLight: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-400",
    textColor: "text-orange-700 dark:text-orange-300",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-800/40 dark:text-orange-300",
  },
  {
    id: "hash",
    function: "해시",
    algo: "SHA-256, SHA-512",
    desc: "메시지 무결성 확인용 다이제스트 생성",
    detail:
      "SHA-256: 256비트(32바이트) 해시값 출력. SHA-512: 512비트(64바이트) 출력, 충돌 저항성 높음. 입력이 1비트만 바뀌어도 출력이 완전히 달라지는 눈사태 효과(Avalanche Effect). 역산 불가능.",
    keySize: "SHA-256 권장, SHA-512 고보안 환경",
    color: "bg-emerald-500",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-400",
    textColor: "text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300",
  },
  {
    id: "encrypt",
    function: "암호화",
    algo: "AES",
    desc: "메시지 본문의 기밀성 보장",
    detail:
      "AES(Advanced Encryption Standard): 대칭키 블록 암호. 128비트 블록 크기, 키 길이 128/192/256비트 선택. 고속 처리 가능하며 현재 가장 널리 사용되는 대칭 암호 표준. CBC/GCM 등 운용 모드와 함께 사용.",
    keySize: "AES-128 이상 (AES-256 권장)",
    color: "bg-blue-500",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-300",
  },
];

const COMPARISON = [
  {
    item: "신뢰 모델",
    pgp: "웹오브트러스트 (분산 — 사용자 상호 보증)",
    smime: "PKI/CA (중앙 집중 — CA가 인증서 발급)",
    pgpGood: false,
  },
  {
    item: "인증서",
    pgp: "없음 (공개키를 직접 배포·교환)",
    smime: "X.509 표준 인증서 사용",
    pgpGood: false,
  },
  {
    item: "사용 편의성",
    pgp: "별도 설치·설정 필요, 복잡함",
    smime: "이메일 클라이언트 내장, 편리함",
    pgpGood: false,
  },
  {
    item: "기업 환경",
    pgp: "부적합 (관리 어려움)",
    smime: "적합 (중앙 관리 가능)",
    pgpGood: false,
  },
  {
    item: "분산 특성",
    pgp: "중앙 서버 의존 없음 (탈중앙화)",
    smime: "CA에 의존",
    pgpGood: true,
  },
  {
    item: "개인 사용",
    pgp: "기술 이해자에게 적합",
    smime: "일반 사용자에게도 적합",
    pgpGood: false,
  },
];

export default function SMIMEFeaturesExplorer() {
  const [activeAlgo, setActiveAlgo] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  return (
    <section>
      <SectionTitle
        title="S/MIME 기능 및 알고리즘"
        subtitle="디지털서명·키 교환·해시·암호화 알고리즘 + PGP 비교"
      />

      {/* 알고리즘 인터랙티브 테이블 */}
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="py-3 pl-4 text-left text-xs font-bold uppercase text-gray-500">기능</th>
              <th className="py-3 text-left text-xs font-bold uppercase text-gray-500">알고리즘</th>
              <th className="hidden py-3 pr-4 text-left text-xs font-bold uppercase text-gray-500 sm:table-cell">설명</th>
              <th className="py-3 pr-4 text-right text-xs font-bold uppercase text-gray-500">상세</th>
            </tr>
          </thead>
          <tbody>
            {ALGORITHMS.map((a) => {
              const isOpen = activeAlgo === a.id;
              return (
                <React.Fragment key={a.id}>
                  <tr
                    onClick={() => setActiveAlgo((v) => (v === a.id ? null : a.id))}
                    className={`cursor-pointer border-t border-gray-100 transition-colors dark:border-gray-800 ${
                      isOpen ? a.bgLight : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <td className="py-3 pl-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${a.badge}`}>
                        {a.function}
                      </span>
                    </td>
                    <td className={`py-3 font-mono text-sm font-bold ${a.textColor}`}>
                      {a.algo}
                    </td>
                    <td className="hidden py-3 pr-4 text-gray-500 sm:table-cell">{a.desc}</td>
                    <td className="py-3 pr-4 text-right">
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                      >
                        <ChevronDown size={16} className="text-gray-400" />
                      </motion.div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${a.id}-detail`} className={a.bgLight}>
                      <td colSpan={4} className="px-4 pb-4 pt-1">
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">{a.detail}</p>
                          {a.keySize && (
                            <div className={`inline-block rounded-lg border ${a.border} px-3 py-1.5 text-xs`}>
                              <span className="font-bold text-gray-500">권장 키 크기: </span>
                              <span className={a.textColor}>{a.keySize}</span>
                            </div>
                          )}
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* S/MIME 동작 요약 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">S/MIME 동작 요약</h4>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { label: "원문", color: "bg-gray-200 dark:bg-gray-700" },
            { label: "→" },
            { label: "SHA 해시", color: "bg-emerald-100 dark:bg-emerald-900/40" },
            { label: "→" },
            { label: "RSA 서명", color: "bg-rose-100 dark:bg-rose-900/40" },
            { label: "→" },
            { label: "AES 암호화", color: "bg-blue-100 dark:bg-blue-900/40" },
            { label: "→" },
            { label: "RSA 키교환", color: "bg-orange-100 dark:bg-orange-900/40" },
            { label: "→" },
            { label: "MIME 전송", color: "bg-purple-100 dark:bg-purple-900/40" },
          ].map((item, i) =>
            item.color ? (
              <span
                key={i}
                className={`rounded-full px-3 py-1 font-medium text-gray-700 dark:text-gray-300 ${item.color}`}
              >
                {item.label}
              </span>
            ) : (
              <span key={i} className="text-gray-400 font-bold">
                {item.label}
              </span>
            )
          )}
        </div>
      </div>

      {/* PGP vs S/MIME 비교 토글 */}
      <div className="rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
        <button
          onClick={() => setShowCompare((v) => !v)}
          className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 text-left hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div className="flex items-center gap-2">
            {showCompare ? (
              <ToggleRight size={20} className="text-rose-600" />
            ) : (
              <ToggleLeft size={20} className="text-gray-400" />
            )}
            <span className="font-bold text-gray-800 dark:text-gray-100">
              PGP vs S/MIME 상세 비교
            </span>
          </div>
          <motion.div animate={{ rotate: showCompare ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-gray-400" />
          </motion.div>
        </button>
        <AnimatePresence>
          {showCompare && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-900">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="py-3 pl-4 text-left text-xs font-bold uppercase text-gray-500 w-1/3">항목</th>
                      <th className="py-3 text-left text-xs font-bold uppercase text-rose-600 w-1/3">PGP</th>
                      <th className="py-3 pr-4 text-left text-xs font-bold uppercase text-blue-600 w-1/3">S/MIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-50 dark:border-gray-800"
                      >
                        <td className="py-3 pl-4 font-semibold text-gray-600 dark:text-gray-400 text-xs">
                          {row.item}
                        </td>
                        <td className={`py-3 text-xs ${row.pgpGood ? "text-rose-700 dark:text-rose-300 font-medium" : "text-gray-600 dark:text-gray-400"}`}>
                          {row.pgp}
                          {row.pgpGood && (
                            <span className="ml-1 inline-block rounded bg-rose-100 px-1.5 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-900/40">PGP 강점</span>
                          )}
                        </td>
                        <td className={`py-3 pr-4 text-xs ${!row.pgpGood ? "text-blue-700 dark:text-blue-300 font-medium" : "text-gray-600 dark:text-gray-400"}`}>
                          {row.smime}
                          {!row.pgpGood && (
                            <span className="ml-1 inline-block rounded bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-900/40">S/MIME 강점</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 pb-4 pt-2">
                  <p className="text-xs text-gray-400 italic">
                    * PGP: 개인 사용자·오픈소스 커뮤니티에 적합 / S/MIME: 기업·조직 환경에 적합
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
