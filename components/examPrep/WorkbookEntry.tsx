const workbooks = {
  ml: { title: "머신러닝", scope: "기말 1~15강", official: 77, workbook: 20 },
  dl: { title: "딥러닝", scope: "기말 4~15강 · 기초 복습 1~3강", official: 72, workbook: 10 },
} as const;

type Course = keyof typeof workbooks;

export default function WorkbookEntry({ course, onCoursePage = false }: { course: Course; onCoursePage?: boolean }) {
  const info = workbooks[course];
  const url = `/exam-prep/workbook.html#${course}`;
  const Heading = onCoursePage ? "h2" : "h3";
  const linkClass = "inline-flex min-h-10 items-center underline decoration-gray-300 underline-offset-4 hover:decoration-current";
  return (
    <article className="min-w-0 border-t-2 border-teal-800 py-4 dark:border-teal-400">
      <Heading className="text-xl font-bold">{onCoursePage ? "기말 학습노트와 문제집" : info.title}</Heading>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{info.scope}</p>
      <p className="mt-3 text-sm">공식 연습문제 {info.official}문항 · 워크북 연계 {info.workbook}문항</p>
      <nav aria-label={`${info.title} 학습 방식`} className="mt-2 flex flex-wrap items-center gap-x-5 text-sm">
        <a className={`${linkClass} font-bold text-teal-800 dark:text-teal-300`} href={`${url}/notes/read`}>개념 이어 읽기</a>
        <a className={linkClass} href={`${url}/notes`}>강의별 노트</a>
        <a className={linkClass} href={`${url}/book/order`}>문제 풀기</a>
      </nav>
    </article>
  );
}
