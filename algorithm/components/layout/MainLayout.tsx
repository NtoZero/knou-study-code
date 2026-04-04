import { ReactNode } from 'react';

interface MainLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export function MainLayout({ left, right }: MainLayoutProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {left}
      </div>
      <div className="w-80 border-l border-slate-700/50 overflow-y-auto p-3 space-y-3 flex-shrink-0">
        {right}
      </div>
    </div>
  );
}
