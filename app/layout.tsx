import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "KNOU 인터랙티브 학습",
  description: "KNOU 과목별 인터랙티브 시각화 학습 사이트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
