import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const require = createRequire(import.meta.url);
const dataPath = path.join(root, "components/javaPastExam/data.ts");
const cardPath = path.join(root, "components/javaPastExam/PastExamQuestionCard.tsx");
const typesPath = path.join(root, "components/javaPastExam/types.ts");

const bannedLearnerPatterns = [
  /교재\s*대응\s*장/,
  /문항\s*초점/,
  /sourceBasis/,
  /conceptBasis/,
  /기출정답/,
  /정답표\s*대조/,
  /copyright\//,
  /answerSourceInternal/,
  /questionSourceInternal/,
  /aiDescriptionHidden/,
  /cropBoxInternal/,
];

const bannedBoilerplatePatterns = [
  /기준을\s*충족하므로/,
  /기준에\s*부합하므로/,
  /조건\s*중\s*하나가\s*맞지\s*않아/,
  /정답\s*후보에서\s*제외/,
  /이\s*문항에서는\s*제외/,
  /잘못된\s*설명을\s*찾는\s*문항에서는\s*제외/,
  /정답\s*조건을\s*충족하지\s*않는다/,
  /위\s*정답\s*조건과\s*다른\s*개념/,
  /정답\s*선택지\s*「.*」의\s*기준은/,
  /문항이\s*요구한\s*기준과\s*다른\s*개념·절차·값/,
];

const bannedHelperNames = [
  "correctReasonFor",
  "wrongReasonFor",
  "basisFor",
  "choiceRules",
  "wrongRule",
  "sourceBasisByLecture",
  "tagFocus",
];

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

function includesPattern(value, patterns) {
  return patterns.find((pattern) => pattern.test(value));
}

function assertNoSourceHelpers() {
  const dataSource = readSource(dataPath);
  const cardSource = readSource(cardPath);
  const typeSource = readSource(typesPath);

  for (const helperName of bannedHelperNames) {
    if (dataSource.includes(helperName)) {
      fail(`data.ts에 해설 생성/매핑 helper "${helperName}"가 남아 있습니다.`);
    }
  }

  if (/\bbasis\s*:/.test(dataSource) || /\bbasis\s*:/.test(typeSource)) {
    fail("Java 기출 데이터 모델에 모호한 basis 필드가 남아 있습니다. answerExplanation/source*Internal로 분리해야 합니다.");
  }

  if (/question\.basis/.test(cardSource)) {
    fail("PastExamQuestionCard가 question.basis를 렌더링합니다. answerExplanation 또는 choices[].explanation.reason만 사용해야 합니다.");
  }

  if (!/question\.answerExplanation/.test(cardSource)) {
    fail("정답 공개 박스가 question.answerExplanation을 렌더링하지 않습니다.");
  }
}

