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
    bg: "bg-cyan-950/80 dark:bg-cyan-950/80",
    border: "border-l-cyan-400",
    lineNum: "text-cyan-400 dark:text-cyan-400",
  },
  teal: {
    bg: "bg-teal-950/80 dark:bg-teal-950/80",
    border: "border-l-teal-400",
    lineNum: "text-teal-400 dark:text-teal-400",
  },
  fuchsia: {
    bg: "bg-fuchsia-950/80 dark:bg-fuchsia-950/80",
    border: "border-l-fuchsia-400",
    lineNum: "text-fuchsia-400 dark:text-fuchsia-400",
  },
};

export default function PseudocodeViewer({
  lines,
  highlightedLines,
  accentColor = "cyan",
}: Props) {
  const accent = accentStyles[accentColor];

  return (
    <div className="overflow-x-auto rounded-lg bg-gray-900 p-3 font-mono text-sm leading-relaxed dark:bg-gray-950">
      {lines.map((line, i) => {
        const isActive = highlightedLines.includes(i);
        return (
          <div
            key={i}
            className={`flex border-l-3 rounded-r px-2 py-0.5 transition-colors duration-200 ${
              isActive
                ? `${accent.bg} ${accent.border} font-medium`
                : "border-l-transparent"
            }`}
          >
            <span
              className={`mr-3 inline-block w-5 shrink-0 select-none text-right ${
                isActive
                  ? accent.lineNum
                  : "text-gray-500 dark:text-gray-500"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={
                isActive
                  ? "text-white"
                  : "text-gray-300 dark:text-gray-300"
              }
            >
              {line.text}
            </span>
            {line.comment && (
              <span className="ml-2 text-gray-400 dark:text-gray-400 italic">
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
