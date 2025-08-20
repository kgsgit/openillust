import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Adsense from '@/components/Adsense';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your Site Title',
  description: 'Your site description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Adsense 스크립트 (자동광고용) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2152944666199864"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
        {/* 경로 변경 감지용 컴포넌트 */}
        <Adsense />
      </body>
    </html>
  );
}


// ISR 재검증 주기 설정 (초 단위)
export const revalidate = 60;
