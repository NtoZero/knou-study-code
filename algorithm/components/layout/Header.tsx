import { ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-slate-900/80 border-b border-slate-700/50 px-4 py-2 flex items-center gap-4">
      <h1 className="text-sm font-bold text-slate-100 shrink-0">정렬 알고리즘 시각화</h1>
      {children}
    </header>
  );
}
