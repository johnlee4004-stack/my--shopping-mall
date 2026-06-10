import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dox-Hayx 집수리 전문 | 인천 전 지역 30분 내 출동",
  description: "인천 집수리 고민, 사진 한 장으로 해결하세요. 누수·전기·설비·도배·인테리어 — 숙련 전문가가 1시간 내 연락, 30분 내 출동. 1년 무상 AS 보증.",
  keywords: ["인천 집수리", "인천 누수 수리", "인천 전기 수리", "부평구 집수리", "연수구 집수리", "남동구 집수리", "인천 배관 수리", "인천 도배", "인천 당일 출동"],
  openGraph: {
    title: "Dox-Hayx 집수리 전문",
    description: "인천 전 지역 집수리 전문. 30분 내 출동, 1년 무상 AS.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
