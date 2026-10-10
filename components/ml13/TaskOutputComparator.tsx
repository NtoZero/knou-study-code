"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller } from "./ui";

/**
 * 같은 영상 하나에 대해 객체인식 · 객체 검출 및 로컬화 · 의미적 영상분할의
 * 출력이 각각 어떻게 다른지 비교한다.
 *
 * 장면은 이 화면에서 정한 16 × 12 격자이고, 바운딩 박스 좌표와
 * 클래스별 화소 수는 모두 격자에서 실제로 세어 계산한다.
 */

const COLS = 16;
const ROWS = 12;

interface ClassDef {
  key: string;
  label: string;
  color: string;
  /** 객체인식·검출의 대상이 되는 전경 객체인가 */
  object: boolean;
}

const CLASSES: ClassDef[] = [
  { key: "sky", label: "하늘", color: "#bae6fd", object: false },
  { key: "building", label: "건물", color: "#a8a29e", object: false },
  { key: "road", label: "도로", color: "#57534e", object: false },
  { key: "car", label: "자동차", color: "#2563eb", object: true },
  { key: "person", label: "사람", color: "#f43f5e", object: true },
];

const classByKey = Object.fromEntries(CLASSES.map((c) => [c.key, c]));

/** 전경 객체 하나하나 — 검출은 이 덩어리마다 박스를 하나씩 낸다 */
const INSTANCES = [
  { id: "car-1", cls: "car", name: "자동차 #1", c0: 2, c1: 6, r0: 6, r1: 8 },
  { id: "car-2", cls: "car", name: "자동차 #2", c0: 9, c1: 12, r0: 6, r1: 8 },
  { id: "person-1", cls: "person", name: "사람", c0: 14, c1: 15, r0: 5, r1: 8 },
];

const BUILDING = { c0: 0, c1: 3, r0: 1, r1: 5 };
const ROAD_FROM_ROW = 9;

function classAt(r: number, c: number): string {
  for (const ins of INSTANCES) {
    if (r >= ins.r0 && r <= ins.r1 && c >= ins.c0 && c <= ins.c1) return ins.cls;
  }
  if (r >= BUILDING.r0 && r <= BUILDING.r1 && c >= BUILDING.c0 && c <= BUILDING.c1)
    return "building";
  if (r >= ROAD_FROM_ROW) return "road";
  return "sky";
}

type TaskKey = "recognition" | "detection" | "segmentation";

const TASKS: { key: TaskKey; label: string; en: string; outputKind: string }[] = [
  {
    key: "recognition",
    label: "객체인식",
    en: "object recognition",
    outputKind: "클래스 레이블 1개",
  },
  {
    key: "detection",
    label: "객체 검출 및 로컬화",
    en: "object detection & localization",
    outputKind: "객체마다 (클래스, 박스) 1쌍",
  },
  {
    key: "segmentation",
    label: "의미적 영상분할",
    en: "semantic image segmentation",
    outputKind: `화소 ${COLS * ROWS}개마다 범주 1개`,
  },
];

const CELL = 22;
const W = COLS * CELL;
const H = ROWS * CELL;

