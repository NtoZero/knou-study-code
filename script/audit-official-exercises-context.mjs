import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const strict = process.argv.includes("--strict");
const markdownFileName = "2026-1학기_6과목_연습문제_정답.md";
const markdownPath = path.join(root, "data", "official-exercises", markdownFileName);

const exactVisualCuePattern =
  /그림|도식|실행\s*결과\s*화면|프로그램\s*결과\s*화면|결과\s*화면|결과를\s*보고|화면\s*캡처|캡처\s*화면|스크린샷|(?:위|아래|다음)\s*(?:UML\s*)?(?:다이어그램\s*(?:그림|보기|에서\s*나타나|을\s*보고|를\s*보고)|그래프|표|화면)/i;

function cleanLines(lines) {
  const copy = [...lines];
  while (copy.length > 0 && copy[0].trim() === "") copy.shift();
  while (copy.length > 0 && copy[copy.length - 1].trim() === "") copy.pop();
  return copy.join("\n").trim();
}

function parseSections(lines) {
  const sections = {};
  let current = null;

  for (const line of lines) {
    const marker = line.match(/^\*\*(지문|문제|보기|정답(?:\(예시\))?|해설)\*\*\s*$/);
    if (marker) {
      current = marker[1];
      sections[current] = [];
      continue;
    }

    if (current) sections[current].push(line);
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, cleanLines(value)]),
  );
}

function parseQuestions(markdown) {
  const lines = markdown.split(/\r?\n/);
  const questions = [];
  let subject = null;
  let lecture = null;

  for (let index = 0; index < lines.length; index += 1) {
    const subjectMatch = lines[index].match(/^##\s+(.+)$/);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
      lecture = null;
      continue;
    }

    const lectureMatch = lines[index].match(/^###\s+(\d+)강\.\s+(.+)$/);
    if (lectureMatch) {
      lecture = {
        id: Number(lectureMatch[1]),
        title: lectureMatch[2].trim(),
      };
      continue;
    }

    const questionMatch = lines[index].match(/^####\s+Q(\d+)\s*$/);
    if (!questionMatch || !subject || !lecture) continue;

    const start = index + 1;
    let end = lines.length;
    for (let cursor = start; cursor < lines.length; cursor += 1) {
      if (
        /^####\s+Q\d+\s*$/.test(lines[cursor]) ||
        /^###\s+\d+강\./.test(lines[cursor]) ||
        /^##\s+/.test(lines[cursor])
      ) {
        end = cursor;
        break;
      }
    }

    const blockLines = lines.slice(start, end);
    const block = blockLines.join("\n");
    const sections = parseSections(blockLines);
    const images = [...block.matchAll(/!\[[^\]]*]\((img\/[^)]+)\)/g)].map((match) => match[1]);
    const context = [sections["지문"], sections["문제"], sections["보기"]]
      .filter(Boolean)
      .join("\n");

    questions.push({
      id: `${subject} ${lecture.id}강 Q${Number(questionMatch[1])}`,
      subject,
      lectureId: lecture.id,
      questionNumber: Number(questionMatch[1]),
      context,
      images,
      hasExactVisualCue: exactVisualCuePattern.test(context),
    });
  }

  return questions;
}

if (!fs.existsSync(markdownPath)) {
  console.error(`Official exercise markdown not found: ${markdownPath}`);
  process.exit(1);
}

const questions = parseQuestions(fs.readFileSync(markdownPath, "utf8"));
const bySubject = new Map();
const missingImages = [];
const missingAssets = [];

for (const question of questions) {
  const entry = bySubject.get(question.subject) ?? {
    total: 0,
    imageQuestions: 0,
    exactVisualCue: 0,
    missingImages: 0,
  };
  entry.total += 1;
  if (question.images.length > 0) entry.imageQuestions += 1;
  if (question.hasExactVisualCue) entry.exactVisualCue += 1;
  if (question.hasExactVisualCue && question.images.length === 0) {
    entry.missingImages += 1;
    const cueLine =
      question.context.split("\n").find((line) => exactVisualCuePattern.test(line)) ??
      question.context.slice(0, 160);
    missingImages.push(`${question.id}: ${cueLine}`);
  }
  bySubject.set(question.subject, entry);

  for (const image of question.images) {
    const assetPath = path.join(root, "public", "official-exercises", image);
    if (!fs.existsSync(assetPath)) {
      missingAssets.push(`${question.id}: ${image}`);
    }
  }
}

console.log("Official exercise visual context audit");
console.log(
  `- total=${questions.length}, imageQuestions=${questions.filter((question) => question.images.length > 0).length}, exactVisualCue=${questions.filter((question) => question.hasExactVisualCue).length}, missingImages=${missingImages.length}`,
);
for (const [subject, entry] of bySubject) {
  console.log(
    `- ${subject}: total=${entry.total}, imageQuestions=${entry.imageQuestions}, exactVisualCue=${entry.exactVisualCue}, missingImages=${entry.missingImages}`,
  );
}

if (missingAssets.length > 0) {
  console.log("\nMissing image assets:");
  for (const item of missingAssets) console.log(`- ${item}`);
}

if (missingImages.length > 0) {
  console.log("\nExact visual/screen cues without image:");
  for (const item of missingImages) console.log(`- ${item}`);
}

if (strict && (missingImages.length > 0 || missingAssets.length > 0)) {
  process.exit(1);
}
