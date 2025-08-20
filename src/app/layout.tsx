// 파일 경로: src/app/layout.tsx

import '@/styles/globals.css';
import '@/styles/modal.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// TypeScript용 adsbygoogle 타입 선언
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // SPA 페이지 전환 시 광고 재호출
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      console.error('Adsense push error:', e);
    }
  }, [pathname]);

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
