import Link from "next/link";
import {
  Brain,
  Code2,
  BookOpen,
  Layers,
  Radio,
  Shield,
  ArrowRight,
} from "lucide-react";

const subjects = [
  {
    href: "/network",
    title: "정보통신망",
    subtitle: "1~15강 인터랙티브 학습",
    Icon: Radio,
    iconClass: "text-blue-500",
  },
  {
    href: "/ai",
    title: "인공지능",
    subtitle: "1~15강 인터랙티브 학습",
    Icon: Brain,
    iconClass: "text-indigo-500",
  },
  {
    href: "/algorithm",
    title: "알고리즘",
    subtitle: "1~15강 알고리즘 학습",
    Icon: Code2,
    iconClass: "text-emerald-500",
  },
  {
    href: "/security",
    title: "컴퓨터보안",
    subtitle: "1~15강 인터랙티브 학습",
    Icon: Shield,
    iconClass: "text-purple-600",
  },
  {
    href: "/software",
    title: "소프트웨어공학",
    subtitle: "1~15강 인터랙티브 학습",
    Icon: Layers,
    iconClass: "text-emerald-600",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold mb-2">
        KNOU 인터랙티브 학습
      </h1>
      <p className="text-center text-gray-500 mb-12">
        과목별 학습 자료
      </p>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold">과목별 분류</h2>
            <p className="text-xs text-gray-500">과목을 선택해 학습 페이지로 이동</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map(({ href, title, subtitle, Icon, iconClass }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Icon size={36} className={`${iconClass} mb-4`} />
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                열기
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
