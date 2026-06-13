import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const moduleCache = new Map();

const bannedLearnerPatterns = [
  /정답 근거:/,
  /오답 근거:/,
  /판별 기준:/,
  /강의 내용 기준:/,
  /교재 개념 기준:/,
  /기준을 충족/,
  /기준에 부합/,
  /정답 후보/,
  /조건 중 하나가 맞지/,
  /sourceBasis/,
  /conceptBasis/,
  /문항에서 「/,
  /정의·절차·계산 조건과 맞지/,
  /정답 선택지/,
  /바로 뛰지 말고/,
  /같은 대상을 가리키/,
  /그대로 받아내/,
  /한정기호·절·규칙/,
  /번번/,
  /네트을/,
  /오답이다\.라는/,
  /오답이다는/,
];

const allowedKinds = new Set(["array", "formula", "graph", "network", "sequence", "stack", "table", "tree"]);
const bannedSelectedChoicePatterns = [
  /정답 근거:/,
  /오답 근거:/,
  /정의·절차·계산 조건과 (일치|맞지)/,
  /판별 기준:/,
  /강의·교재 기준:/,
  /해당 선택지/,
  /「[^」]+」 선택지/,
];
const expectedAIIds = new Set(["2017-2-q08", "2018-2-q01", "2018-2-q02", "2018-2-q26", "2019-2-q01", "2019-2-q03", "2019-2-q32"]);
const expectedAlgorithmIds = new Set([
  "2017-1-q12",
  "2017-1-q24",
  "2017-1-q28",
  "2018-1-q16",
  "2018-1-q25",
  "2018-1-q28",
  "2018-1-q30",
  "2019-1-q16",
  "2019-1-q18",
  "2019-1-q19",
  "2019-1-q22",
  "2019-1-q35",
]);

function resolveLocalModule(specifier, parentPath) {
  const basePath = specifier.startsWith("@/")
    ? path.join(root, specifier.slice(2))
    : path.resolve(path.dirname(parentPath), specifier);

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];

  const match = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!match) throw new Error(`Cannot resolve "${specifier}" from ${parentPath}`);
  return match;
}

function loadModule(filePath) {
  if (moduleCache.has(filePath)) return moduleCache.get(filePath).exports;

  const source = fs.readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filePath,
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(filePath, module);

  const localRequire = (specifier) => {
    if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      return loadModule(resolveLocalModule(specifier, filePath));
    }
    return createRequire(filePath)(specifier);
  };

  vm.runInNewContext(
    output,
    { exports: module.exports, module, require: localRequire, console, process, __dirname: path.dirname(filePath), __filename: filePath },
    { filename: filePath },
  );
  return module.exports;
}

function collectStrings(value, acc = []) {
  if (typeof value === "string") {
    acc.push(value);
    return acc;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, acc);
    return acc;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, acc);
  }
  return acc;
}

function normalize(text) {
  return text.replace(/\s+/g, " ").trim();
}

function learnerProcessTexts(process) {
  return [
    process.overview,
    ...(process.steps ?? []).map((step) => step.body),
    process.checkpoint,
  ].filter((text) => typeof text === "string");
}

function auditQuestion(subject, question, failures, seenLongTexts) {
  const process = question.solutionProcess;
  if (!process) {
    return;
  }

  if (!process.title || process.title.trim().length < 6) failures.push(`${subject} ${question.id}: 풀이과정 제목이 너무 짧습니다.`);
  if (!process.overview || process.overview.trim().length < 28) failures.push(`${subject} ${question.id}: 풀이과정 개요가 너무 짧습니다.`);
  if (!process.checkpoint || process.checkpoint.trim().length < 24) failures.push(`${subject} ${question.id}: 풀이과정 복습 문장이 너무 짧습니다.`);
  if (!Array.isArray(process.steps) || process.steps.length !== 3) failures.push(`${subject} ${question.id}: 풀이 단계는 1, 2, 3의 정확히 3개여야 합니다.`);

  for (const [index, step] of (process.steps ?? []).entries()) {
    if (!step.title || step.title.trim().length < 2) failures.push(`${subject} ${question.id}: ${index + 1}단계 제목이 너무 짧습니다.`);
    if (!step.body || step.body.trim().length < 18) failures.push(`${subject} ${question.id}: ${index + 1}단계 설명이 너무 짧습니다.`);
  }

  if (!process.visual) {
    failures.push(`${subject} ${question.id}: 풀이 흐름 시각화 데이터가 없습니다.`);
  } else {
    if (!allowedKinds.has(process.visual.kind)) failures.push(`${subject} ${question.id}: 알 수 없는 시각화 kind ${process.visual.kind}.`);
    if (!Array.isArray(process.visual.frames) || process.visual.frames.length < 3) {
      failures.push(`${subject} ${question.id}: 단계별 시각화 프레임이 3개 미만입니다.`);
    }
    for (const [index, frame] of (process.visual.frames ?? []).entries()) {
      if (!frame.title || !frame.caption) failures.push(`${subject} ${question.id}: ${index + 1}번 프레임 제목/설명이 없습니다.`);
      if (!frame.nodes && !frame.array && !frame.formula && !frame.table) {
        failures.push(`${subject} ${question.id}: ${index + 1}번 프레임에 렌더링할 시각 자료가 없습니다.`);
      }
    }
  }

  const allText = collectStrings(process).join("\n");
  for (const pattern of bannedLearnerPatterns) {
    if (pattern.test(allText)) failures.push(`${subject} ${question.id}: 풀이과정에 금지 표현이 있습니다 (${pattern}).`);
  }

  for (const text of learnerProcessTexts(process)) {
    const normalized = normalize(text);
    if (normalized.length < 60) continue;
    const previous = seenLongTexts.get(normalized);
    if (previous && previous !== question.id) {
      failures.push(`${subject} ${question.id}: 긴 설명 문장이 ${previous}와 중복됩니다.`);
    } else {
      seenLongTexts.set(normalized, question.id);
    }
  }
}

