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
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      console.error('Adsense push error:', e);
    }
  }, [pathname]);

  // 광고 영역 표시용 <ins> 제거 → 빈 영역 없음
  return null;
}
