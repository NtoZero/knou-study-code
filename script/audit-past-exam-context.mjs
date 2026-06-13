import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);
const strict = process.argv.includes("--strict");

const subjects = [
  {
    name: "algorithm",
    dataPath: "components/algorithmPastExam/data.ts",
    exportName: "algorithmPastExamQuestions",
  },
  {
    name: "ai",
    dataPath: "components/aiPastExam/data.ts",
    exportName: "aiPastExamQuestions",
  },
  {
    name: "software",
    dataPath: "components/softwarePastExam/data.ts",
    exportName: "softwarePastExamQuestions",
  },
  {
    name: "java",
    dataPath: "components/javaPastExam/data.ts",
    exportName: "javaPastExamQuestions",
  },
  {
    name: "security",
    dataPath: "components/securityPastExam/data.ts",
    exportName: "securityPastExamQuestions",
  },
  {
    name: "network",
    dataPath: "components/networkPastExam/data.ts",
    exportName: "networkReconstructedQuestions",
  },
];

const exactVisualCuePattern =
  /그림|도식|실행\s*결과\s*화면|프로그램\s*결과\s*화면|결과\s*화면|결과를\s*보고|화면\s*캡처|캡처\s*화면|(?:위|아래|다음)\s*(?:UML\s*)?(?:다이어그램\s*(?:그림|보기|에서\s*나타나|을\s*보고|를\s*보고)|그래프|표|화면)/i;
const moduleCache = new Map();

function resolveLocalModule(specifier, parentPath) {
  const basePath = specifier.startsWith("@/")
    ? path.join(root, specifier.slice(2))
    : path.resolve(path.dirname(parentPath), specifier);

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.js"),
  ];

  const match = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!match) {
    throw new Error(`Cannot resolve "${specifier}" from ${parentPath}`);
  }
  return match;
}

function loadModule(filePath) {
  if (moduleCache.has(filePath)) return moduleCache.get(filePath).exports;

  if (!/\.[tj]sx?$/.test(filePath)) {
    return nodeRequire(filePath);
  }

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

  const context = vm.createContext({
    exports: module.exports,
    module,
    require: localRequire,
    console,
    process,
    __dirname: path.dirname(filePath),
    __filename: filePath,
  });

  new vm.Script(output, { filename: filePath }).runInContext(context);
  return module.exports;
}

function collectContext(question) {
  const codeBlocks = Array.isArray(question.codeBlocks)
    ? question.codeBlocks.flatMap((block) => [block.title, block.code])
    : [];
  const images = Array.isArray(question.images)
    ? question.images.flatMap((image) => [image.alt, image.aiDescriptionHidden])
    : [];

  return [
    question.prompt,
    question.context,
    question.passage,
    question.description,
    question.answerExplanation,
    ...codeBlocks,
    ...images,
  ]
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .join("\n");
}

function hasVisualMedia(question) {
  return Array.isArray(question.images) && question.images.length > 0;
}

function imageFailures(question, subjectName) {
  if (!hasVisualMedia(question)) return [];

  return question.images.flatMap((image, index) => {
    const label = `${question.id ?? `${subjectName}-q${question.number}`}: image ${index + 1}`;
    const failures = [];

    if (!image?.src || typeof image.src !== "string") {
      failures.push(`${label}: src가 없습니다.`);
      return failures;
    }

    if (image.src.startsWith("/")) {
      const assetPath = path.join(root, "public", image.src.slice(1));
      if (!fs.existsSync(assetPath)) {
        failures.push(`${label}: public asset이 없습니다 (${image.src}).`);
      }
    }

    if (!image.alt || image.alt.trim().length < 8) {
      failures.push(`${label}: alt가 없거나 너무 짧습니다.`);
    }

    if (!image.aiDescriptionHidden || image.aiDescriptionHidden.trim().length < 24) {
      failures.push(`${label}: aiDescriptionHidden이 없거나 너무 짧습니다.`);
    }

    return failures;
  });
}

const subjectReports = [];
const exactMissing = [];
const assetFailures = [];

for (const subject of subjects) {
  const absoluteDataPath = path.join(root, subject.dataPath);
  const exports = loadModule(absoluteDataPath);
  const questions = exports[subject.exportName];

  if (!Array.isArray(questions)) {
    subjectReports.push({
      name: subject.name,
      total: 0,
      visualMedia: 0,
      exactCue: 0,
      exactMissing: 0,
      loadFailure: `${subject.exportName} export가 배열이 아닙니다.`,
    });
    exactMissing.push(`[${subject.name}] ${subject.exportName} export가 배열이 아닙니다.`);
    continue;
  }

  let visualMedia = 0;
  let exactCue = 0;
  let missing = 0;

  for (const question of questions) {
    const context = collectContext(question);
    const hasMedia = hasVisualMedia(question);
    const hasCue = exactVisualCuePattern.test(context);
    if (hasMedia) visualMedia += 1;
    if (hasCue) exactCue += 1;

    assetFailures.push(...imageFailures(question, subject.name));

    if (hasCue && !hasMedia) {
      missing += 1;
      exactMissing.push(
        `[${subject.name}] ${question.id ?? `${subject.name}-${question.year ?? "year"}-${question.number ?? "number"}`}: ${
          question.prompt ?? "(prompt 없음)"
        }`
      );
    }
  }

  subjectReports.push({
    name: subject.name,
    total: questions.length,
    visualMedia,
    exactCue,
    exactMissing: missing,
  });
}

console.log("Past-exam visual context audit");
for (const report of subjectReports) {
  const suffix = report.loadFailure ? ` (${report.loadFailure})` : "";
  console.log(
    `- ${report.name}: total=${report.total}, visualMedia=${report.visualMedia}, exactVisualCue=${report.exactCue}, missingImages=${report.exactMissing}${suffix}`
  );
}

if (assetFailures.length > 0) {
  console.log("\nImage asset/meta issues:");
  for (const failure of assetFailures) console.log(`- ${failure}`);
}

if (exactMissing.length > 0) {
  console.log("\nExact visual/screen cues without PDF crop images:");
  for (const failure of exactMissing) console.log(`- ${failure}`);
}

if (strict && (exactMissing.length > 0 || assetFailures.length > 0)) {
  process.exit(1);
}
