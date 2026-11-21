"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

const experiments = [
  { label: "A와 A-LRN", variants: [
    { name: "A", counts: [1, 1, 2, 2, 2], detail: "모든 합성곱에 3×3 필터" },
    { name: "A-LRN", counts: [1, 1, 2, 2, 2], detail: "첫 합성곱 뒤에 LRN 추가" }],
    question: "정규화를 추가하면 정확도가 더 높아질까?",
    result: "둘 다 8개의 합성곱층과 3개의 완전연결층을 갖습니다. 두 모델을 비교한 연구팀은 LRN의 정확도 향상 효과가 작다고 보고, 더 깊은 구성에서는 LRN을 생략했습니다." },
  { label: "C와 D", variants: [
    { name: "C", counts: [2, 2, 3, 3, 3], detail: "블록 3·4·5의 마지막 합성곱이 1×1" },
    { name: "D", counts: [2, 2, 3, 3, 3], detail: "같은 위치에도 3×3 필터" }],
    question: "같은 16층인데 구조가 어떻게 다를까?",
    result: "C의 1×1 합성곱은 한 위치에서 채널을 조합합니다. D의 3×3 합성곱은 그 위치를 둘러싼 이웃까지 봅니다. 층 수와 블록별 반복 수가 같아도 한 출력이 참조하는 입력 범위는 달라집니다." },
  { label: "B와 E", variants: [
    { name: "B", counts: [2, 2, 2, 2, 2], detail: "다섯 블록에 합성곱을 두 층씩 배치" },
    { name: "E", counts: [2, 2, 4, 4, 4], detail: "블록 3·4·5의 합성곱을 네 층으로 확장" }],
    question: "VGG13과 VGG19의 여섯 층 차이는 어디에 있을까?",
    result: "마지막 세 블록에 합성곱을 두 층씩 더하면 6개 층이 늘어납니다. 강의에서는 11·13·16·19층 구성을 비교하면서 더 깊은 모델에서 오류율이 낮아진 실험 경향을 설명합니다." },
];

export default function VGGConfigurations() {
  const [selected, setSelected] = useState(0);
  const experiment = experiments[selected];
  return (
    <section id="vgg-configurations" className="scroll-mt-32">
      <SectionTitle title="VGG 구성표로 실험 조건 비교하기" subtitle="두 모델에서 같게 둔 조건을 찾고, 어떤 층을 바꾸었는지 확인하세요." />
      <Sourced refs={{ slides: "슬라이드 25–26 — VGG 구성 A, A-LRN, B, C, D, E", lecture: "42:59–43:42 — LRN 생략과 모델 깊이에 따른 오류율 변화" }}>
        <Card>
          <div className="mb-4 flex flex-wrap gap-2">{experiments.map((item, i) => <Chip key={item.label} active={i === selected} onClick={() => setSelected(i)}>{item.label}</Chip>)}</div>
          <CardTitle>{experiment.question}</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-center text-sm">
              <caption className="mb-2 text-left text-xs text-gray-500">블록별 합성곱층 개수 · 가중치 층 합계에는 완전연결층 3개 포함</caption>
              <thead><tr className="border-b dark:border-gray-700"><th scope="col" className="p-2">구성</th>{[1, 2, 3, 4, 5].map(i => <th scope="col" key={i}>{i}블록</th>)}<th scope="col">층 합계</th></tr></thead>
              <tbody>{experiment.variants.map(variant => <tr key={variant.name} className="border-b dark:border-gray-700">
                <th className="p-2" scope="row">{variant.name}</th>{variant.counts.map((count, i) => <td key={i} className="font-mono">{count}</td>)}<td className="font-bold">{3 + variant.counts.reduce((a, b) => a + b, 0)}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className="my-3 grid gap-2 sm:grid-cols-2">{experiment.variants.map(v => <p key={v.name} className="rounded-lg bg-violet-50 p-3 text-sm dark:bg-violet-950/40"><b>{v.name}</b> · {v.detail}</p>)}</div>
          <p className="text-sm leading-6">{experiment.result}</p>
        </Card>
      </Sourced>
    </section>
  );
}
