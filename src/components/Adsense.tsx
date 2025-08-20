'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// TypeScript용 adsbygoogle 타입 선언
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function Adsense() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('Adsense push error:', e);
    }
  }, [pathname]);

  // 자동광고만 쓸 거라서 수동 광고 <ins> 태그 제거
  return null;
}
