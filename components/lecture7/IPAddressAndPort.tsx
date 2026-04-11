"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type IPClass = "A" | "B" | "C" | "D" | "E";

interface ClassDef {
  key: IPClass;
  leading: string;
  netBits: number; // including leading bits portion of net id (for display)
  hostBits: number;
  use: string;
  example: string;
  rangeFirstByte: string;
  color: string;
}

const classes: ClassDef[] = [
  {
    key: "A",
    leading: "0",
    netBits: 7,
    hostBits: 24,
    use: "대규모 네트워크",
    example: "10.0.0.1",
    rangeFirstByte: "0 ~ 127",
    color: "bg-red-500",
  },
  {
    key: "B",
    leading: "10",
    netBits: 14,
    hostBits: 16,
    use: "중규모 네트워크",
    example: "172.16.0.1",
    rangeFirstByte: "128 ~ 191",
    color: "bg-orange-500",
  },
  {
    key: "C",
    leading: "110",
    netBits: 21,
    hostBits: 8,
    use: "소규모 네트워크",
    example: "192.168.1.1",
    rangeFirstByte: "192 ~ 223",
    color: "bg-lime-500",
  },
  {
    key: "D",
    leading: "1110",
    netBits: 28, // full 28 bits = multicast address
    hostBits: 0,
    use: "멀티캐스트용",
    example: "224.0.0.1",
    rangeFirstByte: "224 ~ 239",
    color: "bg-teal-500",
  },
  {
    key: "E",
    leading: "1111",
    netBits: 28,
    hostBits: 0,
    use: "예약 (실험/연구용)",
    example: "240.0.0.0",
    rangeFirstByte: "240 ~ 255",
    color: "bg-purple-500",
  },
];

interface PortEntry {
  port: number;
  name: string;
  protocol: string;
  category: string;
}

const ports: PortEntry[] = [
  { port: 21, name: "FTP", protocol: "TCP", category: "well-known (1~255)" },
  { port: 23, name: "Telnet", protocol: "TCP", category: "well-known (1~255)" },
  { port: 25, name: "SMTP", protocol: "TCP", category: "well-known (1~255)" },
  { port: 69, name: "TFTP", protocol: "UDP", category: "well-known (1~255)" },
  { port: 103, name: "X.400", protocol: "TCP", category: "well-known (1~255)" },
];

const portCategories = [
  { range: "0", use: "사용되지 않음", color: "text-gray-400" },
  { range: "1 ~ 255", use: "well-known service", color: "text-red-500" },
  { range: "256 ~ 1,023", use: "기타 well-known service", color: "text-orange-500" },
  { range: "1,024 ~ 4,999", use: "임시 client 포트", color: "text-lime-600" },
  { range: "5,000 ~ 65,535", use: "사용자 정의 server", color: "text-purple-500" },
];

