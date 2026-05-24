import { ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-[#04101d] border-b border-cyan-300/25 px-4 py-2.5 flex items-center gap-4 shadow-[0_10px_30px_rgba(6,182,212,0.12)]">
      <h1 className="rounded-lg bg-cyan-300 px-3 py-1.5 text-sm font-black tracking-tight text-slate-950 shrink-0">
        알고리즘 인터랙티브
      </h1>
      {children}
    </header>
  );
}