function assertQuestionShape(questions) {
  if (!Array.isArray(questions)) {
    fail("javaPastExamQuestions export가 배열이 아닙니다.");
    return;
  }

  if (questions.length !== 75) {
    fail(`Java 기출 문항 수가 75가 아닙니다: ${questions.length}`);
  }

  const ids = new Set();
  const yearCounts = new Map();

  for (const question of questions) {
    const label = question?.id ?? "(id 없음)";
    if (!question?.id) fail("id가 없는 문항이 있습니다.");
    if (ids.has(question.id)) fail(`중복 문항 id: ${question.id}`);
    ids.add(question.id);

    yearCounts.set(question.year, (yearCounts.get(question.year) ?? 0) + 1);

    if (!question.prompt || question.prompt.trim().length < 10) {
      fail(`${label}: 지문(prompt)이 너무 짧거나 비어 있습니다.`);
    }
    if (question.prompt && /^[①②③④⑤1-5번\s,]+$/.test(question.prompt.trim())) {
      fail(`${label}: 지문이 선택지 번호만 남은 형태입니다.`);
    }

    if (!Array.isArray(question.conceptTags) || question.conceptTags.length === 0) {
      fail(`${label}: conceptTags가 없습니다.`);
    } else if (new Set(question.conceptTags).size !== question.conceptTags.length) {
      fail(`${label}: conceptTags에 중복 값이 있어 React key 충돌 위험이 있습니다.`);
    }

    if (!Array.isArray(question.lectureRefs) || question.lectureRefs.length === 0) {
      fail(`${label}: lectureRefs가 없습니다.`);
    }

    if (!Array.isArray(question.choices) || question.choices.length !== 4) {
      fail(`${label}: 선택지가 4개가 아닙니다.`);
      continue;
    }

    const codeContext = (question.codeBlocks ?? []).map((block) => block.code).join("\n");
    const choiceKeys = new Set();
    const correctChoices = [];
    for (const choice of question.choices) {
      const choiceLabel = `${label}-${choice?.key ?? "?"}`;
      if (!choice?.key) fail(`${label}: key가 없는 선택지가 있습니다.`);
      if (choiceKeys.has(choice.key)) fail(`${label}: 중복 선택지 key ${choice.key}`);
      choiceKeys.add(choice.key);

      const choiceText = choice.text?.trim() ?? "";
      const isCodeLabelChoice =
        /^[a-d](?:,\s*[a-d])*$/.test(choiceText) &&
        choiceText
          .split(",")
          .map((item) => item.trim())
          .every((item) => new RegExp(`(?:^|\\n)\\s*(?:.*//\\s*${item}\\b|${item}\\s*[).:]|${item}\\s*$)`).test(codeContext));
      if (
        !choiceText ||
        (!isCodeLabelChoice && choiceText.length < 2) ||
        /^[①②③④⑤]?$/.test(choiceText) ||
        /^[1-5]번$/.test(choiceText)
      ) {
        fail(`${choiceLabel}: 선택지 본문이 없거나 번호만 남았습니다.`);
      }

      const reason = choice.explanation?.reason?.trim() ?? "";
      if (choice.explanation?.verdict === "correct") correctChoices.push(choice.key);
      if (!["correct", "wrong"].includes(choice.explanation?.verdict)) {
        fail(`${choiceLabel}: explanation.verdict가 correct/wrong이 아닙니다.`);
      }
      if (reason.length < 24) {
        fail(`${choiceLabel}: 해설 reason이 너무 짧습니다.`);
      }

      const bannedLearnerPattern = includesPattern(reason, bannedLearnerPatterns);
      if (bannedLearnerPattern) {
        fail(`${choiceLabel}: 학습자 해설에 내부 라벨/제작자 표현이 남았습니다: ${bannedLearnerPattern}`);
      }

      const bannedBoilerplatePattern = includesPattern(reason, bannedBoilerplatePatterns);
      if (bannedBoilerplatePattern) {
        fail(`${choiceLabel}: 상용구형 해설이 남았습니다: ${bannedBoilerplatePattern}`);
      }
    }

    if (!choiceKeys.has(question.correctChoice)) {
      fail(`${label}: correctChoice가 선택지 key 범위 안에 없습니다.`);
    }
    if (correctChoices.length !== 1 || correctChoices[0] !== question.correctChoice) {
      fail(`${label}: 정답 key와 선택지 verdict가 일치하지 않습니다.`);
    }

    const correctChoice = question.choices.find((choice) => choice.key === question.correctChoice);
    const expectedAnswerExplanation = correctChoice?.explanation?.reason?.trim();
    if (!question.answerExplanation || question.answerExplanation.trim() !== expectedAnswerExplanation) {
      fail(`${label}: answerExplanation이 정답 선택지의 직접 해설과 일치하지 않습니다.`);
    }

    const wrongReasons = question.choices
      .filter((choice) => choice.explanation?.verdict === "wrong")
      .map((choice) => choice.explanation.reason.trim());
    if (new Set(wrongReasons).size !== wrongReasons.length) {
      fail(`${label}: 오답 해설이 중복되어 선택지별 설명으로 보기 어렵습니다.`);
    }
  }

  for (const year of [2017, 2018, 2019]) {
    const count = yearCounts.get(year) ?? 0;
    if (count !== 25) fail(`${year}년 문항 수가 25가 아닙니다: ${count}`);
  }
}

assertNoSourceHelpers();
const { javaPastExamQuestions } = evaluateDataModule();
assertQuestionShape(javaPastExamQuestions);

if (failures.length > 0) {
  console.error("Java past-exam audit failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Java past-exam audit passed: ${javaPastExamQuestions.length} questions checked.`);
