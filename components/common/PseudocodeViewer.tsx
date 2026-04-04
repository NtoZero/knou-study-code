"use client";

interface CodeLine {
  text: string;
  comment?: string;
}

interface Props {
  lines: CodeLine[];
  highlightedLines: number[];
  accentColor?: "cyan" | "teal" | "fuchsia";
}

const accentStyles = {
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    border: "border-l-cyan-500",
    lineNum: "text-cyan-600 dark:text-cyan-400",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    border: "border-l-teal-500",
    lineNum: "text-teal-600 dark:text-teal-400",
  },
  fuchsia: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    border: "border-l-fuchsia-500",
    lineNum: "text-fuchsia-600 dark:text-fuchsia-400",
  },
};

export default function PseudocodeViewer({
  lines,
  highlightedLines,
  accentColor = "cyan",
}: Props) {
  const accent = accentStyles[accentColor];

  return (
    <div className="overflow-x-auto rounded-lg bg-gray-900 p-3 font-mono text-xs leading-relaxed dark:bg-gray-950">
      {lines.map((line, i) => {
        const isActive = highlightedLines.includes(i);
        return (
          <div
            key={i}
            className={`flex border-l-2 px-2 py-0.5 transition-colors duration-200 ${
              isActive
                ? `${accent.bg} ${accent.border}`
                : "border-l-transparent"
            }`}
          >
            <span
              className={`mr-3 inline-block w-5 shrink-0 text-right ${
                isActive
                  ? accent.lineNum
                  : "text-gray-600 dark:text-gray-700"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={
                isActive
                  ? "text-gray-100"
                  : "text-gray-500 dark:text-gray-600"
              }
            >
              {line.text}
            </span>
            {line.comment && (
              <span className="ml-2 text-gray-500 dark:text-gray-600">
                {"// "}
                {line.comment}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
