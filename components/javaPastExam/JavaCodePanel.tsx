import { Code2 } from "lucide-react";

type Props = {
  title: string;
  code: string;
};

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
              <span className="min-w-0 whitespace-pre px-4 font-mono">{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
