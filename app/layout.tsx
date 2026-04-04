import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      <body className={notoSansKR.className}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
