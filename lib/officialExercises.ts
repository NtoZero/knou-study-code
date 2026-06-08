import fs from "node:fs";
import path from "node:path";
import type {
  OfficialExerciseQuestion,
  OfficialExerciseStats,
  OfficialExerciseSubject,
  OfficialExerciseSubjectMeta,
} from "@/components/officialExercises/types";

export const officialExerciseSubjects: OfficialExerciseSubjectMeta[] = [
  { subject: "컴퓨터보안", slug: "security", label: "컴퓨터보안" },
  { subject: "소프트웨어공학", slug: "software", label: "소프트웨어공학" },
  { subject: "정보통신망", slug: "network", label: "정보통신망" },
  { subject: "Java프로그래밍", slug: "java", label: "Java프로그래밍" },
  { subject: "인공지능", slug: "ai", label: "인공지능" },
  { subject: "알고리즘", slug: "algorithm", label: "알고리즘" },
];

const subjectSlugByName = new Map(
  officialExerciseSubjects.map((item) => [item.subject, item.slug]),
);

type SectionMap = Record<string, string>;

function cleanLines(lines: string[]) {
  const copy = [...lines];
  while (copy.length > 0 && copy[0].trim() === "") copy.shift();
  while (copy.length > 0 && copy[copy.length - 1].trim() === "") copy.pop();
  return copy.join("\n").trim();
}

function parseSections(lines: string[]): SectionMap {
  const sections: Record<string, string[]> = {};
  let current: string | null = null;

  for (const line of lines) {
    const marker = line.match(/^\*\*(지문|문제|보기|정답(?:\(예시\))?|해설)\*\*\s*$/);
    if (marker) {
      current = marker[1];
      sections[current] = [];
      continue;
    }

    if (current) {
      sections[current].push(line);
    }
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, cleanLines(value)]),
  );
}

function parseChoices(source: string) {
  if (!source || /서술형\s*문항/.test(source)) return [];

  const choices: { key: string; text: string }[] = [];
  let current: { key: string; text: string } | null = null;

  for (const line of source.split("\n")) {
    const match = line.match(/^\s*(\d+)\.\s*(.*)$/);
    if (match) {
      if (current) choices.push(current);
      current = { key: match[1], text: match[2].trim() };
      continue;
    }

    if (current && line.trim()) {
      current.text = `${current.text}\n${line.trim()}`;
    }
  }

  if (current) choices.push(current);
  return choices;
}

function imageFromStimulus(stimulus: string, subject: OfficialExerciseSubject, lectureId: number, questionNumber: number) {
  const imageMatch = stimulus.match(/!\[([^\]]*)\]\((img\/[^)]+)\)/);
  if (!imageMatch) {
    return { image: undefined, stimulus: stimulus.trim() };
  }

  const imageFile = path.basename(imageMatch[2]);
  const cleanedStimulus = stimulus
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/^스크린샷 참고\.$/, "스크린샷 참고.")
    .trim();

  return {
    image: {
      src: `/official-exercises/img/${imageFile}`,
      alt: imageMatch[1] || `${subject} ${lectureId}강 Q${questionNumber} 스크린샷`,
    },
    stimulus: cleanedStimulus,
  };
}

export function parseOfficialExercises(markdown: string): OfficialExerciseQuestion[] {
  const lines = markdown.split(/\r?\n/);
  const questions: OfficialExerciseQuestion[] = [];
  let subject: OfficialExerciseSubject | null = null;
  let lecture: { id: number; title: string } | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const subjectMatch = lines[index].match(/^##\s+(.+)$/);
    if (subjectMatch) {
      const nextSubject = subjectMatch[1].trim() as OfficialExerciseSubject;
      subject = subjectSlugByName.has(nextSubject) ? nextSubject : null;
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

    const questionNumber = Number(questionMatch[1]);
    const sections = parseSections(lines.slice(start, end));
    const rawAnswer = sections["정답"] ?? sections["정답(예시)"] ?? "";
    const choices = parseChoices(sections["보기"] ?? "");
    const answerChoice = rawAnswer.match(/^([1-4])\.\s*/);
    const parsedImage = imageFromStimulus(
      sections["지문"] ?? "",
      subject,
      lecture.id,
      questionNumber,
    );

    questions.push({
      id: `${subjectSlugByName.get(subject)}-${lecture.id}-${questionNumber}`,
      subject,
      subjectSlug: subjectSlugByName.get(subject) ?? "course",
      lectureId: lecture.id,
      lectureTitle: lecture.title,
      questionNumber,
      kind: choices.length > 0 ? "multiple" : "written",
      stimulus: parsedImage.stimulus,
      prompt: sections["문제"] ?? "",
      choices,
      answer: rawAnswer,
      correctChoice: answerChoice?.[1],
      explanation: sections["해설"] ?? "",
      image: parsedImage.image,
    });
  }

  return questions;
}

export function getOfficialExerciseData() {
  const markdownPath = path.join(
    process.cwd(),
    "..",
    "26-1",
    "연습문제_6과목_정리",
    "2026-1학기_6과목_연습문제_정답.md",
  );
  const markdown = fs.readFileSync(markdownPath, "utf8");
  const questions = parseOfficialExercises(markdown);
  const activeSubjects = new Set(questions.map((question) => question.subject)).size;

  const stats: OfficialExerciseStats = {
    totalQuestions: questions.length,
    imageQuestions: questions.filter((question) => question.image).length,
    writtenQuestions: questions.filter((question) => question.kind === "written").length,
    multipleChoiceQuestions: questions.filter((question) => question.kind === "multiple").length,
    activeSubjects,
  };

  return {
    subjects: officialExerciseSubjects,
    questions,
    stats,
  };
}