function auditSelectedAlgorithmChoiceReasons(question, failures) {
  if (!question.solutionProcess) return;
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    failures.push(`Algorithm ${question.id}: 풀이과정 문항의 선택지 4개를 확인할 수 없습니다.`);
    return;
  }

  const seenReasons = new Set();
  for (const choice of question.choices) {
    const reason = choice.explanation?.reason ?? "";
    if (reason.trim().length < 42) {
      failures.push(`Algorithm ${question.id} ${choice.label}: 선택지 해설이 너무 짧습니다.`);
    }
    for (const pattern of bannedSelectedChoicePatterns) {
      if (pattern.test(reason)) {
        failures.push(`Algorithm ${question.id} ${choice.label}: 선택지 해설에 기본 생성 문구가 남아 있습니다 (${pattern}).`);
      }
    }
    const normalizedReason = normalize(reason);
    if (seenReasons.has(normalizedReason)) {
      failures.push(`Algorithm ${question.id} ${choice.label}: 선택지 해설이 같은 문항 안에서 중복됩니다.`);
    }
    seenReasons.add(normalizedReason);
  }
}

function auditAlgorithmChoiceReasonBaseline(question, failures) {
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    failures.push(`Algorithm ${question.id}: 선택지 4개를 확인할 수 없습니다.`);
    return;
  }

  const seenReasons = new Set();
  for (const choice of question.choices) {
    const reason = choice.explanation?.reason ?? "";
    if (reason.trim().length < 28) {
      failures.push(`Algorithm ${question.id} ${choice.label}: 선택지 해설이 너무 짧습니다.`);
    }
    for (const pattern of bannedSelectedChoicePatterns) {
      if (pattern.test(reason)) {
        failures.push(`Algorithm ${question.id} ${choice.label}: 선택지 해설에 기본 생성 문구가 남아 있습니다 (${pattern}).`);
      }
    }
    const normalizedReason = normalize(reason);
    if (seenReasons.has(normalizedReason)) {
      failures.push(`Algorithm ${question.id} ${choice.label}: 같은 문항 안에서 선택지 해설이 중복됩니다.`);
    }
    seenReasons.add(normalizedReason);
  }
}

const failures = [];
const seenLongTexts = new Map();
const { aiPastExamQuestions } = loadModule(path.join(root, "components/aiPastExam/data.ts"));
const { algorithmPastExamQuestions } = loadModule(path.join(root, "components/algorithmPastExam/data.ts"));

if (!Array.isArray(aiPastExamQuestions) || aiPastExamQuestions.length !== 105) {
  failures.push(`AI 문항 수가 105가 아닙니다 (${Array.isArray(aiPastExamQuestions) ? aiPastExamQuestions.length : "not-array"}).`);
}
if (!Array.isArray(algorithmPastExamQuestions) || algorithmPastExamQuestions.length !== 105) {
  failures.push(`Algorithm 문항 수가 105가 아닙니다 (${Array.isArray(algorithmPastExamQuestions) ? algorithmPastExamQuestions.length : "not-array"}).`);
}

for (const question of aiPastExamQuestions ?? []) auditQuestion("AI", question, failures, seenLongTexts);
for (const question of algorithmPastExamQuestions ?? []) {
  auditQuestion("Algorithm", question, failures, seenLongTexts);
  auditAlgorithmChoiceReasonBaseline(question, failures);
  auditSelectedAlgorithmChoiceReasons(question, failures);
}

const aiSelected = (aiPastExamQuestions ?? []).filter((question) => question.solutionProcess);
const algorithmSelected = (algorithmPastExamQuestions ?? []).filter((question) => question.solutionProcess);
const aiSelectedIds = new Set(aiSelected.map((question) => question.id));
const algorithmSelectedIds = new Set(algorithmSelected.map((question) => question.id));

for (const id of expectedAIIds) {
  if (!aiSelectedIds.has(id)) failures.push(`AI ${id}: 선별 풀이과정이 누락되었습니다.`);
}
for (const id of expectedAlgorithmIds) {
  if (!algorithmSelectedIds.has(id)) failures.push(`Algorithm ${id}: 선별 풀이과정이 누락되었습니다.`);
}
for (const id of aiSelectedIds) {
  if (!expectedAIIds.has(id)) failures.push(`AI ${id}: 선별 목록에 없는 풀이과정이 들어 있습니다.`);
}
for (const id of algorithmSelectedIds) {
  if (!expectedAlgorithmIds.has(id)) failures.push(`Algorithm ${id}: 선별 목록에 없는 풀이과정이 들어 있습니다.`);
}
if (aiSelected.length >= 35 || algorithmSelected.length >= 35) {
  failures.push("풀이과정 컴포넌트가 너무 많은 문항에 연결되었습니다. 절차형 문항만 선별해야 합니다.");
}

console.log(
  `Past-exam solution process audit: ai=${aiPastExamQuestions?.length ?? 0} selected=${aiSelected.length}, algorithm=${algorithmPastExamQuestions?.length ?? 0} selected=${algorithmSelected.length}`,
);

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("- selected procedural questions only: ok");
console.log("- 1/2/3 guided steps and visual frames: ok");
console.log("- no banned boilerplate in solution processes: ok");
console.log("- all algorithm choice explanations are non-duplicated and boilerplate-free: ok");
console.log("- selected algorithm choice explanations are specific: ok");
