"use client";

import { useState } from "react";
import { Calculator, ArrowRightLeft, ArrowLeftRight, Hash } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import AITerm from "./AITerm";

/**
 * 거리 ↔ 시간 변환 인터랙티브
 * (과제 수치와 무관한 예시 값)
 */

export default function CostConversionTips() {
  const [dist, setDist] = useState<string>("12");
  const [speed, setSpeed] = useState<string>("60");
  const [straightDist, setStraightDist] = useState<string>("9");
  const [maxSpeed, setMaxSpeed] = useState<string>("80");

  const distN = parseFloat(dist) || 0;
  const speedN = parseFloat(speed) || 1;
  const timeH = distN / speedN;

  const sdistN = parseFloat(straightDist) || 0;
  const maxN = parseFloat(maxSpeed) || 1;
  const hTime = sdistN / maxN;

  return (
    <section>
      <SectionTitle
        title="거리 ↔ 시간 비용 · 휴리스틱 변환 팁"
        subtitle="단위 변환의 원리와 반올림 함정, 허용성 유지 조건"
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        {/* 거리→시간 계산기 */}
        <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-600">
            <ArrowRightLeft size={14} /> 엣지 비용: 거리 → 시간
          </div>
          <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            한 엣지의 거리와 해당 구간 시속을 입력하면 시간 비용이 계산됨.
          </p>
          <div className="space-y-2">
            <LabeledInput label="거리 (km)" value={dist} onChange={setDist} />
            <LabeledInput label="시속 (km/h)" value={speed} onChange={setSpeed} />
            <div className="rounded-lg bg-indigo-50 p-3 text-xs dark:bg-indigo-950/30">
              <div className="font-mono">
                시간 = {distN} / {speedN} ={" "}
                <b>{timeH.toFixed(4)}</b> h
              </div>
              <div className="mt-1 text-[10px] text-gray-500">
                분수 표기: <b>{distN}/{speedN}</b> h (반올림 금지 권장)
              </div>
            </div>
          </div>
        </div>

        {/* 휴리스틱 변환 계산기 */}
        <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-600">
            <Calculator size={14} /> 휴리스틱: 거리 → 시간
          </div>
          <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            직선거리와 <b>최대 속도</b>로 허용적 시간 휴리스틱 계산.
          </p>
          <div className="space-y-2">
            <LabeledInput
              label="직선거리 (km)"
              value={straightDist}
              onChange={setStraightDist}
            />
            <LabeledInput
              label="그래프 내 최대 속도 (km/h)"
              value={maxSpeed}
              onChange={setMaxSpeed}
            />
            <div className="rounded-lg bg-indigo-50 p-3 text-xs dark:bg-indigo-950/30">
              <div className="font-mono">
                h_time = {sdistN} / {maxN} = <b>{hTime.toFixed(4)}</b> h
              </div>
              <div className="mt-1 text-[10px] text-gray-500">
                분수 유지: <b>{sdistN}/{maxN}</b> h
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
          <b>함정 1: 평균 속도 vs 최대 속도</b>
          <br />
          휴리스틱 분모에 "평균 속도"를 쓰면 시간이 과대평가되어 허용성이 깨질 수 있음. 과제에서
          분모로 주어진 값이 그래프의 <b>최대 시속 이상</b>인지 스스로 확인해야 함.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
          <b>함정 2: 왕복(↔) vs 단방향</b>
          <br />
          왕복 시속이 같으면 무방향 엣지 그대로 사용. <b>단방향으로 시속이 다르다면</b> 그래프를
          방향 그래프로 모델링하고 엣지를 두 개(정방향/역방향)로 분리할 것.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
          <b>함정 3: 반올림 누적 오차</b>
          <br />
          0.1h 단위로 반올림한 뒤 합하면 진짜 경로비용과 달라질 수 있음. 최종 답을 낼 때까지{" "}
          <b>분수/소수</b>를 가능한 한 그대로 유지.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
          <b>함정 4: 거리 기준 해를 시간 기준에도 그대로 쓰지 말 것</b>
          <br />
          거리상 최단 경로가 반드시 시간상 최소 경로는 아님. <b>문제마다 새로 탐색</b>을 진행해야 함.
        </div>
      </div>

      {/* 비대칭 속도 상세 */}
      <AsymmetricSpeedTable />

      {/* 셋째 자리 반올림 정책 데모 */}
      <RoundingPolicyDemo />
    </section>
  );
}

