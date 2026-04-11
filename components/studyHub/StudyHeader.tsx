import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  subject: string;
  type: string;
  title: string;
  description: string;
  accent: {
    gradient: string; // e.g., from-orange-500 to-pink-500
    bgLight: string; // e.g., bg-orange-50 dark:bg-orange-950/40
    border: string; // e.g., border-orange-500
    text: string; // e.g., text-orange-600
  };
  objectives: string[];
}

export default function StudyHeader({
  icon: Icon,
  subject,
  type,
  title,
  description,
  accent,
  objectives,
}: Props) {
  return (
    <div
      className={`mb-10 overflow-hidden rounded-2xl border-l-4 ${accent.border} ${accent.bgLight} p-6`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent.gradient} text-white shadow-md`}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <div className={`text-xs font-semibold uppercase tracking-wider ${accent.text}`}>
            {subject} · {type}
          </div>
          <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-white/60 p-4 dark:bg-gray-900/60">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          학습 목표
        </div>
        <ul className="grid gap-1.5 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
          {objectives.map((obj) => (
            <li key={obj} className="flex items-start gap-2">
              <span className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${accent.text.replace("text", "bg")}`} />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
