// 파일 경로: src/app/layout.tsx

import '@/styles/globals.css';
import '@/styles/modal.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
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

// ISR 재검증 주기 설정 (초 단위)
export const revalidate = 60;
