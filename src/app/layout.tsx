'use client';

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

// Adsense 전용 컴포넌트
function Adsense() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      console.error('Adsense push error:', e);
    }
  }, [pathname]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-2152944666199864"
      data-ad-slot="1234567890" // 실제 슬롯 ID로 교체
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}

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
        <Adsense /> {/* 광고 렌더링 */}
        {children}
        <Footer />
      </body>
    </html>
  );
}

// ISR 제거 → Netlify 빌드 호환
// export const revalidate = 60;
