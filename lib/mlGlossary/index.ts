import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";
import { prereqs, type PrereqEntry } from "@/lib/mlPrereqs";
import { lecture1Terms } from "./lecture1";
import { lecture2Terms } from "./lecture2";
import { lecture3Terms } from "./lecture3";
import { lecture4Terms } from "./lecture4";

export type ResolvedEntry =
  | (GlossaryTerm & { kind: "term" })
  | (PrereqEntry & { kind: "prereq" });

const lectureTerms: GlossaryTerm[] = [
  ...lecture1Terms,
  ...lecture2Terms,
  ...lecture3Terms,
  ...lecture4Terms,
];

/** 항목이 담고 있는 내용의 양 — 같은 용어가 두 강의에서 정의될 때 더 자세한 쪽을 고르는 기준 */
function richness(t: GlossaryTerm): number {
  return (
    t.definition.length +
    (t.role?.length ?? 0) +
    (t.example?.length ?? 0) +
    (t.emphasis?.length ?? 0) +
    (t.formula?.length ?? 0) * 40 +
    (t.distinctions?.length ?? 0) * 60 +
    (t.related?.length ?? 0) * 10
  );
}

/**
 * 같은 id가 여러 강의에서 정의되면 더 자세히 다룬 쪽을 본문으로 쓰고,
 * 등장 강의와 관계 링크는 양쪽을 합친다.
 * 예: 군집화는 1강에서 소개되고 4강에서 본격적으로 다뤄지므로 4강 정의를 쓴다.
 */
function mergeTerms(list: GlossaryTerm[]): GlossaryTerm[] {
  const map = new Map<string, GlossaryTerm>();
  for (const t of list) {
    const existing = map.get(t.id);
    if (!existing) {
      map.set(t.id, { ...t, lectures: [...t.lectures] });
      continue;
    }
    const base = richness(t) > richness(existing) ? t : existing;
    const other = base === t ? existing : t;
    map.set(t.id, {
      ...base,
      lectures: Array.from(new Set([...existing.lectures, ...t.lectures])).sort(
        (a, b) => a - b,
      ),
      prereqs: Array.from(
        new Set([...(base.prereqs ?? []), ...(other.prereqs ?? [])]),
      ),
      related: Array.from(
        new Set([...(base.related ?? []), ...(other.related ?? [])]),
      ),
      aliases: Array.from(
        new Set([...(base.aliases ?? []), ...(other.aliases ?? [])]),
      ),
    });
  }
  return Array.from(map.values());
}

export const terms: GlossaryTerm[] = mergeTerms(lectureTerms);

export const allTerms: ResolvedEntry[] = [
  ...terms.map((t) => ({ ...t, kind: "term" as const })),
  ...prereqs.map((p) => ({ ...p, kind: "prereq" as const })),
];

export const termById: Record<string, ResolvedEntry> = Object.fromEntries(
  allTerms.map((t) => [t.id, t]),
);

export function termsForLecture(lecture: number): GlossaryTerm[] {
  return terms.filter((t) => t.lectures.includes(lecture));
}

/** 존재하지 않는 id를 가리키는 링크를 찾아낸다. 개발 중 점검용. */
export function danglingReferences(): string[] {
  const out: string[] = [];
  for (const t of terms) {
    for (const p of t.prereqs ?? []) {
      if (!termById[p]) out.push(`${t.id} → prereq ${p}`);
    }
    for (const r of t.related ?? []) {
      if (!termById[r]) out.push(`${t.id} → related ${r}`);
    }
  }
  return out;
}
