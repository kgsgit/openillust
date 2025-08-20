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

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-2152944666199864"
      data-ad-slot="1234567890"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