export default function TaskOutputComparator() {
  const [task, setTask] = useState<TaskKey>("recognition");

  const { grid, counts, total, dominantObject } = useMemo(() => {
    const g: string[][] = [];
    const cnt: Record<string, number> = {};
    for (let r = 0; r < ROWS; r += 1) {
      const row: string[] = [];
      for (let c = 0; c < COLS; c += 1) {
        const k = classAt(r, c);
        row.push(k);
        cnt[k] = (cnt[k] ?? 0) + 1;
      }
      g.push(row);
    }
    const objectCounts = CLASSES.filter((c) => c.object).map((c) => ({
      key: c.key,
      label: c.label,
      n: cnt[c.key] ?? 0,
    }));
    objectCounts.sort((a, b) => b.n - a.n);
    return {
      grid: g,
      counts: cnt,
      total: COLS * ROWS,
      dominantObject: objectCounts[0],
    };
  }, []);

  const boxes = INSTANCES.map((ins) => ({
    ...ins,
    x: ins.c0,
    y: ins.r0,
    w: ins.c1 - ins.c0 + 1,
    h: ins.r1 - ins.r0 + 1,
    area: (ins.c1 - ins.c0 + 1) * (ins.r1 - ins.r0 + 1),
  }));

  return (
    <section id="task-outputs" className="scroll-mt-32">
      <SectionTitle
        title="같은 영상, 다른 출력 — 인식 · 검출 · 분할"
        subtitle="입력이 같아도 출력의 형태가 다르면 다른 문제입니다. 격자에서 직접 세어 비교합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1.1 컴퓨터비전 응용 — (1) 영상이해 · (2) 영상변환",
            slides: "(1) 영상이해 · 영상변환: 영상분할",
          }}
        >
          <Card>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {TASKS.map((t) => (
                <Chip key={t.key} active={t.key === task} onClick={() => setTask(t.key)}>
                  {t.label}
                </Chip>
              ))}
            </div>

            <Scroller>
              <svg
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                className="min-w-[352px] rounded-lg"
                role="img"
                aria-label="예시 장면과 과제별 출력"
              >
                {grid.map((row, r) =>
                  row.map((k, c) => {
                    const base = classByKey[k];
                    // 분할일 때만 화소 하나하나를 범주 색으로 또렷하게 칠한다.
                    const opacity = task === "segmentation" ? 1 : 0.55;
                    return (
                      <rect
                        key={`${r}-${c}`}
                        x={c * CELL}
                        y={r * CELL}
                        width={CELL}
                        height={CELL}
                        fill={base.color}
                        fillOpacity={opacity}
                        stroke={task === "segmentation" ? "#ffffff" : "none"}
                        strokeWidth={task === "segmentation" ? 0.5 : 0}
                      />
                    );
                  }),
                )}

                {task === "detection" &&
                  boxes.map((b) => (
                    <g key={b.id}>
                      <rect
                        x={b.x * CELL}
                        y={b.y * CELL}
                        width={b.w * CELL}
                        height={b.h * CELL}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth={2.5}
                      />
                      <rect
                        x={b.x * CELL}
                        y={b.y * CELL - 14}
                        width={b.name.length * 11 + 8}
                        height={14}
                        fill="#dc2626"
                      />
                      <text
                        x={b.x * CELL + 4}
                        y={b.y * CELL - 3}
                        fontSize={10}
                        fill="#ffffff"
                        fontWeight={700}
                      >
                        {b.name}
                      </text>
                    </g>
                  ))}

                {task === "recognition" && (
                  <g>
                    <rect
                      x={6}
                      y={6}
                      width={W - 12}
                      height={H - 12}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={3}
                      strokeDasharray="6 4"
                    />
                    <rect x={6} y={6} width={110} height={18} fill="#2563eb" />
                    <text x={11} y={19} fontSize={11} fill="#ffffff" fontWeight={700}>
                      영상 전체 → 한 레이블
                    </text>
                  </g>
                )}
              </svg>
            </Scroller>

            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-300">
                출력의 형태 — {TASKS.find((t) => t.key === task)!.outputKind}
              </p>

              {task === "recognition" && (
                <div className="mt-2">
                  <p className="font-mono text-[13px] font-bold text-blue-900 dark:text-blue-100">
                    출력 = &quot;{dominantObject.label}&quot;
                  </p>
                  <Hint>
                    영상 한 장을 M개 클래스 중 하나로 인식하는 분류 문제. 객체가 몇 개 있는지, 어디에
                    있는지는 출력에 담기지 않는다. 이 장면의 전경 화소는 자동차{" "}
                    {counts["car"]}칸, 사람 {counts["person"]}칸이므로 더 넓은 쪽인 ‘자동차’가 하나의
                    레이블로 나온다.
                  </Hint>
                </div>
              )}

              {task === "detection" && (
                <div className="mt-2 space-y-1.5">
                  {boxes.map((b) => (
                    <p
                      key={b.id}
                      className="font-mono text-[12px] text-blue-900 dark:text-blue-100"
                    >
                      ({classByKey[b.cls].label}, x={b.x}, y={b.y}, w={b.w}, h={b.h}) → 면적{" "}
                      {b.w} × {b.h} = {b.area}칸
                    </p>
                  ))}
                  <Hint>
                    박스 좌표는 각 객체가 차지한 칸의 가장 왼쪽·위쪽 칸과 가로·세로 길이를 그대로 센
                    값이다. 같은 ‘자동차’라도 덩어리가 둘이면 박스도 둘이 나온다 — 이것이 인식과
                    갈리는 지점이다.
                  </Hint>
                </div>
              )}

              {task === "segmentation" && (
                <div className="mt-2">
                  <Scroller>
                    <table className="w-full min-w-[320px] border-collapse text-[11.5px]">
                      <thead>
                        <tr className="border-b border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                          <th className="py-1 text-left font-semibold">범주</th>
                          <th className="py-1 text-right font-semibold">화소 수</th>
                          <th className="py-1 text-right font-semibold">비율</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CLASSES.map((c) => (
                          <tr
                            key={c.key}
                            className="border-b border-blue-100/70 dark:border-blue-900/40"
                          >
                            <td className="py-1">
                              <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: c.color }} />
                              {c.label}
                            </td>
                            <td className="py-1 text-right font-mono">{counts[c.key] ?? 0}</td>
                            <td className="py-1 text-right font-mono">
                              {(((counts[c.key] ?? 0) / total) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                        <tr className="font-bold text-blue-800 dark:text-blue-200">
                          <td className="py-1">합계</td>
                          <td className="py-1 text-right font-mono">{total}</td>
                          <td className="py-1 text-right font-mono">100.0%</td>
                        </tr>
                      </tbody>
                    </table>
                  </Scroller>
                  <Hint>
                    각 화소가 여러 범주 중에서 하나에만 속하므로, 범주별 화소 수를 모두 더하면 영상의
                    전체 화소 수 {COLS} × {ROWS} = {total}과 정확히 같아진다. 빠지는 화소도, 두 번
                    세어지는 화소도 없다.
                  </Hint>
                </div>
              )}
            </div>

            <div className="mt-3">
              <ComputedNote>
                이 장면과 격자 배치, 객체의 칸 수는 원자료에 없는 값으로 이 화면에서 정했습니다.
                바운딩 박스 좌표·면적과 범주별 화소 수·비율은 그 격자에서 실제로 세어 계산한
                값입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.1 컴퓨터비전 응용 — (2) 영상변환",
            slides: "영상변환: 영상분할",
          }}
        >
          <Card>
            <CardTitle>의미적 영상분할 — 강의록의 치과 X-Ray 예</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              의미적 영상분할의 정의는 <strong>“각 화소가 여러 범주 중에서 하나에 속하도록 분류”</strong>
              하는 것이다. 강의록은 치과 X-Ray 영상을 7개의 클래스로 분할한 예를 든다.
            </p>
            <Scroller>
              <div className="mt-3 grid min-w-[300px] grid-cols-1 gap-1 sm:grid-cols-2">
                {[
                  { no: 1, en: "caries (blue color)", ko: "충치", color: "#1d4ed8" },
                  { no: 2, en: "enamel (green color)", ko: "에나멜", color: "#16a34a" },
                  { no: 3, en: "dentin (yellow color)", ko: "상아질", color: "#eab308" },
                  { no: 4, en: "pulp (red color)", ko: "치수(펄프)", color: "#dc2626" },
                  { no: 5, en: "crown (skin color)", ko: "금속관(크라운)", color: "#fbcfa4" },
                  { no: 6, en: "restoration (orange color)", ko: "보철물 복원", color: "#f97316" },
                  { no: 7, en: "root canal treatment (cyan)", ko: "신경 치료", color: "#22d3ee" },
                ].map((c) => (
                  <div
                    key={c.no}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 dark:border-gray-700"
                  >
                    <span className="text-[11px] font-bold text-gray-400">{c.no}</span>
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-sm"
                      style={{ background: c.color }}
                    />
                    <span className="text-[11.5px] font-semibold text-gray-700 dark:text-gray-200">
                      {c.ko}
                    </span>
                    <span className="ml-auto truncate text-[10px] text-gray-400">{c.en}</span>
                  </div>
                ))}
              </div>
            </Scroller>
            <Hint>
              클래스가 7개라는 것은 모든 화소가 이 7개 중 정확히 하나로 분류된다는 뜻이다. 교재는 이
              문제를 두고 “영상 영역들을 의미적 유사성에 따라 몇 개의 그룹으로 묶어서 분할”하는 것이라
              설명하며, 군집화 문제에 해당한다고 볼 수 있다고 덧붙인다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
