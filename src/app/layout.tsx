import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DoxHayx 쇼핑맰 | 건강기능식품 공식 스토어',
  description: 'DoxHayx 공식 쇼핑맰 - 유튜브 콘텐츠에서 소개된 건강기능식품 직접 구매',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
