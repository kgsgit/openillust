// 파일 경로: src/components/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col gap-6 md:flex-row md:justify-between">
        {/* 링크 모음 */}
        <nav className="flex flex-wrap gap-4">
          <Link href="/info/about" className="hover:underline">
            About
          </Link>
          <Link href="/info/policy" className="hover:underline">
            Privacy&nbsp;Policy
          </Link>
          <Link href="/info/terms" className="hover:underline">
            Terms&nbsp;of&nbsp;Service
          </Link>
          <Link href="/info/contact" className="hover:underline">
            Contact
          </Link>
        </nav>

        {/* 저작권·고지 */}
        <div className="text-gray-500">
          © {new Date().getFullYear()} Openillust. All rights reserved.
        </div>

        {/* 보안·라이선스·호스팅 배지 */}
        <div className="flex flex-wrap items-center gap-4">
          {/* 1. HTTPS Secure */}
          <div className="flex items-center gap-1">
            <span role="img" aria-label="secure">🔒</span>
            <span>HTTPS Secure</span>
          </div>

          {/* 2. CC BY 4.0 (외부 URL) */}
          <div className="flex items-center gap-1">
            <img
              src="https://licensebuttons.net/l/by/4.0/88x31.png"
              alt="CC BY 4.0"
              className="h-4 inline"
            />
            <Link
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              CC BY 4.0
            </Link>
          </div>

          {/* 4. Netlify 배지 (외부 URL) */}
          <div className="flex items-center gap-1">
            <img
              src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
              alt="Netlify"
              className="h-4 inline"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
