import { Code2 } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  code: string;
};

type TokenKind = "plain" | "keyword" | "type" | "method" | "string" | "comment" | "number" | "literal" | "operator";

const javaKeywords = new Set([
  "abstract",
  "break",
  "case",
  "catch",
  "class",
  "continue",
  "default",
  "do",
  "else",
  "extends",
  "final",
  "finally",
  "for",
  "if",
  "implements",
  "import",
  "interface",
  "new",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "try",
  "void",
  "while",
]);

const primitiveTypes = new Set(["boolean", "byte", "char", "double", "float", "int", "long", "short"]);
const literalWords = new Set(["false", "null", "true"]);
const commonJavaTypes = new Set([
  "ActionEvent",
  "ActionListener",
  "ArrayList",
  "Button",
  "ByteBuffer",
  "CSuper",
  "Charset",
  "Connection",
  "Counter",
  "Developer",
  "DriverManager",
  "Employee",
  "Exception",
  "FileChannel",
  "FileInputStream",
  "FileOutputStream",
  "FileReader",
  "FileWriter",
  "Frame",
  "Graphics",
  "IOException",
  "List",
  "MyFrame",
  "MyListener",
  "MyThread",
  "MyThread1",
  "Path",
  "PreparedStatement",
  "ResultSet",
  "Runnable",
  "Salesman",
  "Statement",
  "String",
  "System",
  "Thread",
  "WindowAdapter",
  "WindowEvent",
]);

const tokenClasses: Record<TokenKind, string> = {
  plain: "text-gray-100",
  keyword: "font-semibold text-sky-300",
  type: "text-amber-200",
  method: "text-yellow-200",
  string: "text-emerald-300",
  comment: "italic text-gray-500",
  number: "text-orange-300",
  literal: "text-purple-300",
  operator: "text-gray-300",
};

function isIdentifierStart(char: string) {
  return /[A-Za-z_$]/.test(char);
}

function isIdentifierPart(char: string) {
  return /[A-Za-z0-9_$]/.test(char);
}

function isOperator(char: string) {
  return /[{}()[\];,.=+\-*/<>!?:]/.test(char);
}

function scanQuoted(line: string, start: number) {
  const quote = line[start];
  let index = start + 1;
  let escaped = false;

  while (index < line.length) {
    const char = line[index];
    if (escaped) {
      escaped = false;
    } else if (char === "\\") {
      escaped = true;
    } else if (char === quote) {
      index += 1;
      break;
    }
    index += 1;
  }

  return index;
}

function scanNumber(line: string, start: number) {
  let index = start;
  while (index < line.length && /[0-9A-Fa-f_xXbBlLfFdD.]/.test(line[index])) index += 1;
  return index;
}

function tokenKindForWord(line: string, word: string, end: number): TokenKind {
  if (javaKeywords.has(word) || primitiveTypes.has(word)) return "keyword";
  if (literalWords.has(word)) return "literal";
  if (commonJavaTypes.has(word)) return "type";

  let cursor = end;
  while (cursor < line.length && /\s/.test(line[cursor])) cursor += 1;
  if (line[cursor] === "(") return "method";

  return "plain";
}

function renderJavaLine(line: string, lineIndex: number): ReactNode[] {
  const parts: ReactNode[] = [];
  let index = 0;

  const push = (text: string, kind: TokenKind) => {
    parts.push(
      <span key={`${lineIndex}-${parts.length}`} className={tokenClasses[kind]}>
        {text}
      </span>,
    );
  };

  while (index < line.length) {
    if (line.startsWith("//", index)) {
      push(line.slice(index), "comment");
      break;
    }

    if (line.startsWith("/*", index)) {
      const end = line.indexOf("*/", index + 2);
      const next = end === -1 ? line.length : end + 2;
      push(line.slice(index, next), "comment");
      index = next;
      continue;
    }

    const char = line[index];

    if (char === '"' || char === "'") {
      const next = scanQuoted(line, index);
      push(line.slice(index, next), "string");
      index = next;
      continue;
    }

    if (/[0-9]/.test(char)) {
      const next = scanNumber(line, index);
      push(line.slice(index, next), "number");
      index = next;
      continue;
    }

    if (isIdentifierStart(char)) {
      let next = index + 1;
      while (next < line.length && isIdentifierPart(line[next])) next += 1;
      const word = line.slice(index, next);
      push(word, tokenKindForWord(line, word, next));
      index = next;
      continue;
    }

    if (isOperator(char)) {
      push(char, "operator");
      index += 1;
      continue;
    }

    push(char, "plain");
    index += 1;
  }

  return parts.length > 0 ? parts : [" "];
}

export default function JavaCodePanel({ title, code }: Props) {
  const lines = code.split("\n");

  return (
    <figure className="overflow-hidden rounded-lg border border-gray-800 bg-[#1e1e1e] shadow-sm">
      <figcaption className="flex items-center gap-2 border-b border-gray-700 bg-[#252526] px-3 py-2 text-xs font-semibold text-gray-200">
        <Code2 size={14} className="text-amber-300" />
        {title}
      </figcaption>
      <pre className="max-h-96 overflow-auto p-0 text-[13px] leading-6 text-gray-100">
        <code className="block py-3">
          {lines.map((line, index) => (
            <span key={`${title}-${index}`} className="grid grid-cols-[3rem_1fr]">
              <span className="select-none border-r border-gray-700 pr-3 text-right text-gray-500">
                {index + 1}
              </span>
              <span className="min-w-0 whitespace-pre px-4 font-mono">{renderJavaLine(line, index)}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
