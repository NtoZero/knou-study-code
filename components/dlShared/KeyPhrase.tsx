import type { ReactNode } from "react";

export default function KeyPhrase({ children }: { children: ReactNode }) {
  return (
    <strong className="box-decoration-clone rounded-sm border-b-2 border-amber-600 bg-amber-200 px-0.5 font-extrabold text-slate-950 dark:border-amber-500 dark:bg-amber-300 dark:text-slate-950">
      {children}
    </strong>
  );
}

export function MarkedText({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? <KeyPhrase key={index}>{part}</KeyPhrase> : part
  );
}
