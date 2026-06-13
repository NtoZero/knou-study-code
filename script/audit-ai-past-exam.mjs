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
  /핵심 설명인/,
  /문항에서 「/,
  /기준과 일치/,
  /정의·절차·계산 조건과 맞지/,
  /정답 후보/,
  /기준에 부합/,
  /기준을 충족/,
  /sourceBasis/,
  /conceptBasis/,
];

const bannedSourcePatterns = [
  /buildAIChoiceExplanation/,
  /aiChoiceExplanations/,
  /conceptBasis/,
  /wrongRule/,
  /question\\.basis/,
  /question\\?\\.basis/,
];

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

const sourceFiles = [
  "components/aiPastExam/data.ts",
  "components/aiPastExam/types.ts",
  "components/aiPastExam/choiceExplanations.ts",
  "components/aiPastExam/PastExamQuestionCard.tsx",
  "components/aiPastExam/AIPastExamCoverage.tsx",
  "app/ai/frequent-concepts/page.tsx",
];

const failures = [];

for (const relativePath of sourceFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  for (const pattern of bannedSourcePatterns) {
    if (pattern.test(source)) failures.push(`${relativePath}: 금지된 생성/내부 라벨 참조가 남아 있습니다 (${pattern}).`);
  }
}

const { aiPastExamQuestions } = loadModule(path.join(root, "components/aiPastExam/data.ts"));

if (!Array.isArray(aiPastExamQuestions)) {
  failures.push("aiPastExamQuestions export가 배열이 아닙니다.");
} else {
  for (const question of aiPastExamQuestions) {
    if (!question.answerExplanation || question.answerExplanation.trim().length < 20) {
      failures.push(`${question.id}: answerExplanation이 없거나 너무 짧습니다.`);
    }

    if (Object.hasOwn(question, "basis") || Object.hasOwn(question, "wrongRule") || Object.hasOwn(question, "sourceBasis")) {
      failures.push(`${question.id}: 학습자용 basis/wrongRule/sourceBasis 필드가 남아 있습니다.`);
    }

    for (const image of question.images ?? []) {
      if (!image.src || !image.alt || !image.aiDescriptionHidden) {
        failures.push(`${question.id}: 이미지 src/alt/hidden 설명이 누락되었습니다.`);
        continue;
      }
      const publicPath = image.src.startsWith("/") ? image.src.slice(1) : image.src;
      if (!fs.existsSync(path.join(root, "public", publicPath))) {
        failures.push(`${question.id}: 이미지 파일이 public 경로에 없습니다 (${image.src}).`);
      }
    }

    for (const pattern of bannedLearnerPatterns) {
      if (pattern.test(question.answerExplanation ?? "")) {
        failures.push(`${question.id}: answerExplanation에 금지 표현이 있습니다 (${pattern}).`);
      }
    }

    for (const choice of question.choices ?? []) {
      const reason = choice.explanation?.reason ?? "";
      if (reason.trim().length < 20) {
        failures.push(`${question.id} ${choice.key}: 선택지 해설이 없거나 너무 짧습니다.`);
      }
      if (Object.hasOwn(choice.explanation ?? {}, "conceptBasis")) {
        failures.push(`${question.id} ${choice.key}: conceptBasis가 학습자 선택지 해설에 남아 있습니다.`);
      }
      for (const pattern of bannedLearnerPatterns) {
        if (pattern.test(reason)) failures.push(`${question.id} ${choice.key}: 선택지 해설에 금지 표현이 있습니다 (${pattern}).`);
      }
    }

    const reasonsByText = new Map();
    for (const choice of question.choices ?? []) {
      const reason = choice.explanation?.reason?.trim();
      if (!reason) continue;
      const keys = reasonsByText.get(reason) ?? [];
      keys.push(choice.key);
      reasonsByText.set(reason, keys);
    }
    for (const [reason, keys] of reasonsByText) {
      if (keys.length > 1) {
        failures.push(`${question.id}: ${keys.join(", ")} 선택지가 같은 해설을 공유합니다 (${reason}).`);
      }
    }
  }
}

console.log(`AI past-exam explanation audit: questions=${Array.isArray(aiPastExamQuestions) ? aiPastExamQuestions.length : 0}`);

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("- explicit answerExplanation fields: ok");
console.log("- per-choice reason fields: ok");
console.log("- no duplicated per-choice reasons within a question: ok");
console.log("- no shared explanation helper/internal learner labels: ok");
console.log("- required visual assets exist: ok");
