import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const require = createRequire(import.meta.url);
const dataPath = path.join(root, "components/softwarePastExam/data.ts");
const cardPath = path.join(root, "components/softwarePastExam/PastExamQuestionCard.tsx");

const requiredVisualQuestionIds = [
  "software-2019-21",
  "software-2019-23",
  "software-2019-24",
  "software-2019-25",
  "software-2019-26",
  "software-2019-27",
  "software-2019-29",
  "software-2019-30",
  "software-2019-32",
  "software-2019-33",
  "software-2019-34",
  "software-2019-35",
  "software-2018-22",
  "software-2018-25",
  "software-2018-26",
  "software-2018-27",
  "software-2018-29",
  "software-2018-30",
  "software-2018-34",
  "software-2018-35",
  "software-2017-26",
  "software-2017-28",
  "software-2017-30",
  "software-2017-31",
  "software-2017-32",
  "software-2017-35",
];

const visualCuePattern = /그림|도식|다이어그램\s*그림|위\s*(문제의\s*)?다이어그램|위와\s*같은|아래와\s*같은|다음\s*다이어그램|보기에서/;
const failures = [];

function fail(message) {
  failures.push(message);
}

function readSource(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function evaluateDataModule() {
  const source = readSource(dataPath);
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: dataPath,
  }).outputText;

  const module = { exports: {} };
  const context = vm.createContext({
    exports: module.exports,
    module,
    console,
    require,
  });
  new vm.Script(output, { filename: dataPath }).runInContext(context);
  return module.exports;
}

function assertCardRendersImages() {
  const cardSource = readSource(cardPath);
  if (!/question\.images/.test(cardSource)) {
    fail("PastExamQuestionCard가 question.images를 읽지 않습니다.");
  }
  if (!/<img/.test(cardSource) || !/image\.src/.test(cardSource) || !/image\.alt/.test(cardSource)) {
    fail("PastExamQuestionCard가 문항 이미지를 img src/alt로 렌더링하지 않습니다.");
  }
  if (/aiDescriptionHidden/.test(cardSource)) {
    fail("PastExamQuestionCard가 내부 이미지 메타데이터를 학습자 화면에 노출할 위험이 있습니다.");
  }
}

function assertImage(image, questionId) {
  if (!image?.src || !image.src.startsWith("/software/past-exam/figures/")) {
    fail(`${questionId}: software past-exam figure 경로가 아닙니다.`);
    return;
  }

  const imagePath = path.join(root, "public", image.src.replace(/^\//, ""));
  if (!fs.existsSync(imagePath)) {
    fail(`${questionId}: 이미지 파일이 없습니다: ${image.src}`);
  }

  if (!image.alt || image.alt.trim().length < 12) {
    fail(`${questionId}: 이미지 alt가 너무 짧거나 없습니다.`);
  }

  if (!image.aiDescriptionHidden || image.aiDescriptionHidden.trim().length < 30) {
    fail(`${questionId}: aiDescriptionHidden이 충분하지 않습니다.`);
  }

  if (![1, 2, 3].includes(image.sourcePageInternal)) {
    fail(`${questionId}: sourcePageInternal이 1, 2, 3 중 하나가 아닙니다.`);
  }

  const crop = image.cropBoxInternal;
  if (!crop || [crop.x, crop.y, crop.width, crop.height].some((value) => !Number.isFinite(value) || value <= 0)) {
    fail(`${questionId}: cropBoxInternal 좌표가 없거나 올바르지 않습니다.`);
  }
}

function assertQuestionImages(questions) {
  if (!Array.isArray(questions)) {
    fail("softwarePastExamQuestions export가 배열이 아닙니다.");
    return;
  }

  if (questions.length !== 105) {
    fail(`Software 기출 문항 수가 105가 아닙니다: ${questions.length}`);
  }

  const questionMap = new Map(questions.map((question) => [question.id, question]));

  for (const questionId of requiredVisualQuestionIds) {
    const question = questionMap.get(questionId);
    if (!question) {
      fail(`필수 그림 문항이 없습니다: ${questionId}`);
      continue;
    }
    if (!Array.isArray(question.images) || question.images.length === 0) {
      fail(`${questionId}: PDF 도식 의존 문항인데 images가 없습니다.`);
      continue;
    }
    question.images.forEach((image) => assertImage(image, questionId));
  }

  for (const question of questions) {
    const hasVisualCue = visualCuePattern.test(question.prompt ?? "");
    const hasImage = Array.isArray(question.images) && question.images.length > 0;
    if (hasVisualCue && !hasImage) {
      fail(`${question.id}: 지문에 그림/다이어그램 단서가 있지만 images가 없습니다.`);
    }
    if (hasImage) {
      question.images.forEach((image) => assertImage(image, question.id));
    }
  }
}

assertCardRendersImages();
const { softwarePastExamQuestions } = evaluateDataModule();
assertQuestionImages(softwarePastExamQuestions);

if (failures.length > 0) {
  console.error("Software past-exam image audit failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Software past-exam image audit passed: ${softwarePastExamQuestions.length} questions checked.`);