function AsymmetricSpeedTable() {
  // 가공 예: 두 도시 X, Y 사이 거리는 같지만 방향별 시속이 다름
  const dist = 6;
  const vForward = 20; // X → Y
  const vBackward = 12; // Y → X
  const tForward = Math.round((dist / vForward) * 1000) / 1000;
  const tBackward = Math.round((dist / vBackward) * 1000) / 1000;
  return (
    <div className="mt-5 rounded-xl border-2 border-indigo-300 bg-white p-4 dark:border-indigo-800 dark:bg-gray-900">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
        <ArrowLeftRight size={14} /> 비대칭 속도 처리 (X → Y 와 Y → X 가 다름)
      </div>
      <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
        같은 물리적 간선이라도 방향에 따라 평균 시속이 다를 수 있습니다. 이
        경우 그래프를 <b>방향 그래프</b>로 모델링하고 각 방향을 <b>독립적인 간선</b>
        으로 다뤄야 합니다. 거리는 같지만 시간은 달라짐에 주의.
      </p>
      <div className="overflow-hidden rounded-lg border border-indigo-200 dark:border-indigo-900/40">
        <table className="w-full text-xs">
          <thead className="bg-indigo-50 dark:bg-indigo-950/40">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-indigo-700 dark:text-indigo-300">
                방향
              </th>
              <th className="px-3 py-2 text-left font-semibold text-indigo-700 dark:text-indigo-300">
                거리 (km)
              </th>
              <th className="px-3 py-2 text-left font-semibold text-indigo-700 dark:text-indigo-300">
                시속 (km/h)
              </th>
              <th className="px-3 py-2 text-left font-semibold text-indigo-700 dark:text-indigo-300">
                시간 (h)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white font-mono dark:bg-gray-900">
            <tr className="border-t border-indigo-100 dark:border-indigo-900/40">
              <td className="px-3 py-2">X → Y</td>
              <td className="px-3 py-2">{dist}</td>
              <td className="px-3 py-2">{vForward}</td>
              <td className="px-3 py-2 font-bold text-indigo-700 dark:text-indigo-300">
                {tForward.toFixed(3)}
              </td>
            </tr>
            <tr className="border-t border-indigo-100 dark:border-indigo-900/40">
              <td className="px-3 py-2">Y → X</td>
              <td className="px-3 py-2">{dist}</td>
              <td className="px-3 py-2">{vBackward}</td>
              <td className="px-3 py-2 font-bold text-indigo-700 dark:text-indigo-300">
                {tBackward.toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
        같은 <AITerm term="g" label="g(n)" /> 계산에서도 어느 방향으로 지나가는지에
        따라 쓰여야 할 시간 비용이 다름. 방향 헷갈림은 전형적인 실수.
      </p>
    </div>
  );
}

function RoundingPolicyDemo() {
  // 가공 예: 4개 간선 이동 시간 합
  const raw = [0.2857, 0.1333, 0.4444, 0.1818];
  const rounded3 = raw.map((v) => Math.round(v * 1000) / 1000);
  const rounded1 = raw.map((v) => Math.round(v * 10) / 10);
  const sumRaw = raw.reduce((a, b) => a + b, 0);
  const sum3 = rounded3.reduce((a, b) => a + b, 0);
  const sum1 = rounded1.reduce((a, b) => a + b, 0);
  return (
    <div className="mt-5 rounded-xl border-2 border-indigo-300 bg-white p-4 dark:border-indigo-800 dark:bg-gray-900">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
        <Hash size={14} /> 반올림 정책 데모 (셋째 자리 vs 첫째 자리)
      </div>
      <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
        동일한 시간 합을 서로 다른 반올림 정책으로 계산해 누적 오차를 비교. 과제는{" "}
        <b>셋째 자리 반올림</b>을 권장합니다.
      </p>
      <div className="grid gap-2 text-[11px] sm:grid-cols-3">
        <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/30">
          <div className="text-gray-500">원본 분수 근사</div>
          <div className="font-mono">{raw.map((v) => v.toFixed(4)).join(" + ")}</div>
          <div className="mt-1 font-mono font-bold text-indigo-700 dark:text-indigo-300">
            합 = {sumRaw.toFixed(4)}
          </div>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
          <div className="text-gray-500">셋째 자리 반올림</div>
          <div className="font-mono">{rounded3.map((v) => v.toFixed(3)).join(" + ")}</div>
          <div className="mt-1 font-mono font-bold text-emerald-700 dark:text-emerald-300">
            합 = {sum3.toFixed(3)}
          </div>
        </div>
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
          <div className="text-gray-500">첫째 자리 반올림 (위험)</div>
          <div className="font-mono">{rounded1.map((v) => v.toFixed(1)).join(" + ")}</div>
          <div className="mt-1 font-mono font-bold text-red-700 dark:text-red-300">
            합 = {sum1.toFixed(1)}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-gray-600 dark:text-gray-400">
        <b>관찰:</b> 첫째 자리 반올림은 참값({sumRaw.toFixed(4)})과 오차가 커서
        순위 뒤집힘이 발생할 수 있음. 셋째 자리 정책은 제출 가독성을 유지하면서도
        오차를 충분히 작게 함.
      </p>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-semibold text-gray-600 dark:text-gray-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-indigo-200 bg-white px-2 py-1.5 font-mono text-xs outline-none focus:border-indigo-500 dark:border-indigo-900/40 dark:bg-gray-950"
      />
    </label>
  );
}
