"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const media = [
  {
    name: "꼬임선 케이블",
    eng: "Twisted Pair Cable",
    color: "bg-blue-500",
    structure: ["구리선 (정보 전송)", "구리선 (접지)", "절연체", "외피"],
    features: [
      { label: "종류", value: "UTP (비차폐) / STP (차폐)" },
      { label: "용도", value: "전화 시스템, 건물 내 통신, PBX" },
      { label: "전선 굵기", value: "0.015 ~ 0.056인치" },
      { label: "장점", value: "가격 저렴, 설치 용이" },
      { label: "단점", value: "거리·대역폭·전송률 제약, 간섭에 민감" },
    ],
    svgContent: (
      <g>
        <path d="M40,70 Q60,50 80,70 Q100,90 120,70 Q140,50 160,70 Q180,90 200,70 Q220,50 240,70" stroke="#3b82f6" strokeWidth="3" fill="none" />
        <path d="M40,80 Q60,100 80,80 Q100,60 120,80 Q140,100 160,80 Q180,60 200,80 Q220,100 240,80" stroke="#ef4444" strokeWidth="3" fill="none" />
        <text x="150" y="120" textAnchor="middle" fontSize="10" fill="#6b7280">두 가닥이 균일하게 꼬여 간섭을 상쇄</text>
      </g>
    ),
  },
  {
    name: "동축 케이블",
    eng: "Coaxial Cable",
    color: "bg-amber-500",
    structure: ["중심 도체 (심선)", "폴리에틸렌 절연체", "원통형 외부 도체", "외피"],
    features: [
      { label: "종류", value: "기저대역(50Ω, 디지털) / 광대역(70Ω, 아날로그)" },
      { label: "용도", value: "장거리 전화, CATV, LAN, FDM 시 1만 개+ 음성채널" },
      { label: "전송속도", value: "수십Mbps ~ 500Mbps" },
      { label: "장점", value: "차폐성 우수, 넓은 주파수 범위" },
      { label: "단점", value: "감쇠현상, 열 잡음, 상호변조 잡음" },
    ],
    svgContent: (
      <g>
        <ellipse cx="150" cy="75" rx="70" ry="50" fill="#f59e0b" opacity="0.15" stroke="#d97706" strokeWidth="2" />
        <ellipse cx="150" cy="75" rx="50" ry="35" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
        <ellipse cx="150" cy="75" rx="30" ry="20" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
        <circle cx="150" cy="75" r="8" fill="#d97706" />
        <text x="150" y="140" textAnchor="middle" fontSize="9" fill="#6b7280">중심도체 - 절연체 - 외부도체 - 외피</text>
      </g>
    ),
  },
  {
    name: "광섬유 케이블",
    eng: "Optical Fiber Cable",
    color: "bg-emerald-500",
    structure: ["코어 (core)", "클래딩 (cladding)", "완충재", "외피 (jacket)"],
    features: [
      { label: "원리", value: "빛의 전반사(total internal reflection) 이용" },
      { label: "용도", value: "고속 장거리 통신, 해저 케이블" },
      { label: "장점", value: "넓은 대역폭, 전자기 간섭 없음, 도청 어려움" },
      { label: "단점", value: "설치 비용 높음, 접속 기술 필요" },
      { label: "전송속도", value: "수 Gbps ~ Tbps" },
    ],
    svgContent: (
      <g>
        <rect x="40" y="50" width="220" height="50" rx="25" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        <rect x="60" y="58" width="180" height="34" rx="17" fill="#a7f3d0" stroke="#10b981" strokeWidth="1" />
        <rect x="90" y="65" width="120" height="20" rx="10" fill="#6ee7b7" stroke="#059669" strokeWidth="1" />
        <line x1="100" y1="75" x2="200" y2="75" stroke="#059669" strokeWidth="2" />
        <text x="150" y="120" textAnchor="middle" fontSize="9" fill="#6b7280">코어 - 클래딩 - 완충재 - 외피</text>
        <path d="M100,70 L110,80 L120,70 L130,80 L140,70 L150,80 L160,70 L170,80 L180,70 L190,80 L200,70" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.7" />
      </g>
    ),
  },
];

export default function TransmissionMedia() {
  const [active, setActive] = useState(0);
  const m = media[active];

  return (
    <section>
      <SectionTitle
        title="전송 매체"
        subtitle="유선 매체의 구조와 특성 비교"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex gap-2">
          {media.map((med, i) => (
            <button
              key={med.name}
              onClick={() => setActive(i)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                active === i ? `${med.color} text-white` : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {med.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <svg viewBox="0 0 300 150" className="w-full">
              {m.svgContent}
            </svg>
          </div>

          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold">{m.name} <span className="text-sm text-gray-400">({m.eng})</span></h3>
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              <p className="font-medium text-gray-700 dark:text-gray-300">구조: {m.structure.join(" → ")}</p>
            </div>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {m.features.map((f, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-1.5 pr-3 font-medium text-gray-500">{f.label}</td>
                    <td className="py-1.5 text-gray-700 dark:text-gray-300">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
