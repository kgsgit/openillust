// src/app/layout.tsx
'use client';

import { useEffect } from 'react';
import '@/styles/globals.css';
import '@/styles/modal.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', disableContextMenu);
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>손에 잡히는 이미지, 쓰임을 생각한 큐레이션.</title>
        <meta
          name="description"
          content="Openillust는 단순히 이미지가 많은 곳이 아닙니다. 불필요한 반복 없이, 실제로 쓸 수 있는 그림만을 선별해 담았습니다. 모든 일러스트는 정제된 기준에 따라 고르고 다듬었습니다. 당신의 창의력과 감성을 방해하지 않는 조용한 도구가 되겠습니다. 복잡한 조건 없이, 원하는 이미지를 바로 사용할 수 있습니다."
        />
        <meta property="og:title" content="손에 잡히는 이미지, 쓰임을 생각한 큐레이션." />
        <meta
          property="og:description"
          content="Openillust는 단순히 이미지가 많은 곳이 아닙니다. 불필요한 반복 없이, 실제로 쓸 수 있는 그림만을 선별해 담았습니다. 모든 일러스트는 정제된 기준에 따라 고르고 다듬었습니다. 당신의 창의력과 감성을 방해하지 않는 조용한 도구가 되겠습니다. 복잡한 조건 없이, 원하는 이미지를 바로 사용할 수 있습니다."
        />
        <meta property="og:url" content="https://openillust.netlify.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://openillust.netlify.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://openillust.netlify.app" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
