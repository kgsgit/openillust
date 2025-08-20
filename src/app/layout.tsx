// 파일 경로: src/app/layout.tsx

import '@/styles/globals.css';
import '@/styles/modal.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Images at Your Fingertips, Curated for Purpose.</title>
        <link rel="canonical" href="https://openillust.com/" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* AdSense 자동광고 글로벌 스크립트 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2152944666199864"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// ISR 재검증 주기 설정 (초 단위)
export const revalidate = 60;