export default function IPAddressAndPort() {
  const [selectedClass, setSelectedClass] = useState<IPClass>("A");
  const [query, setQuery] = useState("");

  const cls = classes.find((c) => c.key === selectedClass)!;

  // Build 32 bits representation based on class
  const bits = useMemo(() => {
    const result: { val: string; type: "lead" | "net" | "host" | "mcast" | "rsv" }[] = [];
    // Leading bits
    for (const b of cls.leading) result.push({ val: b, type: "lead" });
    // Remaining bits in first byte + following
    const remaining = 32 - cls.leading.length;
    let netRemain = cls.netBits;
    let hostRemain = cls.hostBits;
    if (cls.key === "D") {
      for (let i = 0; i < remaining; i++) result.push({ val: "m", type: "mcast" });
    } else if (cls.key === "E") {
      for (let i = 0; i < remaining; i++) result.push({ val: "r", type: "rsv" });
    } else {
      for (let i = 0; i < netRemain; i++) result.push({ val: "N", type: "net" });
      for (let i = 0; i < hostRemain; i++) result.push({ val: "H", type: "host" });
    }
    return result;
  }, [cls]);

  const filteredPorts = useMemo(() => {
    if (!query.trim()) return ports;
    const q = query.toLowerCase();
    return ports.filter(
      (p) =>
        String(p.port).includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.protocol.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <section>
      <SectionTitle
        title="인터넷 주소: IP 주소 클래스 & 포트 번호"
        subtitle="IPv4 32비트 주소는 선두 비트 패턴에 따라 A~E 5개 클래스로 구분. 포트 번호는 16비트로 프로세스를 식별."
      />

      {/* 3 address kinds */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {[
          { name: "물리주소", desc: "네트워크 인터페이스(MAC). 48비트. 같은 네트워크 내 호스트 식별", size: "48 bit" },
          { name: "인터넷 주소 (IP)", desc: "서로 다른 네트워크 간 호스트 식별. 논리주소. IPv4 32비트", size: "32 bit" },
          { name: "포트 주소", desc: "프로세스 식별. TCP/UDP가 응용 프로그램 구분에 사용", size: "16 bit" },
        ].map((a) => (
          <div
            key={a.name}
            className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {a.name}
              </span>
              <span className="rounded-full bg-lime-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-lime-700 dark:bg-lime-950 dark:text-lime-300">
                {a.size}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">{a.desc}</p>
          </div>
        ))}
      </div>

      {/* IP class tabs */}
      <div className="mb-3 flex flex-wrap gap-2">
        {classes.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedClass(c.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              selectedClass === c.key
                ? `${c.color} text-white`
                : "border border-gray-300 bg-white text-gray-600 hover:border-lime-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            }`}
          >
            Class {c.key}
          </button>
        ))}
      </div>

      {/* 32-bit visualization */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  Class {cls.key}
                </span>
                <span className="ml-2 text-xs text-gray-500">{cls.use}</span>
              </div>
              <span className="font-mono text-xs text-gray-500">
                1st byte: {cls.rangeFirstByte}
              </span>
            </div>

            {/* Byte markers */}
            <div className="mb-1 grid grid-cols-4 gap-1 text-center text-[9px] text-gray-400">
              <span>Byte 1 (8)</span>
              <span>Byte 2 (16)</span>
              <span>Byte 3 (24)</span>
              <span>Byte 4 (32)</span>
            </div>
            {/* Bits */}
            <div className="grid grid-cols-32 gap-[2px]">
              {bits.map((b, i) => {
                const palette: Record<string, string> = {
                  lead: "bg-lime-500 text-white",
                  net: "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
                  host: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
                  mcast: "bg-teal-300 text-teal-900 dark:bg-teal-800 dark:text-teal-100",
                  rsv: "bg-purple-300 text-purple-900 dark:bg-purple-800 dark:text-purple-100",
                };
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.008, duration: 0.15 }}
                    className={`flex h-6 items-center justify-center rounded-sm font-mono text-[9px] font-bold ${palette[b.type]}`}
                  >
                    {b.val}
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
              <Legend color="bg-lime-500" label={`선두 비트 (${cls.leading})`} />
              {cls.key === "A" || cls.key === "B" || cls.key === "C" ? (
                <>
                  <Legend
                    color="bg-blue-200 dark:bg-blue-800"
                    label={`네트워크 식별자 ${cls.netBits}bit`}
                  />
                  <Legend
                    color="bg-gray-200 dark:bg-gray-700"
                    label={`호스트 식별자 ${cls.hostBits}bit`}
                  />
                </>
              ) : cls.key === "D" ? (
                <Legend color="bg-teal-300 dark:bg-teal-800" label="멀티캐스트 주소 28bit" />
              ) : (
                <Legend color="bg-purple-300 dark:bg-purple-800" label="예약 28bit" />
              )}
            </div>

            <div className="mt-3 rounded-md bg-gray-50 p-2 text-xs dark:bg-gray-800">
              <b>예시</b>:{" "}
              <span className="font-mono text-gray-700 dark:text-gray-300">{cls.example}</span>
              <span className="ml-2 text-gray-500">· {cls.use}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* IPv6 note */}
      <div className="mt-4 rounded-lg border border-lime-200 bg-lime-50 p-4 text-xs dark:border-lime-900 dark:bg-lime-950/30">
        <div className="font-semibold text-lime-700 dark:text-lime-300">
          IPv6 (IP version 6)
        </div>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          <b>16바이트(128비트)</b> 주소 체계로 확장. 총 주소 수 ={" "}
          <span className="font-mono">2¹²⁸ ≈ 3.4 × 10³⁸</span>개 — IPv4 고갈 문제를 해결하는 차세대 표준.
        </p>
      </div>

      {/* Port numbers */}
      <div className="mt-8">
        <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">
          포트 번호 (16비트 · 0 ~ 65,535)
        </h3>

        <div className="grid gap-2 md:grid-cols-5">
          {portCategories.map((c) => (
            <div
              key={c.range}
              className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className={`font-mono text-xs font-bold ${c.color}`}>{c.range}</div>
              <div className="mt-1 text-[11px] text-gray-600 dark:text-gray-400">{c.use}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-lime-500 dark:border-gray-700 dark:bg-gray-900">
            <Search size={14} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="포트 번호 또는 서비스 이름으로 검색 (예: 21, FTP)"
              className="flex-1 bg-transparent text-xs outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[10px] text-gray-400 hover:text-gray-600"
              >
                clear
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">
                    서비스
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">
                    프로토콜
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">
                    포트
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">
                    분류
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPorts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-gray-400">
                      검색 결과 없음
                    </td>
                  </tr>
                ) : (
                  filteredPorts.map((p) => (
                    <tr
                      key={p.port}
                      className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
                    >
                      <td className="px-3 py-2 font-semibold text-gray-900 dark:text-gray-100">
                        {p.name}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            p.protocol === "TCP"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                          }`}
                        >
                          {p.protocol}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-lime-700 dark:text-lime-400">
                        {p.port}
                      </td>
                      <td className="px-3 py-2 text-gray-500">{p.category}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Override Tailwind for 32-column grid */}
      <style jsx>{`
        .grid-cols-32 {
          grid-template-columns: repeat(32, minmax(0, 1fr));
        }
      `}</style>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-3 w-3 rounded-sm ${color}`} />
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}
