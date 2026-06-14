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

// data.ts는 ./explanations 등 다른 .ts 모듈을 런타임 import하므로,
// 상대 경로 .ts 의존성을 재귀적으로 transpile해서 평가하는 로더를 둔다.
const tsModuleCache = new Map();

function loadTsModule(filePath) {
  const resolved = resolveTsPath(filePath);
  if (tsModuleCache.has(resolved)) {
    return tsModuleCache.get(resolved).exports;
  }

  const source = readSource(resolved);
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: resolved,
  }).outputText;

  const module = { exports: {} };
  tsModuleCache.set(resolved, module);

  const localRequire = (request) => {
    if (request.startsWith(".")) {
      return loadTsModule(path.resolve(path.dirname(resolved), request));
    }
    return require(request);
  };

  const context = vm.createContext({
    exports: module.exports,
    module,
    console,
    require: localRequire,
  });
  new vm.Script(output, { filename: resolved }).runInContext(context);
  return module.exports;
}

function resolveTsPath(filePath) {
  const candidates = [filePath, `${filePath}.ts`, path.join(filePath, "index.ts")];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return filePath;
}

function evaluateDataModule() {
  return loadTsModule(dataPath);
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

const bannedPhrases = [
  "기준을 충족하므로",
  "기준에 부합하므로",
  "조건 중 하나가 맞지 않아",
  "정답 후보에서 제외",
  "이 문항에서는 제외",
  "판단 기준과 맞지 않는다",
  "정의와 적용 조건을 가장 정확하게 만족한다",
  "정답 조건을 충족하지 않는다",
  "위 기준과 다르다",
];

function assertExplanations(questions) {
  if (!Array.isArray(questions)) return;

  for (const question of questions) {
    const reasons = (question.choices ?? []).map((choice) => choice?.explanation?.reason ?? "");

    // 1) 모든 선택지 해설 + 정답 박스(basis)에 상용구가 남아 있으면 실패.
    for (const text of [...reasons, question.basis ?? ""]) {
      for (const phrase of bannedPhrases) {
        if (text.includes(phrase)) {
          fail(`${question.id}: 금지 상용구 "${phrase}" 가 해설에 남아 있습니다.`);
        }
      }
    }

    // 2) 각 선택지 해설이 비어 있거나 너무 짧으면 실패.
    question.choices?.forEach((choice) => {
      const reason = choice?.explanation?.reason ?? "";
      if (reason.trim().length < 15) {
        fail(`${question.id} ${choice?.key}번: 선택지 해설이 비었거나 너무 짧습니다.`);
      }
      if (!choice?.explanation?.conceptBasis || choice.explanation.conceptBasis.trim().length < 4) {
        fail(`${question.id} ${choice?.key}번: conceptBasis 근거가 없습니다.`);
      }
    });

    // 3) 4개 선택지 해설이 서로 다른 문장이어야 한다(동일 골격 반복 방지).
    const uniqueReasons = new Set(reasons.map((reason) => reason.trim()));
    if (reasons.length > 0 && uniqueReasons.size < reasons.length) {
      fail(`${question.id}: 선택지 해설이 서로 중복됩니다(동일 문장 반복).`);
    }

    // 4) 정답 박스(basis)가 학습자용 정답 해설이어야 하며 매핑 라벨이 아니어야 한다.
    const basis = question.basis ?? "";
    if (basis.trim().length < 20) {
      fail(`${question.id}: 정답 해설(basis)이 비었거나 너무 짧습니다.`);
    }
    if (/sourceBasis|교재 대응 장|문항 초점|정답표/.test(basis)) {
      fail(`${question.id}: 정답 해설에 제작용 라벨이 노출됩니다.`);
    }
  }
}

assertCardRendersImages();
const { softwarePastExamQuestions } = evaluateDataModule();
assertQuestionImages(softwarePastExamQuestions);
assertExplanations(softwarePastExamQuestions);

if (failures.length > 0) {
  console.error("Software past-exam image audit failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Software past-exam audit passed: ${softwarePastExamQuestions.length} questions checked (images + 해설 상용구·근거).`,
);
