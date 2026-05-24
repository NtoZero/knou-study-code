import { ReactNode } from 'react';

interface MainLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export function MainLayout({ left, right }: MainLayoutProps) {
  return (
    <div className="flex flex-1 overflow-hidden bg-[#06111f] text-slate-100">
      <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.16),transparent_32%),linear-gradient(135deg,#06111f_0%,#092039_55%,#071423_100%)] p-4 space-y-4">
        {left}
      </div>
      <div className="w-80 border-l border-cyan-300/25 bg-[#07111f] overflow-y-auto p-3 space-y-4 flex-shrink-0 shadow-[-18px_0_45px_rgba(8,145,178,0.12)]">
        {right}
      </div>
    </div>
  );
}
