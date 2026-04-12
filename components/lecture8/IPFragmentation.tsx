"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const HEADER_SIZE = 20;

interface Fragment {
  index: number;
  dataLen: number;
  offset: number;
  mf: 0 | 1;
}

export default function IPFragmentation() {
  const [totalData, setTotalData] = useState(1400);
  const [mtu, setMtu] = useState(620);
  const [assembled, setAssembled] = useState(false);

  const fragments = useMemo<Fragment[]>(() => {
    const maxDataPerFrag = Math.floor((mtu - HEADER_SIZE) / 8) * 8; // multiple of 8
    if (maxDataPerFrag <= 0) return [];
    const frags: Fragment[] = [];
    let remaining = totalData;
    let offsetBytes = 0;
    let idx = 0;
    while (remaining > 0) {
      const dataLen = Math.min(maxDataPerFrag, remaining);
      remaining -= dataLen;
      frags.push({
        index: idx++,
        dataLen,
        offset: offsetBytes,
        mf: remaining > 0 ? 1 : 0,
      });
      offsetBytes += dataLen;
    }
    return frags;
  }, [totalData, mtu]);

  const scenario = (data: number, m: number) => {
    setTotalData(data);
    setMtu(m);
    setAssembled(false);
  };

  return (
    <section>
      <SectionTitle
        title="IP 단편화 (Fragmentation)"
        subtitle="MTU에 맞춰 데이터그램을 분할하고 목적지에서 재조립"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Topology */}
        <div className="mb-5 rounded-lg bg-pink-50/50 p-4 dark:bg-pink-950/20">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="text-center">
              <div className="rounded-full bg-pink-500 px-3 py-1 text-white">호스트 A</div>
              <div className="mt-1 text-gray-500">MTU 1500</div>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-pink-300 dark:border-pink-700" />
            <div className="text-center">
              <div className="rounded-full bg-pink-500 px-3 py-1 text-white">R_A</div>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-pink-300 dark:border-pink-700" />
            <div className="text-center">
              <div className="rounded-full bg-amber-500 px-3 py-1 text-white">Net2</div>
              <div className="mt-1 text-gray-500">MTU {mtu}</div>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-pink-300 dark:border-pink-700" />
            <div className="text-center">
              <div className="rounded-full bg-pink-500 px-3 py-1 text-white">R_B</div>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-pink-300 dark:border-pink-700" />
            <div className="text-center">
              <div className="rounded-full bg-pink-500 px-3 py-1 text-white">호스트 B</div>
              <div className="mt-1 text-gray-500">재조립</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">
              원본 데이터 길이: <span className="font-mono text-pink-600">{totalData} byte</span>
            </label>
            <input
              type="range"
              min="200"
              max="4000"
              step="100"
              value={totalData}
              onChange={(e) => {
                setTotalData(Number(e.target.value));
                setAssembled(false);
              }}
              className="w-full accent-pink-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">
              Net2 MTU: <span className="font-mono text-pink-600">{mtu} byte</span>
            </label>
            <input
              type="range"
              min="128"
              max="1500"
              step="4"
              value={mtu}
              onChange={(e) => {
                setMtu(Number(e.target.value));
                setAssembled(false);
              }}
              className="w-full accent-pink-500"
            />
          </div>
        </div>

        {/* Preset scenarios */}
        <div className="mb-5 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => scenario(1400, 620)}
            className="rounded-md bg-pink-500 px-3 py-1.5 font-medium text-white hover:bg-pink-600"
          >
            그림 6.10 시나리오 (1400 B, MTU 620)
          </button>
          <button
            onClick={() => scenario(3000, 1500)}
            className="rounded-md bg-gray-100 px-3 py-1.5 font-medium dark:bg-gray-800"
          >
            Ethernet만 (1500)
          </button>
          <button
            onClick={() => scenario(512, 128)}
            className="rounded-md bg-gray-100 px-3 py-1.5 font-medium dark:bg-gray-800"
          >
            X.25 (128)
          </button>
        </div>

        {/* Original datagram */}
        <div className="mb-3 text-xs font-semibold text-gray-600 dark:text-gray-400">원본 데이터그램</div>
        <div className="mb-5 flex h-8 overflow-hidden rounded border border-gray-300 dark:border-gray-700">
          <div className="flex items-center justify-center bg-gray-300 px-2 text-[10px] font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            H 20
          </div>
          <div className="flex flex-1 items-center justify-center bg-pink-200 text-[10px] font-semibold text-pink-800 dark:bg-pink-900/50 dark:text-pink-200">
            Data {totalData} byte
          </div>
        </div>

        {/* Fragments */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {assembled ? "목적지에서 재조립됨" : `단편 ${fragments.length}개`}
          </div>
          <button
            onClick={() => setAssembled((a) => !a)}
            className="rounded-md bg-pink-500 px-3 py-1 text-xs font-medium text-white hover:bg-pink-600"
          >
            {assembled ? "다시 단편화" : "재조립 애니메이션 ▶"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!assembled ? (
            <motion.div
              key="frags"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {fragments.map((f, i) => (
                <motion.div
                  key={f.index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-24 shrink-0 text-xs font-mono text-gray-500">
                    Fragment {f.index + 1}
                  </div>
                  <div
                    className="flex h-8 overflow-hidden rounded border border-gray-300 dark:border-gray-700"
                    style={{ width: `${Math.max(15, (f.dataLen / Math.max(totalData, mtu)) * 80 + 8)}%` }}
                  >
                    <div className="flex items-center justify-center bg-gray-300 px-2 text-[10px] font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      H
                    </div>
                    <div className="flex flex-1 items-center justify-center bg-pink-300 text-[10px] font-semibold text-pink-900 dark:bg-pink-800/60 dark:text-pink-200">
                      {f.dataLen} B
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    MF=<span className={f.mf ? "font-bold text-pink-600" : "font-bold text-gray-500"}>{f.mf}</span>
                    <span className="mx-2">·</span>
                    offset=<span className="font-bold text-pink-600">{f.offset}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="assembled"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-10 overflow-hidden rounded border-2 border-pink-500"
            >
              <div className="flex items-center justify-center bg-gray-300 px-2 text-[10px] font-semibold dark:bg-gray-700">
                H
              </div>
              <div className="flex flex-1 items-center justify-center bg-pink-400 text-xs font-bold text-white">
                재조립된 {totalData} byte 데이터그램 (모든 단편 동일 식별자)
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 rounded-lg bg-pink-50 p-4 text-xs dark:bg-pink-950/30">
          <p className="font-semibold text-pink-700 dark:text-pink-300">핵심</p>
          <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            <li>• 단편당 데이터 크기는 <span className="font-mono">(MTU − 20) / 8 × 8</span> 의 배수</li>
            <li>• 모든 단편은 <strong>동일한 식별자</strong>를 가지며, 재조립은 <strong>목적지 호스트</strong>에서만 수행</li>
            <li>• MF=1: 뒤에 더 단편이 존재 · MF=0: 마지막 단편</li>
            <li>• 단편 오프셋: 원본 데이터 내의 시작 바이트 위치 (IP 헤더 필드값 = offset ÷ 8 로 저장, 13비트)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
