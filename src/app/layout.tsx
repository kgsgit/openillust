// 파일 경로: src/app/layout.tsx
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
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
